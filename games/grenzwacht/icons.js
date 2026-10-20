// Original, high-contrast pictograms: the same image labels actions and prerequisites.
const shapes = {
  research:
    '<path d="M32 15Q20 7 5 13V51Q20 45 32 54Q44 45 59 51V13Q44 7 32 15Z" fill="#ffe8a6" stroke="#b78b47" stroke-width="3"/><path d="M32 15V54M12 23L25 25M12 32L25 34M39 25L52 23M39 34L52 32" fill="none" stroke="#88633c" stroke-width="3"/>',
  archery:
    '<path d="M18 7Q57 32 18 57" fill="none" stroke="#d49b54" stroke-width="6"/><path d="M18 7 30 32 18 57" fill="none" stroke="#fff0c7" stroke-width="2"/><path d="M9 32H57M48 24 57 32 48 40" fill="none" stroke="#e9f3f5" stroke-width="4"/>',
  masonry:
    '<path d="M17 25H47L51 58H13Z" fill="#aabdc8"/><path d="M12 9H22V18H28V9H37V18H43V9H53V28H12Z" fill="#d6e2df"/><path d="M27 58V43Q32 34 37 43V58" fill="#243848"/><path d="M19 32H31M36 32H47M15 42H23M41 42H49" stroke="#687f8d"/>',
  weapons:
    '<path d="M17 45 44 8 57 5 55 19 27 52Z" fill="#d8edf3"/><path d="M22 47 53 10" stroke="#7daac1" stroke-width="2"/><path d="M12 39 33 56" stroke="#ffcd65" stroke-width="7"/><path d="M21 49 10 60" stroke="#bc7845" stroke-width="8"/><path d="M45 40H59M52 33V47" stroke="#a9e777" stroke-width="4"/>',
  armor:
    '<path d="M32 5 55 15V32Q52 49 32 59 12 49 9 32V15Z" fill="#6a9dc4" stroke="#d7e6ec" stroke-width="4"/><path d="M32 11V51" stroke="#afc8d6" stroke-width="3"/><path d="M25 27C17 15 10 32 25 41 40 32 33 15 25 27" fill="#f08678" stroke="none"/><path d="M43 33H57M50 26V40" stroke="#b9ef84" stroke-width="4"/>',
  engineering:
    '<circle cx="17" cy="50" r="9" fill="#b17847" stroke="#c6c8bf" stroke-width="4"/><circle cx="48" cy="50" r="9" fill="#b17847" stroke="#c6c8bf" stroke-width="4"/><path d="M11 41H53M26 42 36 20 45 42" fill="none" stroke="#bc8e54" stroke-width="7"/><path d="M44 38 17 13" stroke="#ddb576" stroke-width="7"/><path d="M10 10Q13 24 25 17" fill="none" stroke="#ddc39a" stroke-width="5"/><circle cx="15" cy="10" r="7" fill="#bfcbd0"/>',
  veteran:
    '<path d="M16 8H48V45L32 59 16 45Z" fill="#346da5" stroke="#94b9d4" stroke-width="3"/><path d="m23 20 9-7 9 7M23 34l9-7 9 7" fill="none" stroke="#edf4f0" stroke-width="6"/><path d="m27 45 5-4 5 4" fill="none" stroke="#f4cf75" stroke-width="4"/>',
  mastery:
    '<path d="M8 18 20 30 32 9 44 30 57 18 51 52H14Z" fill="#eebd4f" stroke="#fff0af" stroke-width="3"/><path d="M16 45H50" stroke="#ac722f" stroke-width="4"/><circle cx="20" cy="37" r="4" fill="#77b9e8"/><circle cx="32" cy="34" r="5" fill="#f08e70"/><circle cx="44" cy="37" r="4" fill="#77b9e8"/>',
  logistics:
    '<path d="M29 8H44V36L57 43V54H21V44L29 37Z" fill="#c18a4f" stroke="#efd09b" stroke-width="3"/><path d="M29 28 7 13 10 28 22 39 4 32 12 44 26 47" fill="#e0edf2" stroke="#7fb3d3" stroke-width="3"/><path d="M33 19H44M33 27H44M24 53H58" stroke="#795031" stroke-width="3"/>',
  banking:
    '<path d="M8 38V53C8 61 36 61 36 53V38" fill="#bc8d30"/><ellipse cx="22" cy="38" rx="14" ry="6" fill="#ffdc6c"/><path d="M9 46Q22 53 35 46M9 52Q22 59 35 52" fill="none" stroke="#f6cd60"/><path d="M34 23V41C34 49 58 49 58 41V23" fill="#bc8d30"/><ellipse cx="46" cy="23" rx="12" ry="6" fill="#ffdf73"/><path d="M9 25 24 10 37 10M17 10H24V18" fill="none" stroke="#a9e881" stroke-width="4"/>',
  speaker:
    '<path d="M9 25H20L34 13V51L20 39H9Z" fill="#e7d6a2"/><path d="M42 23Q52 32 42 41M49 15Q65 32 49 49" fill="none" stroke="#8dc8e8" stroke-width="4"/>',
  coin: '<circle cx="32" cy="32" r="24" fill="#e8b84a" stroke="#ffe3a0" stroke-width="4"/><path d="M32 16V48M42 21H28Q17 21 24 32L38 34Q48 43 23 43" fill="none" stroke="#9e6d20" stroke-width="4"/>',
  clock:
    '<circle cx="32" cy="32" r="24" fill="#d7e1d4" stroke="#789da9" stroke-width="4"/><path d="M32 14V33L45 39" fill="none" stroke="#314a55" stroke-width="5"/>',
  lock: '<path d="M20 29V20A12 12 0 0 1 44 20V29" fill="none" stroke="#c5cbbd" stroke-width="6"/><rect x="13" y="28" width="38" height="29" rx="5" fill="#b89656"/><circle cx="32" cy="39" r="5" fill="#283326"/><path d="M32 40V49" stroke="#283326" stroke-width="5"/>',
  check:
    '<path d="M10 32 25 48 55 14" fill="none" stroke="#a7e47f" stroke-width="8"/>',
  back: '<path d="M30 12 9 32 30 52M10 32H56" fill="none" stroke="currentColor" stroke-width="7"/>',
};
export function icon(id, className = "research-icon") {
  return `<svg class="${className}" viewBox="0 0 64 64" aria-hidden="true" focusable="false" stroke-linecap="round" stroke-linejoin="round">${shapes[id] || shapes.mastery}</svg>`;
}
export const spoken = {
  archery:
    "Damit kannst du ein Haus für Bogenschützen bauen. Sie schießen aus der Ferne.",
  masonry:
    "Damit kannst du einen Turm bauen. Er schießt auf die Gegner und beschützt deinen Weg.",
  weapons: "Deine Kämpfer bekommen stärkere Waffen. Sie machen mehr Schaden.",
  armor:
    "Deine Kämpfer bekommen eine bessere Rüstung. Sie halten mehr Treffer aus.",
  engineering:
    "Damit kannst du eine Werkstatt bauen. Sie macht Katapulte. Die sind besonders stark gegen Gebäude.",
  veteran:
    "Danach kannst du deine Gebäude auf Stufe zwei verbessern. Du musst die Verbesserung noch beim Gebäude kaufen.",
  mastery:
    "Danach kannst du deine Gebäude auf Stufe drei verbessern. Das ist die stärkste Stufe.",
  logistics: "Deine Kasernen und Werkstätten machen schneller neue Kämpfer.",
  banking:
    "Deine Banken können dir mehr Gold geben, wenn du viel Gold gespart hast.",
};
