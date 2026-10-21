import { W, H, LANES, SLOTS, TYPES, buildingStats } from "./engine.js?v=5";
const load = (src) => {
  const i = new Image();
  i.src = src;
  return i;
};
export class Renderer {
  constructor(canvas) {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.firstView = true;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.buildings = load("assets/buildings.webp");
    this.buildingRects = null;
    this.castleHits = [];
    this.buildingHits = [];
    this.slotHits = [];
    this.minimap = document.querySelector("#minimap");
    this.upgrades = [
      load("assets/human-upgrades.webp"),
      load("assets/orc-upgrades.webp"),
    ];
    fetch("assets/upgrade-manifest.json")
      .then((r) => r.json())
      .then((m) => (this.upgradeRects = m.sides))
      .catch(() => {});
    this.sceneryImage = load("assets/scenery.webp");
    fetch("assets/scenery-manifest.json")
      .then((r) => r.json())
      .then((m) => (this.sceneryRects = m))
      .catch(() => {});
    fetch("assets/building-manifest.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => (this.buildingRects = m?.rows || m))
      .catch(() => {});
    this.sheets = {};
    fetch("assets/unit-manifest.json?v=5")
      .then((r) => (r.ok ? r.json() : {}))
      .then((m) => {
        for (const [k, v] of Object.entries(m))
          this.sheets[k] = { ...v, img: load(v.src) };
      })
      .catch(() => {});
    this.bg = document.createElement("canvas");
    this.bg.width = W;
    this.bg.height = H;
    this.localSide = 0;
    this.factions = ["human", "orc"];
    this.terrain();
  }
  terrain() {
    const c = this.bg.getContext("2d");
    let n = 736;
    const rand = () =>
      (n = (Math.imul(n, 1664525) + 1013904223) >>> 0) / 4294967296;
    c.fillStyle = "#425c32";
    c.fillRect(0, 0, W, H);
    for (let i = 0; i < 460; i++) {
      const x = rand() * W,
        y = rand() * H,
        r = 60 + rand() * 140;
      c.fillStyle = ["#48603a", "#506b3d", "#364f31", "#5b6e3b", "#52623b"][
        i % 5
      ];
      c.beginPath();
      for (let j = 0; j < 12; j++) {
        const a = (j / 12) * Math.PI * 2,
          rad = r * (0.65 + rand() * 0.35);
        const px = x + Math.cos(a) * rad,
          py = y + Math.sin(a) * rad * 0.65;
        if (!j) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fill();
    }
    for (let i = 0; i < 180000; i++) {
      c.fillStyle = ["#4a6537", "#3b562f", "#4c6639", "#486134", "#3e592e"][
        i % 5
      ];
      c.fillRect(
        Math.floor((rand() * W) / 3) * 3,
        Math.floor((rand() * H) / 3) * 3,
        3 + rand() * 5,
        2 + rand() * 4,
      );
    }
    for (const y of LANES) {
      c.fillStyle = "#53613b";
      c.fillRect(0, y - 30, W, 60);
      c.fillStyle = "#8a8150";
      c.fillRect(0, y - 19, W, 38);
      for (let i = 0; i < 1100; i++) {
        c.fillStyle = i % 2 ? "#9b8d5e" : "#7c7548";
        c.fillRect(rand() * W, y - 17 + rand() * 34, rand() * 9 + 2, 2);
      }
    }
    // Roads meet at the visible castle courtyard, matching unit routing.
    for (const lane of LANES)
      for (const side of [0, 1]) {
        const x = side ? W - 100 : 100,
          merge = side ? W - 450 : 450;
        c.lineJoin = "round";
        c.lineCap = "round";
        for (const [color, width] of [
          ["#52613b", 62],
          ["#8a8150", 38],
        ]) {
          c.strokeStyle = color;
          c.lineWidth = width;
          c.beginPath();
          c.moveTo(merge, lane);
          c.lineTo(x, H / 2);
          c.stroke();
        }
      }
    for (const x of [100, W - 100]) {
      c.fillStyle = "#7e8058";
      c.beginPath();
      c.ellipse(x, H / 2, 92, 112, 0, 0, Math.PI * 2);
      c.fill();
      for (let i = 0; i < 130; i++) {
        const dx = (rand() - 0.5) * 150,
          dy = (rand() - 0.5) * 180;
        c.fillStyle = i % 2 ? "#939371" : "#6b7757";
        c.fillRect(x + dx, H / 2 + dy, 7 + rand() * 8, 4);
      }
    }
    c.fillStyle = "#263e37";
    c.beginPath();
    c.moveTo(W / 2 - 42, 0);
    c.bezierCurveTo(W / 2 - 65, H * 0.28, W / 2 + 2, H * 0.56, W / 2 - 38, H);
    c.lineTo(W / 2 + 44, H);
    c.bezierCurveTo(W / 2 + 65, H * 0.56, W / 2 - 5, H * 0.28, W / 2 + 42, 0);
    c.fill();
    c.fillStyle = "#416965";
    c.beginPath();
    c.moveTo(W / 2 - 29, 0);
    c.bezierCurveTo(W / 2 - 50, H * 0.28, W / 2 + 16, H * 0.56, W / 2 - 24, H);
    c.lineTo(W / 2 + 30, H);
    c.bezierCurveTo(W / 2 + 50, H * 0.56, W / 2 - 16, H * 0.28, W / 2 + 28, 0);
    c.fill();
    for (const y of LANES) {
      c.fillStyle = "#313d2c";
      c.fillRect(W / 2 - 60, y - 30, 115, 66);
      c.fillStyle = "#9b9876";
      c.fillRect(W / 2 - 57, y - 27, 109, 54);
      for (let x = W / 2 - 55; x < W / 2 + 50; x += 13) {
        c.fillStyle = "#686e54";
        c.fillRect(x, y - 26, 2, 52);
        c.fillStyle = "#b1a88a";
        c.fillRect(x + 2, y - 25, 10, 3);
      }
      c.fillStyle = "#c5b690";
      c.fillRect(W / 2 - 60, y - 30, 115, 5);
      c.fillRect(W / 2 - 60, y + 25, 115, 5);
    }
    this.scenery = [];
    const occupied = new Set();
    for (let cluster = 0; cluster < 85; cluster++) {
      const cx = rand() * W,
        cy = rand() * H;
      for (let j = 0; j < 28; j++) {
        const x = cx + (rand() - 0.5) * 420,
          y = cy + (rand() - 0.5) * 350,
          key = `${Math.floor(x / 35)},${Math.floor(y / 35)}`;
        if (
          x < 50 ||
          x > W - 50 ||
          y < 65 ||
          y > H - 35 ||
          Math.abs(x - W / 2) < 95 ||
          LANES.some((l) => Math.abs(y - l) < 115) ||
          ((x < 540 || x > W - 540) &&
            y > LANES[0] - 110 &&
            y < LANES[2] + 110) ||
          occupied.has(key)
        )
          continue;
        occupied.add(key);
        const kind =
            rand() < 0.72 ? Math.floor(rand() * 3) : 3 + Math.floor(rand() * 3),
          height = kind < 3 ? 70 + rand() * 65 : 25 + rand() * 40;
        this.scenery.push({ x, y, kind, height });
      }
    }
  }
  sizing() {
    const rect = this.canvas.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio || 1, 2);
    if (
      this.canvas.width !== Math.round(rect.width * dpr) ||
      this.canvas.height !== Math.round(rect.height * dpr)
    ) {
      this.canvas.width = Math.round(rect.width * dpr);
      this.canvas.height = Math.round(rect.height * dpr);
    }
    this.portrait = matchMedia("(max-width:700px)").matches;
    this.viewW = rect.width;
    this.viewH = rect.height;
    const worldW = this.portrait ? H : W,
      worldH = this.portrait ? W : H;
    this.fit = Math.min(rect.width / worldW, rect.height / worldH);
    if (this.firstView) {
      this.zoom = Math.max(1, (this.portrait ? 0.7 : 1) / this.fit);
      const scale = this.fit * this.zoom;
      this.panX =
        -(this.portrait ? H / 2 - worldW / 2 : 450 - worldW / 2) * scale;
      this.panY =
        -(this.portrait ? W - 450 - worldH / 2 : H / 2 - worldH / 2) * scale;
      this.firstView = false;
    }
    this.scale = this.fit * this.zoom;
    const maxX = Math.max(0, (worldW * this.scale - rect.width) / 2),
      maxY =
        Math.max(0, (worldH * this.scale - rect.height) / 2) +
        (this.portrait && this.zoom > 1 ? 190 : 0);
    this.panX = Math.max(-maxX, Math.min(maxX, this.panX));
    this.panY = Math.max(-maxY, Math.min(maxY, this.panY));
    this.ox = (rect.width - worldW * this.scale) / 2 + this.panX;
    this.oy = (rect.height - worldH * this.scale) / 2 + this.panY;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.ctx.imageSmoothingEnabled = false;
    return rect;
  }
  zoomAt(value, x = this.viewW / 2, y = this.viewH / 2) {
    const old = this.zoom,
      next = Math.max(1, Math.min(16, value));
    this.panX =
      (this.panX + this.viewW / 2 - x) * (next / old) - this.viewW / 2 + x;
    this.panY =
      (this.panY + this.viewH / 2 - y) * (next / old) - this.viewH / 2 + y;
    this.zoom = next;
    this.sizing();
  }
  pan(dx, dy) {
    this.panX += dx;
    this.panY += dy;
    this.sizing();
  }
  overview() {
    this.zoom = 1;
    this.panX = 0;
    this.panY = 0;
    this.firstView = false;
    this.sizing();
  }
  focusWorld(x, y, close = false) {
    if (close) this.zoom = Math.max(1, (this.portrait ? 0.7 : 1) / this.fit);
    const scale = this.fit * this.zoom,
      ww = this.portrait ? H : W,
      wh = this.portrait ? W : H;
    this.panX = -((this.portrait ? y : x) - ww / 2) * scale;
    this.panY = -((this.portrait ? W - x : y) - wh / 2) * scale;
    if (this.portrait && close) this.panY += this.localSide === 1 ? 80 : -110;
    this.sizing();
  }
  drawMinimap(s) {
    const m = this.minimap;
    if (!m) return;
    const mw = this.portrait ? 104 : 156,
      mh = this.portrait ? 156 : 104;
    if (m.width !== mw) {
      m.width = mw;
      m.height = mh;
    }
    const c = m.getContext("2d"),
      ww = this.portrait ? H : W,
      wh = this.portrait ? W : H,
      k = mw / ww;
    c.save();
    c.scale(k, k);
    if (this.portrait) {
      c.translate(0, W);
      c.rotate(-Math.PI / 2);
    }
    c.drawImage(this.bg, 0, 0);
    c.restore();
    const point = (x, y) =>
      this.portrait ? { x: y * k, y: (W - x) * k } : { x: x * k, y: y * k };
    c.fillStyle = "#233e24";
    for (const tree of this.scenery) {
      if (tree.kind > 2) continue;
      const p = point(tree.x, tree.y);
      c.fillRect(p.x - 1, p.y - 1, 2, 2);
    }
    for (const e of [...s.units, ...s.buildings, ...s.castles]) {
      const p = point(e.x, e.y),
        size = typeof e.id === "string" ? 6 : e.slot ? 3 : 2;
      c.fillStyle = e.side === 0 ? "#8ed0ff" : "#ff927b";
      c.fillRect(p.x - size / 2, p.y - size / 2, size, size);
    }
    const x = (-this.ox / this.scale) * k,
      y = (-this.oy / this.scale) * k;
    c.strokeStyle = "#ffe6a4";
    c.lineWidth = 1.5;
    c.strokeRect(
      x,
      y,
      (this.viewW / this.scale) * k,
      (this.viewH / this.scale) * k,
    );
  }
  point(x, y) {
    return this.portrait
      ? { x: this.ox + y * this.scale, y: this.oy + (W - x) * this.scale }
      : { x: this.ox + x * this.scale, y: this.oy + y * this.scale };
  }
  world(px, py) {
    return this.portrait
      ? { x: W - (py - this.oy) / this.scale, y: (px - this.ox) / this.scale }
      : { x: (px - this.ox) / this.scale, y: (py - this.oy) / this.scale };
  }
  prepareSheet(sheet) {
    if (sheet.bounds || !sheet.img.complete || !sheet.img.naturalWidth) return;
    const img = sheet.img,
      cols = sheet.cols || 2,
      rows = sheet.rows || 2,
      cw = Math.floor(img.naturalWidth / cols),
      ch = Math.floor(img.naturalHeight / rows),
      canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    sheet.bounds = [];
    sheet.maxSize = 1;
    for (let f = 0; f < (sheet.frames || cols * rows); f++) {
      const ox = (f % cols) * cw,
        oy = Math.floor(f / cols) * ch;
      let minX = cw,
        minY = ch,
        maxX = 0,
        maxY = 0;
      for (let y = 0; y < ch; y++)
        for (let x = 0; x < cw; x++)
          if (data[((oy + y) * canvas.width + ox + x) * 4 + 3] > 30) {
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
          }
      const b =
        maxX >= minX
          ? {
              x: ox + minX,
              y: oy + minY,
              w: maxX - minX + 1,
              h: maxY - minY + 1,
            }
          : { x: ox, y: oy, w: cw, h: ch };
      sheet.bounds.push(b);
      sheet.maxSize = Math.max(sheet.maxSize, b.w, b.h);
    }
  }
  drawUnit(e, s) {
    const c = this.ctx,
      sheet = this.sheets[`${this.factions[e.side]}-${e.kind}`];
    if (!sheet?.img.complete || !sheet.img.naturalWidth) return;
    this.prepareSheet(sheet);
    const frame = e.moving
        ? Math.floor(s.time * 8 + e.id) % sheet.bounds.length
        : 0,
      b = sheet.bounds[frame],
      size = e.kind === "siege" ? 55 : 46,
      ratio = (size * this.scale) / sheet.maxSize,
      p = this.point(e.x, e.y);
    let angle = sheet.headingDown
      ? e.side === 0
        ? -Math.PI / 2
        : Math.PI / 2
      : e.side === 0
        ? 0
        : Math.PI;
    if (this.portrait) angle -= Math.PI / 2;
    c.save();
    c.translate(p.x, p.y);
    c.rotate(angle);
    if (e.attack > 0) c.translate(3 * this.scale, 0);
    c.drawImage(
      sheet.img,
      b.x,
      b.y,
      b.w,
      b.h,
      (-b.w * ratio) / 2,
      (-b.h * ratio) / 2,
      b.w * ratio,
      b.h * ratio,
    );
    c.restore();
  }
  drawBuilding(e) {
    const { image, b } = this.buildingArt(e);
    if (!b || !image.complete) return;
    const c = this.ctx,
      p = this.point(e.x, e.y),
      ratio =
        Math.min(
          (e.isCastle ? 110 : 72) / b.w,
          (e.isCastle ? 150 : this.portrait ? 74 : 100) / b.h,
        ) * this.scale,
      w = b.w * ratio,
      h = b.h * ratio;
    const worldW = this.portrait ? H : W,
      worldH = this.portrait ? W : H;
    const left = e.isCastle
        ? Math.max(
            this.ox,
            Math.min(this.ox + worldW * this.scale - w, p.x - w / 2),
          )
        : p.x - w / 2,
      top = e.isCastle
        ? Math.max(
            this.oy + 2,
            Math.min(this.oy + worldH * this.scale - h, p.y - h / 2),
          )
        : p.y - h + 8 * this.scale;
    c.drawImage(image, b.x, b.y, b.w, b.h, left, top, w, h);
    const flag = Math.max(5, 10 * this.scale);
    c.strokeStyle = "#e3d5ac";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(left + w * 0.75, top + h * 0.45);
    c.lineTo(left + w * 0.75, top + h * 0.45 - flag * 2);
    c.stroke();
    c.fillStyle = e.side === 0 ? "#63bbff" : "#ff806c";
    c.fillRect(left + w * 0.75, top + h * 0.45 - flag * 2, flag, flag * 0.65);
    if (e.isCastle) this.castleHits[e.side] = { x: left, y: top, w, h };
    else
      this.buildingHits.push({ id: e.id, side: e.side, x: left, y: top, w, h });
  }
  buildingArt(e) {
    const idx = e.isCastle ? 0 : TYPES[e.type].icon;
    const upgraded =
      !e.isCastle &&
      e.level > 1 &&
      this.upgradeRects?.[this.factions[e.side] === "orc" ? 1 : 0]?.[
        e.level - 2
      ]?.[idx - 1];
    return upgraded
      ? {
          image: this.upgrades[this.factions[e.side] === "orc" ? 1 : 0],
          b: upgraded,
        }
      : {
          image: this.buildings,
          b: this.buildingRects?.[this.factions[e.side] === "orc" ? 1 : 0]?.[
            idx
          ],
        };
  }
  drawScenery() {
    if (
      !this.sceneryRects ||
      !this.sceneryImage.complete ||
      !this.sceneryImage.naturalWidth
    )
      return;
    const c = this.ctx;
    const visible = this.scenery
      .map((t) => ({ ...t, p: this.point(t.x, t.y) }))
      .filter(
        (t) =>
          t.p.x > -100 &&
          t.p.x < this.viewW + 100 &&
          t.p.y > -100 &&
          t.p.y < this.viewH + 150,
      )
      .sort((a, b) => a.p.y - b.p.y);
    for (const t of visible) {
      const b = this.sceneryRects[t.kind],
        h = t.height * this.scale,
        w = (h * b.w) / b.h;
      c.fillStyle = "#172b1940";
      c.beginPath();
      c.ellipse(
        t.p.x + 8 * this.scale,
        t.p.y,
        w * 0.4,
        9 * this.scale,
        0,
        0,
        Math.PI * 2,
      );
      c.fill();
      c.drawImage(
        this.sceneryImage,
        b.x,
        b.y,
        b.w,
        b.h,
        t.p.x - w / 2,
        t.p.y - h,
        w,
        h,
      );
    }
  }
  slotAt(x, y) {
    return this.slotHits.find(
      (b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h,
    )?.id;
  }
  buildingAt(x, y) {
    return [...this.buildingHits]
      .reverse()
      .find(
        (b) =>
          b.side === this.localSide &&
          x >= b.x &&
          x <= b.x + b.w &&
          y >= b.y &&
          y <= b.y + b.h,
      )?.id;
  }
  castleAt(x, y) {
    return this.castleHits.findIndex(
      (b) => b && x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h,
    );
  }
  bar(x, y, hp, max, width = 42) {
    const p = this.point(x, y),
      c = this.ctx,
      w = width * this.scale;
    c.fillStyle = "#0e1a13";
    c.fillRect(p.x - w / 2, p.y, w, 4);
    c.fillStyle = hp / max < 0.3 ? "#c96e4a" : "#92b85e";
    c.fillRect(p.x - w / 2 + 1, p.y + 1, (w - 2) * Math.max(0, hp / max), 2);
  }
  draw(s, selected, building, hover) {
    this.factions = s.factions || ["human", "orc"];
    const c = this.ctx,
      r = this.sizing();
    this.buildingHits = [];
    this.slotHits = [];
    c.fillStyle = "#17271d";
    c.fillRect(0, 0, r.width, r.height);
    c.save();
    c.translate(this.ox, this.oy);
    c.scale(this.scale, this.scale);
    if (this.portrait) {
      c.translate(0, W);
      c.rotate(-Math.PI / 2);
    }
    c.drawImage(this.bg, 0, 0);
    c.strokeStyle = "#8eb7a440";
    c.lineWidth = 2;
    for (let i = 0; i < 60; i++) {
      const y = (i * 43 + s.time * 12) % H;
      if (LANES.some((l) => Math.abs(y - l) < 35)) continue;
      const x = W / 2 + Math.sin(y * 0.014) * 17;
      c.beginPath();
      c.moveTo(x - 12, y);
      c.lineTo(x + 8, y);
      c.stroke();
    }
    c.restore();
    this.drawScenery();
    for (const slot of SLOTS) {
      if (s.buildings.some((b) => b.slot === slot.id)) continue;
      const p = this.point(slot.x, slot.y),
        size = 48 * this.scale;
      if (slot.side === this.localSide) {
        const tw = Math.max(30, size),
          th = Math.max(26, size * 0.65);
        this.slotHits.push({
          id: slot.id,
          x: p.x - tw / 2,
          y: p.y - th,
          w: tw,
          h: th + 5,
        });
      }
      c.fillStyle = slot.side === this.localSide ? "#263d35aa" : "#422d2422";
      c.strokeStyle =
        slot.side === this.localSide
          ? building
            ? "#93c9da"
            : "#76999877"
          : "#a06a4d30";
      c.lineWidth = 1;
      c.setLineDash([4, 4]);
      c.strokeRect(p.x - size / 2, p.y - size * 0.65, size, size * 0.65);
      c.fillRect(p.x - size / 2, p.y - size * 0.65, size, size * 0.65);
      c.setLineDash([]);
      if (slot.side === this.localSide && building) {
        c.fillStyle = "#bcdbc6";
        c.font = `${Math.max(10, 16 * this.scale)}px Georgia`;
        c.textAlign = "center";
        c.fillText("+", p.x, p.y - size * 0.17);
      }
    }
    const entities = [
      ...s.castles.map((x) => ({ ...x, isCastle: true })),
      ...s.buildings,
      ...s.units,
    ];
    entities.sort((a, b) => this.point(a.x, a.y).y - this.point(b.x, b.y).y);
    for (const e of entities) {
      const p = this.point(e.x, e.y);
      if (e.isCastle || e.slot) {
        const chosen = selected === e.id;
        c.fillStyle = e.side === 0 ? "#192c3b66" : "#50281e66";
        c.beginPath();
        c.ellipse(
          p.x,
          p.y - 3 * this.scale,
          (e.isCastle ? 53 : 35) * this.scale,
          12 * this.scale,
          0,
          0,
          Math.PI * 2,
        );
        c.fill();
        if (chosen) {
          c.strokeStyle = "#f1d584";
          c.lineWidth = 2;
          c.stroke();
        }
        this.drawBuilding(e);
        if (!e.isCastle) {
          c.fillStyle = "#e1cc91";
          c.font = `bold ${Math.max(8, 10 * this.scale)}px Arial`;
          c.textAlign = "center";
          c.fillText("Ⅰ".repeat(e.level), p.x, p.y + 12 * this.scale);
          if (TYPES[e.type].spawn) {
            c.fillStyle = "#bdab6b";
            const progress =
              1 -
              e.spawnLeft /
                (buildingStats(s, e.type).spawn /
                  (1 + 0.18 * (e.level - 1)) /
                  (s.research?.[e.side].includes("logistics") ? 1.2 : 1));
            c.fillRect(
              p.x - 16 * this.scale,
              p.y + 17 * this.scale,
              32 * this.scale * Math.max(0, progress),
              2,
            );
          }
        }
        if (e.hp < e.maxHp)
          this.bar(e.x, e.y - 5, e.hp, e.maxHp, e.isCastle ? 80 : 42);
      } else {
        c.strokeStyle = e.side === 0 ? "#63bbff" : "#ff806c";
        c.lineWidth = Math.max(1, 1.5 * this.scale);
        c.beginPath();
        c.ellipse(
          p.x,
          p.y,
          Math.max(3, 13 * this.scale),
          Math.max(2, 6 * this.scale),
          0,
          0,
          Math.PI * 2,
        );
        c.stroke();
        this.drawUnit(e, s);
        if (e.hp < e.maxHp) this.bar(e.x, e.y + 4, e.hp, e.maxHp, 26);
      }
    }
    for (const p of s.shots) {
      const q = this.point(p.x, p.y);
      c.save();
      c.translate(q.x, q.y);
      if (p.kind === "stone") {
        c.shadowColor = "#e5953d";
        c.shadowBlur = 7;
        c.fillStyle = "#d8b27b";
        c.beginPath();
        c.arc(
          0,
          -Math.sin(Math.min(1, p.life) * Math.PI) * 12 * this.scale,
          4 * this.scale,
          0,
          Math.PI * 2,
        );
        c.fill();
      } else {
        const origin = this.point(p.originX, p.originY);
        c.rotate(Math.atan2(q.y - origin.y, q.x - origin.x));
        c.strokeStyle = "#e7d8a1";
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(-10 * this.scale, 0);
        c.lineTo(3 * this.scale, 0);
        c.stroke();
        c.fillStyle = "#eff0c8";
        c.fillRect(1 * this.scale, -1, 3 * this.scale, 2);
      }
      c.restore();
    }
    for (const e of s.effects) {
      const p = this.point(e.x, e.y);
      c.globalAlpha = Math.max(0, 1 - e.age / (e.type === "ruin" ? 3 : 0.45));
      if (e.type === "ruin") {
        c.fillStyle = "#5d5037";
        for (let i = 0; i < 5; i++)
          c.fillRect(
            p.x + (i - 2) * 7 * this.scale,
            p.y - (i % 2) * 7 * this.scale,
            9 * this.scale,
            6 * this.scale,
          );
      } else {
        c.strokeStyle = e.type === "burst" ? "#cd6a42" : "#f7cf81";
        c.lineWidth = 2;
        const rad = (4 + e.age * 27) * this.scale;
        c.beginPath();
        c.arc(p.x, p.y - 12 * this.scale, rad, 0, Math.PI * 2);
        c.stroke();
      }
      c.globalAlpha = 1;
    }
    this.drawMinimap(s);
  }
}
