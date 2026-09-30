(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function t(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=t(i);fetch(i.href,r)}})();function Hf(s){return s!==null?{comment:s,variations:[]}:{variations:[]}}function Gf(s,e,t,n,i){const r={move:s,variations:i};return e&&(r.suffix=e),t&&(r.nag=t),n!==null&&(r.comment=n),r}function Vf(...s){const[e,...t]=s;let n=e;for(const i of t)i!==null&&(n.variations=[i,...i.variations],i.variations=[],n=i);return e}function Wf(s,e){if(e.marker&&e.marker.comment){let t=e.root;for(;;){const n=t.variations[0];if(!n){t.comment=e.marker.comment;break}t=n}}return{headers:s,root:e.root,result:(e.marker&&e.marker.result)??void 0}}function Xf(s,e){function t(){this.constructor=s}t.prototype=e.prototype,s.prototype=new t}function Os(s,e,t,n){var i=Error.call(this,s);return Object.setPrototypeOf&&Object.setPrototypeOf(i,Os.prototype),i.expected=e,i.found=t,i.location=n,i.name="SyntaxError",i}Xf(Os,Error);function co(s,e,t){return t=t||" ",s.length>e?s:(e-=s.length,t+=t.repeat(e),s+t.slice(0,e))}Os.prototype.format=function(s){var e="Error: "+this.message;if(this.location){var t=null,n;for(n=0;n<s.length;n++)if(s[n].source===this.location.source){t=s[n].text.split(/\r\n|\n|\r/g);break}var i=this.location.start,r=this.location.source&&typeof this.location.source.offset=="function"?this.location.source.offset(i):i,a=this.location.source+":"+r.line+":"+r.column;if(t){var o=this.location.end,l=co("",r.line.toString().length," "),c=t[i.line-1],h=i.line===o.line?o.column:c.length+1,f=h-i.column||1;e+=`
 --> `+a+`
`+l+` |
`+r.line+" | "+c+`
`+l+" | "+co("",i.column-1," ")+co("",f,"^")}else e+=`
 at `+a}return e};Os.buildMessage=function(s,e){var t={literal:function(c){return'"'+i(c.text)+'"'},class:function(c){var h=c.parts.map(function(f){return Array.isArray(f)?r(f[0])+"-"+r(f[1]):r(f)});return"["+(c.inverted?"^":"")+h.join("")+"]"},any:function(){return"any character"},end:function(){return"end of input"},other:function(c){return c.description}};function n(c){return c.charCodeAt(0).toString(16).toUpperCase()}function i(c){return c.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(h){return"\\x0"+n(h)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(h){return"\\x"+n(h)})}function r(c){return c.replace(/\\/g,"\\\\").replace(/\]/g,"\\]").replace(/\^/g,"\\^").replace(/-/g,"\\-").replace(/\0/g,"\\0").replace(/\t/g,"\\t").replace(/\n/g,"\\n").replace(/\r/g,"\\r").replace(/[\x00-\x0F]/g,function(h){return"\\x0"+n(h)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(h){return"\\x"+n(h)})}function a(c){return t[c.type](c)}function o(c){var h=c.map(a),f,u;if(h.sort(),h.length>0){for(f=1,u=1;f<h.length;f++)h[f-1]!==h[f]&&(h[u]=h[f],u++);h.length=u}switch(h.length){case 1:return h[0];case 2:return h[0]+" or "+h[1];default:return h.slice(0,-1).join(", ")+", or "+h[h.length-1]}}function l(c){return c?'"'+i(c)+'"':"end of input"}return"Expected "+o(s)+" but "+l(e)+" found."};function qf(s,e){e=e!==void 0?e:{};var t={},n=e.grammarSource,i={pgn:Zs},r=Zs,a="[",o='"',l="]",c=".",h="O-O-O",f="O-O",u="0-0-0",d="0-0",p="$",v="{",g="}",m=";",S="(",w=")",y="1-0",E="0-1",T="1/2-1/2",R="*",x=/^[a-zA-Z]/,A=/^[^"]/,D=/^[0-9]/,z=/^[.]/,N=/^[a-zA-Z1-8\-=]/,G=/^[+#]/,U=/^[!?]/,K=/^[^}]/,J=/^[^\r\n]/,$=/^[ \t\r\n]/,le=Kt("tag pair"),ee=rt("[",!1),ce=rt('"',!1),oe=rt("]",!1),Le=Kt("tag name"),Ee=Et([["a","z"],["A","Z"]],!1,!1),nt=Kt("tag value"),$e=Et(['"'],!0,!1),Je=Kt("move number"),ie=Et([["0","9"]],!1,!1),he=rt(".",!1),fe=Et(["."],!1,!1),Ie=Kt("standard algebraic notation"),ue=rt("O-O-O",!1),Ce=rt("O-O",!1),He=rt("0-0-0",!1),ne=rt("0-0",!1),pe=Et([["a","z"],["A","Z"],["1","8"],"-","="],!1,!1),de=Et(["+","#"],!1,!1),me=Kt("suffix annotation"),_e=Et(["!","?"],!1,!1),ke=Kt("NAG"),Ge=rt("$",!1),Ke=Kt("brace comment"),Ze=rt("{",!1),k=Et(["}"],!0,!1),lt=rt("}",!1),et=Kt("rest of line comment"),P=rt(";",!1),M=Et(["\r",`
`],!0,!1),C=Kt("variation"),V=rt("(",!1),te=rt(")",!1),xe=Kt("game termination marker"),Se=rt("1-0",!1),re=rt("0-1",!1),ae=rt("1/2-1/2",!1),Re=rt("*",!1),De=Kt("whitespace"),Te=Et([" ","	","\r",`
`],!1,!1),Pe=function(B,H){return Wf(B,H)},Ue=function(B){return Object.fromEntries(B)},We=function(B,H){return[B,H]},Qe=function(B,H){return{root:B,marker:H}},_=function(B,H){return Vf(Hf(B),...H.flat())},L=function(B,H,q,ge,we){return Gf(B,H,q,ge,we)},I=function(B){return B},X=function(B){return B.replace(/[\r\n]+/g," ")},Z=function(B){return B.trim()},Y=function(B){return B},ve=function(B,H){return{result:B,comment:H}},F=e.peg$currPos|0,Xe=[{line:1,column:1}],ze=F,gt=e.peg$maxFailExpected||[],Me=e.peg$silentFails|0,Nt;if(e.startRule){if(!(e.startRule in i))throw new Error(`Can't start parsing from rule "`+e.startRule+'".');r=i[e.startRule]}function rt(B,H){return{type:"literal",text:B,ignoreCase:H}}function Et(B,H,q){return{type:"class",parts:B,inverted:H,ignoreCase:q}}function Wn(){return{type:"end"}}function Kt(B){return{type:"other",description:B}}function Ks(B){var H=Xe[B],q;if(H)return H;if(B>=Xe.length)q=Xe.length-1;else for(q=B;!Xe[--q];);for(H=Xe[q],H={line:H.line,column:H.column};q<B;)s.charCodeAt(q)===10?(H.line++,H.column=1):H.column++,q++;return Xe[B]=H,H}function $s(B,H,q){var ge=Ks(B),we=Ks(H),Fe={source:n,start:{offset:B,line:ge.line,column:ge.column},end:{offset:H,line:we.line,column:we.column}};return Fe}function Ve(B){F<ze||(F>ze&&(ze=F,gt=[]),gt.push(B))}function Ys(B,H,q){return new Os(Os.buildMessage(B,H),B,H,q)}function Zs(){var B,H,q;return B=F,H=Gr(),q=Wr(),B=Pe(H,q),B}function Gr(){var B,H,q;for(B=F,H=[],q=Wi();q!==t;)H.push(q),q=Wi();return q=Ae(),B=Ue(H),B}function Wi(){var B,H,q,ge,we,Fe,Oe;return Me++,B=F,Ae(),s.charCodeAt(F)===91?(H=a,F++):(H=t,Me===0&&Ve(ee)),H!==t?(Ae(),q=Vr(),q!==t?(Ae(),s.charCodeAt(F)===34?(ge=o,F++):(ge=t,Me===0&&Ve(ce)),ge!==t?(we=os(),s.charCodeAt(F)===34?(Fe=o,F++):(Fe=t,Me===0&&Ve(ce)),Fe!==t?(Ae(),s.charCodeAt(F)===93?(Oe=l,F++):(Oe=t,Me===0&&Ve(oe)),Oe!==t?B=We(q,we):(F=B,B=t)):(F=B,B=t)):(F=B,B=t)):(F=B,B=t)):(F=B,B=t),Me--,B===t&&Me===0&&Ve(le),B}function Vr(){var B,H,q;if(Me++,B=F,H=[],q=s.charAt(F),x.test(q)?F++:(q=t,Me===0&&Ve(Ee)),q!==t)for(;q!==t;)H.push(q),q=s.charAt(F),x.test(q)?F++:(q=t,Me===0&&Ve(Ee));else H=t;return H!==t?B=s.substring(B,F):B=H,Me--,B===t&&(H=t,Me===0&&Ve(Le)),B}function os(){var B,H,q;for(Me++,B=F,H=[],q=s.charAt(F),A.test(q)?F++:(q=t,Me===0&&Ve($e));q!==t;)H.push(q),q=s.charAt(F),A.test(q)?F++:(q=t,Me===0&&Ve($e));return B=s.substring(B,F),Me--,H=t,Me===0&&Ve(nt),B}function Wr(){var B,H,q;return B=F,H=Js(),Ae(),q=j(),q===t&&(q=null),Ae(),B=Qe(H,q),B}function Js(){var B,H,q,ge;for(B=F,H=b(),H===t&&(H=null),q=[],ge=Xr();ge!==t;)q.push(ge),ge=Xr();return B=_(H,q),B}function Xr(){var B,H,q,ge,we,Fe,Oe,pt;if(B=F,Ae(),ao(),Ae(),H=oo(),H!==t){for(q=lo(),q===t&&(q=null),ge=[],we=Qs();we!==t;)ge.push(we),we=Qs();for(we=Ae(),Fe=b(),Fe===t&&(Fe=null),Oe=[],pt=Q();pt!==t;)Oe.push(pt),pt=Q();B=L(H,q,ge,Fe,Oe)}else F=B,B=t;return B}function ao(){var B,H,q,ge,we,Fe;for(Me++,B=F,H=[],q=s.charAt(F),D.test(q)?F++:(q=t,Me===0&&Ve(ie));q!==t;)H.push(q),q=s.charAt(F),D.test(q)?F++:(q=t,Me===0&&Ve(ie));if(s.charCodeAt(F)===46?(q=c,F++):(q=t,Me===0&&Ve(he)),q!==t){for(ge=Ae(),we=[],Fe=s.charAt(F),z.test(Fe)?F++:(Fe=t,Me===0&&Ve(fe));Fe!==t;)we.push(Fe),Fe=s.charAt(F),z.test(Fe)?F++:(Fe=t,Me===0&&Ve(fe));H=[H,q,ge,we],B=H}else F=B,B=t;return Me--,B===t&&(H=t,Me===0&&Ve(Je)),B}function oo(){var B,H,q,ge,we,Fe;if(Me++,B=F,H=F,s.substr(F,5)===h?(q=h,F+=5):(q=t,Me===0&&Ve(ue)),q===t&&(s.substr(F,3)===f?(q=f,F+=3):(q=t,Me===0&&Ve(Ce)),q===t&&(s.substr(F,5)===u?(q=u,F+=5):(q=t,Me===0&&Ve(He)),q===t&&(s.substr(F,3)===d?(q=d,F+=3):(q=t,Me===0&&Ve(ne)),q===t))))if(q=F,ge=s.charAt(F),x.test(ge)?F++:(ge=t,Me===0&&Ve(Ee)),ge!==t){if(we=[],Fe=s.charAt(F),N.test(Fe)?F++:(Fe=t,Me===0&&Ve(pe)),Fe!==t)for(;Fe!==t;)we.push(Fe),Fe=s.charAt(F),N.test(Fe)?F++:(Fe=t,Me===0&&Ve(pe));else we=t;we!==t?(ge=[ge,we],q=ge):(F=q,q=t)}else F=q,q=t;return q!==t?(ge=s.charAt(F),G.test(ge)?F++:(ge=t,Me===0&&Ve(de)),ge===t&&(ge=null),q=[q,ge],H=q):(F=H,H=t),H!==t?B=s.substring(B,F):B=H,Me--,B===t&&(H=t,Me===0&&Ve(Ie)),B}function lo(){var B,H,q;for(Me++,B=F,H=[],q=s.charAt(F),U.test(q)?F++:(q=t,Me===0&&Ve(_e));q!==t;)H.push(q),H.length>=2?q=t:(q=s.charAt(F),U.test(q)?F++:(q=t,Me===0&&Ve(_e)));return H.length<1?(F=B,B=t):B=H,Me--,B===t&&(H=t,Me===0&&Ve(me)),B}function Qs(){var B,H,q,ge,we;if(Me++,B=F,Ae(),s.charCodeAt(F)===36?(H=p,F++):(H=t,Me===0&&Ve(Ge)),H!==t){if(q=F,ge=[],we=s.charAt(F),D.test(we)?F++:(we=t,Me===0&&Ve(ie)),we!==t)for(;we!==t;)ge.push(we),we=s.charAt(F),D.test(we)?F++:(we=t,Me===0&&Ve(ie));else ge=t;ge!==t?q=s.substring(q,F):q=ge,q!==t?B=I(q):(F=B,B=t)}else F=B,B=t;return Me--,B===t&&Me===0&&Ve(ke),B}function b(){var B;return B=W(),B===t&&(B=se()),B}function W(){var B,H,q,ge,we;if(Me++,B=F,s.charCodeAt(F)===123?(H=v,F++):(H=t,Me===0&&Ve(Ze)),H!==t){for(q=F,ge=[],we=s.charAt(F),K.test(we)?F++:(we=t,Me===0&&Ve(k));we!==t;)ge.push(we),we=s.charAt(F),K.test(we)?F++:(we=t,Me===0&&Ve(k));q=s.substring(q,F),s.charCodeAt(F)===125?(ge=g,F++):(ge=t,Me===0&&Ve(lt)),ge!==t?B=X(q):(F=B,B=t)}else F=B,B=t;return Me--,B===t&&(H=t,Me===0&&Ve(Ke)),B}function se(){var B,H,q,ge,we;if(Me++,B=F,s.charCodeAt(F)===59?(H=m,F++):(H=t,Me===0&&Ve(P)),H!==t){for(q=F,ge=[],we=s.charAt(F),J.test(we)?F++:(we=t,Me===0&&Ve(M));we!==t;)ge.push(we),we=s.charAt(F),J.test(we)?F++:(we=t,Me===0&&Ve(M));q=s.substring(q,F),B=Z(q)}else F=B,B=t;return Me--,B===t&&(H=t,Me===0&&Ve(et)),B}function Q(){var B,H,q,ge;return Me++,B=F,Ae(),s.charCodeAt(F)===40?(H=S,F++):(H=t,Me===0&&Ve(V)),H!==t?(q=Js(),q!==t?(Ae(),s.charCodeAt(F)===41?(ge=w,F++):(ge=t,Me===0&&Ve(te)),ge!==t?B=Y(q):(F=B,B=t)):(F=B,B=t)):(F=B,B=t),Me--,B===t&&Me===0&&Ve(C),B}function j(){var B,H,q;return Me++,B=F,s.substr(F,3)===y?(H=y,F+=3):(H=t,Me===0&&Ve(Se)),H===t&&(s.substr(F,3)===E?(H=E,F+=3):(H=t,Me===0&&Ve(re)),H===t&&(s.substr(F,7)===T?(H=T,F+=7):(H=t,Me===0&&Ve(ae)),H===t&&(s.charCodeAt(F)===42?(H=R,F++):(H=t,Me===0&&Ve(Re))))),H!==t?(Ae(),q=b(),q===t&&(q=null),B=ve(H,q)):(F=B,B=t),Me--,B===t&&(H=t,Me===0&&Ve(xe)),B}function Ae(){var B,H;for(Me++,B=[],H=s.charAt(F),$.test(H)?F++:(H=t,Me===0&&Ve(Te));H!==t;)B.push(H),H=s.charAt(F),$.test(H)?F++:(H=t,Me===0&&Ve(Te));return Me--,H=t,Me===0&&Ve(De),B}if(Nt=r(),e.peg$library)return{peg$result:Nt,peg$currPos:F,peg$FAILED:t,peg$maxFailExpected:gt,peg$maxFailPos:ze};if(Nt!==t&&F===s.length)return Nt;throw Nt!==t&&F<s.length&&Ve(Wn()),Ys(gt,ze<s.length?s.charAt(ze):null,ze<s.length?$s(ze,ze+1):$s(ze,ze))}const Ta=0xffffffffffffffffn;function ho(s,e){return(s<<e|s>>64n-e)&0xffffffffffffffffn}function Yc(s,e){return s*e&Ta}function Kf(s){return function(){let e=BigInt(s&Ta),t=BigInt(s>>64n&Ta);const n=Yc(ho(Yc(e,5n),7n),9n);return t^=e,e=(ho(e,24n)^t^t<<16n)&Ta,t=ho(t,37n),s=t<<64n|e,n}}const $a=Kf(0xa187eb39cdcaed8f31c4b365b102e01en),$f=Array.from({length:2},()=>Array.from({length:6},()=>Array.from({length:128},()=>$a()))),Yf=Array.from({length:8},()=>$a()),Zf=Array.from({length:16},()=>$a()),uo=$a(),nn="w",vn="b",Bt="p",al="n",wa="b",dr="r",Ui="q",Ht="k",fo="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";class qr{color;from;to;piece;captured;promotion;flags;san;lan;before;after;constructor(e,t){const{color:n,piece:i,from:r,to:a,flags:o,captured:l,promotion:c}=t,h=Yt(r),f=Yt(a);this.color=n,this.piece=i,this.from=h,this.to=f,this.san=e._moveToSan(t,e._moves({legal:!0})),this.lan=h+f,this.before=e.fen(),e._makeMove(t),this.after=e.fen(),e._undoMove(),this.flags="";for(const u in it)it[u]&o&&(this.flags+=Xi[u]);l&&(this.captured=l),c&&(this.promotion=c,this.lan+=c)}isCapture(){return this.flags.indexOf(Xi.CAPTURE)>-1}isPromotion(){return this.flags.indexOf(Xi.PROMOTION)>-1}isEnPassant(){return this.flags.indexOf(Xi.EP_CAPTURE)>-1}isKingsideCastle(){return this.flags.indexOf(Xi.KSIDE_CASTLE)>-1}isQueensideCastle(){return this.flags.indexOf(Xi.QSIDE_CASTLE)>-1}isBigPawn(){return this.flags.indexOf(Xi.BIG_PAWN)>-1}}const Zt=-1,Xi={NORMAL:"n",CAPTURE:"c",BIG_PAWN:"b",EP_CAPTURE:"e",PROMOTION:"p",KSIDE_CASTLE:"k",QSIDE_CASTLE:"q",NULL_MOVE:"-"},it={NORMAL:1,CAPTURE:2,BIG_PAWN:4,EP_CAPTURE:8,PROMOTION:16,KSIDE_CASTLE:32,QSIDE_CASTLE:64,NULL_MOVE:128},ol={Event:"?",Site:"?",Date:"????.??.??",Round:"?",White:"?",Black:"?",Result:"*"},Jf={WhiteTitle:null,BlackTitle:null,WhiteElo:null,BlackElo:null,WhiteUSCF:null,BlackUSCF:null,WhiteNA:null,BlackNA:null,WhiteType:null,BlackType:null,EventDate:null,EventSponsor:null,Section:null,Stage:null,Board:null,Opening:null,Variation:null,SubVariation:null,ECO:null,NIC:null,Time:null,UTCTime:null,UTCDate:null,TimeControl:null,SetUp:null,FEN:null,Termination:null,Annotator:null,Mode:null,PlyCount:null},Qf={...ol,...Jf},tt={a8:0,b8:1,c8:2,d8:3,e8:4,f8:5,g8:6,h8:7,a7:16,b7:17,c7:18,d7:19,e7:20,f7:21,g7:22,h7:23,a6:32,b6:33,c6:34,d6:35,e6:36,f6:37,g6:38,h6:39,a5:48,b5:49,c5:50,d5:51,e5:52,f5:53,g5:54,h5:55,a4:64,b4:65,c4:66,d4:67,e4:68,f4:69,g4:70,h4:71,a3:80,b3:81,c3:82,d3:83,e3:84,f3:85,g3:86,h3:87,a2:96,b2:97,c2:98,d2:99,e2:100,f2:101,g2:102,h2:103,a1:112,b1:113,c1:114,d1:115,e1:116,f1:117,g1:118,h1:119},po={b:[16,32,17,15],w:[-16,-32,-17,-15]},Zc={n:[-18,-33,-31,-14,18,33,31,14],b:[-17,-15,17,15],r:[-16,1,16,-1],q:[-17,-16,-15,1,17,16,15,-1],k:[-17,-16,-15,1,17,16,15,-1]},jf=[20,0,0,0,0,0,0,24,0,0,0,0,0,0,20,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,24,24,24,24,24,24,56,0,56,24,24,24,24,24,24,0,0,0,0,0,0,2,53,56,53,2,0,0,0,0,0,0,0,0,0,0,0,20,2,24,2,20,0,0,0,0,0,0,0,0,0,0,20,0,0,24,0,0,20,0,0,0,0,0,0,0,0,20,0,0,0,24,0,0,0,20,0,0,0,0,0,0,20,0,0,0,0,24,0,0,0,0,20,0,0,0,0,20,0,0,0,0,0,24,0,0,0,0,0,20,0,0,20,0,0,0,0,0,0,24,0,0,0,0,0,0,20],ed=[17,0,0,0,0,0,0,16,0,0,0,0,0,0,15,0,0,17,0,0,0,0,0,16,0,0,0,0,0,15,0,0,0,0,17,0,0,0,0,16,0,0,0,0,15,0,0,0,0,0,0,17,0,0,0,16,0,0,0,15,0,0,0,0,0,0,0,0,17,0,0,16,0,0,15,0,0,0,0,0,0,0,0,0,0,17,0,16,0,15,0,0,0,0,0,0,0,0,0,0,0,0,17,16,15,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,-1,-1,-1,-1,-1,-1,-1,0,0,0,0,0,0,0,-15,-16,-17,0,0,0,0,0,0,0,0,0,0,0,0,-15,0,-16,0,-17,0,0,0,0,0,0,0,0,0,0,-15,0,0,-16,0,0,-17,0,0,0,0,0,0,0,0,-15,0,0,0,-16,0,0,0,-17,0,0,0,0,0,0,-15,0,0,0,0,-16,0,0,0,0,-17,0,0,0,0,-15,0,0,0,0,0,-16,0,0,0,0,0,-17,0,0,-15,0,0,0,0,0,0,-16,0,0,0,0,0,0,-17],td={p:1,n:2,b:4,r:8,q:16,k:32},nd="pnbrqkPNBRQK",Jc=[al,wa,dr,Ui],id=7,sd=6,rd=1,ad=0,Kr={[Ht]:it.KSIDE_CASTLE,[Ui]:it.QSIDE_CASTLE},Ai={w:[{square:tt.a1,flag:it.QSIDE_CASTLE},{square:tt.h1,flag:it.KSIDE_CASTLE}],b:[{square:tt.a8,flag:it.QSIDE_CASTLE},{square:tt.h8,flag:it.KSIDE_CASTLE}]},od={b:rd,w:sd},mo="--";function es(s){return s>>4}function Tr(s){return s&15}function Du(s){return"0123456789".indexOf(s)!==-1}function Yt(s){const e=Tr(s),t=es(s);return"abcdefgh".substring(e,e+1)+"87654321".substring(t,t+1)}function js(s){return s===nn?vn:nn}function ld(s){const e=s.split(/\s+/);if(e.length!==6)return{ok:!1,error:"Invalid FEN: must contain six space-delimited fields"};const t=parseInt(e[5],10);if(isNaN(t)||t<=0)return{ok:!1,error:"Invalid FEN: move number must be a positive integer"};const n=parseInt(e[4],10);if(isNaN(n)||n<0)return{ok:!1,error:"Invalid FEN: half move counter number must be a non-negative integer"};if(!/^(-|[abcdefgh][36])$/.test(e[3]))return{ok:!1,error:"Invalid FEN: en-passant square is invalid"};if(/[^kKqQ-]/.test(e[2]))return{ok:!1,error:"Invalid FEN: castling availability is invalid"};if(!/^(w|b)$/.test(e[1]))return{ok:!1,error:"Invalid FEN: side-to-move is invalid"};const i=e[0].split("/");if(i.length!==8)return{ok:!1,error:"Invalid FEN: piece data does not contain 8 '/'-delimited rows"};for(let a=0;a<i.length;a++){let o=0,l=!1;for(let c=0;c<i[a].length;c++)if(Du(i[a][c])){if(l)return{ok:!1,error:"Invalid FEN: piece data is invalid (consecutive number)"};o+=parseInt(i[a][c],10),l=!0}else{if(!/^[prnbqkPRNBQK]$/.test(i[a][c]))return{ok:!1,error:"Invalid FEN: piece data is invalid (invalid piece)"};o+=1,l=!1}if(o!==8)return{ok:!1,error:"Invalid FEN: piece data is invalid (too many squares in rank)"}}if(e[3][1]=="3"&&e[1]=="w"||e[3][1]=="6"&&e[1]=="b")return{ok:!1,error:"Invalid FEN: illegal en-passant square"};const r=[{color:"white",regex:/K/g},{color:"black",regex:/k/g}];for(const{color:a,regex:o}of r){if(!o.test(e[0]))return{ok:!1,error:`Invalid FEN: missing ${a} king`};if((e[0].match(o)||[]).length>1)return{ok:!1,error:`Invalid FEN: too many ${a} kings`}}return Array.from(i[0]+i[7]).some(a=>a.toUpperCase()==="P")?{ok:!1,error:"Invalid FEN: some pawns are on the edge rows"}:{ok:!0}}function cd(s,e){const t=s.from,n=s.to,i=s.piece;let r=0,a=0,o=0;for(let l=0,c=e.length;l<c;l++){const h=e[l].from,f=e[l].to,u=e[l].piece;i===u&&t!==h&&n===f&&(r++,es(t)===es(h)&&a++,Tr(t)===Tr(h)&&o++)}return r>0?a>0&&o>0?Yt(t):o>0?Yt(t).charAt(1):Yt(t).charAt(0):""}function Ri(s,e,t,n,i,r=void 0,a=it.NORMAL){const o=es(n);if(i===Bt&&(o===id||o===ad))for(let l=0;l<Jc.length;l++){const c=Jc[l];s.push({color:e,from:t,to:n,piece:i,captured:r,promotion:c,flags:a|it.PROMOTION})}else s.push({color:e,from:t,to:n,piece:i,captured:r,flags:a})}function Qc(s){let e=s.charAt(0);return e>="a"&&e<="h"?s.match(/[a-h]\d.*[a-h]\d/)?void 0:Bt:(e=e.toLowerCase(),e==="o"?Ht:e)}function go(s){return s.replace(/=/,"").replace(/[+#]?[?!]*$/,"")}class hd{_board=new Array(128);_turn=nn;_header={};_kings={w:Zt,b:Zt};_epSquare=-1;_halfMoves=0;_moveNumber=0;_history=[];_comments={};_castling={w:0,b:0};_hash=0n;_positionCount=new Map;constructor(e=fo,{skipValidation:t=!1}={}){this.load(e,{skipValidation:t})}clear({preserveHeaders:e=!1}={}){this._board=new Array(128),this._kings={w:Zt,b:Zt},this._turn=nn,this._castling={w:0,b:0},this._epSquare=Zt,this._halfMoves=0,this._moveNumber=1,this._history=[],this._comments={},this._header=e?this._header:{...Qf},this._hash=this._computeHash(),this._positionCount=new Map,this._header.SetUp=null,this._header.FEN=null}load(e,{skipValidation:t=!1,preserveHeaders:n=!1}={}){let i=e.split(/\s+/);if(i.length>=2&&i.length<6){const o=["-","-","0","1"];e=i.concat(o.slice(-(6-i.length))).join(" ")}if(i=e.split(/\s+/),!t){const{ok:o,error:l}=ld(e);if(!o)throw new Error(l)}const r=i[0];let a=0;this.clear({preserveHeaders:n});for(let o=0;o<r.length;o++){const l=r.charAt(o);if(l==="/")a+=8;else if(Du(l))a+=parseInt(l,10);else{const c=l<"a"?nn:vn;this._put({type:l.toLowerCase(),color:c},Yt(a)),a++}}this._turn=i[1],i[2].indexOf("K")>-1&&(this._castling.w|=it.KSIDE_CASTLE),i[2].indexOf("Q")>-1&&(this._castling.w|=it.QSIDE_CASTLE),i[2].indexOf("k")>-1&&(this._castling.b|=it.KSIDE_CASTLE),i[2].indexOf("q")>-1&&(this._castling.b|=it.QSIDE_CASTLE),this._epSquare=i[3]==="-"?Zt:tt[i[3]],this._halfMoves=parseInt(i[4],10),this._moveNumber=parseInt(i[5],10),this._hash=this._computeHash(),this._updateSetup(e),this._incPositionCount()}fen({forceEnpassantSquare:e=!1}={}){let t=0,n="";for(let a=tt.a8;a<=tt.h1;a++){if(this._board[a]){t>0&&(n+=t,t=0);const{color:o,type:l}=this._board[a];n+=o===nn?l.toUpperCase():l.toLowerCase()}else t++;a+1&136&&(t>0&&(n+=t),a!==tt.h1&&(n+="/"),t=0,a+=8)}let i="";this._castling[nn]&it.KSIDE_CASTLE&&(i+="K"),this._castling[nn]&it.QSIDE_CASTLE&&(i+="Q"),this._castling[vn]&it.KSIDE_CASTLE&&(i+="k"),this._castling[vn]&it.QSIDE_CASTLE&&(i+="q"),i=i||"-";let r="-";if(this._epSquare!==Zt)if(e)r=Yt(this._epSquare);else{const a=this._epSquare+(this._turn===nn?16:-16),o=[a+1,a-1];for(const l of o){if(l&136)continue;const c=this._turn;if(this._board[l]?.color===c&&this._board[l]?.type===Bt){this._makeMove({color:c,from:l,to:this._epSquare,piece:Bt,captured:Bt,flags:it.EP_CAPTURE});const h=!this._isKingAttacked(c);if(this._undoMove(),h){r=Yt(this._epSquare);break}}}}return[n,this._turn,i,r,this._halfMoves,this._moveNumber].join(" ")}_pieceKey(e){if(!this._board[e])return 0n;const{color:t,type:n}=this._board[e],i={w:0,b:1}[t],r={p:0,n:1,b:2,r:3,q:4,k:5}[n];return $f[i][r][e]}_epKey(){return this._epSquare===Zt?0n:Yf[this._epSquare&7]}_castlingKey(){const e=this._castling.w>>5|this._castling.b>>3;return Zf[e]}_computeHash(){let e=0n;for(let t=tt.a8;t<=tt.h1;t++){if(t&136){t+=7;continue}this._board[t]&&(e^=this._pieceKey(t))}return e^=this._epKey(),e^=this._castlingKey(),this._turn==="b"&&(e^=uo),e}_updateSetup(e){this._history.length>0||(e!==fo?(this._header.SetUp="1",this._header.FEN=e):(this._header.SetUp=null,this._header.FEN=null))}reset(){this.load(fo)}get(e){return this._board[tt[e]]}findPiece(e){const t=[];for(let n=tt.a8;n<=tt.h1;n++){if(n&136){n+=7;continue}!this._board[n]||this._board[n]?.color!==e.color||this._board[n].color===e.color&&this._board[n].type===e.type&&t.push(Yt(n))}return t}put({type:e,color:t},n){return this._put({type:e,color:t},n)?(this._updateCastlingRights(),this._updateEnPassantSquare(),this._updateSetup(this.fen()),!0):!1}_set(e,t){this._hash^=this._pieceKey(e),this._board[e]=t,this._hash^=this._pieceKey(e)}_put({type:e,color:t},n){if(nd.indexOf(e.toLowerCase())===-1||!(n in tt))return!1;const i=tt[n];if(e==Ht&&!(this._kings[t]==Zt||this._kings[t]==i))return!1;const r=this._board[i];return r&&r.type===Ht&&(this._kings[r.color]=Zt),this._set(i,{type:e,color:t}),e===Ht&&(this._kings[t]=i),!0}_clear(e){this._hash^=this._pieceKey(e),delete this._board[e]}remove(e){const t=this.get(e);return this._clear(tt[e]),t&&t.type===Ht&&(this._kings[t.color]=Zt),this._updateCastlingRights(),this._updateEnPassantSquare(),this._updateSetup(this.fen()),t}_updateCastlingRights(){this._hash^=this._castlingKey();const e=this._board[tt.e1]?.type===Ht&&this._board[tt.e1]?.color===nn,t=this._board[tt.e8]?.type===Ht&&this._board[tt.e8]?.color===vn;(!e||this._board[tt.a1]?.type!==dr||this._board[tt.a1]?.color!==nn)&&(this._castling.w&=-65),(!e||this._board[tt.h1]?.type!==dr||this._board[tt.h1]?.color!==nn)&&(this._castling.w&=-33),(!t||this._board[tt.a8]?.type!==dr||this._board[tt.a8]?.color!==vn)&&(this._castling.b&=-65),(!t||this._board[tt.h8]?.type!==dr||this._board[tt.h8]?.color!==vn)&&(this._castling.b&=-33),this._hash^=this._castlingKey()}_updateEnPassantSquare(){if(this._epSquare===Zt)return;const e=this._epSquare+(this._turn===nn?-16:16),t=this._epSquare+(this._turn===nn?16:-16),n=[t+1,t-1];if(this._board[e]!==null||this._board[this._epSquare]!==null||this._board[t]?.color!==js(this._turn)||this._board[t]?.type!==Bt){this._hash^=this._epKey(),this._epSquare=Zt;return}const i=r=>!(r&136)&&this._board[r]?.color===this._turn&&this._board[r]?.type===Bt;n.some(i)||(this._hash^=this._epKey(),this._epSquare=Zt)}_attacked(e,t,n){const i=[];for(let r=tt.a8;r<=tt.h1;r++){if(r&136){r+=7;continue}if(this._board[r]===void 0||this._board[r].color!==e)continue;const a=this._board[r],o=r-t;if(o===0)continue;const l=o+119;if(jf[l]&td[a.type]){if(a.type===Bt){if(o>0&&a.color===nn||o<=0&&a.color===vn)if(n)i.push(Yt(r));else return!0;continue}if(a.type==="n"||a.type==="k")if(n){i.push(Yt(r));continue}else return!0;const c=ed[l];let h=r+c,f=!1;for(;h!==t;){if(this._board[h]!=null){f=!0;break}h+=c}if(!f)if(n){i.push(Yt(r));continue}else return!0}}return n?i:!1}attackers(e,t){return t?this._attacked(t,tt[e],!0):this._attacked(this._turn,tt[e],!0)}_isKingAttacked(e){const t=this._kings[e];return t===-1?!1:this._attacked(js(e),t)}hash(){return this._hash.toString(16)}isAttacked(e,t){return this._attacked(t,tt[e])}isCheck(){return this._isKingAttacked(this._turn)}inCheck(){return this.isCheck()}isCheckmate(){return this.isCheck()&&this._moves().length===0}isStalemate(){return!this.isCheck()&&this._moves().length===0}isInsufficientMaterial(){const e={b:0,n:0,r:0,q:0,k:0,p:0},t=[];let n=0,i=0;for(let r=tt.a8;r<=tt.h1;r++){if(i=(i+1)%2,r&136){r+=7;continue}const a=this._board[r];a&&(e[a.type]=a.type in e?e[a.type]+1:1,a.type===wa&&t.push(i),n++)}if(n===2)return!0;if(n===3&&(e[wa]===1||e[al]===1))return!0;if(n===e[wa]+2){let r=0;const a=t.length;for(let o=0;o<a;o++)r+=t[o];if(r===0||r===a)return!0}return!1}isThreefoldRepetition(){return this._getPositionCount(this._hash)>=3}isDrawByFiftyMoves(){return this._halfMoves>=100}isDraw(){return this.isDrawByFiftyMoves()||this.isStalemate()||this.isInsufficientMaterial()||this.isThreefoldRepetition()}isGameOver(){return this.isCheckmate()||this.isDraw()}moves({verbose:e=!1,square:t=void 0,piece:n=void 0}={}){const i=this._moves({square:t,piece:n});return e?i.map(r=>new qr(this,r)):i.map(r=>this._moveToSan(r,i))}_moves({legal:e=!0,piece:t=void 0,square:n=void 0}={}){const i=n?n.toLowerCase():void 0,r=t?.toLowerCase(),a=[],o=this._turn,l=js(o);let c=tt.a8,h=tt.h1,f=!1;if(i)if(i in tt)c=h=tt[i],f=!0;else return[];for(let d=c;d<=h;d++){if(d&136){d+=7;continue}if(!this._board[d]||this._board[d].color===l)continue;const{type:p}=this._board[d];let v;if(p===Bt){if(r&&r!==p)continue;v=d+po[o][0],this._board[v]||(Ri(a,o,d,v,Bt),v=d+po[o][1],od[o]===es(d)&&!this._board[v]&&Ri(a,o,d,v,Bt,void 0,it.BIG_PAWN));for(let g=2;g<4;g++)v=d+po[o][g],!(v&136)&&(this._board[v]?.color===l?Ri(a,o,d,v,Bt,this._board[v].type,it.CAPTURE):v===this._epSquare&&Ri(a,o,d,v,Bt,Bt,it.EP_CAPTURE))}else{if(r&&r!==p)continue;for(let g=0,m=Zc[p].length;g<m;g++){const S=Zc[p][g];for(v=d;v+=S,!(v&136);){if(!this._board[v])Ri(a,o,d,v,p);else{if(this._board[v].color===o)break;Ri(a,o,d,v,p,this._board[v].type,it.CAPTURE);break}if(p===al||p===Ht)break}}}}if((r===void 0||r===Ht)&&(!f||h===this._kings[o])){if(this._castling[o]&it.KSIDE_CASTLE){const d=this._kings[o],p=d+2;!this._board[d+1]&&!this._board[p]&&!this._attacked(l,this._kings[o])&&!this._attacked(l,d+1)&&!this._attacked(l,p)&&Ri(a,o,this._kings[o],p,Ht,void 0,it.KSIDE_CASTLE)}if(this._castling[o]&it.QSIDE_CASTLE){const d=this._kings[o],p=d-2;!this._board[d-1]&&!this._board[d-2]&&!this._board[d-3]&&!this._attacked(l,this._kings[o])&&!this._attacked(l,d-1)&&!this._attacked(l,p)&&Ri(a,o,this._kings[o],p,Ht,void 0,it.QSIDE_CASTLE)}}if(!e||this._kings[o]===-1)return a;const u=[];for(let d=0,p=a.length;d<p;d++)this._makeMove(a[d]),this._isKingAttacked(o)||u.push(a[d]),this._undoMove();return u}move(e,{strict:t=!1}={}){let n=null;if(typeof e=="string")n=this._moveFromSan(e,t);else if(e===null)n=this._moveFromSan(mo,t);else if(typeof e=="object"){const r=this._moves();for(let a=0,o=r.length;a<o;a++)if(e.from===Yt(r[a].from)&&e.to===Yt(r[a].to)&&(!("promotion"in r[a])||e.promotion===r[a].promotion)){n=r[a];break}}if(!n)throw typeof e=="string"?new Error(`Invalid move: ${e}`):new Error(`Invalid move: ${JSON.stringify(e)}`);if(this.isCheck()&&n.flags&it.NULL_MOVE)throw new Error("Null move not allowed when in check");const i=new qr(this,n);return this._makeMove(n),this._incPositionCount(),i}_push(e){this._history.push({move:e,kings:{b:this._kings.b,w:this._kings.w},turn:this._turn,castling:{b:this._castling.b,w:this._castling.w},epSquare:this._epSquare,halfMoves:this._halfMoves,moveNumber:this._moveNumber})}_movePiece(e,t){this._hash^=this._pieceKey(e),this._board[t]=this._board[e],delete this._board[e],this._hash^=this._pieceKey(t)}_makeMove(e){const t=this._turn,n=js(t);if(this._push(e),e.flags&it.NULL_MOVE){t===vn&&this._moveNumber++,this._halfMoves++,this._turn=n,this._epSquare=Zt;return}if(this._hash^=this._epKey(),this._hash^=this._castlingKey(),e.captured&&(this._hash^=this._pieceKey(e.to)),this._movePiece(e.from,e.to),e.flags&it.EP_CAPTURE&&(this._turn===vn?this._clear(e.to-16):this._clear(e.to+16)),e.promotion&&(this._clear(e.to),this._set(e.to,{type:e.promotion,color:t})),this._board[e.to].type===Ht){if(this._kings[t]=e.to,e.flags&it.KSIDE_CASTLE){const i=e.to-1,r=e.to+1;this._movePiece(r,i)}else if(e.flags&it.QSIDE_CASTLE){const i=e.to+1,r=e.to-2;this._movePiece(r,i)}this._castling[t]=0}if(this._castling[t]){for(let i=0,r=Ai[t].length;i<r;i++)if(e.from===Ai[t][i].square&&this._castling[t]&Ai[t][i].flag){this._castling[t]^=Ai[t][i].flag;break}}if(this._castling[n]){for(let i=0,r=Ai[n].length;i<r;i++)if(e.to===Ai[n][i].square&&this._castling[n]&Ai[n][i].flag){this._castling[n]^=Ai[n][i].flag;break}}if(this._hash^=this._castlingKey(),e.flags&it.BIG_PAWN){let i;t===vn?i=e.to-16:i=e.to+16,!(e.to-1&136)&&this._board[e.to-1]?.type===Bt&&this._board[e.to-1]?.color===n||!(e.to+1&136)&&this._board[e.to+1]?.type===Bt&&this._board[e.to+1]?.color===n?(this._epSquare=i,this._hash^=this._epKey()):this._epSquare=Zt}else this._epSquare=Zt;e.piece===Bt?this._halfMoves=0:e.flags&(it.CAPTURE|it.EP_CAPTURE)?this._halfMoves=0:this._halfMoves++,t===vn&&this._moveNumber++,this._turn=n,this._hash^=uo}undo(){const e=this._hash,t=this._undoMove();if(t){const n=new qr(this,t);return this._decPositionCount(e),n}return null}_undoMove(){const e=this._history.pop();if(e===void 0)return null;this._hash^=this._epKey(),this._hash^=this._castlingKey();const t=e.move;this._kings=e.kings,this._turn=e.turn,this._castling=e.castling,this._epSquare=e.epSquare,this._halfMoves=e.halfMoves,this._moveNumber=e.moveNumber,this._hash^=this._epKey(),this._hash^=this._castlingKey(),this._hash^=uo;const n=this._turn,i=js(n);if(t.flags&it.NULL_MOVE)return t;if(this._movePiece(t.to,t.from),t.piece&&(this._clear(t.from),this._set(t.from,{type:t.piece,color:n})),t.captured)if(t.flags&it.EP_CAPTURE){let r;n===vn?r=t.to-16:r=t.to+16,this._set(r,{type:Bt,color:i})}else this._set(t.to,{type:t.captured,color:i});if(t.flags&(it.KSIDE_CASTLE|it.QSIDE_CASTLE)){let r,a;t.flags&it.KSIDE_CASTLE?(r=t.to+1,a=t.to-1):(r=t.to-2,a=t.to+1),this._movePiece(a,r)}return t}pgn({newline:e=`
`,maxWidth:t=0}={}){const n=[];let i=!1;for(const u in this._header)this._header[u]&&n.push(`[${u} "${this._header[u]}"]`+e),i=!0;i&&this._history.length&&n.push(e);const r=u=>{const d=this._comments[this.fen()];if(typeof d<"u"){const p=u.length>0?" ":"";u=`${u}${p}{${d}}`}return u},a=[];for(;this._history.length>0;)a.push(this._undoMove());const o=[];let l="";for(a.length===0&&o.push(r(""));a.length>0;){l=r(l);const u=a.pop();if(!u)break;if(!this._history.length&&u.color==="b"){const d=`${this._moveNumber}. ...`;l=l?`${l} ${d}`:d}else u.color==="w"&&(l.length&&o.push(l),l=this._moveNumber+".");l=l+" "+this._moveToSan(u,this._moves({legal:!0})),this._makeMove(u)}if(l.length&&o.push(r(l)),o.push(this._header.Result||"*"),t===0)return n.join("")+o.join(" ");const c=function(){return n.length>0&&n[n.length-1]===" "?(n.pop(),!0):!1},h=function(u,d){for(const p of d.split(" "))if(p){if(u+p.length>t){for(;c();)u--;n.push(e),u=0}n.push(p),u+=p.length,n.push(" "),u++}return c()&&u--,u};let f=0;for(let u=0;u<o.length;u++){if(f+o[u].length>t&&o[u].includes("{")){f=h(f,o[u]);continue}f+o[u].length>t&&u!==0?(n[n.length-1]===" "&&n.pop(),n.push(e),f=0):u!==0&&(n.push(" "),f++),n.push(o[u]),f+=o[u].length}return n.join("")}header(...e){for(let t=0;t<e.length;t+=2)typeof e[t]=="string"&&typeof e[t+1]=="string"&&(this._header[e[t]]=e[t+1]);return this._header}setHeader(e,t){return this._header[e]=t??ol[e]??null,this.getHeaders()}removeHeader(e){return e in this._header?(this._header[e]=ol[e]||null,!0):!1}getHeaders(){const e={};for(const[t,n]of Object.entries(this._header))n!==null&&(e[t]=n);return e}loadPgn(e,{strict:t=!1,newlineChar:n=`\r?
`}={}){n!==`\r?
`&&(e=e.replace(new RegExp(n,"g"),`
`));const i=qf(e);this.reset();const r=i.headers;let a="";for(const c in r)c.toLowerCase()==="fen"&&(a=r[c]),this.header(c,r[c]);if(!t)a&&this.load(a,{preserveHeaders:!0});else if(r.SetUp==="1"){if(!("FEN"in r))throw new Error("Invalid PGN: FEN tag must be supplied with SetUp tag");this.load(r.FEN,{preserveHeaders:!0})}let o=i.root;for(;o;){if(o.move){const c=this._moveFromSan(o.move,t);if(c==null)throw new Error(`Invalid move in PGN: ${o.move}`);this._makeMove(c),this._incPositionCount()}o.comment!==void 0&&(this._comments[this.fen()]=o.comment),o=o.variations[0]}const l=i.result;l&&Object.keys(this._header).length&&this._header.Result!==l&&this.setHeader("Result",l)}_moveToSan(e,t){let n="";if(e.flags&it.KSIDE_CASTLE)n="O-O";else if(e.flags&it.QSIDE_CASTLE)n="O-O-O";else{if(e.flags&it.NULL_MOVE)return mo;if(e.piece!==Bt){const i=cd(e,t);n+=e.piece.toUpperCase()+i}e.flags&(it.CAPTURE|it.EP_CAPTURE)&&(e.piece===Bt&&(n+=Yt(e.from)[0]),n+="x"),n+=Yt(e.to),e.promotion&&(n+="="+e.promotion.toUpperCase())}return this._makeMove(e),this.isCheck()&&(this.isCheckmate()?n+="#":n+="+"),this._undoMove(),n}_moveFromSan(e,t=!1){let n=go(e);if(t||(n==="0-0"?n="O-O":n==="0-0-0"&&(n="O-O-O")),n==mo)return{color:this._turn,from:0,to:0,piece:"k",flags:it.NULL_MOVE};let i=Qc(n),r=this._moves({legal:!0,piece:i});for(let u=0,d=r.length;u<d;u++)if(n===go(this._moveToSan(r[u],r)))return r[u];if(t)return null;let a,o,l,c,h,f=!1;if(o=n.match(/([pnbrqkPNBRQK])?([a-h][1-8])x?-?([a-h][1-8])([qrbnQRBN])?/),o?(a=o[1],l=o[2],c=o[3],h=o[4],l.length==1&&(f=!0)):(o=n.match(/([pnbrqkPNBRQK])?([a-h]?[1-8]?)x?-?([a-h][1-8])([qrbnQRBN])?/),o&&(a=o[1],l=o[2],c=o[3],h=o[4],l.length==1&&(f=!0))),i=Qc(n),r=this._moves({legal:!0,piece:a||i}),!c)return null;for(let u=0,d=r.length;u<d;u++)if(l){if((!a||a.toLowerCase()==r[u].piece)&&tt[l]==r[u].from&&tt[c]==r[u].to&&(!h||h.toLowerCase()==r[u].promotion))return r[u];if(f){const p=Yt(r[u].from);if((!a||a.toLowerCase()==r[u].piece)&&tt[c]==r[u].to&&(l==p[0]||l==p[1])&&(!h||h.toLowerCase()==r[u].promotion))return r[u]}}else if(n===go(this._moveToSan(r[u],r)).replace("x",""))return r[u];return null}ascii(){let e=`   +------------------------+
`;for(let t=tt.a8;t<=tt.h1;t++){if(Tr(t)===0&&(e+=" "+"87654321"[es(t)]+" |"),this._board[t]){const n=this._board[t].type,r=this._board[t].color===nn?n.toUpperCase():n.toLowerCase();e+=" "+r+" "}else e+=" . ";t+1&136&&(e+=`|
`,t+=8)}return e+=`   +------------------------+
`,e+="     a  b  c  d  e  f  g  h",e}perft(e){const t=this._moves({legal:!1});let n=0;const i=this._turn;for(let r=0,a=t.length;r<a;r++)this._makeMove(t[r]),this._isKingAttacked(i)||(e-1>0?n+=this.perft(e-1):n++),this._undoMove();return n}setTurn(e){return this._turn==e?!1:(this.move("--"),!0)}turn(){return this._turn}board(){const e=[];let t=[];for(let n=tt.a8;n<=tt.h1;n++)this._board[n]==null?t.push(null):t.push({square:Yt(n),type:this._board[n].type,color:this._board[n].color}),n+1&136&&(e.push(t),t=[],n+=8);return e}squareColor(e){if(e in tt){const t=tt[e];return(es(t)+Tr(t))%2===0?"light":"dark"}return null}history({verbose:e=!1}={}){const t=[],n=[];for(;this._history.length>0;)t.push(this._undoMove());for(;;){const i=t.pop();if(!i)break;e?n.push(new qr(this,i)):n.push(this._moveToSan(i,this._moves())),this._makeMove(i)}return n}_getPositionCount(e){return this._positionCount.get(e)??0}_incPositionCount(){this._positionCount.set(this._hash,(this._positionCount.get(this._hash)??0)+1)}_decPositionCount(e){const t=this._positionCount.get(e)??0;t===1?this._positionCount.delete(e):this._positionCount.set(e,t-1)}_pruneComments(){const e=[],t={},n=i=>{i in this._comments&&(t[i]=this._comments[i])};for(;this._history.length>0;)e.push(this._undoMove());for(n(this.fen());;){const i=e.pop();if(!i)break;this._makeMove(i),n(this.fen())}this._comments=t}getComment(){return this._comments[this.fen()]}setComment(e){this._comments[this.fen()]=e.replace("{","[").replace("}","]")}deleteComment(){return this.removeComment()}removeComment(){const e=this._comments[this.fen()];return delete this._comments[this.fen()],e}getComments(){return this._pruneComments(),Object.keys(this._comments).map(e=>({fen:e,comment:this._comments[e]}))}deleteComments(){return this.removeComments()}removeComments(){return this._pruneComments(),Object.keys(this._comments).map(e=>{const t=this._comments[e];return delete this._comments[e],{fen:e,comment:t}})}setCastlingRights(e,t){for(const i of[Ht,Ui])t[i]!==void 0&&(t[i]?this._castling[e]|=Kr[i]:this._castling[e]&=~Kr[i]);this._updateCastlingRights();const n=this.getCastlingRights(e);return(t[Ht]===void 0||t[Ht]===n[Ht])&&(t[Ui]===void 0||t[Ui]===n[Ui])}getCastlingRights(e){return{[Ht]:(this._castling[e]&Kr[Ht])!==0,[Ui]:(this._castling[e]&Kr[Ui])!==0}}moveNumber(){return this._moveNumber}}const rc="186",Ps={ROTATE:0,DOLLY:1,PAN:2},Rs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},ud=0,jc=1,fd=2,Aa=1,Uu=2,pr=3,Bi=0,on=1,Jt=2,Mi=0,ts=1,ll=2,eh=3,th=4,dd=5,ws=100,pd=101,md=102,gd=103,_d=104,xd=200,vd=201,Md=202,yd=203,Ou=204,Fu=205,Sd=206,bd=207,Ed=208,Td=209,wd=210,Ad=211,Rd=212,Cd=213,Pd=214,cl=0,hl=1,ul=2,wr=3,fl=4,dl=5,pl=6,ml=7,ac=0,Ld=1,Id=2,ei=0,Bu=1,ku=2,zu=3,oc=4,Hu=5,Gu=6,Vu=7,nh="attached",Nd="detached",Wu=300,is=301,Fs=302,_o=303,xo=304,Ya=306,Jn=1e3,Qn=1001,Ua=1002,Gt=1003,Xu=1004,mr=1005,Vt=1006,Ra=1007,gi=1008,Mn=1009,qu=1010,Ku=1011,Ar=1012,lc=1013,ti=1014,Rn=1015,ni=1016,cc=1017,hc=1018,Rr=1020,$u=35902,Yu=35899,Zu=1021,Ju=1022,Cn=1023,Si=1026,ji=1027,uc=1028,fc=1029,ss=1030,dc=1031,pc=1033,Ca=33776,Pa=33777,La=33778,Ia=33779,gl=35840,_l=35841,xl=35842,vl=35843,Ml=36196,yl=37492,Sl=37496,bl=37488,El=37489,Oa=37490,Tl=37491,wl=37808,Al=37809,Rl=37810,Cl=37811,Pl=37812,Ll=37813,Il=37814,Nl=37815,Dl=37816,Ul=37817,Ol=37818,Fl=37819,Bl=37820,kl=37821,zl=36492,Hl=36494,Gl=36495,Vl=36283,Wl=36284,Fa=36285,Xl=36286,Cr=2300,Pr=2301,vo=2302,ih=2303,sh=2400,rh=2401,ah=2402,Dd=2500,Ud=0,Qu=1,ql=2,Od=3200,Ba=0,Fd=1,Fi="",Rt="srgb",yn="srgb-linear",ka="linear",xt="srgb",Mo=7680,Bd=519,kd=512,zd=513,Hd=514,mc=515,Gd=516,Vd=517,gc=518,Wd=519,ju=35044,Xd=35048,oh="300 es",jn=2e3,Lr=2001;function qd(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Kd(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Ir(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function $d(){const s=Ir("canvas");return s.style.display="block",s}const lh={};function za(...s){const e="THREE."+s.shift();console.log(e,...s)}function ef(s){const e=s[0];if(typeof e=="string"&&e.startsWith("TSL:")){const t=s[1];t&&t.isStackTrace?s[0]+=" "+t.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function qe(...s){s=ef(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.warn(t.getError(e)):console.warn(e,...s)}}function je(...s){s=ef(s);const e="THREE."+s.shift();{const t=s[0];t&&t.isStackTrace?console.error(t.getError(e)):console.error(e,...s)}}function ns(...s){const e=s.join(" ");e in lh||(lh[e]=!0,qe(...s))}function Yd(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const Zd={[cl]:hl,[ul]:pl,[fl]:ml,[wr]:dl,[hl]:cl,[pl]:ul,[ml]:fl,[dl]:wr};class Gi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const i=n[e];if(i!==void 0){const r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,e);e.target=null}}}const en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ch=1234567;const xr=Math.PI/180,Bs=180/Math.PI;function Ln(){const s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[s&255]+en[s>>8&255]+en[s>>16&255]+en[s>>24&255]+"-"+en[e&255]+en[e>>8&255]+"-"+en[e>>16&15|64]+en[e>>24&255]+"-"+en[t&63|128]+en[t>>8&255]+"-"+en[t>>16&255]+en[t>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function ot(s,e,t){return Math.max(e,Math.min(t,s))}function _c(s,e){return(s%e+e)%e}function Jd(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Qd(s,e,t){return s!==e?(t-s)/(e-s):0}function vr(s,e,t){return(1-t)*s+t*e}function jd(s,e,t,n){return vr(s,e,1-Math.exp(-t*n))}function ep(s,e=1){return e-Math.abs(_c(s,e*2)-e)}function tp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function np(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function ip(s,e){return s+Math.floor(Math.random()*(e-s+1))}function sp(s,e){return s+Math.random()*(e-s)}function rp(s){return s*(.5-Math.random())}function ap(s){s!==void 0&&(ch=s);let e=ch+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function op(s){return s*xr}function lp(s){return s*Bs}function cp(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function hp(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function up(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function fp(s,e,t,n,i){const r=Math.cos,a=Math.sin,o=r(t/2),l=a(t/2),c=r((e+n)/2),h=a((e+n)/2),f=r((e-n)/2),u=a((e-n)/2),d=r((n-e)/2),p=a((n-e)/2);switch(i){case"XYX":s.set(o*h,l*f,l*u,o*c);break;case"YZY":s.set(l*u,o*h,l*f,o*c);break;case"ZXZ":s.set(l*f,l*u,o*h,o*c);break;case"XZX":s.set(o*h,l*p,l*d,o*c);break;case"YXY":s.set(l*d,o*h,l*p,o*c);break;case"ZYZ":s.set(l*p,l*d,o*h,o*c);break;default:qe("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Fn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:case Uint8ClampedArray:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("THREE.MathUtils: Invalid component type.")}}function vt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:case Uint8ClampedArray:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("THREE.MathUtils: Invalid component type.")}}const kt={DEG2RAD:xr,RAD2DEG:Bs,generateUUID:Ln,clamp:ot,euclideanModulo:_c,mapLinear:Jd,inverseLerp:Qd,lerp:vr,damp:jd,pingpong:ep,smoothstep:tp,smootherstep:np,randInt:ip,randFloat:sp,randFloatSpread:rp,seededRandom:ap,degToRad:op,radToDeg:lp,isPowerOfTwo:cp,ceilPowerOfTwo:hp,floorPowerOfTwo:up,setQuaternionFromProperEuler:fp,normalize:vt,denormalize:Fn},Vc=class Vc{constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,a=this.y-e.y;return this.x=r*n-a*i+e.x,this.y=r*i+a*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Vc.prototype.isVector2=!0;let ye=Vc;class In{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,a,o){let l=n[i+0],c=n[i+1],h=n[i+2],f=n[i+3],u=r[a+0],d=r[a+1],p=r[a+2],v=r[a+3];if(f!==v||l!==u||c!==d||h!==p){let g=l*u+c*d+h*p+f*v;g<0&&(u=-u,d=-d,p=-p,v=-v,g=-g);let m=1-o;if(g<.9995){const S=Math.acos(g),w=Math.sin(S);m=Math.sin(m*S)/w,o=Math.sin(o*S)/w,l=l*m+u*o,c=c*m+d*o,h=h*m+p*o,f=f*m+v*o}else{l=l*m+u*o,c=c*m+d*o,h=h*m+p*o,f=f*m+v*o;const S=1/Math.sqrt(l*l+c*c+h*h+f*f);l*=S,c*=S,h*=S,f*=S}}e[t]=l,e[t+1]=c,e[t+2]=h,e[t+3]=f}static multiplyQuaternionsFlat(e,t,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],h=n[i+3],f=r[a],u=r[a+1],d=r[a+2],p=r[a+3];return e[t]=o*p+h*f+l*d-c*u,e[t+1]=l*p+h*u+c*f-o*d,e[t+2]=c*p+h*d+o*u-l*f,e[t+3]=h*p-o*f-l*u-c*d,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,i=e._y,r=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(i/2),f=o(r/2),u=l(n/2),d=l(i/2),p=l(r/2);switch(a){case"XYZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"YXZ":this._x=u*h*f+c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"ZXY":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f-u*d*p;break;case"ZYX":this._x=u*h*f-c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f+u*d*p;break;case"YZX":this._x=u*h*f+c*d*p,this._y=c*d*f+u*h*p,this._z=c*h*p-u*d*f,this._w=c*h*f-u*d*p;break;case"XZY":this._x=u*h*f-c*d*p,this._y=c*d*f-u*h*p,this._z=c*h*p+u*d*f,this._w=c*h*f+u*d*p;break;default:qe("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],i=t[4],r=t[8],a=t[1],o=t[5],l=t[9],c=t[2],h=t[6],f=t[10],u=n+o+f;if(u>0){const d=.5/Math.sqrt(u+1);this._w=.25/d,this._x=(h-l)*d,this._y=(r-c)*d,this._z=(a-i)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(h-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+h)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-i)/d,this._x=(r+c)/d,this._y=(l+h)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ot(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,i=e._y,r=e._z,a=e._w,o=t._x,l=t._y,c=t._z,h=t._w;return this._x=n*h+a*o+i*c-r*l,this._y=i*h+a*l+r*o-n*c,this._z=r*h+a*c+n*l-i*o,this._w=a*h-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(e,t){let n=e._x,i=e._y,r=e._z,a=e._w,o=this.dot(e);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,t=Math.sin(t*c)/h,this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+i*t,this._z=this._z*l+r*t,this._w=this._w*l+a*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Wc=class Wc{constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(hh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(hh.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=e.elements,a=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(e){const t=this.x,n=this.y,i=this.z,r=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*i-o*n),h=2*(o*t-r*i),f=2*(r*n-a*t);return this.x=t+l*c+a*f-o*h,this.y=n+l*h+o*c-r*f,this.z=i+l*f+r*h-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,i=e.y,r=e.z,a=t.x,o=t.y,l=t.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return yo.copy(this).projectOnVector(e),this.sub(yo)}reflect(e){return this.sub(yo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ot(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Wc.prototype.isVector3=!0;let O=Wc;const yo=new O,hh=new In,Xc=class Xc{constructor(e,t,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c)}set(e,t,n,i,r,a,o,l,c){const h=this.elements;return h[0]=e,h[1]=i,h[2]=o,h[3]=t,h[4]=r,h[5]=l,h[6]=n,h[7]=a,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],h=n[4],f=n[7],u=n[2],d=n[5],p=n[8],v=i[0],g=i[3],m=i[6],S=i[1],w=i[4],y=i[7],E=i[2],T=i[5],R=i[8];return r[0]=a*v+o*S+l*E,r[3]=a*g+o*w+l*T,r[6]=a*m+o*y+l*R,r[1]=c*v+h*S+f*E,r[4]=c*g+h*w+f*T,r[7]=c*m+h*y+f*R,r[2]=u*v+d*S+p*E,r[5]=u*g+d*w+p*T,r[8]=u*m+d*y+p*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8];return t*a*h-t*o*c-n*r*h+n*o*l+i*r*c-i*a*l}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=h*a-o*c,u=o*l-h*r,d=c*r-a*l,p=t*f+n*u+i*d;if(p===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/p;return e[0]=f*v,e[1]=(i*c-h*n)*v,e[2]=(o*n-i*a)*v,e[3]=u*v,e[4]=(h*t-i*l)*v,e[5]=(i*r-o*t)*v,e[6]=d*v,e[7]=(n*l-c*t)*v,e[8]=(a*t-n*r)*v,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+e,-i*c,i*l,-i*(-c*a+l*o)+o+t,0,0,1),this}scale(e,t){return ns("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(So.makeScale(e,t)),this}rotate(e){return ns("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(So.makeRotation(-e)),this}translate(e,t){return ns("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(So.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Xc.prototype.isMatrix3=!0;let st=Xc;const So=new st,uh=new st().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),fh=new st().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function dp(){const s={enabled:!0,workingColorSpace:yn,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===xt&&(i.r=yi(i.r),i.g=yi(i.g),i.b=yi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===xt&&(i.r=Ls(i.r),i.g=Ls(i.g),i.b=Ls(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Fi?ka:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return ns("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return ns("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[yn]:{primaries:e,whitePoint:n,transfer:ka,toXYZ:uh,fromXYZ:fh,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Rt},outputColorSpaceConfig:{drawingBufferColorSpace:Rt}},[Rt]:{primaries:e,whitePoint:n,transfer:xt,toXYZ:uh,fromXYZ:fh,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Rt}}}),s}const ft=dp();function yi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ls(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let hs;class pp{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{hs===void 0&&(hs=Ir("canvas")),hs.width=e.width,hs.height=e.height;const i=hs.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=hs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=Ir("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=yi(r[a]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(yi(t[n]/255)*255):t[n]=yi(t[n]);return{data:t,width:e.width,height:e.height}}else return qe("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let mp=0;class Za{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:mp++}),this.uuid=Ln(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):typeof VideoFrame<"u"&&t instanceof VideoFrame?e.set(t.displayWidth,t.displayHeight,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(bo(i[a].image)):r.push(bo(i[a]))}else r=bo(i);n.url=r}return t||(e.images[this.uuid]=n),n}}function bo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?pp.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(qe("Texture: Unable to serialize Texture."),{})}class gp extends Za{constructor(e=null){ns('Source: "Source" has been renamed to "TextureSource". Please update your code to use "THREE.TextureSource" instead.'),super(e),this.isSource=!0}}let _p=0;const Eo=new O;class Wt extends Gi{constructor(e=Wt.DEFAULT_IMAGE,t=Wt.DEFAULT_MAPPING,n=Qn,i=Qn,r=Vt,a=gi,o=Cn,l=Mn,c=Wt.DEFAULT_ANISOTROPY,h=Fi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:_p++}),this.uuid=Ln(),this.name="",this.source=new Za(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ye(0,0),this.repeat=new ye(1,1),this.center=new ye(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new st,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(Eo).x}get height(){return this.source.getSize(Eo).y}get depth(){return this.source.getSize(Eo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){qe(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){qe(`Texture.setValues(): property '${t}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Wu)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Jn:e.x=e.x-Math.floor(e.x);break;case Qn:e.x=e.x<0?0:1;break;case Ua:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Jn:e.y=e.y-Math.floor(e.y);break;case Qn:e.y=e.y<0?0:1;break;case Ua:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Wt.DEFAULT_IMAGE=null;Wt.DEFAULT_MAPPING=Wu;Wt.DEFAULT_ANISOTROPY=1;const qc=class qc{constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,i=this.z,r=this.w,a=e.elements;return this.x=a[0]*t+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*t+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*t+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*t+a[7]*n+a[11]*i+a[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r;const l=e.elements,c=l[0],h=l[4],f=l[8],u=l[1],d=l[5],p=l[9],v=l[2],g=l[6],m=l[10];if(Math.abs(h-u)<.01&&Math.abs(f-v)<.01&&Math.abs(p-g)<.01){if(Math.abs(h+u)<.1&&Math.abs(f+v)<.1&&Math.abs(p+g)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const w=(c+1)/2,y=(d+1)/2,E=(m+1)/2,T=(h+u)/4,R=(f+v)/4,x=(p+g)/4;return w>y&&w>E?w<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(w),i=T/n,r=R/n):y>E?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=T/i,r=x/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=R/r,i=x/r),this.set(n,i,r,t),this}let S=Math.sqrt((g-p)*(g-p)+(f-v)*(f-v)+(u-h)*(u-h));return Math.abs(S)<.001&&(S=1),this.x=(g-p)/S,this.y=(f-v)/S,this.z=(u-h)/S,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ot(this.x,e.x,t.x),this.y=ot(this.y,e.y,t.y),this.z=ot(this.z,e.z,t.z),this.w=ot(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ot(this.x,e,t),this.y=ot(this.y,e,t),this.z=ot(this.z,e,t),this.w=ot(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ot(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};qc.prototype.isVector4=!0;let bt=qc;class xp extends Gi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Vt,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new bt(0,0,e,t),this.scissorTest=!1,this.viewport=new bt(0,0,e,t),this.textures=[];const i={width:e,height:t,depth:n.depth},r=new Wt(i),a=n.count;for(let o=0;o<a;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){const t={minFilter:Vt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),e!==null&&e.renderTarget===null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const i=Object.assign({},e.textures[t].image);this.textures[t].source=new Za(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){const t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class kn extends xp{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class tf extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class vp extends Wt{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Gt,this.minFilter=Gt,this.wrapR=Qn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}const Ka=class Ka{constructor(e,t,n,i,r,a,o,l,c,h,f,u,d,p,v,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,a,o,l,c,h,f,u,d,p,v,g)}set(e,t,n,i,r,a,o,l,c,h,f,u,d,p,v,g){const m=this.elements;return m[0]=e,m[4]=t,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=f,m[14]=u,m[3]=d,m[7]=p,m[11]=v,m[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Ka().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return this.determinantAffine()===0?(e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this):(e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();const t=this.elements,n=e.elements,i=1/us.setFromMatrixColumn(e,0).length(),r=1/us.setFromMatrixColumn(e,1).length(),a=1/us.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*a,t[9]=n[9]*a,t[10]=n[10]*a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,i=e.y,r=e.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),h=Math.cos(r),f=Math.sin(r);if(e.order==="XYZ"){const u=a*h,d=a*f,p=o*h,v=o*f;t[0]=l*h,t[4]=-l*f,t[8]=c,t[1]=d+p*c,t[5]=u-v*c,t[9]=-o*l,t[2]=v-u*c,t[6]=p+d*c,t[10]=a*l}else if(e.order==="YXZ"){const u=l*h,d=l*f,p=c*h,v=c*f;t[0]=u+v*o,t[4]=p*o-d,t[8]=a*c,t[1]=a*f,t[5]=a*h,t[9]=-o,t[2]=d*o-p,t[6]=v+u*o,t[10]=a*l}else if(e.order==="ZXY"){const u=l*h,d=l*f,p=c*h,v=c*f;t[0]=u-v*o,t[4]=-a*f,t[8]=p+d*o,t[1]=d+p*o,t[5]=a*h,t[9]=v-u*o,t[2]=-a*c,t[6]=o,t[10]=a*l}else if(e.order==="ZYX"){const u=a*h,d=a*f,p=o*h,v=o*f;t[0]=l*h,t[4]=p*c-d,t[8]=u*c+v,t[1]=l*f,t[5]=v*c+u,t[9]=d*c-p,t[2]=-c,t[6]=o*l,t[10]=a*l}else if(e.order==="YZX"){const u=a*l,d=a*c,p=o*l,v=o*c;t[0]=l*h,t[4]=v-u*f,t[8]=p*f+d,t[1]=f,t[5]=a*h,t[9]=-o*h,t[2]=-c*h,t[6]=d*f+p,t[10]=u-v*f}else if(e.order==="XZY"){const u=a*l,d=a*c,p=o*l,v=o*c;t[0]=l*h,t[4]=-f,t[8]=c*h,t[1]=u*f+v,t[5]=a*h,t[9]=d*f-p,t[2]=p*f-d,t[6]=o*h,t[10]=v*f+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Mp,e,yp)}lookAt(e,t,n){const i=this.elements;return _n.subVectors(e,t),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Ci.crossVectors(n,_n),Ci.lengthSq()===0&&(Math.abs(n.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Ci.crossVectors(n,_n)),Ci.normalize(),$r.crossVectors(_n,Ci),i[0]=Ci.x,i[4]=$r.x,i[8]=_n.x,i[1]=Ci.y,i[5]=$r.y,i[9]=_n.y,i[2]=Ci.z,i[6]=$r.z,i[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,i=t.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],h=n[1],f=n[5],u=n[9],d=n[13],p=n[2],v=n[6],g=n[10],m=n[14],S=n[3],w=n[7],y=n[11],E=n[15],T=i[0],R=i[4],x=i[8],A=i[12],D=i[1],z=i[5],N=i[9],G=i[13],U=i[2],K=i[6],J=i[10],$=i[14],le=i[3],ee=i[7],ce=i[11],oe=i[15];return r[0]=a*T+o*D+l*U+c*le,r[4]=a*R+o*z+l*K+c*ee,r[8]=a*x+o*N+l*J+c*ce,r[12]=a*A+o*G+l*$+c*oe,r[1]=h*T+f*D+u*U+d*le,r[5]=h*R+f*z+u*K+d*ee,r[9]=h*x+f*N+u*J+d*ce,r[13]=h*A+f*G+u*$+d*oe,r[2]=p*T+v*D+g*U+m*le,r[6]=p*R+v*z+g*K+m*ee,r[10]=p*x+v*N+g*J+m*ce,r[14]=p*A+v*G+g*$+m*oe,r[3]=S*T+w*D+y*U+E*le,r[7]=S*R+w*z+y*K+E*ee,r[11]=S*x+w*N+y*J+E*ce,r[15]=S*A+w*G+y*$+E*oe,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],a=e[1],o=e[5],l=e[9],c=e[13],h=e[2],f=e[6],u=e[10],d=e[14],p=e[3],v=e[7],g=e[11],m=e[15],S=l*d-c*u,w=o*d-c*f,y=o*u-l*f,E=a*d-c*h,T=a*u-l*h,R=a*f-o*h;return t*(v*S-g*w+m*y)-n*(p*S-g*E+m*T)+i*(p*w-v*E+m*R)-r*(p*y-v*T+g*R)}determinantAffine(){const e=this.elements,t=e[0],n=e[4],i=e[8],r=e[1],a=e[5],o=e[9],l=e[2],c=e[6],h=e[10];return t*(a*h-o*c)-n*(r*h-o*l)+i*(r*c-a*l)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],a=e[4],o=e[5],l=e[6],c=e[7],h=e[8],f=e[9],u=e[10],d=e[11],p=e[12],v=e[13],g=e[14],m=e[15],S=t*o-n*a,w=t*l-i*a,y=t*c-r*a,E=n*l-i*o,T=n*c-r*o,R=i*c-r*l,x=h*v-f*p,A=h*g-u*p,D=h*m-d*p,z=f*g-u*v,N=f*m-d*v,G=u*m-d*g,U=S*G-w*N+y*z+E*D-T*A+R*x;if(U===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const K=1/U;return e[0]=(o*G-l*N+c*z)*K,e[1]=(i*N-n*G-r*z)*K,e[2]=(v*R-g*T+m*E)*K,e[3]=(u*T-f*R-d*E)*K,e[4]=(l*D-a*G-c*A)*K,e[5]=(t*G-i*D+r*A)*K,e[6]=(g*y-p*R-m*w)*K,e[7]=(h*R-u*y+d*w)*K,e[8]=(a*N-o*D+c*x)*K,e[9]=(n*D-t*N-r*x)*K,e[10]=(p*T-v*y+m*S)*K,e[11]=(f*y-h*T-d*S)*K,e[12]=(o*A-a*z-l*x)*K,e[13]=(t*z-n*A+i*x)*K,e[14]=(v*w-p*E-g*S)*K,e[15]=(h*E-f*w+u*S)*K,this}scale(e){const t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),i=Math.sin(t),r=1-n,a=e.x,o=e.y,l=e.z,c=r*a,h=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,h*o+n,h*l-i*a,0,c*l-i*o,h*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,a){return this.set(1,n,r,0,e,1,a,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){const i=this.elements,r=t._x,a=t._y,o=t._z,l=t._w,c=r+r,h=a+a,f=o+o,u=r*c,d=r*h,p=r*f,v=a*h,g=a*f,m=o*f,S=l*c,w=l*h,y=l*f,E=n.x,T=n.y,R=n.z;return i[0]=(1-(v+m))*E,i[1]=(d+y)*E,i[2]=(p-w)*E,i[3]=0,i[4]=(d-y)*T,i[5]=(1-(u+m))*T,i[6]=(g+S)*T,i[7]=0,i[8]=(p+w)*R,i[9]=(g-S)*R,i[10]=(1-(u+v))*R,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){const i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),t.identity(),this;let a=us.set(i[0],i[1],i[2]).length();const o=us.set(i[4],i[5],i[6]).length(),l=us.set(i[8],i[9],i[10]).length();r<0&&(a=-a),Dn.copy(this);const c=1/a,h=1/o,f=1/l;return Dn.elements[0]*=c,Dn.elements[1]*=c,Dn.elements[2]*=c,Dn.elements[4]*=h,Dn.elements[5]*=h,Dn.elements[6]*=h,Dn.elements[8]*=f,Dn.elements[9]*=f,Dn.elements[10]*=f,t.setFromRotationMatrix(Dn),n.x=a,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,a,o=jn,l=!1){const c=this.elements,h=2*r/(t-e),f=2*r/(n-i),u=(t+e)/(t-e),d=(n+i)/(n-i);let p,v;if(l)p=r/(a-r),v=a*r/(a-r);else if(o===jn)p=-(a+r)/(a-r),v=-2*a*r/(a-r);else if(o===Lr)p=-a/(a-r),v=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,i,r,a,o=jn,l=!1){const c=this.elements,h=2/(t-e),f=2/(n-i),u=-(t+e)/(t-e),d=-(n+i)/(n-i);let p,v;if(l)p=1/(a-r),v=a/(a-r);else if(o===jn)p=-2/(a-r),v=-(a+r)/(a-r);else if(o===Lr)p=-1/(a-r),v=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=p,c[14]=v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}};Ka.prototype.isMatrix4=!0;let at=Ka;const us=new O,Dn=new at,Mp=new O(0,0,0),yp=new O(1,1,1),Ci=new O,$r=new O,_n=new O,dh=new at,ph=new In;class bi{constructor(e=0,t=0,n=0,i=bi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const i=e.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],h=i[9],f=i[2],u=i[6],d=i[10];switch(t){case"XYZ":this._y=Math.asin(ot(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ot(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(ot(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ot(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(u,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ot(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ot(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-h,d),this._y=0);break;default:qe("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return dh.makeRotationFromQuaternion(e),this.setFromRotationMatrix(dh,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ph.setFromEuler(this),this.setFromQuaternion(ph,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}bi.DEFAULT_ORDER="XYZ";class xc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Sp=0;const mh=new O,fs=new In,oi=new at,Yr=new O,er=new O,bp=new O,Ep=new In,gh=new O(1,0,0),_h=new O(0,1,0),xh=new O(0,0,1),vh={type:"added"},Tp={type:"removed"},ds={type:"childadded",child:null},To={type:"childremoved",child:null};class wt extends Gi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Sp++}),this.uuid=Ln(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new O,t=new bi,n=new In,i=new O(1,1,1);function r(){n.setFromEuler(t,!1)}function a(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new at},normalMatrix:{value:new st}}),this.matrix=new at,this.matrixWorld=new at,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.multiply(fs),this}rotateOnWorldAxis(e,t){return fs.setFromAxisAngle(e,t),this.quaternion.premultiply(fs),this}rotateX(e){return this.rotateOnAxis(gh,e)}rotateY(e){return this.rotateOnAxis(_h,e)}rotateZ(e){return this.rotateOnAxis(xh,e)}translateOnAxis(e,t){return mh.copy(e).applyQuaternion(this.quaternion),this.position.add(mh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(gh,e)}translateY(e){return this.translateOnAxis(_h,e)}translateZ(e){return this.translateOnAxis(xh,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(oi.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Yr.copy(e):Yr.set(e,t,n);const i=this.parent;this.updateWorldMatrix(!0,!1),er.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?oi.lookAt(er,Yr,this.up):oi.lookAt(Yr,er,this.up),this.quaternion.setFromRotationMatrix(oi),i&&(oi.extractRotation(i.matrixWorld),fs.setFromRotationMatrix(oi),this.quaternion.premultiply(fs.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(je("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(vh),ds.child=e,this.dispatchEvent(ds),ds.child=null):je("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Tp),To.child=e,this.dispatchEvent(To),To.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(vh),ds.child=e,this.dispatchEvent(ds),ds.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(e,t);if(a!==void 0)return a}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,e,bp),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(er,Ep,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){}traverse(e){e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const t=e.x,n=e.y,i=e.z,r=this.matrix.elements;r[12]+=t-r[0]*t-r[4]*n-r[8]*i,r[13]+=n-r[1]*t-r[5]*n-r[9]*i,r[14]+=i-r[2]*t-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),t===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){const f=l[c];r(e.shapes,f)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));i.material=o}else i.material=r(e.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(e.animations,l))}}if(t){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),h=a(e.images),f=a(e.shapes),u=a(e.skeletons),d=a(e.animations),p=a(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),f.length>0&&(n.shapes=f),u.length>0&&(n.skeletons=u),d.length>0&&(n.animations=d),p.length>0&&(n.nodes=p)}return n.object=i,n;function a(o){const l=[];for(const c in o){const h=o[c];delete h.metadata,l.push(h)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}wt.DEFAULT_UP=new O(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class an extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const wp={type:"move"};class wo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new an,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new an,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new an,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const v of e.hand.values()){const g=t.getJointPose(v,n),m=this._getHandJoint(c,v);g!==null&&(m.matrix.fromArray(g.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=g.radius),m.visible=g!==null}const h=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],u=h.position.distanceTo(f.position),d=.02,p=.005;c.inputState.pinching&&u>d+p?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=d-p&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(wp)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new an;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const nf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},Zr={h:0,s:0,l:0};function Ao(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}class Ye{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Rt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,ft.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=ft.workingColorSpace){return this.r=e,this.g=t,this.b=n,ft.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=ft.workingColorSpace){if(e=_c(e,1),t=ot(t,0,1),n=ot(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,a=2*n-r;this.r=Ao(a,r,e+1/3),this.g=Ao(a,r,e),this.b=Ao(a,r,e-1/3)}return ft.colorSpaceToWorking(this,i),this}setStyle(e,t=Rt){function n(r){r!==void 0&&parseFloat(r)<1&&qe("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:qe("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(a===6)return this.setHex(parseInt(r,16),t);qe("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Rt){const n=nf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):qe("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=yi(e.r),this.g=yi(e.g),this.b=yi(e.b),this}copyLinearToSRGB(e){return this.r=Ls(e.r),this.g=Ls(e.g),this.b=Ls(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Rt){return ft.workingToColorSpace(tn.copy(this),e),Math.round(ot(tn.r*255,0,255))*65536+Math.round(ot(tn.g*255,0,255))*256+Math.round(ot(tn.b*255,0,255))}getHexString(e=Rt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=ft.workingColorSpace){ft.workingToColorSpace(tn.copy(this),t);const n=tn.r,i=tn.g,r=tn.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const h=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=h<=.5?f/(a+o):f/(2-a-o),a){case n:l=(i-r)/f+(i<r?6:0);break;case i:l=(r-n)/f+2;break;case r:l=(n-i)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=h,e}getRGB(e,t=ft.workingColorSpace){return ft.workingToColorSpace(tn.copy(this),t),e.r=tn.r,e.g=tn.g,e.b=tn.b,e}getStyle(e=Rt){ft.workingToColorSpace(tn.copy(this),e);const t=tn.r,n=tn.g,i=tn.b;return e!==Rt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Pi),this.setHSL(Pi.h+e,Pi.s+t,Pi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Pi),e.getHSL(Zr);const n=vr(Pi.h,Zr.h,t),i=vr(Pi.s,Zr.s,t),r=vr(Pi.l,Zr.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const tn=new Ye;Ye.NAMES=nf;class vc{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Ye(e),this.near=t,this.far=n}clone(){return new vc(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class sf extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new bi,this.environmentIntensity=1,this.environmentRotation=new bi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}const Un=new O,li=new O,Ro=new O,ci=new O,ps=new O,ms=new O,Mh=new O,Co=new O,Po=new O,Lo=new O,Io=new bt,No=new bt,Do=new bt;class Bn{constructor(e=new O,t=new O,n=new O){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Un.subVectors(e,t),i.cross(Un);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){Un.subVectors(i,t),li.subVectors(n,t),Ro.subVectors(e,t);const a=Un.dot(Un),o=Un.dot(li),l=Un.dot(Ro),c=li.dot(li),h=li.dot(Ro),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const u=1/f,d=(c*l-o*h)*u,p=(a*h-o*l)*u;return r.set(1-d-p,p,d)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,ci)===null?!1:ci.x>=0&&ci.y>=0&&ci.x+ci.y<=1}static getInterpolation(e,t,n,i,r,a,o,l){return this.getBarycoord(e,t,n,i,ci)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,ci.x),l.addScaledVector(a,ci.y),l.addScaledVector(o,ci.z),l)}static getInterpolatedAttribute(e,t,n,i,r,a){return Io.setScalar(0),No.setScalar(0),Do.setScalar(0),Io.fromBufferAttribute(e,t),No.fromBufferAttribute(e,n),Do.fromBufferAttribute(e,i),a.setScalar(0),a.addScaledVector(Io,r.x),a.addScaledVector(No,r.y),a.addScaledVector(Do,r.z),a}static isFrontFacing(e,t,n,i){return Un.subVectors(n,t),li.subVectors(e,t),Un.cross(li).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Un.subVectors(this.c,this.b),li.subVectors(this.a,this.b),Un.cross(li).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Bn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Bn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return Bn.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return Bn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Bn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,i=this.b,r=this.c;let a,o;ps.subVectors(i,n),ms.subVectors(r,n),Co.subVectors(e,n);const l=ps.dot(Co),c=ms.dot(Co);if(l<=0&&c<=0)return t.copy(n);Po.subVectors(e,i);const h=ps.dot(Po),f=ms.dot(Po);if(h>=0&&f<=h)return t.copy(i);const u=l*f-h*c;if(u<=0&&l>=0&&h<=0)return a=l/(l-h),t.copy(n).addScaledVector(ps,a);Lo.subVectors(e,r);const d=ps.dot(Lo),p=ms.dot(Lo);if(p>=0&&d<=p)return t.copy(r);const v=d*c-l*p;if(v<=0&&c>=0&&p<=0)return o=c/(c-p),t.copy(n).addScaledVector(ms,o);const g=h*p-d*f;if(g<=0&&f-h>=0&&d-p>=0)return Mh.subVectors(r,i),o=(f-h)/(f-h+(d-p)),t.copy(i).addScaledVector(Mh,o);const m=1/(g+v+u);return a=v*m,o=u*m,t.copy(n).addScaledVector(ps,a).addScaledVector(ms,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Sn{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(On.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(On.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=On.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,On):On.fromBufferAttribute(r,a),On.applyMatrix4(e.matrixWorld),this.expandByPoint(On);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Jr.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Jr.copy(n.boundingBox)),Jr.applyMatrix4(e.matrixWorld),this.union(Jr)}const i=e.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,On),On.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(tr),Qr.subVectors(this.max,tr),gs.subVectors(e.a,tr),_s.subVectors(e.b,tr),xs.subVectors(e.c,tr),Li.subVectors(_s,gs),Ii.subVectors(xs,_s),qi.subVectors(gs,xs);let t=[0,-Li.z,Li.y,0,-Ii.z,Ii.y,0,-qi.z,qi.y,Li.z,0,-Li.x,Ii.z,0,-Ii.x,qi.z,0,-qi.x,-Li.y,Li.x,0,-Ii.y,Ii.x,0,-qi.y,qi.x,0];return!Uo(t,gs,_s,xs,Qr)||(t=[1,0,0,0,1,0,0,0,1],!Uo(t,gs,_s,xs,Qr))?!1:(jr.crossVectors(Li,Ii),t=[jr.x,jr.y,jr.z],Uo(t,gs,_s,xs,Qr))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,On).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(On).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const hi=[new O,new O,new O,new O,new O,new O,new O,new O],On=new O,Jr=new Sn,gs=new O,_s=new O,xs=new O,Li=new O,Ii=new O,qi=new O,tr=new O,Qr=new O,jr=new O,Ki=new O;function Uo(s,e,t,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Ki.fromArray(s,r);const o=i.x*Math.abs(Ki.x)+i.y*Math.abs(Ki.y)+i.z*Math.abs(Ki.z),l=e.dot(Ki),c=t.dot(Ki),h=n.dot(Ki);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}const Ft=new O,ea=new ye;let Ap=0;class Qt extends Gi{constructor(e,t,n=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:Ap++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ju,this.updateRanges=[],this.gpuType=Rn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)ea.fromBufferAttribute(this,t),ea.applyMatrix3(e),this.setXY(t,ea.x,ea.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Fn(t,this.array)),t}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Fn(t,this.array)),t}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Fn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Fn(t,this.array)),t}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),i=vt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),i=vt(i,this.array),r=vt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}}class Mc extends Qt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class rf extends Qt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class dt extends Qt{constructor(e,t,n){super(new Float32Array(e),t,n)}}const Rp=new Sn,nr=new O,Oo=new O;class si{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Rp.setFromPoints(e).getCenter(n);let i=0;for(let r=0,a=e.length;r<a;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;nr.subVectors(e,this.center);const t=nr.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(nr,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Oo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(nr.copy(e.center).add(Oo)),this.expandByPoint(nr.copy(e.center).sub(Oo))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let Cp=0;const Tn=new at,Fo=new wt,vs=new O,xn=new Sn,ir=new Sn,$t=new O;class Pt extends Gi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Cp++}),this.uuid=Ln(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(qd(e)?rf:Mc)(e,1):this.index=e,this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new st().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(e){return Tn.makeRotationFromQuaternion(e),this.applyMatrix4(Tn),this}rotateX(e){return Tn.makeRotationX(e),this.applyMatrix4(Tn),this}rotateY(e){return Tn.makeRotationY(e),this.applyMatrix4(Tn),this}rotateZ(e){return Tn.makeRotationZ(e),this.applyMatrix4(Tn),this}translate(e,t,n){return Tn.makeTranslation(e,t,n),this.applyMatrix4(Tn),this}scale(e,t,n){return Tn.makeScale(e,t,n),this.applyMatrix4(Tn),this}lookAt(e){return Fo.lookAt(e),Fo.updateMatrix(),this.applyMatrix4(Fo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(vs).negate(),this.translate(vs.x,vs.y,vs.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let i=0,r=e.length;i<r;i++){const a=e[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new dt(n,3))}else{const n=Math.min(e.length,t.count);for(let i=0;i<n;i++){const r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&qe("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){const r=t[n];xn.setFromBufferAttribute(r),this.morphTargetsRelative?($t.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint($t),$t.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint($t)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&je('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new si);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){je("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const n=this.boundingSphere.center;if(xn.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const o=t[r];ir.setFromBufferAttribute(o),this.morphTargetsRelative?($t.addVectors(xn.min,ir.min),xn.expandByPoint($t),$t.addVectors(xn.max,ir.max),xn.expandByPoint($t)):(xn.expandByPoint(ir.min),xn.expandByPoint(ir.max))}xn.getCenter(n);let i=0;for(let r=0,a=e.count;r<a;r++)$t.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared($t));if(t)for(let r=0,a=t.length;r<a;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)$t.fromBufferAttribute(o,c),l&&(vs.fromBufferAttribute(e,c),$t.add(vs)),i=Math.max(i,n.distanceToSquared($t))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&je('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){je("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,i=t.normal,r=t.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Qt(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[];for(let x=0;x<n.count;x++)o[x]=new O,l[x]=new O;const c=new O,h=new O,f=new O,u=new ye,d=new ye,p=new ye,v=new O,g=new O;function m(x,A,D){c.fromBufferAttribute(n,x),h.fromBufferAttribute(n,A),f.fromBufferAttribute(n,D),u.fromBufferAttribute(r,x),d.fromBufferAttribute(r,A),p.fromBufferAttribute(r,D),h.sub(c),f.sub(c),d.sub(u),p.sub(u);const z=1/(d.x*p.y-p.x*d.y);isFinite(z)&&(v.copy(h).multiplyScalar(p.y).addScaledVector(f,-d.y).multiplyScalar(z),g.copy(f).multiplyScalar(d.x).addScaledVector(h,-p.x).multiplyScalar(z),o[x].add(v),o[A].add(v),o[D].add(v),l[x].add(g),l[A].add(g),l[D].add(g))}let S=this.groups;S.length===0&&(S=[{start:0,count:e.count}]);for(let x=0,A=S.length;x<A;++x){const D=S[x],z=D.start,N=D.count;for(let G=z,U=z+N;G<U;G+=3)m(e.getX(G+0),e.getX(G+1),e.getX(G+2))}const w=new O,y=new O,E=new O,T=new O;function R(x){E.fromBufferAttribute(i,x),T.copy(E);const A=o[x];w.copy(A),w.sub(E.multiplyScalar(E.dot(A))).normalize(),y.crossVectors(T,A);const z=y.dot(l[x])<0?-1:1;a.setXYZW(x,w.x,w.y,w.z,z)}for(let x=0,A=S.length;x<A;++x){const D=S[x],z=D.start,N=D.count;for(let G=z,U=z+N;G<U;G+=3)R(e.getX(G+0)),R(e.getX(G+1)),R(e.getX(G+2))}this._transformed=!0}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new Qt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,d=n.count;u<d;u++)n.setXYZ(u,0,0,0);const i=new O,r=new O,a=new O,o=new O,l=new O,c=new O,h=new O,f=new O;if(e)for(let u=0,d=e.count;u<d;u+=3){const p=e.getX(u+0),v=e.getX(u+1),g=e.getX(u+2);i.fromBufferAttribute(t,p),r.fromBufferAttribute(t,v),a.fromBufferAttribute(t,g),h.subVectors(a,r),f.subVectors(i,r),h.cross(f),o.fromBufferAttribute(n,p),l.fromBufferAttribute(n,v),c.fromBufferAttribute(n,g),o.add(h),l.add(h),c.add(h),n.setXYZ(p,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(g,c.x,c.y,c.z)}else for(let u=0,d=t.count;u<d;u+=3)i.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),a.fromBufferAttribute(t,u+2),h.subVectors(a,r),f.subVectors(i,r),h.cross(f),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)$t.fromBufferAttribute(e,t),$t.normalize(),e.setXYZ(t,$t.x,$t.y,$t.z)}toNonIndexed(){function e(o,l){const c=o.array,h=o.itemSize,f=o.normalized,u=new c.constructor(l.length*h);let d=0,p=0;for(let v=0,g=l.length;v<g;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*h;for(let m=0;m<h;m++)u[p++]=c[d++]}return new Qt(u,h,f)}if(this.index===null)return qe("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Pt,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let h=0,f=c.length;h<f;h++){const u=c[h],d=e(u,n);l.push(d)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],h=[];for(let f=0,u=c.length;f<u;f++){const d=c[f];h.push(d.toJSON(e.data))}h.length>0&&(i[l]=h,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const i=e.attributes;for(const c in i){const h=i[c];this.setAttribute(c,h.clone(t))}const r=e.morphAttributes;for(const c in r){const h=[],f=r[c];for(let u=0,d=f.length;u<d;u++)h.push(f[u].clone(t));this.morphAttributes[c]=h}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,h=a.length;c<h;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Pp{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ju,this.updateRanges=[],this.version=0,this.uuid=Ln()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Ln()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer)));const t={uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride};return t.usage=this.usage,t}}const cn=new O;class yc{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyMatrix4(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.applyNormalMatrix(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)cn.fromBufferAttribute(this,t),cn.transformDirection(e),this.setXYZ(t,cn.x,cn.y,cn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Fn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=vt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=vt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Fn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Fn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Fn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Fn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),i=vt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=vt(t,this.array),n=vt(n,this.array),i=vt(i,this.array),r=vt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){za("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new Qt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new yc(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){za("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}const Bo=new O,Lp=new O,Ip=new st;class di{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const i=Bo.subVectors(n,t).cross(Lp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){const i=e.delta(Bo),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:t.copy(e.start).addScaledVector(i,a)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Ip.getNormalMatrix(e),i=this.coplanarPoint(Bo).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}let Np=0;class zn extends Gi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Np++}),this.uuid=Ln(),this.name="",this.type="Material",this.blending=ts,this.side=Bi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ou,this.blendDst=Fu,this.blendEquation=ws,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ye(0,0,0),this.blendAlpha=0,this.depthFunc=wr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bd,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Mo,this.stencilZFail=Mo,this.stencilZPass=Mo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){qe(`Material: parameter '${t}' has value of undefined.`);continue}const i=this[t];if(i===void 0){qe(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(t){const r=i(e.textures),a=i(e.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(e,t){if(e.uuid!==void 0&&(this.uuid=e.uuid),e.name!==void 0&&(this.name=e.name),e.color!==void 0&&this.color!==void 0&&this.color.setHex(e.color),e.roughness!==void 0&&(this.roughness=e.roughness),e.metalness!==void 0&&(this.metalness=e.metalness),e.sheen!==void 0&&(this.sheen=e.sheen),e.sheenColor!==void 0&&(this.sheenColor=new Ye().setHex(e.sheenColor)),e.sheenRoughness!==void 0&&(this.sheenRoughness=e.sheenRoughness),e.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(e.emissive),e.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(e.specular),e.specularIntensity!==void 0&&(this.specularIntensity=e.specularIntensity),e.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(e.specularColor),e.shininess!==void 0&&(this.shininess=e.shininess),e.clearcoat!==void 0&&(this.clearcoat=e.clearcoat),e.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=e.clearcoatRoughness),e.dispersion!==void 0&&(this.dispersion=e.dispersion),e.retroreflectivity!==void 0&&(this.retroreflectivity=e.retroreflectivity),e.iridescence!==void 0&&(this.iridescence=e.iridescence),e.iridescenceIOR!==void 0&&(this.iridescenceIOR=e.iridescenceIOR),e.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessRange=e.iridescenceThicknessRange),e.transmission!==void 0&&(this.transmission=e.transmission),e.thickness!==void 0&&(this.thickness=e.thickness),e.attenuationDistance!==void 0&&(this.attenuationDistance=e.attenuationDistance),e.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(e.attenuationColor),e.anisotropy!==void 0&&(this.anisotropy=e.anisotropy),e.anisotropyRotation!==void 0&&(this.anisotropyRotation=e.anisotropyRotation),e.fog!==void 0&&(this.fog=e.fog),e.flatShading!==void 0&&(this.flatShading=e.flatShading),e.blending!==void 0&&(this.blending=e.blending),e.combine!==void 0&&(this.combine=e.combine),e.side!==void 0&&(this.side=e.side),e.shadowSide!==void 0&&(this.shadowSide=e.shadowSide),e.opacity!==void 0&&(this.opacity=e.opacity),e.transparent!==void 0&&(this.transparent=e.transparent),e.alphaTest!==void 0&&(this.alphaTest=e.alphaTest),e.alphaHash!==void 0&&(this.alphaHash=e.alphaHash),e.depthFunc!==void 0&&(this.depthFunc=e.depthFunc),e.depthTest!==void 0&&(this.depthTest=e.depthTest),e.depthWrite!==void 0&&(this.depthWrite=e.depthWrite),e.colorWrite!==void 0&&(this.colorWrite=e.colorWrite),e.clippingPlanes!==void 0&&(this.clippingPlanes=e.clippingPlanes.map(n=>new di().fromJSON(n))),e.clipIntersection!==void 0&&(this.clipIntersection=e.clipIntersection),e.clipShadows!==void 0&&(this.clipShadows=e.clipShadows),e.depthPacking!==void 0&&(this.depthPacking=e.depthPacking),e.blendSrc!==void 0&&(this.blendSrc=e.blendSrc),e.blendDst!==void 0&&(this.blendDst=e.blendDst),e.blendEquation!==void 0&&(this.blendEquation=e.blendEquation),e.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=e.blendSrcAlpha),e.blendDstAlpha!==void 0&&(this.blendDstAlpha=e.blendDstAlpha),e.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=e.blendEquationAlpha),e.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(e.blendColor),e.blendAlpha!==void 0&&(this.blendAlpha=e.blendAlpha),e.stencilWriteMask!==void 0&&(this.stencilWriteMask=e.stencilWriteMask),e.stencilFunc!==void 0&&(this.stencilFunc=e.stencilFunc),e.stencilRef!==void 0&&(this.stencilRef=e.stencilRef),e.stencilFuncMask!==void 0&&(this.stencilFuncMask=e.stencilFuncMask),e.stencilFail!==void 0&&(this.stencilFail=e.stencilFail),e.stencilZFail!==void 0&&(this.stencilZFail=e.stencilZFail),e.stencilZPass!==void 0&&(this.stencilZPass=e.stencilZPass),e.stencilWrite!==void 0&&(this.stencilWrite=e.stencilWrite),e.wireframe!==void 0&&(this.wireframe=e.wireframe),e.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=e.wireframeLinewidth),e.wireframeLinecap!==void 0&&(this.wireframeLinecap=e.wireframeLinecap),e.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=e.wireframeLinejoin),e.rotation!==void 0&&(this.rotation=e.rotation),e.linewidth!==void 0&&(this.linewidth=e.linewidth),e.linecap!==void 0&&(this.linecap=e.linecap),e.linejoin!==void 0&&(this.linejoin=e.linejoin),e.dashSize!==void 0&&(this.dashSize=e.dashSize),e.gapSize!==void 0&&(this.gapSize=e.gapSize),e.scale!==void 0&&(this.scale=e.scale),e.polygonOffset!==void 0&&(this.polygonOffset=e.polygonOffset),e.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=e.polygonOffsetFactor),e.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=e.polygonOffsetUnits),e.dithering!==void 0&&(this.dithering=e.dithering),e.alphaToCoverage!==void 0&&(this.alphaToCoverage=e.alphaToCoverage),e.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=e.premultipliedAlpha),e.forceSinglePass!==void 0&&(this.forceSinglePass=e.forceSinglePass),e.allowOverride!==void 0&&(this.allowOverride=e.allowOverride),e.visible!==void 0&&(this.visible=e.visible),e.toneMapped!==void 0&&(this.toneMapped=e.toneMapped),e.userData!==void 0&&(this.userData=e.userData),e.vertexColors!==void 0&&(typeof e.vertexColors=="number"?this.vertexColors=e.vertexColors>0:this.vertexColors=e.vertexColors),e.size!==void 0&&(this.size=e.size),e.sizeAttenuation!==void 0&&(this.sizeAttenuation=e.sizeAttenuation),e.map!==void 0&&(this.map=t[e.map]||null),e.matcap!==void 0&&(this.matcap=t[e.matcap]||null),e.alphaMap!==void 0&&(this.alphaMap=t[e.alphaMap]||null),e.bumpMap!==void 0&&(this.bumpMap=t[e.bumpMap]||null),e.bumpScale!==void 0&&(this.bumpScale=e.bumpScale),e.normalMap!==void 0&&(this.normalMap=t[e.normalMap]||null),e.normalMapType!==void 0&&(this.normalMapType=e.normalMapType),e.normalScale!==void 0){let n=e.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ye().fromArray(n)}return e.displacementMap!==void 0&&(this.displacementMap=t[e.displacementMap]||null),e.displacementScale!==void 0&&(this.displacementScale=e.displacementScale),e.displacementBias!==void 0&&(this.displacementBias=e.displacementBias),e.roughnessMap!==void 0&&(this.roughnessMap=t[e.roughnessMap]||null),e.metalnessMap!==void 0&&(this.metalnessMap=t[e.metalnessMap]||null),e.emissiveMap!==void 0&&(this.emissiveMap=t[e.emissiveMap]||null),e.emissiveIntensity!==void 0&&(this.emissiveIntensity=e.emissiveIntensity),e.specularMap!==void 0&&(this.specularMap=t[e.specularMap]||null),e.specularIntensityMap!==void 0&&(this.specularIntensityMap=t[e.specularIntensityMap]||null),e.specularColorMap!==void 0&&(this.specularColorMap=t[e.specularColorMap]||null),e.envMap!==void 0&&(this.envMap=t[e.envMap]||null),e.envMapRotation!==void 0&&this.envMapRotation.fromArray(e.envMapRotation),e.envMapIntensity!==void 0&&(this.envMapIntensity=e.envMapIntensity),e.reflectivity!==void 0&&(this.reflectivity=e.reflectivity),e.refractionRatio!==void 0&&(this.refractionRatio=e.refractionRatio),e.lightMap!==void 0&&(this.lightMap=t[e.lightMap]||null),e.lightMapIntensity!==void 0&&(this.lightMapIntensity=e.lightMapIntensity),e.aoMap!==void 0&&(this.aoMap=t[e.aoMap]||null),e.aoMapIntensity!==void 0&&(this.aoMapIntensity=e.aoMapIntensity),e.gradientMap!==void 0&&(this.gradientMap=t[e.gradientMap]||null),e.clearcoatMap!==void 0&&(this.clearcoatMap=t[e.clearcoatMap]||null),e.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null),e.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null),e.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ye().fromArray(e.clearcoatNormalScale)),e.iridescenceMap!==void 0&&(this.iridescenceMap=t[e.iridescenceMap]||null),e.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null),e.transmissionMap!==void 0&&(this.transmissionMap=t[e.transmissionMap]||null),e.thicknessMap!==void 0&&(this.thicknessMap=t[e.thicknessMap]||null),e.anisotropyMap!==void 0&&(this.anisotropyMap=t[e.anisotropyMap]||null),e.sheenColorMap!==void 0&&(this.sheenColorMap=t[e.sheenColorMap]||null),e.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const ui=new O,ko=new O,ta=new O,na=new O;class Hs{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ui)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ui.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ui.copy(this.origin).addScaledVector(this.direction,t),ui.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){ko.copy(e).add(t).multiplyScalar(.5),ta.copy(t).sub(e).normalize(),na.copy(this.origin).sub(ko);const r=e.distanceTo(t)*.5,a=-this.direction.dot(ta),o=na.dot(this.direction),l=-na.dot(ta),c=na.lengthSq(),h=Math.abs(1-a*a);let f,u,d,p;if(h>0)if(f=a*l-o,u=a*o-l,p=r*h,f>=0)if(u>=-p)if(u<=p){const v=1/h;f*=v,u*=v,d=f*(f+a*u+2*o)+u*(a*f+u+2*l)+c}else u=r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u=-r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;else u<=-p?(f=Math.max(0,-(-a*r+o)),u=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c):u<=p?(f=0,u=Math.min(Math.max(-r,-l),r),d=u*(u+2*l)+c):(f=Math.max(0,-(a*r+o)),u=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+u*(u+2*l)+c);else u=a>0?-r:r,f=Math.max(0,-(a*u+o)),d=-f*f+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(ko).addScaledVector(ta,u),d}intersectSphere(e,t){if(e.radius<0)return null;ui.subVectors(e.center,this.origin);const n=ui.dot(this.direction),i=ui.dot(ui)-n*n,r=e.radius*e.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,a,o,l;const c=1/this.direction.x,h=1/this.direction.y,f=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,i=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,i=(e.min.x-u.x)*c),h>=0?(r=(e.min.y-u.y)*h,a=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,a=(e.min.y-u.y)*h),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),f>=0?(o=(e.min.z-u.z)*f,l=(e.max.z-u.z)*f):(o=(e.max.z-u.z)*f,l=(e.min.z-u.z)*f),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ui)!==null}intersectTriangle(e,t,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,f=e.x-a.x,u=e.y-a.y,d=e.z-a.z,p=t.x-a.x,v=t.y-a.y,g=t.z-a.z,m=n.x-a.x,S=n.y-a.y,w=n.z-a.z,y=Math.abs(l),E=Math.abs(c),T=Math.abs(h);let R,x,A,D,z,N,G,U,K,J,$,le;if(y>=E&&y>=T?(A=l,N=f,K=p,le=m,l>=0?(R=c,x=h,D=u,z=d,G=v,U=g,J=S,$=w):(R=h,x=c,D=d,z=u,G=g,U=v,J=w,$=S)):E>=T?(A=c,N=u,K=v,le=S,c>=0?(R=h,x=l,D=d,z=f,G=g,U=p,J=w,$=m):(R=l,x=h,D=f,z=d,G=p,U=g,J=m,$=w)):(A=h,N=d,K=g,le=w,h>=0?(R=l,x=c,D=f,z=u,G=p,U=v,J=m,$=S):(R=c,x=l,D=u,z=f,G=v,U=p,J=S,$=m)),A===0)return null;const ee=R/A,ce=x/A,oe=1/A,Le=D-ee*N,Ee=z-ce*N,nt=G-ee*K,$e=U-ce*K,Je=J-ee*le,ie=$-ce*le,he=Je*$e-ie*nt,fe=Le*ie-Ee*Je,Ie=nt*Ee-$e*Le;if(i){if(he<0||fe<0||Ie<0)return null}else if((he<0||fe<0||Ie<0)&&(he>0||fe>0||Ie>0))return null;const ue=he+fe+Ie;if(ue===0)return null;const Ce=oe*(he*N+fe*K+Ie*le);return(ue>0?Ce<0:Ce>0)?null:this.at(Ce/ue,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Pn extends zn{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const yh=new at,$i=new Hs,ia=new si,Sh=new O,sa=new O,ra=new O,aa=new O,zo=new O,oa=new O,bh=new O,la=new O;class _t extends wt{constructor(e=new Pt,t=new Pn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;t.fromBufferAttribute(i,e);const o=this.morphTargetInfluences;if(r&&o){oa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const h=o[l],f=r[l];h!==0&&(zo.fromBufferAttribute(f,e),a?oa.addScaledVector(zo,h):oa.addScaledVector(zo.sub(t),h))}t.add(oa)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ia.copy(n.boundingSphere),ia.applyMatrix4(r),$i.copy(e.ray).recast(e.near),!(ia.containsPoint($i.origin)===!1&&($i.intersectSphere(ia,Sh)===null||$i.origin.distanceToSquared(Sh)>(e.far-e.near)**2))&&(yh.copy(r).invert(),$i.copy(e.ray).applyMatrix4(yh),!(n.boundingBox!==null&&$i.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,$i)))}_computeIntersections(e,t,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,h=r.attributes.uv1,f=r.attributes.normal,u=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let p=0,v=u.length;p<v;p++){const g=u[p],m=a[g.materialIndex],S=Math.max(g.start,d.start),w=Math.min(o.count,Math.min(g.start+g.count,d.start+d.count));for(let y=S,E=w;y<E;y+=3){const T=o.getX(y),R=o.getX(y+1),x=o.getX(y+2);i=ca(this,m,e,n,c,h,f,T,R,x),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){const S=o.getX(g),w=o.getX(g+1),y=o.getX(g+2);i=ca(this,a,e,n,c,h,f,S,w,y),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let p=0,v=u.length;p<v;p++){const g=u[p],m=a[g.materialIndex],S=Math.max(g.start,d.start),w=Math.min(l.count,Math.min(g.start+g.count,d.start+d.count));for(let y=S,E=w;y<E;y+=3){const T=y,R=y+1,x=y+2;i=ca(this,m,e,n,c,h,f,T,R,x),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=g.materialIndex,t.push(i))}}else{const p=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let g=p,m=v;g<m;g+=3){const S=g,w=g+1,y=g+2;i=ca(this,a,e,n,c,h,f,S,w,y),i&&(i.faceIndex=Math.floor(g/3),t.push(i))}}}}function Dp(s,e,t,n,i,r,a,o){let l;if(e.side===on?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,e.side===Bi,o),l===null)return null;la.copy(o),la.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(la);return c<t.near||c>t.far?null:{distance:c,point:la.clone(),object:s}}function ca(s,e,t,n,i,r,a,o,l,c){s.getVertexPosition(o,sa),s.getVertexPosition(l,ra),s.getVertexPosition(c,aa);const h=Dp(s,e,t,n,sa,ra,aa,bh);if(h){const f=new O;Bn.getBarycoord(bh,sa,ra,aa,f),i&&(h.uv=Bn.getInterpolatedAttribute(i,o,l,c,f,new ye)),r&&(h.uv1=Bn.getInterpolatedAttribute(r,o,l,c,f,new ye)),a&&(h.normal=Bn.getInterpolatedAttribute(a,o,l,c,f,new O),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new O,materialIndex:0};Bn.getNormal(sa,ra,aa,u.normal),h.face=u,h.barycoord=f}return h}const sr=new bt,Eh=new bt,Th=new bt,Up=new bt,wh=new at,ha=new O,Ho=new si,Ah=new at,Go=new Hs;class af extends _t{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=nh,this.bindMatrix=new at,this.bindMatrixInverse=new at,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){const e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Sn),this.boundingBox.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ha),this.boundingBox.expandByPoint(ha)}computeBoundingSphere(){const e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new si),this.boundingSphere.makeEmpty();const t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ha),this.boundingSphere.expandByPoint(ha)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){const n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ho.copy(this.boundingSphere),Ho.applyMatrix4(i),e.ray.intersectsSphere(Ho)!==!1&&(Ah.copy(i).invert(),Go.copy(e.ray).applyMatrix4(Ah),!(this.boundingBox!==null&&Go.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,Go)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){const e=new bt,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);const r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===nh?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===Nd?this.bindMatrixInverse.copy(this.bindMatrix).invert():qe("SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){const n=this.skeleton,i=this.geometry;Eh.fromBufferAttribute(i.attributes.skinIndex,e),Th.fromBufferAttribute(i.attributes.skinWeight,e),t.isVector4?(sr.copy(t),t.set(0,0,0,0)):(sr.set(...t,1),t.set(0,0,0)),sr.applyMatrix4(this.bindMatrix);for(let r=0;r<4;r++){const a=Th.getComponent(r);if(a!==0){const o=Eh.getComponent(r);wh.multiplyMatrices(n.bones[o].matrixWorld,n.boneInverses[o]),t.addScaledVector(Up.copy(sr).applyMatrix4(wh),a)}}return t.isVector4&&(t.w=sr.w),t.applyMatrix4(this.bindMatrixInverse)}}class Sc extends wt{constructor(){super(),this.isBone=!0,this.type="Bone"}}class bc extends Wt{constructor(e=null,t=1,n=1,i,r,a,o,l,c=Gt,h=Gt,f,u){super(null,a,o,l,c,h,i,r,f,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Rh=new at,Op=new at;class Ja{constructor(e=[],t=[]){this.uuid=Ln(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){const e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){qe("Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new at)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){const n=new at;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){const n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){const e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,a=e.length;r<a;r++){const o=e[r]?e[r].matrixWorld:Op;Rh.multiplyMatrices(o,t[r]),Rh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new Ja(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);const t=new Float32Array(e*e*4);t.set(this.boneMatrices);const n=new bc(t,e,e,Cn,Rn);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){const i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){const r=e.bones[n];let a=t[r];a===void 0&&(qe("Skeleton: No bone found with UUID:",r),a=new Sc),this.bones.push(a),this.boneInverses.push(new at().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){const e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;const t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){const a=t[i];e.bones.push(a.uuid);const o=n[i];e.boneInverses.push(o.toArray())}return e}}class Ha extends Qt{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Ms=new at,Ch=new at,ua=[],Ph=new Sn,Fp=new at,rr=new _t,ar=new si;class _i extends _t{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Ha(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Fp)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ms),Ph.copy(e.boundingBox).applyMatrix4(Ms),this.boundingBox.union(Ph)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new si),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Ms),ar.copy(e.boundingSphere).applyMatrix4(Ms),this.boundingSphere.union(ar)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){return this.instanceColor===null?t.setRGB(1,1,1):t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){return t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=e*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(e,t){const n=this.matrixWorld,i=this.count;if(rr.geometry=this.geometry,rr.material=this.material,rr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ar.copy(this.boundingSphere),ar.applyMatrix4(n),e.ray.intersectsSphere(ar)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Ms),Ch.multiplyMatrices(n,Ms),rr.matrixWorld=Ch,rr.raycast(e,ua);for(let a=0,o=ua.length;a<o;a++){const l=ua[a];l.instanceId=r,l.object=this,t.push(l)}ua.length=0}}setColorAt(e,t){return this.instanceColor===null&&(this.instanceColor=new Ha(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3),this}setMatrixAt(e,t){return t.toArray(this.instanceMatrix.array,e*16),this}setMorphAt(e,t){const n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new bc(new Float32Array(i*this.count),i,this.count,uc,Rn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*e;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Yi=new si,Bp=new ye(.5,.5),fa=new O;class Ec{constructor(e=new di,t=new di,n=new di,i=new di,r=new di,a=new di){this.planes=[e,t,n,i,r,a]}set(e,t,n,i,r,a){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=jn,n=!1){const i=this.planes,r=e.elements,a=r[0],o=r[1],l=r[2],c=r[3],h=r[4],f=r[5],u=r[6],d=r[7],p=r[8],v=r[9],g=r[10],m=r[11],S=r[12],w=r[13],y=r[14],E=r[15];if(i[0].setComponents(c-a,d-h,m-p,E-S).normalize(),i[1].setComponents(c+a,d+h,m+p,E+S).normalize(),i[2].setComponents(c+o,d+f,m+v,E+w).normalize(),i[3].setComponents(c-o,d-f,m-v,E-w).normalize(),n)i[4].setComponents(l,u,g,y).normalize(),i[5].setComponents(c-l,d-u,m-g,E-y).normalize();else if(i[4].setComponents(c-l,d-u,m-g,E-y).normalize(),t===jn)i[5].setComponents(c+l,d+u,m+g,E+y).normalize();else if(t===Lr)i[5].setComponents(l,u,g,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Yi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Yi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Yi)}intersectsSprite(e){Yi.center.set(0,0,0);const t=Bp.distanceTo(e.center);return Yi.radius=.7071067811865476+t,Yi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Yi)}intersectsSphere(e){const t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const i=t[n];if(fa.x=i.normal.x>0?e.max.x:e.min.x,fa.y=i.normal.y>0?e.max.y:e.min.y,fa.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(fa)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class Tc extends zn{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Ye(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Ga=new O,Va=new O,Lh=new at,or=new Hs,da=new si,Vo=new O,Ih=new O;class Qa extends wt{constructor(e=new Pt,t=new Tc){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)Ga.fromBufferAttribute(t,i-1),Va.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=Ga.distanceTo(Va);e.setAttribute("lineDistance",new dt(n,1))}else qe("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),da.copy(n.boundingSphere),da.applyMatrix4(i),da.radius+=r,e.ray.intersectsSphere(da)===!1)return;Lh.copy(i).invert(),or.copy(e.ray).applyMatrix4(Lh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const d=Math.max(0,a.start),p=Math.min(h.count,a.start+a.count);for(let v=d,g=p-1;v<g;v+=c){const m=h.getX(v),S=h.getX(v+1),w=pa(this,e,or,l,m,S,v);w&&t.push(w)}if(this.isLineLoop){const v=h.getX(p-1),g=h.getX(d),m=pa(this,e,or,l,v,g,p-1);m&&t.push(m)}}else{const d=Math.max(0,a.start),p=Math.min(u.count,a.start+a.count);for(let v=d,g=p-1;v<g;v+=c){const m=pa(this,e,or,l,v,v+1,v);m&&t.push(m)}if(this.isLineLoop){const v=pa(this,e,or,l,p-1,d,p-1);v&&t.push(v)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function pa(s,e,t,n,i,r,a){const o=s.geometry.attributes.position;if(Ga.fromBufferAttribute(o,i),Va.fromBufferAttribute(o,r),t.distanceSqToSegment(Ga,Va,Vo,Ih)>n)return;Vo.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Vo);if(!(c<e.near||c>e.far))return{distance:c,point:Ih.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const Nh=new O,Dh=new O;class kp extends Qa{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Nh.fromBufferAttribute(t,i),Dh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Nh.distanceTo(Dh);e.setAttribute("lineDistance",new dt(n,1))}else qe("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class zp extends Qa{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}}class wc extends zn{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Ye(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const Uh=new at,Kl=new Hs,ma=new si,ga=new O;class of extends wt{constructor(e=new Pt,t=new wc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){const n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),ma.copy(n.boundingSphere),ma.applyMatrix4(i),ma.radius+=r,e.ray.intersectsSphere(ma)===!1)return;Uh.copy(i).invert(),Kl.copy(e.ray).applyMatrix4(Uh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,f=n.attributes.position;if(c!==null){const u=Math.max(0,a.start),d=Math.min(c.count,a.start+a.count);for(let p=u,v=d;p<v;p++){const g=c.getX(p);ga.fromBufferAttribute(f,g),Oh(ga,g,l,i,e,t,this)}}else{const u=Math.max(0,a.start),d=Math.min(f.count,a.start+a.count);for(let p=u,v=d;p<v;p++)ga.fromBufferAttribute(f,p),Oh(ga,p,l,i,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Oh(s,e,t,n,i,r,a){const o=Kl.distanceSqToPoint(s);if(o<t){const l=new O;Kl.closestPointToPoint(s,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:a})}}class lf extends Wt{constructor(e=[],t=is,n,i,r,a,o,l,c,h){super(e,t,n,i,r,a,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Zi extends Wt{constructor(e,t,n,i,r,a,o,l,c){super(e,t,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Nr extends Wt{constructor(e,t,n=ti,i,r,a,o=Gt,l=Gt,c,h=Si,f=1){if(h!==Si&&h!==ji)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:f};super(u,i,r,a,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Za(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Hp extends Nr{constructor(e,t=ti,n=is,i,r,a=Gt,o=Gt,l,c=Si){const h={width:e,height:e,depth:1},f=[h,h,h,h,h,h];super(e,e,t,n,i,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class cf extends Wt{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Vi extends Pt{constructor(e=1,t=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],h=[],f=[];let u=0,d=0;p("z","y","x",-1,-1,n,t,e,a,r,0),p("z","y","x",1,-1,n,t,-e,a,r,1),p("x","z","y",1,1,e,n,t,i,a,2),p("x","z","y",1,-1,e,n,-t,i,a,3),p("x","y","z",1,-1,e,t,n,i,r,4),p("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new dt(c,3)),this.setAttribute("normal",new dt(h,3)),this.setAttribute("uv",new dt(f,2));function p(v,g,m,S,w,y,E,T,R,x,A){const D=y/R,z=E/x,N=y/2,G=E/2,U=T/2,K=R+1,J=x+1;let $=0,le=0;const ee=new O;for(let ce=0;ce<J;ce++){const oe=ce*z-G;for(let Le=0;Le<K;Le++){const Ee=Le*D-N;ee[v]=Ee*S,ee[g]=oe*w,ee[m]=U,c.push(ee.x,ee.y,ee.z),ee[v]=0,ee[g]=0,ee[m]=T>0?1:-1,h.push(ee.x,ee.y,ee.z),f.push(Le/R),f.push(1-ce/x),$+=1}}for(let ce=0;ce<x;ce++)for(let oe=0;oe<R;oe++){const Le=u+oe+K*ce,Ee=u+oe+K*(ce+1),nt=u+(oe+1)+K*(ce+1),$e=u+(oe+1)+K*ce;l.push(Le,Ee,$e),l.push(Ee,nt,$e),le+=6}o.addGroup(d,le,A),d+=le,u+=$}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Ac extends Pt{constructor(e=1,t=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:e,segments:t,thetaStart:n,thetaLength:i},t=Math.max(3,t);const r=[],a=[],o=[],l=[],c=new O,h=new ye;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,u=3;f<=t;f++,u+=3){const d=n+f/t*i;c.x=e*Math.cos(d),c.y=e*Math.sin(d),a.push(c.x,c.y,c.z),o.push(0,0,1),h.x=(a[u]/e+1)/2,h.y=(a[u+1]/e+1)/2,l.push(h.x,h.y)}for(let f=1;f<=t;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new dt(a,3)),this.setAttribute("normal",new dt(o,3)),this.setAttribute("uv",new dt(l,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ac(e.radius,e.segments,e.thetaStart,e.thetaLength)}}class dn extends Pt{constructor(e=1,t=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const h=[],f=[],u=[],d=[];let p=0;const v=[],g=n/2;let m=0;S(),a===!1&&(e>0&&w(!0),t>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new dt(f,3)),this.setAttribute("normal",new dt(u,3)),this.setAttribute("uv",new dt(d,2));function S(){const y=new O,E=new O;let T=0;const R=(t-e)/n;for(let x=0;x<=r;x++){const A=[],D=x/r,z=D*(t-e)+e;for(let N=0;N<=i;N++){const G=N/i,U=G*l+o,K=Math.sin(U),J=Math.cos(U);E.x=z*K,E.y=-D*n+g,E.z=z*J,f.push(E.x,E.y,E.z),y.set(K,R,J).normalize(),u.push(y.x,y.y,y.z),d.push(G,1-D),A.push(p++)}v.push(A)}for(let x=0;x<i;x++)for(let A=0;A<r;A++){const D=v[A][x],z=v[A+1][x],N=v[A+1][x+1],G=v[A][x+1];(e>0||A!==0)&&(h.push(D,z,G),T+=3),(t>0||A!==r-1)&&(h.push(z,N,G),T+=3)}c.addGroup(m,T,0),m+=T}function w(y){const E=p,T=new ye,R=new O;let x=0;const A=y===!0?e:t,D=y===!0?1:-1;for(let N=1;N<=i;N++)f.push(0,g*D,0),u.push(0,D,0),d.push(.5,.5),p++;const z=p;for(let N=0;N<=i;N++){const U=N/i*l+o,K=Math.cos(U),J=Math.sin(U);R.x=A*J,R.y=g*D,R.z=A*K,f.push(R.x,R.y,R.z),u.push(0,D,0),T.x=K*.5+.5,T.y=J*.5*D+.5,d.push(T.x,T.y),p++}for(let N=0;N<i;N++){const G=E+N,U=z+N;y===!0?h.push(U,U+1,G):h.push(U+1,U,G),x+=3}c.addGroup(m,x,y===!0?1:2),m+=x}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Rc extends dn{constructor(e=1,t=1,n=32,i=1,r=!1,a=0,o=Math.PI*2){super(0,e,t,n,i,r,a,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:i,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(e){return new Rc(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ja extends Pt{constructor(e=[],t=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:t,radius:n,detail:i};const r=[],a=[];o(i),c(n),h(),this.setAttribute("position",new dt(r,3)),this.setAttribute("normal",new dt(r.slice(),3)),this.setAttribute("uv",new dt(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(S){const w=new O,y=new O,E=new O;for(let T=0;T<t.length;T+=3)d(t[T+0],w),d(t[T+1],y),d(t[T+2],E),l(w,y,E,S)}function l(S,w,y,E){const T=E+1,R=[];for(let x=0;x<=T;x++){R[x]=[];const A=S.clone().lerp(y,x/T),D=w.clone().lerp(y,x/T),z=T-x;for(let N=0;N<=z;N++)N===0&&x===T?R[x][N]=A:R[x][N]=A.clone().lerp(D,N/z)}for(let x=0;x<T;x++)for(let A=0;A<2*(T-x)-1;A++){const D=Math.floor(A/2);A%2===0?(u(R[x][D+1]),u(R[x+1][D]),u(R[x][D])):(u(R[x][D+1]),u(R[x+1][D+1]),u(R[x+1][D]))}}function c(S){const w=new O;for(let y=0;y<r.length;y+=3)w.x=r[y+0],w.y=r[y+1],w.z=r[y+2],w.normalize().multiplyScalar(S),r[y+0]=w.x,r[y+1]=w.y,r[y+2]=w.z}function h(){const S=new O;for(let w=0;w<r.length;w+=3){S.x=r[w+0],S.y=r[w+1],S.z=r[w+2];const y=g(S)/2/Math.PI+.5,E=m(S)/Math.PI+.5;a.push(y,1-E)}p(),f()}function f(){for(let S=0;S<a.length;S+=6){const w=a[S+0],y=a[S+2],E=a[S+4],T=Math.max(w,y,E),R=Math.min(w,y,E);T>.9&&R<.1&&(w<.2&&(a[S+0]+=1),y<.2&&(a[S+2]+=1),E<.2&&(a[S+4]+=1))}}function u(S){r.push(S.x,S.y,S.z)}function d(S,w){const y=S*3;w.x=e[y+0],w.y=e[y+1],w.z=e[y+2]}function p(){const S=new O,w=new O,y=new O,E=new O,T=new ye,R=new ye,x=new ye;for(let A=0,D=0;A<r.length;A+=9,D+=6){S.set(r[A+0],r[A+1],r[A+2]),w.set(r[A+3],r[A+4],r[A+5]),y.set(r[A+6],r[A+7],r[A+8]),T.set(a[D+0],a[D+1]),R.set(a[D+2],a[D+3]),x.set(a[D+4],a[D+5]),E.copy(S).add(w).add(y).divideScalar(3);const z=g(E);v(T,D+0,S,z),v(R,D+2,w,z),v(x,D+4,y,z)}}function v(S,w,y,E){E<0&&S.x===1&&(a[w]=S.x-1),y.x===0&&y.z===0&&(a[w]=E/2/Math.PI+.5)}function g(S){return Math.atan2(S.z,-S.x)}function m(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ja(e.vertices,e.indices,e.radius,e.detail)}}class ri{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){qe("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,i=this.getPoint(0),r=0;t.push(0);for(let a=1;a<=e;a++)n=this.getPoint(a/e),r+=n.distanceTo(i),t.push(r),i=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let i=0;const r=n.length;let a;t?a=t:a=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const h=n[i],u=n[i+1]-h,d=(a-h)/u;return(i+d)/(r-1)}getTangent(e,t){let i=e-1e-4,r=e+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=t||(a.isVector2?new ye:new O);return l.copy(o).sub(a).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new O,i=[],r=[],a=[],o=new O,l=new at;for(let d=0;d<=e;d++){const p=d/e;i[d]=this.getTangentAt(p,new O)}r[0]=new O,a[0]=new O;let c=Number.MAX_VALUE;const h=Math.abs(i[0].x),f=Math.abs(i[0].y),u=Math.abs(i[0].z);h<=c&&(c=h,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let d=1;d<=e;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(i[d-1],i[d]),o.length()>Number.EPSILON){o.normalize();const p=Math.acos(ot(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,p))}a[d].crossVectors(i[d],r[d])}if(t===!0){let d=Math.acos(ot(r[0].dot(r[e]),-1,1));d/=e,i[0].dot(o.crossVectors(r[0],r[e]))>0&&(d=-d);for(let p=1;p<=e;p++)r[p].applyMatrix4(l.makeRotationAxis(i[p],d*p)),a[p].crossVectors(i[p],r[p])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Cc extends ri{constructor(e=0,t=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(e,t=new ye){const n=t,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const h=Math.cos(this.aRotation),f=Math.sin(this.aRotation),u=l-this.aX,d=c-this.aY;l=u*h-d*f+this.aX,c=u*f+d*h+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Gp extends Cc{constructor(e,t,n,i,r,a){super(e,t,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function Pc(){let s=0,e=0,t=0,n=0;function i(r,a,o,l){s=r,e=o,t=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,h,f){let u=(a-r)/c-(o-r)/(c+h)+(o-a)/h,d=(o-a)/h-(l-a)/(h+f)+(l-o)/f;u*=h,d*=h,i(a,o,u,d)},calc:function(r){const a=r*r,o=a*r;return s+e*r+t*a+n*o}}}const Fh=new O,Bh=new O,Wo=new Pc,Xo=new Pc,qo=new Pc;class Vp extends ri{constructor(e=[],t=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=i}getPoint(e,t=new O){const n=t,i=this.points,r=i.length,a=(r-(this.closed?0:1))*e;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,h;this.closed||o>0?c=i[(o-1)%r]:(Bh.subVectors(i[0],i[1]).add(i[0]),c=Bh);const f=i[o%r],u=i[(o+1)%r];if(this.closed||o+2<r?h=i[(o+2)%r]:(Fh.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Fh),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let p=Math.pow(c.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(u),d),g=Math.pow(u.distanceToSquared(h),d);v<1e-4&&(v=1),p<1e-4&&(p=v),g<1e-4&&(g=v),Wo.initNonuniformCatmullRom(c.x,f.x,u.x,h.x,p,v,g),Xo.initNonuniformCatmullRom(c.y,f.y,u.y,h.y,p,v,g),qo.initNonuniformCatmullRom(c.z,f.z,u.z,h.z,p,v,g)}else this.curveType==="catmullrom"&&(Wo.initCatmullRom(c.x,f.x,u.x,h.x,this.tension),Xo.initCatmullRom(c.y,f.y,u.y,h.y,this.tension),qo.initCatmullRom(c.z,f.z,u.z,h.z,this.tension));return n.set(Wo.calc(l),Xo.calc(l),qo.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new O().fromArray(i))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function kh(s,e,t,n,i){const r=(n-e)*.5,a=(i-t)*.5,o=s*s,l=s*o;return(2*t-2*n+r+a)*l+(-3*t+3*n-2*r-a)*o+r*s+t}function Wp(s,e){const t=1-s;return t*t*e}function Xp(s,e){return 2*(1-s)*s*e}function qp(s,e){return s*s*e}function Mr(s,e,t,n){return Wp(s,e)+Xp(s,t)+qp(s,n)}function Kp(s,e){const t=1-s;return t*t*t*e}function $p(s,e){const t=1-s;return 3*t*t*s*e}function Yp(s,e){return 3*(1-s)*s*s*e}function Zp(s,e){return s*s*s*e}function yr(s,e,t,n,i){return Kp(s,e)+$p(s,t)+Yp(s,n)+Zp(s,i)}class hf extends ri{constructor(e=new ye,t=new ye,n=new ye,i=new ye){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new ye){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(yr(e,i.x,r.x,a.x,o.x),yr(e,i.y,r.y,a.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Jp extends ri{constructor(e=new O,t=new O,n=new O,i=new O){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=i}getPoint(e,t=new O){const n=t,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(yr(e,i.x,r.x,a.x,o.x),yr(e,i.y,r.y,a.y,o.y),yr(e,i.z,r.z,a.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class uf extends ri{constructor(e=new ye,t=new ye){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new ye){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new ye){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Qp extends ri{constructor(e=new O,t=new O){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new O){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new O){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class ff extends ri{constructor(e=new ye,t=new ye,n=new ye){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new ye){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Mr(e,i.x,r.x,a.x),Mr(e,i.y,r.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class jp extends ri{constructor(e=new O,t=new O,n=new O){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new O){const n=t,i=this.v0,r=this.v1,a=this.v2;return n.set(Mr(e,i.x,r.x,a.x),Mr(e,i.y,r.y,a.y),Mr(e,i.z,r.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class df extends ri{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new ye){const n=t,i=this.points,r=(i.length-1)*e,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],h=i[a>i.length-2?i.length-1:a+1],f=i[a>i.length-3?i.length-1:a+2];return n.set(kh(o,l.x,c.x,h.x,f.x),kh(o,l.y,c.y,h.y,f.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const i=this.points[t];e.points.push(i.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const i=e.points[t];this.points.push(new ye().fromArray(i))}return this}}var $l=Object.freeze({__proto__:null,ArcCurve:Gp,CatmullRomCurve3:Vp,CubicBezierCurve:hf,CubicBezierCurve3:Jp,EllipseCurve:Cc,LineCurve:uf,LineCurve3:Qp,QuadraticBezierCurve:ff,QuadraticBezierCurve3:jp,SplineCurve:df});class em extends ri{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new $l[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,i=this.curves.length;n<i;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?e*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?e*a.points.length:e,l=a.getPoints(o);for(let c=0;c<l.length;c++){const h=l[c];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(i.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const i=this.curves[t];e.curves.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const i=e.curves[t];this.curves.push(new $l[i.type]().fromJSON(i))}return this}}class zh extends em{constructor(e){super(),this.type="Path",this.currentPoint=new ye,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new uf(this.currentPoint.clone(),new ye(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,i){const r=new ff(this.currentPoint.clone(),new ye(e,t),new ye(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(e,t,n,i,r,a){const o=new hf(this.currentPoint.clone(),new ye(e,t),new ye(n,i),new ye(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new df(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+o,t+l,n,i,r,a),this}absarc(e,t,n,i,r,a){return this.absellipse(e,t,n,n,i,r,a),this}ellipse(e,t,n,i,r,a,o,l){const c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+c,t+h,n,i,r,a,o,l),this}absellipse(e,t,n,i,r,a,o,l){const c=new Cc(e,t,n,i,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Is extends zh{constructor(e){super(e),this.uuid=Ln(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,i=this.holes.length;n<i;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(i.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const i=this.holes[t];e.holes.push(i.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const i=e.holes[t];this.holes.push(new zh().fromJSON(i))}return this}}function tm(s,e,t=2){const n=e&&e.length,i=n?e[0]*t:s.length;let r=pf(s,0,i,t,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=am(s,e,r,t)),s.length>80*t){o=s[0],l=s[1];let h=o,f=l;for(let u=t;u<i;u+=t){const d=s[u],p=s[u+1];d<o&&(o=d),p<l&&(l=p),d>h&&(h=d),p>f&&(f=p)}c=Math.max(h-o,f-l),c=c!==0?32767/c:0}return Dr(r,a,t,o,l,c,0),a}function pf(s,e,t,n,i){let r;if(i===_m(s,e,t,n)>0)for(let a=e;a<t;a+=n)r=Hh(a/n|0,s[a],s[a+1],r);else for(let a=t-n;a>=e;a-=n)r=Hh(a/n|0,s[a],s[a+1],r);return r&&ks(r,r.next)&&(Or(r),r=r.next),r}function rs(s,e){if(!s)return s;e||(e=s);let t=s,n;do if(n=!1,!t.steiner&&(ks(t,t.next)||Lt(t.prev,t,t.next)===0)){if(Or(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function Dr(s,e,t,n,i,r,a){if(!s)return;!a&&r&&um(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?im(s,n,i,r):nm(s)){e.push(l.i,s.i,c.i),Or(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=sm(rs(s),e),Dr(s,e,t,n,i,r,2)):a===2&&rm(s,e,t,n,i,r):Dr(rs(s),e,t,n,i,r,1);break}}}function nm(s){const e=s.prev,t=s,n=s.next;if(Lt(e,t,n)>=0)return!1;const i=e.x,r=t.x,a=n.x,o=e.y,l=t.y,c=n.y,h=Math.min(i,r,a),f=Math.min(o,l,c),u=Math.max(i,r,a),d=Math.max(o,l,c);let p=n.next;for(;p!==e;){if(p.x>=h&&p.x<=u&&p.y>=f&&p.y<=d&&gr(i,o,r,l,a,c,p.x,p.y)&&Lt(p.prev,p,p.next)>=0)return!1;p=p.next}return!0}function im(s,e,t,n){const i=s.prev,r=s,a=s.next;if(Lt(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,h=i.y,f=r.y,u=a.y,d=Math.min(o,l,c),p=Math.min(h,f,u),v=Math.max(o,l,c),g=Math.max(h,f,u),m=Yl(d,p,e,t,n),S=Yl(v,g,e,t,n);let w=s.prevZ,y=s.nextZ;for(;w&&w.z>=m&&y&&y.z<=S;){if(w.x>=d&&w.x<=v&&w.y>=p&&w.y<=g&&w!==i&&w!==a&&gr(o,h,l,f,c,u,w.x,w.y)&&Lt(w.prev,w,w.next)>=0||(w=w.prevZ,y.x>=d&&y.x<=v&&y.y>=p&&y.y<=g&&y!==i&&y!==a&&gr(o,h,l,f,c,u,y.x,y.y)&&Lt(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;w&&w.z>=m;){if(w.x>=d&&w.x<=v&&w.y>=p&&w.y<=g&&w!==i&&w!==a&&gr(o,h,l,f,c,u,w.x,w.y)&&Lt(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;y&&y.z<=S;){if(y.x>=d&&y.x<=v&&y.y>=p&&y.y<=g&&y!==i&&y!==a&&gr(o,h,l,f,c,u,y.x,y.y)&&Lt(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function sm(s,e){let t=s;do{const n=t.prev,i=t.next.next;!ks(n,i)&&gf(n,t,t.next,i)&&Ur(n,i)&&Ur(i,n)&&(e.push(n.i,t.i,i.i),Or(t),Or(t.next),t=s=i),t=t.next}while(t!==s);return rs(t)}function rm(s,e,t,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&pm(a,o)){let l=_f(a,o);a=rs(a,a.next),l=rs(l,l.next),Dr(a,e,t,n,i,r,0),Dr(l,e,t,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function am(s,e,t,n){const i=[];for(let r=0,a=e.length;r<a;r++){const o=e[r]*n,l=r<a-1?e[r+1]*n:s.length,c=pf(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(dm(c))}i.sort(om);for(let r=0;r<i.length;r++)t=lm(i[r],t);return t}function om(s,e){let t=s.x-e.x;if(t===0&&(t=s.y-e.y,t===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(e.next.y-e.y)/(e.next.x-e.x);t=n-i}return t}function lm(s,e){const t=cm(s,e);if(!t)return e;const n=_f(t,s);return rs(n,n.next),rs(t,t.next)}function cm(s,e){let t=e;const n=s.x,i=s.y;let r=-1/0,a;if(ks(s,t))return t;do{if(ks(s,t.next))return t.next;if(i<=t.y&&i>=t.next.y&&t.next.y!==t.y){const f=t.x+(i-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(f<=n&&f>r&&(r=f,a=t.x<t.next.x?t:t.next,f===n))return a}t=t.next}while(t!==e);if(!a)return null;const o=a,l=a.x,c=a.y;let h=1/0;t=a;do{if(n>=t.x&&t.x>=l&&n!==t.x&&mf(i<c?n:r,i,l,c,i<c?r:n,i,t.x,t.y)){const f=Math.abs(i-t.y)/(n-t.x);Ur(t,s)&&(f<h||f===h&&(t.x>a.x||t.x===a.x&&hm(a,t)))&&(a=t,h=f)}t=t.next}while(t!==o);return a}function hm(s,e){return Lt(s.prev,s,e.prev)<0&&Lt(e.next,s,s.next)<0}function um(s,e,t,n){let i=s;do i.z===0&&(i.z=Yl(i.x,i.y,e,t,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,fm(i)}function fm(s){let e,t=1;do{let n=s,i;s=null;let r=null;for(e=0;n;){e++;let a=n,o=0;for(let c=0;c<t&&(o++,a=a.nextZ,!!a);c++);let l=t;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,t*=2}while(e>1);return s}function Yl(s,e,t,n,i){return s=(s-t)*i|0,e=(e-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,s|e<<1}function dm(s){let e=s,t=s;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==s);return t}function mf(s,e,t,n,i,r,a,o){return(i-a)*(e-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(t-a)*(e-o)&&(t-a)*(r-o)>=(i-a)*(n-o)}function gr(s,e,t,n,i,r,a,o){return!(s===a&&e===o)&&mf(s,e,t,n,i,r,a,o)}function pm(s,e){return s.next.i!==e.i&&s.prev.i!==e.i&&!mm(s,e)&&(Ur(s,e)&&Ur(e,s)&&gm(s,e)&&(Lt(s.prev,s,e.prev)||Lt(s,e.prev,e))||ks(s,e)&&Lt(s.prev,s,s.next)>0&&Lt(e.prev,e,e.next)>0)}function Lt(s,e,t){return(e.y-s.y)*(t.x-e.x)-(e.x-s.x)*(t.y-e.y)}function ks(s,e){return s.x===e.x&&s.y===e.y}function gf(s,e,t,n){const i=xa(Lt(s,e,t)),r=xa(Lt(s,e,n)),a=xa(Lt(t,n,s)),o=xa(Lt(t,n,e));return!!(i!==r&&a!==o||i===0&&_a(s,t,e)||r===0&&_a(s,n,e)||a===0&&_a(t,s,n)||o===0&&_a(t,e,n))}function _a(s,e,t){return e.x<=Math.max(s.x,t.x)&&e.x>=Math.min(s.x,t.x)&&e.y<=Math.max(s.y,t.y)&&e.y>=Math.min(s.y,t.y)}function xa(s){return s>0?1:s<0?-1:0}function mm(s,e){let t=s;do{if(t.i!==s.i&&t.next.i!==s.i&&t.i!==e.i&&t.next.i!==e.i&&gf(t,t.next,s,e))return!0;t=t.next}while(t!==s);return!1}function Ur(s,e){return Lt(s.prev,s,s.next)<0?Lt(s,e,s.next)>=0&&Lt(s,s.prev,e)>=0:Lt(s,e,s.prev)<0||Lt(s,s.next,e)<0}function gm(s,e){let t=s,n=!1;const i=(s.x+e.x)/2,r=(s.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&i<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==s);return n}function _f(s,e){const t=Zl(s.i,s.x,s.y),n=Zl(e.i,e.x,e.y),i=s.next,r=e.prev;return s.next=e,e.prev=s,t.next=i,i.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Hh(s,e,t,n){const i=Zl(s,e,t);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Or(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Zl(s,e,t){return{i:s,x:e,y:t,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function _m(s,e,t,n){let i=0;for(let r=e,a=t-n;r<t;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class xm{static triangulate(e,t,n=2){return tm(e,t,n)}}class xi{static area(e){const t=e.length;let n=0;for(let i=t-1,r=0;r<t;i=r++)n+=e[i].x*e[r].y-e[r].x*e[i].y;return n*.5}static isClockWise(e){return xi.area(e)<0}static triangulateShape(e,t){const n=[],i=[],r=[];Gh(e),Vh(n,e);let a=e.length;t.forEach(Gh);for(let l=0;l<t.length;l++)i.push(a),a+=t[l].length,Vh(n,t[l]);const o=xm.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Gh(s){const e=s.length;e>2&&s[e-1].equals(s[0])&&s.pop()}function Vh(s,e){for(let t=0;t<e.length;t++)s.push(e[t].x),s.push(e[t].y)}class Lc extends Pt{constructor(e=new Is([new ye(.5,.5),new ye(-.5,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:e,options:t},e=Array.isArray(e)?e:[e];const n=this,i=[],r=[];for(let o=0,l=e.length;o<l;o++){const c=e[o];a(c)}this.setAttribute("position",new dt(i,3)),this.setAttribute("uv",new dt(r,2)),this.computeVertexNormals();function a(o){const l=[],c=t.curveSegments!==void 0?t.curveSegments:12,h=t.steps!==void 0?t.steps:1,f=t.depth!==void 0?t.depth:1;let u=t.bevelEnabled!==void 0?t.bevelEnabled:!0,d=t.bevelThickness!==void 0?t.bevelThickness:.2,p=t.bevelSize!==void 0?t.bevelSize:d-.1,v=t.bevelOffset!==void 0?t.bevelOffset:0,g=t.bevelSegments!==void 0?t.bevelSegments:3;const m=t.extrudePath,S=t.UVGenerator!==void 0?t.UVGenerator:vm;let w,y=!1,E,T,R,x;if(m){w=m.getSpacedPoints(h),y=!0,u=!1;const ne=m.isCatmullRomCurve3?m.closed:!1;E=m.computeFrenetFrames(h,ne),T=new O,R=new O,x=new O}u||(g=0,d=0,p=0,v=0);const A=o.extractPoints(c);let D=A.shape;const z=A.holes;if(!xi.isClockWise(D)){D=D.reverse();for(let ne=0,pe=z.length;ne<pe;ne++){const de=z[ne];xi.isClockWise(de)&&(z[ne]=de.reverse())}}function G(ne){const de=10000000000000001e-36;let me=ne[0];for(let _e=1;_e<=ne.length;_e++){const ke=_e%ne.length,Ge=ne[ke],Ke=Ge.x-me.x,Ze=Ge.y-me.y,k=Ke*Ke+Ze*Ze,lt=Math.max(Math.abs(Ge.x),Math.abs(Ge.y),Math.abs(me.x),Math.abs(me.y)),et=de*lt*lt;if(k<=et){ne.splice(ke,1),_e--;continue}me=Ge}}G(D),z.forEach(G);const U=z.length,K=D;for(let ne=0;ne<U;ne++){const pe=z[ne];D=D.concat(pe)}function J(ne,pe,de){return pe||je("ExtrudeGeometry: vec does not exist"),ne.clone().addScaledVector(pe,de)}const $=D.length;function le(ne,pe,de){let me,_e,ke;const Ge=ne.x-pe.x,Ke=ne.y-pe.y,Ze=de.x-ne.x,k=de.y-ne.y,lt=Ge*Ge+Ke*Ke,et=Ge*k-Ke*Ze;if(Math.abs(et)>Number.EPSILON){const P=Math.sqrt(lt),M=Math.sqrt(Ze*Ze+k*k),C=pe.x-Ke/P,V=pe.y+Ge/P,te=de.x-k/M,xe=de.y+Ze/M,Se=((te-C)*k-(xe-V)*Ze)/(Ge*k-Ke*Ze);me=C+Ge*Se-ne.x,_e=V+Ke*Se-ne.y;const re=me*me+_e*_e;if(re<=2)return new ye(me,_e);ke=Math.sqrt(re/2)}else{let P=!1;Ge>Number.EPSILON?Ze>Number.EPSILON&&(P=!0):Ge<-Number.EPSILON?Ze<-Number.EPSILON&&(P=!0):Math.sign(Ke)===Math.sign(k)&&(P=!0),P?(me=-Ke,_e=Ge,ke=Math.sqrt(lt)):(me=Ge,_e=Ke,ke=Math.sqrt(lt/2))}return new ye(me/ke,_e/ke)}const ee=[];for(let ne=0,pe=K.length,de=pe-1,me=ne+1;ne<pe;ne++,de++,me++)de===pe&&(de=0),me===pe&&(me=0),ee[ne]=le(K[ne],K[de],K[me]);const ce=[];let oe,Le=ee.concat();for(let ne=0,pe=U;ne<pe;ne++){const de=z[ne];oe=[];for(let me=0,_e=de.length,ke=_e-1,Ge=me+1;me<_e;me++,ke++,Ge++)ke===_e&&(ke=0),Ge===_e&&(Ge=0),oe[me]=le(de[me],de[ke],de[Ge]);ce.push(oe),Le=Le.concat(oe)}let Ee;if(g===0)Ee=xi.triangulateShape(K,z);else{const ne=[],pe=[];for(let de=0;de<g;de++){const me=de/g,_e=d*Math.cos(me*Math.PI/2),ke=p*Math.sin(me*Math.PI/2)+v;for(let Ge=0,Ke=K.length;Ge<Ke;Ge++){const Ze=J(K[Ge],ee[Ge],ke);fe(Ze.x,Ze.y,-_e),me===0&&ne.push(Ze)}for(let Ge=0,Ke=U;Ge<Ke;Ge++){const Ze=z[Ge];oe=ce[Ge];const k=[];for(let lt=0,et=Ze.length;lt<et;lt++){const P=J(Ze[lt],oe[lt],ke);fe(P.x,P.y,-_e),me===0&&k.push(P)}me===0&&pe.push(k)}}Ee=xi.triangulateShape(ne,pe)}const nt=Ee.length,$e=p+v;for(let ne=0;ne<$;ne++){const pe=u?J(D[ne],Le[ne],$e):D[ne];y?(R.copy(E.normals[0]).multiplyScalar(pe.x),T.copy(E.binormals[0]).multiplyScalar(pe.y),x.copy(w[0]).add(R).add(T),fe(x.x,x.y,x.z)):fe(pe.x,pe.y,0)}for(let ne=1;ne<=h;ne++)for(let pe=0;pe<$;pe++){const de=u?J(D[pe],Le[pe],$e):D[pe];y?(R.copy(E.normals[ne]).multiplyScalar(de.x),T.copy(E.binormals[ne]).multiplyScalar(de.y),x.copy(w[ne]).add(R).add(T),fe(x.x,x.y,x.z)):fe(de.x,de.y,f/h*ne)}for(let ne=g-1;ne>=0;ne--){const pe=ne/g,de=d*Math.cos(pe*Math.PI/2),me=p*Math.sin(pe*Math.PI/2)+v;for(let _e=0,ke=K.length;_e<ke;_e++){const Ge=J(K[_e],ee[_e],me);fe(Ge.x,Ge.y,f+de)}for(let _e=0,ke=z.length;_e<ke;_e++){const Ge=z[_e];oe=ce[_e];for(let Ke=0,Ze=Ge.length;Ke<Ze;Ke++){const k=J(Ge[Ke],oe[Ke],me);y?fe(k.x,k.y+w[h-1].y,w[h-1].x+de):fe(k.x,k.y,f+de)}}}Je(),ie();function Je(){const ne=i.length/3;if(u){let pe=0,de=$*pe;for(let me=0;me<nt;me++){const _e=Ee[me];Ie(_e[2]+de,_e[1]+de,_e[0]+de)}pe=h+g*2,de=$*pe;for(let me=0;me<nt;me++){const _e=Ee[me];Ie(_e[0]+de,_e[1]+de,_e[2]+de)}}else{for(let pe=0;pe<nt;pe++){const de=Ee[pe];Ie(de[2],de[1],de[0])}for(let pe=0;pe<nt;pe++){const de=Ee[pe];Ie(de[0]+$*h,de[1]+$*h,de[2]+$*h)}}n.addGroup(ne,i.length/3-ne,0)}function ie(){const ne=i.length/3;let pe=0;he(K,pe),pe+=K.length;for(let de=0,me=z.length;de<me;de++){const _e=z[de];he(_e,pe),pe+=_e.length}n.addGroup(ne,i.length/3-ne,1)}function he(ne,pe){let de=ne.length;for(;--de>=0;){const me=de;let _e=de-1;_e<0&&(_e=ne.length-1);for(let ke=0,Ge=h+g*2;ke<Ge;ke++){const Ke=$*ke,Ze=$*(ke+1),k=pe+me+Ke,lt=pe+_e+Ke,et=pe+_e+Ze,P=pe+me+Ze;ue(k,lt,et,P)}}}function fe(ne,pe,de){l.push(ne),l.push(pe),l.push(de)}function Ie(ne,pe,de){Ce(ne),Ce(pe),Ce(de);const me=i.length/3,_e=S.generateTopUV(n,i,me-3,me-2,me-1);He(_e[0]),He(_e[1]),He(_e[2])}function ue(ne,pe,de,me){Ce(ne),Ce(pe),Ce(me),Ce(pe),Ce(de),Ce(me);const _e=i.length/3,ke=S.generateSideWallUV(n,i,_e-6,_e-3,_e-2,_e-1);He(ke[0]),He(ke[1]),He(ke[3]),He(ke[1]),He(ke[2]),He(ke[3])}function Ce(ne){i.push(l[ne*3+0]),i.push(l[ne*3+1]),i.push(l[ne*3+2])}function He(ne){r.push(ne.x),r.push(ne.y)}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes,n=this.parameters.options;return Mm(t,n,e)}static fromJSON(e,t){const n=[];for(let r=0,a=e.shapes.length;r<a;r++){const o=t[e.shapes[r]];n.push(o)}const i=e.options.extrudePath;return i!==void 0&&(e.options.extrudePath=new $l[i.type]().fromJSON(i)),new Lc(n,e.options)}}const vm={generateTopUV:function(s,e,t,n,i){const r=e[t*3],a=e[t*3+1],o=e[n*3],l=e[n*3+1],c=e[i*3],h=e[i*3+1];return[new ye(r,a),new ye(o,l),new ye(c,h)]},generateSideWallUV:function(s,e,t,n,i,r){const a=e[t*3],o=e[t*3+1],l=e[t*3+2],c=e[n*3],h=e[n*3+1],f=e[n*3+2],u=e[i*3],d=e[i*3+1],p=e[i*3+2],v=e[r*3],g=e[r*3+1],m=e[r*3+2];return Math.abs(o-h)<Math.abs(a-c)?[new ye(a,1-l),new ye(c,1-f),new ye(u,1-p),new ye(v,1-m)]:[new ye(o,1-l),new ye(h,1-f),new ye(d,1-p),new ye(g,1-m)]}};function Mm(s,e,t){if(t.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];t.shapes.push(r.uuid)}else t.shapes.push(s.uuid);return t.options=Object.assign({},e),e.extrudePath!==void 0&&(t.options.extrudePath=e.extrudePath.toJSON()),t}class Ns extends ja{constructor(e=1,t=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,e,t),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ns(e.radius,e.detail)}}class Ic extends ja{constructor(e=1,t=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,e,t),this.type="OctahedronGeometry",this.parameters={radius:e,detail:t}}static fromJSON(e){return new Ic(e.radius,e.detail)}}class pi extends Pt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};const r=e/2,a=t/2,o=Math.floor(n),l=Math.floor(i),c=o+1,h=l+1,f=e/o,u=t/l,d=[],p=[],v=[],g=[];for(let m=0;m<h;m++){const S=m*u-a;for(let w=0;w<c;w++){const y=w*f-r;p.push(y,-S,0),v.push(0,0,1),g.push(w/o),g.push(1-m/l)}}for(let m=0;m<l;m++)for(let S=0;S<o;S++){const w=S+c*m,y=S+c*(m+1),E=S+1+c*(m+1),T=S+1+c*m;d.push(w,y,T),d.push(y,E,T)}this.setIndex(d),this.setAttribute("position",new dt(p,3)),this.setAttribute("normal",new dt(v,3)),this.setAttribute("uv",new dt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pi(e.width,e.height,e.widthSegments,e.heightSegments)}}class Nc extends Pt{constructor(e=.5,t=1,n=32,i=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:e,outerRadius:t,thetaSegments:n,phiSegments:i,thetaStart:r,thetaLength:a},n=Math.max(3,n),i=Math.max(1,i);const o=[],l=[],c=[],h=[];let f=e;const u=(t-e)/i,d=new O,p=new ye;for(let v=0;v<=i;v++){for(let g=0;g<=n;g++){const m=r+g/n*a;d.x=f*Math.cos(m),d.y=f*Math.sin(m),l.push(d.x,d.y,d.z),c.push(0,0,1),p.x=(d.x/t+1)/2,p.y=(d.y/t+1)/2,h.push(p.x,p.y)}f+=u}for(let v=0;v<i;v++){const g=v*(n+1);for(let m=0;m<n;m++){const S=m+g,w=S,y=S+n+1,E=S+n+2,T=S+1;o.push(w,y,T),o.push(y,E,T)}}this.setIndex(o),this.setAttribute("position",new dt(l,3)),this.setAttribute("normal",new dt(c,3)),this.setAttribute("uv",new dt(h,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Nc(e.innerRadius,e.outerRadius,e.thetaSegments,e.phiSegments,e.thetaStart,e.thetaLength)}}class Fr extends Pt{constructor(e=new Is([new ye(0,.5),new ye(-.5,-.5),new ye(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],i=[],r=[],a=[];let o=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let h=0;h<e.length;h++)c(e[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new dt(i,3)),this.setAttribute("normal",new dt(r,3)),this.setAttribute("uv",new dt(a,2));function c(h){const f=i.length/3,u=h.extractPoints(t);let d=u.shape;const p=u.holes;xi.isClockWise(d)===!1&&(d=d.reverse());for(let g=0,m=p.length;g<m;g++){const S=p[g];xi.isClockWise(S)===!0&&(p[g]=S.reverse())}const v=xi.triangulateShape(d,p);for(let g=0,m=p.length;g<m;g++){const S=p[g];d=d.concat(S)}for(let g=0,m=d.length;g<m;g++){const S=d[g];i.push(S.x,S.y,0),r.push(0,0,1),a.push(S.x,S.y)}for(let g=0,m=v.length;g<m;g++){const S=v[g],w=S[0]+f,y=S[1]+f,E=S[2]+f;n.push(w,y,E),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return ym(t,e)}static fromJSON(e,t){const n=[];for(let i=0,r=e.shapes.length;i<r;i++){const a=t[e.shapes[i]];n.push(a)}return new Fr(n,e.curveSegments)}}function ym(s,e){if(e.shapes=[],Array.isArray(s))for(let t=0,n=s.length;t<n;t++){const i=s[t];e.shapes.push(i.uuid)}else e.shapes.push(s.uuid);return e}class Ds extends Pt{constructor(e=1,t=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const h=[],f=new O,u=new O,d=[],p=[],v=[],g=[];for(let m=0;m<=n;m++){const S=[],w=m/n,y=a+w*o,E=e*Math.cos(y),T=Math.sqrt(e*e-E*E);let R=0;m===0&&a===0?R=.5/t:m===n&&l===Math.PI&&(R=-.5/t);for(let x=0;x<=t;x++){const A=x/t,D=i+A*r;f.x=-T*Math.cos(D),f.y=E,f.z=T*Math.sin(D),p.push(f.x,f.y,f.z),u.copy(f).normalize(),v.push(u.x,u.y,u.z),g.push(A+R,1-w),S.push(c++)}h.push(S)}for(let m=0;m<n;m++)for(let S=0;S<t;S++){const w=h[m][S+1],y=h[m][S],E=h[m+1][S],T=h[m+1][S+1];(m!==0||a>0)&&d.push(w,y,T),(m!==n-1||l<Math.PI)&&d.push(y,E,T)}this.setIndex(d),this.setAttribute("position",new dt(p,3)),this.setAttribute("normal",new dt(v,3)),this.setAttribute("uv",new dt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ds(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Dc extends Pt{constructor(e=1,t=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:e,tube:t,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],h=[],f=[],u=new O,d=new O,p=new O;for(let v=0;v<=n;v++){const g=a+v/n*o;for(let m=0;m<=i;m++){const S=m/i*r;d.x=(e+t*Math.cos(g))*Math.cos(S),d.y=(e+t*Math.cos(g))*Math.sin(S),d.z=t*Math.sin(g),c.push(d.x,d.y,d.z),u.x=e*Math.cos(S),u.y=e*Math.sin(S),p.subVectors(d,u).normalize(),h.push(p.x,p.y,p.z),f.push(m/i),f.push(v/n)}}for(let v=1;v<=n;v++)for(let g=1;g<=i;g++){const m=(i+1)*v+g-1,S=(i+1)*(v-1)+g-1,w=(i+1)*(v-1)+g,y=(i+1)*v+g;l.push(m,S,y),l.push(S,w,y)}this.setIndex(l),this.setAttribute("position",new dt(c,3)),this.setAttribute("normal",new dt(h,3)),this.setAttribute("uv",new dt(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dc(e.radius,e.tube,e.radialSegments,e.tubularSegments,e.arc,e.thetaStart,e.thetaLength)}}function zs(s){const e={};for(const t in s){e[t]={};for(const n in s[t]){const i=s[t][n];if(Wh(i))i.isRenderTargetTexture?(qe("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone();else if(Array.isArray(i))if(Wh(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();e[t][n]=r}else e[t][n]=i.slice();else e[t][n]=i}}return e}function hn(s){const e={};for(let t=0;t<s.length;t++){const n=zs(s[t]);for(const i in n)e[i]=n[i]}return e}function Wh(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function Sm(s){const e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function xf(s){const e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:ft.workingColorSpace}const bm={clone:zs,merge:hn};var Em=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Tm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ii extends zn{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Em,this.fragmentShader=Tm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=zs(e.uniforms),this.uniformsGroups=Sm(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?t.uniforms[i]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?t.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?t.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?t.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?t.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?t.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?t.uniforms[i]={type:"m4",value:a.toArray()}:t.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(const n in e.uniforms){const i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ye().setHex(i.value);break;case"v2":this.uniforms[n].value=new ye().fromArray(i.value);break;case"v3":this.uniforms[n].value=new O().fromArray(i.value);break;case"v4":this.uniforms[n].value=new bt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new st().fromArray(i.value);break;case"m4":this.uniforms[n].value=new at().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0&&(this.defines=e.defines),e.vertexShader!==void 0&&(this.vertexShader=e.vertexShader),e.fragmentShader!==void 0&&(this.fragmentShader=e.fragmentShader),e.glslVersion!==void 0&&(this.glslVersion=e.glslVersion),e.extensions!==void 0)for(const n in e.extensions)this.extensions[n]=e.extensions[n];return e.lights!==void 0&&(this.lights=e.lights),e.clipping!==void 0&&(this.clipping=e.clipping),this}}class wm extends ii{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class ki extends zn{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ye(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ba,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class ai extends ki{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ye(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return ot(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Ye(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ye(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ye(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){this._retroreflectivity>0!=e>0&&this.version++,this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class Am extends zn{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Ye(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ye(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ba,this.normalScale=new ye(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new bi,this.combine=ac,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.envMapIntensity=e.envMapIntensity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Rm extends zn{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Od,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Cm extends zn{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function Oi(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Na(s){return s!==void 0&&s.inTangents!==void 0&&s.outTangents!==void 0}function Pm(s){function e(i,r){return s[i]-s[r]}const t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Xh(s,e,t){const n=s.length,i=new s.constructor(n);for(let r=0,a=0;a!==n;++r){const o=t[r]*e;for(let l=0;l!==e;++l)i[a++]=s[o+l]}return i}function Lm(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let a=r[n];if(a!==void 0)if(Array.isArray(a))do a=r[n],a!==void 0&&(e.push(r.time),t.push(...a)),r=s[i++];while(r!==void 0);else if(a.toArray!==void 0)do a=r[n],a!==void 0&&(e.push(r.time),a.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do a=r[n],a!==void 0&&(e.push(r.time),t.push(a)),r=s[i++];while(r!==void 0)}class Gs{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){const t=this.parameterPositions;let n=this._cachedIndex,i=t[n],r=t[n-1];n:{e:{let a;t:{i:if(!(e<i)){for(let o=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=i,i=t[++n],e<i)break e}a=t.length;break t}if(!(e>=r)){const o=t[1];e<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(i=r,r=t[--n-1],e>=r)break e}a=n,n=0;break t}break n}for(;n<a;){const o=n+a>>>1;e<t[o]?a=o:n=o+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let a=0;a!==i;++a)t[a]=n[r+a];return t}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class Im extends Gs{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:sh,endingEnd:sh}}intervalChanged_(e,t,n){const i=this.parameterPositions;let r=e-2,a=e+1,o=i[r],l=i[a];if(o===void 0)switch(this.getSettings_().endingStart){case rh:r=e,o=2*t-n;break;case ah:r=i.length-2,o=t+i[r]-i[r+1];break;default:r=e,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case rh:a=e,l=2*n-t;break;case ah:a=1,l=n+i[1]-i[0];break;default:a=e-1,l=t}const c=(n-t)*.5,h=this.valueSize;this._weightPrev=c/(t-o),this._weightNext=c/(l-n),this._offsetPrev=r*h,this._offsetNext=a*h}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this._offsetPrev,f=this._offsetNext,u=this._weightPrev,d=this._weightNext,p=(n-t)/(i-t),v=p*p,g=v*p,m=-u*g+2*u*v-u*p,S=(1+u)*g+(-1.5-2*u)*v+(-.5+u)*p+1,w=(-1-d)*g+(1.5+d)*v+.5*p,y=d*g-d*v;for(let E=0;E!==o;++E)r[E]=m*a[h+E]+S*a[c+E]+w*a[l+E]+y*a[f+E];return r}}class Nm extends Gs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=(n-t)/(i-t),f=1-h;for(let u=0;u!==o;++u)r[u]=a[c+u]*f+a[l+u]*h;return r}}class Dm extends Gs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class Um extends Gs{interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=e*o,c=l-o,h=this.inTangents,f=this.outTangents;if(!h||!f){const p=(n-t)/(i-t),v=1-p;for(let g=0;g!==o;++g)r[g]=a[c+g]*v+a[l+g]*p;return r}const u=o*2,d=e-1;for(let p=0;p!==o;++p){const v=a[c+p],g=a[l+p],m=d*u+p*2,S=f[m],w=f[m+1],y=e*u+p*2,E=h[y],T=h[y+1],R=Fm(n,t,S,E,i);r[p]=vf(R,v,w,T,g)}return r}}function vf(s,e,t,n,i){const r=1-s;return r*r*r*e+3*r*r*s*t+3*r*s*s*n+s*s*s*i}function Om(s,e,t,n,i){const r=1-s;return 3*r*r*(t-e)+6*r*s*(n-t)+3*s*s*(i-n)}function Fm(s,e,t,n,i){let r=(s-e)/(i-e);for(let a=0;a<8;a++){const o=vf(r,e,t,n,i)-s;if(Math.abs(o)<1e-10)break;const l=Om(r,e,t,n,i);if(Math.abs(l)<1e-10)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class Gn{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Oi(t,this.TimeBufferType),this.values=Oi(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){const t=e.constructor;let n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Oi(e.times,Array),values:Oi(e.values,Array)};const i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i),Na(e.settings)&&(n.settings={inTangents:Oi(e.settings.inTangents,Array),outTangents:Oi(e.settings.outTangents,Array)})}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new Dm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Nm(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new Im(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){const t=new Um(this.times,this.values,this.getValueSize(),e);return this.settings&&(t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents),t}setInterpolation(e){let t;switch(e){case Cr:t=this.InterpolantFactoryMethodDiscrete;break;case Pr:t=this.InterpolantFactoryMethodLinear;break;case vo:t=this.InterpolantFactoryMethodSmooth;break;case ih:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){const n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return qe("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Cr;case this.InterpolantFactoryMethodLinear:return Pr;case this.InterpolantFactoryMethodSmooth:return vo;case this.InterpolantFactoryMethodBezier:return ih}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){const t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;Na(this.settings)&&(qh(this.settings.inTangents,e),qh(this.settings.outTangents,e))}return this}trim(e,t){const n=this.times,i=n.length;let r=0,a=i-1;for(;r!==i&&n[r]<e;)++r;for(;a!==-1&&n[a]>t;)--a;if(++a,r!==0||a!==i){r>=a&&(a=Math.max(a,1),r=a-1);const o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let e=!0;const t=this.getValueSize();t-Math.floor(t)!==0&&(je("KeyframeTrack: Invalid value size in track.",this),e=!1);const n=this.times,i=this.values,r=n.length;r===0&&(je("KeyframeTrack: Track is empty.",this),e=!1);let a=null;for(let o=0;o!==r;o++){const l=n[o];if(typeof l=="number"&&isNaN(l)){je("KeyframeTrack: Time is not a valid number.",this,o,l),e=!1;break}if(a!==null&&a>l){je("KeyframeTrack: Out of order keys.",this,o,l,a),e=!1;break}a=l}if(i!==void 0&&Kd(i))for(let o=0,l=i.length;o!==l;++o){const c=i[o];if(isNaN(c)){je("KeyframeTrack: Value is not a valid number.",this,o,c),e=!1;break}}return e}optimize(){const e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===vo,r=e.length-1;let a=1;for(let o=1;o<r;++o){let l=!1;const c=e[o],h=e[o+1];if(c!==h&&(o!==1||c!==e[0]))if(i)l=!0;else{const f=o*n,u=f-n,d=f+n;for(let p=0;p!==n;++p){const v=t[f+p];if(v!==t[u+p]||v!==t[d+p]){l=!0;break}}}if(l){if(o!==a){e[a]=e[o];const f=o*n,u=a*n;for(let d=0;d!==n;++d)t[u+d]=t[f+d]}++a}}if(r>0){e[a]=e[r];for(let o=r*n,l=a*n,c=0;c!==n;++c)t[l+c]=t[o+c];++a}return a!==e.length?(this.times=e.slice(0,a),this.values=t.slice(0,a*n)):(this.times=e,this.values=t),this}clone(){const e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,Na(this.settings)&&(i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),i}}function qh(s,e){for(let t=0,n=s.length;t!==n;t+=2)s[t]*=e}Gn.prototype.ValueTypeName="";Gn.prototype.TimeBufferType=Float32Array;Gn.prototype.ValueBufferType=Float32Array;Gn.prototype.DefaultInterpolation=Pr;class Vs extends Gn{constructor(e,t,n){super(e,t,n)}}Vs.prototype.ValueTypeName="bool";Vs.prototype.ValueBufferType=Array;Vs.prototype.DefaultInterpolation=Cr;Vs.prototype.InterpolantFactoryMethodLinear=void 0;Vs.prototype.InterpolantFactoryMethodSmooth=void 0;class Mf extends Gn{constructor(e,t,n,i){super(e,t,n,i)}}Mf.prototype.ValueTypeName="color";class Br extends Gn{constructor(e,t,n,i){super(e,t,n,i)}}Br.prototype.ValueTypeName="number";class Bm extends Gs{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-t)/(i-t);let c=e*o;for(let h=c+o;c!==h;c+=4)In.slerpFlat(r,0,a,c-o,a,c,l);return r}}class kr extends Gn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new Bm(this.times,this.values,this.getValueSize(),e)}}kr.prototype.ValueTypeName="quaternion";kr.prototype.InterpolantFactoryMethodSmooth=void 0;class Ws extends Gn{constructor(e,t,n){super(e,t,n)}}Ws.prototype.ValueTypeName="string";Ws.prototype.ValueBufferType=Array;Ws.prototype.DefaultInterpolation=Cr;Ws.prototype.InterpolantFactoryMethodLinear=void 0;Ws.prototype.InterpolantFactoryMethodSmooth=void 0;class Wa extends Gn{constructor(e,t,n,i){super(e,t,n,i)}}Wa.prototype.ValueTypeName="vector";class km{constructor(e="",t=-1,n=[],i=Dd){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Ln(),this.userData={},this.duration<0&&this.resetDuration()}static parse(e){const t=[],n=e.tracks,i=1/(e.fps||1);for(let a=0,o=n.length;a!==o;++a)t.push(Hm(n[a]).scale(i));const r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r.userData=JSON.parse(e.userData||"{}"),r}static toJSON(e){const t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode,userData:JSON.stringify(e.userData)};for(let r=0,a=n.length;r!==a;++r)t.push(Gn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){const r=t.length,a=[];for(let o=0;o<r;o++){let l=[],c=[];l.push((o+r-1)%r,o,(o+1)%r),c.push(0,1,0);const h=Pm(l);l=Xh(l,1,h),c=Xh(c,1,h),!i&&l[0]===0&&(l.push(r),c.push(c[0])),a.push(new Br(".morphTargetInfluences["+t[o].name+"]",l,c).scale(1/n))}return new this(e,-1,a)}static findByName(e,t){let n=e;if(!Array.isArray(e)){const i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){const i={},r=/^([\w-]*?)([\d]+)$/;for(let o=0,l=e.length;o<l;o++){const c=e[o],h=c.name.match(r);if(h&&h.length>1){const f=h[1];let u=i[f];u||(i[f]=u=[]),u.push(c)}}const a=[];for(const o in i)a.push(this.CreateFromMorphTargetSequence(o,i[o],t,n));return a}resetDuration(){const e=this.tracks;let t=0;for(let n=0,i=e.length;n!==i;++n){const r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){const e=[];for(let n=0;n<this.tracks.length;n++)e.push(this.tracks[n].clone());const t=new this.constructor(this.name,this.duration,e,this.blendMode);return t.userData=JSON.parse(JSON.stringify(this.userData)),t}toJSON(){return this.constructor.toJSON(this)}}function zm(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Br;case"vector":case"vector2":case"vector3":case"vector4":return Wa;case"color":return Mf;case"quaternion":return kr;case"bool":case"boolean":return Vs;case"string":return Ws}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Hm(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");const e=zm(s.type);if(s.times===void 0){const n=[],i=[];Lm(s.keys,n,i,"value"),s.times=n,s.values=i}let t;return e.parse!==void 0?t=e.parse(s):t=new e(s.name,s.times,s.values,s.interpolation),Na(s.settings)&&(t.settings={inTangents:Oi(s.settings.inTangents,Float32Array),outTangents:Oi(s.settings.outTangents,Float32Array)}),t}const vi={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(Kh(s)||(this.files[s]=e))},get:function(s){if(this.enabled!==!1&&!Kh(s))return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};function Kh(s){try{const e=s.slice(s.indexOf(":")+1);return new URL(e).protocol==="blob:"}catch{return!1}}class Gm{constructor(e,t,n){const i=this;let r=!1,a=0,o=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,r===!1&&i.onStart!==void 0&&i.onStart(h,a,o),r=!0},this.itemEnd=function(h){a++,i.onProgress!==void 0&&i.onProgress(h,a,o),a===o&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,f){return c.push(h,f),this},this.removeHandler=function(h){const f=c.indexOf(h);return f!==-1&&c.splice(f,2),this},this.getHandler=function(h){for(let f=0,u=c.length;f<u;f+=2){const d=c[f],p=c[f+1];if(d.global&&(d.lastIndex=0),d.test(h))return p}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}}const Vm=new Gm;class Xs{constructor(e){this.manager=e!==void 0?e:Vm,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){const n=this;return new Promise(function(i,r){n.load(e,i,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}abort(){return this}}Xs.DEFAULT_MATERIAL_NAME="__DEFAULT";const fi={};class Wm extends Error{constructor(e,t){super(e),this.response=t}}class yf extends Xs{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=vi.get(`file:${e}`);if(r!==void 0){this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0);return}if(fi[e]!==void 0){fi[e].push({onLoad:t,onProgress:n,onError:i});return}fi[e]=[],fi[e].push({onLoad:t,onProgress:n,onError:i});const a=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),o=this.mimeType,l=this.responseType;fetch(a).then(c=>{if(c.status===200||c.status===0){if(c.status===0&&qe("FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||c.body===void 0||c.body.getReader===void 0)return c;const h=fi[e],f=c.body.getReader(),u=c.headers.get("X-File-Size")||c.headers.get("Content-Length"),d=u?parseInt(u):0,p=d!==0;let v=0;const g=new ReadableStream({start(m){S();function S(){f.read().then(({done:w,value:y})=>{if(w)m.close();else{v+=y.byteLength;const E=new ProgressEvent("progress",{lengthComputable:p,loaded:v,total:d});for(let T=0,R=h.length;T<R;T++){const x=h[T];x.onProgress&&x.onProgress(E)}m.enqueue(y),S()}},w=>{m.error(w)})}}});return new Response(g)}else throw new Wm(`fetch for "${c.url}" responded with ${c.status}: ${c.statusText}`,c)}).then(c=>{switch(l){case"arraybuffer":return c.arrayBuffer();case"blob":return c.blob();case"document":return c.text().then(h=>new DOMParser().parseFromString(h,o));case"json":return c.json();default:if(o==="")return c.text();{const f=/charset="?([^;"\s]*)"?/i.exec(o),u=f&&f[1]?f[1].toLowerCase():void 0,d=new TextDecoder(u);return c.arrayBuffer().then(p=>d.decode(p))}}}).then(c=>{vi.add(`file:${e}`,c);const h=fi[e];delete fi[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onLoad&&d.onLoad(c)}}).catch(c=>{const h=fi[e];if(h===void 0)throw this.manager.itemError(e),c;delete fi[e];for(let f=0,u=h.length;f<u;f++){const d=h[f];d.onError&&d.onError(c)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const ys=new WeakMap;class Xm extends Xs{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=vi.get(`image:${e}`);if(a!==void 0){if(a.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);else{let f=ys.get(a);f===void 0&&(f=[],ys.set(a,f)),f.push({onLoad:t,onError:i})}return a}const o=Ir("img");function l(){h(),t&&t(this);const f=ys.get(this)||[];for(let u=0;u<f.length;u++){const d=f[u];d.onLoad&&d.onLoad(this)}ys.delete(this),r.manager.itemEnd(e)}function c(f){h(),i&&i(f),vi.remove(`image:${e}`);const u=ys.get(this)||[];for(let d=0;d<u.length;d++){const p=u[d];p.onError&&p.onError(f)}ys.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){o.removeEventListener("load",l,!1),o.removeEventListener("error",c,!1)}return o.addEventListener("load",l,!1),o.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(o.crossOrigin=this.crossOrigin),vi.add(`image:${e}`,o),r.manager.itemStart(e),o.src=e,o}}class Sf extends Xs{constructor(e){super(e)}load(e,t,n,i){const r=new Wt,a=new Xm(this.manager);return a.setCrossOrigin(this.crossOrigin),a.setPath(this.path),a.load(e,function(o){r.image=o,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}}class eo extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Ye(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}class qm extends eo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Ye(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}toJSON(e){const t=super.toJSON(e);return t.object.groundColor=this.groundColor.getHex(),t}}const Ko=new at,$h=new O,Yh=new O;class Uc{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ye(512,512),this.mapType=Mn,this.map=null,this.mapPass=null,this.matrix=new at,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ec,this._frameExtents=new ye(1,1),this._viewportCount=1,this._viewports=[new bt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera;$h.setFromMatrixPosition(e.matrixWorld),t.position.copy($h),Yh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Yh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){Ko.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(Ko,e.coordinateSystem,e.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;e.coordinateSystem===Lr||e.reversedDepth?t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):t.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),t.multiply(Ko)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const va=new O,Ma=new In,qn=new O;class bf extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new at,this.projectionMatrix=new at,this.projectionMatrixInverse=new at,this.coordinateSystem=jn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(va,Ma,qn),qn.x===1&&qn.y===1&&qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(va,Ma,qn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(va,Ma,qn),qn.x===1&&qn.y===1&&qn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(va,Ma,qn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ni=new O,Zh=new ye,Jh=new ye;class un extends bf{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Bs*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(xr*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Bs*2*Math.atan(Math.tan(xr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-e/Ni.z)}getViewSize(e,t){return this.getViewBounds(e,Zh,Jh),t.subVectors(Jh,Zh)}setViewOffset(e,t,n,i,r,a){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(xr*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,t-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Km extends Uc{constructor(){super(new un(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){const t=this.camera,n=Bs*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this.aspect=e.aspect,this}toJSON(){const e=super.toJSON();return e.focus=this.focus,e.aspect=this.aspect,e}}class $m extends eo{constructor(e,t,n=0,i=Math.PI/3,r=0,a=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=a,this.map=null,this.shadow=new Km}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.map=e.map,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.angle=this.angle,t.object.decay=this.decay,t.object.penumbra=this.penumbra,t.object.target=this.target.uuid,this.map&&this.map.isTexture&&(t.object.map=this.map.toJSON(e).uuid),t.object.shadow=this.shadow.toJSON(),t}}class Ym extends Uc{constructor(){super(new un(90,1,.5,500)),this.isPointLightShadow=!0}}class Oc extends eo{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Ym}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.distance=this.distance,t.object.decay=this.decay,t.object.shadow=this.shadow.toJSON(),t}}class to extends bf{constructor(e=-1,t=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-e,a=n+e,o=i+t,l=i-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Zm extends Uc{constructor(){super(new to(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Jl extends eo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new Zm}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class Sr{static extractUrlBase(e){const t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}}const $o=new WeakMap;class Jm extends Xs{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&qe("ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&qe("ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,a=vi.get(`image-bitmap:${e}`);if(a!==void 0){if(r.manager.itemStart(e),a.then){a.then(c=>{$o.has(a)===!0?(i&&i($o.get(a)),r.manager.itemError(e),r.manager.itemEnd(e)):(t&&t(c),r.manager.itemEnd(e))});return}setTimeout(function(){t&&t(a),r.manager.itemEnd(e)},0);return}const o={};o.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",o.headers=this.requestHeader,o.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;const l=fetch(e,o).then(function(c){return c.blob()}).then(function(c){return createImageBitmap(c,Object.assign({},r.options,{colorSpaceConversion:"none"}))}).then(function(c){return vi.add(`image-bitmap:${e}`,c),t&&t(c),r.manager.itemEnd(e),c}).catch(function(c){i&&i(c),$o.set(l,c),vi.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});vi.add(`image-bitmap:${e}`,l),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}const Ss=-90,bs=1;class Qm extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new un(Ss,bs,e,t);i.layers=this.layers,this.add(i);const r=new un(Ss,bs,e,t);r.layers=this.layers,this.add(r);const a=new un(Ss,bs,e,t);a.layers=this.layers,this.add(a);const o=new un(Ss,bs,e,t);o.layers=this.layers,this.add(o);const l=new un(Ss,bs,e,t);l.layers=this.layers,this.add(l);const c=new un(Ss,bs,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,i,r,a,o,l]=t;for(const c of t)this.remove(c);if(e===jn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Lr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,h]=this.children,f=e.getRenderTarget(),u=e.getActiveCubeFace(),d=e.getActiveMipmapLevel(),p=e.xr.enabled;e.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(n,0,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,r),e.setRenderTarget(n,1,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,a),e.setRenderTarget(n,2,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,o),e.setRenderTarget(n,3,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,l),e.setRenderTarget(n,4,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,c),n.texture.generateMipmaps=v,e.setRenderTarget(n,5,i),g&&e.autoClear===!1&&e.clearDepth(),e.render(t,h),e.setRenderTarget(f,u,d),e.xr.enabled=p,n.texture.needsPMREMUpdate=!0}}class jm extends un{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}const Fc="\\[\\]\\.:\\/",eg=new RegExp("["+Fc+"]","g"),Bc="[^"+Fc+"]",tg="[^"+Fc.replace("\\.","")+"]",ng=/((?:WC+[\/:])*)/.source.replace("WC",Bc),ig=/(WCOD+)?/.source.replace("WCOD",tg),sg=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Bc),rg=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Bc),ag=new RegExp("^"+ng+ig+sg+rg+"$"),og=["material","materials","bones","map"];class lg{constructor(e,t,n){const i=n||Mt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();const n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){const n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){const e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class Mt{constructor(e,t,n){this.path=t,this.parsedPath=n||Mt.parseTrackName(t),this.node=Mt.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){return e&&e.isAnimationObjectGroup?new Mt.Composite(e,t,n):new Mt(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(eg,"")}static parseTrackName(e){const t=ag.exec(e);if(t===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+e);const n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){const r=n.nodeName.substring(i+1);og.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,i),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){const n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){const n=function(r){for(let a=0;a<r.length;a++){const o=r[a];if(o.name===t||o.uuid===t)return o;const l=n(o.children);if(l)return l}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){const n=this.resolvedProperty;for(let i=0,r=n.length;i!==r;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node;const t=this.parsedPath,n=t.objectName,i=t.propertyName;let r=t.propertyIndex;if(e||(e=Mt.findNode(this.rootNode,t.nodeName),this.node=e),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){qe("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=t.objectIndex;switch(n){case"materials":if(!e.material){je("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){je("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){je("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let h=0;h<e.length;h++)if(e[h].name===c){c=h;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){je("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){je("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){je("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(c!==void 0){if(e[c]===void 0){je("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[c]}}const a=e[i];if(a===void 0){const c=t.nodeName;je("PropertyBinding: Trying to update property for track: "+c+"."+i+" but it wasn't found.",e);return}let o=this.Versioning.None;this.targetObject=e,e.isMaterial===!0?o=this.Versioning.NeedsUpdate:e.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){je("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){je("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}e.morphTargetDictionary[r]!==void 0&&(r=e.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=i;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}Mt.Composite=lg;Mt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};Mt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};Mt.prototype.GetterByBindingType=[Mt.prototype._getValue_direct,Mt.prototype._getValue_array,Mt.prototype._getValue_arrayElement,Mt.prototype._getValue_toArray];Mt.prototype.SetterByBindingTypeAndVersioning=[[Mt.prototype._setValue_direct,Mt.prototype._setValue_direct_setNeedsUpdate,Mt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_array,Mt.prototype._setValue_array_setNeedsUpdate,Mt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_arrayElement,Mt.prototype._setValue_arrayElement_setNeedsUpdate,Mt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[Mt.prototype._setValue_fromArray,Mt.prototype._setValue_fromArray_setNeedsUpdate,Mt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];const Qh=new at;class cg{constructor(e,t,n=0,i=1/0){this.ray=new Hs(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new xc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,t.projectionMatrix.elements[14]).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):je("Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Qh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Qh),this}intersectObject(e,t=!0,n=[]){return Ql(e,this,n,t),n.sort(jh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)Ql(e[i],this,n,t);return n.sort(jh),n}}function jh(s,e){return s.distance-e.distance}function Ql(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Ql(r[a],e,t,!0)}}class hg{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,qe("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}class eu{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ot(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ot(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}const Kc=class Kc{constructor(e,t,n,i){this.elements=[1,0,0,1],e!==void 0&&this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){const r=this.elements;return r[0]=e,r[2]=t,r[1]=n,r[3]=i,this}};Kc.prototype.isMatrix2=!0;let tu=Kc;class ug extends Gi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function nu(s,e,t,n){const i=fg(n);switch(t){case Zu:return s*e;case uc:return s*e/i.components*i.byteLength;case fc:return s*e/i.components*i.byteLength;case ss:return s*e*2/i.components*i.byteLength;case dc:return s*e*2/i.components*i.byteLength;case Ju:return s*e*3/i.components*i.byteLength;case Cn:return s*e*4/i.components*i.byteLength;case pc:return s*e*4/i.components*i.byteLength;case Ca:case Pa:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case La:case Ia:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case _l:case vl:return Math.max(s,16)*Math.max(e,8)/4;case gl:case xl:return Math.max(s,8)*Math.max(e,8)/2;case Ml:case yl:case bl:case El:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Sl:case Oa:case Tl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case wl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Al:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Rl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Cl:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Pl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Ll:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case Il:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Nl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Dl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Ul:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Ol:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Fl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case Bl:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case kl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case zl:case Hl:case Gl:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Vl:case Wl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Fa:case Xl:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function fg(s){switch(s){case Mn:case qu:return{byteLength:1,components:1};case Ar:case Ku:case ni:return{byteLength:2,components:1};case cc:case hc:return{byteLength:2,components:4};case ti:case lc:case Rn:return{byteLength:4,components:1};case $u:case Yu:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:rc}}));typeof window<"u"&&(window.__THREE__?qe("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=rc);function Ef(){let s=null,e=!1,t=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),t(r,a)}return{start:function(){e!==!0&&t!==null&&s!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function dg(s){const e=new WeakMap;function t(o,l){const c=o.array,h=o.usage,f=c.byteLength,u=s.createBuffer();s.bindBuffer(l,u),s.bufferData(l,c,h),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const h=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,h);else{f.sort((d,p)=>d.start-p.start);let u=0;for(let d=1;d<f.length;d++){const p=f[u],v=f[d];v.start<=p.start+p.count+1?p.count=Math.max(p.count,v.start+v.count-p.start):(++u,f[u]=v)}f.length=u+1;for(let d=0,p=f.length;d<p;d++){const v=f[d];s.bufferSubData(c,v.start*h.BYTES_PER_ELEMENT,h,v.start,v.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(s.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const h=e.get(o);(!h||h.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var pg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,mg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,gg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,_g=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,vg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Mg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,yg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,bg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Eg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Tg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,wg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ag=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Rg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Cg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Pg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Lg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ig=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Ng=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Dg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Ug=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Og=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Fg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Bg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,kg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,zg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Hg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Gg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Vg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Wg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Xg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,qg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Kg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,$g=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Yg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Zg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Jg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,jg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,e0=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,t0=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,n0=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,i0=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,s0=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,r0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,a0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_CUBE_UV
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,o0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,l0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,c0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,h0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,u0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,f0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,d0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,p0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,m0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,g0=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,_0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,x0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,v0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,M0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,y0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,S0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,b0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,E0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,T0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,w0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,A0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,R0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,C0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,P0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,L0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,I0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,N0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,D0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,U0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,O0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,F0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,B0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,k0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,z0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,H0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,G0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,V0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,W0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,X0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,q0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,K0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Y0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Z0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,J0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Q0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,j0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,e_=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,t_=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,n_=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,i_=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,s_=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,r_=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,a_=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,o_=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,l_=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,c_=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,h_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,u_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,f_=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,d_=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const p_=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,m_=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,g_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,__=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,x_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,v_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,M_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,y_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,S_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,b_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,E_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,T_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,w_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,A_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,R_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,C_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,P_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,L_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,I_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,N_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,D_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,U_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,O_=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,F_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,B_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,k_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,z_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,H_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,G_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,V_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,W_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,X_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,q_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,K_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ct={alphahash_fragment:pg,alphahash_pars_fragment:mg,alphamap_fragment:gg,alphamap_pars_fragment:_g,alphatest_fragment:xg,alphatest_pars_fragment:vg,aomap_fragment:Mg,aomap_pars_fragment:yg,batching_pars_vertex:Sg,batching_vertex:bg,begin_vertex:Eg,beginnormal_vertex:Tg,bsdfs:wg,iridescence_fragment:Ag,bumpmap_pars_fragment:Rg,clipping_planes_fragment:Cg,clipping_planes_pars_fragment:Pg,clipping_planes_pars_vertex:Lg,clipping_planes_vertex:Ig,color_fragment:Ng,color_pars_fragment:Dg,color_pars_vertex:Ug,color_vertex:Og,common:Fg,cube_uv_reflection_fragment:Bg,defaultnormal_vertex:kg,displacementmap_pars_vertex:zg,displacementmap_vertex:Hg,emissivemap_fragment:Gg,emissivemap_pars_fragment:Vg,colorspace_fragment:Wg,colorspace_pars_fragment:Xg,envmap_fragment:qg,envmap_common_pars_fragment:Kg,envmap_pars_fragment:$g,envmap_pars_vertex:Yg,envmap_physical_pars_fragment:a0,envmap_vertex:Zg,fog_vertex:Jg,fog_pars_vertex:Qg,fog_fragment:jg,fog_pars_fragment:e0,gradientmap_pars_fragment:t0,lightmap_pars_fragment:n0,lights_lambert_fragment:i0,lights_lambert_pars_fragment:s0,lights_pars_begin:r0,lights_toon_fragment:o0,lights_toon_pars_fragment:l0,lights_phong_fragment:c0,lights_phong_pars_fragment:h0,lights_physical_fragment:u0,lights_physical_pars_fragment:f0,lights_fragment_begin:d0,lights_fragment_maps:p0,lights_fragment_end:m0,lightprobes_pars_fragment:g0,logdepthbuf_fragment:_0,logdepthbuf_pars_fragment:x0,logdepthbuf_pars_vertex:v0,logdepthbuf_vertex:M0,map_fragment:y0,map_pars_fragment:S0,map_particle_fragment:b0,map_particle_pars_fragment:E0,metalnessmap_fragment:T0,metalnessmap_pars_fragment:w0,morphinstance_vertex:A0,morphcolor_vertex:R0,morphnormal_vertex:C0,morphtarget_pars_vertex:P0,morphtarget_vertex:L0,normal_fragment_begin:I0,normal_fragment_maps:N0,normal_pars_fragment:D0,normal_pars_vertex:U0,normal_vertex:O0,normalmap_pars_fragment:F0,clearcoat_normal_fragment_begin:B0,clearcoat_normal_fragment_maps:k0,clearcoat_pars_fragment:z0,iridescence_pars_fragment:H0,opaque_fragment:G0,packing:V0,premultiplied_alpha_fragment:W0,project_vertex:X0,dithering_fragment:q0,dithering_pars_fragment:K0,roughnessmap_fragment:$0,roughnessmap_pars_fragment:Y0,shadowmap_pars_fragment:Z0,shadowmap_pars_vertex:J0,shadowmap_vertex:Q0,shadowmask_pars_fragment:j0,skinbase_vertex:e_,skinning_pars_vertex:t_,skinning_vertex:n_,skinnormal_vertex:i_,specularmap_fragment:s_,specularmap_pars_fragment:r_,tonemapping_fragment:a_,tonemapping_pars_fragment:o_,transmission_fragment:l_,transmission_pars_fragment:c_,uv_pars_fragment:h_,uv_pars_vertex:u_,uv_vertex:f_,worldpos_vertex:d_,background_vert:p_,background_frag:m_,backgroundCube_vert:g_,backgroundCube_frag:__,cube_vert:x_,cube_frag:v_,depth_vert:M_,depth_frag:y_,distance_vert:S_,distance_frag:b_,equirect_vert:E_,equirect_frag:T_,linedashed_vert:w_,linedashed_frag:A_,meshbasic_vert:R_,meshbasic_frag:C_,meshlambert_vert:P_,meshlambert_frag:L_,meshmatcap_vert:I_,meshmatcap_frag:N_,meshnormal_vert:D_,meshnormal_frag:U_,meshphong_vert:O_,meshphong_frag:F_,meshphysical_vert:B_,meshphysical_frag:k_,meshtoon_vert:z_,meshtoon_frag:H_,points_vert:G_,points_frag:V_,shadow_vert:W_,shadow_frag:X_,sprite_vert:q_,sprite_frag:K_},Ne={common:{diffuse:{value:new Ye(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new st},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new st}},envmap:{envMap:{value:null},envMapRotation:{value:new st},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new st}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new st}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new st},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new st},normalScale:{value:new ye(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new st},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new st}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new st}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new st}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Ye(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new O},probesMax:{value:new O},probesResolution:{value:new O}},points:{diffuse:{value:new Ye(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0},uvTransform:{value:new st}},sprite:{diffuse:{value:new Ye(16777215)},opacity:{value:1},center:{value:new ye(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new st},alphaMap:{value:null},alphaMapTransform:{value:new st},alphaTest:{value:0}}},Zn={basic:{uniforms:hn([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.fog]),vertexShader:ct.meshbasic_vert,fragmentShader:ct.meshbasic_frag},lambert:{uniforms:hn([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)},envMapIntensity:{value:1}}]),vertexShader:ct.meshlambert_vert,fragmentShader:ct.meshlambert_frag},phong:{uniforms:hn([Ne.common,Ne.specularmap,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)},specular:{value:new Ye(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ct.meshphong_vert,fragmentShader:ct.meshphong_frag},standard:{uniforms:hn([Ne.common,Ne.envmap,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.roughnessmap,Ne.metalnessmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ct.meshphysical_vert,fragmentShader:ct.meshphysical_frag},toon:{uniforms:hn([Ne.common,Ne.aomap,Ne.lightmap,Ne.emissivemap,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.gradientmap,Ne.fog,Ne.lights,{emissive:{value:new Ye(0)}}]),vertexShader:ct.meshtoon_vert,fragmentShader:ct.meshtoon_frag},matcap:{uniforms:hn([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,Ne.fog,{matcap:{value:null}}]),vertexShader:ct.meshmatcap_vert,fragmentShader:ct.meshmatcap_frag},points:{uniforms:hn([Ne.points,Ne.fog]),vertexShader:ct.points_vert,fragmentShader:ct.points_frag},dashed:{uniforms:hn([Ne.common,Ne.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ct.linedashed_vert,fragmentShader:ct.linedashed_frag},depth:{uniforms:hn([Ne.common,Ne.displacementmap]),vertexShader:ct.depth_vert,fragmentShader:ct.depth_frag},normal:{uniforms:hn([Ne.common,Ne.bumpmap,Ne.normalmap,Ne.displacementmap,{opacity:{value:1}}]),vertexShader:ct.meshnormal_vert,fragmentShader:ct.meshnormal_frag},sprite:{uniforms:hn([Ne.sprite,Ne.fog]),vertexShader:ct.sprite_vert,fragmentShader:ct.sprite_frag},background:{uniforms:{uvTransform:{value:new st},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ct.background_vert,fragmentShader:ct.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new st}},vertexShader:ct.backgroundCube_vert,fragmentShader:ct.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ct.cube_vert,fragmentShader:ct.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ct.equirect_vert,fragmentShader:ct.equirect_frag},distance:{uniforms:hn([Ne.common,Ne.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ct.distance_vert,fragmentShader:ct.distance_frag},shadow:{uniforms:hn([Ne.lights,Ne.fog,{color:{value:new Ye(0)},opacity:{value:1}}]),vertexShader:ct.shadow_vert,fragmentShader:ct.shadow_frag}};Zn.physical={uniforms:hn([Zn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new st},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new st},clearcoatNormalScale:{value:new ye(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new st},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new st},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new st},sheen:{value:0},sheenColor:{value:new Ye(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new st},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new st},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new st},transmissionSamplerSize:{value:new ye},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new st},attenuationDistance:{value:0},attenuationColor:{value:new Ye(0)},specularColor:{value:new Ye(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new st},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new st},anisotropyVector:{value:new ye},anisotropyMap:{value:null},anisotropyMapTransform:{value:new st}}]),vertexShader:ct.meshphysical_vert,fragmentShader:ct.meshphysical_frag};const ya={r:0,b:0,g:0},$_=new at,Tf=new st;Tf.set(-1,0,0,0,1,0,0,0,1);function Y_(s,e,t,n,i,r){const a=new Ye(0);let o=i===!0?0:1,l,c,h=null,f=0,u=null;function d(S){let w=S.isScene===!0?S.background:null;if(w&&w.isTexture){const y=S.backgroundBlurriness>0;w=e.get(w,y)}return w}function p(S){let w=!1;const y=d(S);y===null?g(a,o):y&&y.isColor&&(g(y,1),w=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?t.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&t.buffers.color.setClear(0,0,0,0,r),(s.autoClear||w)&&(t.buffers.depth.setTest(!0),t.buffers.depth.setMask(!0),t.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function v(S,w){const y=d(w);y&&(y.isCubeTexture||y.mapping===Ya)?(c===void 0&&(c=new _t(new Vi(1,1,1),new ii({name:"BackgroundCubeMaterial",uniforms:zs(Zn.backgroundCube.uniforms),vertexShader:Zn.backgroundCube.vertexShader,fragmentShader:Zn.backgroundCube.fragmentShader,side:on,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=y,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4($_.makeRotationFromEuler(w.backgroundRotation)).transpose(),y.isCubeTexture&&y.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Tf),c.material.toneMapped=ft.getTransfer(y.colorSpace)!==xt,(h!==y||f!==y.version||u!==s.toneMapping)&&(c.material.needsUpdate=!0,h=y,f=y.version,u=s.toneMapping),c.layers.enableAll(),S.unshift(c,c.geometry,c.material,0,0,null)):y&&y.isTexture&&(l===void 0&&(l=new _t(new pi(2,2),new ii({name:"BackgroundMaterial",uniforms:zs(Zn.background.uniforms),vertexShader:Zn.background.vertexShader,fragmentShader:Zn.background.fragmentShader,side:Bi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=ft.getTransfer(y.colorSpace)!==xt,y.matrixAutoUpdate===!0&&y.updateMatrix(),l.material.uniforms.uvTransform.value.copy(y.matrix),(h!==y||f!==y.version||u!==s.toneMapping)&&(l.material.needsUpdate=!0,h=y,f=y.version,u=s.toneMapping),l.layers.enableAll(),S.unshift(l,l.geometry,l.material,0,0,null))}function g(S,w){S.getRGB(ya,xf(s)),t.buffers.color.setClear(ya.r,ya.g,ya.b,w,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(S,w=1){a.set(S),o=w,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(S){o=S,g(a,o)},render:p,addToRenderList:v,dispose:m}}function Z_(s,e){const t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=u(null);let r=i,a=!1;function o(z,N,G,U,K){let J=!1;const $=f(z,U,G,N);r!==$&&(r=$,c(r.object)),J=d(z,U,G,K),J&&p(z,U,G,K),K!==null&&e.update(K,s.ELEMENT_ARRAY_BUFFER),(J||a)&&(a=!1,y(z,N,G,U),K!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function l(){return s.createVertexArray()}function c(z){return s.bindVertexArray(z)}function h(z){return s.deleteVertexArray(z)}function f(z,N,G,U){const K=U.wireframe===!0;let J=n[N.id];J===void 0&&(J={},n[N.id]=J);const $=z.isInstancedMesh===!0?z.id:0;let le=J[$];le===void 0&&(le={},J[$]=le);let ee=le[G.id];ee===void 0&&(ee={},le[G.id]=ee);let ce=ee[K];return ce===void 0&&(ce=u(l()),ee[K]=ce),ce}function u(z){const N=[],G=[],U=[];for(let K=0;K<t;K++)N[K]=0,G[K]=0,U[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:G,attributeDivisors:U,object:z,attributes:{},index:null}}function d(z,N,G,U){const K=r.attributes,J=N.attributes;let $=0;const le=G.getAttributes();for(const ee in le)if(le[ee].location>=0){const oe=K[ee];let Le=J[ee];if(Le===void 0&&(ee==="instanceMatrix"&&z.instanceMatrix&&(Le=z.instanceMatrix),ee==="instanceColor"&&z.instanceColor&&(Le=z.instanceColor)),oe===void 0||oe.attribute!==Le||Le&&oe.data!==Le.data)return!0;$++}return r.attributesNum!==$||r.index!==U}function p(z,N,G,U){const K={},J=N.attributes;let $=0;const le=G.getAttributes();for(const ee in le)if(le[ee].location>=0){let oe=J[ee];oe===void 0&&(ee==="instanceMatrix"&&z.instanceMatrix&&(oe=z.instanceMatrix),ee==="instanceColor"&&z.instanceColor&&(oe=z.instanceColor));const Le={};Le.attribute=oe,oe&&oe.data&&(Le.data=oe.data),K[ee]=Le,$++}r.attributes=K,r.attributesNum=$,r.index=U}function v(){const z=r.newAttributes;for(let N=0,G=z.length;N<G;N++)z[N]=0}function g(z){m(z,0)}function m(z,N){const G=r.newAttributes,U=r.enabledAttributes,K=r.attributeDivisors;G[z]=1,U[z]===0&&(s.enableVertexAttribArray(z),U[z]=1),K[z]!==N&&(s.vertexAttribDivisor(z,N),K[z]=N)}function S(){const z=r.newAttributes,N=r.enabledAttributes;for(let G=0,U=N.length;G<U;G++)N[G]!==z[G]&&(s.disableVertexAttribArray(G),N[G]=0)}function w(z,N,G,U,K,J,$){$===!0?s.vertexAttribIPointer(z,N,G,K,J):s.vertexAttribPointer(z,N,G,U,K,J)}function y(z,N,G,U){v();const K=U.attributes,J=G.getAttributes(),$=N.defaultAttributeValues;for(const le in J){const ee=J[le];if(ee.location>=0){let ce=K[le];if(ce===void 0&&(le==="instanceMatrix"&&z.instanceMatrix&&(ce=z.instanceMatrix),le==="instanceColor"&&z.instanceColor&&(ce=z.instanceColor)),ce!==void 0){const oe=ce.normalized,Le=ce.itemSize,Ee=e.get(ce);if(Ee===void 0)continue;const nt=Ee.buffer,$e=Ee.type,Je=Ee.bytesPerElement,ie=$e===s.INT||$e===s.UNSIGNED_INT||ce.gpuType===lc;if(ce.isInterleavedBufferAttribute){const he=ce.data,fe=he.stride,Ie=ce.offset;if(he.isInstancedInterleavedBuffer){for(let ue=0;ue<ee.locationSize;ue++)m(ee.location+ue,he.meshPerAttribute);z.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ue=0;ue<ee.locationSize;ue++)g(ee.location+ue);s.bindBuffer(s.ARRAY_BUFFER,nt);for(let ue=0;ue<ee.locationSize;ue++)w(ee.location+ue,Le/ee.locationSize,$e,oe,fe*Je,(Ie+Le/ee.locationSize*ue)*Je,ie)}else{if(ce.isInstancedBufferAttribute){for(let he=0;he<ee.locationSize;he++)m(ee.location+he,ce.meshPerAttribute);z.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let he=0;he<ee.locationSize;he++)g(ee.location+he);s.bindBuffer(s.ARRAY_BUFFER,nt);for(let he=0;he<ee.locationSize;he++)w(ee.location+he,Le/ee.locationSize,$e,oe,Le*Je,Le/ee.locationSize*he*Je,ie)}}else if($!==void 0){const oe=$[le];if(oe!==void 0)switch(oe.length){case 2:s.vertexAttrib2fv(ee.location,oe);break;case 3:s.vertexAttrib3fv(ee.location,oe);break;case 4:s.vertexAttrib4fv(ee.location,oe);break;default:s.vertexAttrib1fv(ee.location,oe)}}}}S()}function E(){A();for(const z in n){const N=n[z];for(const G in N){const U=N[G];for(const K in U){const J=U[K];for(const $ in J)h(J[$].object),delete J[$];delete U[K]}}delete n[z]}}function T(z){if(n[z.id]===void 0)return;const N=n[z.id];for(const G in N){const U=N[G];for(const K in U){const J=U[K];for(const $ in J)h(J[$].object),delete J[$];delete U[K]}}delete n[z.id]}function R(z){for(const N in n){const G=n[N];for(const U in G){const K=G[U];if(K[z.id]===void 0)continue;const J=K[z.id];for(const $ in J)h(J[$].object),delete J[$];delete K[z.id]}}}function x(z){for(const N in n){const G=n[N],U=z.isInstancedMesh===!0?z.id:0,K=G[U];if(K!==void 0){for(const J in K){const $=K[J];for(const le in $)h($[le].object),delete $[le];delete K[J]}delete G[U],Object.keys(G).length===0&&delete n[N]}}}function A(){D(),a=!0,r!==i&&(r=i,c(r.object))}function D(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:A,resetDefaultState:D,dispose:E,releaseStatesOfGeometry:T,releaseStatesOfObject:x,releaseStatesOfProgram:R,initAttributes:v,enableAttribute:g,disableUnusedAttributes:S}}function J_(s,e,t){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),t.update(c,n,1)}function a(l,c,h){h!==0&&(s.drawArraysInstanced(n,l,c,h),t.update(c,n,h))}function o(l,c,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let u=0;for(let d=0;d<h;d++)u+=c[d];t.update(u,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Q_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(R){return!(R!==Cn&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const x=R===ni&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Mn&&R!==Rn&&!x&&n.convert(R)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(R){if(R==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const h=l(c);h!==c&&(qe("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);const f=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control");t.reversedDepthBuffer===!0&&u===!1&&qe("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),v=s.getParameter(s.MAX_TEXTURE_SIZE),g=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),S=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),w=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=s.getParameter(s.MAX_SAMPLES),T=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:v,maxCubemapSize:g,maxAttributes:m,maxVertexUniforms:S,maxVaryings:w,maxFragmentUniforms:y,maxSamples:E,samples:T}}function j_(s){const e=this;let t=null,n=0,i=!1,r=!1;const a=new di,o=new st,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,u){const d=f.length!==0||u||n!==0||i;return i=u,n=f.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,u){t=h(f,u,0)},this.setState=function(f,u,d){const p=f.clippingPlanes,v=f.clipIntersection,g=f.clipShadows,m=s.get(f);if(!i||p===null||p.length===0||r&&!g)r?h(null):c();else{const S=r?0:n,w=S*4;let y=m.clippingState||null;l.value=y,y=h(p,u,w,d);for(let E=0;E!==w;++E)y[E]=t[E];m.clippingState=y,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(f,u,d,p){const v=f!==null?f.length:0;let g=null;if(v!==0){if(g=l.value,p!==!0||g===null){const m=d+v*4,S=u.matrixWorldInverse;o.getNormalMatrix(S),(g===null||g.length<m)&&(g=new Float32Array(m));for(let w=0,y=d;w!==v;++w,y+=4)a.copy(f[w]).applyMatrix4(S,o),a.normal.toArray(g,y),g[y+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=v,e.numIntersection=0,g}}const Cs=4,ex=6,tx=20,nx=256,lr=new to,iu=new Ye;let Yo=null,Zo=0,Jo=0,Qo=!1;const ix=new O,Ji=new O;class jl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,i=100,r={}){const{size:a=256,position:o=ix}=r;Yo=this._renderer.getRenderTarget(),Zo=this._renderer.getActiveCubeFace(),Jo=this._renderer.getActiveMipmapLevel(),Qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,i,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=au(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ru(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Yo,Zo,Jo),this._renderer.xr.enabled=Qo,e.scissorTest=!1,Es(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===is||e.mapping===Fs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Yo=this._renderer.getRenderTarget(),Zo=this._renderer.getActiveCubeFace(),Jo=this._renderer.getActiveMipmapLevel(),Qo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Vt,minFilter:Vt,generateMipmaps:!1,type:ni,format:Cn,colorSpace:yn,depthBuffer:!1},i=su(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=su(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods}=sx(r)),this._blurMaterial=ax(r,e,t),this._ggxMaterial=rx(r,e,t)}return i}_compileMaterial(e){const t=new _t(new Pt,e);this._renderer.compile(t,lr)}_sceneToCubeUV(e,t,n,i,r){const l=new un(90,1,t,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],f=this._renderer,u=f.autoClear,d=f.toneMapping;f.getClearColor(iu),f.toneMapping=ei,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(i),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new _t(new Vi,new Pn({name:"PMREM.Background",side:on,depthWrite:!1,depthTest:!1})));const v=this._backgroundBox,g=v.material;let m=!1;const S=e.background;S?S.isColor&&(g.color.copy(S),e.background=null,m=!0):(g.color.copy(iu),m=!0);for(let w=0;w<6;w++){const y=w%3;y===0?(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+h[w],r.y,r.z)):y===1?(l.up.set(0,0,c[w]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+h[w],r.z)):(l.up.set(0,c[w],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+h[w]));const E=this._cubeSize;Es(i,y*E,w>2?E:0,E,E),f.setRenderTarget(i),m&&f.render(v,l),f.render(e,l)}f.toneMapping=d,f.autoClear=u,e.background=S}_textureToCubeUV(e,t){const n=this._renderer,i=e.mapping===is||e.mapping===Fs;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=au()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ru());const r=i?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Es(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(a,lr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const i=this._lodMeshes.length;for(let r=1;r<i;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const i=this._renderer,r=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[n];o.material=a;const l=a.uniforms,c=n/(this._lodMeshes.length-1),h=t/(this._lodMeshes.length-1),f=Math.sqrt(c*c-h*h),u=c*1.25,d=f*u,{_lodMax:p}=this,v=this._sizeLods[n],g=3*v*(n>p-Cs?n-p+Cs:0),m=4*(this._cubeSize-v);l.envMap.value=e.texture,l.roughness.value=d,l.mipInt.value=p-t,Es(r,g,m,3*v,2*v),i.setRenderTarget(r),i.render(o,lr),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=p-n,Es(e,g,m,3*v,2*v),i.setRenderTarget(e),i.render(o,lr)}_blur(e,t,n,i){const r=this._pingPongRenderTarget,a=Math.min(i,Math.PI)/Math.SQRT2;this._blurPass(e,r,t,n,a),this._blurPass(r,e,n,n,a)}_blurPass(e,t,n,i,r){const a=this._renderer,o=this._blurMaterial,l=this._lodMeshes[i];l.material=o;const c=o.uniforms;c.envMap.value=e.texture,c.sigma.value=r,c.mipInt.value=this._lodMax-n;const h=this._sizeLods[i],f=3*h*(i>this._lodMax-Cs?i-this._lodMax+Cs:0),u=4*(this._cubeSize-h);Es(t,f,u,3*h,2*h),a.setRenderTarget(t),a.render(l,lr)}}function sx(s){const e=[],t=[];let n=s;const i=s-Cs+1+ex;for(let r=0;r<i;r++){const a=Math.pow(2,n);e.push(a);const o=1/(a-2),l=-o,c=1+o,h=[l,l,c,l,c,c,l,l,c,c,l,c],f=6,u=6,d=3,p=new Float32Array(d*u*f),v=new Float32Array(d*u*f);for(let m=0;m<f;m++){const S=m%3*2/3-1,w=m>2?0:-1,y=[S,w,0,S+2/3,w,0,S+2/3,w+1,0,S,w,0,S+2/3,w+1,0,S,w+1,0];p.set(y,d*u*m);for(let E=0;E<u;E++){const T=h[E*2]*2-1,R=h[E*2+1]*2-1;m===0?Ji.set(1,R,T):m===1?Ji.set(-T,1,-R):m===2?Ji.set(-T,R,1):m===3?Ji.set(-1,R,-T):m===4?Ji.set(-T,-1,R):Ji.set(T,R,-1),Ji.toArray(v,(m*u+E)*d)}}const g=new Pt;g.setAttribute("position",new Qt(p,d)),g.setAttribute("outputDirection",new Qt(v,d)),t.push(new _t(g,null)),n>Cs&&n--}return{lodMeshes:t,sizeLods:e}}function su(s,e,t){const n=new kn(s,e,t);return n.texture.mapping=Ya,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Es(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function rx(s,e,t){return new ii({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:nx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:no(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function ax(s,e,t){return new ii({name:"SphericalGaussianBlur",defines:{SAMPLES:tx,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},sigma:{value:0},mipInt:{value:0}},vertexShader:no(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float sigma;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359
			#define GOLDEN_ANGLE 2.39996322973

			void main() {

				if ( sigma == 0.0 ) {

					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );
					return;

				}

				vec3 outputDirection = normalize( vOutputDirection );

				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
				vec3 tangent = normalize( cross( up, outputDirection ) );
				vec3 bitangent = cross( outputDirection, tangent );

				// Truncate the kernel at three standard deviations or at the antipode.
				float thetaMax = min( 3.0 * sigma, PI );
				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

				vec3 accumColor = vec3( 0.0 );
				float accumWeight = 0.0;

				for ( int i = 0; i < SAMPLES; i ++ ) {

					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
					float phi = float( i ) * GOLDEN_ANGLE;

					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

					// Correct the planar sample density to solid angle.
					float weight = sin( theta ) / theta;

					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );
					accumWeight += weight;

				}

				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function ru(){return new ii({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function au(){return new ii({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:no(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Mi,depthTest:!1,depthWrite:!1})}function no(){return`

		precision mediump float;
		precision mediump int;

		attribute vec3 outputDirection;

		varying vec3 vOutputDirection;

		void main() {

			vOutputDirection = outputDirection;
			gl_Position = vec4( position, 1.0 );

		}
	`}class wf extends kn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new lf(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Vi(5,5,5),r=new ii({name:"CubemapFromEquirect",uniforms:zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:on,blending:Mi});r.uniforms.tEquirect.value=t;const a=new _t(i,r),o=t.minFilter;return t.minFilter===gi&&(t.minFilter=Vt),new Qm(1,10,this).update(e,a),t.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){const r=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(t,n,i);e.setRenderTarget(r)}}function ox(s){let e=new WeakMap,t=new WeakMap,n=null;function i(u,d=!1){return u==null?null:d?a(u):r(u)}function r(u){if(u&&u.isTexture){const d=u.mapping;if(d===_o||d===xo)if(e.has(u)){const p=e.get(u).texture;return o(p,u.mapping)}else{const p=u.image;if(p&&p.height>0){const v=new wf(p.height);return v.fromEquirectangularTexture(s,u),e.set(u,v),u.addEventListener("dispose",c),o(v.texture,u.mapping)}else return null}}return u}function a(u){if(u&&u.isTexture){const d=u.mapping,p=d===_o||d===xo,v=d===is||d===Fs;if(p||v){let g=t.get(u);const m=g!==void 0?g.texture.pmremVersion:0;if(u.isRenderTargetTexture&&u.pmremVersion!==m)return n===null&&(n=new jl(s)),g=p?n.fromEquirectangular(u,g):n.fromCubemap(u,g),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),g.texture;if(g!==void 0)return g.texture;{const S=u.image;return p&&S&&S.height>0||v&&S&&l(S)?(n===null&&(n=new jl(s)),g=p?n.fromEquirectangular(u):n.fromCubemap(u),g.texture.pmremVersion=u.pmremVersion,t.set(u,g),u.addEventListener("dispose",h),g.texture):null}}}return u}function o(u,d){return d===_o?u.mapping=is:d===xo&&(u.mapping=Fs),u}function l(u){let d=0;const p=6;for(let v=0;v<p;v++)u[v]!==void 0&&d++;return d===p}function c(u){const d=u.target;d.removeEventListener("dispose",c);const p=e.get(d);p!==void 0&&(e.delete(d),p.dispose())}function h(u){const d=u.target;d.removeEventListener("dispose",h);const p=t.get(d);p!==void 0&&(t.delete(d),p.dispose())}function f(){e=new WeakMap,t=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:f}}function lx(s){const e={};function t(n){if(e[n]!==void 0)return e[n];const i=s.getExtension(n);return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const i=t(n);return i===null&&ns("WebGLRenderer: "+n+" extension not supported."),i}}}function cx(s,e,t,n){const i={},r=new WeakMap;function a(f){const u=f.target;u.index!==null&&e.remove(u.index);for(const p in u.attributes)e.remove(u.attributes[p]);u.removeEventListener("dispose",a),delete i[u.id];const d=r.get(u);d&&(e.remove(d),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(f,u){return i[u.id]===!0||(u.addEventListener("dispose",a),i[u.id]=!0,t.memory.geometries++),u}function l(f){const u=f.attributes;for(const d in u)e.update(u[d],s.ARRAY_BUFFER)}function c(f){const u=[],d=f.index,p=f.attributes.position;let v=0;if(p===void 0)return;if(d!==null){const S=d.array;v=d.version;for(let w=0,y=S.length;w<y;w+=3){const E=S[w+0],T=S[w+1],R=S[w+2];u.push(E,T,T,R,R,E)}}else{const S=p.array;v=p.version;for(let w=0,y=S.length/3-1;w<y;w+=3){const E=w+0,T=w+1,R=w+2;u.push(E,T,T,R,R,E)}}const g=new(p.count>=65535?rf:Mc)(u,1);g.version=v;const m=r.get(f);m&&e.remove(m),r.set(f,g)}function h(f){const u=r.get(f);if(u){const d=f.index;d!==null&&u.version<d.version&&c(f)}else c(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:h}}function hx(s,e,t){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,u){s.drawElements(n,u,r,f*a),t.update(u,n,1)}function c(f,u,d){d!==0&&(s.drawElementsInstanced(n,u,r,f*a,d),t.update(u,n,d))}function h(f,u,d){if(d===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,u,0,r,f,0,d);let v=0;for(let g=0;g<d;g++)v+=u[g];t.update(v,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function ux(s){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(t.calls++,a){case s.TRIANGLES:t.triangles+=o*(r/3);break;case s.LINES:t.lines+=o*(r/2);break;case s.LINE_STRIP:t.lines+=o*(r-1);break;case s.LINE_LOOP:t.lines+=o*r;break;case s.POINTS:t.points+=o*r;break;default:je("WebGLInfo: Unknown draw mode:",a);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function fx(s,e,t){const n=new WeakMap,i=new bt;function r(a,o,l){const c=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=h!==void 0?h.length:0;let u=n.get(o);if(u===void 0||u.count!==f){let A=function(){R.dispose(),n.delete(o),o.removeEventListener("dispose",A)};u!==void 0&&u.texture.dispose();const d=o.morphAttributes.position!==void 0,p=o.morphAttributes.normal!==void 0,v=o.morphAttributes.color!==void 0,g=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],S=o.morphAttributes.color||[];let w=0;d===!0&&(w=1),p===!0&&(w=2),v===!0&&(w=3);let y=o.attributes.position.count*w,E=1;y>e.maxTextureSize&&(E=Math.ceil(y/e.maxTextureSize),y=e.maxTextureSize);const T=new Float32Array(y*E*4*f),R=new tf(T,y,E,f);R.type=Rn,R.needsUpdate=!0;const x=w*4;for(let D=0;D<f;D++){const z=g[D],N=m[D],G=S[D],U=y*E*4*D;for(let K=0;K<z.count;K++){const J=K*x;d===!0&&(i.fromBufferAttribute(z,K),T[U+J+0]=i.x,T[U+J+1]=i.y,T[U+J+2]=i.z,T[U+J+3]=0),p===!0&&(i.fromBufferAttribute(N,K),T[U+J+4]=i.x,T[U+J+5]=i.y,T[U+J+6]=i.z,T[U+J+7]=0),v===!0&&(i.fromBufferAttribute(G,K),T[U+J+8]=i.x,T[U+J+9]=i.y,T[U+J+10]=i.z,T[U+J+11]=G.itemSize===4?i.w:1)}}u={count:f,texture:R,size:new ye(y,E)},n.set(o,u),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,t);else{let d=0;for(let v=0;v<c.length;v++)d+=c[v];const p=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",p),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(s,"morphTargetsTextureSize",u.size)}return{update:r}}function dx(s,e,t,n,i){let r=new WeakMap;function a(c){const h=i.render.frame,f=c.geometry,u=e.get(c,f);if(r.get(u)!==h&&(e.update(u),r.set(u,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==h&&(t.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==h&&(d.update(),r.set(d,h))}return u}function o(){r=new WeakMap}function l(c){const h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),t.remove(h.instanceMatrix),h.instanceColor!==null&&t.remove(h.instanceColor)}return{update:a,dispose:o}}const px={[Bu]:"LINEAR_TONE_MAPPING",[ku]:"REINHARD_TONE_MAPPING",[zu]:"CINEON_TONE_MAPPING",[oc]:"ACES_FILMIC_TONE_MAPPING",[Gu]:"AGX_TONE_MAPPING",[Vu]:"NEUTRAL_TONE_MAPPING",[Hu]:"CUSTOM_TONE_MAPPING"};function mx(s,e,t,n,i,r){const a=new kn(e,t,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null;const c=new Pt;c.setAttribute("position",new dt([-1,3,0,-1,-1,0,3,-1,0],3)),c.setAttribute("uv",new dt([0,2,0,0,2,0],2));const h=new wm({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new _t(c,h),u=new to(-1,1,1,-1,0,1);let d=null,p=null,v=!1,g,m=null,S=[],w=!1;this.setSize=function(y,E){a.setSize(y,E),o!==null&&o.setSize(y,E),l!==null&&l.setSize(y,E);for(let T=0;T<S.length;T++){const R=S[T];R.setSize&&R.setSize(y,E)}},this.setEffects=function(y){S=y,w=S.length>0&&S[0].isRenderPass===!0;const E=a.width,T=a.height;S.length>0&&o===null&&(o=new kn(E,T,{type:ni,depthBuffer:!1,stencilBuffer:!1}),l=new kn(E,T,{type:ni,depthBuffer:!1,stencilBuffer:!1}));for(let R=0;R<S.length;R++){const x=S[R];x.setSize&&x.setSize(E,T)}},this.begin=function(y,E){if(v||y.toneMapping===ei&&S.length===0)return!1;if(m=E,E!==null){const T=E.width,R=E.height;(a.width!==T||a.height!==R)&&this.setSize(T,R)}return w===!1&&y.setRenderTarget(a),g=y.toneMapping,y.toneMapping=ei,!0},this.hasRenderPass=function(){return w},this.end=function(y,E){y.toneMapping=g,v=!0;let T=a,R=o;for(let x=0;x<S.length;x++){const A=S[x];A.enabled!==!1&&(A.render(y,R,T,E),A.needsSwap!==!1&&(T=R,R=R===o?l:o))}if(d!==y.outputColorSpace||p!==y.toneMapping){d=y.outputColorSpace,p=y.toneMapping,h.defines={},ft.getTransfer(d)===xt&&(h.defines.SRGB_TRANSFER="");const x=px[p];x&&(h.defines[x]=""),h.needsUpdate=!0}h.uniforms.tDiffuse.value=T.texture,y.setRenderTarget(m),y.render(f,u),m=null,v=!1},this.isCompositing=function(){return v},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),c.dispose(),h.dispose()}}const Af=new Wt,ec=new Nr(1,1),Rf=new tf,Cf=new vp,Pf=new lf,ou=[],lu=[],cu=new Float32Array(16),hu=new Float32Array(9),uu=new Float32Array(4);function qs(s,e,t){const n=s[0];if(n<=0||n>0)return s;const i=e*t;let r=ou[i];if(r===void 0&&(r=new Float32Array(i),ou[i]=r),e!==0){n.toArray(r,0);for(let a=1,o=0;a!==e;++a)o+=t,s[a].toArray(r,o)}return r}function Xt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function qt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function io(s,e){let t=lu[e];t===void 0&&(t=new Int32Array(e),lu[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function gx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function _x(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2fv(this.addr,e),qt(t,e)}}function xx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Xt(t,e))return;s.uniform3fv(this.addr,e),qt(t,e)}}function vx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4fv(this.addr,e),qt(t,e)}}function Mx(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;uu.set(n),s.uniformMatrix2fv(this.addr,!1,uu),qt(t,n)}}function yx(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;hu.set(n),s.uniformMatrix3fv(this.addr,!1,hu),qt(t,n)}}function Sx(s,e){const t=this.cache,n=e.elements;if(n===void 0){if(Xt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),qt(t,e)}else{if(Xt(t,n))return;cu.set(n),s.uniformMatrix4fv(this.addr,!1,cu),qt(t,n)}}function bx(s,e){const t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function Ex(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2iv(this.addr,e),qt(t,e)}}function Tx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3iv(this.addr,e),qt(t,e)}}function wx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4iv(this.addr,e),qt(t,e)}}function Ax(s,e){const t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function Rx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Xt(t,e))return;s.uniform2uiv(this.addr,e),qt(t,e)}}function Cx(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Xt(t,e))return;s.uniform3uiv(this.addr,e),qt(t,e)}}function Px(s,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Xt(t,e))return;s.uniform4uiv(this.addr,e),qt(t,e)}}function Lx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(ec.compareFunction=t.isReversedDepthBuffer()?gc:mc,r=ec):r=Af,t.setTexture2D(e||r,i)}function Ix(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||Cf,i)}function Nx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||Pf,i)}function Dx(s,e,t){const n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||Rf,i)}function Ux(s){switch(s){case 5126:return gx;case 35664:return _x;case 35665:return xx;case 35666:return vx;case 35674:return Mx;case 35675:return yx;case 35676:return Sx;case 5124:case 35670:return bx;case 35667:case 35671:return Ex;case 35668:case 35672:return Tx;case 35669:case 35673:return wx;case 5125:return Ax;case 36294:return Rx;case 36295:return Cx;case 36296:return Px;case 35678:case 36198:case 36298:case 36306:case 35682:return Lx;case 35679:case 36299:case 36307:return Ix;case 35680:case 36300:case 36308:case 36293:return Nx;case 36289:case 36303:case 36311:case 36292:return Dx}}function Ox(s,e){s.uniform1fv(this.addr,e)}function Fx(s,e){const t=qs(e,this.size,2);s.uniform2fv(this.addr,t)}function Bx(s,e){const t=qs(e,this.size,3);s.uniform3fv(this.addr,t)}function kx(s,e){const t=qs(e,this.size,4);s.uniform4fv(this.addr,t)}function zx(s,e){const t=qs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function Hx(s,e){const t=qs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function Gx(s,e){const t=qs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function Vx(s,e){s.uniform1iv(this.addr,e)}function Wx(s,e){s.uniform2iv(this.addr,e)}function Xx(s,e){s.uniform3iv(this.addr,e)}function qx(s,e){s.uniform4iv(this.addr,e)}function Kx(s,e){s.uniform1uiv(this.addr,e)}function $x(s,e){s.uniform2uiv(this.addr,e)}function Yx(s,e){s.uniform3uiv(this.addr,e)}function Zx(s,e){s.uniform4uiv(this.addr,e)}function Jx(s,e,t){const n=this.cache,i=e.length,r=io(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=ec:a=Af;for(let o=0;o!==i;++o)t.setTexture2D(e[o]||a,r[o])}function Qx(s,e,t){const n=this.cache,i=e.length,r=io(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==i;++a)t.setTexture3D(e[a]||Cf,r[a])}function jx(s,e,t){const n=this.cache,i=e.length,r=io(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==i;++a)t.setTextureCube(e[a]||Pf,r[a])}function ev(s,e,t){const n=this.cache,i=e.length,r=io(t,i);Xt(n,r)||(s.uniform1iv(this.addr,r),qt(n,r));for(let a=0;a!==i;++a)t.setTexture2DArray(e[a]||Rf,r[a])}function tv(s){switch(s){case 5126:return Ox;case 35664:return Fx;case 35665:return Bx;case 35666:return kx;case 35674:return zx;case 35675:return Hx;case 35676:return Gx;case 5124:case 35670:return Vx;case 35667:case 35671:return Wx;case 35668:case 35672:return Xx;case 35669:case 35673:return qx;case 5125:return Kx;case 36294:return $x;case 36295:return Yx;case 36296:return Zx;case 35678:case 36198:case 36298:case 36306:case 35682:return Jx;case 35679:case 36299:case 36307:return Qx;case 35680:case 36300:case 36308:case 36293:return jx;case 36289:case 36303:case 36311:case 36292:return ev}}class nv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=Ux(t.type)}}class iv{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=tv(t.type)}}class sv{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(e,t[o.id],n)}}}const jo=/(\w+)(\])?(\[|\.)?/g;function fu(s,e){s.seq.push(e),s.map[e.id]=e}function rv(s,e,t){const n=s.name,i=n.length;for(jo.lastIndex=0;;){const r=jo.exec(n),a=jo.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){fu(t,c===void 0?new nv(o,s,e):new iv(o,s,e));break}else{let f=t.map[o];f===void 0&&(f=new sv(o),fu(t,f)),t=f}}}class Da{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=e.getActiveUniform(t,a),l=e.getUniformLocation(t,o.name);rv(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(e,t,n,i){const r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){const i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,a=t.length;r!==a;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,i)}}static seqWithValue(e,t){const n=[];for(let i=0,r=e.length;i!==r;++i){const a=e[i];a.id in t&&n.push(a)}return n}}function du(s,e,t){const n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}const av=37297;let ov=0;function lv(s,e){const t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===e?">":" "} ${o}: ${t[a]}`)}return n.join(`
`)}const pu=new st;function cv(s){ft._getMatrix(pu,ft.workingColorSpace,s);const e=`mat3( ${pu.elements.map(t=>t.toFixed(4))} )`;switch(ft.getTransfer(s)){case ka:return[e,"LinearTransferOETF"];case xt:return[e,"sRGBTransferOETF"];default:return qe("WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function mu(s,e,t){const n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return t.toUpperCase()+`

`+r+`

`+lv(s.getShaderSource(e),o)}else return r}function hv(s,e){const t=cv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}const uv={[Bu]:"Linear",[ku]:"Reinhard",[zu]:"Cineon",[oc]:"ACESFilmic",[Gu]:"AgX",[Vu]:"Neutral",[Hu]:"Custom"};function fv(s,e){const t=uv[e];return t===void 0?(qe("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const Sa=new O;function dv(){ft.getLuminanceCoefficients(Sa);const s=Sa.x.toFixed(4),e=Sa.y.toFixed(4),t=Sa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function pv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(_r).join(`
`)}function mv(s){const e=[];for(const t in s){const n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function gv(s,e){const t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(e,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),t[a]={type:r.type,location:s.getAttribLocation(e,a),locationSize:o}}return t}function _r(s){return s!==""}function gu(s,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,e.numSunLights).replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,e.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function _u(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const _v=/^[ \t]*#include +<([\w\d./]+)>/gm;function tc(s){return s.replace(_v,vv)}const xv=new Map;function vv(s,e){let t=ct[e];if(t===void 0){const n=xv.get(e);if(n!==void 0)t=ct[n],qe('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("THREE.WebGLProgram: Can not resolve #include <"+e+">")}return tc(t)}const Mv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xu(s){return s.replace(Mv,yv)}function yv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function vu(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const Sv={[Aa]:"SHADOWMAP_TYPE_PCF",[pr]:"SHADOWMAP_TYPE_VSM"};function bv(s){return Sv[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const Ev={[is]:"ENVMAP_TYPE_CUBE",[Fs]:"ENVMAP_TYPE_CUBE",[Ya]:"ENVMAP_TYPE_CUBE_UV"};function Tv(s){return s.envMap===!1?"ENVMAP_TYPE_CUBE":Ev[s.envMapMode]||"ENVMAP_TYPE_CUBE"}const wv={[Fs]:"ENVMAP_MODE_REFRACTION"};function Av(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":wv[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const Rv={[ac]:"ENVMAP_BLENDING_MULTIPLY",[Ld]:"ENVMAP_BLENDING_MIX",[Id]:"ENVMAP_BLENDING_ADD"};function Cv(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":Rv[s.combine]||"ENVMAP_BLENDING_NONE"}function Pv(s){const e=s.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Lv(s,e,t,n){const i=s.getContext(),r=t.defines;let a=t.vertexShader,o=t.fragmentShader;const l=bv(t),c=Tv(t),h=Av(t),f=Cv(t),u=Pv(t),d=pv(t),p=mv(r),v=i.createProgram();let g,m,S=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(g=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(_r).join(`
`),g.length>0&&(g+=`
`),m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p].filter(_r).join(`
`),m.length>0&&(m+=`
`)):(g=[vu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexNormals?"#define HAS_NORMAL":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_r).join(`
`),m=[vu(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,p,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+h:"",t.envMap?"#define "+f:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.retroreflection?"#define USE_RETROREFLECTION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor?"#define USE_COLOR":"",t.vertexAlphas||t.batchingColor?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==ei?"#define TONE_MAPPING":"",t.toneMapping!==ei?ct.tonemapping_pars_fragment:"",t.toneMapping!==ei?fv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ct.colorspace_pars_fragment,hv("linearToOutputTexel",t.outputColorSpace),dv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(_r).join(`
`)),a=tc(a),a=gu(a,t),a=_u(a,t),o=tc(o),o=gu(o,t),o=_u(o,t),a=xu(a),o=xu(o),t.isRawShaderMaterial!==!0&&(S=`#version 300 es
`,g=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,m=["#define varying in",t.glslVersion===oh?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===oh?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const w=S+g+a,y=S+m+o,E=du(i,i.VERTEX_SHADER,w),T=du(i,i.FRAGMENT_SHADER,y);i.attachShader(v,E),i.attachShader(v,T),t.index0AttributeName!==void 0?i.bindAttribLocation(v,0,t.index0AttributeName):t.hasPositionAttribute===!0&&i.bindAttribLocation(v,0,"position"),i.linkProgram(v);function R(z){if(s.debug.checkShaderErrors){const N=i.getProgramInfoLog(v)||"",G=i.getShaderInfoLog(E)||"",U=i.getShaderInfoLog(T)||"",K=N.trim(),J=G.trim(),$=U.trim();let le=!0,ee=!0;if(i.getProgramParameter(v,i.LINK_STATUS)===!1)if(le=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,v,E,T);else{const ce=mu(i,E,"vertex"),oe=mu(i,T,"fragment");je("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(v,i.VALIDATE_STATUS)+`

Material Name: `+z.name+`
Material Type: `+z.type+`

Program Info Log: `+K+`
`+ce+`
`+oe)}else K!==""?qe("WebGLProgram: Program Info Log:",K):(J===""||$==="")&&(ee=!1);ee&&(z.diagnostics={runnable:le,programLog:K,vertexShader:{log:J,prefix:g},fragmentShader:{log:$,prefix:m}})}i.deleteShader(E),i.deleteShader(T),x=new Da(i,v),A=gv(i,v)}let x;this.getUniforms=function(){return x===void 0&&R(this),x};let A;this.getAttributes=function(){return A===void 0&&R(this),A};let D=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(v,av)),D},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(v),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=ov++,this.cacheKey=e,this.usedTimes=1,this.program=v,this.vertexShader=E,this.fragmentShader=T,this}let Iv=0;class Nv{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){const i=this._getShaderCacheForMaterial(e);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Dv(e),t.set(e,n)),n}}class Dv{constructor(e){this.id=Iv++,this.code=e,this.usedTimes=0}}function Uv(s){return s===ss||s===Oa||s===Fa}function Ov(s,e,t,n,i,r){const a=new xc,o=new Nv,l=new Set,c=[],h=new Map,f=n.logarithmicDepthBuffer;let u=n.precision;const d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function p(x){return l.add(x),x===0?"uv":`uv${x}`}function v(x,A,D,z,N,G){const U=z.fog,K=N.geometry,J=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?z.environment:null,$=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,le=e.get(x.envMap||J,$),ee=le&&le.mapping===Ya?le.image.height:null,ce=d[x.type];x.precision!==null&&(u=n.getMaxPrecision(x.precision),u!==x.precision&&qe("WebGLProgram.getParameters:",x.precision,"not supported, using",u,"instead."));const oe=K.morphAttributes.position||K.morphAttributes.normal||K.morphAttributes.color,Le=oe!==void 0?oe.length:0;let Ee=0;K.morphAttributes.position!==void 0&&(Ee=1),K.morphAttributes.normal!==void 0&&(Ee=2),K.morphAttributes.color!==void 0&&(Ee=3);let nt,$e,Je,ie;if(ce){const Xe=Zn[ce];nt=Xe.vertexShader,$e=Xe.fragmentShader}else{nt=x.vertexShader,$e=x.fragmentShader;const Xe=o.getVertexShaderStage(x),ze=o.getFragmentShaderStage(x);o.update(x,Xe,ze),Je=Xe.id,ie=ze.id}const he=s.getRenderTarget(),fe=s.state.buffers.depth.getReversed(),Ie=N.isInstancedMesh===!0,ue=N.isBatchedMesh===!0,Ce=!!x.map,He=!!x.matcap,ne=!!le,pe=!!x.aoMap,de=!!x.lightMap,me=!!x.bumpMap&&x.wireframe===!1,_e=!!x.normalMap,ke=!!x.displacementMap,Ge=!!x.emissiveMap,Ke=!!x.metalnessMap,Ze=!!x.roughnessMap,k=x.anisotropy>0,lt=x.clearcoat>0,et=x.dispersion>0,P=x.retroreflectivity>0,M=x.iridescence>0,C=x.sheen>0,V=x.transmission>0,te=k&&!!x.anisotropyMap,xe=lt&&!!x.clearcoatMap,Se=lt&&!!x.clearcoatNormalMap,re=lt&&!!x.clearcoatRoughnessMap,ae=M&&!!x.iridescenceMap,Re=M&&!!x.iridescenceThicknessMap,De=C&&!!x.sheenColorMap,Te=C&&!!x.sheenRoughnessMap,Pe=!!x.specularMap,Ue=!!x.specularColorMap,We=!!x.specularIntensityMap,Qe=V&&!!x.transmissionMap,_=V&&!!x.thicknessMap,L=!!x.gradientMap,I=!!x.alphaMap,X=x.alphaTest>0,Z=!!x.alphaHash,Y=!!x.extensions;let ve=ei;x.toneMapped&&(he===null||he.isXRRenderTarget===!0)&&(ve=s.toneMapping);const F={shaderID:ce,shaderType:x.type,shaderName:x.name,vertexShader:nt,fragmentShader:$e,defines:x.defines,customVertexShaderID:Je,customFragmentShaderID:ie,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:u,batching:ue,batchingColor:ue&&N._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&N.instanceColor!==null,instancingMorph:Ie&&N.morphTexture!==null,outputColorSpace:he===null?s.outputColorSpace:he.isXRRenderTarget===!0?he.texture.colorSpace:ft.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ce,matcap:He,envMap:ne,envMapMode:ne&&le.mapping,envMapCubeUVHeight:ee,aoMap:pe,lightMap:de,bumpMap:me,normalMap:_e,displacementMap:ke,emissiveMap:Ge,normalMapObjectSpace:_e&&x.normalMapType===Fd,normalMapTangentSpace:_e&&x.normalMapType===Ba,packedNormalMap:_e&&x.normalMapType===Ba&&Uv(x.normalMap.format),metalnessMap:Ke,roughnessMap:Ze,anisotropy:k,anisotropyMap:te,clearcoat:lt,clearcoatMap:xe,clearcoatNormalMap:Se,clearcoatRoughnessMap:re,dispersion:et,retroreflection:P,iridescence:M,iridescenceMap:ae,iridescenceThicknessMap:Re,sheen:C,sheenColorMap:De,sheenRoughnessMap:Te,specularMap:Pe,specularColorMap:Ue,specularIntensityMap:We,transmission:V,transmissionMap:Qe,thicknessMap:_,gradientMap:L,opaque:x.transparent===!1&&x.blending===ts&&x.alphaToCoverage===!1,alphaMap:I,alphaTest:X,alphaHash:Z,combine:x.combine,mapUv:Ce&&p(x.map.channel),aoMapUv:pe&&p(x.aoMap.channel),lightMapUv:de&&p(x.lightMap.channel),bumpMapUv:me&&p(x.bumpMap.channel),normalMapUv:_e&&p(x.normalMap.channel),displacementMapUv:ke&&p(x.displacementMap.channel),emissiveMapUv:Ge&&p(x.emissiveMap.channel),metalnessMapUv:Ke&&p(x.metalnessMap.channel),roughnessMapUv:Ze&&p(x.roughnessMap.channel),anisotropyMapUv:te&&p(x.anisotropyMap.channel),clearcoatMapUv:xe&&p(x.clearcoatMap.channel),clearcoatNormalMapUv:Se&&p(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&p(x.clearcoatRoughnessMap.channel),iridescenceMapUv:ae&&p(x.iridescenceMap.channel),iridescenceThicknessMapUv:Re&&p(x.iridescenceThicknessMap.channel),sheenColorMapUv:De&&p(x.sheenColorMap.channel),sheenRoughnessMapUv:Te&&p(x.sheenRoughnessMap.channel),specularMapUv:Pe&&p(x.specularMap.channel),specularColorMapUv:Ue&&p(x.specularColorMap.channel),specularIntensityMapUv:We&&p(x.specularIntensityMap.channel),transmissionMapUv:Qe&&p(x.transmissionMap.channel),thicknessMapUv:_&&p(x.thicknessMap.channel),alphaMapUv:I&&p(x.alphaMap.channel),vertexTangents:!!K.attributes.tangent&&(_e||k),vertexNormals:!!K.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!K.attributes.color&&K.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!K.attributes.uv&&(Ce||I),fog:!!U,useFog:x.fog===!0,fogExp2:!!U&&U.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||K.attributes.normal===void 0&&_e===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:fe,skinning:N.isSkinnedMesh===!0,hasPositionAttribute:K.attributes.position!==void 0,morphTargets:K.morphAttributes.position!==void 0,morphNormals:K.morphAttributes.normal!==void 0,morphColors:K.morphAttributes.color!==void 0,morphTargetsCount:Le,morphTextureStride:Ee,numSunLights:A.sun.length,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numSunLightShadows:A.sunShadowMap.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:G.length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&D.length>0,shadowMapType:s.shadowMap.type,toneMapping:ve,decodeVideoTexture:Ce&&x.map.isVideoTexture===!0&&ft.getTransfer(x.map.colorSpace)===xt,decodeVideoTextureEmissive:Ge&&x.emissiveMap.isVideoTexture===!0&&ft.getTransfer(x.emissiveMap.colorSpace)===xt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Jt,flipSided:x.side===on,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:Y&&x.extensions.clipCullDistance===!0&&t.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Y&&x.extensions.multiDraw===!0||ue)&&t.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:t.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return F.vertexUv1s=l.has(1),F.vertexUv2s=l.has(2),F.vertexUv3s=l.has(3),l.clear(),F}function g(x){const A=[];if(x.shaderID?A.push(x.shaderID):(A.push(x.customVertexShaderID),A.push(x.customFragmentShaderID)),x.defines!==void 0)for(const D in x.defines)A.push(D),A.push(x.defines[D]);return x.isRawShaderMaterial===!1&&(m(A,x),S(A,x),A.push(s.outputColorSpace)),A.push(x.customProgramCacheKey),A.join()}function m(x,A){x.push(A.precision),x.push(A.outputColorSpace),x.push(A.envMapMode),x.push(A.envMapCubeUVHeight),x.push(A.mapUv),x.push(A.alphaMapUv),x.push(A.lightMapUv),x.push(A.aoMapUv),x.push(A.bumpMapUv),x.push(A.normalMapUv),x.push(A.displacementMapUv),x.push(A.emissiveMapUv),x.push(A.metalnessMapUv),x.push(A.roughnessMapUv),x.push(A.anisotropyMapUv),x.push(A.clearcoatMapUv),x.push(A.clearcoatNormalMapUv),x.push(A.clearcoatRoughnessMapUv),x.push(A.iridescenceMapUv),x.push(A.iridescenceThicknessMapUv),x.push(A.sheenColorMapUv),x.push(A.sheenRoughnessMapUv),x.push(A.specularMapUv),x.push(A.specularColorMapUv),x.push(A.specularIntensityMapUv),x.push(A.transmissionMapUv),x.push(A.thicknessMapUv),x.push(A.combine),x.push(A.fogExp2),x.push(A.sizeAttenuation),x.push(A.morphTargetsCount),x.push(A.morphAttributeCount),x.push(A.numSunLights),x.push(A.numDirLights),x.push(A.numPointLights),x.push(A.numSpotLights),x.push(A.numSpotLightMaps),x.push(A.numHemiLights),x.push(A.numRectAreaLights),x.push(A.numSunLightShadows),x.push(A.numDirLightShadows),x.push(A.numPointLightShadows),x.push(A.numSpotLightShadows),x.push(A.numSpotLightShadowsWithMaps),x.push(A.numLightProbes),x.push(A.shadowMapType),x.push(A.toneMapping),x.push(A.numClippingPlanes),x.push(A.numClipIntersection),x.push(A.depthPacking)}function S(x,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.retroreflection&&a.enable(24),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),A.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function w(x){const A=d[x.type];let D;if(A){const z=Zn[A];D=bm.clone(z.uniforms)}else D=x.uniforms;return D}function y(x,A){let D=h.get(A);return D!==void 0?++D.usedTimes:(D=new Lv(s,A,x,i),c.push(D),h.set(A,D)),D}function E(x){if(--x.usedTimes===0){const A=c.indexOf(x);c[A]=c[c.length-1],c.pop(),h.delete(x.cacheKey),x.destroy()}}function T(x){o.remove(x)}function R(){o.dispose()}return{getParameters:v,getProgramCacheKey:g,getUniforms:w,acquireProgram:y,releaseProgram:E,releaseShaderCache:T,programs:c,dispose:R}}function Fv(){let s=new WeakMap;function e(a){return s.has(a)}function t(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function Bv(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.materialVariant!==e.materialVariant?s.materialVariant-e.materialVariant:s.z!==e.z?s.z-e.z:s.id-e.id}function Mu(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function yu(){const s=[];let e=0;const t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function a(u){let d=0;return u.isInstancedMesh&&(d+=2),u.isSkinnedMesh&&(d+=1),d}function o(u,d,p,v,g,m){let S=s[e];return S===void 0?(S={id:u.id,object:u,geometry:d,material:p,materialVariant:a(u),groupOrder:v,renderOrder:u.renderOrder,z:g,group:m},s[e]=S):(S.id=u.id,S.object=u,S.geometry=d,S.material=p,S.materialVariant=a(u),S.groupOrder=v,S.renderOrder=u.renderOrder,S.z=g,S.group=m),e++,S}function l(u,d,p,v,g,m,S){S.reversedDepth===!0&&(g=-g);const w=o(u,d,p,v,g,m);p.transmission>0?n.push(w):p.transparent===!0?i.push(w):t.push(w)}function c(u,d,p,v,g,m){const S=o(u,d,p,v,g,m);p.transmission>0?n.unshift(S):p.transparent===!0?i.unshift(S):t.unshift(S)}function h(u,d){t.length>1&&t.sort(u||Bv),n.length>1&&n.sort(d||Mu),i.length>1&&i.sort(d||Mu)}function f(){for(let u=e,d=s.length;u<d;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:f,sort:h}}function kv(){let s=new WeakMap;function e(n,i){const r=s.get(n);let a;return r===void 0?(a=new yu,s.set(n,[a])):i>=r.length?(a=new yu,r.push(a)):a=r[i],a}function t(){s=new WeakMap}return{get:e,dispose:t}}function zv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={direction:new O,color:new Ye};break;case"SpotLight":t={position:new O,direction:new O,color:new Ye,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Ye,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Ye,groundColor:new Ye};break;case"RectAreaLight":t={color:new Ye,position:new O,halfWidth:new O,halfHeight:new O};break}return s[e.id]=t,t}}}function Hv(){const s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"SunLight":case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ye,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}let Gv=0;function Vv(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function Wv(s){const e=new zv,t=Hv(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new O);const i=new O,r=new at,a=new at;function o(c){let h=0,f=0,u=0;for(let N=0;N<9;N++)n.probe[N].set(0,0,0);let d=0,p=0,v=0,g=0,m=0,S=0,w=0,y=0,E=0,T=0,R=0,x=0,A=0,D=0;c.sort(Vv);for(let N=0,G=c.length;N<G;N++){const U=c[N],K=U.color,J=U.intensity,$=U.distance;let le=null;if(U.shadow&&U.shadow.map&&(U.shadow.map.texture.format===ss?le=U.shadow.map.texture:le=U.shadow.map.depthTexture||U.shadow.map.texture),U.isAmbientLight)h+=K.r*J,f+=K.g*J,u+=K.b*J;else if(U.isLightProbe){for(let ee=0;ee<9;ee++)n.probe[ee].addScaledVector(U.sh.coefficients[ee],J);D++}else if(U.isSunLight){const ee=e.get(U);if(ee.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const ce=U.shadow,oe=t.get(U);oe.shadowIntensity=ce.intensity,oe.shadowBias=ce.bias,oe.shadowNormalBias=ce.normalBias,oe.shadowRadius=ce.radius,oe.shadowMapSize.copy(ce.mapSize).multiply(ce.getFrameExtents()),n.sunShadow[p]=oe,n.sunShadowMap[p]=le;const Le=ce.getViewportCount();for(let Ee=0;Ee<Le;Ee++)n.sunShadowMatrix[v+Ee]=ce.getMatrix(Ee),n.sunShadowCascade[v+Ee]=ce._cascadeData[Ee];v+=Le,p++}n.sun[d]=ee,d++}else if(U.isDirectionalLight){const ee=e.get(U);if(ee.color.copy(U.color).multiplyScalar(U.intensity),U.castShadow){const ce=U.shadow,oe=t.get(U);oe.shadowIntensity=ce.intensity,oe.shadowBias=ce.bias,oe.shadowNormalBias=ce.normalBias,oe.shadowRadius=ce.radius,oe.shadowMapSize=ce.mapSize,n.directionalShadow[g]=oe,n.directionalShadowMap[g]=le,n.directionalShadowMatrix[g]=U.shadow.matrix,E++}n.directional[g]=ee,g++}else if(U.isSpotLight){const ee=e.get(U);ee.position.setFromMatrixPosition(U.matrixWorld),ee.color.copy(K).multiplyScalar(J),ee.distance=$,ee.coneCos=Math.cos(U.angle),ee.penumbraCos=Math.cos(U.angle*(1-U.penumbra)),ee.decay=U.decay,n.spot[S]=ee;const ce=U.shadow;if(U.map&&(n.spotLightMap[x]=U.map,x++,ce.updateMatrices(U),U.castShadow&&A++),n.spotLightMatrix[S]=ce.matrix,U.castShadow){const oe=t.get(U);oe.shadowIntensity=ce.intensity,oe.shadowBias=ce.bias,oe.shadowNormalBias=ce.normalBias,oe.shadowRadius=ce.radius,oe.shadowMapSize=ce.mapSize,n.spotShadow[S]=oe,n.spotShadowMap[S]=le,R++}S++}else if(U.isRectAreaLight){const ee=e.get(U);ee.color.copy(K).multiplyScalar(J),ee.halfWidth.set(U.width*.5,0,0),ee.halfHeight.set(0,U.height*.5,0),n.rectArea[w]=ee,w++}else if(U.isPointLight){const ee=e.get(U);if(ee.color.copy(U.color).multiplyScalar(U.intensity),ee.distance=U.distance,ee.decay=U.decay,U.castShadow){const ce=U.shadow,oe=t.get(U);oe.shadowIntensity=ce.intensity,oe.shadowBias=ce.bias,oe.shadowNormalBias=ce.normalBias,oe.shadowRadius=ce.radius,oe.shadowMapSize=ce.mapSize,oe.shadowCameraNear=ce.camera.near,oe.shadowCameraFar=ce.camera.far,n.pointShadow[m]=oe,n.pointShadowMap[m]=le,n.pointShadowMatrix[m]=U.shadow.matrix,T++}n.point[m]=ee,m++}else if(U.isHemisphereLight){const ee=e.get(U);ee.skyColor.copy(U.color).multiplyScalar(J),ee.groundColor.copy(U.groundColor).multiplyScalar(J),n.hemi[y]=ee,y++}}w>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ne.LTC_FLOAT_1,n.rectAreaLTC2=Ne.LTC_FLOAT_2):(n.rectAreaLTC1=Ne.LTC_HALF_1,n.rectAreaLTC2=Ne.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=f,n.ambient[2]=u;const z=n.hash;(z.sunLength!==d||z.directionalLength!==g||z.pointLength!==m||z.spotLength!==S||z.rectAreaLength!==w||z.hemiLength!==y||z.numSunShadows!==p||z.numDirectionalShadows!==E||z.numPointShadows!==T||z.numSpotShadows!==R||z.numSpotMaps!==x||z.numLightProbes!==D)&&(n.sun.length=d,n.directional.length=g,n.spot.length=S,n.rectArea.length=w,n.point.length=m,n.hemi.length=y,n.sunShadow.length=p,n.sunShadowMap.length=p,n.sunShadowMatrix.length=v,n.sunShadowCascade.length=v,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.pointShadowMatrix.length=T,n.spotShadow.length=R,n.spotShadowMap.length=R,n.spotLightMatrix.length=R+x-A,n.spotLightMap.length=x,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=D,z.sunLength=d,z.directionalLength=g,z.pointLength=m,z.spotLength=S,z.rectAreaLength=w,z.hemiLength=y,z.numSunShadows=p,z.numDirectionalShadows=E,z.numPointShadows=T,z.numSpotShadows=R,z.numSpotMaps=x,z.numLightProbes=D,n.version=Gv++)}function l(c,h){let f=0,u=0,d=0,p=0,v=0,g=0;const m=h.matrixWorldInverse;for(let S=0,w=c.length;S<w;S++){const y=c[S];if(y.isSunLight){const E=n.sun[f];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(m),f++}else if(y.isDirectionalLight){const E=n.directional[u];E.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(m),u++}else if(y.isSpotLight){const E=n.spot[p];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(m),E.direction.setFromMatrixPosition(y.matrixWorld),i.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(m),p++}else if(y.isRectAreaLight){const E=n.rectArea[v];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(m),a.identity(),r.copy(y.matrixWorld),r.premultiply(m),a.extractRotation(r),E.halfWidth.set(y.width*.5,0,0),E.halfHeight.set(0,y.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),v++}else if(y.isPointLight){const E=n.point[d];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(m),d++}else if(y.isHemisphereLight){const E=n.hemi[g];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(m),g++}}}return{setup:o,setupView:l,state:n}}function Su(s){const e=new Wv(s),t=[],n=[],i=[];function r(u){f.camera=u,t.length=0,n.length=0,i.length=0}function a(u){t.push(u)}function o(u){n.push(u)}function l(u){i.push(u)}function c(){e.setup(t)}function h(u){e.setupView(t,u)}const f={lightsArray:t,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:f,setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function Xv(s){let e=new WeakMap;function t(i,r=0){const a=e.get(i);let o;return a===void 0?(o=new Su(s),e.set(i,[o])):r>=a.length?(o=new Su(s),a.push(o)):o=a[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const qv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Kv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,$v=[new O(1,0,0),new O(-1,0,0),new O(0,1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1)],Yv=[new O(0,-1,0),new O(0,-1,0),new O(0,0,1),new O(0,0,-1),new O(0,-1,0),new O(0,-1,0)],bu=new at,cr=new O,el=new O;function Zv(s,e,t){let n=new Ec;const i=new ye,r=new ye,a=new bt,o=new Rm,l=new Cm,c={},h=t.maxTextureSize,f={[Bi]:on,[on]:Bi,[Jt]:Jt},u=new ii({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ye},radius:{value:4}},vertexShader:qv,fragmentShader:Kv}),d=u.clone();d.defines.HORIZONTAL_PASS=1;const p=new Pt;p.setAttribute("position",new Qt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new _t(p,u),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Aa;let m=this.type;this.render=function(T,R,x){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===Uu&&(qe("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Aa);const A=s.getRenderTarget(),D=s.getActiveCubeFace(),z=s.getActiveMipmapLevel(),N=s.state;N.setBlending(Mi),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const G=m!==this.type;G&&R.traverse(function(U){U.material&&(Array.isArray(U.material)?U.material.forEach(K=>K.needsUpdate=!0):U.material.needsUpdate=!0)});for(let U=0,K=T.length;U<K;U++){const J=T[U],$=J.shadow;if($===void 0){qe("WebGLShadowMap:",J,"has no shadow.");continue}if($.autoUpdate===!1&&$.needsUpdate===!1)continue;i.copy($.mapSize);const le=$.getFrameExtents();i.multiply(le),r.copy($.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/le.x),i.x=r.x*le.x,$.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/le.y),i.y=r.y*le.y,$.mapSize.y=r.y));const ee=s.state.buffers.depth.getReversed();if($.camera._reversedDepth=ee,$.map===null||G===!0){if($.map!==null&&($.map.depthTexture!==null&&($.map.depthTexture.dispose(),$.map.depthTexture=null),$.map.dispose()),this.type===pr){if(J.isPointLight){qe("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}$.map=new kn(i.x,i.y,{format:ss,type:ni,minFilter:Vt,magFilter:Vt,generateMipmaps:!1}),$.map.texture.name=J.name+".shadowMap",$.map.depthTexture=new Nr(i.x,i.y,Rn),$.map.depthTexture.name=J.name+".shadowMapDepth",$.map.depthTexture.format=Si,$.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Gt,$.map.depthTexture.magFilter=Gt}else J.isPointLight?($.map=new wf(i.x),$.map.depthTexture=new Hp(i.x,ti)):($.map=new kn(i.x,i.y),$.map.depthTexture=new Nr(i.x,i.y,ti)),$.map.depthTexture.name=J.name+".shadowMap",$.map.depthTexture.format=Si,this.type===Aa?($.map.depthTexture.compareFunction=ee?gc:mc,$.map.depthTexture.minFilter=Vt,$.map.depthTexture.magFilter=Vt):($.map.depthTexture.compareFunction=null,$.map.depthTexture.minFilter=Gt,$.map.depthTexture.magFilter=Gt);$.camera.updateProjectionMatrix()}$.map.isWebGLCubeRenderTarget!==!0&&($.map.width!==i.x||$.map.height!==i.y)&&$.map.setSize(i.x,i.y);const ce=$.map.isWebGLCubeRenderTarget?6:$.getViewportCount();J.isPointLight!==!0&&$.updateMatrices(J,x);for(let oe=0;oe<ce;oe++){const Le=$.getCamera(oe);if(J.isPointLight){const Ee=$.camera,nt=$.matrix,$e=J.distance||Ee.far;$e!==Ee.far&&(Ee.far=$e,Ee.updateProjectionMatrix()),cr.setFromMatrixPosition(J.matrixWorld),Ee.position.copy(cr),el.copy(Ee.position),el.add($v[oe]),Ee.up.copy(Yv[oe]),Ee.lookAt(el),Ee.updateMatrixWorld(),nt.makeTranslation(-cr.x,-cr.y,-cr.z),bu.multiplyMatrices(Ee.projectionMatrix,Ee.matrixWorldInverse),$._frustum.setFromProjectionMatrix(bu,Ee.coordinateSystem,Ee.reversedDepth)}if($.map.isWebGLCubeRenderTarget)s.setRenderTarget($.map,oe),s.clear();else{oe===0&&(s.setRenderTarget($.map),s.clear());const Ee=$.getViewport(oe);a.set(r.x*Ee.x,r.y*Ee.y,r.x*Ee.z,r.y*Ee.w),N.viewport(a)}n=$.getFrustum(oe),y(R,x,Le,J,this.type)}$.isPointLightShadow!==!0&&this.type===pr&&S($,x),$.needsUpdate=!1}m=this.type,g.needsUpdate=!1,s.setRenderTarget(A,D,z)};function S(T,R){const x=e.update(v);u.defines.VSM_SAMPLES!==T.blurSamples&&(u.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,u.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null?T.mapPass=new kn(i.x,i.y,{format:ss,type:ni}):(T.mapPass.width!==T.map.width||T.mapPass.height!==T.map.height)&&T.mapPass.setSize(T.map.width,T.map.height),u.uniforms.shadow_pass.value=T.map.depthTexture,u.uniforms.resolution.value.set(T.map.width,T.map.height),u.uniforms.radius.value=T.radius,s.setRenderTarget(T.mapPass),s.clear(),s.renderBufferDirect(R,null,x,u,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value.set(T.map.width,T.map.height),d.uniforms.radius.value=T.radius,s.setRenderTarget(T.map),s.clear(),s.renderBufferDirect(R,null,x,d,v,null)}function w(T,R,x,A){let D=null;const z=x.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(z!==void 0)D=z;else if(D=x.isPointLight===!0?l:o,s.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const N=D.uuid,G=R.uuid;let U=c[N];U===void 0&&(U={},c[N]=U);let K=U[G];K===void 0&&(K=D.clone(),U[G]=K,R.addEventListener("dispose",E)),D=K}if(D.visible=R.visible,D.wireframe=R.wireframe,A===pr?D.side=R.shadowSide!==null?R.shadowSide:R.side:D.side=R.shadowSide!==null?R.shadowSide:f[R.side],D.alphaMap=R.alphaMap,D.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,D.map=R.map,D.clipShadows=R.clipShadows,D.clippingPlanes=R.clippingPlanes,D.clipIntersection=R.clipIntersection,D.displacementMap=R.displacementMap,D.displacementScale=R.displacementScale,D.displacementBias=R.displacementBias,D.wireframeLinewidth=R.wireframeLinewidth,D.linewidth=R.linewidth,x.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const N=s.properties.get(D);N.light=x}return D}function y(T,R,x,A,D){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===pr)&&(!T.frustumCulled||T.intersectsFrustum(n))){T.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,T.matrixWorld);const G=e.update(T),U=T.material;if(Array.isArray(U)){const K=G.groups;for(let J=0,$=K.length;J<$;J++){const le=K[J],ee=U[le.materialIndex];if(ee&&ee.visible){const ce=w(T,ee,A,D);T.onBeforeShadow(s,T,R,x,G,ce,le),s.renderBufferDirect(x,null,G,ce,T,le),T.onAfterShadow(s,T,R,x,G,ce,le)}}}else if(U.visible){const K=w(T,U,A,D);T.onBeforeShadow(s,T,R,x,G,K,null),s.renderBufferDirect(x,null,G,K,T,null),T.onAfterShadow(s,T,R,x,G,K,null)}}const N=T.children;for(let G=0,U=N.length;G<U;G++)y(N[G],R,x,A,D)}function E(T){T.target.removeEventListener("dispose",E);for(const x in c){const A=c[x],D=T.target.uuid;D in A&&(A[D].dispose(),delete A[D])}}}function Jv(s,e){function t(){let _=!1;const L=new bt;let I=null;const X=new bt(0,0,0,0);return{setMask:function(Z){I!==Z&&!_&&(s.colorMask(Z,Z,Z,Z),I=Z)},setLocked:function(Z){_=Z},setClear:function(Z,Y,ve,F,Xe){Xe===!0&&(Z*=F,Y*=F,ve*=F),L.set(Z,Y,ve,F),X.equals(L)===!1&&(s.clearColor(Z,Y,ve,F),X.copy(L))},reset:function(){_=!1,I=null,X.set(-1,0,0,0)}}}function n(){let _=!1,L=!1,I=null,X=null,Z=null;return{setReversed:function(Y){if(L!==Y){const ve=e.get("EXT_clip_control");Y?ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.ZERO_TO_ONE_EXT):ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.NEGATIVE_ONE_TO_ONE_EXT),L=Y;const F=Z;Z=null,this.setClear(F)}},getReversed:function(){return L},setTest:function(Y){Y?he(s.DEPTH_TEST):fe(s.DEPTH_TEST)},setMask:function(Y){I!==Y&&!_&&(s.depthMask(Y),I=Y)},setFunc:function(Y){if(L&&(Y=Zd[Y]),X!==Y){switch(Y){case cl:s.depthFunc(s.NEVER);break;case hl:s.depthFunc(s.ALWAYS);break;case ul:s.depthFunc(s.LESS);break;case wr:s.depthFunc(s.LEQUAL);break;case fl:s.depthFunc(s.EQUAL);break;case dl:s.depthFunc(s.GEQUAL);break;case pl:s.depthFunc(s.GREATER);break;case ml:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}X=Y}},setLocked:function(Y){_=Y},setClear:function(Y){Z!==Y&&(Z=Y,L&&(Y=1-Y),s.clearDepth(Y))},reset:function(){_=!1,I=null,X=null,Z=null,L=!1}}}function i(){let _=!1,L=null,I=null,X=null,Z=null,Y=null,ve=null,F=null,Xe=null;return{setTest:function(ze){_||(ze?he(s.STENCIL_TEST):fe(s.STENCIL_TEST))},setMask:function(ze){L!==ze&&!_&&(s.stencilMask(ze),L=ze)},setFunc:function(ze,gt,Me){(I!==ze||X!==gt||Z!==Me)&&(s.stencilFunc(ze,gt,Me),I=ze,X=gt,Z=Me)},setOp:function(ze,gt,Me){(Y!==ze||ve!==gt||F!==Me)&&(s.stencilOp(ze,gt,Me),Y=ze,ve=gt,F=Me)},setLocked:function(ze){_=ze},setClear:function(ze){Xe!==ze&&(s.clearStencil(ze),Xe=ze)},reset:function(){_=!1,L=null,I=null,X=null,Z=null,Y=null,ve=null,F=null,Xe=null}}}const r=new t,a=new n,o=new i,l=new WeakMap,c=new WeakMap;let h={},f={},u={},d=new WeakMap,p=[],v=null,g=!1,m=null,S=null,w=null,y=null,E=null,T=null,R=null,x=new Ye(0,0,0),A=0,D=!1,z=null,N=null,G=null,U=null,K=null;const J=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let $=!1,le=0;const ee=s.getParameter(s.VERSION);ee.indexOf("WebGL")!==-1?(le=parseFloat(/^WebGL (\d)/.exec(ee)[1]),$=le>=1):ee.indexOf("OpenGL ES")!==-1&&(le=parseFloat(/^OpenGL ES (\d)/.exec(ee)[1]),$=le>=2);let ce=null,oe={};const Le=s.getParameter(s.SCISSOR_BOX),Ee=s.getParameter(s.VIEWPORT),nt=new bt().fromArray(Le),$e=new bt().fromArray(Ee);function Je(_,L,I,X){const Z=new Uint8Array(4),Y=s.createTexture();s.bindTexture(_,Y),s.texParameteri(_,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(_,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ve=0;ve<I;ve++)_===s.TEXTURE_3D||_===s.TEXTURE_2D_ARRAY?s.texImage3D(L,0,s.RGBA,1,1,X,0,s.RGBA,s.UNSIGNED_BYTE,Z):s.texImage2D(L+ve,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,Z);return Y}const ie={};ie[s.TEXTURE_2D]=Je(s.TEXTURE_2D,s.TEXTURE_2D,1),ie[s.TEXTURE_CUBE_MAP]=Je(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),ie[s.TEXTURE_2D_ARRAY]=Je(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),ie[s.TEXTURE_3D]=Je(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),he(s.DEPTH_TEST),a.setFunc(wr),me(!1),_e(jc),he(s.CULL_FACE),pe(Mi);function he(_){h[_]!==!0&&(s.enable(_),h[_]=!0)}function fe(_){h[_]!==!1&&(s.disable(_),h[_]=!1)}function Ie(_,L){return u[_]!==L?(s.bindFramebuffer(_,L),u[_]=L,_===s.DRAW_FRAMEBUFFER&&(u[s.FRAMEBUFFER]=L),_===s.FRAMEBUFFER&&(u[s.DRAW_FRAMEBUFFER]=L),!0):!1}function ue(_,L){let I=p,X=!1;if(_){I=d.get(L),I===void 0&&(I=[],d.set(L,I));const Z=_.textures;if(I.length!==Z.length||I[0]!==s.COLOR_ATTACHMENT0){for(let Y=0,ve=Z.length;Y<ve;Y++)I[Y]=s.COLOR_ATTACHMENT0+Y;I.length=Z.length,X=!0}}else I[0]!==s.BACK&&(I[0]=s.BACK,X=!0);X&&s.drawBuffers(I)}function Ce(_){return v!==_?(s.useProgram(_),v=_,!0):!1}const He={[ws]:s.FUNC_ADD,[pd]:s.FUNC_SUBTRACT,[md]:s.FUNC_REVERSE_SUBTRACT};He[gd]=s.MIN,He[_d]=s.MAX;const ne={[xd]:s.ZERO,[vd]:s.ONE,[Md]:s.SRC_COLOR,[Ou]:s.SRC_ALPHA,[wd]:s.SRC_ALPHA_SATURATE,[Ed]:s.DST_COLOR,[Sd]:s.DST_ALPHA,[yd]:s.ONE_MINUS_SRC_COLOR,[Fu]:s.ONE_MINUS_SRC_ALPHA,[Td]:s.ONE_MINUS_DST_COLOR,[bd]:s.ONE_MINUS_DST_ALPHA,[Ad]:s.CONSTANT_COLOR,[Rd]:s.ONE_MINUS_CONSTANT_COLOR,[Cd]:s.CONSTANT_ALPHA,[Pd]:s.ONE_MINUS_CONSTANT_ALPHA};function pe(_,L,I,X,Z,Y,ve,F,Xe,ze){if(_===Mi){g===!0&&(fe(s.BLEND),g=!1);return}if(g===!1&&(he(s.BLEND),g=!0),_!==dd){if(_!==m||ze!==D){if((S!==ws||E!==ws)&&(s.blendEquation(s.FUNC_ADD),S=ws,E=ws),ze)switch(_){case ts:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ll:s.blendFunc(s.ONE,s.ONE);break;case eh:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case th:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:je("WebGLState: Invalid blending: ",_);break}else switch(_){case ts:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ll:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case eh:je("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case th:je("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:je("WebGLState: Invalid blending: ",_);break}w=null,y=null,T=null,R=null,x.set(0,0,0),A=0,m=_,D=ze}return}Z=Z||L,Y=Y||I,ve=ve||X,(L!==S||Z!==E)&&(s.blendEquationSeparate(He[L],He[Z]),S=L,E=Z),(I!==w||X!==y||Y!==T||ve!==R)&&(s.blendFuncSeparate(ne[I],ne[X],ne[Y],ne[ve]),w=I,y=X,T=Y,R=ve),(F.equals(x)===!1||Xe!==A)&&(s.blendColor(F.r,F.g,F.b,Xe),x.copy(F),A=Xe),m=_,D=!1}function de(_,L){_.side===Jt?fe(s.CULL_FACE):he(s.CULL_FACE);let I=_.side===on;L&&(I=!I),me(I),_.blending===ts&&_.transparent===!1?pe(Mi):pe(_.blending,_.blendEquation,_.blendSrc,_.blendDst,_.blendEquationAlpha,_.blendSrcAlpha,_.blendDstAlpha,_.blendColor,_.blendAlpha,_.premultipliedAlpha),a.setFunc(_.depthFunc),a.setTest(_.depthTest),a.setMask(_.depthWrite),r.setMask(_.colorWrite);const X=_.stencilWrite;o.setTest(X),X&&(o.setMask(_.stencilWriteMask),o.setFunc(_.stencilFunc,_.stencilRef,_.stencilFuncMask),o.setOp(_.stencilFail,_.stencilZFail,_.stencilZPass)),Ge(_.polygonOffset,_.polygonOffsetFactor,_.polygonOffsetUnits),_.alphaToCoverage===!0?he(s.SAMPLE_ALPHA_TO_COVERAGE):fe(s.SAMPLE_ALPHA_TO_COVERAGE)}function me(_){z!==_&&(_?s.frontFace(s.CW):s.frontFace(s.CCW),z=_)}function _e(_){_!==ud?(he(s.CULL_FACE),_!==N&&(_===jc?s.cullFace(s.BACK):_===fd?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):fe(s.CULL_FACE),N=_}function ke(_){_!==G&&($&&s.lineWidth(_),G=_)}function Ge(_,L,I){_?(he(s.POLYGON_OFFSET_FILL),(U!==L||K!==I)&&(U=L,K=I,a.getReversed()&&(L=-L),s.polygonOffset(L,I))):fe(s.POLYGON_OFFSET_FILL)}function Ke(_){_?he(s.SCISSOR_TEST):fe(s.SCISSOR_TEST)}function Ze(_){_===void 0&&(_=s.TEXTURE0+J-1),ce!==_&&(s.activeTexture(_),ce=_)}function k(_,L,I){I===void 0&&(ce===null?I=s.TEXTURE0+J-1:I=ce);let X=oe[I];X===void 0&&(X={type:void 0,texture:void 0},oe[I]=X),(X.type!==_||X.texture!==L)&&(ce!==I&&(s.activeTexture(I),ce=I),s.bindTexture(_,L||ie[_]),X.type=_,X.texture=L)}function lt(){const _=oe[ce];_!==void 0&&_.type!==void 0&&(s.bindTexture(_.type,null),_.type=void 0,_.texture=void 0)}function et(){try{s.compressedTexImage2D(...arguments)}catch(_){je("WebGLState:",_)}}function P(){try{s.compressedTexImage3D(...arguments)}catch(_){je("WebGLState:",_)}}function M(){try{s.texSubImage2D(...arguments)}catch(_){je("WebGLState:",_)}}function C(){try{s.texSubImage3D(...arguments)}catch(_){je("WebGLState:",_)}}function V(){try{s.compressedTexSubImage2D(...arguments)}catch(_){je("WebGLState:",_)}}function te(){try{s.compressedTexSubImage3D(...arguments)}catch(_){je("WebGLState:",_)}}function xe(){try{s.texStorage2D(...arguments)}catch(_){je("WebGLState:",_)}}function Se(){try{s.texStorage3D(...arguments)}catch(_){je("WebGLState:",_)}}function re(){try{s.texImage2D(...arguments)}catch(_){je("WebGLState:",_)}}function ae(){try{s.texImage3D(...arguments)}catch(_){je("WebGLState:",_)}}function Re(_){return f[_]!==void 0?f[_]:s.getParameter(_)}function De(_,L){f[_]!==L&&(s.pixelStorei(_,L),f[_]=L)}function Te(_){nt.equals(_)===!1&&(s.scissor(_.x,_.y,_.z,_.w),nt.copy(_))}function Pe(_){$e.equals(_)===!1&&(s.viewport(_.x,_.y,_.z,_.w),$e.copy(_))}function Ue(_,L){let I=c.get(L);I===void 0&&(I=new WeakMap,c.set(L,I));let X=I.get(_);X===void 0&&(X=s.getUniformBlockIndex(L,_.name),I.set(_,X))}function We(_,L){const X=c.get(L).get(_);l.get(L)!==X&&(s.uniformBlockBinding(L,X,_.__bindingPointIndex),l.set(L,X))}function Qe(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),h={},f={},ce=null,oe={},u={},d=new WeakMap,p=[],v=null,g=!1,m=null,S=null,w=null,y=null,E=null,T=null,R=null,x=new Ye(0,0,0),A=0,D=!1,z=null,N=null,G=null,U=null,K=null,nt.set(0,0,s.canvas.width,s.canvas.height),$e.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:he,disable:fe,bindFramebuffer:Ie,drawBuffers:ue,useProgram:Ce,setBlending:pe,setMaterial:de,setFlipSided:me,setCullFace:_e,setLineWidth:ke,setPolygonOffset:Ge,setScissorTest:Ke,activeTexture:Ze,bindTexture:k,unbindTexture:lt,compressedTexImage2D:et,compressedTexImage3D:P,texImage2D:re,texImage3D:ae,pixelStorei:De,getParameter:Re,updateUBOMapping:Ue,uniformBlockBinding:We,texStorage2D:xe,texStorage3D:Se,texSubImage2D:M,texSubImage3D:C,compressedTexSubImage2D:V,compressedTexSubImage3D:te,scissor:Te,viewport:Pe,reset:Qe}}function Qv(s,e,t,n,i,r,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ye,h=new WeakMap,f=new Set;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(P,M){return p?new OffscreenCanvas(P,M):Ir("canvas")}function g(P,M,C){let V=1;const te=et(P);if((te.width>C||te.height>C)&&(V=C/Math.max(te.width,te.height)),V<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const xe=Math.floor(V*te.width),Se=Math.floor(V*te.height);u===void 0&&(u=v(xe,Se));const re=M?v(xe,Se):u;return re.width=xe,re.height=Se,re.getContext("2d").drawImage(P,0,0,xe,Se),qe("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+xe+"x"+Se+")."),re}else return"data"in P&&qe("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),P;return P}function m(P){return P.generateMipmaps}function S(P){s.generateMipmap(P)}function w(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function y(P,M,C,V,te,xe=!1){if(P!==null){if(s[P]!==void 0)return s[P];qe("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Se;V&&(Se=e.get("EXT_texture_norm16"),Se||qe("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let re=M;if(M===s.RED&&(C===s.FLOAT&&(re=s.R32F),C===s.HALF_FLOAT&&(re=s.R16F),C===s.UNSIGNED_BYTE&&(re=s.R8),C===s.UNSIGNED_SHORT&&Se&&(re=Se.R16_EXT),C===s.SHORT&&Se&&(re=Se.R16_SNORM_EXT)),M===s.RED_INTEGER&&(C===s.UNSIGNED_BYTE&&(re=s.R8UI),C===s.UNSIGNED_SHORT&&(re=s.R16UI),C===s.UNSIGNED_INT&&(re=s.R32UI),C===s.BYTE&&(re=s.R8I),C===s.SHORT&&(re=s.R16I),C===s.INT&&(re=s.R32I)),M===s.RG&&(C===s.FLOAT&&(re=s.RG32F),C===s.HALF_FLOAT&&(re=s.RG16F),C===s.UNSIGNED_BYTE&&(re=s.RG8),C===s.UNSIGNED_SHORT&&Se&&(re=Se.RG16_EXT),C===s.SHORT&&Se&&(re=Se.RG16_SNORM_EXT)),M===s.RG_INTEGER&&(C===s.UNSIGNED_BYTE&&(re=s.RG8UI),C===s.UNSIGNED_SHORT&&(re=s.RG16UI),C===s.UNSIGNED_INT&&(re=s.RG32UI),C===s.BYTE&&(re=s.RG8I),C===s.SHORT&&(re=s.RG16I),C===s.INT&&(re=s.RG32I)),M===s.RGB_INTEGER&&(C===s.UNSIGNED_BYTE&&(re=s.RGB8UI),C===s.UNSIGNED_SHORT&&(re=s.RGB16UI),C===s.UNSIGNED_INT&&(re=s.RGB32UI),C===s.BYTE&&(re=s.RGB8I),C===s.SHORT&&(re=s.RGB16I),C===s.INT&&(re=s.RGB32I)),M===s.RGBA_INTEGER&&(C===s.UNSIGNED_BYTE&&(re=s.RGBA8UI),C===s.UNSIGNED_SHORT&&(re=s.RGBA16UI),C===s.UNSIGNED_INT&&(re=s.RGBA32UI),C===s.BYTE&&(re=s.RGBA8I),C===s.SHORT&&(re=s.RGBA16I),C===s.INT&&(re=s.RGBA32I)),M===s.RGB&&(C===s.UNSIGNED_SHORT&&Se&&(re=Se.RGB16_EXT),C===s.SHORT&&Se&&(re=Se.RGB16_SNORM_EXT),C===s.UNSIGNED_INT_5_9_9_9_REV&&(re=s.RGB9_E5),C===s.UNSIGNED_INT_10F_11F_11F_REV&&(re=s.R11F_G11F_B10F)),M===s.RGBA){const ae=xe?ka:ft.getTransfer(te);C===s.FLOAT&&(re=s.RGBA32F),C===s.HALF_FLOAT&&(re=s.RGBA16F),C===s.UNSIGNED_BYTE&&(re=ae===xt?s.SRGB8_ALPHA8:s.RGBA8),C===s.UNSIGNED_SHORT&&Se&&(re=Se.RGBA16_EXT),C===s.SHORT&&Se&&(re=Se.RGBA16_SNORM_EXT),C===s.UNSIGNED_SHORT_4_4_4_4&&(re=s.RGBA4),C===s.UNSIGNED_SHORT_5_5_5_1&&(re=s.RGB5_A1)}return(re===s.R16F||re===s.R32F||re===s.RG16F||re===s.RG32F||re===s.RGBA16F||re===s.RGBA32F)&&e.get("EXT_color_buffer_float"),re}function E(P,M){let C;return P?M===null||M===ti||M===Rr?C=s.DEPTH24_STENCIL8:M===Rn?C=s.DEPTH32F_STENCIL8:M===Ar&&(C=s.DEPTH24_STENCIL8,qe("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):M===null||M===ti||M===Rr?C=s.DEPTH_COMPONENT24:M===Rn?C=s.DEPTH_COMPONENT32F:M===Ar&&(C=s.DEPTH_COMPONENT16),C}function T(P,M){return m(P)===!0||P.isFramebufferTexture&&P.minFilter!==Gt&&P.minFilter!==Vt?Math.log2(Math.max(M.width,M.height))+1:P.mipmaps!==void 0&&P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?M.mipmaps.length:1}function R(P){const M=P.target;M.removeEventListener("dispose",R),A(M),M.isVideoTexture&&h.delete(M),M.isHTMLTexture&&f.delete(M)}function x(P){const M=P.target;M.removeEventListener("dispose",x),z(M)}function A(P){const M=n.get(P);if(M.__webglInit===void 0)return;const C=P.source,V=d.get(C);if(V){const te=V[M.__cacheKey];te.usedTimes--,te.usedTimes===0&&D(P),Object.keys(V).length===0&&d.delete(C)}n.remove(P)}function D(P){const M=n.get(P);s.deleteTexture(M.__webglTexture);const C=P.source,V=d.get(C);delete V[M.__cacheKey],a.memory.textures--}function z(P){const M=n.get(P);if(P.depthTexture&&(P.depthTexture.dispose(),n.remove(P.depthTexture)),P.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(M.__webglFramebuffer[V]))for(let te=0;te<M.__webglFramebuffer[V].length;te++)s.deleteFramebuffer(M.__webglFramebuffer[V][te]);else s.deleteFramebuffer(M.__webglFramebuffer[V]);M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer[V])}else{if(Array.isArray(M.__webglFramebuffer))for(let V=0;V<M.__webglFramebuffer.length;V++)s.deleteFramebuffer(M.__webglFramebuffer[V]);else s.deleteFramebuffer(M.__webglFramebuffer);if(M.__webglDepthbuffer&&s.deleteRenderbuffer(M.__webglDepthbuffer),M.__webglMultisampledFramebuffer&&s.deleteFramebuffer(M.__webglMultisampledFramebuffer),M.__webglColorRenderbuffer)for(let V=0;V<M.__webglColorRenderbuffer.length;V++)M.__webglColorRenderbuffer[V]&&s.deleteRenderbuffer(M.__webglColorRenderbuffer[V]);M.__webglDepthRenderbuffer&&s.deleteRenderbuffer(M.__webglDepthRenderbuffer)}const C=P.textures;for(let V=0,te=C.length;V<te;V++){const xe=n.get(C[V]);xe.__webglTexture&&(s.deleteTexture(xe.__webglTexture),a.memory.textures--),n.remove(C[V])}n.remove(P)}let N=0;function G(){N=0}function U(){return N}function K(P){N=P}function J(){const P=N;return P>=i.maxTextures&&qe("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+i.maxTextures),N+=1,P}function $(P){const M=[];return M.push(P.wrapS),M.push(P.wrapT),M.push(P.wrapR||0),M.push(P.magFilter),M.push(P.minFilter),M.push(P.anisotropy),M.push(P.internalFormat),M.push(P.format),M.push(P.type),M.push(P.generateMipmaps),M.push(P.premultiplyAlpha),M.push(P.flipY),M.push(P.unpackAlignment),M.push(P.colorSpace),M.join()}function le(P,M){const C=n.get(P);if(P.isVideoTexture&&k(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&C.__version!==P.version){const V=P.image;if(V===null)qe("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)qe("WebGLRenderer: Texture marked for update but image is incomplete");else{fe(C,P,M);return}}else P.isExternalTexture&&(C.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,C.__webglTexture,s.TEXTURE0+M)}function ee(P,M){const C=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&C.__version!==P.version){fe(C,P,M);return}else P.isExternalTexture&&(C.__webglTexture=P.sourceTexture?P.sourceTexture:null);t.bindTexture(s.TEXTURE_2D_ARRAY,C.__webglTexture,s.TEXTURE0+M)}function ce(P,M){const C=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&C.__version!==P.version){fe(C,P,M);return}t.bindTexture(s.TEXTURE_3D,C.__webglTexture,s.TEXTURE0+M)}function oe(P,M){const C=n.get(P);if(P.isCubeDepthTexture!==!0&&P.version>0&&C.__version!==P.version){Ie(C,P,M);return}t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+M)}const Le={[Jn]:s.REPEAT,[Qn]:s.CLAMP_TO_EDGE,[Ua]:s.MIRRORED_REPEAT},Ee={[Gt]:s.NEAREST,[Xu]:s.NEAREST_MIPMAP_NEAREST,[mr]:s.NEAREST_MIPMAP_LINEAR,[Vt]:s.LINEAR,[Ra]:s.LINEAR_MIPMAP_NEAREST,[gi]:s.LINEAR_MIPMAP_LINEAR},nt={[kd]:s.NEVER,[Wd]:s.ALWAYS,[zd]:s.LESS,[mc]:s.LEQUAL,[Hd]:s.EQUAL,[gc]:s.GEQUAL,[Gd]:s.GREATER,[Vd]:s.NOTEQUAL};function $e(P,M){if(M.type===Rn&&e.has("OES_texture_float_linear")===!1&&(M.magFilter===Vt||M.magFilter===Ra||M.magFilter===mr||M.magFilter===gi||M.minFilter===Vt||M.minFilter===Ra||M.minFilter===mr||M.minFilter===gi)&&qe("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,Le[M.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,Le[M.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,Le[M.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,Ee[M.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,Ee[M.minFilter]),M.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,nt[M.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(M.magFilter===Gt||M.minFilter!==mr&&M.minFilter!==gi||M.type===Rn&&e.has("OES_texture_float_linear")===!1)return;if(M.anisotropy>1||n.get(M).__currentAnisotropy){const C=e.get("EXT_texture_filter_anisotropic");s.texParameterf(P,C.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,i.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy}}}function Je(P,M){let C=!1;P.__webglInit===void 0&&(P.__webglInit=!0,M.addEventListener("dispose",R));const V=M.source;let te=d.get(V);te===void 0&&(te={},d.set(V,te));const xe=$(M);if(xe!==P.__cacheKey){te[xe]===void 0&&(te[xe]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,C=!0),te[xe].usedTimes++;const Se=te[P.__cacheKey];Se!==void 0&&(te[P.__cacheKey].usedTimes--,Se.usedTimes===0&&D(M)),P.__cacheKey=xe,P.__webglTexture=te[xe].texture}return C}function ie(P,M,C){return Math.floor(Math.floor(P/C)/M)}function he(P,M,C,V){const xe=P.updateRanges;if(xe.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,M.width,M.height,C,V,M.data);else{xe.sort((De,Te)=>De.start-Te.start);let Se=0;for(let De=1;De<xe.length;De++){const Te=xe[Se],Pe=xe[De],Ue=Te.start+Te.count,We=ie(Pe.start,M.width,4),Qe=ie(Te.start,M.width,4);Pe.start<=Ue+1&&We===Qe&&ie(Pe.start+Pe.count-1,M.width,4)===We?Te.count=Math.max(Te.count,Pe.start+Pe.count-Te.start):(++Se,xe[Se]=Pe)}xe.length=Se+1;const re=t.getParameter(s.UNPACK_ROW_LENGTH),ae=t.getParameter(s.UNPACK_SKIP_PIXELS),Re=t.getParameter(s.UNPACK_SKIP_ROWS);t.pixelStorei(s.UNPACK_ROW_LENGTH,M.width);for(let De=0,Te=xe.length;De<Te;De++){const Pe=xe[De],Ue=Math.floor(Pe.start/4),We=Math.ceil(Pe.count/4),Qe=Ue%M.width,_=Math.floor(Ue/M.width),L=We,I=1;t.pixelStorei(s.UNPACK_SKIP_PIXELS,Qe),t.pixelStorei(s.UNPACK_SKIP_ROWS,_),t.texSubImage2D(s.TEXTURE_2D,0,Qe,_,L,I,C,V,M.data)}P.clearUpdateRanges(),t.pixelStorei(s.UNPACK_ROW_LENGTH,re),t.pixelStorei(s.UNPACK_SKIP_PIXELS,ae),t.pixelStorei(s.UNPACK_SKIP_ROWS,Re)}}function fe(P,M,C){let V=s.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(V=s.TEXTURE_2D_ARRAY),M.isData3DTexture&&(V=s.TEXTURE_3D);const te=Je(P,M),xe=M.source;t.bindTexture(V,P.__webglTexture,s.TEXTURE0+C);const Se=n.get(xe);if(xe.version!==Se.__version||te===!0){if(t.activeTexture(s.TEXTURE0+C),(typeof ImageBitmap<"u"&&M.image instanceof ImageBitmap)===!1){const I=ft.getPrimaries(ft.workingColorSpace),X=M.colorSpace===Fi?null:ft.getPrimaries(M.colorSpace),Z=M.colorSpace===Fi||I===X?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Z)}t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment);let ae=g(M.image,!1,i.maxTextureSize);ae=lt(M,ae);const Re=r.convert(M.format,M.colorSpace),De=r.convert(M.type);let Te=y(M.internalFormat,Re,De,M.normalized,M.colorSpace,M.isVideoTexture);$e(V,M);let Pe;const Ue=M.mipmaps,We=M.isVideoTexture!==!0,Qe=Se.__version===void 0||te===!0,_=xe.dataReady,L=T(M,ae);if(M.isDepthTexture)Te=E(M.format===ji,M.type),Qe&&(We?t.texStorage2D(s.TEXTURE_2D,1,Te,ae.width,ae.height):t.texImage2D(s.TEXTURE_2D,0,Te,ae.width,ae.height,0,Re,De,null));else if(M.isDataTexture)if(Ue.length>0){We&&Qe&&t.texStorage2D(s.TEXTURE_2D,L,Te,Ue[0].width,Ue[0].height);for(let I=0,X=Ue.length;I<X;I++)Pe=Ue[I],We?_&&t.texSubImage2D(s.TEXTURE_2D,I,0,0,Pe.width,Pe.height,Re,De,Pe.data):t.texImage2D(s.TEXTURE_2D,I,Te,Pe.width,Pe.height,0,Re,De,Pe.data);M.generateMipmaps=!1}else We?(Qe&&t.texStorage2D(s.TEXTURE_2D,L,Te,ae.width,ae.height),_&&he(M,ae,Re,De)):t.texImage2D(s.TEXTURE_2D,0,Te,ae.width,ae.height,0,Re,De,ae.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){We&&Qe&&t.texStorage3D(s.TEXTURE_2D_ARRAY,L,Te,Ue[0].width,Ue[0].height,ae.depth);for(let I=0,X=Ue.length;I<X;I++)if(Pe=Ue[I],M.format!==Cn)if(Re!==null)if(We){if(_)if(M.layerUpdates.size>0){const Z=nu(Pe.width,Pe.height,M.format,M.type);for(const Y of M.layerUpdates){const ve=Pe.data.subarray(Y*Z/Pe.data.BYTES_PER_ELEMENT,(Y+1)*Z/Pe.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,I,0,0,Y,Pe.width,Pe.height,1,Re,ve)}}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,I,0,0,0,Pe.width,Pe.height,ae.depth,Re,Pe.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,I,Te,Pe.width,Pe.height,ae.depth,0,Pe.data,0,0);else qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else We?_&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,I,0,0,0,Pe.width,Pe.height,ae.depth,Re,De,Pe.data):t.texImage3D(s.TEXTURE_2D_ARRAY,I,Te,Pe.width,Pe.height,ae.depth,0,Re,De,Pe.data);M.layerUpdates.size>0&&M.clearLayerUpdates()}else{We&&Qe&&t.texStorage2D(s.TEXTURE_2D,L,Te,Ue[0].width,Ue[0].height);for(let I=0,X=Ue.length;I<X;I++)Pe=Ue[I],M.format!==Cn?Re!==null?We?_&&t.compressedTexSubImage2D(s.TEXTURE_2D,I,0,0,Pe.width,Pe.height,Re,Pe.data):t.compressedTexImage2D(s.TEXTURE_2D,I,Te,Pe.width,Pe.height,0,Pe.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):We?_&&t.texSubImage2D(s.TEXTURE_2D,I,0,0,Pe.width,Pe.height,Re,De,Pe.data):t.texImage2D(s.TEXTURE_2D,I,Te,Pe.width,Pe.height,0,Re,De,Pe.data)}else if(M.isDataArrayTexture)if(We){if(Qe&&t.texStorage3D(s.TEXTURE_2D_ARRAY,L,Te,ae.width,ae.height,ae.depth),_)if(M.layerUpdates.size>0){const I=nu(ae.width,ae.height,M.format,M.type);for(const X of M.layerUpdates){const Z=ae.data.subarray(X*I/ae.data.BYTES_PER_ELEMENT,(X+1)*I/ae.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,X,ae.width,ae.height,1,Re,De,Z)}M.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,Re,De,ae.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Te,ae.width,ae.height,ae.depth,0,Re,De,ae.data);else if(M.isData3DTexture)We?(Qe&&t.texStorage3D(s.TEXTURE_3D,L,Te,ae.width,ae.height,ae.depth),_&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,Re,De,ae.data)):t.texImage3D(s.TEXTURE_3D,0,Te,ae.width,ae.height,ae.depth,0,Re,De,ae.data);else if(M.isFramebufferTexture){if(Qe)if(We)t.texStorage2D(s.TEXTURE_2D,L,Te,ae.width,ae.height);else{let I=ae.width,X=ae.height;for(let Z=0;Z<L;Z++)t.texImage2D(s.TEXTURE_2D,Z,Te,I,X,0,Re,De,null),I>>=1,X>>=1}}else if(M.isHTMLTexture){if("texElementImage2D"in s){const I=s.canvas;if(I.hasAttribute("layoutsubtree")||I.setAttribute("layoutsubtree","true"),ae.parentNode!==I){I.appendChild(ae),f.add(M),I.onpaint=X=>{const Z=X.changedElements;for(const Y of f)Z.includes(Y.image)&&(Y.needsUpdate=!0)},I.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,ae);else{const Z=s.RGBA,Y=s.RGBA,ve=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,Z,Y,ve,ae)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(Ue.length>0){if(We&&Qe){const I=et(Ue[0]);t.texStorage2D(s.TEXTURE_2D,L,Te,I.width,I.height)}for(let I=0,X=Ue.length;I<X;I++)Pe=Ue[I],We?_&&t.texSubImage2D(s.TEXTURE_2D,I,0,0,Re,De,Pe):t.texImage2D(s.TEXTURE_2D,I,Te,Re,De,Pe);M.generateMipmaps=!1}else if(We){if(Qe){const I=et(ae);t.texStorage2D(s.TEXTURE_2D,L,Te,I.width,I.height)}_&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,Re,De,ae)}else t.texImage2D(s.TEXTURE_2D,0,Te,Re,De,ae);m(M)&&S(V),Se.__version=xe.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function Ie(P,M,C){if(M.image.length!==6)return;const V=Je(P,M),te=M.source;t.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+C);const xe=n.get(te);if(te.version!==xe.__version||V===!0){t.activeTexture(s.TEXTURE0+C);const Se=ft.getPrimaries(ft.workingColorSpace),re=M.colorSpace===Fi?null:ft.getPrimaries(M.colorSpace),ae=M.colorSpace===Fi||Se===re?s.NONE:s.BROWSER_DEFAULT_WEBGL;t.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,M.flipY),t.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),t.pixelStorei(s.UNPACK_ALIGNMENT,M.unpackAlignment),t.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);const Re=M.isCompressedTexture||M.image[0].isCompressedTexture,De=M.image[0]&&M.image[0].isDataTexture,Te=[];for(let Y=0;Y<6;Y++)!Re&&!De?Te[Y]=g(M.image[Y],!0,i.maxCubemapSize):Te[Y]=De?M.image[Y].image:M.image[Y],Te[Y]=lt(M,Te[Y]);const Pe=Te[0],Ue=r.convert(M.format,M.colorSpace),We=r.convert(M.type),Qe=y(M.internalFormat,Ue,We,M.normalized,M.colorSpace),_=M.isVideoTexture!==!0,L=xe.__version===void 0||V===!0,I=te.dataReady;let X=T(M,Pe);$e(s.TEXTURE_CUBE_MAP,M);let Z;if(Re){_&&L&&t.texStorage2D(s.TEXTURE_CUBE_MAP,X,Qe,Pe.width,Pe.height);for(let Y=0;Y<6;Y++){Z=Te[Y].mipmaps;for(let ve=0;ve<Z.length;ve++){const F=Z[ve];M.format!==Cn?Ue!==null?_?I&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve,0,0,F.width,F.height,Ue,F.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve,Qe,F.width,F.height,0,F.data):qe("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):_?I&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve,0,0,F.width,F.height,Ue,We,F.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve,Qe,F.width,F.height,0,Ue,We,F.data)}}}else{if(Z=M.mipmaps,_&&L){Z.length>0&&X++;const Y=et(Te[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,X,Qe,Y.width,Y.height)}for(let Y=0;Y<6;Y++)if(De){_?I&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Te[Y].width,Te[Y].height,Ue,We,Te[Y].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Qe,Te[Y].width,Te[Y].height,0,Ue,We,Te[Y].data);for(let ve=0;ve<Z.length;ve++){const Xe=Z[ve].image[Y].image;_?I&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve+1,0,0,Xe.width,Xe.height,Ue,We,Xe.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve+1,Qe,Xe.width,Xe.height,0,Ue,We,Xe.data)}}else{_?I&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,0,0,Ue,We,Te[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,0,Qe,Ue,We,Te[Y]);for(let ve=0;ve<Z.length;ve++){const F=Z[ve];_?I&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve+1,0,0,Ue,We,F.image[Y]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Y,ve+1,Qe,Ue,We,F.image[Y])}}}m(M)&&S(s.TEXTURE_CUBE_MAP),xe.__version=te.version,M.onUpdate&&M.onUpdate(M)}P.__version=M.version}function ue(P,M,C,V,te,xe){const Se=r.convert(C.format,C.colorSpace),re=r.convert(C.type),ae=y(C.internalFormat,Se,re,C.normalized,C.colorSpace),Re=n.get(M),De=n.get(C);if(De.__renderTarget=M,!Re.__hasExternalTextures){const Te=Math.max(1,M.width>>xe),Pe=Math.max(1,M.height>>xe);te===s.TEXTURE_3D||te===s.TEXTURE_2D_ARRAY?t.texImage3D(te,xe,ae,Te,Pe,M.depth,0,Se,re,null):t.texImage2D(te,xe,ae,Te,Pe,0,Se,re,null)}t.bindFramebuffer(s.FRAMEBUFFER,P),Ze(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,V,te,De.__webglTexture,0,Ke(M)):(te===s.TEXTURE_2D||te>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,V,te,De.__webglTexture,xe),t.bindFramebuffer(s.FRAMEBUFFER,null)}function Ce(P,M,C){if(s.bindRenderbuffer(s.RENDERBUFFER,P),M.depthBuffer){const V=M.depthTexture,te=V&&V.isDepthTexture?V.type:null,xe=E(M.stencilBuffer,te),Se=M.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Ze(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ke(M),xe,M.width,M.height):C?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ke(M),xe,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,xe,M.width,M.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Se,s.RENDERBUFFER,P)}else{const V=M.textures;for(let te=0;te<V.length;te++){const xe=V[te],Se=r.convert(xe.format,xe.colorSpace),re=r.convert(xe.type),ae=y(xe.internalFormat,Se,re,xe.normalized,xe.colorSpace);Ze(M)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Ke(M),ae,M.width,M.height):C?s.renderbufferStorageMultisample(s.RENDERBUFFER,Ke(M),ae,M.width,M.height):s.renderbufferStorage(s.RENDERBUFFER,ae,M.width,M.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function He(P,M,C){const V=M.isWebGLCubeRenderTarget===!0;if(t.bindFramebuffer(s.FRAMEBUFFER,P),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const te=n.get(M.depthTexture);if(te.__renderTarget=M,(!te.__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),V){if(te.__webglInit===void 0&&(te.__webglInit=!0,M.depthTexture.addEventListener("dispose",R)),te.__webglTexture===void 0){te.__webglTexture=s.createTexture(),t.bindTexture(s.TEXTURE_CUBE_MAP,te.__webglTexture),$e(s.TEXTURE_CUBE_MAP,M.depthTexture);const Re=r.convert(M.depthTexture.format),De=r.convert(M.depthTexture.type);let Te;M.depthTexture.format===Si?Te=s.DEPTH_COMPONENT24:M.depthTexture.format===ji&&(Te=s.DEPTH24_STENCIL8);for(let Pe=0;Pe<6;Pe++)s.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+Pe,0,Te,M.width,M.height,0,Re,De,null)}}else le(M.depthTexture,0);const xe=te.__webglTexture,Se=Ke(M),re=V?s.TEXTURE_CUBE_MAP_POSITIVE_X+C:s.TEXTURE_2D,ae=M.depthTexture.format===ji?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(M.depthTexture.format===Si)Ze(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ae,re,xe,0,Se):s.framebufferTexture2D(s.FRAMEBUFFER,ae,re,xe,0);else if(M.depthTexture.format===ji)Ze(M)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ae,re,xe,0,Se):s.framebufferTexture2D(s.FRAMEBUFFER,ae,re,xe,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function ne(P){const M=n.get(P),C=P.isWebGLCubeRenderTarget===!0;if(M.__boundDepthTexture!==P.depthTexture){const V=P.depthTexture;if(M.__depthDisposeCallback&&M.__depthDisposeCallback(),V){const te=()=>{delete M.__boundDepthTexture,delete M.__depthDisposeCallback,V.removeEventListener("dispose",te)};V.addEventListener("dispose",te),M.__depthDisposeCallback=te}M.__boundDepthTexture=V}if(P.depthTexture&&!M.__autoAllocateDepthBuffer)if(C)for(let V=0;V<6;V++)He(M.__webglFramebuffer[V],P,V);else{const V=P.texture.mipmaps;V&&V.length>0?He(M.__webglFramebuffer[0],P,0):He(M.__webglFramebuffer,P,0)}else if(C){M.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[V]),M.__webglDepthbuffer[V]===void 0)M.__webglDepthbuffer[V]=s.createRenderbuffer(),Ce(M.__webglDepthbuffer[V],P,!1);else{const te=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=M.__webglDepthbuffer[V];s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,te,s.RENDERBUFFER,xe)}}else{const V=P.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer===void 0)M.__webglDepthbuffer=s.createRenderbuffer(),Ce(M.__webglDepthbuffer,P,!1);else{const te=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,xe=M.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,xe),s.framebufferRenderbuffer(s.FRAMEBUFFER,te,s.RENDERBUFFER,xe)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function pe(P,M,C){const V=n.get(P);M!==void 0&&ue(V.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),C!==void 0&&ne(P)}function de(P){const M=P.texture,C=n.get(P),V=n.get(M);P.addEventListener("dispose",x);const te=P.textures,xe=P.isWebGLCubeRenderTarget===!0,Se=te.length>1;if(Se||(V.__webglTexture===void 0&&(V.__webglTexture=s.createTexture()),V.__version=M.version,a.memory.textures++),xe){C.__webglFramebuffer=[];for(let re=0;re<6;re++)if(M.mipmaps&&M.mipmaps.length>0){C.__webglFramebuffer[re]=[];for(let ae=0;ae<M.mipmaps.length;ae++)C.__webglFramebuffer[re][ae]=s.createFramebuffer()}else C.__webglFramebuffer[re]=s.createFramebuffer()}else{if(M.mipmaps&&M.mipmaps.length>0){C.__webglFramebuffer=[];for(let re=0;re<M.mipmaps.length;re++)C.__webglFramebuffer[re]=s.createFramebuffer()}else C.__webglFramebuffer=s.createFramebuffer();if(Se)for(let re=0,ae=te.length;re<ae;re++){const Re=n.get(te[re]);Re.__webglTexture===void 0&&(Re.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&Ze(P)===!1){C.__webglMultisampledFramebuffer=s.createFramebuffer(),C.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,C.__webglMultisampledFramebuffer);for(let re=0;re<te.length;re++){const ae=te[re];C.__webglColorRenderbuffer[re]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,C.__webglColorRenderbuffer[re]);const Re=r.convert(ae.format,ae.colorSpace),De=r.convert(ae.type),Te=y(ae.internalFormat,Re,De,ae.normalized,ae.colorSpace,P.isXRRenderTarget===!0),Pe=Ke(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,Pe,Te,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+re,s.RENDERBUFFER,C.__webglColorRenderbuffer[re])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(C.__webglDepthRenderbuffer=s.createRenderbuffer(),Ce(C.__webglDepthRenderbuffer,P,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(xe){t.bindTexture(s.TEXTURE_CUBE_MAP,V.__webglTexture),$e(s.TEXTURE_CUBE_MAP,M);for(let re=0;re<6;re++)if(M.mipmaps&&M.mipmaps.length>0)for(let ae=0;ae<M.mipmaps.length;ae++)ue(C.__webglFramebuffer[re][ae],P,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+re,ae);else ue(C.__webglFramebuffer[re],P,M,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);m(M)&&S(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Se){for(let re=0,ae=te.length;re<ae;re++){const Re=te[re],De=n.get(Re);let Te=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Te=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(Te,De.__webglTexture),$e(Te,Re),ue(C.__webglFramebuffer,P,Re,s.COLOR_ATTACHMENT0+re,Te,0),m(Re)&&S(Te)}t.unbindTexture()}else{let re=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(re=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(re,V.__webglTexture),$e(re,M),M.mipmaps&&M.mipmaps.length>0)for(let ae=0;ae<M.mipmaps.length;ae++)ue(C.__webglFramebuffer[ae],P,M,s.COLOR_ATTACHMENT0,re,ae);else ue(C.__webglFramebuffer,P,M,s.COLOR_ATTACHMENT0,re,0);m(M)&&S(re),t.unbindTexture()}P.depthBuffer&&ne(P)}function me(P){const M=P.textures;for(let C=0,V=M.length;C<V;C++){const te=M[C];if(m(te)){const xe=w(P),Se=n.get(te).__webglTexture;t.bindTexture(xe,Se),S(xe),t.unbindTexture()}}}const _e=[],ke=[];function Ge(P){if(P.samples>0){if(Ze(P)===!1){const M=P.textures,C=P.width,V=P.height;let te=s.COLOR_BUFFER_BIT;const xe=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Se=n.get(P),re=M.length>1;if(re)for(let Re=0;Re<M.length;Re++)t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Se.__webglMultisampledFramebuffer);const ae=P.texture.mipmaps;ae&&ae.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let Re=0;Re<M.length;Re++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(te|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(te|=s.STENCIL_BUFFER_BIT)),re){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Se.__webglColorRenderbuffer[Re]);const De=n.get(M[Re]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,De,0)}s.blitFramebuffer(0,0,C,V,0,0,C,V,te,s.NEAREST),l===!0&&(_e.length=0,ke.length=0,_e.push(s.COLOR_ATTACHMENT0+Re),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&(_e.push(xe),ke.push(xe),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,ke)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,_e))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),re)for(let Re=0;Re<M.length;Re++){t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.RENDERBUFFER,Se.__webglColorRenderbuffer[Re]);const De=n.get(M[Re]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Se.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+Re,s.TEXTURE_2D,De,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Se.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){const M=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[M])}}}function Ke(P){return Math.min(i.maxSamples,P.samples)}function Ze(P){const M=n.get(P);return P.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function k(P){const M=a.render.frame;h.get(P)!==M&&(h.set(P,M),P.update())}function lt(P,M){const C=P.colorSpace,V=P.format,te=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||C!==yn&&C!==Fi&&(ft.getTransfer(C)===xt?(V!==Cn||te!==Mn)&&qe("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):je("WebGLTextures: Unsupported texture color space:",C)),M}function et(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=J,this.resetTextureUnits=G,this.getTextureUnits=U,this.setTextureUnits=K,this.setTexture2D=le,this.setTexture2DArray=ee,this.setTexture3D=ce,this.setTextureCube=oe,this.rebindTextures=pe,this.setupRenderTarget=de,this.updateRenderTargetMipmap=me,this.updateMultisampleRenderTarget=Ge,this.setupDepthRenderbuffer=ne,this.setupFrameBufferTexture=ue,this.useMultisampledRTT=Ze,this.isReversedDepthBuffer=function(){return t.buffers.depth.getReversed()}}function jv(s,e){function t(n,i=Fi){let r;const a=ft.getTransfer(i);if(n===Mn)return s.UNSIGNED_BYTE;if(n===cc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===hc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===$u)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Yu)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===qu)return s.BYTE;if(n===Ku)return s.SHORT;if(n===Ar)return s.UNSIGNED_SHORT;if(n===lc)return s.INT;if(n===ti)return s.UNSIGNED_INT;if(n===Rn)return s.FLOAT;if(n===ni)return s.HALF_FLOAT;if(n===Zu)return s.ALPHA;if(n===Ju)return s.RGB;if(n===Cn)return s.RGBA;if(n===Si)return s.DEPTH_COMPONENT;if(n===ji)return s.DEPTH_STENCIL;if(n===uc)return s.RED;if(n===fc)return s.RED_INTEGER;if(n===ss)return s.RG;if(n===dc)return s.RG_INTEGER;if(n===pc)return s.RGBA_INTEGER;if(n===Ca||n===Pa||n===La||n===Ia)if(a===xt)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Ca)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===La)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ia)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Ca)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Pa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===La)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ia)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===gl||n===_l||n===xl||n===vl)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===gl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===_l)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===xl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===vl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Ml||n===yl||n===Sl||n===bl||n===El||n===Oa||n===Tl)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Ml||n===yl)return a===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Sl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===bl)return r.COMPRESSED_R11_EAC;if(n===El)return r.COMPRESSED_SIGNED_R11_EAC;if(n===Oa)return r.COMPRESSED_RG11_EAC;if(n===Tl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===wl||n===Al||n===Rl||n===Cl||n===Pl||n===Ll||n===Il||n===Nl||n===Dl||n===Ul||n===Ol||n===Fl||n===Bl||n===kl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===wl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Al)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Rl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Cl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Pl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ll)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Il)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Nl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Dl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ul)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ol)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Fl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Bl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===kl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===zl||n===Hl||n===Gl)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===zl)return a===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Hl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Gl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Vl||n===Wl||n===Fa||n===Xl)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Vl)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Fa)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Xl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Rr?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}const eM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,tM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class nM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new cf(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new ii({vertexShader:eM,fragmentShader:tM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new _t(new pi(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class iM extends Gi{constructor(e,t){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,h=null,f=null,u=null,d=null,p=null;const v=typeof XRWebGLBinding<"u",g=new nM,m={},S=t.getContextAttributes();let w=null,y=null;const E=[],T=[],R=new ye;let x=null,A=null;const D=new un;D.viewport=new bt;const z=new un;z.viewport=new bt;const N=[D,z],G=new jm;let U=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(ie){let he=E[ie];return he===void 0&&(he=new wo,E[ie]=he),he.getTargetRaySpace()},this.getControllerGrip=function(ie){let he=E[ie];return he===void 0&&(he=new wo,E[ie]=he),he.getGripSpace()},this.getHand=function(ie){let he=E[ie];return he===void 0&&(he=new wo,E[ie]=he),he.getHandSpace()};function J(ie){const he=T.indexOf(ie.inputSource);if(he===-1)return;const fe=E[he];fe!==void 0&&(fe.update(ie.inputSource,ie.frame,c||a),fe.dispatchEvent({type:ie.type,data:ie.inputSource}))}function $(){i.removeEventListener("select",J),i.removeEventListener("selectstart",J),i.removeEventListener("selectend",J),i.removeEventListener("squeeze",J),i.removeEventListener("squeezestart",J),i.removeEventListener("squeezeend",J),i.removeEventListener("end",$),i.removeEventListener("inputsourceschange",le);for(let ie=0;ie<E.length;ie++){const he=T[ie];he!==null&&(T[ie]=null,E[ie].disconnect(he))}U=null,K=null,g.reset();for(const ie in m)delete m[ie];if(e.setRenderTarget(w),d=null,u=null,f=null,i=null,y=null,Je.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(R.width,R.height,!1),A!==null){const ie=A.camera;ie.fov=A.fov,ie.zoom=A.zoom,ie.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(ie){r=ie,n.isPresenting===!0&&qe("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(ie){o=ie,n.isPresenting===!0&&qe("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(ie){c=ie},this.getBaseLayer=function(){return u!==null?u:d},this.getBinding=function(){return f===null&&v&&(f=new XRWebGLBinding(i,t)),f},this.getFrame=function(){return p},this.getSession=function(){return i},this.setSession=async function(ie){if(i=ie,i!==null){if(w=e.getRenderTarget(),i.addEventListener("select",J),i.addEventListener("selectstart",J),i.addEventListener("selectend",J),i.addEventListener("squeeze",J),i.addEventListener("squeezestart",J),i.addEventListener("squeezeend",J),i.addEventListener("end",$),i.addEventListener("inputsourceschange",le),S.xrCompatible!==!0&&await t.makeXRCompatible(),x=e.getPixelRatio(),e.getSize(R),v&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,Ie=null,ue=null;S.depth&&(ue=S.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=S.stencil?ji:Si,Ie=S.stencil?Rr:ti);const Ce={colorFormat:t.RGBA8,depthFormat:ue,scaleFactor:r};f=this.getBinding(),u=f.createProjectionLayer(Ce),i.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),y=new kn(u.textureWidth,u.textureHeight,{format:Cn,type:Mn,depthTexture:new Nr(u.textureWidth,u.textureHeight,Ie,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:S.stencil,colorSpace:e.outputColorSpace,samples:S.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1,storeMultisampledDepthBuffer:u.ignoreDepthValues===!1,storeMultisampledStencilBuffer:u.ignoreDepthValues===!1})}else{const fe={antialias:S.antialias,alpha:!0,depth:S.depth,stencil:S.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,t,fe),i.updateRenderState({baseLayer:d}),e.setPixelRatio(1),e.setSize(d.framebufferWidth,d.framebufferHeight,!1),y=new kn(d.framebufferWidth,d.framebufferHeight,{format:Cn,type:Mn,colorSpace:e.outputColorSpace,stencilBuffer:S.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}y.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Je.setContext(i),Je.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function le(ie){for(let he=0;he<ie.removed.length;he++){const fe=ie.removed[he],Ie=T.indexOf(fe);Ie>=0&&(T[Ie]=null,E[Ie].disconnect(fe))}for(let he=0;he<ie.added.length;he++){const fe=ie.added[he];let Ie=T.indexOf(fe);if(Ie===-1){for(let Ce=0;Ce<E.length;Ce++)if(Ce>=T.length){T.push(fe),Ie=Ce;break}else if(T[Ce]===null){T[Ce]=fe,Ie=Ce;break}if(Ie===-1)break}const ue=E[Ie];ue&&ue.connect(fe)}}const ee=new O,ce=new O;function oe(ie,he,fe){ee.setFromMatrixPosition(he.matrixWorld),ce.setFromMatrixPosition(fe.matrixWorld);const Ie=ee.distanceTo(ce),ue=he.projectionMatrix.elements,Ce=fe.projectionMatrix.elements,He=ue[14]/(ue[10]-1),ne=ue[14]/(ue[10]+1),pe=(ue[9]+1)/ue[5],de=(ue[9]-1)/ue[5],me=(ue[8]-1)/ue[0],_e=(Ce[8]+1)/Ce[0],ke=He*me,Ge=He*_e,Ke=Ie/(-me+_e),Ze=Ke*-me;if(he.matrixWorld.decompose(ie.position,ie.quaternion,ie.scale),ie.translateX(Ze),ie.translateZ(Ke),ie.matrixWorld.compose(ie.position,ie.quaternion,ie.scale),ie.matrixWorldInverse.copy(ie.matrixWorld).invert(),ue[10]===-1)ie.projectionMatrix.copy(he.projectionMatrix),ie.projectionMatrixInverse.copy(he.projectionMatrixInverse);else{const k=He+Ke,lt=ne+Ke,et=ke-Ze,P=Ge+(Ie-Ze),M=pe*ne/lt*k,C=de*ne/lt*k;ie.projectionMatrix.makePerspective(et,P,M,C,k,lt),ie.projectionMatrixInverse.copy(ie.projectionMatrix).invert()}}function Le(ie,he){he===null?ie.matrixWorld.copy(ie.matrix):ie.matrixWorld.multiplyMatrices(he.matrixWorld,ie.matrix),ie.matrixWorldInverse.copy(ie.matrixWorld).invert()}this.updateCamera=function(ie){if(i===null)return;let he=ie.near,fe=ie.far;g.texture!==null&&(g.depthNear>0&&(he=g.depthNear),g.depthFar>0&&(fe=g.depthFar)),G.near=z.near=D.near=he,G.far=z.far=D.far=fe,(U!==G.near||K!==G.far)&&(i.updateRenderState({depthNear:G.near,depthFar:G.far}),U=G.near,K=G.far),G.layers.mask=ie.layers.mask|6,D.layers.mask=G.layers.mask&-5,z.layers.mask=G.layers.mask&-3;const Ie=ie.parent,ue=G.cameras;Le(G,Ie);for(let Ce=0;Ce<ue.length;Ce++)Le(ue[Ce],Ie);ue.length===2?oe(G,D,z):G.projectionMatrix.copy(D.projectionMatrix),A===null&&ie.isPerspectiveCamera&&(A={camera:ie,fov:ie.fov,zoom:ie.zoom}),Ee(ie,G,Ie)};function Ee(ie,he,fe){fe===null?ie.matrix.copy(he.matrixWorld):(ie.matrix.copy(fe.matrixWorld),ie.matrix.invert(),ie.matrix.multiply(he.matrixWorld)),ie.matrix.decompose(ie.position,ie.quaternion,ie.scale),ie.updateMatrixWorld(!0),ie.projectionMatrix.copy(he.projectionMatrix),ie.projectionMatrixInverse.copy(he.projectionMatrixInverse),ie.isPerspectiveCamera&&(ie.fov=Bs*2*Math.atan(1/ie.projectionMatrix.elements[5]),ie.zoom=1)}this.getCamera=function(){return G},this.getFoveation=function(){if(!(u===null&&d===null))return l},this.setFoveation=function(ie){l=ie,u!==null&&(u.fixedFoveation=ie),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=ie)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(G)},this.getCameraTexture=function(ie){return m[ie]};let nt=null;function $e(ie,he){if(h=he.getViewerPose(c||a),p=he,h!==null){const fe=h.views;d!==null&&(e.setRenderTargetFramebuffer(y,d.framebuffer),e.setRenderTarget(y));let Ie=!1;fe.length!==G.cameras.length&&(G.cameras.length=0,Ie=!0);for(let ne=0;ne<fe.length;ne++){const pe=fe[ne];let de=null;if(d!==null)de=d.getViewport(pe);else{const _e=f.getViewSubImage(u,pe);de=_e.viewport,ne===0&&(e.setRenderTargetTextures(y,_e.colorTexture,_e.depthStencilTexture),e.setRenderTarget(y))}let me=N[ne];me===void 0&&(me=new un,me.layers.enable(ne),me.viewport=new bt,N[ne]=me),me.matrix.fromArray(pe.transform.matrix),me.matrix.decompose(me.position,me.quaternion,me.scale),me.projectionMatrix.fromArray(pe.projectionMatrix),me.projectionMatrixInverse.copy(me.projectionMatrix).invert(),me.viewport.set(de.x,de.y,de.width,de.height),ne===0&&(G.matrix.copy(me.matrix),G.matrix.decompose(G.position,G.quaternion,G.scale)),Ie===!0&&G.cameras.push(me)}const ue=i.enabledFeatures;if(ue&&ue.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&v){f=n.getBinding();const ne=f.getDepthInformation(fe[0]);ne&&ne.isValid&&ne.texture&&g.init(ne,i.renderState)}if(ue&&ue.includes("camera-access")&&v){e.state.unbindTexture(),f=n.getBinding();for(let ne=0;ne<fe.length;ne++){const pe=fe[ne].camera;if(pe){let de=m[pe];de||(de=new cf,m[pe]=de);const me=f.getCameraImage(pe);de.sourceTexture=me}}}}for(let fe=0;fe<E.length;fe++){const Ie=T[fe],ue=E[fe];Ie!==null&&ue!==void 0&&ue.update(Ie,he,c||a)}nt&&nt(ie,he),he.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:he}),p=null}const Je=new Ef;Je.setAnimationLoop($e),this.setAnimationLoop=function(ie){nt=ie},this.dispose=function(){}}}const sM=new at,Lf=new st;Lf.set(-1,0,0,0,1,0,0,0,1);function rM(s,e){function t(g,m){g.matrixAutoUpdate===!0&&g.updateMatrix(),m.value.copy(g.matrix)}function n(g,m){m.color.getRGB(g.fogColor.value,xf(s)),m.isFog?(g.fogNear.value=m.near,g.fogFar.value=m.far):m.isFogExp2&&(g.fogDensity.value=m.density)}function i(g,m,S,w,y){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(g,m):m.isMeshLambertMaterial?(r(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(g,m),f(g,m)):m.isMeshPhongMaterial?(r(g,m),h(g,m),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(g,m),u(g,m),m.isMeshPhysicalMaterial&&d(g,m,y)):m.isMeshMatcapMaterial?(r(g,m),p(g,m)):m.isMeshDepthMaterial?r(g,m):m.isMeshDistanceMaterial?(r(g,m),v(g,m)):m.isMeshNormalMaterial?r(g,m):m.isLineBasicMaterial?(a(g,m),m.isLineDashedMaterial&&o(g,m)):m.isPointsMaterial?l(g,m,S,w):m.isSpriteMaterial?c(g,m):m.isShadowMaterial?(g.color.value.copy(m.color),g.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(g,m){g.opacity.value=m.opacity,m.color&&g.diffuse.value.copy(m.color),m.emissive&&g.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.bumpMap&&(g.bumpMap.value=m.bumpMap,t(m.bumpMap,g.bumpMapTransform),g.bumpScale.value=m.bumpScale,m.side===on&&(g.bumpScale.value*=-1)),m.normalMap&&(g.normalMap.value=m.normalMap,t(m.normalMap,g.normalMapTransform),g.normalScale.value.copy(m.normalScale),m.side===on&&g.normalScale.value.negate()),m.displacementMap&&(g.displacementMap.value=m.displacementMap,t(m.displacementMap,g.displacementMapTransform),g.displacementScale.value=m.displacementScale,g.displacementBias.value=m.displacementBias),m.emissiveMap&&(g.emissiveMap.value=m.emissiveMap,t(m.emissiveMap,g.emissiveMapTransform)),m.specularMap&&(g.specularMap.value=m.specularMap,t(m.specularMap,g.specularMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest);const S=e.get(m),w=S.envMap,y=S.envMapRotation;w&&(g.envMap.value=w,g.envMapRotation.value.setFromMatrix4(sM.makeRotationFromEuler(y)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(Lf),g.reflectivity.value=m.reflectivity,g.ior.value=m.ior,g.refractionRatio.value=m.refractionRatio),m.lightMap&&(g.lightMap.value=m.lightMap,g.lightMapIntensity.value=m.lightMapIntensity,t(m.lightMap,g.lightMapTransform)),m.aoMap&&(g.aoMap.value=m.aoMap,g.aoMapIntensity.value=m.aoMapIntensity,t(m.aoMap,g.aoMapTransform))}function a(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform))}function o(g,m){g.dashSize.value=m.dashSize,g.totalSize.value=m.dashSize+m.gapSize,g.scale.value=m.scale}function l(g,m,S,w){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.size.value=m.size*S,g.scale.value=w*.5,m.map&&(g.map.value=m.map,t(m.map,g.uvTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function c(g,m){g.diffuse.value.copy(m.color),g.opacity.value=m.opacity,g.rotation.value=m.rotation,m.map&&(g.map.value=m.map,t(m.map,g.mapTransform)),m.alphaMap&&(g.alphaMap.value=m.alphaMap,t(m.alphaMap,g.alphaMapTransform)),m.alphaTest>0&&(g.alphaTest.value=m.alphaTest)}function h(g,m){g.specular.value.copy(m.specular),g.shininess.value=Math.max(m.shininess,1e-4)}function f(g,m){m.gradientMap&&(g.gradientMap.value=m.gradientMap)}function u(g,m){g.metalness.value=m.metalness,m.metalnessMap&&(g.metalnessMap.value=m.metalnessMap,t(m.metalnessMap,g.metalnessMapTransform)),g.roughness.value=m.roughness,m.roughnessMap&&(g.roughnessMap.value=m.roughnessMap,t(m.roughnessMap,g.roughnessMapTransform)),m.envMap&&(g.envMapIntensity.value=m.envMapIntensity)}function d(g,m,S){g.ior.value=m.ior,m.sheen>0&&(g.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),g.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(g.sheenColorMap.value=m.sheenColorMap,t(m.sheenColorMap,g.sheenColorMapTransform)),m.sheenRoughnessMap&&(g.sheenRoughnessMap.value=m.sheenRoughnessMap,t(m.sheenRoughnessMap,g.sheenRoughnessMapTransform))),m.clearcoat>0&&(g.clearcoat.value=m.clearcoat,g.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(g.clearcoatMap.value=m.clearcoatMap,t(m.clearcoatMap,g.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,t(m.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(g.clearcoatNormalMap.value=m.clearcoatNormalMap,t(m.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===on&&g.clearcoatNormalScale.value.negate())),m.dispersion>0&&(g.dispersion.value=m.dispersion),m.retroreflectivity>0&&(g.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(g.iridescence.value=m.iridescence,g.iridescenceIOR.value=m.iridescenceIOR,g.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(g.iridescenceMap.value=m.iridescenceMap,t(m.iridescenceMap,g.iridescenceMapTransform)),m.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=m.iridescenceThicknessMap,t(m.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),m.transmission>0&&(g.transmission.value=m.transmission,g.transmissionSamplerMap.value=S.texture,g.transmissionSamplerSize.value.set(S.width,S.height),m.transmissionMap&&(g.transmissionMap.value=m.transmissionMap,t(m.transmissionMap,g.transmissionMapTransform)),g.thickness.value=m.thickness,m.thicknessMap&&(g.thicknessMap.value=m.thicknessMap,t(m.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=m.attenuationDistance,g.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(g.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(g.anisotropyMap.value=m.anisotropyMap,t(m.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=m.specularIntensity,g.specularColor.value.copy(m.specularColor),m.specularColorMap&&(g.specularColorMap.value=m.specularColorMap,t(m.specularColorMap,g.specularColorMapTransform)),m.specularIntensityMap&&(g.specularIntensityMap.value=m.specularIntensityMap,t(m.specularIntensityMap,g.specularIntensityMapTransform))}function p(g,m){m.matcap&&(g.matcap.value=m.matcap)}function v(g,m){const S=e.get(m).light;g.referencePosition.value.setFromMatrixPosition(S.matrixWorld),g.nearDistance.value=S.shadow.camera.near,g.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function aM(s,e,t,n){let i={},r={},a=[];const o=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function l(y,E){const T=E.program;n.uniformBlockBinding(y,T)}function c(y,E){let T=i[y.id];T===void 0&&(g(y),T=h(y),i[y.id]=T,y.addEventListener("dispose",S));const R=E.program;n.updateUBOMapping(y,R);const x=e.render.frame;r[y.id]!==x&&(u(y),r[y.id]=x)}function h(y){const E=f();y.__bindingPointIndex=E;const T=s.createBuffer(),R=y.__size,x=y.usage;return s.bindBuffer(s.UNIFORM_BUFFER,T),s.bufferData(s.UNIFORM_BUFFER,R,x),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,E,T),T}function f(){for(let y=0;y<o;y++)if(a.indexOf(y)===-1)return a.push(y),y;return je("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(y){const E=i[y.id],T=y.uniforms,R=y.__cache;s.bindBuffer(s.UNIFORM_BUFFER,E);for(let x=0,A=T.length;x<A;x++){const D=T[x];if(Array.isArray(D))for(let z=0,N=D.length;z<N;z++)d(D[z],x,z,R);else d(D,x,0,R)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function d(y,E,T,R){if(v(y,E,T,R)===!0){const x=y.__offset,A=y.value;if(Array.isArray(A)){let D=0;for(let z=0;z<A.length;z++){const N=A[z],G=m(N);p(N,y.__data,D),typeof N!="number"&&typeof N!="boolean"&&!N.isMatrix3&&!ArrayBuffer.isView(N)&&(D+=G.storage/Float32Array.BYTES_PER_ELEMENT)}}else p(A,y.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,x,y.__data)}}function p(y,E,T){typeof y=="number"||typeof y=="boolean"?E[0]=y:y.isMatrix3?(E[0]=y.elements[0],E[1]=y.elements[1],E[2]=y.elements[2],E[3]=0,E[4]=y.elements[3],E[5]=y.elements[4],E[6]=y.elements[5],E[7]=0,E[8]=y.elements[6],E[9]=y.elements[7],E[10]=y.elements[8],E[11]=0):ArrayBuffer.isView(y)?E.set(new y.constructor(y.buffer,y.byteOffset,E.length)):y.toArray(E,T)}function v(y,E,T,R){const x=y.value,A=E+"_"+T;if(R[A]===void 0)return typeof x=="number"||typeof x=="boolean"?R[A]=x:ArrayBuffer.isView(x)?R[A]=x.slice():R[A]=x.clone(),!0;{const D=R[A];if(typeof x=="number"||typeof x=="boolean"){if(D!==x)return R[A]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(D.equals(x)===!1)return D.copy(x),!0}}return!1}function g(y){const E=y.uniforms;let T=0;const R=16;for(let A=0,D=E.length;A<D;A++){const z=Array.isArray(E[A])?E[A]:[E[A]];for(let N=0,G=z.length;N<G;N++){const U=z[N],K=Array.isArray(U.value)?U.value:[U.value];for(let J=0,$=K.length;J<$;J++){const le=K[J],ee=m(le),ce=T%R,oe=ce%ee.boundary,Le=ce+oe;T+=oe,Le!==0&&R-Le<ee.storage&&(T+=R-Le),U.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),U.__offset=T,T+=ee.storage}}}const x=T%R;return x>0&&(T+=R-x),y.__size=T,y.__cache={},this}function m(y){const E={boundary:0,storage:0};return typeof y=="number"||typeof y=="boolean"?(E.boundary=4,E.storage=4):y.isVector2?(E.boundary=8,E.storage=8):y.isVector3||y.isColor?(E.boundary=16,E.storage=12):y.isVector4?(E.boundary=16,E.storage=16):y.isMatrix3?(E.boundary=48,E.storage=48):y.isMatrix4?(E.boundary=64,E.storage=64):y.isTexture?qe("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(y)?(E.boundary=16,E.storage=y.byteLength):qe("WebGLRenderer: Unsupported uniform value type.",y),E}function S(y){const E=y.target;E.removeEventListener("dispose",S);const T=a.indexOf(E.__bindingPointIndex);a.splice(T,1),s.deleteBuffer(i[E.id]),delete i[E.id],delete r[E.id]}function w(){for(const y in i)s.deleteBuffer(i[y]);a=[],i={},r={}}return{bind:l,update:c,dispose:w}}const oM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Kn=null;function lM(){return Kn===null&&(Kn=new bc(oM,16,16,ss,ni),Kn.name="DFG_LUT",Kn.minFilter=Vt,Kn.magFilter=Vt,Kn.wrapS=Qn,Kn.wrapT=Qn,Kn.generateMipmaps=!1,Kn.needsUpdate=!0),Kn}class cM{constructor(e={}){const{canvas:t=$d(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:u=!1,outputBufferType:d=Mn}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=a;const v=d,g=new Set([pc,dc,fc]),m=new Set([Mn,ti,Ar,Rr,cc,hc]),S=new Uint32Array(4),w=new Int32Array(4),y=new O;let E=null,T=null;const R=[],x=[];let A=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=ei,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let z=!1,N=null,G=null,U=null,K=null;this._outputColorSpace=Rt;let J=0,$=0,le=null,ee=-1,ce=null;const oe=new bt,Le=new bt;let Ee=null;const nt=new Ye(0);let $e=0,Je=t.width,ie=t.height,he=1,fe=null,Ie=null;const ue=new bt(0,0,Je,ie),Ce=new bt(0,0,Je,ie);let He=!1;const ne=new Ec;let pe=!1,de=!1;const me=new at,_e=new O,ke=new bt,Ge={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ke=!1;function Ze(){return le===null?he:1}let k=n;function lt(b,W){return t.getContext(b,W)}let et,P,M,C,V,te,xe,Se,re,ae,Re,De,Te,Pe,Ue,We,Qe,_,L,I,X,Z,Y;try{const b={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${rc}`),t.addEventListener("webglcontextlost",Xe,!1),t.addEventListener("webglcontextrestored",ze,!1),t.addEventListener("webglcontextcreationerror",gt,!1),k===null){const W="webgl2";if(k=lt(W,b),k===null)throw lt(W)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ve()}catch(b){throw t.removeEventListener("webglcontextlost",Xe,!1),t.removeEventListener("webglcontextrestored",ze,!1),t.removeEventListener("webglcontextcreationerror",gt,!1),je("WebGLRenderer: "+b.message),b}function ve(){et=new lx(k),et.init(),X=new jv(k,et),P=new Q_(k,et,e,X),M=new Jv(k,et),P.reversedDepthBuffer&&u&&M.buffers.depth.setReversed(!0),G=k.createFramebuffer(),U=k.createFramebuffer(),K=k.createFramebuffer(),C=new ux(k),V=new Fv,te=new Qv(k,et,M,V,P,X,C),xe=new ox(D),Se=new dg(k),Z=new Z_(k,Se),re=new cx(k,Se,C,Z),ae=new dx(k,re,Se,Z,C),_=new fx(k,P,te),Ue=new j_(V),Re=new Ov(D,xe,et,P,Z,Ue),De=new rM(D,V),Te=new kv,Pe=new Xv(et),Qe=new Y_(D,xe,M,ae,p,l),We=new Zv(D,ae,P),Y=new aM(k,C,P,M),L=new J_(k,et,C),I=new hx(k,et,C),C.programs=Re.programs,D.capabilities=P,D.extensions=et,D.properties=V,D.renderLists=Te,D.shadowMap=We,D.state=M,D.info=C}v!==Mn&&(A=new mx(v,t.width,t.height,o,i,r));const F=new iM(D,k);this.xr=F,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const b=et.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=et.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return he},this.setPixelRatio=function(b){b!==void 0&&(he=b,this.setSize(Je,ie,!1))},this.getSize=function(b){return b.set(Je,ie)},this.setSize=function(b,W,se=!0){if(F.isPresenting){qe("WebGLRenderer: Can't change size while VR device is presenting.");return}Je=b,ie=W,t.width=Math.floor(b*he),t.height=Math.floor(W*he),se===!0&&(t.style.width=b+"px",t.style.height=W+"px"),A!==null&&A.setSize(t.width,t.height),this.setViewport(0,0,b,W)},this.getDrawingBufferSize=function(b){return b.set(Je*he,ie*he).floor()},this.setDrawingBufferSize=function(b,W,se){Je=b,ie=W,he=se,t.width=Math.floor(b*se),t.height=Math.floor(W*se),this.setViewport(0,0,b,W)},this.setEffects=function(b){if(v===Mn){je("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let W=0;W<b.length;W++)if(b[W].isOutputPass===!0){qe("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(oe)},this.getViewport=function(b){return b.copy(ue)},this.setViewport=function(b,W,se,Q){b.isVector4?ue.set(b.x,b.y,b.z,b.w):ue.set(b,W,se,Q),M.viewport(oe.copy(ue).multiplyScalar(he).round())},this.getScissor=function(b){return b.copy(Ce)},this.setScissor=function(b,W,se,Q){b.isVector4?Ce.set(b.x,b.y,b.z,b.w):Ce.set(b,W,se,Q),M.scissor(Le.copy(Ce).multiplyScalar(he).round())},this.getScissorTest=function(){return He},this.setScissorTest=function(b){M.setScissorTest(He=b)},this.setOpaqueSort=function(b){fe=b},this.setTransparentSort=function(b){Ie=b},this.getClearColor=function(b){return b.copy(Qe.getClearColor())},this.setClearColor=function(){Qe.setClearColor(...arguments)},this.getClearAlpha=function(){return Qe.getClearAlpha()},this.setClearAlpha=function(){Qe.setClearAlpha(...arguments)},this.clear=function(b=!0,W=!0,se=!0){let Q=0;if(b){let j=!1;if(le!==null){const Ae=le.texture.format;j=g.has(Ae)}if(j){const Ae=le.texture.type,B=m.has(Ae),H=Qe.getClearColor(),q=Qe.getClearAlpha(),ge=H.r,we=H.g,Fe=H.b;B?(S[0]=ge,S[1]=we,S[2]=Fe,S[3]=q,k.clearBufferuiv(k.COLOR,0,S)):(w[0]=ge,w[1]=we,w[2]=Fe,w[3]=q,k.clearBufferiv(k.COLOR,0,w))}else Q|=k.COLOR_BUFFER_BIT}W&&(Q|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),se&&(Q|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),Q!==0&&k.clear(Q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),N=b},this.dispose=function(){t.removeEventListener("webglcontextlost",Xe,!1),t.removeEventListener("webglcontextrestored",ze,!1),t.removeEventListener("webglcontextcreationerror",gt,!1),Qe.dispose(),Te.dispose(),Pe.dispose(),V.dispose(),xe.dispose(),ae.dispose(),Z.dispose(),Y.dispose(),Re.dispose(),F.dispose(),F.removeEventListener("sessionstart",Ks),F.removeEventListener("sessionend",$s),Ve.stop()};function Xe(b){b.preventDefault(),za("WebGLRenderer: Context Lost."),z=!0}function ze(){za("WebGLRenderer: Context Restored."),z=!1;const b=C.autoReset,W=We.enabled,se=We.autoUpdate,Q=We.needsUpdate,j=We.type;ve(),C.autoReset=b,We.enabled=W,We.autoUpdate=se,We.needsUpdate=Q,We.type=j}function gt(b){je("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Me(b){const W=b.target;W.removeEventListener("dispose",Me),Nt(W)}function Nt(b){rt(b),V.remove(b)}function rt(b){const W=V.get(b).programs;W!==void 0&&(W.forEach(function(se){Re.releaseProgram(se)}),b.isShaderMaterial&&Re.releaseShaderCache(b))}this.renderBufferDirect=function(b,W,se,Q,j,Ae){W===null&&(W=Ge);const B=j.isMesh&&j.matrixWorld.determinantAffine()<0,H=ao(b,W,se,Q,j);M.setMaterial(Q,B);let q=se.index,ge=1;if(Q.wireframe===!0){if(q=re.getWireframeAttribute(se),q===void 0)return;ge=2}const we=se.drawRange,Fe=se.attributes.position;let Oe=we.start*ge,pt=(we.start+we.count)*ge;Ae!==null&&(Oe=Math.max(Oe,Ae.start*ge),pt=Math.min(pt,(Ae.start+Ae.count)*ge)),q!==null?(Oe=Math.max(Oe,0),pt=Math.min(pt,q.count)):Fe!=null&&(Oe=Math.max(Oe,0),pt=Math.min(pt,Fe.count));const Ot=pt-Oe;if(Ot<0||Ot===1/0)return;Z.setup(j,Q,H,se,q);let Ct,Tt=L;if(q!==null&&(Ct=Se.get(q),Tt=I,Tt.setIndex(Ct)),j.isMesh)Q.wireframe===!0?(M.setLineWidth(Q.wireframeLinewidth*Ze()),Tt.setMode(k.LINES)):Tt.setMode(k.TRIANGLES);else if(j.isLine){let jt=Q.linewidth;jt===void 0&&(jt=1),M.setLineWidth(jt*Ze()),j.isLineSegments?Tt.setMode(k.LINES):j.isLineLoop?Tt.setMode(k.LINE_LOOP):Tt.setMode(k.LINE_STRIP)}else j.isPoints?Tt.setMode(k.POINTS):j.isSprite&&Tt.setMode(k.TRIANGLES);if(j.isBatchedMesh)if(et.get("WEBGL_multi_draw"))Tt.renderMultiDraw(j._multiDrawStarts,j._multiDrawCounts,j._multiDrawCount);else{const jt=j._multiDrawStarts,Be=j._multiDrawCounts,ln=j._multiDrawCount,mt=q?Se.get(q).bytesPerElement:1,En=V.get(Q).currentProgram.getUniforms();for(let Xn=0;Xn<ln;Xn++)En.setValue(k,"_gl_DrawID",Xn),Tt.render(jt[Xn]/mt,Be[Xn])}else if(j.isInstancedMesh)Tt.renderInstances(Oe,Ot,j.count);else if(se.isInstancedBufferGeometry){const jt=se._maxInstanceCount!==void 0?se._maxInstanceCount:1/0,Be=Math.min(se.instanceCount,jt);Tt.renderInstances(Oe,Ot,Be)}else Tt.render(Oe,Ot)};function Et(b,W,se,Q){N!==null&&b.isNodeMaterial&&N.setObject(Q,b),pe===!0&&Ue.setState(b,se,!1),b.transparent===!0&&b.side===Jt&&b.forceSinglePass===!1?(b.side=on,b.needsUpdate=!0,os(b,W,Q),b.side=Bi,b.needsUpdate=!0,os(b,W,Q),b.side=Jt):os(b,W,Q)}this.compile=function(b,W,se=null){se===null&&(se=b),N!==null&&N.renderStart(b,W,se),T=Pe.get(se),T.init(W),x.push(T),se.traverseVisible(function(j){j.isLight&&j.layers.test(W.layers)&&(T.pushLight(j),j.castShadow&&T.pushShadow(j))}),b!==se&&b.traverseVisible(function(j){j.isLight&&j.layers.test(W.layers)&&(T.pushLight(j),j.castShadow&&T.pushShadow(j))}),T.setupLights(),N!==null&&N.updateLights(T.state.lightsArray),de=this.localClippingEnabled,pe=Ue.init(this.clippingPlanes,de),pe===!0&&Ue.setGlobalState(this.clippingPlanes,W),N!==null&&We.render(T.state.shadowsArray,se,W);const Q=new Set;return b.traverse(function(j){if(!(j.isMesh||j.isPoints||j.isLine||j.isSprite))return;const Ae=j.material;if(Ae)if(Array.isArray(Ae))for(let B=0;B<Ae.length;B++){const H=Ae[B];Et(H,se,W,j),Q.add(H)}else Et(Ae,se,W,j),Q.add(Ae)}),T=x.pop(),N!==null&&N.renderEnd(),Q},this.compileAsync=function(b,W,se=null){const Q=this.compile(b,W,se);return new Promise(j=>{function Ae(){if(Q.forEach(function(B){const q=V.get(B).currentProgram;(q===void 0||q.isReady())&&Q.delete(B)}),Q.size===0){j(b);return}setTimeout(Ae,10)}et.get("KHR_parallel_shader_compile")!==null?Ae():setTimeout(Ae,10)})};let Wn=null;function Kt(b){Wn&&Wn(b)}function Ks(){Ve.stop()}function $s(){Ve.start()}const Ve=new Ef;Ve.setAnimationLoop(Kt),typeof self<"u"&&Ve.setContext(self),this.setAnimationLoop=function(b){Wn=b,F.setAnimationLoop(b),b===null?Ve.stop():Ve.start()},F.addEventListener("sessionstart",Ks),F.addEventListener("sessionend",$s),this.render=function(b,W){if(W!==void 0&&W.isCamera!==!0){je("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(z===!0)return;N!==null&&N.renderStart(b,W);const se=F.enabled===!0&&F.isPresenting===!0,Q=A!==null&&(le===null||se)&&A.begin(D,le);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),F.enabled===!0&&F.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(F.cameraAutoUpdate===!0&&F.updateCamera(W),W=F.getCamera()),b.isScene===!0&&b.onBeforeRender(D,b,W,le),T=Pe.get(b,x.length),T.init(W),T.state.textureUnits=te.getTextureUnits(),x.push(T),me.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),ne.setFromProjectionMatrix(me,jn,W.reversedDepth),de=this.localClippingEnabled,pe=Ue.init(this.clippingPlanes,de),E=Te.get(b,R.length),E.init(),R.push(E),F.enabled===!0&&F.isPresenting===!0){const B=D.xr.getDepthSensingMesh();B!==null&&Ys(B,W,-1/0,D.sortObjects)}Ys(b,W,0,D.sortObjects),E.finish(),N!==null&&N.updateLights(T.state.lightsArray),D.sortObjects===!0&&E.sort(fe,Ie),Ke=F.enabled===!1||F.isPresenting===!1||F.hasDepthSensing()===!1,Ke&&Qe.addToRenderList(E,b),this.info.render.frame++,this.info.autoReset===!0&&this.info.reset(),pe===!0&&Ue.beginShadows();const j=T.state.shadowsArray;if(We.render(j,b,W),pe===!0&&Ue.endShadows(),(Q&&A.hasRenderPass())===!1){const B=E.opaque,H=E.transmissive;if(T.setupLights(),W.isArrayCamera){const q=W.cameras;if(H.length>0)for(let ge=0,we=q.length;ge<we;ge++){const Fe=q[ge];Gr(B,H,b,Fe)}Ke&&Qe.render(b);for(let ge=0,we=q.length;ge<we;ge++){const Fe=q[ge];Zs(E,b,Fe,Fe.viewport)}}else H.length>0&&Gr(B,H,b,W),Ke&&Qe.render(b),Zs(E,b,W)}le!==null&&$===0&&(te.updateMultisampleRenderTarget(le),te.updateRenderTargetMipmap(le)),Q&&A.end(D),b.isScene===!0&&b.onAfterRender(D,b,W),Z.resetDefaultState(),ee=-1,ce=null,x.pop(),x.length>0?(T=x[x.length-1],te.setTextureUnits(T.state.textureUnits),pe===!0&&Ue.setGlobalState(D.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?E=R[R.length-1]:E=null,N!==null&&N.renderEnd()};function Ys(b,W,se,Q){if(b.visible===!1)return;if(b.layers.test(W.layers)){if(b.isGroup)se=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(W);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||b.intersectsFrustum(ne)){Q&&ke.setFromMatrixPosition(b.matrixWorld).applyMatrix4(me);const B=ae.update(b),H=b.material;H.visible&&E.push(b,B,H,se,ke.z,null,W)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||b.intersectsFrustum(ne))){const B=ae.update(b),H=b.material;if(Q&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ke.copy(b.boundingSphere.center)):(B.boundingSphere===null&&B.computeBoundingSphere(),ke.copy(B.boundingSphere.center)),ke.applyMatrix4(b.matrixWorld).applyMatrix4(me)),Array.isArray(H)){const q=B.groups;for(let ge=0,we=q.length;ge<we;ge++){const Fe=q[ge],Oe=H[Fe.materialIndex];Oe&&Oe.visible&&E.push(b,B,Oe,se,ke.z,Fe,W)}}else H.visible&&E.push(b,B,H,se,ke.z,null,W)}}const Ae=b.children;for(let B=0,H=Ae.length;B<H;B++)Ys(Ae[B],W,se,Q)}function Zs(b,W,se,Q){const{opaque:j,transmissive:Ae,transparent:B}=b;T.setupLightsView(se),pe===!0&&Ue.setGlobalState(D.clippingPlanes,se),Q&&M.viewport(oe.copy(Q)),j.length>0&&Wi(j,W,se),Ae.length>0&&Wi(Ae,W,se),B.length>0&&Wi(B,W,se),M.buffers.depth.setTest(!0),M.buffers.depth.setMask(!0),M.buffers.color.setMask(!0),M.setPolygonOffset(!1)}function Gr(b,W,se,Q){if((se.isScene===!0?se.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[Q.id]===void 0){const Oe=et.has("EXT_color_buffer_half_float")||et.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[Q.id]=new kn(1,1,{generateMipmaps:!0,type:Oe?ni:Mn,minFilter:gi,samples:Math.max(4,P.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:ft.workingColorSpace})}const Ae=T.state.transmissionRenderTarget[Q.id],B=Q.viewport||oe;Ae.setSize(B.z*D.transmissionResolutionScale,B.w*D.transmissionResolutionScale);const H=D.getRenderTarget(),q=D.getActiveCubeFace(),ge=D.getActiveMipmapLevel();D.setRenderTarget(Ae),D.getClearColor(nt),$e=D.getClearAlpha(),$e<1&&D.setClearColor(16777215,.5),D.clear(),Ke&&Qe.render(se);const we=D.toneMapping;D.toneMapping=ei;const Fe=Q.viewport;if(Q.viewport!==void 0&&(Q.viewport=void 0),T.setupLightsView(Q),pe===!0&&Ue.setGlobalState(D.clippingPlanes,Q),Wi(b,se,Q),te.updateMultisampleRenderTarget(Ae),te.updateRenderTargetMipmap(Ae),et.has("WEBGL_multisampled_render_to_texture")===!1){let Oe=!1;for(let pt=0,Ot=W.length;pt<Ot;pt++){const Ct=W[pt],{object:Tt,geometry:jt,material:Be,group:ln}=Ct;if(Be.side===Jt&&Tt.layers.test(Q.layers)){const mt=Be.side;Be.side=on,Be.needsUpdate=!0,Vr(Tt,se,Q,jt,Be,ln),Be.side=mt,Be.needsUpdate=!0,Oe=!0}}Oe===!0&&(te.updateMultisampleRenderTarget(Ae),te.updateRenderTargetMipmap(Ae))}D.setRenderTarget(H,q,ge),D.setClearColor(nt,$e),Fe!==void 0&&(Q.viewport=Fe),D.toneMapping=we}function Wi(b,W,se){const Q=W.isScene===!0?W.overrideMaterial:null;for(let j=0,Ae=b.length;j<Ae;j++){const B=b[j],{object:H,geometry:q,group:ge}=B;let we=B.material;we.allowOverride===!0&&Q!==null&&(we=Q),H.layers.test(se.layers)&&Vr(H,W,se,q,we,ge)}}function Vr(b,W,se,Q,j,Ae){N!==null&&j.isNodeMaterial&&N.setObject(b,j),b.onBeforeRender(D,W,se,Q,j,Ae),b.modelViewMatrix.multiplyMatrices(se.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),j.onBeforeRender(D,W,se,Q,b,Ae),j.transparent===!0&&j.side===Jt&&j.forceSinglePass===!1?(j.side=on,j.needsUpdate=!0,D.renderBufferDirect(se,W,Q,j,b,Ae),j.side=Bi,j.needsUpdate=!0,D.renderBufferDirect(se,W,Q,j,b,Ae),j.side=Jt):D.renderBufferDirect(se,W,Q,j,b,Ae),b.onAfterRender(D,W,se,Q,j,Ae)}function os(b,W,se){W.isScene!==!0&&(W=Ge);const Q=V.get(b),j=T.state.lights,Ae=T.state.shadowsArray,B=j.state.version,H=Re.getParameters(b,j.state,Ae,W,se,T.state.lightProbeGridArray),q=Re.getProgramCacheKey(H);let ge=Q.programs;Q.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?W.environment:null,Q.fog=W.fog;const we=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;Q.envMap=xe.get(b.envMap||Q.environment,we),Q.envMapRotation=Q.environment!==null&&b.envMap===null?W.environmentRotation:b.envMapRotation,ge===void 0&&(b.addEventListener("dispose",Me),ge=new Map,Q.programs=ge);let Fe=ge.get(q);if(Fe!==void 0){if(Q.currentProgram===Fe&&Q.lightsStateVersion===B)return Js(b,H),Fe}else H.uniforms=Re.getUniforms(b),N!==null&&b.isNodeMaterial&&N.build(b,se,H),b.onBeforeCompile(H,D),Fe=Re.acquireProgram(H,q),ge.set(q,Fe),Q.uniforms=H.uniforms;const Oe=Q.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Oe.clippingPlanes=Ue.uniform),Js(b,H),Q.needsLights=lo(b),Q.lightsStateVersion=B,Q.needsLights&&(Oe.ambientLightColor.value=j.state.ambient,Oe.lightProbe.value=j.state.probe,Oe.sunLights.value=j.state.sun,Oe.sunLightShadows.value=j.state.sunShadow,Oe.directionalLights.value=j.state.directional,Oe.directionalLightShadows.value=j.state.directionalShadow,Oe.spotLights.value=j.state.spot,Oe.spotLightShadows.value=j.state.spotShadow,Oe.rectAreaLights.value=j.state.rectArea,Oe.ltc_1.value=j.state.rectAreaLTC1,Oe.ltc_2.value=j.state.rectAreaLTC2,Oe.pointLights.value=j.state.point,Oe.pointLightShadows.value=j.state.pointShadow,Oe.hemisphereLights.value=j.state.hemi,Oe.sunShadowMatrix.value=j.state.sunShadowMatrix,Oe.sunShadowCascade.value=j.state.sunShadowCascade,Oe.directionalShadowMatrix.value=j.state.directionalShadowMatrix,Oe.spotLightMatrix.value=j.state.spotLightMatrix,Oe.spotLightMap.value=j.state.spotLightMap,Oe.pointShadowMatrix.value=j.state.pointShadowMatrix),Q.lightProbeGrid=T.state.lightProbeGridArray.length>0,Q.currentProgram=Fe,Q.uniformsList=null,Fe}function Wr(b){if(b.uniformsList===null){const W=b.currentProgram.getUniforms();b.uniformsList=Da.seqWithValue(W.seq,b.uniforms)}return b.uniformsList}function Js(b,W){const se=V.get(b);se.outputColorSpace=W.outputColorSpace,se.batching=W.batching,se.batchingColor=W.batchingColor,se.instancing=W.instancing,se.instancingColor=W.instancingColor,se.instancingMorph=W.instancingMorph,se.skinning=W.skinning,se.morphTargets=W.morphTargets,se.morphNormals=W.morphNormals,se.morphColors=W.morphColors,se.morphTargetsCount=W.morphTargetsCount,se.numClippingPlanes=W.numClippingPlanes,se.numIntersection=W.numClipIntersection,se.vertexAlphas=W.vertexAlphas,se.vertexTangents=W.vertexTangents,se.toneMapping=W.toneMapping}function Xr(b,W){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;y.setFromMatrixPosition(W.matrixWorld);for(let se=0,Q=b.length;se<Q;se++){const j=b[se];if(j.texture!==null&&j.boundingBox.containsPoint(y))return j}return null}function ao(b,W,se,Q,j){W.isScene!==!0&&(W=Ge),te.resetTextureUnits();const Ae=W.fog,B=Q.isMeshStandardMaterial||Q.isMeshLambertMaterial||Q.isMeshPhongMaterial?W.environment:null,H=le===null?D.outputColorSpace:le.isXRRenderTarget===!0?le.texture.colorSpace:ft.workingColorSpace,q=Q.isMeshStandardMaterial||Q.isMeshLambertMaterial&&!Q.envMap||Q.isMeshPhongMaterial&&!Q.envMap,ge=xe.get(Q.envMap||B,q),we=Q.vertexColors===!0&&!!se.attributes.color&&se.attributes.color.itemSize===4,Fe=!!se.attributes.tangent&&(!!Q.normalMap||Q.anisotropy>0),Oe=!!se.morphAttributes.position,pt=!!se.morphAttributes.normal,Ot=!!se.morphAttributes.color;let Ct=ei;Q.toneMapped&&(le===null||le.isXRRenderTarget===!0)&&(Ct=D.toneMapping);const Tt=se.morphAttributes.position||se.morphAttributes.normal||se.morphAttributes.color,jt=Tt!==void 0?Tt.length:0,Be=V.get(Q),ln=T.state.lights;if(pe===!0&&(de===!0||b!==ce)){const At=b===ce&&Q.id===ee;Ue.setState(Q,b,At)}let mt=!1;Q.version===Be.__version?(Be.needsLights&&Be.lightsStateVersion!==ln.state.version||Be.outputColorSpace!==H||j.isBatchedMesh&&Be.batching===!1||!j.isBatchedMesh&&Be.batching===!0||j.isBatchedMesh&&Be.batchingColor===!0&&j._colorsTexture===null||j.isBatchedMesh&&Be.batchingColor===!1&&j._colorsTexture!==null||j.isInstancedMesh&&Be.instancing===!1||!j.isInstancedMesh&&Be.instancing===!0||j.isSkinnedMesh&&Be.skinning===!1||!j.isSkinnedMesh&&Be.skinning===!0||j.isInstancedMesh&&Be.instancingColor===!0&&j.instanceColor===null||j.isInstancedMesh&&Be.instancingColor===!1&&j.instanceColor!==null||j.isInstancedMesh&&Be.instancingMorph===!0&&j.morphTexture===null||j.isInstancedMesh&&Be.instancingMorph===!1&&j.morphTexture!==null||Be.envMap!==ge||Q.fog===!0&&Be.fog!==Ae||Be.numClippingPlanes!==void 0&&(Be.numClippingPlanes!==Ue.numPlanes||Be.numIntersection!==Ue.numIntersection)||Be.vertexAlphas!==we||Be.vertexTangents!==Fe||Be.morphTargets!==Oe||Be.morphNormals!==pt||Be.morphColors!==Ot||Be.toneMapping!==Ct||Be.morphTargetsCount!==jt||!!Be.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(mt=!0):(mt=!0,Be.__version=Q.version);let En=Be.currentProgram;mt===!0&&(En=os(Q,W,j),N&&Q.isNodeMaterial&&N.onUpdateProgram(Q,En,Be));let Xn=!1,Ei=!1,ls=!1;const St=En.getUniforms(),Dt=Be.uniforms;if(M.useProgram(En.program)&&(Xn=!0,Ei=!0,ls=!0),Q.id!==ee&&(ee=Q.id,Ei=!0),Be.needsLights){const At=Xr(T.state.lightProbeGridArray,j);Be.lightProbeGrid!==At&&(Be.lightProbeGrid=At,Ei=!0)}if(Xn||ce!==b){M.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),St.setValue(k,"projectionMatrix",b.projectionMatrix),St.setValue(k,"viewMatrix",b.matrixWorldInverse);const wi=St.map.cameraPosition;wi!==void 0&&wi.setValue(k,_e.setFromMatrixPosition(b.matrixWorld)),P.logarithmicDepthBuffer&&St.setValue(k,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(Q.isMeshPhongMaterial||Q.isMeshToonMaterial||Q.isMeshLambertMaterial||Q.isMeshBasicMaterial||Q.isMeshStandardMaterial||Q.isShaderMaterial)&&St.setValue(k,"isOrthographic",b.isOrthographicCamera===!0),ce!==b&&(ce=b,Ei=!0,ls=!0)}if(Be.needsLights&&(ln.state.sunShadowMap.length>0&&St.setValue(k,"sunShadowMap",ln.state.sunShadowMap,te),ln.state.directionalShadowMap.length>0&&St.setValue(k,"directionalShadowMap",ln.state.directionalShadowMap,te),ln.state.spotShadowMap.length>0&&St.setValue(k,"spotShadowMap",ln.state.spotShadowMap,te),ln.state.pointShadowMap.length>0&&St.setValue(k,"pointShadowMap",ln.state.pointShadowMap,te)),j.isSkinnedMesh){St.setOptional(k,j,"bindMatrix"),St.setOptional(k,j,"bindMatrixInverse");const At=j.skeleton;At&&(At.boneTexture===null&&At.computeBoneTexture(),St.setValue(k,"boneTexture",At.boneTexture,te))}j.isBatchedMesh&&(St.setOptional(k,j,"batchingTexture"),St.setValue(k,"batchingTexture",j._matricesTexture,te),St.setOptional(k,j,"batchingIdTexture"),St.setValue(k,"batchingIdTexture",j._indirectTexture,te),St.setOptional(k,j,"batchingColorTexture"),j._colorsTexture!==null&&St.setValue(k,"batchingColorTexture",j._colorsTexture,te));const Ti=se.morphAttributes;if((Ti.position!==void 0||Ti.normal!==void 0||Ti.color!==void 0)&&_.update(j,se,En),(Ei||Be.receiveShadow!==j.receiveShadow)&&(Be.receiveShadow=j.receiveShadow,St.setValue(k,"receiveShadow",j.receiveShadow)),(Q.isMeshStandardMaterial||Q.isMeshLambertMaterial||Q.isMeshPhongMaterial)&&Q.envMap===null&&W.environment!==null&&(Dt.envMapIntensity.value=W.environmentIntensity),Dt.dfgLUT!==void 0&&(Dt.dfgLUT.value=lM()),Ei){if(St.setValue(k,"toneMappingExposure",D.toneMappingExposure),Be.needsLights&&oo(Dt,ls),Ae&&Q.fog===!0&&De.refreshFogUniforms(Dt,Ae),De.refreshMaterialUniforms(Dt,Q,he,ie,T.state.transmissionRenderTarget[b.id]),Be.needsLights&&Be.lightProbeGrid){const At=Be.lightProbeGrid;Dt.probesSH.value=At.texture,Dt.probesMin.value.copy(At.boundingBox.min),Dt.probesMax.value.copy(At.boundingBox.max),Dt.probesResolution.value.copy(At.resolution)}Da.upload(k,Wr(Be),Dt,te)}if(Q.isShaderMaterial&&Q.uniformsNeedUpdate===!0&&(Da.upload(k,Wr(Be),Dt,te),Q.uniformsNeedUpdate=!1),Q.isSpriteMaterial&&St.setValue(k,"center",j.center),St.setValue(k,"modelViewMatrix",j.modelViewMatrix),St.setValue(k,"normalMatrix",j.normalMatrix),St.setValue(k,"modelMatrix",j.matrixWorld),Q.uniformsGroups!==void 0){const At=Q.uniformsGroups;for(let wi=0,cs=At.length;wi<cs;wi++){const $c=At[wi];Y.update($c,En),Y.bind($c,En)}}return En}function oo(b,W){b.ambientLightColor.needsUpdate=W,b.lightProbe.needsUpdate=W,b.sunLights.needsUpdate=W,b.sunLightShadows.needsUpdate=W,b.directionalLights.needsUpdate=W,b.directionalLightShadows.needsUpdate=W,b.pointLights.needsUpdate=W,b.pointLightShadows.needsUpdate=W,b.spotLights.needsUpdate=W,b.spotLightShadows.needsUpdate=W,b.rectAreaLights.needsUpdate=W,b.hemisphereLights.needsUpdate=W}function lo(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return J},this.getActiveMipmapLevel=function(){return $},this.getRenderTarget=function(){return le},this.setRenderTargetTextures=function(b,W,se){const Q=V.get(b);Q.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,Q.__autoAllocateDepthBuffer===!1&&(Q.__useRenderToTexture=!1),V.get(b.texture).__webglTexture=W,V.get(b.depthTexture).__webglTexture=Q.__autoAllocateDepthBuffer?void 0:se,Q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,W){const se=V.get(b);se.__webglFramebuffer=W,se.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(b,W=0,se=0){le=b,J=W,$=se;let Q=null,j=!1,Ae=!1;if(b){const H=V.get(b);if(H.__useDefaultFramebuffer!==void 0){M.bindFramebuffer(k.FRAMEBUFFER,H.__webglFramebuffer),oe.copy(b.viewport),Le.copy(b.scissor),Ee=b.scissorTest,M.viewport(oe),M.scissor(Le),M.setScissorTest(Ee),ee=-1;return}else if(H.__webglFramebuffer===void 0)te.setupRenderTarget(b);else if(H.__hasExternalTextures)te.rebindTextures(b,V.get(b.texture).__webglTexture,V.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const we=b.depthTexture;if(H.__boundDepthTexture!==we){if(we!==null&&V.has(we)&&(b.width!==we.image.width||b.height!==we.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");te.setupDepthRenderbuffer(b)}}const q=b.texture;(q.isData3DTexture||q.isDataArrayTexture||q.isCompressedArrayTexture)&&(Ae=!0);const ge=V.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(ge[W])?Q=ge[W][se]:Q=ge[W],j=!0):b.samples>0&&te.useMultisampledRTT(b)===!1?Q=V.get(b).__webglMultisampledFramebuffer:Array.isArray(ge)?Q=ge[se]:Q=ge,oe.copy(b.viewport),Le.copy(b.scissor),Ee=b.scissorTest}else oe.copy(ue).multiplyScalar(he).floor(),Le.copy(Ce).multiplyScalar(he).floor(),Ee=He;if(se!==0&&(Q=G),M.bindFramebuffer(k.FRAMEBUFFER,Q)&&M.drawBuffers(b,Q),M.viewport(oe),M.scissor(Le),M.setScissorTest(Ee),j){const H=V.get(b.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+W,H.__webglTexture,se)}else if(Ae){const H=W;for(let q=0;q<b.textures.length;q++){const ge=V.get(b.textures[q]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+q,ge.__webglTexture,se,H)}}else if(b!==null&&se!==0){const H=V.get(b.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,H.__webglTexture,se)}ee=-1};function Qs(b){const W=V.get(b);return(W.__readFormat!==b.format||W.__readType!==b.type)&&(W.__readFormat=b.format,W.__readType=b.type,W.__formatReadable=P.textureFormatReadable(b.format),W.__typeReadable=P.textureTypeReadable(b.type)),W}this.readRenderTargetPixels=function(b,W,se,Q,j,Ae,B,H=0){if(!(b&&b.isWebGLRenderTarget)){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let q=V.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&B!==void 0&&(q=q[B]),q){M.bindFramebuffer(k.FRAMEBUFFER,q);try{const ge=b.textures[H],we=ge.format,Fe=ge.type;b.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+H);const Oe=Qs(ge);if(Oe.__formatReadable===!1){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Oe.__typeReadable===!1){je("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=b.width-Q&&se>=0&&se<=b.height-j&&k.readPixels(W,se,Q,j,X.convert(we),X.convert(Fe),Ae)}finally{const ge=le!==null?V.get(le).__webglFramebuffer:null;M.bindFramebuffer(k.FRAMEBUFFER,ge)}}},this.readRenderTargetPixelsAsync=async function(b,W,se,Q,j,Ae,B,H=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let q=V.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&B!==void 0&&(q=q[B]),q)if(W>=0&&W<=b.width-Q&&se>=0&&se<=b.height-j){M.bindFramebuffer(k.FRAMEBUFFER,q);const ge=b.textures[H],we=ge.format,Fe=ge.type;b.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+H);const Oe=Qs(ge);if(Oe.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Oe.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const pt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,pt),k.bufferData(k.PIXEL_PACK_BUFFER,Ae.byteLength,k.STREAM_READ),k.readPixels(W,se,Q,j,X.convert(we),X.convert(Fe),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);const Ot=le!==null?V.get(le).__webglFramebuffer:null;M.bindFramebuffer(k.FRAMEBUFFER,Ot);const Ct=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await Yd(k,Ct,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,pt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,Ae),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(pt),k.deleteSync(Ct),Ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,W=null,se=0){const Q=Math.pow(2,-se),j=Math.floor(b.image.width*Q),Ae=Math.floor(b.image.height*Q),B=W!==null?W.x:0,H=W!==null?W.y:0;te.setTexture2D(b,0),k.copyTexSubImage2D(k.TEXTURE_2D,se,0,0,B,H,j,Ae),M.unbindTexture()},this.copyTextureToTexture=function(b,W,se=null,Q=null,j=0,Ae=0){let B,H,q,ge,we,Fe,Oe,pt,Ot;const Ct=b.isCompressedTexture?b.mipmaps[Ae]:b.image;if(se!==null)B=se.max.x-se.min.x,H=se.max.y-se.min.y,q=se.isBox3?se.max.z-se.min.z:1,ge=se.min.x,we=se.min.y,Fe=se.isBox3?se.min.z:0;else{const Dt=Math.pow(2,-j);B=Math.floor(Ct.width*Dt),H=Math.floor(Ct.height*Dt),b.isDataArrayTexture?q=Ct.depth:b.isData3DTexture?q=Math.floor(Ct.depth*Dt):q=1,ge=0,we=0,Fe=0}Q!==null?(Oe=Q.x,pt=Q.y,Ot=Q.z):(Oe=0,pt=0,Ot=0);const Tt=X.convert(W.format),jt=X.convert(W.type);let Be;W.isData3DTexture?(te.setTexture3D(W,0),Be=k.TEXTURE_3D):W.isDataArrayTexture||W.isCompressedArrayTexture?(te.setTexture2DArray(W,0),Be=k.TEXTURE_2D_ARRAY):(te.setTexture2D(W,0),Be=k.TEXTURE_2D),M.activeTexture(k.TEXTURE0),M.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,W.flipY),M.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,W.premultiplyAlpha),M.pixelStorei(k.UNPACK_ALIGNMENT,W.unpackAlignment);const ln=M.getParameter(k.UNPACK_ROW_LENGTH),mt=M.getParameter(k.UNPACK_IMAGE_HEIGHT),En=M.getParameter(k.UNPACK_SKIP_PIXELS),Xn=M.getParameter(k.UNPACK_SKIP_ROWS),Ei=M.getParameter(k.UNPACK_SKIP_IMAGES);M.pixelStorei(k.UNPACK_ROW_LENGTH,Ct.width),M.pixelStorei(k.UNPACK_IMAGE_HEIGHT,Ct.height),M.pixelStorei(k.UNPACK_SKIP_PIXELS,ge),M.pixelStorei(k.UNPACK_SKIP_ROWS,we),M.pixelStorei(k.UNPACK_SKIP_IMAGES,Fe);const ls=b.isDataArrayTexture||b.isData3DTexture,St=W.isDataArrayTexture||W.isData3DTexture;if(b.isDepthTexture){const Dt=V.get(b),Ti=V.get(W),At=V.get(Dt.__renderTarget),wi=V.get(Ti.__renderTarget);M.bindFramebuffer(k.READ_FRAMEBUFFER,At.__webglFramebuffer),M.bindFramebuffer(k.DRAW_FRAMEBUFFER,wi.__webglFramebuffer);for(let cs=0;cs<q;cs++)ls&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,V.get(b).__webglTexture,j,Fe+cs),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,V.get(W).__webglTexture,Ae,Ot+cs)),k.blitFramebuffer(ge,we,B,H,Oe,pt,B,H,k.DEPTH_BUFFER_BIT,k.NEAREST);M.bindFramebuffer(k.READ_FRAMEBUFFER,null),M.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(j!==0||b.isRenderTargetTexture||V.has(b)){const Dt=V.get(b),Ti=V.get(W);M.bindFramebuffer(k.READ_FRAMEBUFFER,U),M.bindFramebuffer(k.DRAW_FRAMEBUFFER,K);for(let At=0;At<q;At++)ls?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Dt.__webglTexture,j,Fe+At):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Dt.__webglTexture,j),St?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ti.__webglTexture,Ae,Ot+At):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,Ti.__webglTexture,Ae),j!==0?k.blitFramebuffer(ge,we,B,H,Oe,pt,B,H,k.COLOR_BUFFER_BIT,k.NEAREST):St?k.copyTexSubImage3D(Be,Ae,Oe,pt,Ot+At,ge,we,B,H):k.copyTexSubImage2D(Be,Ae,Oe,pt,ge,we,B,H);M.bindFramebuffer(k.READ_FRAMEBUFFER,null),M.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else St?b.isDataTexture||b.isData3DTexture?k.texSubImage3D(Be,Ae,Oe,pt,Ot,B,H,q,Tt,jt,Ct.data):W.isCompressedArrayTexture?k.compressedTexSubImage3D(Be,Ae,Oe,pt,Ot,B,H,q,Tt,Ct.data):k.texSubImage3D(Be,Ae,Oe,pt,Ot,B,H,q,Tt,jt,Ct):b.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,Ae,Oe,pt,B,H,Tt,jt,Ct.data):b.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,Ae,Oe,pt,Ct.width,Ct.height,Tt,Ct.data):k.texSubImage2D(k.TEXTURE_2D,Ae,Oe,pt,B,H,Tt,jt,Ct);M.pixelStorei(k.UNPACK_ROW_LENGTH,ln),M.pixelStorei(k.UNPACK_IMAGE_HEIGHT,mt),M.pixelStorei(k.UNPACK_SKIP_PIXELS,En),M.pixelStorei(k.UNPACK_SKIP_ROWS,Xn),M.pixelStorei(k.UNPACK_SKIP_IMAGES,Ei),Ae===0&&W.generateMipmaps&&k.generateMipmap(Be),M.unbindTexture()},this.initRenderTarget=function(b){V.get(b).__webglFramebuffer===void 0&&te.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?te.setTextureCube(b,0):b.isData3DTexture?te.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?te.setTexture2DArray(b,0):te.setTexture2D(b,0),M.unbindTexture()},this.resetState=function(){J=0,$=0,le=null,M.reset(),Z.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=ft._getDrawingBufferColorSpace(e),t.unpackColorSpace=ft._getUnpackColorSpace()}}const Eu={type:"change"},kc={type:"start"},If={type:"end"},ba=new Hs,Tu=new di,hM=Math.cos(70*kt.DEG2RAD),zt=new O,fn=2*Math.PI,yt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},tl=1e-6;class uM extends ug{constructor(e,t=null){super(e,t),this.state=yt.NONE,this.target=new O,this.cursor=new O,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ps.ROTATE,MIDDLE:Ps.DOLLY,RIGHT:Ps.PAN},this.touches={ONE:Rs.ROTATE,TWO:Rs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new O,this._lastQuaternion=new In,this._lastTargetPosition=new O,this._quat=new In().setFromUnitVectors(e.up,new O(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new eu,this._sphericalDelta=new eu,this._scale=1,this._panOffset=new O,this._rotateStart=new ye,this._rotateEnd=new ye,this._rotateDelta=new ye,this._panStart=new ye,this._panEnd=new ye,this._panDelta=new ye,this._dollyStart=new ye,this._dollyEnd=new ye,this._dollyDelta=new ye,this._dollyDirection=new O,this._mouse=new ye,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=dM.bind(this),this._onPointerDown=fM.bind(this),this._onPointerUp=pM.bind(this),this._onContextMenu=yM.bind(this),this._onMouseWheel=_M.bind(this),this._onKeyDown=xM.bind(this),this._onTouchStart=vM.bind(this),this._onTouchMove=MM.bind(this),this._onMouseDown=mM.bind(this),this._onMouseMove=gM.bind(this),this._interceptControlDown=SM.bind(this),this._interceptControlUp=bM.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(e){this._cursorStyle=e,e==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=yt.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents();const e=this.domElement.getRootNode();e.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),e.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Eu),this.update(),this.state=yt.NONE}pan(e,t){this._pan(e,t),this.update()}dollyIn(e){this._dollyIn(e),this.update()}dollyOut(e){this._dollyOut(e),this.update()}rotateLeft(e){this._rotateLeft(e),this.update()}rotateUp(e){this._rotateUp(e),this.update()}update(e=null){const t=this.object.position;zt.copy(t).sub(this.target),zt.applyQuaternion(this._quat),this._spherical.setFromVector3(zt),this.autoRotate&&this.state===yt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=fn:n>Math.PI&&(n-=fn),i<-Math.PI?i+=fn:i>Math.PI&&(i-=fn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(zt.setFromSpherical(this._spherical),zt.applyQuaternion(this._quatInverse),t.copy(this.target).add(zt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=zt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new O(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new O(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=zt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ba.origin.copy(this.object.position),ba.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ba.direction))<hM?this.object.lookAt(this.target):(Tu.setFromNormalAndCoplanarPoint(this.object.up,this.target),ba.intersectPlane(Tu,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>tl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>tl||this._lastTargetPosition.distanceToSquared(this.target)>tl?(this.dispatchEvent(Eu),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?fn/60*this.autoRotateSpeed*e:fn/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){zt.setFromMatrixColumn(t,0),zt.multiplyScalar(-e),this._panOffset.add(zt)}_panUp(e,t){this.screenSpacePanning===!0?zt.setFromMatrixColumn(t,1):(zt.setFromMatrixColumn(t,0),zt.crossVectors(this.object.up,zt)),zt.multiplyScalar(e),this._panOffset.add(zt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;zt.copy(i).sub(this.target);let r=zt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=e-n.left,r=t-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-fn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(fn*this._rotateDelta.x/t.clientHeight),this._rotateUp(fn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new ye,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function fM(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function dM(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function pM(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(If),this.state=yt.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function mM(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ps.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=yt.DOLLY;break;case Ps.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=yt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=yt.ROTATE}break;case Ps.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=yt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=yt.PAN}break;default:this.state=yt.NONE}this.state!==yt.NONE&&this.dispatchEvent(kc)}function gM(s){switch(this.state){case yt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case yt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case yt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function _M(s){this.enabled===!1||this.enableZoom===!1||this.state!==yt.NONE||(s.preventDefault(),this.dispatchEvent(kc),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(If))}function xM(s){this.enabled!==!1&&this._handleKeyDown(s)}function vM(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Rs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=yt.TOUCH_ROTATE;break;case Rs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=yt.TOUCH_PAN;break;default:this.state=yt.NONE}break;case 2:switch(this.touches.TWO){case Rs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=yt.TOUCH_DOLLY_PAN;break;case Rs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=yt.TOUCH_DOLLY_ROTATE;break;default:this.state=yt.NONE}break;default:this.state=yt.NONE}this.state!==yt.NONE&&this.dispatchEvent(kc)}function MM(s){switch(this._trackPointer(s),this.state){case yt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case yt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case yt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case yt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=yt.NONE}}function yM(s){this.enabled!==!1&&s.preventDefault()}function SM(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function bM(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class EM extends sf{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new Vi;e.deleteAttribute("uv");const t=new ki({side:on}),n=new ki,i=new Oc(16777215,900,28,2);i.position.set(.418,16.199,.3),this.add(i);const r=new _t(e,t);r.position.set(-.757,13.219,.717),r.scale.set(31.713,28.305,28.591),this.add(r);const a=new _i(e,n,6),o=new wt;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),a.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),a.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),a.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),a.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),a.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),a.setMatrixAt(5,o.matrix),this.add(a);const l=new _t(e,Ts(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);const c=new _t(e,Ts(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);const h=new _t(e,Ts(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new _t(e,Ts(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const u=new _t(e,Ts(20));u.position.set(3.235,11.486,-12.541),u.scale.set(2.5,2,.1),this.add(u);const d=new _t(e,Ts(100));d.position.set(0,20,0),d.scale.set(1,.1,1),this.add(d)}dispose(){const e=new Set;this.traverse(t=>{t.isMesh&&(e.add(t.geometry),e.add(t.material))});for(const t of e)t.dispose()}}function Ts(s){return new Am({color:0,emissive:16777215,emissiveIntensity:s})}const hr=new O;function wn(s,e,t,n,i,r){const a=2*Math.PI*i/4,o=Math.max(r-2*i,0),l=Math.PI/4;hr.copy(e),hr[n]=0,hr.normalize();const c=.5*a/(a+o),h=1-hr.angleTo(s)/l;return Math.sign(hr[t])===1?h*c:o/(a+o)+c+c*(1-h)}class Xa extends Vi{constructor(e=1,t=1,n=1,i=2,r=.1){const a=i*2+1;if(r=Math.min(e/2,t/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:e,height:t,depth:n,segments:i,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new O,c=new O,h=new O(e,t,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,u=this.attributes.normal.array,d=this.attributes.uv.array,p=f.length/6,v=new O,g=.5/a;for(let m=0,S=0;m<f.length;m+=3,S+=2)switch(l.fromArray(f,m),c.copy(l),c.x-=Math.sign(c.x)*g,c.y-=Math.sign(c.y)*g,c.z-=Math.sign(c.z)*g,c.normalize(),f[m+0]=h.x*Math.sign(l.x)+c.x*r,f[m+1]=h.y*Math.sign(l.y)+c.y*r,f[m+2]=h.z*Math.sign(l.z)+c.z*r,u[m+0]=c.x,u[m+1]=c.y,u[m+2]=c.z,Math.floor(m/p)){case 0:v.set(1,0,0),d[S+0]=wn(v,c,"z","y",r,n),d[S+1]=1-wn(v,c,"y","z",r,t);break;case 1:v.set(-1,0,0),d[S+0]=1-wn(v,c,"z","y",r,n),d[S+1]=1-wn(v,c,"y","z",r,t);break;case 2:v.set(0,1,0),d[S+0]=1-wn(v,c,"x","z",r,e),d[S+1]=wn(v,c,"z","x",r,n);break;case 3:v.set(0,-1,0),d[S+0]=1-wn(v,c,"x","z",r,e),d[S+1]=1-wn(v,c,"z","x",r,n);break;case 4:v.set(0,0,1),d[S+0]=1-wn(v,c,"x","y",r,e),d[S+1]=1-wn(v,c,"y","x",r,t);break;case 5:v.set(0,0,-1),d[S+0]=wn(v,c,"x","y",r,e),d[S+1]=1-wn(v,c,"y","x",r,t);break}}static fromJSON(e){return new Xa(e.width,e.height,e.depth,e.segments,e.radius)}}function TM(s,e=!1){const t=s[0].index!==null,n=new Set(Object.keys(s[0].attributes)),i=new Set(Object.keys(s[0].morphAttributes)),r={},a={},o=s[0].morphTargetsRelative,l=new Pt;let c=0;for(let h=0;h<s.length;++h){const f=s[h];let u=0;if(t!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(const d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),u++}if(u!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(const d in f.morphAttributes){if(!i.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(e){let d;if(t)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+h+". The geometry must have either an index or a position attribute"),null;l.addGroup(c,d,h),c+=d}}if(t){let h=0;const f=[];for(let u=0;u<s.length;++u){const d=s[u].index;for(let p=0;p<d.count;++p)f.push(d.getX(p)+h);h+=s[u].attributes.position.count}l.setIndex(f)}for(const h in r){const f=wu(r[h]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" attribute."),null;l.setAttribute(h,f)}for(const h in a){const f=a[h][0].length;if(f!==0){l.morphAttributes=l.morphAttributes||{},l.morphAttributes[h]=[];for(let u=0;u<f;++u){const d=[];for(let v=0;v<a[h].length;++v)d.push(a[h][v][u]);const p=wu(d);if(!p)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+h+" morphAttribute."),null;l.morphAttributes[h].push(p)}}}return l}function wu(s){let e,t,n,i=-1,r=0;for(let c=0;c<s.length;++c){const h=s[c];if(e===void 0&&(e=h.array.constructor),e!==h.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(t===void 0&&(t=h.itemSize),t!==h.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=h.normalized),n!==h.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(i===-1&&(i=h.gpuType),i!==h.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=h.count*t}const a=new e(r),o=new Qt(a,t,n);let l=0;for(let c=0;c<s.length;++c){const h=s[c];if(h.isInterleavedBufferAttribute){const f=l/t;for(let u=0,d=h.count;u<d;u++)for(let p=0;p<t;p++){const v=h.getComponent(u,p);o.setComponent(u+f,p,v)}}else a.set(h.array,l);l+=h.count*t}return i!==void 0&&(o.gpuType=i),o}function Au(s,e){if(e===Ud)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===ql||e===Qu){let t=s.getIndex();if(t===null){const r=[],a=s.getAttribute("position");if(a!==void 0){for(let o=0;o<a.count;o++)r.push(o);s.setIndex(r),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}const n=t.count-2,i=[];if(e===ql)for(let r=1;r<=n;r++)i.push(t.getX(0)),i.push(t.getX(r)),i.push(t.getX(r+1));else for(let r=0;r<n;r++)r%2===0?(i.push(t.getX(r)),i.push(t.getX(r+1)),i.push(t.getX(r+2))):(i.push(t.getX(r+2)),i.push(t.getX(r+1)),i.push(t.getX(r)));return i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."),s.setIndex(i),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}function wM(){const s=new an;s.name="Sonnenhain Arena";const e=[],t=[],n=[],i=new Map,r=[];let a=73291;const o=()=>(a=Math.imul(a,1664525)+1013904223>>>0)/4294967296,l=(_,L={})=>new ki({color:_,roughness:.86,...L}),c=l("#b7b097"),h=l("#dbd4b7"),f=l("#929a87"),u=l("#6a8345"),d=l("#dca94b",{metalness:.35,roughness:.4}),p=l("#77614a"),v=[l("#779b3e"),l("#96b64a"),l("#4d7e42"),l("#abc55b")],g=l("#487c9d"),m=l("#d5d5ba"),S=new Xa(1,1,1,2,.07),w=new Vi(1,1,1),y=new Ns(1,1),E=new Ds(1,12,9),T=new wt;function R(_,L,I,X,Z,Y=1,ve=1,F=1,Xe=0,ze=0,gt=0){T.position.set(I,X,Z),T.scale.set(Y,ve,F),T.rotation.set(Xe,ze,gt),T.updateMatrix();const Me=(_.index?_.toNonIndexed():_.clone()).applyMatrix4(T.matrix);i.has(L)||i.set(L,[]),i.get(L).push(Me)}function x(_,L,I,X,Z,Y,ve,F=0){R(S,_,L,I,X,Z,Y,ve,0,F)}function A(){const _=document.createElement("canvas");_.width=_.height=256;const L=_.getContext("2d");L.fillStyle="#d9d5c7",L.fillRect(0,0,256,256);for(let X=0;X<4200;X++){const Z=o()>.5?255:65;L.fillStyle=`rgba(${Z},${Z},${Z},${o()*.065})`;const Y=1+o()*7;L.fillRect(o()*256,o()*256,Y,Y)}for(let X=0;X<6;X++){L.strokeStyle="rgba(75,70,51,.11)",L.lineWidth=.45+o()*.6,L.beginPath();let Z=o()*256,Y=o()*256;L.moveTo(Z,Y);for(let ve=0;ve<5;ve++)Z+=(o()-.4)*18,Y+=o()*14,L.lineTo(Z,Y);L.stroke()}const I=new Zi(_);return I.colorSpace=Rt,I.wrapS=I.wrapT=Jn,I.anisotropy=8,I}const D=A();c.map=D,h.map=D,f.map=D;const z=document.createElement("canvas");z.width=z.height=512;const N=z.getContext("2d");N.fillStyle="#aba894",N.fillRect(0,0,512,512);for(let _=0;_<16;_++)for(let L=-1;L<9;L++){const I=170+Math.floor(o()*35);N.fillStyle=`rgb(${I+12},${I+10},${I})`,N.fillRect(L*64+_%2*32+1,_*32+1,62,30);for(let X=0;X<9;X++)N.fillStyle="rgba(65,66,49,.05)",N.fillRect(L*64+_%2*32+o()*60,_*32+o()*30,5+o()*10,1)}const G=new Zi(z);G.colorSpace=Rt,G.wrapS=G.wrapT=Jn,G.anisotropy=8,m.map=G;const U=document.createElement("canvas");U.width=U.height=512;const K=U.getContext("2d");K.fillStyle="#8f9d6b",K.fillRect(0,0,512,512);for(let _=0;_<14e3;_++)K.fillStyle=["#81935c","#a0aa77","#667d4d","#b0b784"][_%4],K.globalAlpha=.13+o()*.18,K.fillRect(o()*512,o()*512,o()*9+1,o()*9+1);K.globalAlpha=1;const J=new Zi(U);J.colorSpace=Rt,J.wrapS=J.wrapT=Jn,J.repeat.set(18,18),J.anisotropy=8;const $=document.createElement("canvas");$.width=$.height=256;const le=$.getContext("2d");for(let _=0;_<230;_++){const L=o()*Math.PI*2,I=Math.sqrt(o())*105,X=128+Math.cos(L)*I,Z=128+Math.sin(L)*I;le.fillStyle=["#496e38","#6c8b40","#839e4b","#a3b960","#b8c878"][_%5],le.beginPath(),le.ellipse(X,Z,4+o()*9,2+o()*4,o()*Math.PI,0,Math.PI*2),le.fill()}const ee=new Zi($);ee.colorSpace=Rt,ee.anisotropy=8;const ce=l("#ffffff",{map:ee,alphaTest:.5,side:Jt}),oe=new pi(1,1),Le=new Xa(.994,.16,.994,2,.023);for(let _=0;_<8;_++)for(let L=0;L<8;L++){const I=(L+_)%2===0,X=l(I?"#849b76":"#e8dfbc",{map:D});X.color.multiplyScalar(.97+o()*.06);const Z=new _t(Le,X);Z.position.set(L-3.5,-.08,3.5-_),Z.receiveShadow=!0,Z.userData.square=String.fromCharCode(97+L)+(_+1),Z.userData.baseColor=X.color.clone(),Z.name=Z.userData.square,s.add(Z),e.push(Z)}x(f,0,-.43,0,8.95,.58,8.95),x(c,0,-.21,0,8.9,.19,8.9);for(let _=0;_<11;_++){const L=(_-5)*.815;for(const I of[-1,1])x(h,L,-.12,I*4.25,.79,.23,.46,(o()-.5)*.018),x(h,I*4.25,-.12,L,.46,.23,.79,(o()-.5)*.018),x(_%3===0?f:c,L,-.43,I*4.47,.79,.35,.15)}for(const _ of[-4.24,4.24])for(const L of[-4.24,4.24])x(d,_,.012,L,.3,.016,.045,Math.PI/4),x(d,_,.013,L,.3,.016,.045,-Math.PI/4);const Ee=document.createElement("canvas");Ee.width=1024,Ee.height=128;const nt=Ee.getContext("2d");nt.font="600 54px Georgia",nt.textAlign="center",nt.textBaseline="middle",nt.fillStyle="#696d51";for(let _=0;_<8;_++)nt.fillText("abcdefgh"[_],64+_*128,64);const $e=new Zi(Ee);$e.colorSpace=Rt;const Je=new _t(new pi(8,.3),new Pn({map:$e,transparent:!0,depthWrite:!1}));Je.rotation.x=-Math.PI/2,Je.position.set(0,.009,4.26),s.add(Je);const ie=(_,L,I)=>{const X=kt.clamp((I-_)/(L-_),0,1);return X*X*(3-2*X)};function he(_,L){const I=1-ie(16.8,20.5,Math.max(Math.abs(_),Math.abs(L)));let X=-11+I*9.4;const Z=1-ie(.7,1,Math.hypot(_/13,(L+32)/10)),Y=1-ie(.64,1,Math.hypot((_+23)/10,(L+34)/11)),ve=1-ie(.7,1,Math.hypot((_-23)/13,(L+39)/15));X=Math.max(X,-11+Z*10.35,-11+Y*18,-11+ve*15);const F=ie(44,66,-L)*(10+5*Math.sin(_*.11)+3*Math.sin(_*.24+1));return X=Math.max(X,-10+F),I<.95&&Z<.95&&Y<.95&&ve<.95&&(X+=Math.sin(_*.9+L*.4)*.35+Math.sin(L*1.1)*.18),L>11&&L<19&&Math.abs(_)<7&&(X-=ie(11,16,L)*1.8*(1-ie(5,7,Math.abs(_)))),X}const fe=new pi(160,160,200,200);fe.rotateX(-Math.PI/2);const Ie=fe.attributes.position,ue=[];for(let _=0;_<Ie.count;_++){const L=Ie.getX(_),I=Ie.getZ(_),X=he(L,I);Ie.setY(_,X);const Z=Math.abs(he(L+.5,I)-X)+Math.abs(he(L,I+.5)-X),Y=new Ye(Z>.7?"#aba899":X<-5?"#79948b":"#869968");Y.multiplyScalar(.96+Math.sin(L*2.1+I)*.035),ue.push(Y.r,Y.g,Y.b)}fe.setAttribute("color",new dt(ue,3)),fe.computeVertexNormals();const Ce=new _t(fe,l("#ffffff",{map:J,vertexColors:!0}));Ce.receiveShadow=!0,s.add(Ce);for(let _=0;_<8;_++)x(_%2?h:c,0,-1.62-_*.19,11.3+_*.58,8.5+_*.34,.22,.65);x(f,0,-1.43,0,23,.3,22),x(c,0,-1.2,0,19,.22,18),x(h,0,-.98,0,15,.22,14),x(c,0,-.76,0,11.1,.21,10.8);for(let _=-9;_<=9;_++)for(let L=-8;L<=8;L++){if(Math.abs(_)<5.8&&Math.abs(L)<5.8)continue;const I=Math.abs(_)<7&&Math.abs(L)<7?-.855:-1.08;o()<.055||x((_+L)%5===0?f:c,_,I,L,.982,.07,.982,(o()-.5)*.012)}for(const _ of[-1,1])for(let L=0;L<14;L++)x(h,_*10.8,-1,(L-6.5)*1.35,.42,.43,1.3),x(h,(L-6.5)*1.35,-1,_*10.2,1.3,.43,.42);for(const _ of[-1,1])for(const L of[-6.8,6.8])x(f,_*7,-.91,L,3.6,.28,1.25),x(u,_*7,-.72,L,3.38,.12,1.05);for(let _=0;_<62;_++){const L=o()*Math.PI*2,I=10.8+o()*4;x(_%4===0?f:c,Math.cos(L)*I,-1.47,Math.sin(L)*I,.35+o()*.65,.12+o()*.15,.3+o()*.65,o()*3)}function He(_,L,I,X=!1){x(f,_,-1.15,L,1.7,.55,1.7),x(h,_,-.77,L,1.48,.22,1.48),x(c,_,-.57,L,1.24,.19,1.24);const Z=new dn(.42,.53,.62,16),Y=Math.ceil(I/.63);for(let F=0;F<Y;F++)R(Z,F%3===0?f:c,_,-.18+F*.63,L,1,1,1,0,Math.PI/16*(F%2));for(let F=0;F<12;F++){const Xe=F*Math.PI/6;R(new dn(.035,.045,I-.25,6),h,_+Math.cos(Xe)*.47,I/2-.58,L+Math.sin(Xe)*.47)}const ve=-.18+(Y-1)*.63+.39;X||(x(h,_,ve,L,1.2,.21,1.2),x(c,_,ve+.21,L,1.5,.2,1.5));for(let F=0;F<55;F++){const Xe=-.4+o()*I*.8,ze=o()*Math.PI*2;R(E,v[F%4],_+Math.cos(ze)*.53,Xe,L+Math.sin(ze)*.53,.07,.025,.06,o()*2,o()*3,o()*2)}}He(-8.1,-8.6,7),He(8.1,-8.6,6.6),He(-10.5,-2,4.2,!0),He(10.5,-2,3.6,!0),He(-7.8,8.7,1.8,!0),He(7.8,8.7,1.1,!0),He(-4.8,-11.4,5.1,!0),He(3.8,-11.4,3.5,!0),x(c,-5.35,6.6,-8.6,6.9,.65,1.25),x(h,-5.35,6.97,-8.6,7.1,.13,1.38),x(c,7.3,6.1,-8.6,2.8,.64,1.25);for(let _=0;_<28;_++)x(h,-8.65+_*.25,6.15,-7.94,.12,.18,.1);for(let _=0;_<12;_++)x(c,(_-5.5)*1.05,-.83,-11.4,1.02,.67,.72),(_<3||_>8)&&x(h,(_-5.5)*1.05,-.28,-11.4,1.02,.4,.72);function ne(_,L,I){R(new dn(.035,.035,2.85,8),d,_,.725,L),R(new Ds(.1,8,6),d,_,2.21,L),R(new dn(.025,.025,1.05,8),d,_+.44,1.9,L,1,1,1,0,0,Math.PI/2);const X=document.createElement("canvas");X.width=256,X.height=384;const Z=X.getContext("2d");Z.fillStyle=I,Z.beginPath(),Z.moveTo(0,0),Z.lineTo(256,0),Z.lineTo(256,330),Z.lineTo(128,384),Z.lineTo(0,330),Z.fill(),Z.strokeStyle="#ffe4a0",Z.lineWidth=9,Z.beginPath(),Z.moveTo(15,0),Z.lineTo(15,320),Z.lineTo(128,367),Z.lineTo(241,320),Z.lineTo(241,0),Z.stroke(),Z.save(),Z.translate(128,155),Z.fillStyle="#ffe4a0",Z.beginPath();for(let Xe=0;Xe<16;Xe++){const ze=Xe*Math.PI/8-Math.PI/2,gt=Xe%2?37:72;Z.lineTo(Math.cos(ze)*gt,Math.sin(ze)*gt)}Z.closePath(),Z.fill(),Z.fillStyle=I,Z.beginPath(),Z.arc(0,0,21,0,7),Z.fill(),Z.restore();const Y=new Zi(X);Y.colorSpace=Rt;const ve=new pi(.91,1.45,10,16),F=new _t(ve,l("#ffffff",{map:Y,transparent:!0,side:Jt,alphaTest:.3}));F.position.set(_+.45,1.16,L),F.castShadow=!0,s.add(F),t.push({mesh:F,original:ve.attributes.position.array.slice(),phase:o()*6})}ne(-5.6,-3.7,"#c86536"),ne(5,-3.7,"#426c9c");function pe(_,L,I){const X=(Z,Y,ve,F,Xe,ze,gt)=>{const Me=new O(Z,Y,ve),Nt=new O(F,Xe,ze),rt=Nt.clone().sub(Me),Et=new dn(gt*.65,gt,rt.length(),7);Et.translate(0,rt.length()/2,0),Et.applyQuaternion(new In().setFromUnitVectors(new O(0,1,0),rt.normalize())),Et.translate(Z,Y,ve),R(Et,p,_,he(_,L),L,I,I,I),Et.dispose()};X(0,0,0,.1,3.1,0,.16);for(let Z=0;Z<8;Z++){const Y=Z*2.4,ve=.6+o()*.65,F=Math.cos(Y)*ve,Xe=Math.sin(Y)*ve,ze=2.6+o()*.9;X(0,1.8,0,F,ze,Xe,.07);for(let gt=0;gt<15;gt++){const Me=gt*2.4,Nt=o()*.65,rt=_+(F+Math.cos(Me)*Nt)*I,Et=he(_,L)+(ze+o()*.5)*I,Wn=L+(Xe+Math.sin(Me)*Nt)*I;for(let Kt=0;Kt<3;Kt++)R(oe,ce,rt,Et,Wn,.9*I,.8*I,1,Kt*Math.PI/3,o()*6,o())}}}[[-13,-5,1.7],[13,-9,1.8],[-14,-16,2],[16,-17,2],[-16,5,1.4],[16,6,1.3],[-21,-25,2.6],[22,-26,2.4],[-9,-18,1.5]].forEach(_=>pe(..._));for(const _ of[-1,1])for(const L of[-6.8,6.8])for(let I=0;I<65;I++){const X=_*7+(o()-.5)*3.25,Z=L+(o()-.5)*.95;for(let Y=0;Y<2;Y++)R(oe,ce,X,-.52+o()*.22,Z,.48+o()*.22,.4+o()*.25,1,-.4+Y*1.5,o()*6,o())}for(let _=0;_<180;_++){const L=_%2?-1:1,I=L*(11.3+o()*.8),X=(o()-.5)*22;R(oe,ce,I,-1.25,X,.65,.65,1,-.5,o()*6,o())}const de=[l("#9fa798",{map:D,flatShading:!0}),l("#89988b",{map:D,flatShading:!0}),l("#b1b0a0",{map:D,flatShading:!0})];for(const[_,L,I,X,Z]of[[-23,-34,7.7,8.7,6.8],[0,-32,10.5,7.7,-.65],[23,-39,10,12,3.8]])for(let Y=0;Y<28;Y++){const ve=Y*Math.PI/14,F=_+Math.cos(ve)*I,Xe=L+Math.sin(ve)*X;if(Xe<L-2)continue;const ze=Z+(o()-.5)*1.05,gt=ze+10,Me=new dn(.85+o()*.3,1.1,gt,6,6),Nt=Me.attributes.position;for(let rt=0;rt<Nt.count;rt++){const Et=Nt.getY(rt),Wn=1+.19*Math.sin(Et*1.9+Y*2)+.12*Math.sin(Et*4+Y);Nt.setX(rt,Nt.getX(rt)*Wn),Nt.setZ(rt,Nt.getZ(rt)*Wn),Nt.setY(rt,Et+Math.sin(Nt.getX(rt)*4+Y)*.2)}Me.computeVertexNormals(),R(Me,de[Y%3],F,ze-gt/2,Xe,1.1,1,.9,0,ve),Me.dispose();for(let rt=0;rt<4;rt++){const Et=ze-rt*2.8-.4;R(y,de[(Y+1)%3],F,Et,Xe+.35,.9,.2,.75,0,ve)}for(let rt=0;rt<4;rt++)R(oe,ce,F+(o()-.5),ze+.17,Xe+(o()-.5),1.3,1,1,-.9+o(),o()*6)}function me(_,L,I,X=.75){R(new dn(X,X*1.1,I,20),m,_,I/2-.65,L),R(new dn(X*1.13,X*1.13,.32,20),h,_,I-.55,L),R(new Rc(X*1.35,1.8,20),g,_,I+.42,L);for(let Z=0;Z<4;Z++)for(let Y=0;Y<8;Y++){const ve=Y*Math.PI/4,F=_+Math.sin(ve)*(X+.02),Xe=L+Math.cos(ve)*(X+.02),ze=I*.2+Z*I*.17;x(f,F,ze,Xe,.16,.4,.045,ve),x(h,F,ze-.23,Xe,.25,.07,.08,ve)}for(let Z=0;Z<10;Z++){const Y=Z*Math.PI/5;x(h,_+Math.sin(Y)*X,I-.25,L+Math.cos(Y)*X,.19,.34,.19)}R(new dn(.026,.026,.5,6),d,_,I+1.55,L)}x(m,0,1.9,-28,7,5.2,3.1),x(g,0,4.6,-28,7.3,.3,3.3);for(let _=0;_<11;_++)for(let L=0;L<4;L++){const I=(_-5)*.59,X=.3+L*1.04;x(f,I,X,-26.425,.22,.49,.06),x(h,I,X-.27,-26.36,.33,.09,.12),x(h,I-.16,X,-26.36,.05,.6,.1),x(h,I+.16,X,-26.36,.05,.6,.1)}for(let _=0;_<6;_++)x(h,(_-2.5)*1.3,1.85,-26.2,.17,5.1,.48);for(let _=0;_<3;_++)x(h,0,.4+_*1.7,-26.31,7.2,.12,.22);me(-5.8,-29,4.8,.6),me(6.4,-29,5.8,.6),me(-.7,-31,10,.5),me(-3.5,-26.8,5.5),me(3.5,-26.8,6),me(-2,-29.5,7.6,.65),me(1,-29.3,9,1),me(4.6,-30.2,7,.65);for(let _=0;_<9;_++)x(h,(_-4)*.76,4.99,-26.45,.45,.57,.45);const _e=new Is;_e.moveTo(-1.65,0),_e.lineTo(-1.65,3),_e.lineTo(1.65,3),_e.lineTo(1.65,0),_e.lineTo(1.3,0),_e.lineTo(1.3,1.1),_e.absarc(0,1.1,1.3,0,Math.PI,!1),_e.lineTo(-1.3,0),_e.closePath();const ke=new Lc(_e,{depth:.85,bevelEnabled:!1,curveSegments:16});for(let _=0;_<5;_++)R(ke,m,-13+_*3.25,-.65,-23),x(h,-13+_*3.25,2.46,-22.58,3.25,.23,1.1);for(let _=0;_<6;_++)x(m,-14.55+_*3.25,-5.35,-22.58,.53,9.4,.86);const Ge=l("#5fb7c4",{roughness:.22,metalness:.15,transparent:!0,opacity:.92}),Ke=new Is,Ze=[];Ke.moveTo(-10.3,-18);for(let _=0;_<=50;_++){const L=-18-_*1.1,I=-8+Math.sin(_*.13)*5;Ze.push([I,L]),Ke.lineTo(I-2.3,L)}for(let _=50;_>=0;_--)Ke.lineTo(Ze[_][0]+2.3,Ze[_][1]);Ke.closePath();const k=new Fr(Ke,12);k.rotateX(Math.PI/2);const lt=new _t(k,Ge);lt.position.y=-9.6,lt.material.side=Jt,s.add(lt);const et=document.createElement("canvas");et.width=128,et.height=256;const P=et.getContext("2d");P.fillStyle="#77c7da",P.fillRect(0,0,128,256);for(let _=0;_<160;_++)P.fillStyle=`rgba(237,254,255,${.12+o()*.4})`,P.fillRect(o()*128,o()*256,1+o()*4,12+o()*70);const M=new Zi(et);M.colorSpace=Rt,M.wrapT=Jn,r.push(M);const C=l("#e3fbff",{map:M,transparent:!0,opacity:.82,side:Jt,emissive:"#367c8e",emissiveIntensity:.15});for(const[_,L,I,X,Z]of[[-20,-25.2,6.6,-8.8,1.1],[-22,-25.7,6.7,-9.1,.48]]){const Y=new _t(new pi(Z,I-X,3,10),C);Y.position.set(_,(I+X)/2,L),s.add(Y);for(let ve=0;ve<7;ve++)R(E,l("#d4eff0",{transparent:!0,opacity:.22,depthWrite:!1}),_+(o()-.5)*1.4,X+.2+o()*.35,L+o()*.7,.5,.18,.3)}pe(-23,-33,1.5),pe(-25,-35,1.25),pe(19,-37,1.5);const V=new Is;V.moveTo(-.027,0),V.quadraticCurveTo(-.02,.17,.035,.32),V.quadraticCurveTo(.06,.12,.027,0),V.closePath();const te=new Fr(V,3),xe=[];for(let _=0;_<18e3;_++){const L=(o()-.5)*45,I=(o()-.5)*41;Math.abs(L)<11.5&&Math.abs(I)<10.7||xe.push([L,I,.28+o()*.45,o()*Math.PI*2])}for(let _=0;_<3;_++){const L=xe.filter((Z,Y)=>Y%3===_),I=l(["#739546","#91ad50","#a7ba61"][_],{side:Jt}),X=new _i(te,I,L.length);L.forEach(([Z,Y,ve,F],Xe)=>{T.position.set(Z,he(Z,Y)+.02,Y),T.rotation.set(0,F,0),T.scale.set(ve,ve,ve),T.updateMatrix(),X.setMatrixAt(Xe,T.matrix)}),X.receiveShadow=!0,s.add(X)}const Se=new Ds(1,5,4),re=l("#fff4d3"),ae=[],Re=[];for(let _=0;_<440;_++){const L=o()*Math.PI*2,I=11.7+o()*6.5,X=Math.cos(L)*I,Z=Math.sin(L)*I,Y=he(X,Z)+.19+o()*.08;for(let ve=0;ve<5;ve++){const F=ve*Math.PI*.4;ae.push([X+Math.cos(F)*.045,Y,Z+Math.sin(F)*.045])}Re.push([X,Y+.013,Z]),R(new dn(.007,.008,.24,4),u,X,Y-.12,Z)}const De=new _i(Se,re,ae.length);ae.forEach(([_,L,I],X)=>{T.position.set(_,L,I),T.rotation.set(0,X,0),T.scale.set(.045,.019,.03),T.updateMatrix(),De.setMatrixAt(X,T.matrix)}),s.add(De);const Te=new _i(Se,d,Re.length);Re.forEach(([_,L,I],X)=>{T.position.set(_,L,I),T.rotation.set(0,0,0),T.scale.setScalar(.021),T.updateMatrix(),Te.setMatrixAt(X,T.matrix)}),s.add(Te);const Pe=l("#fff9e8",{roughness:1});for(let _=0;_<8;_++){const L=new an;L.position.set((_-4)*11,12+o()*6,-30-o()*18);for(let I=0;I<6;I++){const X=new _t(E,Pe);X.position.set(I*1,Math.sin(I*1.4)*.3,o()),X.scale.set(1.5,.65+o()*.6,.8),L.add(X)}s.add(L),n.push({mesh:L,x:L.position.x,phase:o()*6})}for(const[_,L]of i){const I=TM(L,!1);if(I){const X=new _t(I,_);X.castShadow=!0,X.receiveShadow=!0,s.add(X)}L.forEach(X=>X.dispose())}S.dispose(),w.dispose(),y.dispose();const Ue=new Pt,We=new Float32Array(105);for(let _=0;_<35;_++)We[_*3]=(o()-.5)*18,We[_*3+1]=.5+o()*5,We[_*3+2]=(o()-.5)*18;Ue.setAttribute("position",new Qt(We,3));const Qe=new of(Ue,new wc({color:"#fff3ae",size:.045,transparent:!0,opacity:.65,depthWrite:!1}));return s.add(Qe),{group:s,tiles:e,setBoardOrientation(_){nt.clearRect(0,0,1024,128);for(let L=0;L<8;L++)nt.fillText((_?"hgfedcba":"abcdefgh")[L],64+L*128,64);$e.needsUpdate=!0},update(_){t.forEach(({mesh:L,original:I,phase:X})=>{const Z=L.geometry.attributes.position;for(let Y=0;Y<Z.count;Y++){const ve=I[Y*3+1],F=(.725-ve)/1.45;Z.setZ(Y,Math.sin(_*2.2+I[Y*3]*5+F*3+X)*.075*F)}Z.needsUpdate=!0,L.geometry.computeVertexNormals()}),r.forEach(L=>L.offset.y=_*.48),n.forEach(({mesh:L,x:I,phase:X})=>L.position.x=I+Math.sin(_*.025+X)*2),Qe.rotation.y=_*.015,Qe.position.y=Math.sin(_*.5)*.15},dispose(){const _=new Set,L=new Set,I=new Set;s.traverse(X=>{if(X.geometry&&_.add(X.geometry),X.material)for(const Z of Array.isArray(X.material)?X.material:[X.material]){L.add(Z);for(const Y of Object.values(Z))Y?.isTexture&&I.add(Y)}}),_.forEach(X=>X.dispose()),L.forEach(X=>X.dispose()),I.forEach(X=>X.dispose())}}}function AM(s){s.updateMatrixWorld(!0);const e=s.matrixWorld.clone().invert(),t=[];s.traverse(N=>{N.isMesh&&!N.isSkinnedMesh&&t.push(N)});const n=t.map(N=>({mesh:N,geometry:N.geometry.clone().applyMatrix4(e.clone().multiply(N.matrixWorld))})),i=new Sn;n.forEach(({geometry:N})=>{N.computeBoundingBox(),i.union(N.boundingBox)});const r=i.max.y-i.min.y,a=r/1.10127008,o=(i.min.x+i.max.x)/2,l=(i.min.z+i.max.z)/2,c=[],h={},f=[],u=(N,G,U)=>new O(o+N*a,i.min.y+G*a,l+U*a);function d(N,G,U,K,J){const $=new Sc;$.name=`Solara_${N}`;const le=u(U,K,J);return $.position.copy(le),G&&$.position.sub(f[c.indexOf(G)]),(G||s).add($),h[N]=$,c.push($),f.push(le),$}const p=d("pelvis",null,0,.43,.2),v=d("torso",p,0,.57,.23);d("head",v,0,.755,.22);for(const[N,G]of[["right",-1],["left",1]]){const U=d(`${N}UpperArm`,v,G*.117,.68,.25),K=d(`${N}Forearm`,U,G*.188,.565,.283);d(`${N}Hand`,K,G*.257,.482,.345);const J=d(`${N}Thigh`,p,G*.08,.42,.2),$=d(`${N}Shin`,J,G*.105,.235,.19);d(`${N}Foot`,$,G*.115,.065,.25);const le=d(`${N}Cape`,v,G*.13,.67,.155);d(`${N}CapeHem`,le,G*.27,.36,.1)}const g=d("tailRoot",p,0,.46,.05),m=d("tailMiddle",g,0,.39,-.1),S=d("tailCurl",m,0,.48,-.27);d("tailTip",S,0,.68,-.33);const w=N=>c.indexOf(h[N]),y=(N,G,U)=>{let K=kt.clamp((U-N)/(G-N),0,1);return K*K*(3-2*K)},E=(N,G,U)=>[[w(N),1-U],[w(G),U]];function T(N){const G=(Array.isArray(N)?N[0]:N)?.map?.image;if(!G)return()=>!1;try{const U=document.createElement("canvas");U.width=G.width,U.height=G.height;const K=U.getContext("2d",{willReadFrequently:!0});K.drawImage(G,0,0);const J=K.getImageData(0,0,U.width,U.height).data;return($,le)=>{const ee=Math.min(U.width-1,Math.max(0,Math.floor($*U.width))),ce=Math.min(U.height-1,Math.max(0,Math.floor(le*U.height))),oe=(ce*U.width+ee)*4;return J[oe]>65&&J[oe+1]/J[oe]<.35&&J[oe+2]/J[oe]<.4}}catch{return()=>!1}}const R=[];for(const{mesh:N,geometry:G}of n){const U=G.attributes.position,K=G.attributes.uv,J=T(N.material),$=new Uint16Array(U.count*4),le=new Float32Array(U.count*4);for(let fe=0;fe<U.count;fe++){const Ie=(U.getX(fe)-o)/a,ue=(U.getY(fe)-i.min.y)/a,Ce=(U.getZ(fe)-l)/a,He=Math.abs(Ie),ne=Ie<0?"right":"left",pe=K?J(K.getX(fe),K.getY(fe)):!1;let de;if(Ce<-.075&&ue>.28)Ce>-.15?de=E("tailRoot","tailMiddle",y(.075,.19,-Ce)):ue<.48?de=E("tailMiddle","tailCurl",y(.18,.32,-Ce)):de=E("tailCurl","tailTip",y(.47,.69,ue));else if(ue>.75&&Ce>-.03)de=E("torso","head",y(.745,.795,ue));else if(Ce<.19&&ue>.12&&ue<.75||ue<.435&&He>.205&&Ce<.29||pe&&He>.15&&ue<.66&&Ce<.3)ue>.63?de=E(`${ne}Cape`,"torso",y(.63,.72,ue)):de=E(`${ne}CapeHem`,`${ne}Cape`,y(.25,.61,ue));else if(ue>.405&&ue<.71&&He>(ue<.48?.2:.112)&&Ce>.185){const me=y(.103,.155,He)*(1-y(.687,.728,ue));de=(ue>.56?E(`${ne}Forearm`,`${ne}UpperArm`,y(.535,.625,ue)):E(`${ne}Hand`,`${ne}Forearm`,y(.484,.558,ue))).map(([ke,Ge])=>[ke,Ge*me]),de.push([w("torso"),1-me])}else if(ue<.44&&Ce>.16&&He<.205){de=ue>.22?E(`${ne}Shin`,`${ne}Thigh`,y(.21,.34,ue)):E(`${ne}Foot`,`${ne}Shin`,y(.07,.22,ue));const me=y(.36,.46,ue);de=de.map(([_e,ke])=>[_e,ke*(1-me)]),de.push([w("pelvis"),me])}else de=E("pelvis","torso",y(.42,.61,ue));de.forEach(([me,_e],ke)=>{$[fe*4+ke]=me,le[fe*4+ke]=_e})}const ee=new Map,ce=new Int32Array(U.count),oe=[],Le=[];for(let fe=0;fe<U.count;fe++){const Ie=[U.getX(fe),U.getY(fe),U.getZ(fe)].map(Ce=>Math.round(Ce/(a*2e-5))).join(",");let ue=ee.get(Ie);ue===void 0&&(ue=oe.length,ee.set(Ie,ue),oe.push([]),Le.push(new Set)),ce[fe]=ue,oe[ue].push(fe)}const Ee=G.index,nt=Ee?Ee.count:U.count;for(let fe=0;fe<nt;fe+=3){const Ie=ce[Ee?Ee.getX(fe):fe],ue=ce[Ee?Ee.getX(fe+1):fe+1],Ce=ce[Ee?Ee.getX(fe+2):fe+2];Le[Ie].add(ue).add(Ce),Le[ue].add(Ie).add(Ce),Le[Ce].add(Ie).add(ue)}const $e=c.length;let Je=new Float32Array(oe.length*$e);oe.forEach((fe,Ie)=>fe.forEach(ue=>{for(let Ce=0;Ce<4;Ce++)Je[Ie*$e+$[ue*4+Ce]]+=le[ue*4+Ce]/fe.length}));const ie=Le.map(fe=>[...fe]);for(let fe=0;fe<15;fe++){const Ie=new Float32Array(Je.length);for(let ue=0;ue<oe.length;ue++){const Ce=ie[ue],He=ue*$e,ne=.52/Math.max(1,Ce.length);for(let pe=0;pe<$e;pe++){let de=Je[He+pe]*.48;for(let me=0;me<Ce.length;me++)de+=Je[Ce[me]*$e+pe]*ne;Ie[He+pe]=de}}Je=Ie}oe.forEach((fe,Ie)=>{const ue=Array.from({length:$e},(He,ne)=>[ne,Je[Ie*$e+ne]]).sort((He,ne)=>ne[1]-He[1]).slice(0,4),Ce=ue.reduce((He,ne)=>He+ne[1],0);for(const He of fe)for(let ne=0;ne<4;ne++)$[He*4+ne]=ue[ne][0],le[He*4+ne]=ue[ne][1]/Ce}),G.setAttribute("skinIndex",new Mc($,4)),G.setAttribute("skinWeight",new dt(le,4));const he=new af(G,N.material);he.name=N.name+"_articulated",he.castShadow=N.castShadow,he.receiveShadow=N.receiveShadow,he.frustumCulled=!1,N.visible=!1,s.add(he),R.push({source:N,skinned:he})}s.updateMatrixWorld(!0);const x=new Ja(c);for(const{skinned:N}of R)N.bind(x),N.normalizeSkinWeights();const A=c.map(N=>N.position.clone()),D=[{t:0,shoulder:0,elbow:0,spread:0,turn:0,lean:0,guard:0},{t:.9,shoulder:.18,elbow:-.2,spread:.12,turn:-.06,lean:.02,guard:.18},{t:2,shoulder:-.64,elbow:-.58,spread:.12,turn:.06,lean:-.02,guard:.35},{t:3.35,shoulder:-.7,elbow:-.62,spread:.08,turn:.08,lean:-.02,guard:.4},{t:3.65,shoulder:-1.06,elbow:-.15,spread:.03,turn:.12,lean:.035,guard:.38},{t:4,shoulder:-1.03,elbow:-.1,spread:.02,turn:.1,lean:.025,guard:.3},{t:4.65,shoulder:-.55,elbow:-.3,spread:.07,turn:.04,lean:0,guard:.18},{t:6,shoulder:0,elbow:0,spread:0,turn:0,lean:0,guard:0}];function z(N,G="idle"){if(c.forEach(($,le)=>{$.rotation.set(0,0,0),$.position.copy(A[le])}),G==="rest"){s.updateMatrixWorld(!0);return}const U=Math.sin(N*1.6),K=G==="cast";v.rotation.x=U*.008,v.position.y+=U*.0018*a,h.head.rotation.y=Math.sin(N*.62)*.025,h.head.rotation.x=-U*.008,h.rightUpperArm.rotation.z=.008*Math.sin(N*1.6+.5),h.leftUpperArm.rotation.z=-.008*Math.sin(N*1.6+.5);let J=0;if(K){const $=kt.clamp(N,0,6);let le=D.findIndex(Ee=>Ee.t>=$);le<1&&(le=1);const ee=D[le-1],ce=D[le],oe=y(ee.t,ce.t,$),Le={};for(const Ee of Object.keys(ee))Ee!=="t"&&(Le[Ee]=kt.lerp(ee[Ee],ce[Ee],oe));h.rightUpperArm.rotation.x=Le.shoulder,h.rightUpperArm.rotation.z=-Le.spread,h.rightForearm.rotation.x=Le.elbow,h.rightForearm.rotation.y=-Le.spread*.7,h.rightHand.rotation.x=-.1*y(.8,2,$)*(1-y(4.1,6,$)),h.leftUpperArm.rotation.x=-Le.guard*.43,h.leftForearm.rotation.x=-Le.guard,h.leftForearm.rotation.z=Le.guard*.2,v.rotation.y=Le.turn,v.rotation.x+=Le.lean,h.head.rotation.y=-Le.turn*.75,h.head.rotation.x=-.025*y(.7,2,$)*(1-y(4,6,$)),J=Math.sin(Math.max(0,$-3.35)*7)*Math.exp(-Math.max(0,$-3.35)*2.5)*($>3.35?1:0)}h.tailRoot.rotation.y=Math.sin(N*.95)*.035,h.tailMiddle.rotation.y=Math.sin(N*.95-.55)*.055+J*.025,h.tailCurl.rotation.y=Math.sin(N*.95-1)*.07,h.tailTip.rotation.z=Math.sin(N*1.1-1.4)*.045;for(const[$,le]of[["right",-1],["left",1]])h[$+"Cape"].rotation.x=Math.sin(N*1.2+le*.5)*.018+J*.015,h[$+"CapeHem"].rotation.x=Math.sin(N*1.5+le*.7-.6)*.025+J*.035;s.updateMatrixWorld(!0)}return z(0),{update:z,duration:6,bones:h,getSpellOrigin(N=new O){return h.rightHand.localToWorld(N.set(-.015*a,-.018*a,.055*a))},dispose(){for(const{source:N,skinned:G}of R)N.visible=!0,G.removeFromParent(),G.geometry.dispose();p.removeFromParent(),x.dispose()}}}const RM=s=>(s=kt.clamp(s,0,1),s*s*(3-2*s)),nl=kt.lerp,It=(s,e,t)=>RM((s-e)/(t-e));function CM({scene:s,camera:e,controls:t,attacker:n,defender:i,createCreature:r,onProgress:a,onDone:o}){const l=new an;l.name="CaptureCinematic",s.add(l);const c=new Set,h=new Set,f=[],u=C=>(c.add(C),C),d=C=>(h.add(C),C),p=r(n.type,n.color);let v=r(i.type,i.color);function g(C){const V={p:.77,r:1.05,n:1.03,b:1.18,q:1.27,k:1.14},te=new O().fromArray(C.userData.originalSize);C.scale.setScalar(Math.min(2*V[C.userData.type]/te.y,1.72/Math.max(te.x,te.z)))}[p,v].forEach(g),p.position.set(-2.25,0,0),v.position.set(2.25,0,0),p.rotation.y=Math.PI/2,v.rotation.y=-Math.PI/2,l.add(p,v);const m=p.scale.clone(),S=v.scale.clone();let w=null;if(n.type==="q"){const C=p.getObjectByName("CreatureBody")||p.userData.body;C?.isObject3D&&(w=AM(C),f.push(w))}l.updateMatrixWorld(!0);const y=new Sn().setFromObject(v);let E=y.max.y-y.min.y;const T={cutoff:{value:-100},edge:{value:new Ye(n.color==="w"?"#ffe0a0":"#92edff")}},R=new Map;function x(C){C.traverse(V=>{if(!V.isMesh)return;const te=xe=>{if(R.has(xe))return R.get(xe);const Se=d(xe.clone()),re=xe.onBeforeCompile;return Se.onBeforeCompile=ae=>{re?.call(Se,ae),ae.uniforms.battleCutoff=T.cutoff,ae.uniforms.battleEdge=T.edge,ae.vertexShader=`varying vec3 vBattleWorld;
`+ae.vertexShader,ae.vertexShader=ae.vertexShader.replace("#include <project_vertex>",`vBattleWorld=(modelMatrix*vec4(transformed,1.0)).xyz;
#include <project_vertex>`),ae.fragmentShader=`varying vec3 vBattleWorld;uniform float battleCutoff;uniform vec3 battleEdge;
`+ae.fragmentShader,ae.fragmentShader=ae.fragmentShader.replace("#include <alphatest_fragment>",`#include <alphatest_fragment>
          float dissolveNoise=fract(sin(dot(floor(vBattleWorld*35.0),vec3(12.9898,78.233,39.425)))*43758.5453);
          float dissolveEdge=vBattleWorld.y+0.11*dissolveNoise-battleCutoff;
          if(dissolveEdge<0.0)discard;
          diffuseColor.rgb=mix(diffuseColor.rgb,battleEdge,1.0-smoothstep(0.0,0.13,dissolveEdge));`)},Se.customProgramCacheKey=()=>`capture-dissolve-${xe.customProgramCacheKey?.()||""}`,R.set(xe,Se),Se};V.material=Array.isArray(V.material)?V.material.map(te):te(V.material)})}x(v);const A=new Map([[i.type,{model:v,height:E,scale:v.scale.clone()}]]);for(const C of["p","r","n","b","q","k"]){if(A.has(C))continue;const V=r(C,i.color);g(V),V.position.set(2.25,0,0),V.rotation.y=-Math.PI/2,x(V);const te=new Sn().setFromObject(V);A.set(C,{model:V,height:te.max.y-te.min.y,scale:V.scale.clone()})}const D=n.color!=="b",z=new Ye(D?"#f5bd3f":"#4ec9ec"),N=d(new Pn({color:z,transparent:!0,opacity:.78,blending:ts,depthWrite:!1,toneMapped:!1})),G=d(new Pn({color:"#fff5d5",transparent:!0,opacity:.88,blending:ts,depthWrite:!1,toneMapped:!1})),U=u(new Dc(1,.025,6,72)),K=u(new Ns(1,2));function J(C,V=N){const te=new _t(C,V);return l.add(te),te}const $=J(U),le=J(U),ee=J(K),ce=J(K,G);$.rotation.x=le.rotation.x=Math.PI/2,$.position.set(-2.25,.035,0),le.position.copy($.position);const oe=Array.from({length:3},()=>J(U)),Le=Array.from({length:5},()=>J(U)),Ee=J(u(new dn(.07,.16,1,12,1,!0)));Ee.visible=!1;const nt=new Oc(z,0,9,2);l.add(nt);const $e=d(new ki({color:n.type==="b"?"#f6a7d3":"#a1d464",roughness:.6,side:Jt,emissive:n.type==="b"?"#942d78":"#437029",emissiveIntensity:.25})),Je=new Is;Je.moveTo(0,.17),Je.quadraticCurveTo(.14,0,0,-.17),Je.quadraticCurveTo(-.14,0,0,.17);const ie=new _i(u(new Fr(Je,5)),$e,42);l.add(ie);const he=d(new ki({color:"#9caba8",roughness:.9})),fe=new _i(u(new Ns(.18,0)),he,24);l.add(fe);const Ie=new _i(u(new Ic(.055,0)),N,180);Ie.instanceMatrix.setUsage(Xd),l.add(Ie);const ue=new _i(u(new Ns(.045,0)),G,75);l.add(ue);const Ce=new Float32Array(72),He=u(new Pt);He.setAttribute("position",new Qt(Ce,3));const ne=new Qa(He,d(new Tc({color:"#e0f9ff",transparent:!0,opacity:.95,blending:ll,depthWrite:!1})));l.add(ne);const pe=new wt,de=new O,me=new O(2.25,Math.max(.85,E*.55),0),_e=e.position.clone(),ke=t.target.clone(),Ge=new O(-1.4,2.6,7.6),Ke=new O(-3.4,2.2,6.5),Ze=new O(.7,2.15,7),k=new O(0,1,0);let lt=!1,et=!1;function P(C,V,te,xe,Se,re,ae=0,Re=0,De=0){pe.position.set(te,xe,Se),pe.rotation.set(ae,Re,De),pe.scale.setScalar(Math.max(1e-4,re)),pe.updateMatrix(),C.setMatrixAt(V,pe.matrix)}function M(C){if(et)return;if(C=Math.max(0,C),a?.(Math.min(10,C)),C>=10){lt||(lt=!0,o?.());return}l.visible=C>=.5;const V=It(C,0,1.4),te=It(C,2.3,4.2),xe=It(C,5.15,6.15),Se=It(C,9,10),re=Ge.clone().lerp(Ke,te).lerp(Ze,xe),ae=Math.tan(kt.degToRad(e.fov/2))*e.aspect,Re=Math.max(1,3.4/(ae*7.4));re.sub(k).multiplyScalar(Re).add(k),e.position.lerpVectors(_e,re,V).lerp(_e,Se),t.target.lerpVectors(ke,k,V).lerp(ke,Se),p.position.set(-2.25,0,0),p.rotation.set(0,Math.PI/2,0),p.scale.copy(m),v.position.set(2.25,0,0),v.rotation.set(0,-Math.PI/2,0),v.scale.copy(S),v.visible=!0;const De=It(C,1.6,3.5)*(1-It(C,5.6,6.8)),Te=C-5.65;if(w&&w.update(Math.max(0,C-2),"cast"),n.type==="n"){const _=It(C,3.8,5.6),L=It(C,6.05,7.25);p.position.x+=3.05*_*(1-L),p.position.y=Math.sin(_*Math.PI)*1.1+Math.sin(L*Math.PI)*.55,p.rotation.z=.24*Math.sin(_*Math.PI)-.13*Math.sin(L*Math.PI),p.rotation.y+=Math.sin(_*Math.PI)*.24}else if(n.type==="r"){const _=It(C,3.5,4.7)*(1-It(C,4.7,5.2));p.position.y=_*.28;const L=Math.sin(It(C,4.85,5.4)*Math.PI);p.scale.y*=1-L*.07,p.scale.x*=1+L*.035,p.rotation.z=-.06*De}else n.type==="p"?(p.rotation.z=-.11*De,p.rotation.y+=Math.sin(C*3)*.025*De,p.position.y=Math.sin(It(C,4.5,5.4)*Math.PI)*.22):n.type==="b"?(p.position.y=.18*De,p.rotation.y+=Math.sin(It(C,2.5,5.3)*Math.PI)*.5):n.type==="k"&&(p.rotation.z=.1*De-.18*It(C,4.8,5.25)*(1-It(C,5.7,6.4)),p.position.x+=.22*It(C,4.8,5.25)*(1-It(C,6,7)));if(Te>0){const _=Math.sin(Math.min(1,Te/1.25)*Math.PI);v.position.x+=_*.43,v.rotation.z=-_*.16,v.position.y+=Math.sin(Math.min(1,Te/.65)*Math.PI)*.1}const Pe=It(C,7,8.6);T.cutoff.value=Pe>0?nl(-.12,E+.35,Pe):-100,v.visible=C<8.65,C>8.2&&(p.rotation.y+=.12*Math.sin(It(C,8.2,9.3)*Math.PI)),p.updateMatrixWorld(!0),w?w.getSpellOrigin(de):de.set(p.position.x+.35,n.type==="k"?1.3:1.1,p.position.z);const Ue=It(C,2,4.9),We=It(C,5.4,5.65),Qe=C>1.8&&C<5.7;if(ee.visible=ce.visible=n.type==="q"&&Qe,ee.position.copy(de).lerp(me,We),ce.position.copy(ee.position),ee.scale.setScalar(.09+Ue*.22),ce.scale.setScalar(.05+Ue*.1),ee.rotation.set(C*1.3,C*.8,C),nt.position.copy(ee.position),nt.intensity=n.type==="q"&&Qe?Ue*3:0,oe.forEach((_,L)=>{_.visible=ee.visible,_.position.copy(ee.position),_.scale.setScalar(.18+Ue*.3+L*.04),_.rotation.set(C*(L%2?-.7:.6)+L,Math.PI*L/3,C*.4)}),$.visible=le.visible=C>1.6&&C<6.2,$.scale.setScalar(.65+Ue*.5),le.scale.setScalar(.5+Ue*.8),$.rotation.z=C*.35,le.rotation.z=-C*.3,Ee.visible=n.type==="q"&&C>5.4&&C<5.83,Ee.visible){const _=me.clone().sub(de);Ee.position.copy(de).addScaledVector(_,.5),Ee.scale.set(1,_.length(),1),Ee.quaternion.setFromUnitVectors(new O(0,1,0),_.normalize())}Le.forEach((_,L)=>{if(_.visible=!1,n.type==="r"&&C>4.95&&C<6.55){const I=kt.clamp((C-4.95-L*.13)/1.25,0,1);_.visible=I>0&&I<1,_.position.set(-2.25,.045+L*.005,0),_.rotation.set(Math.PI/2,0,0),_.scale.setScalar(.4+I*5.3)}else if(n.type==="k"&&C>4.9&&C<6){const I=kt.clamp((C-4.9-L*.08)/.65,0,1);_.visible=I>0&&I<1,_.position.set(nl(-1.5,2.3,I),1.2,0),_.rotation.set(0,Math.PI/2,0),_.scale.setScalar(.24+I*.65)}else if(Te>0&&Te<1.2){const I=kt.clamp((Te-L*.08)/1.1,0,1);_.visible=I>0&&I<1,_.position.copy(me),_.rotation.set(L*.7,Math.PI/2+L*.35,C*.4),_.scale.setScalar(.1+I*1.25)}}),ie.visible=["p","b"].includes(n.type)&&C>2.6&&C<6.2;for(let _=0;_<42;_++){const L=It(C,4.25+_*.013,5.65+_*.004),I=_*2.399+C*(n.type==="b"?3:5),X=(.3+Ue*.32)*(1-.65*L);P(ie,_,nl(-2.25,2.25,L)+Math.cos(I)*X*.3,1+Math.sin(I)*X+Math.sin(L*Math.PI)*.55,Math.cos(I)*X,1,I,C+_,I*.5)}ie.instanceMatrix.needsUpdate=!0,fe.visible=n.type==="r"&&C>5&&C<6.25;for(let _=0;_<24;_++){const L=kt.clamp((C-5-_*.016)/1.1,0,1);P(fe,_,-1.9+L*4.4,Math.sin(L*Math.PI)*(.3+_%3*.08)-.1,Math.sin(_*2.4)*.52,.6+_%4*.25,C*3+_,_,C)}fe.instanceMatrix.needsUpdate=!0,ne.visible=n.type==="n"&&C>3.6&&C<6.1;for(let _=0;_<24;_++){const L=_/23;Ce[_*3]=p.position.x-1+L*1.65,Ce[_*3+1]=p.position.y+.7+Math.sin(_*2.1+C*35)*.16,Ce[_*3+2]=Math.cos(_*1.7+C*22)*.13}He.attributes.position.needsUpdate=!0,He.computeBoundingSphere();for(let _=0;_<180;_++){const L=_*2.399,I=Math.sin(_*78.233)*43758.5453,X=I-Math.floor(I);if(Te>0&&Te<1.9){const Z=Te*(.55+_%7*.12),Y=Z*1.4;P(Ie,_,me.x+Math.cos(L)*Y,me.y+(X-.25)*Y-Z*Z*.27,Math.sin(L)*Y,Math.max(0,1-Te/1.9),L,C*3,0)}else{const Z=.45+_%11/11*.28;P(Ie,_,de.x+Math.cos(L+C*2)*Z,de.y+(X-.5)*.9,de.z+Math.sin(L+C*2)*Z,.35*De,L,C,0)}}Ie.visible=C>2&&C<7.55,Ie.instanceMatrix.needsUpdate=!0,ue.visible=C>7&&C<9.1;for(let _=0;_<75;_++){const L=Math.max(0,C-7),I=_*2.399;P(ue,_,2.25+Math.cos(I)*(.28+L*.12),Math.min(E,Pe*E)+_%13*.035+L*.25,Math.sin(I)*(.3+L*.1),Math.sin(Math.min(1,L/2.1)*Math.PI)*(.55+_%3*.22),C,_,C)}ue.instanceMatrix.needsUpdate=!0,Te>0&&Te<.28&&(e.position.x+=Math.sin(Te*65)*.038*(1-Te/.28)),e.lookAt(t.target)}return M(0),{group:l,duration:10,update:M,reset(C=i){v.removeFromParent();const V=A.get(C.type);if(!V)throw new Error("Unprepared defender");v=V.model,E=V.height,S.copy(V.scale),l.add(v),me.y=Math.max(.85,E*.55),_e.copy(e.position),ke.copy(t.target),lt=!1,M(0)},async warmup(C){M(4.7);for(const V of A.values())V.model.visible=!0,l.add(V.model);for(const V of l.children)V.visible=!0;l.visible=!0,await C.compileAsync(s,e),C.shadowMap.needsUpdate=!0,C.render(s,e);for(const V of A.values())V.model!==v&&V.model.removeFromParent();l.visible=!1,C.shadowMap.needsUpdate=!0,C.render(s,e);for(const V of[.7,2.5,4.7,5.7,7.7,9.5])M(V),C.shadowMap.needsUpdate=!0,C.render(s,e);l.visible=!1},hide(){l.visible=!1},dispose(){et||(et=!0,f.forEach(C=>C.dispose()),l.removeFromParent(),c.forEach(C=>C.dispose()),h.forEach(C=>C.dispose()))}}}function PM(s){const e=new Map,t=new Map,n=s.clone();return Nf(s,n,function(i,r){e.set(r,i),t.set(i,r)}),n.traverse(function(i){if(!i.isSkinnedMesh)return;const r=i,a=e.get(i),o=a.skeleton.bones;r.skeleton=a.skeleton.clone(),r.bindMatrix.copy(a.bindMatrix),r.skeleton.bones=o.map(function(l){return t.get(l)}),r.bind(r.skeleton,r.bindMatrix)}),n}function Nf(s,e,t){t(s,e);for(let n=0;n<s.children.length;n++)Nf(s.children[n],e.children[n],t)}class LM extends Xs{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new OM(t)}),this.register(function(t){return new FM(t)}),this.register(function(t){return new qM(t)}),this.register(function(t){return new KM(t)}),this.register(function(t){return new $M(t)}),this.register(function(t){return new kM(t)}),this.register(function(t){return new zM(t)}),this.register(function(t){return new HM(t)}),this.register(function(t){return new GM(t)}),this.register(function(t){return new UM(t)}),this.register(function(t){return new VM(t)}),this.register(function(t){return new BM(t)}),this.register(function(t){return new XM(t)}),this.register(function(t){return new WM(t)}),this.register(function(t){return new NM(t)}),this.register(function(t){return new Ru(t,ut.EXT_MESHOPT_COMPRESSION)}),this.register(function(t){return new Ru(t,ut.KHR_MESHOPT_COMPRESSION)}),this.register(function(t){return new YM(t)})}load(e,t,n,i){const r=this;let a;if(this.resourcePath!=="")a=this.resourcePath;else if(this.path!==""){const c=Sr.extractUrlBase(e);a=Sr.resolveURL(c,this.path)}else a=Sr.extractUrlBase(e);this.manager.itemStart(e);const o=function(c){i?i(c):console.error(c),r.manager.itemError(e),r.manager.itemEnd(e)},l=new yf(this.manager);l.setPath(this.path),l.setResponseType("arraybuffer"),l.setRequestHeader(this.requestHeader),l.setWithCredentials(this.withCredentials),l.load(e,function(c){try{r.parse(c,a,function(h){t(h),r.manager.itemEnd(e)},o)}catch(h){o(h)}},n,o)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r;const a={},o={},l=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(l.decode(new Uint8Array(e,0,4))===Df){try{a[ut.KHR_BINARY_GLTF]=new ZM(e)}catch(f){i&&i(f);return}r=JSON.parse(a[ut.KHR_BINARY_GLTF].content)}else r=JSON.parse(l.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}const c=new cy(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});c.fileLoader.setRequestHeader(this.requestHeader);for(let h=0;h<this.pluginCallbacks.length;h++){const f=this.pluginCallbacks[h](c);f.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),o[f.name]=f,a[f.name]=!0}if(r.extensionsUsed)for(let h=0;h<r.extensionsUsed.length;++h){const f=r.extensionsUsed[h],u=r.extensionsRequired||[];switch(f){case ut.KHR_MATERIALS_UNLIT:a[f]=new DM;break;case ut.KHR_DRACO_MESH_COMPRESSION:a[f]=new JM(r,this.dracoLoader);break;case ut.KHR_TEXTURE_TRANSFORM:a[f]=new QM;break;case ut.KHR_MESH_QUANTIZATION:a[f]=new jM;break;default:u.indexOf(f)>=0&&o[f]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+f+'".')}}c.setExtensions(a),c.setPlugins(o),c.parse(n,i)}parseAsync(e,t){const n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}}function IM(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}function Ut(s,e,t){const n=s.json.materials[e];return n.extensions&&n.extensions[t]?n.extensions[t]:null}const ut={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",KHR_MESHOPT_COMPRESSION:"KHR_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"};class NM{constructor(e){this.parser=e,this.name=ut.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){const e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){const r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){const t=this.parser,n="light:"+e;let i=t.cache.get(n);if(i)return i;const r=t.json,l=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e];let c;const h=new Ye(16777215);l.color!==void 0&&h.setRGB(l.color[0],l.color[1],l.color[2],yn);const f=l.range!==void 0?l.range:0;switch(l.type){case"directional":c=new Jl(h),c.target.position.set(0,0,-1),c.add(c.target);break;case"point":c=new Oc(h),c.distance=f;break;case"spot":c=new $m(h),c.distance=f,l.spot=l.spot||{},l.spot.innerConeAngle=l.spot.innerConeAngle!==void 0?l.spot.innerConeAngle:0,l.spot.outerConeAngle=l.spot.outerConeAngle!==void 0?l.spot.outerConeAngle:Math.PI/4,c.angle=l.spot.outerConeAngle,c.penumbra=1-l.spot.innerConeAngle/l.spot.outerConeAngle,c.target.position.set(0,0,-1),c.add(c.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+l.type)}return c.position.set(0,0,0),Yn(c,l),l.intensity!==void 0&&(c.intensity=l.intensity),c.name=t.createUniqueName(l.name||"light_"+e),i=Promise.resolve(c),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){const t=this,n=this.parser,r=n.json.nodes[e],o=(r.extensions&&r.extensions[this.name]||{}).light;return o===void 0?null:this._loadLight(o).then(function(l){return n._getNodeRef(t.cache,o,l)})}}class DM{constructor(){this.name=ut.KHR_MATERIALS_UNLIT}getMaterialType(){return Pn}extendParams(e,t,n){const i=[];e.color=new Ye(1,1,1),e.opacity=1;const r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){const a=r.baseColorFactor;e.color.setRGB(a[0],a[1],a[2],yn),e.opacity=a[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,Rt))}return Promise.all(i)}}class UM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);return n===null||n.emissiveStrength!==void 0&&(t.emissiveIntensity=n.emissiveStrength),Promise.resolve()}}class OM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(n.clearcoatFactor!==void 0&&(t.clearcoat=n.clearcoatFactor),n.clearcoatTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatMap",n.clearcoatTexture)),n.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=n.clearcoatRoughnessFactor),n.clearcoatRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"clearcoatRoughnessMap",n.clearcoatRoughnessTexture)),n.clearcoatNormalTexture!==void 0&&(i.push(this.parser.assignTexture(t,"clearcoatNormalMap",n.clearcoatNormalTexture)),n.clearcoatNormalTexture.scale!==void 0)){const r=n.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new ye(r,r)}return Promise.all(i)}}class FM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_DISPERSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);return n===null||(t.dispersion=n.dispersion!==void 0?n.dispersion:0),Promise.resolve()}}class BM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.iridescenceFactor!==void 0&&(t.iridescence=n.iridescenceFactor),n.iridescenceTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceMap",n.iridescenceTexture)),n.iridescenceIor!==void 0&&(t.iridescenceIOR=n.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),n.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=n.iridescenceThicknessMinimum),n.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=n.iridescenceThicknessMaximum),n.iridescenceThicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"iridescenceThicknessMap",n.iridescenceThicknessTexture)),Promise.all(i)}}class kM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_SHEEN}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];if(t.sheenColor=new Ye(0,0,0),t.sheenRoughness=0,t.sheen=1,n.sheenColorFactor!==void 0){const r=n.sheenColorFactor;t.sheenColor.setRGB(r[0],r[1],r[2],yn)}return n.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=n.sheenRoughnessFactor),n.sheenColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenColorMap",n.sheenColorTexture,Rt)),n.sheenRoughnessTexture!==void 0&&i.push(this.parser.assignTexture(t,"sheenRoughnessMap",n.sheenRoughnessTexture)),Promise.all(i)}}class zM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.transmissionFactor!==void 0&&(t.transmission=n.transmissionFactor),n.transmissionTexture!==void 0&&i.push(this.parser.assignTexture(t,"transmissionMap",n.transmissionTexture)),Promise.all(i)}}class HM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_VOLUME}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.thickness=n.thicknessFactor!==void 0?n.thicknessFactor:0,n.thicknessTexture!==void 0&&i.push(this.parser.assignTexture(t,"thicknessMap",n.thicknessTexture)),t.attenuationDistance=n.attenuationDistance||1/0;const r=n.attenuationColor||[1,1,1];return t.attenuationColor=new Ye().setRGB(r[0],r[1],r[2],yn),Promise.all(i)}}class GM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_IOR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);return n===null||(t.ior=n.ior!==void 0?n.ior:1.5,t.ior===0&&(t.ior=1e3)),Promise.resolve()}}class VM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_SPECULAR}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];t.specularIntensity=n.specularFactor!==void 0?n.specularFactor:1,n.specularTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularIntensityMap",n.specularTexture));const r=n.specularColorFactor||[1,1,1];return t.specularColor=new Ye().setRGB(r[0],r[1],r[2],yn),n.specularColorTexture!==void 0&&i.push(this.parser.assignTexture(t,"specularColorMap",n.specularColorTexture,Rt)),Promise.all(i)}}class WM{constructor(e){this.parser=e,this.name=ut.EXT_MATERIALS_BUMP}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return t.bumpScale=n.bumpFactor!==void 0?n.bumpFactor:1,n.bumpTexture!==void 0&&i.push(this.parser.assignTexture(t,"bumpMap",n.bumpTexture)),Promise.all(i)}}class XM{constructor(e){this.parser=e,this.name=ut.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){return Ut(this.parser,e,this.name)!==null?ai:null}extendMaterialParams(e,t){const n=Ut(this.parser,e,this.name);if(n===null)return Promise.resolve();const i=[];return n.anisotropyStrength!==void 0&&(t.anisotropy=n.anisotropyStrength),n.anisotropyRotation!==void 0&&(t.anisotropyRotation=n.anisotropyRotation),n.anisotropyTexture!==void 0&&i.push(this.parser.assignTexture(t,"anisotropyMap",n.anisotropyTexture)),Promise.all(i)}}class qM{constructor(e){this.parser=e,this.name=ut.KHR_TEXTURE_BASISU}loadTexture(e){const t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;const r=i.extensions[this.name],a=t.options.ktx2Loader;if(!a){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,a)}}class KM{constructor(e){this.parser=e,this.name=ut.EXT_TEXTURE_WEBP}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class $M{constructor(e){this.parser=e,this.name=ut.EXT_TEXTURE_AVIF}loadTexture(e){const t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;const a=r.extensions[t],o=i.images[a.source];let l=n.textureLoader;if(o.uri){const c=n.options.manager.getHandler(o.uri);c!==null&&(l=c)}return n.loadTextureImage(e,a.source,l)}}class Ru{constructor(e,t){this.name=t,this.parser=e}loadBufferView(e){const t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){const i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),a=this.parser.options.meshoptDecoder;if(!a||!a.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(o){const l=i.byteOffset||0,c=i.byteLength||0,h=i.count,f=i.byteStride,u=new Uint8Array(o,l,c);return a.decodeGltfBufferAsync?a.decodeGltfBufferAsync(h,f,u,i.mode,i.filter).then(function(d){return d.buffer}):a.ready.then(function(){const d=new ArrayBuffer(h*f);return a.decodeGltfBuffer(new Uint8Array(d),h,f,u,i.mode,i.filter),d})})}else return null}}class YM{constructor(e){this.name=ut.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){const t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;const i=t.meshes[n.mesh];for(const c of i.primitives)if(c.mode!==An.TRIANGLES&&c.mode!==An.TRIANGLE_STRIP&&c.mode!==An.TRIANGLE_FAN&&c.mode!==void 0)return null;const a=n.extensions[this.name].attributes,o=[],l={};for(const c in a)o.push(this.parser.getDependency("accessor",a[c]).then(h=>(l[c]=h,l[c])));return o.length<1?null:(o.push(this.parser.createNodeMesh(e)),Promise.all(o).then(c=>{const h=c.pop(),f=h.isGroup?h.children:[h],u=c[0].count,d=[];for(const p of f){const v=new at,g=new O,m=new In,S=new O(1,1,1),w=new _i(p.geometry,p.material,u);for(let E=0;E<u;E++)l.TRANSLATION&&g.fromBufferAttribute(l.TRANSLATION,E),l.ROTATION&&m.fromBufferAttribute(l.ROTATION,E),l.SCALE&&S.fromBufferAttribute(l.SCALE,E),w.setMatrixAt(E,v.compose(g,m,S));let y=null;for(const E in l)if(E==="_COLOR_0"){const T=l[E];w.instanceColor=new Ha(T.array,T.itemSize,T.normalized)}else if(E!=="TRANSLATION"&&E!=="ROTATION"&&E!=="SCALE"){if(y===null){const R=w.geometry;y=new Pt,y.name=R.name;for(const x in R.attributes)y.setAttribute(x,R.attributes[x]);for(const x in R.morphAttributes)y.morphAttributes[x]=R.morphAttributes[x];R.index!==null&&y.setIndex(R.index),y.morphTargetsRelative=R.morphTargetsRelative;for(const x of R.groups)y.addGroup(x.start,x.count,x.materialIndex);R.boundingBox!==null&&(y.boundingBox=R.boundingBox.clone()),R.boundingSphere!==null&&(y.boundingSphere=R.boundingSphere.clone()),y.drawRange.start=R.drawRange.start,y.drawRange.count=R.drawRange.count,y.userData=Object.assign({},R.userData),w.geometry=y}const T=l[E];y.setAttribute(E,new Ha(T.array,T.itemSize,T.normalized))}wt.prototype.copy.call(w,p),this.parser.assignFinalMaterial(w),d.push(w)}return h.isGroup?(h.clear(),h.add(...d),h):d[0]}))}}const Df="glTF",ur=12,Cu={JSON:1313821514,BIN:5130562};class ZM{constructor(e){this.name=ut.KHR_BINARY_GLTF,this.content=null,this.body=null;const t=new DataView(e,0,ur),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==Df)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");const i=this.header.length-ur,r=new DataView(e,ur);let a=0;for(;a<i;){const o=r.getUint32(a,!0);a+=4;const l=r.getUint32(a,!0);if(a+=4,l===Cu.JSON){const c=new Uint8Array(e,ur+a,o);this.content=n.decode(c)}else if(l===Cu.BIN){const c=ur+a;this.body=e.slice(c,c+o)}a+=o}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}}class JM{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=ut.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){const n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,a=e.extensions[this.name].attributes,o={},l={},c={};for(const h in a){const f=nc[h]||h.toLowerCase();o[f]=a[h]}for(const h in e.attributes){const f=nc[h]||h.toLowerCase();if(a[h]!==void 0){const u=n.accessors[e.attributes[h]],d=Us[u.componentType];c[f]=d.name,l[f]=u.normalized===!0}}return t.getDependency("bufferView",r).then(function(h){return new Promise(function(f,u){i.decodeDracoFile(h,function(d){for(const p in d.attributes){const v=d.attributes[p],g=l[p];g!==void 0&&(v.normalized=g)}f(d)},o,c,yn,u)})})}}class QM{constructor(){this.name=ut.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){if((t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0)return e;if(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),t.rotation!==void 0){const n=Math.cos(e.rotation),i=Math.sin(e.rotation);e.matrix.set(e.repeat.x*n,e.repeat.y*i,e.offset.x,-e.repeat.x*i,e.repeat.y*n,e.offset.y,0,0,1),e.matrixAutoUpdate=!1}return e.needsUpdate=!0,e}}class jM{constructor(){this.name=ut.KHR_MESH_QUANTIZATION}}class Uf extends Gs{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){const t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let a=0;a!==i;a++)t[a]=n[r+a];return t}interpolate_(e,t,n,i){const r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=o*2,c=o*3,h=i-t,f=(n-t)/h,u=f*f,d=u*f,p=e*c,v=p-c,g=-2*d+3*u,m=d-u,S=1-g,w=m-u+f;for(let y=0;y!==o;y++){const E=a[v+y+o],T=a[v+y+l]*h,R=a[p+y+o],x=a[p+y]*h;r[y]=S*E+w*T+g*R+m*x}return r}}const ey=new In;class ty extends Uf{interpolate_(e,t,n,i){const r=super.interpolate_(e,t,n,i);return ey.fromArray(r).normalize().toArray(r),r}}const An={POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6},Us={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},Pu={9728:Gt,9729:Vt,9984:Xu,9985:Ra,9986:mr,9987:gi},Lu={33071:Qn,33648:Ua,10497:Jn},il={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},nc={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},Di={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},ny={CUBICSPLINE:void 0,LINEAR:Pr,STEP:Cr},sl={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function iy(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new ki({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Bi})),s.DefaultMaterial}function Qi(s,e,t){for(const n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Yn(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function sy(s,e,t){let n=!1,i=!1,r=!1;for(let c=0,h=e.length;c<h;c++){const f=e[c];if(f.POSITION!==void 0&&(n=!0),f.NORMAL!==void 0&&(i=!0),f.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);const a=[],o=[],l=[];for(let c=0,h=e.length;c<h;c++){const f=e[c];if(n){const u=f.POSITION!==void 0?t.getDependency("accessor",f.POSITION):s.attributes.position;a.push(u)}if(i){const u=f.NORMAL!==void 0?t.getDependency("accessor",f.NORMAL):s.attributes.normal;o.push(u)}if(r){const u=f.COLOR_0!==void 0?t.getDependency("accessor",f.COLOR_0):s.attributes.color;l.push(u)}}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l)]).then(function(c){const h=c[0],f=c[1],u=c[2];return n&&(s.morphAttributes.position=h),i&&(s.morphAttributes.normal=f),r&&(s.morphAttributes.color=u),s.morphTargetsRelative=!0,s})}function ry(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){const t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function ay(s){let e;const t=s.extensions&&s.extensions[ut.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+rl(t.attributes):e=s.indices+":"+rl(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+rl(s.targets[n]);return e}function rl(s){let e="";const t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function ic(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function oy(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}const ly=new at;class cy{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new IM,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,a=-1;if(typeof navigator<"u"&&typeof navigator.userAgent<"u"){const o=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(o)===!0;const l=o.match(/Version\/(\d+)/);i=n&&l?parseInt(l[1],10):-1,r=o.indexOf("Firefox")>-1,a=r?o.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&a<98?this.textureLoader=new Sf(this.options.manager):this.textureLoader=new Jm(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new yf(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){const n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(a){return a._markDefs&&a._markDefs()}),Promise.all(this._invokeAll(function(a){return a.beforeRoot&&a.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(a){const o={scene:a[0][i.scene||0],scenes:a[0],animations:a[1],cameras:a[2],asset:i.asset,parser:n,userData:{}};return Qi(r,o,i),Yn(o,i),Promise.all(n._invokeAll(function(l){return l.afterRoot&&l.afterRoot(o)})).then(function(){for(const l of o.scenes)l.updateMatrixWorld();e(o)})}).catch(t)}_markDefs(){const e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){const a=t[i].joints;for(let o=0,l=a.length;o<l;o++)e[a[o]].isBone=!0}for(let i=0,r=e.length;i<r;i++){const a=e[i];a.mesh!==void 0&&(this._addNodeRef(this.meshCache,a.mesh),a.skin!==void 0&&(n[a.mesh].isSkinnedMesh=!0)),a.camera!==void 0&&this._addNodeRef(this.cameraCache,a.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;const i=n.clone(),r=(a,o)=>{const l=this.associations.get(a);l!=null&&this.associations.set(o,l);for(const[c,h]of a.children.entries())r(h,o.children[c])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){const t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){const i=e(t[n]);if(i)return i}return null}_invokeAll(e){const t=Object.values(this.plugins);t.unshift(this);const n=[];for(let i=0;i<t.length;i++){const r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){const n=e+":"+t;let i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){const n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,a){return n.getDependency(e,a)})),this.cache.add(e,t)}return t}loadBuffer(e){const t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[ut.KHR_BINARY_GLTF].body);const i=this.options;return new Promise(function(r,a){n.load(Sr.resolveURL(t.uri,i.path),r,void 0,function(){a(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){const t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){const i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){const t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){const a=il[i.type],o=Us[i.componentType],l=i.normalized===!0,c=new o(i.count*a);return Promise.resolve(new Qt(c,a,l))}const r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(a){const o=a[0],l=il[i.type],c=Us[i.componentType],h=c.BYTES_PER_ELEMENT,f=h*l,u=i.byteOffset||0,d=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,p=i.normalized===!0;let v,g;if(d&&d!==f){const m=Math.floor(u/d),S="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+m+":"+i.count;let w=t.cache.get(S);w||(v=new c(o,m*d,i.count*d/h),w=new Pp(v,d/h),t.cache.add(S,w)),g=new yc(w,l,u%d/h,p)}else o===null?v=new c(i.count*l):v=new c(o,u,i.count*l),g=new Qt(v,l,p);if(i.sparse!==void 0){const m=il.SCALAR,S=Us[i.sparse.indices.componentType],w=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,E=new S(a[1],w,i.sparse.count*m),T=new c(a[2],y,i.sparse.count*l);o!==null&&(g=new Qt(g.array.slice(),g.itemSize,g.normalized)),g.normalized=!1;for(let R=0,x=E.length;R<x;R++){const A=E[R];if(g.setX(A,T[R*l]),l>=2&&g.setY(A,T[R*l+1]),l>=3&&g.setZ(A,T[R*l+2]),l>=4&&g.setW(A,T[R*l+3]),l>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}g.normalized=p}return g})}loadTexture(e){const t=this.json,n=this.options,r=t.textures[e].source,a=t.images[r];let o=this.textureLoader;if(a.uri){const l=n.manager.getHandler(a.uri);l!==null&&(o=l)}return this.loadTextureImage(e,r,o)}loadTextureImage(e,t,n){const i=this,r=this.json,a=r.textures[e],o=r.images[t],l=(o.uri||o.bufferView)+":"+a.sampler;if(this.textureCache[l])return this.textureCache[l];const c=this.loadImageSource(t,n).then(function(h){h.flipY=!1,h.name=a.name||o.name||"",h.name===""&&typeof o.uri=="string"&&o.uri.startsWith("data:image/")===!1&&(h.name=o.uri);const u=(r.samplers||{})[a.sampler]||{};return h.magFilter=Pu[u.magFilter]||Vt,h.minFilter=Pu[u.minFilter]||gi,h.wrapS=Lu[u.wrapS]||Jn,h.wrapT=Lu[u.wrapT]||Jn,h.generateMipmaps=!h.isCompressedTexture&&h.minFilter!==Gt&&h.minFilter!==Vt,i.associations.set(h,{textures:e}),h}).catch(function(){return null});return this.textureCache[l]=c,c}loadImageSource(e,t){const n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(f=>f.clone());const a=i.images[e],o=self.URL||self.webkitURL;let l=a.uri||"",c=!1;if(a.bufferView!==void 0)l=n.getDependency("bufferView",a.bufferView).then(function(f){c=!0;const u=new Blob([f],{type:a.mimeType});return l=o.createObjectURL(u),l});else if(a.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");const h=Promise.resolve(l).then(function(f){return new Promise(function(u,d){let p=u;t.isImageBitmapLoader===!0&&(p=function(v){const g=new Wt(v);g.needsUpdate=!0,u(g)}),t.load(Sr.resolveURL(f,r.path),p,void 0,d)})}).then(function(f){return c===!0&&o.revokeObjectURL(l),Yn(f,a),f.userData.mimeType=a.mimeType||oy(a.uri),f}).catch(function(f){throw console.error("THREE.GLTFLoader: Couldn't load texture",l),f});return this.sourceCache[e]=h,h}assignTexture(e,t,n,i){const r=this;return this.getDependency("texture",n.index).then(function(a){if(!a)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(a=a.clone(),a.channel=n.texCoord),r.extensions[ut.KHR_TEXTURE_TRANSFORM]){const o=n.extensions!==void 0?n.extensions[ut.KHR_TEXTURE_TRANSFORM]:void 0;if(o){const l=r.associations.get(a);a=r.extensions[ut.KHR_TEXTURE_TRANSFORM].extendTexture(a,o),r.associations.set(a,l)}}return i!==void 0&&(a.colorSpace=i),e[t]=a,a})}assignFinalMaterial(e){const t=e.geometry;let n=e.material;const i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,a=t.attributes.normal===void 0;if(e.isPoints){const o="PointsMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new wc,zn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,l.sizeAttenuation=!1,this.cache.add(o,l)),n=l}else if(e.isLine){const o="LineBasicMaterial:"+n.uuid;let l=this.cache.get(o);l||(l=new Tc,zn.prototype.copy.call(l,n),l.color.copy(n.color),l.map=n.map,this.cache.add(o,l)),n=l}if(i||r||a){let o="ClonedMaterial:"+n.uuid+":";i&&(o+="derivative-tangents:"),r&&(o+="vertex-colors:"),a&&(o+="flat-shading:");let l=this.cache.get(o);l||(l=n.clone(),r&&(l.vertexColors=!0),a&&(l.flatShading=!0),i&&(l.normalScale&&(l.normalScale.y*=-1),l.clearcoatNormalScale&&(l.clearcoatNormalScale.y*=-1)),this.cache.add(o,l),this.associations.set(l,this.associations.get(n))),n=l}e.material=n}getMaterialType(){return ki}loadMaterial(e){const t=this,n=this.json,i=this.extensions,r=n.materials[e];let a;const o={},l=r.extensions||{},c=[];if(l[ut.KHR_MATERIALS_UNLIT]){const f=i[ut.KHR_MATERIALS_UNLIT];a=f.getMaterialType(),c.push(f.extendParams(o,r,t))}else{const f=r.pbrMetallicRoughness||{};if(o.color=new Ye(1,1,1),o.opacity=1,Array.isArray(f.baseColorFactor)){const u=f.baseColorFactor;o.color.setRGB(u[0],u[1],u[2],yn),o.opacity=u[3]}f.baseColorTexture!==void 0&&c.push(t.assignTexture(o,"map",f.baseColorTexture,Rt)),o.metalness=f.metallicFactor!==void 0?f.metallicFactor:1,o.roughness=f.roughnessFactor!==void 0?f.roughnessFactor:1,f.metallicRoughnessTexture!==void 0&&(c.push(t.assignTexture(o,"metalnessMap",f.metallicRoughnessTexture)),c.push(t.assignTexture(o,"roughnessMap",f.metallicRoughnessTexture))),a=this._invokeOne(function(u){return u.getMaterialType&&u.getMaterialType(e)}),c.push(Promise.all(this._invokeAll(function(u){return u.extendMaterialParams&&u.extendMaterialParams(e,o)})))}r.doubleSided===!0&&(o.side=Jt);const h=r.alphaMode||sl.OPAQUE;if(h===sl.BLEND?(o.transparent=!0,o.depthWrite=!1):(o.transparent=!1,h===sl.MASK&&(o.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&a!==Pn&&(c.push(t.assignTexture(o,"normalMap",r.normalTexture)),o.normalScale=new ye(1,1),r.normalTexture.scale!==void 0)){const f=r.normalTexture.scale;o.normalScale.set(f,f)}if(r.occlusionTexture!==void 0&&a!==Pn&&(c.push(t.assignTexture(o,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(o.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&a!==Pn){const f=r.emissiveFactor;o.emissive=new Ye().setRGB(f[0],f[1],f[2],yn)}return r.emissiveTexture!==void 0&&a!==Pn&&c.push(t.assignTexture(o,"emissiveMap",r.emissiveTexture,Rt)),Promise.all(c).then(function(){const f=new a(o);return r.name&&(f.name=r.name),Yn(f,r),t.associations.set(f,{materials:e}),r.extensions&&Qi(i,f,r),f})}createUniqueName(e){const t=Mt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){const t=this,n=this.extensions,i=this.primitiveCache;function r(o){return n[ut.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(o,t).then(function(l){return Iu(l,o,t)})}const a=[];for(let o=0,l=e.length;o<l;o++){const c=e[o],h=ay(c),f=i[h];if(f)a.push(f.promise);else{let u;c.extensions&&c.extensions[ut.KHR_DRACO_MESH_COMPRESSION]?u=r(c):u=Iu(new Pt,c,t),c.mode===An.TRIANGLE_STRIP?u=u.then(d=>Au(d,Qu)):c.mode===An.TRIANGLE_FAN&&(u=u.then(d=>Au(d,ql))),i[h]={primitive:c,promise:u},a.push(u)}}return Promise.all(a)}loadMesh(e){const t=this,n=this.json,i=this.extensions,r=n.meshes[e],a=r.primitives,o=[];for(let l=0,c=a.length;l<c;l++){const h=a[l].material===void 0?iy(this.cache):this.getDependency("material",a[l].material);o.push(h)}return o.push(t.loadGeometries(a)),Promise.all(o).then(async function(l){const c=l.slice(0,l.length-1),h=l[l.length-1],f=[];for(let d=0,p=h.length;d<p;d++){const v=h[d],g=a[d];let m;const S=c[d];if(g.mode===An.TRIANGLES||g.mode===An.TRIANGLE_STRIP||g.mode===An.TRIANGLE_FAN||g.mode===void 0){const w=r.isSkinnedMesh===!0,y=v.hasAttribute("skinIndex")&&v.hasAttribute("skinWeight");w&&y===!1&&console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."),m=w&&y?new af(v,S):new _t(v,S),m.isSkinnedMesh===!0&&m.normalizeSkinWeights()}else if(g.mode===An.LINES)m=new kp(v,S);else if(g.mode===An.LINE_STRIP)m=new Qa(v,S);else if(g.mode===An.LINE_LOOP)m=new zp(v,S);else if(g.mode===An.POINTS)m=new of(v,S);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+g.mode);Object.keys(m.geometry.morphAttributes).length>0&&ry(m,r),m.name=t.createUniqueName(r.name||"mesh_"+e),Yn(m,r),g.extensions&&Qi(i,m,g),t.assignFinalMaterial(m),f.push(m)}for(let d=0,p=f.length;d<p;d++)t.associations.set(f[d],{meshes:e,primitives:d});if(f.length===1)return r.extensions&&Qi(i,f[0],r),f[0];const u=new an;r.extensions&&Qi(i,u,r),t.associations.set(u,{meshes:e});for(let d=0,p=f.length;d<p;d++)u.add(f[d]);return u})}loadCamera(e){let t;const n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new un(kt.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new to(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Yn(t,n),Promise.resolve(t)}loadSkin(e){const t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){const r=i.pop(),a=i,o=[],l=[];for(let c=0,h=a.length;c<h;c++){const f=a[c];if(f){o.push(f);const u=new at;r!==null&&u.fromArray(r.array,c*16),l.push(u)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[c])}return new Ja(o,l)})}loadAnimation(e){const t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,a=[],o=[],l=[],c=[],h=[];for(let f=0,u=i.channels.length;f<u;f++){const d=i.channels[f],p=i.samplers[d.sampler],v=d.target,g=v.node,m=i.parameters!==void 0?i.parameters[p.input]:p.input,S=i.parameters!==void 0?i.parameters[p.output]:p.output;v.node!==void 0&&(a.push(this.getDependency("node",g)),o.push(this.getDependency("accessor",m)),l.push(this.getDependency("accessor",S)),c.push(p),h.push(v))}return Promise.all([Promise.all(a),Promise.all(o),Promise.all(l),Promise.all(c),Promise.all(h)]).then(function(f){const u=f[0],d=f[1],p=f[2],v=f[3],g=f[4],m=[];for(let w=0,y=u.length;w<y;w++){const E=u[w],T=d[w],R=p[w],x=v[w],A=g[w];if(E===void 0)continue;E.updateMatrix&&E.updateMatrix();const D=n._createAnimationTracks(E,T,R,x,A);if(D)for(let z=0;z<D.length;z++)m.push(D[z])}const S=new km(r,void 0,m);return Yn(S,i),S})}createNodeMesh(e){const t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){const a=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&a.traverse(function(o){if(o.isMesh)for(let l=0,c=i.weights.length;l<c;l++)o.morphTargetInfluences[l]=i.weights[l]}),a})}loadNode(e){const t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),a=[],o=i.children||[];for(let c=0,h=o.length;c<h;c++)a.push(n.getDependency("node",o[c]));const l=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(a),l]).then(function(c){const h=c[0],f=c[1],u=c[2];u!==null&&h.traverse(function(d){d.isSkinnedMesh&&d.bind(u,ly)});for(let d=0,p=f.length;d<p;d++)h.add(f[d]);if(h.userData.pivot!==void 0&&f.length>0){const d=h.userData.pivot,p=f[0];h.pivot=new O().fromArray(d),h.position.x-=d[0],h.position.y-=d[1],h.position.z-=d[2],p.position.set(0,0,0),delete h.userData.pivot}return h})}_loadNodeShallow(e){const t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];const r=t.nodes[e],a=r.name?i.createUniqueName(r.name):"",o=[],l=i._invokeOne(function(c){return c.createNodeMesh&&c.createNodeMesh(e)});return l&&o.push(l),r.camera!==void 0&&o.push(i.getDependency("camera",r.camera).then(function(c){return i._getNodeRef(i.cameraCache,r.camera,c)})),i._invokeAll(function(c){return c.createNodeAttachment&&c.createNodeAttachment(e)}).forEach(function(c){o.push(c)}),this.nodeCache[e]=Promise.all(o).then(function(c){let h;if(r.isBone===!0?h=new Sc:c.length>1?h=new an:c.length===1?h=c[0]:h=new wt,h!==c[0])for(let f=0,u=c.length;f<u;f++)h.add(c[f]);if(r.name&&(h.userData.name=r.name,h.name=a),Yn(h,r),r.extensions&&Qi(n,h,r),r.matrix!==void 0){const f=new at;f.fromArray(r.matrix),h.applyMatrix4(f)}else r.translation!==void 0&&h.position.fromArray(r.translation),r.rotation!==void 0&&h.quaternion.fromArray(r.rotation),r.scale!==void 0&&h.scale.fromArray(r.scale);if(!i.associations.has(h))i.associations.set(h,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){const f=i.associations.get(h);i.associations.set(h,{...f})}return i.associations.get(h).nodes=e,h}),this.nodeCache[e]}loadScene(e){const t=this.extensions,n=this.json.scenes[e],i=this,r=new an;n.name&&(r.name=i.createUniqueName(n.name)),Yn(r,n),n.extensions&&Qi(t,r,n);const a=n.nodes||[],o=[];for(let l=0,c=a.length;l<c;l++)o.push(i.getDependency("node",a[l]));return Promise.all(o).then(function(l){for(let h=0,f=l.length;h<f;h++){const u=l[h];u.parent!==null?r.add(PM(u)):r.add(u)}const c=h=>{const f=new Map;for(const[u,d]of i.associations)(u instanceof zn||u instanceof Wt)&&f.set(u,d);return h.traverse(u=>{const d=i.associations.get(u);d!=null&&f.set(u,d)}),f};return i.associations=c(r),r})}_createAnimationTracks(e,t,n,i,r){const a=[],o=e.name?e.name:e.uuid,l=[];function c(d){d.morphTargetInfluences&&l.push(d.name?d.name:d.uuid)}Di[r.path]===Di.weights?(c(e),e.isGroup&&e.children.forEach(c)):l.push(o);let h;switch(Di[r.path]){case Di.weights:h=Br;break;case Di.rotation:h=kr;break;case Di.translation:case Di.scale:h=Wa;break;default:n.itemSize===1?h=Br:h=Wa;break}const f=i.interpolation!==void 0?ny[i.interpolation]:Pr,u=this._getArrayFromAccessor(n);for(let d=0,p=l.length;d<p;d++){const v=new h(l[d]+"."+Di[r.path],t.array,u,f);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(v),a.push(v)}return a}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){const n=ic(t.constructor),i=new Float32Array(t.length);for(let r=0,a=t.length;r<a;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){const i=this instanceof kr?ty:Uf;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}}function hy(s,e,t){const n=e.attributes,i=new Sn;if(n.POSITION!==void 0){const o=t.json.accessors[n.POSITION],l=o.min,c=o.max;if(l!==void 0&&c!==void 0){if(i.set(new O(l[0],l[1],l[2]),new O(c[0],c[1],c[2])),o.normalized){const h=ic(Us[o.componentType]);i.min.multiplyScalar(h),i.max.multiplyScalar(h)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;const r=e.targets;if(r!==void 0){const o=new O,l=new O;for(let c=0,h=r.length;c<h;c++){const f=r[c];if(f.POSITION!==void 0){const u=t.json.accessors[f.POSITION],d=u.min,p=u.max;if(d!==void 0&&p!==void 0){if(l.setX(Math.max(Math.abs(d[0]),Math.abs(p[0]))),l.setY(Math.max(Math.abs(d[1]),Math.abs(p[1]))),l.setZ(Math.max(Math.abs(d[2]),Math.abs(p[2]))),u.normalized){const v=ic(Us[u.componentType]);l.multiplyScalar(v)}o.max(l)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(o)}s.boundingBox=i;const a=new si;i.getCenter(a.center),a.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=a}function Iu(s,e,t){const n=e.attributes,i=[];function r(a,o){return t.getDependency("accessor",a).then(function(l){s.setAttribute(o,l)})}for(const a in n){const o=nc[a]||a.toLowerCase();o in s.attributes||i.push(r(n[a],o))}if(e.indices!==void 0&&!s.index){const a=t.getDependency("accessor",e.indices).then(function(o){s.setIndex(o)});i.push(a)}return ft.workingColorSpace!==yn&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ft.workingColorSpace}" not supported.`),Yn(s,e),hy(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?sy(s,e.targets,t):s})}const Of=new Map;let fr;function uy(s,e){const t=e.max.y-e.min.y,n=new O(-.015,e.min.y+t*.23,.06),i=new O;s.traverse(r=>{if(!r.isMesh)return;const a=r.geometry.clone(),o=a.attributes.position,l=r.matrixWorld.clone().invert();for(let c=0;c<o.count;c++){i.fromBufferAttribute(o,c).applyMatrix4(r.matrixWorld);const h=(i.y-e.min.y)/t,f=kt.smoothstep(h,.22,.29),u=kt.smoothstep(i.z,-.24,-.18),d=kt.smoothstep(h,.3,.37),p=f*Math.max(u,d);i.sub(n).multiplyScalar(1-.25*p).add(n).applyMatrix4(l),o.setXYZ(c,i.x,i.y,i.z)}a.computeBoundingBox(),a.computeBoundingSphere(),r.geometry=a})}function fy(s){const e=document.createElement("canvas");e.width=s.image.width,e.height=s.image.height;const t=e.getContext("2d",{willReadFrequently:!0});t.drawImage(s.image,0,0);const n=t.getImageData(0,0,e.width,e.height);for(let r=0;r<n.data.length;r+=4){const a=n.data,o=a[r]/255,l=a[r+1]/255,c=a[r+2]/255,h=Math.max(o,l,c),f=Math.min(o,l,c),u=h-f;if(h!==o||u<.001)continue;const d=(h+f)/2,p=u/(1-Math.abs(2*d-1)),v=((l-c)/u+(l<c?6:0))/6;if(v>=.118&&v<=.96||p<=.3||d<=.09||d>=.88)continue;const g=v<.055||v>.96?.625:.555,m=u*.83,S=d-m/2;a[r]=Math.round(S*255),a[r+1]=Math.round((S+m*(1-Math.abs(g*6%2-1)))*255),a[r+2]=Math.round((S+m)*255)}t.putImageData(n,0,0);const i=s.clone();return i.source=new gp(e),i.needsUpdate=!0,i}function dy(s=()=>{}){if(fr)return fr;const e=new LM;let t=0;return fr=Promise.all(["p","r","n","b","q","k"].map(async n=>{const{scene:i}=await e.loadAsync(`./models/optimized/${n}.glb`);i.name="CreatureBody",i.updateMatrixWorld(!0);const r=new Sn().setFromObject(i),a=r.getSize(new O),o=r.getCenter(new O),l=(n==="p"?.9:1.12)/Math.max(a.x,a.z);n==="p"&&uy(i,r);const c=new an;c.name="CreatureNormalization",c.scale.setScalar(l),c.position.set(-o.x*l,-r.min.y*l,-o.z*l),c.add(i);const h=new an;h.name=`Creature_${n}`,h.userData.originalSize=a.clone().multiplyScalar(l).toArray(),h.add(c);const f=h.clone(!0),u=new Map,d=new Map;f.getObjectByName("CreatureBody").traverse(p=>{if(!p.isMesh)return;const v=g=>{if(!u.has(g)){const m=g.clone();g.map&&!/ruby|glass|gold/i.test(g.name)&&(d.has(g.map)||d.set(g.map,fy(g.map)),m.map=d.get(g.map)),u.set(g,m)}return u.get(g)};p.material=Array.isArray(p.material)?p.material.map(v):v(p.material)});for(const[p,v]of[["w",h],["b",f]])v.traverse(g=>{g.isMesh&&(g.castShadow=!0,g.receiveShadow=!0)}),Of.set(`${n}_${p}`,v);s(++t,6)})).catch(n=>{throw fr=void 0,n}),fr}function Ea(s,e="w"){const t=`${s}_${e==="b"||e==="blue"?"b":"w"}`,n=Of.get(t);if(!n)throw new Error(`Creature ${t} is not loaded.`);const i=n.clone(!0);return i.userData={...i.userData,type:s,color:e},i}const py=s=>new O(s.charCodeAt(0)-97-3.5,0,3.5-(Number(s[1])-1));class my{constructor(e,t){this.container=e,this.onSelect=t,this.scene=new sf,this.scene.background=new Ye("#afdced"),this.scene.fog=new vc("#b9dfeb",28,85);const n=new Ds(95,64,32),i=n.attributes.uv;for(let u=0;u<i.count;u++)i.setY(u,.07+i.getY(u)*.68);const r=new Sf().load("./textures/sun-valley-panorama.png");r.colorSpace=Rt;const a=new _t(n,new Pn({map:r,side:on,fog:!1,depthWrite:!1,toneMapped:!1}));a.renderOrder=-100,this.scene.add(a),this.camera=new un(36,1,.1,140),this.renderer=new cM({antialias:!0,alpha:!1,powerPreference:"high-performance"}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Uu,this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,this.renderer.outputColorSpace=Rt,this.renderer.toneMapping=oc,this.renderer.toneMappingExposure=1.05;const o=new EM,l=new jl(this.renderer);this.environment=l.fromScene(o).texture,this.scene.environment=this.environment,this.scene.environmentIntensity=.55,o.dispose(),l.dispose(),e.append(this.renderer.domElement),this.renderer.domElement.setAttribute("aria-label","Dreidimensionale Schacharena. Figuren anklicken, Kamera durch Ziehen drehen. Alternativ Tastaturzüge im Spielmenü verwenden."),this.controls=new uM(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.enablePan=!1,this.controls.minDistance=7,this.controls.maxDistance=32,this.controls.minPolarAngle=.18,this.controls.maxPolarAngle=Math.PI/2-.11,this.scene.add(new qm("#e3f5ff","#6e835d",1.1));const c=new Jl("#fff1cc",2.6);c.position.set(-9,17,8),c.castShadow=!0,c.shadow.mapSize.set(2048,2048),Object.assign(c.shadow.camera,{left:-12,right:12,top:12,bottom:-12,near:1,far:45}),c.shadow.bias=-5e-4,c.shadow.normalBias=.035,this.scene.add(c);const h=new Jl("#b4e5ff",1);h.position.set(5,8,-10),this.scene.add(h),this.arena=wM(),this.scene.add(this.arena.group),this.pieces=new an,this.markers=new an,this.galleryGroup=new an,this.scene.add(this.pieces,this.markers,this.galleryGroup),this.raycaster=new cg,this.pointer=new ye,this.selected=null,this.resetCamera(),this.observer=new ResizeObserver(()=>this.resize()),this.observer.observe(e);let f=null;this.renderer.domElement.addEventListener("pointerdown",u=>{f={x:u.clientX,y:u.clientY}}),this.renderer.domElement.addEventListener("pointerup",u=>{f&&Math.hypot(u.clientX-f.x,u.clientY-f.y)<6&&!this.battle&&this.pick(u),f=null}),this.clock=new hg,this.renderer.setAnimationLoop(()=>this.frame())}async load(e=()=>{}){await dy(e),this.renderer.setAnimationLoop(null),this.resize(),this.battleCache=new Map;const t=()=>new Promise(o=>requestAnimationFrame(()=>setTimeout(o,0))),n=this.camera.position.clone(),i=this.controls.target.clone(),r=new an;this.scene.add(r);const a=["p","r","n","b","q","k"];for(const o of["w","b"])a.forEach((l,c)=>{const h=Ea(l,o);h.position.set((c-2.5)*1.25,0,o==="w"?1:-1),r.add(h)});try{e(6,6,"Die Arena erwacht …",42),await t(),await this.renderer.compileAsync(this.scene,this.camera),this.renderer.shadowMap.needsUpdate=!0,this.renderer.render(this.scene,this.camera),r.removeFromParent();let o=0;for(const h of["w","b"])for(const f of a){e(6,6,`Die Magie erwacht · ${++o} von 12 …`,45+(o-1)/12*50),await t();const u=CM({scene:this.scene,camera:this.camera,controls:this.controls,attacker:{type:f,color:h},defender:{type:"p",color:h==="w"?"b":"w"},createCreature:Ea,onProgress:d=>this.battle?.callbacks.progress?.(d),onDone:()=>this.endBattle()});this.battleCache.set(`${f}_${h}`,u),await u.warmup(this.renderer)}const l=this.renderer.getContext(),c=l.fenceSync(l.SYNC_GPU_COMMANDS_COMPLETE,0);if(c){l.flush();let h;do await t(),h=l.clientWaitSync(c,0,0);while(h===l.TIMEOUT_EXPIRED);if(l.deleteSync(c),h===l.WAIT_FAILED)throw new Error("GPU preparation failed")}this.prepared=!0,e(6,6,"Bereit für dein Abenteuer!",100)}finally{r.removeFromParent(),this.arena.group.visible=!0;for(const o of this.battleCache.values())o.hide();this.camera.position.copy(n),this.controls.target.copy(i),this.controls.update(),this.renderer.shadowMap.needsUpdate=!0,this.renderer.setAnimationLoop(()=>this.frame())}}resize(){const{width:e,height:t}=this.container.getBoundingClientRect();this.renderer.setSize(e,t,!1),this.camera.aspect=e/Math.max(t,1);const n=kt.lerp(20,18,kt.clamp((this.camera.aspect-1)*4,0,1));this.camera.fov=kt.radToDeg(2*Math.atan(Math.tan(kt.degToRad(n))/Math.min(this.camera.aspect,1))),this.camera.updateProjectionMatrix()}resetCamera(){this.camera.position.set(0,12.2,8.5),this.controls.target.set(0,.3,.65),this.controls.update()}clearGroup(e){for(const t of[...e.children])e.remove(t)}setBoard(e){this.boardGame=e,this.clearGroup(this.pieces),e.board().flat().filter(Boolean).forEach(t=>{const n=Ea(t.type,t.color);n.position.copy(this.positionForSquare(t.square)),n.rotation.y=(t.color==="w"?Math.PI:0)+(this.flipped?Math.PI:0),n.userData.square=t.square,n.userData.color=t.color,n.userData.type=t.type,this.pieces.add(n)}),this.renderer.shadowMap.needsUpdate=!0}positionForSquare(e){return py(e).multiplyScalar(this.flipped?-1:1)}flipBoard(){this.flipped=!this.flipped,this.arena.setBoardOrientation(this.flipped);for(const e of this.arena.tiles){e.userData.originalSquare??=e.userData.square;const t=e.userData.originalSquare;e.userData.square=this.flipped?String.fromCharCode(104-(t.charCodeAt(0)-97))+(9-Number(t[1])):t}this.boardGame&&this.setBoard(this.boardGame)}highlight(e,t=[],n=null){for(const r of this.markers.children)r.geometry.dispose(),r.material.dispose();this.markers.clear();const i=(r,a,o,l)=>{const c=new _t(o?new Nc(.33,.43,40):new Ac(.13,24),new Pn({color:a,transparent:!0,opacity:l,depthWrite:!1,side:Jt}));c.rotation.x=-Math.PI/2,c.position.copy(this.positionForSquare(r)),c.position.y=.025,this.markers.add(c)};n&&(i(n.from,"#f8cd68",!0,.65),i(n.to,"#f8cd68",!0,.65)),e&&i(e,"#fff3a0",!0,1),t.forEach(r=>i(r.to,r.captured?"#fa7550":"#4aadd5",!!r.captured,.9)),this.selected=e,this.renderer.shadowMap.needsUpdate=!0}pick(e){const t=this.renderer.domElement.getBoundingClientRect();if(this.pointer.set((e.clientX-t.left)/t.width*2-1,-(e.clientY-t.top)/t.height*2+1),this.raycaster.setFromCamera(this.pointer,this.camera),this.gallery){const r=this.raycaster.intersectObjects(this.galleryGroup.children,!0)[0];if(r){let a=r.object;for(;a.parent!==this.galleryGroup;)a=a.parent;this.onSelect(null,a.userData.type)}return}const n=this.raycaster.intersectObjects([...this.pieces.children,...this.arena.tiles],!0)[0];if(!n)return;let i=n.object;for(;i&&!i.userData.square;)i=i.parent;i&&this.onSelect(i.userData.square)}setGallery(e,t="w"){this.gallery=e,this.pieces.visible=!e,this.markers.visible=!e,this.clearGroup(this.galleryGroup),e?(["p","r","n","b","q","k"].forEach((n,i)=>{const r=Ea(n,t);r.position.set((i-2.5)*1.5,0,0),r.scale.setScalar(1.45),r.userData.type=n,this.galleryGroup.add(r)}),this.camera.position.set(5,5,16),this.controls.target.set(0,.65,0)):this.resetCamera(),this.controls.update(),this.renderer.shadowMap.needsUpdate=!0}playBattle(e,t,n={}){if(this.battle)return;const i=this.camera.position.clone(),r=this.controls.target.clone();this.controls.enabled=!1,this.renderer.shadowMap.autoUpdate=!0;const a=this.battleCache.get(`${e.type}_${e.color}`);if(!a)throw new Error("Battle was not prepared during loading");a.reset(t),this.battle={elapsed:0,lastFrame:null,cinematic:a,cameraStart:i,targetStart:r,callbacks:n}}endBattle(){const e=this.battle;e&&(this.battle=null,e.cinematic.hide(),this.pieces.visible=!0,this.markers.visible=!0,this.camera.position.copy(e.cameraStart),this.controls.target.copy(e.targetStart),this.controls.enabled=!0,this.controls.update(),this.renderer.shadowMap.autoUpdate=!1,this.renderer.shadowMap.needsUpdate=!0,e.callbacks.done?.())}updateBattle(){const e=this.battle,t=performance.now();e.lastFrame!==null&&(e.elapsed+=Math.min((t-e.lastFrame)/1e3,.1)),e.lastFrame=t;const n=e.elapsed;n>=.5&&(this.pieces.visible=!1,this.markers.visible=!1),e.cinematic.update(n)}frame(){const e=this.clock.getElapsedTime();if(this.arena.update?.(e),this.battle)this.updateBattle();else{this.controls.update();for(const t of this.pieces.children)t.position.y=t.userData.square===this.selected?.055+Math.sin(e*3)*.025:0;this.galleryGroup.children.forEach((t,n)=>{t.rotation.y=Math.sin(e*.45+n*.25)*.18})}this.renderer.render(this.scene,this.camera)}}const mi={p:{name:"Knosp",role:"Bauer",icon:"♟",power:"Blätterwirbel",hint:"Ein Feld vorwärts. Beim ersten Zug auch zwei. Ich schlage ein Feld schräg nach vorne."},r:{name:"Granit",role:"Turm",icon:"♜",power:"Felsenwelle",hint:"Geradeaus in alle vier Richtungen, so weit der Weg frei ist."},n:{name:"Voltana",role:"Springer",icon:"♞",power:"Donnersprung",hint:"Zwei Felder gerade, eines zur Seite. Als einzige Figur darf ich über andere springen!"},b:{name:"Flori",role:"Läufer",icon:"♝",power:"Blütenzauber",hint:"Schräg in alle vier Richtungen, so weit der Weg frei ist."},q:{name:"Solara",role:"Königin",icon:"♛",power:"Sonnenmagie",hint:"Gerade und schräg in alle Richtungen. Ich verbinde die Kräfte von Turm und Läufer."},k:{name:"Aureon",role:"König",icon:"♚",power:"Königsbrüllen",hint:"Ein Feld in jede Richtung. Beschütze mich: Ich darf nicht auf ein bedrohtes Feld ziehen."}},br=s=>s==="w"?"Sonnenteam":"Mondteam",be=s=>document.querySelector(s),ht=new hd;let mn,sn=null,rn=!1,gn=!1,Nn=!1,qa=0,Ff,zr=null,Hn=!1,pn="ai",As=!1,$n,Er=null,gy=0;const _y=Array.from({length:64},(s,e)=>"abcdefgh"[e%8]+(8-Math.floor(e/8))),Nu=_y.map(s=>`<option>${s}</option>`).join("");be("#app").innerHTML=`
  <main class="game-shell">
    <div id="scene" class="scene"></div>
    <header class="masthead">
      <button id="sound" class="icon-button" aria-pressed="false" title="Ton einschalten">♪ <span>Ton aus</span></button>
    </header>
    <button id="menu-toggle" class="menu-toggle" aria-expanded="false" aria-controls="game-menu">☰ Menü</button>
    <aside id="game-menu" class="panel" hidden>
      <button id="menu-close" class="menu-close" aria-label="Menü schließen">×</button>
      <div class="eyebrow">KLEINE FIGUREN. GROSSE ABENTEUER.</div>
      <h1>Dein nächster<br> Zug wird <em>episch.</em></h1>
      <p class="intro">Sechs magische Gefährten.<br>Ein königliches Abenteuer.</p>
      <div class="mode-field"><label for="mode">WER SPIELT?</label><select id="mode"><option value="human">Mensch gegen Mensch</option><option value="ai">Mensch gegen Computer</option><option value="auto">Computer gegen Computer</option></select></div>
      <div id="ai-settings" class="ai-settings" hidden><label for="difficulty">Computer-Stärke</label><select id="difficulty"><option value="easy">Entspannt</option><option value="smart">Vorausschauend</option></select></div>
      <div class="turn-card" aria-live="polite"><span id="team-emblem" class="team-emblem">☀</span><div><span id="turn-caption">BEREIT FÜR DEIN ABENTEUER</span><strong id="status">Die Arena erwacht …</strong></div></div>
      <div class="actions"><button id="new-game" class="primary" disabled>Neue Partie <span>↗</span></button><button id="pause" class="secondary" hidden>Pausieren</button><button id="undo" class="secondary" disabled title="Letzten Zug zurücknehmen">↶</button></div>
      <div class="divider"></div>
      <div class="guide-heading"><span class="eyebrow">DEIN TEAM KENNENLERNEN</span><span class="small-star">✧</span></div>
      <div class="roster">${Object.entries(mi).map(([s,e])=>`<button class="roster-button" data-type="${s}" aria-label="${e.name}, ${e.role} ansehen"><span>${e.icon}</span><small>${e.role}</small></button>`).join("")}</div>
      <div id="creature-info" class="creature-info"><strong>Tippe auf einen Gefährten</strong><p>Wähle eine Figur auf dem Brett. Die Punkte zeigen, wohin sie ziehen darf.</p></div>
      <button id="gallery" class="text-button">Alle Figuren in 3D ansehen <span>→</span></button>
      <details class="more"><summary>Spieloptionen & Zugliste</summary><div class="more-body"><label class="check"><input id="cinematics" type="checkbox" checked> 10-Sekunden-Kämpfe</label><p class="fineprint">Der Angreifer gewinnt den Kampf. Es gelten die normalen Schachregeln.</p><div id="history" class="history">Noch keine Züge.</div><form id="move-form"><label>Tastaturzug</label><div class="coordinate-move"><select id="from" aria-label="Startfeld">${Nu}</select><span>→</span><select id="to" aria-label="Zielfeld">${Nu}</select><button type="submit" title="Zug spielen">✓</button></div></form></div></details>
    </aside>
    <nav class="view-tools" aria-label="Kamera"><button id="camera-reset" title="Brettansicht zurücksetzen">⌖ <span>Brettansicht</span></button><button id="flip" title="Andere Brettseite ansehen">↻ <span>Seite wechseln</span></button></nav>
    <div id="bottom-bar" class="bottom-bar"><div class="arena-note"><span>✦</span><div><strong>Das Sonnental</strong><small>Ziehen zum Drehen · Scrollen zum Zoomen</small></div></div><button id="demo" class="demo" disabled><span class="play-icon">▶</span><span>Kampf erleben<small>10 Sekunden Magie</small></span></button></div>
    <div id="gallery-bar" class="gallery-bar" hidden><span>DEINE SECHS GEFÄHRTEN</span><button id="gallery-team">☾ Mondteam zeigen</button><button id="gallery-close">Zurück zum Brett ×</button></div>
    <div id="loading" class="loading">
      <img class="loading-backdrop" src="./textures/loading-adventure.webp" alt="" aria-hidden="true">
      <img class="loading-art" src="./textures/loading-adventure.webp" alt="Unsere sechs Monstergefährten vor der sonnigen Schacharena" fetchpriority="high">
      <strong class="loading-title">Monster<span>Schach</span></strong>
      <div class="loading-status"><span id="loading-message" role="status">Die Gefährten machen sich bereit …</span><progress id="loading-progress" max="100" value="0" aria-label="Spiel wird vorbereitet"></progress><small>Dein nächster Zug wird ein Abenteuer.</small></div>
    </div>
    <div id="toast" class="toast" role="status" hidden></div>
    <section id="battle-ui" class="battle-ui" aria-label="Kampfsequenz" hidden><div class="letterbox top"></div><div class="battle-names"><div><small id="attacker-team"></small><strong id="attacker-name"></strong></div><span>VS</span><div><small id="defender-team"></small><strong id="defender-name"></strong></div></div><div class="battle-caption"><span id="battle-phase">DAS DUELL BEGINNT</span><h2 id="battle-title">Bereit?</h2></div><button id="skip" class="skip">Überspringen →</button><div class="battle-progress"><div id="battle-progress-fill"></div></div><div class="letterbox bottom"></div></section>
    <dialog id="promotion"><h2>Dein Gefährte entwickelt sich!</h2><p>Welche Figur soll aus deinem Bauern werden?</p><div class="promotion-options">${["q","r","b","n"].map(s=>`<button data-promote="${s}"><span>${mi[s].icon}</span>${mi[s].role}</button>`).join("")}</div></dialog>
    <dialog id="restart"><h2>Ein neues Abenteuer?</h2><p>Die aktuelle Partie wird dadurch beendet.</p><div class="dialog-actions"><button id="cancel-restart" class="secondary">Weiterspielen</button><button id="confirm-restart" class="primary">Neu starten</button></div></dialog>
  </main>`;function so(s){be("#game-menu").hidden=!s,be("#menu-toggle").setAttribute("aria-expanded",String(s)),s?be("#menu-close").focus():be("#menu-toggle").focus()}be("#menu-toggle").onclick=()=>so(be("#game-menu").hidden);be("#menu-close").onclick=()=>so(!1);document.addEventListener("keydown",s=>{s.key==="Escape"&&!be("#game-menu").hidden&&so(!1)});const zc=new Worker(new URL(""+new URL("ai-worker-BDsmJ42_.js",import.meta.url).href,import.meta.url),{type:"module"}),Hr=()=>pn==="auto"||pn==="ai"&&ht.turn()==="b";function as(){clearTimeout(Ff),qa++}function zi(s){be("#toast").textContent=s,be("#toast").hidden=!1,clearTimeout(zi.timer),zi.timer=setTimeout(()=>{be("#toast").hidden=!0},3500)}function Hc(s=440,e=.13,t="sine"){if(As)try{$n??=new AudioContext,$n.resume();const n=$n.createOscillator(),i=$n.createGain();n.type=t,n.frequency.setValueAtTime(s,$n.currentTime),n.frequency.exponentialRampToValueAtTime(s*.55,$n.currentTime+e),i.gain.setValueAtTime(.055,$n.currentTime),i.gain.exponentialRampToValueAtTime(.001,$n.currentTime+e),n.connect(i).connect($n.destination),n.start(),n.stop($n.currentTime+e)}catch{}}function sc(s){const e=mi[s];be("#creature-info").innerHTML=`<strong>${e.name} <span>· ${e.role}</span></strong><p>${e.hint}</p>`,document.querySelectorAll(".roster-button").forEach(t=>t.classList.toggle("active",t.dataset.type===s))}function bn(){const s=ht.turn();let e=`${br(s)} am Zug`;ht.isCheckmate()?e=`${br(s==="w"?"b":"w")} gewinnt!`:ht.isStalemate()?e="Patt – unentschieden!":ht.isDraw()?e="Remis – unentschieden!":ht.isCheck()&&(e=`${br(s)} steht im Schach!`),be("#status").textContent=gn&&!ht.isGameOver()?"Partie pausiert":e,be("#menu-toggle").title=be("#status").textContent,be(".arena-note strong").textContent=be("#status").textContent,be("#turn-caption").textContent=ht.isGameOver()?"GUT GESPIELT!":`ZUG ${Math.floor(ht.history().length/2)+1} · ${Hr()?"COMPUTER":"MENSCH"}`,be("#team-emblem").textContent=s==="w"?"☀":"☾",be("#team-emblem").classList.toggle("moon",s==="b"),be("#pause").hidden=pn!=="auto",be("#pause").textContent=gn?"Fortsetzen":"Pausieren",be("#undo").disabled=!ht.history().length||rn||Nn,be("#demo").disabled=rn||Nn||!Hn,be("#new-game").disabled=rn||!Hn,be("#mode").disabled=rn,be("#gallery").disabled=rn||!Hn;const t=ht.history();be("#history").textContent=t.length?t.map((n,i)=>`${i%2===0?`${Math.floor(i/2)+1}. `:""}${n}`).join(" "):"Noch keine Züge.",mn?.highlight(sn,sn?ht.moves({square:sn,verbose:!0}):[],zr)}function Hi(){try{localStorage.setItem("monster-schach-v1",JSON.stringify({pgn:ht.pgn(),mode:pn,difficulty:be("#difficulty").value,cinematics:be("#cinematics").checked}))}catch{}}function Vn(){if(as(),!Hn||rn||gn||Nn||ht.isGameOver()||!Hr())return;const s=qa;Ff=setTimeout(()=>{s===qa&&(be("#turn-caption").textContent="COMPUTER ÜBERLEGT …",zc.postMessage({id:s,fen:ht.fen(),difficulty:be("#difficulty").value}))},pn==="auto"?1100:550)}zc.onmessage=({data:s})=>{if(!(s.id!==qa||gn||rn||Nn||!Hr())){if(s.error){gn=!0,bn(),zi("Der Computer konnte keinen Zug berechnen. Bitte die Partie fortsetzen.");return}s.move&&Gc(s.move)}};zc.onerror=()=>{gn=!0,bn(),zi("Computer konnte nicht geladen werden. Mensch gegen Mensch bleibt verfügbar.")};function Bf(s,e){if(e){sc(e);return}if(!Hn||rn||Nn||gn||ht.isGameOver())return;const t=ht.get(s);if(t&&sc(t.type),Hr()){zi("Der Computer ist am Zug.");return}const n=sn?ht.moves({square:sn,verbose:!0}).filter(i=>i.to===s):[];if(n.length){n.some(i=>i.promotion)?(Er={from:sn,to:s},be("#promotion").showModal()):Gc({from:sn,to:s});return}t?.color===ht.turn()?(sn=sn===s?null:s,be("#from").value=s):(sn&&zi("Dorthin kann diese Figur nicht ziehen. Wähle ein markiertes Feld."),sn=null),bn()}function Gc(s){const e=ht.get(s.from);let t;try{t=ht.move(s)}catch{zi("Dieser Zug ist nicht erlaubt.");return}sn=null,zr=t,as(),Hi(),t.captured&&be("#cinematics").checked?kf(e,{type:t.captured,color:e.color==="w"?"b":"w"},!1):(mn.setBoard(ht),Hc(520),bn(),Hi(),Vn())}function kf(s,e,t){rn=!0,as(),bn(),be("#battle-ui").hidden=!1,be(".game-shell").classList.add("in-battle"),be("#attacker-name").textContent=mi[s.type].name,be("#defender-name").textContent=mi[e.type].name,be("#attacker-team").textContent=br(s.color),be("#defender-team").textContent=br(e.color);let n=-1;mn.playBattle(s,e,{progress(i){be("#battle-progress-fill").style.width=`${i*10}%`;const r=i<1.6?0:i<3.8?1:i<5.65?2:i<7?3:i<8.6?4:5;if(r===n)return;n=r;const a=[["DAS DUELL BEGINNT","Kräfte sammeln"],["DIE MAGIE ERWACHT",mi[s.type].power],["VOLLER EINSATZ","Los geht’s!"],["VOLLTREFFER",mi[s.type].power+"!"],["DIE ENTSCHEIDUNG","Magisch gespielt!"],["STARK GESPIELT",mi[s.type].name+" gewinnt!"]];be("#battle-phase").textContent=a[r][0],be("#battle-title").textContent=a[r][1],Hc([220,420,160,300,120,660][r],r===2||r===4?.6:.23,r===2?"triangle":"sine")},done(){rn=!1,be("#battle-ui").hidden=!0,be(".game-shell").classList.remove("in-battle"),t||(mn.setBoard(ht),Hi()),bn(),Vn()}}),be("#skip").focus()}function ro(s){rn||!Hn||(Nn=s,as(),mn.setGallery(s,"w"),s&&so(!1),be("#gallery-bar").hidden=!s,be("#bottom-bar").hidden=s,be("#gallery-team").dataset.color="w",be("#gallery-team").textContent="☾ Mondteam zeigen",be("#gallery").textContent=s?"Zurück zur Partie →":"Alle Figuren in 3D ansehen →",bn(),s||Vn())}function zf(){as(),ht.reset(),sn=null,zr=null,gn=!1,Nn&&ro(!1),mn.setBoard(ht),bn(),Hi(),Vn()}be("#mode").addEventListener("change",()=>{pn=be("#mode").value,gn=!1,be("#ai-settings").hidden=pn==="human",sn=null,bn(),Hi(),Vn()});be("#difficulty").addEventListener("change",()=>{Hi(),Vn()});be("#cinematics").addEventListener("change",Hi);be("#new-game").onclick=()=>{ht.history().length?(as(),be("#restart").showModal()):zf()};be("#cancel-restart").onclick=()=>{be("#restart").close(),Vn()};be("#confirm-restart").onclick=()=>{be("#restart").close(),zf()};be("#restart").addEventListener("cancel",Vn);be("#pause").onclick=()=>{gn=!gn,bn(),Vn()};be("#undo").onclick=()=>{rn||Nn||(as(),ht.undo(),pn==="ai"&&ht.turn()==="b"&&ht.history().length&&ht.undo(),pn==="auto"&&(gn=!0),sn=null,zr=ht.history({verbose:!0}).at(-1),mn.setBoard(ht),bn(),Hi(),Vn())};be("#sound").onclick=()=>{As=!As,be("#sound").setAttribute("aria-pressed",As),be("#sound").innerHTML=`♪ <span>Ton ${As?"an":"aus"}</span>`,be("#sound").title=As?"Ton ausschalten":"Ton einschalten",Hc(660)};be("#demo").onclick=()=>{const s=["q","n","r","b","p","k"];if(!rn&&Hn){const e=gy++;kf({type:s[e%6],color:"w"},{type:s[(e+2)%6],color:"b"},!0)}};be("#skip").onclick=()=>mn.endBattle();be("#gallery").onclick=()=>ro(!Nn);be("#gallery-close").onclick=()=>ro(!1);be("#gallery-team").onclick=()=>{const s=be("#gallery-team").dataset.color==="w"?"b":"w";be("#gallery-team").dataset.color=s,be("#gallery-team").textContent=s==="w"?"☾ Mondteam zeigen":"☀ Sonnenteam zeigen",mn.setGallery(!0,s)};be("#flip").onclick=()=>{!rn&&Hn&&!Nn&&(mn.flipBoard(),bn())};be("#camera-reset").onclick=()=>{!rn&&Hn&&mn.resetCamera()};document.querySelectorAll("[data-type]").forEach(s=>s.onclick=()=>{sc(s.dataset.type),Nn||ro(!0)});document.querySelectorAll("[data-promote]").forEach(s=>s.onclick=()=>{be("#promotion").close(),Er&&Gc({...Er,promotion:s.dataset.promote}),Er=null});be("#promotion").addEventListener("cancel",()=>{Er=null});be("#move-form").onsubmit=s=>{if(s.preventDefault(),!Hn||rn||Nn||gn||Hr()||ht.isGameOver())return;const e=be("#from").value,t=be("#to").value;if(!ht.moves({square:e,verbose:!0}).some(n=>n.to===t)){zi("Dieser Zug ist nicht erlaubt.");return}sn=e,Bf(t)};async function xy(){try{mn=new my(be("#scene"),Bf),await mn.load((s,e,t,n)=>{be("#loading-message").textContent=t||`${s} von ${e} Gefährten sind bereit …`,be("#loading-progress").value=n??Math.round(s/e*40)}),matchMedia("(prefers-reduced-motion: reduce)").matches&&(be("#cinematics").checked=!1);try{const s=JSON.parse(localStorage.getItem("monster-schach-v1"));s&&(s.pgn&&ht.loadPgn(s.pgn),pn=["human","ai","auto"].includes(s.mode)?s.mode:"human",be("#mode").value=pn,be("#difficulty").value=s.difficulty==="smart"?"smart":"easy",be("#cinematics").checked=s.cinematics!==!1,gn=pn==="auto",zr=ht.history({verbose:!0}).at(-1))}catch{ht.reset()}be("#mode").value=pn,be("#ai-settings").hidden=pn==="human",Hn=!0,mn.setBoard(ht),be("#loading").hidden=!0,bn(),Vn(),document.documentElement.dataset.ready="true"}catch(s){console.error(s),be("#loading").innerHTML='<strong>Die Arena konnte nicht geladen werden.</strong><span>Bitte die Seite neu laden. Das Spiel benötigt einen Browser mit WebGL2.</span><button onclick="location.reload()">Erneut versuchen</button>'}}xy();
