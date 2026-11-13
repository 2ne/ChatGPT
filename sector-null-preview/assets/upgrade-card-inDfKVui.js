(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const oa="160",gl=0,ba=1,_l=2,mc=1,vl=2,Je=3,bn=0,Ce=1,je=2,yn=0,mi=1,_i=2,Aa=3,wa=4,xl=5,In=100,Ml=101,Sl=102,Ra=103,Ca=104,yl=200,El=201,Tl=202,bl=203,Ws=204,Xs=205,Al=206,wl=207,Rl=208,Cl=209,Pl=210,Ll=211,Dl=212,Ul=213,Il=214,Nl=0,Fl=1,Ol=2,Or=3,Bl=4,zl=5,Gl=6,Hl=7,gc=0,Vl=1,kl=2,En=0,Wl=1,Xl=2,ql=3,Yl=4,$l=5,Zl=6,_c=300,vi=301,xi=302,qs=303,Ys=304,Xr=306,$s=1e3,qe=1001,Zs=1002,Re=1003,Pa=1004,rs=1005,ze=1006,Jl=1007,Wi=1008,Tn=1009,Kl=1010,jl=1011,ca=1012,vc=1013,xn=1014,Mn=1015,Xi=1016,xc=1017,Mc=1018,Fn=1020,Ql=1021,Ye=1023,th=1024,eh=1025,On=1026,Mi=1027,nh=1028,Sc=1029,ih=1030,yc=1031,Ec=1033,ss=33776,as=33777,os=33778,cs=33779,La=35840,Da=35841,Ua=35842,Ia=35843,Tc=36196,Na=37492,Fa=37496,Oa=37808,Ba=37809,za=37810,Ga=37811,Ha=37812,Va=37813,ka=37814,Wa=37815,Xa=37816,qa=37817,Ya=37818,$a=37819,Za=37820,Ja=37821,ls=36492,Ka=36494,ja=36495,rh=36283,Qa=36284,to=36285,eo=36286,bc=3e3,Bn=3001,sh=3200,ah=3201,Ac=0,oh=1,Ne="",ge="srgb",fn="srgb-linear",la="display-p3",qr="display-p3-linear",Br="linear",ee="srgb",zr="rec709",Gr="p3",Wn=7680,no=519,ch=512,lh=513,hh=514,wc=515,uh=516,fh=517,dh=518,ph=519,Js=35044,io="300 es",Ks=1035,hn=2e3,Hr=2001;class yi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,t);t.target=null}}}const Me=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ro=1234567;const Oi=Math.PI/180,qi=180/Math.PI;function tn(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Me[i&255]+Me[i>>8&255]+Me[i>>16&255]+Me[i>>24&255]+"-"+Me[t&255]+Me[t>>8&255]+"-"+Me[t>>16&15|64]+Me[t>>24&255]+"-"+Me[e&63|128]+Me[e>>8&255]+"-"+Me[e>>16&255]+Me[e>>24&255]+Me[n&255]+Me[n>>8&255]+Me[n>>16&255]+Me[n>>24&255]).toLowerCase()}function _e(i,t,e){return Math.max(t,Math.min(e,i))}function ha(i,t){return(i%t+t)%t}function mh(i,t,e,n,r){return n+(i-t)*(r-n)/(e-t)}function gh(i,t,e){return i!==t?(e-i)/(t-i):0}function Bi(i,t,e){return(1-e)*i+e*t}function _h(i,t,e,n){return Bi(i,t,1-Math.exp(-e*n))}function vh(i,t=1){return t-Math.abs(ha(i,t*2)-t)}function xh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Mh(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Sh(i,t){return i+Math.floor(Math.random()*(t-i+1))}function yh(i,t){return i+Math.random()*(t-i)}function Eh(i){return i*(.5-Math.random())}function Th(i){i!==void 0&&(ro=i);let t=ro+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function bh(i){return i*Oi}function Ah(i){return i*qi}function js(i){return(i&i-1)===0&&i!==0}function wh(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Vr(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Rh(i,t,e,n,r){const s=Math.cos,o=Math.sin,a=s(e/2),c=o(e/2),l=s((t+n)/2),h=o((t+n)/2),u=s((t-n)/2),d=o((t-n)/2),m=s((n-t)/2),g=o((n-t)/2);switch(r){case"XYX":i.set(a*h,c*u,c*d,a*l);break;case"YZY":i.set(c*d,a*h,c*u,a*l);break;case"ZXZ":i.set(c*u,c*d,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*m,a*l);break;case"YXY":i.set(c*m,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*m,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function Qe(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Yt(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Yg={DEG2RAD:Oi,RAD2DEG:qi,generateUUID:tn,clamp:_e,euclideanModulo:ha,mapLinear:mh,inverseLerp:gh,lerp:Bi,damp:_h,pingpong:vh,smoothstep:xh,smootherstep:Mh,randInt:Sh,randFloat:yh,randFloatSpread:Eh,seededRandom:Th,degToRad:bh,radToDeg:Ah,isPowerOfTwo:js,ceilPowerOfTwo:wh,floorPowerOfTwo:Vr,setQuaternionFromProperEuler:Rh,normalize:Yt,denormalize:Qe};class rt{constructor(t=0,e=0){rt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*r+t.x,this.y=s*r+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class kt{constructor(t,e,n,r,s,o,a,c,l){kt.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l)}set(t,e,n,r,s,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=r,h[2]=a,h[3]=e,h[4]=s,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],m=n[5],g=n[8],v=r[0],p=r[3],f=r[6],S=r[1],_=r[4],b=r[7],P=r[2],w=r[5],A=r[8];return s[0]=o*v+a*S+c*P,s[3]=o*p+a*_+c*w,s[6]=o*f+a*b+c*A,s[1]=l*v+h*S+u*P,s[4]=l*p+h*_+u*w,s[7]=l*f+h*b+u*A,s[2]=d*v+m*S+g*P,s[5]=d*p+m*_+g*w,s[8]=d*f+m*b+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*s*h+n*a*c+r*s*l-r*o*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*s,m=l*s-o*c,g=e*u+n*d+r*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const v=1/g;return t[0]=u*v,t[1]=(r*l-h*n)*v,t[2]=(a*n-r*o)*v,t[3]=d*v,t[4]=(h*e-r*c)*v,t[5]=(r*s-a*e)*v,t[6]=m*v,t[7]=(n*c-l*e)*v,t[8]=(o*e-n*s)*v,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,o,a){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-r*l,r*c,-r*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(hs.makeScale(t,e)),this}rotate(t){return this.premultiply(hs.makeRotation(-t)),this}translate(t,e){return this.premultiply(hs.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const hs=new kt;function Rc(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function kr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ch(){const i=kr("canvas");return i.style.display="block",i}const so={};function zi(i){i in so||(so[i]=!0,console.warn(i))}const ao=new kt().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),oo=new kt().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),nr={[fn]:{transfer:Br,primaries:zr,toReference:i=>i,fromReference:i=>i},[ge]:{transfer:ee,primaries:zr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[qr]:{transfer:Br,primaries:Gr,toReference:i=>i.applyMatrix3(oo),fromReference:i=>i.applyMatrix3(ao)},[la]:{transfer:ee,primaries:Gr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(oo),fromReference:i=>i.applyMatrix3(ao).convertLinearToSRGB()}},Ph=new Set([fn,qr]),$t={enabled:!0,_workingColorSpace:fn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Ph.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=nr[t].toReference,r=nr[e].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return nr[i].primaries},getTransfer:function(i){return i===Ne?Br:nr[i].transfer}};function gi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function us(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Xn;class Cc{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Xn===void 0&&(Xn=kr("canvas")),Xn.width=t.width,Xn.height=t.height;const n=Xn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Xn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=kr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=gi(s[o]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(gi(e[n]/255)*255):e[n]=gi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Lh=0;class Pc{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Lh++}),this.uuid=tn(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(fs(r[o].image)):s.push(fs(r[o]))}else s=fs(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function fs(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Cc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Dh=0;class Pe extends yi{constructor(t=Pe.DEFAULT_IMAGE,e=Pe.DEFAULT_MAPPING,n=qe,r=qe,s=ze,o=Wi,a=Ye,c=Tn,l=Pe.DEFAULT_ANISOTROPY,h=Ne){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Dh++}),this.uuid=tn(),this.name="",this.source=new Pc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new kt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof h=="string"?this.colorSpace=h:(zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=h===Bn?ge:Ne),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_c)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case $s:t.x=t.x-Math.floor(t.x);break;case qe:t.x=t.x<0?0:1;break;case Zs:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case $s:t.y=t.y-Math.floor(t.y);break;case qe:t.y=t.y<0?0:1;break;case Zs:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ge?Bn:bc}set encoding(t){zi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Bn?ge:Ne}}Pe.DEFAULT_IMAGE=null;Pe.DEFAULT_MAPPING=_c;Pe.DEFAULT_ANISOTROPY=1;class ne{constructor(t=0,e=0,n=0,r=1){ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*r+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*r+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*r+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*r+o[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],m=c[5],g=c[9],v=c[2],p=c[6],f=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-v)<.01&&Math.abs(g-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+v)<.1&&Math.abs(g+p)<.1&&Math.abs(l+m+f-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const _=(l+1)/2,b=(m+1)/2,P=(f+1)/2,w=(h+d)/4,A=(u+v)/4,U=(g+p)/4;return _>b&&_>P?_<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(_),r=w/n,s=A/n):b>P?b<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),n=w/r,s=U/r):P<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),n=A/s,r=U/s),this.set(n,r,s,e),this}let S=Math.sqrt((p-g)*(p-g)+(u-v)*(u-v)+(d-h)*(d-h));return Math.abs(S)<.001&&(S=1),this.x=(p-g)/S,this.y=(u-v)/S,this.z=(d-h)/S,this.w=Math.acos((l+m+f-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Uh extends yi{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ne(0,0,t,e),this.scissorTest=!1,this.viewport=new ne(0,0,t,e);const r={width:t,height:e,depth:1};n.encoding!==void 0&&(zi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Bn?ge:Ne),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ze,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Pe(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new Pc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class zn extends Uh{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Lc extends Pe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Re,this.minFilter=Re,this.wrapR=qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Ih extends Pe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=Re,this.minFilter=Re,this.wrapR=qe,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ji{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,o,a){let c=n[r+0],l=n[r+1],h=n[r+2],u=n[r+3];const d=s[o+0],m=s[o+1],g=s[o+2],v=s[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=m,t[e+2]=g,t[e+3]=v;return}if(u!==v||c!==d||l!==m||h!==g){let p=1-a;const f=c*d+l*m+h*g+u*v,S=f>=0?1:-1,_=1-f*f;if(_>Number.EPSILON){const P=Math.sqrt(_),w=Math.atan2(P,f*S);p=Math.sin(p*w)/P,a=Math.sin(a*w)/P}const b=a*S;if(c=c*p+d*b,l=l*p+m*b,h=h*p+g*b,u=u*p+v*b,p===1-a){const P=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=P,l*=P,h*=P,u*=P}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,r,s,o){const a=n[r],c=n[r+1],l=n[r+2],h=n[r+3],u=s[o],d=s[o+1],m=s[o+2],g=s[o+3];return t[e]=a*g+h*u+c*m-l*d,t[e+1]=c*g+h*d+l*u-a*m,t[e+2]=l*g+h*m+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(r/2),u=a(s/2),d=c(n/2),m=c(r/2),g=c(s/2);switch(o){case"XYZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"YXZ":this._x=d*h*u+l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"ZXY":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u-d*m*g;break;case"ZYX":this._x=d*h*u-l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u+d*m*g;break;case"YZX":this._x=d*h*u+l*m*g,this._y=l*m*u+d*h*g,this._z=l*h*g-d*m*u,this._w=l*h*u-d*m*g;break;case"XZY":this._x=d*h*u-l*m*g,this._y=l*m*u-d*h*g,this._z=l*h*g+d*m*u,this._w=l*h*u+d*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const m=.5/Math.sqrt(d+1);this._w=.25/m,this._x=(h-c)*m,this._y=(s-l)*m,this._z=(o-r)*m}else if(n>a&&n>u){const m=2*Math.sqrt(1+n-a-u);this._w=(h-c)/m,this._x=.25*m,this._y=(r+o)/m,this._z=(s+l)/m}else if(a>u){const m=2*Math.sqrt(1+a-n-u);this._w=(s-l)/m,this._x=(r+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+u-n-a);this._w=(o-r)/m,this._x=(s+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(_e(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+r*l-s*c,this._y=r*h+o*c+s*a-n*l,this._z=s*h+o*l+n*c-r*a,this._w=o*h-n*a-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,o=this._w;let a=o*t._w+n*t._x+r*t._y+s*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=r,this._z=s,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-e;return this._w=m*o+e*this._w,this._x=m*n+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=r*u+this._y*d,this._z=s*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(e*Math.cos(r),n*Math.sin(s),n*Math.cos(s),e*Math.sin(r))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class R{constructor(t=0,e=0,n=0){R.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(co.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(co.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*r-a*n),h=2*(a*e-s*r),u=2*(s*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-s*u,this.z=r+c*u+s*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,o=e.x,a=e.y,c=e.z;return this.x=r*c-s*a,this.y=s*o-n*c,this.z=n*a-r*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return ds.copy(this).projectOnVector(t),this.sub(ds)}reflect(t){return this.sub(ds.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(_e(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const ds=new R,co=new ji;class Vn{constructor(t=new R(1/0,1/0,1/0),e=new R(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(ke.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(ke.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=ke.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,ke):ke.fromBufferAttribute(s,o),ke.applyMatrix4(t.matrixWorld),this.expandByPoint(ke);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ir.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ir.copy(n.boundingBox)),ir.applyMatrix4(t.matrixWorld),this.union(ir)}const r=t.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,ke),ke.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(bi),rr.subVectors(this.max,bi),qn.subVectors(t.a,bi),Yn.subVectors(t.b,bi),$n.subVectors(t.c,bi),pn.subVectors(Yn,qn),mn.subVectors($n,Yn),Rn.subVectors(qn,$n);let e=[0,-pn.z,pn.y,0,-mn.z,mn.y,0,-Rn.z,Rn.y,pn.z,0,-pn.x,mn.z,0,-mn.x,Rn.z,0,-Rn.x,-pn.y,pn.x,0,-mn.y,mn.x,0,-Rn.y,Rn.x,0];return!ps(e,qn,Yn,$n,rr)||(e=[1,0,0,0,1,0,0,0,1],!ps(e,qn,Yn,$n,rr))?!1:(sr.crossVectors(pn,mn),e=[sr.x,sr.y,sr.z],ps(e,qn,Yn,$n,rr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,ke).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(ke).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(rn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),rn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),rn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),rn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),rn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),rn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),rn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),rn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(rn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const rn=[new R,new R,new R,new R,new R,new R,new R,new R],ke=new R,ir=new Vn,qn=new R,Yn=new R,$n=new R,pn=new R,mn=new R,Rn=new R,bi=new R,rr=new R,sr=new R,Cn=new R;function ps(i,t,e,n,r){for(let s=0,o=i.length-3;s<=o;s+=3){Cn.fromArray(i,s);const a=r.x*Math.abs(Cn.x)+r.y*Math.abs(Cn.y)+r.z*Math.abs(Cn.z),c=t.dot(Cn),l=e.dot(Cn),h=n.dot(Cn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Nh=new Vn,Ai=new R,ms=new R;class kn{constructor(t=new R,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):Nh.setFromPoints(t).getCenter(n);let r=0;for(let s=0,o=t.length;s<o;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Ai.subVectors(t,this.center);const e=Ai.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(Ai,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ms.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Ai.copy(t.center).add(ms)),this.expandByPoint(Ai.copy(t.center).sub(ms))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const sn=new R,gs=new R,ar=new R,gn=new R,_s=new R,or=new R,vs=new R;class Yr{constructor(t=new R,e=new R(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,sn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=sn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(sn.copy(this.origin).addScaledVector(this.direction,e),sn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){gs.copy(t).add(e).multiplyScalar(.5),ar.copy(e).sub(t).normalize(),gn.copy(this.origin).sub(gs);const s=t.distanceTo(e)*.5,o=-this.direction.dot(ar),a=gn.dot(this.direction),c=-gn.dot(ar),l=gn.lengthSq(),h=Math.abs(1-o*o);let u,d,m,g;if(h>0)if(u=o*c-a,d=o*a-c,g=s*h,u>=0)if(d>=-g)if(d<=g){const v=1/h;u*=v,d*=v,m=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=s,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d=-s,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*s+a)),d=u>0?-s:Math.min(Math.max(-s,-c),s),m=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-s,-c),s),m=d*(d+2*c)+l):(u=Math.max(0,-(o*s+a)),d=u>0?s:Math.min(Math.max(-s,-c),s),m=-u*u+d*(d+2*c)+l);else d=o>0?-s:s,u=Math.max(0,-(o*d+a)),m=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),r&&r.copy(gs).addScaledVector(ar,d),m}intersectSphere(t,e){sn.subVectors(t.center,this.origin);const n=sn.dot(this.direction),r=sn.dot(sn)-n*n,s=t.radius*t.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,r=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,r=(t.min.x-d.x)*l),h>=0?(s=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(s=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||s>r||((s>n||isNaN(n))&&(n=s),(o<r||isNaN(r))&&(r=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>r)||((a>n||n!==n)&&(n=a),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,sn)!==null}intersectTriangle(t,e,n,r,s){_s.subVectors(e,t),or.subVectors(n,t),vs.crossVectors(_s,or);let o=this.direction.dot(vs),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;gn.subVectors(this.origin,t);const c=a*this.direction.dot(or.crossVectors(gn,or));if(c<0)return null;const l=a*this.direction.dot(_s.cross(gn));if(l<0||c+l>o)return null;const h=-a*gn.dot(vs);return h<0?null:this.at(h/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Jt{constructor(t,e,n,r,s,o,a,c,l,h,u,d,m,g,v,p){Jt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,o,a,c,l,h,u,d,m,g,v,p)}set(t,e,n,r,s,o,a,c,l,h,u,d,m,g,v,p){const f=this.elements;return f[0]=t,f[4]=e,f[8]=n,f[12]=r,f[1]=s,f[5]=o,f[9]=a,f[13]=c,f[2]=l,f[6]=h,f[10]=u,f[14]=d,f[3]=m,f[7]=g,f[11]=v,f[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Jt().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/Zn.setFromMatrixColumn(t,0).length(),s=1/Zn.setFromMatrixColumn(t,1).length(),o=1/Zn.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(r),l=Math.sin(r),h=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const d=o*h,m=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=m+g*l,e[5]=d-v*l,e[9]=-a*c,e[2]=v-d*l,e[6]=g+m*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,m=c*u,g=l*h,v=l*u;e[0]=d+v*a,e[4]=g*a-m,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=m*a-g,e[6]=v+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,m=c*u,g=l*h,v=l*u;e[0]=d-v*a,e[4]=-o*u,e[8]=g+m*a,e[1]=m+g*a,e[5]=o*h,e[9]=v-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,m=o*u,g=a*h,v=a*u;e[0]=c*h,e[4]=g*l-m,e[8]=d*l+v,e[1]=c*u,e[5]=v*l+d,e[9]=m*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=v-d*u,e[8]=g*u+m,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=m*u+g,e[10]=d-v*u}else if(t.order==="XZY"){const d=o*c,m=o*l,g=a*c,v=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+v,e[5]=o*h,e[9]=m*u-g,e[2]=g*u-m,e[6]=a*h,e[10]=v*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fh,t,Oh)}lookAt(t,e,n){const r=this.elements;return De.subVectors(t,e),De.lengthSq()===0&&(De.z=1),De.normalize(),_n.crossVectors(n,De),_n.lengthSq()===0&&(Math.abs(n.z)===1?De.x+=1e-4:De.z+=1e-4,De.normalize(),_n.crossVectors(n,De)),_n.normalize(),cr.crossVectors(De,_n),r[0]=_n.x,r[4]=cr.x,r[8]=De.x,r[1]=_n.y,r[5]=cr.y,r[9]=De.y,r[2]=_n.z,r[6]=cr.z,r[10]=De.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],m=n[13],g=n[2],v=n[6],p=n[10],f=n[14],S=n[3],_=n[7],b=n[11],P=n[15],w=r[0],A=r[4],U=r[8],x=r[12],E=r[1],I=r[5],V=r[9],nt=r[13],D=r[2],O=r[6],H=r[10],$=r[14],X=r[3],W=r[7],Q=r[11],tt=r[15];return s[0]=o*w+a*E+c*D+l*X,s[4]=o*A+a*I+c*O+l*W,s[8]=o*U+a*V+c*H+l*Q,s[12]=o*x+a*nt+c*$+l*tt,s[1]=h*w+u*E+d*D+m*X,s[5]=h*A+u*I+d*O+m*W,s[9]=h*U+u*V+d*H+m*Q,s[13]=h*x+u*nt+d*$+m*tt,s[2]=g*w+v*E+p*D+f*X,s[6]=g*A+v*I+p*O+f*W,s[10]=g*U+v*V+p*H+f*Q,s[14]=g*x+v*nt+p*$+f*tt,s[3]=S*w+_*E+b*D+P*X,s[7]=S*A+_*I+b*O+P*W,s[11]=S*U+_*V+b*H+P*Q,s[15]=S*x+_*nt+b*$+P*tt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],m=t[14],g=t[3],v=t[7],p=t[11],f=t[15];return g*(+s*c*u-r*l*u-s*a*d+n*l*d+r*a*m-n*c*m)+v*(+e*c*m-e*l*d+s*o*d-r*o*m+r*l*h-s*c*h)+p*(+e*l*u-e*a*m-s*o*u+n*o*m+s*a*h-n*l*h)+f*(-r*a*h-e*c*u+e*a*d+r*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],m=t[11],g=t[12],v=t[13],p=t[14],f=t[15],S=u*p*l-v*d*l+v*c*m-a*p*m-u*c*f+a*d*f,_=g*d*l-h*p*l-g*c*m+o*p*m+h*c*f-o*d*f,b=h*v*l-g*u*l+g*a*m-o*v*m-h*a*f+o*u*f,P=g*u*c-h*v*c-g*a*d+o*v*d+h*a*p-o*u*p,w=e*S+n*_+r*b+s*P;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=S*A,t[1]=(v*d*s-u*p*s-v*r*m+n*p*m+u*r*f-n*d*f)*A,t[2]=(a*p*s-v*c*s+v*r*l-n*p*l-a*r*f+n*c*f)*A,t[3]=(u*c*s-a*d*s-u*r*l+n*d*l+a*r*m-n*c*m)*A,t[4]=_*A,t[5]=(h*p*s-g*d*s+g*r*m-e*p*m-h*r*f+e*d*f)*A,t[6]=(g*c*s-o*p*s-g*r*l+e*p*l+o*r*f-e*c*f)*A,t[7]=(o*d*s-h*c*s+h*r*l-e*d*l-o*r*m+e*c*m)*A,t[8]=b*A,t[9]=(g*u*s-h*v*s-g*n*m+e*v*m+h*n*f-e*u*f)*A,t[10]=(o*v*s-g*a*s+g*n*l-e*v*l-o*n*f+e*a*f)*A,t[11]=(h*a*s-o*u*s-h*n*l+e*u*l+o*n*m-e*a*m)*A,t[12]=P*A,t[13]=(h*v*r-g*u*r+g*n*d-e*v*d-h*n*p+e*u*p)*A,t[14]=(g*a*r-o*v*r-g*n*c+e*v*c+o*n*p-e*a*p)*A,t[15]=(o*u*r-h*a*r+h*n*c-e*u*c-o*n*d+e*a*d)*A,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,o=t.x,a=t.y,c=t.z,l=s*o,h=s*a;return this.set(l*o+n,l*a-r*c,l*c+r*a,0,l*a+r*c,h*a+n,h*c-r*o,0,l*c-r*a,h*c+r*o,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,o){return this.set(1,n,s,0,t,1,o,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,o=e._y,a=e._z,c=e._w,l=s+s,h=o+o,u=a+a,d=s*l,m=s*h,g=s*u,v=o*h,p=o*u,f=a*u,S=c*l,_=c*h,b=c*u,P=n.x,w=n.y,A=n.z;return r[0]=(1-(v+f))*P,r[1]=(m+b)*P,r[2]=(g-_)*P,r[3]=0,r[4]=(m-b)*w,r[5]=(1-(d+f))*w,r[6]=(p+S)*w,r[7]=0,r[8]=(g+_)*A,r[9]=(p-S)*A,r[10]=(1-(d+v))*A,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=Zn.set(r[0],r[1],r[2]).length();const o=Zn.set(r[4],r[5],r[6]).length(),a=Zn.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],We.copy(this);const l=1/s,h=1/o,u=1/a;return We.elements[0]*=l,We.elements[1]*=l,We.elements[2]*=l,We.elements[4]*=h,We.elements[5]*=h,We.elements[6]*=h,We.elements[8]*=u,We.elements[9]*=u,We.elements[10]*=u,e.setFromRotationMatrix(We),n.x=s,n.y=o,n.z=a,this}makePerspective(t,e,n,r,s,o,a=hn){const c=this.elements,l=2*s/(e-t),h=2*s/(n-r),u=(e+t)/(e-t),d=(n+r)/(n-r);let m,g;if(a===hn)m=-(o+s)/(o-s),g=-2*o*s/(o-s);else if(a===Hr)m=-o/(o-s),g=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,o,a=hn){const c=this.elements,l=1/(e-t),h=1/(n-r),u=1/(o-s),d=(e+t)*l,m=(n+r)*h;let g,v;if(a===hn)g=(o+s)*u,v=-2*u;else if(a===Hr)g=s*u,v=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=v,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const Zn=new R,We=new Jt,Fh=new R(0,0,0),Oh=new R(1,1,1),_n=new R,cr=new R,De=new R,lo=new Jt,ho=new ji;class $r{constructor(t=0,e=0,n=0,r=$r.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],o=r[4],a=r[8],c=r[1],l=r[5],h=r[9],u=r[2],d=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(_e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-_e(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(_e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-_e(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(_e(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-_e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return lo.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lo,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return ho.setFromEuler(this),this.setFromQuaternion(ho,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}$r.DEFAULT_ORDER="XYZ";class ua{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Bh=0;const uo=new R,Jn=new ji,an=new Jt,lr=new R,wi=new R,zh=new R,Gh=new ji,fo=new R(1,0,0),po=new R(0,1,0),mo=new R(0,0,1),Hh={type:"added"},Vh={type:"removed"};class ce extends yi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Bh++}),this.uuid=tn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=ce.DEFAULT_UP.clone();const t=new R,e=new $r,n=new ji,r=new R(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Jt},normalMatrix:{value:new kt}}),this.matrix=new Jt,this.matrixWorld=new Jt,this.matrixAutoUpdate=ce.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ua,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Jn.setFromAxisAngle(t,e),this.quaternion.multiply(Jn),this}rotateOnWorldAxis(t,e){return Jn.setFromAxisAngle(t,e),this.quaternion.premultiply(Jn),this}rotateX(t){return this.rotateOnAxis(fo,t)}rotateY(t){return this.rotateOnAxis(po,t)}rotateZ(t){return this.rotateOnAxis(mo,t)}translateOnAxis(t,e){return uo.copy(t).applyQuaternion(this.quaternion),this.position.add(uo.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(fo,t)}translateY(t){return this.translateOnAxis(po,t)}translateZ(t){return this.translateOnAxis(mo,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(an.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?lr.copy(t):lr.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),wi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?an.lookAt(wi,lr,this.up):an.lookAt(lr,wi,this.up),this.quaternion.setFromRotationMatrix(an),r&&(an.extractRotation(r.matrixWorld),Jn.setFromRotationMatrix(an),this.quaternion.premultiply(Jn.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Hh)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Vh)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),an.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),an.multiply(t.parent.matrixWorld)),t.applyMatrix4(an),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wi,t,zh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(wi,Gh,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++){const s=e[n];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++){const a=r[s];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];s(t.shapes,u)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(s(t.materials,this.material[c]));r.material=a}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];r.animations.push(s(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),m=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=r,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}ce.DEFAULT_UP=new R(0,1,0);ce.DEFAULT_MATRIX_AUTO_UPDATE=!0;ce.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Xe=new R,on=new R,xs=new R,cn=new R,Kn=new R,jn=new R,go=new R,Ms=new R,Ss=new R,ys=new R;let hr=!1;class Ge{constructor(t=new R,e=new R,n=new R){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),Xe.subVectors(t,e),r.cross(Xe);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){Xe.subVectors(r,e),on.subVectors(n,e),xs.subVectors(t,e);const o=Xe.dot(Xe),a=Xe.dot(on),c=Xe.dot(xs),l=on.dot(on),h=on.dot(xs),u=o*l-a*a;if(u===0)return s.set(0,0,0),null;const d=1/u,m=(l*c-a*h)*d,g=(o*h-a*c)*d;return s.set(1-m-g,g,m)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,cn)===null?!1:cn.x>=0&&cn.y>=0&&cn.x+cn.y<=1}static getUV(t,e,n,r,s,o,a,c){return hr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),hr=!0),this.getInterpolation(t,e,n,r,s,o,a,c)}static getInterpolation(t,e,n,r,s,o,a,c){return this.getBarycoord(t,e,n,r,cn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,cn.x),c.addScaledVector(o,cn.y),c.addScaledVector(a,cn.z),c)}static isFrontFacing(t,e,n,r){return Xe.subVectors(n,e),on.subVectors(t,e),Xe.cross(on).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Xe.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Xe.cross(on).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Ge.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Ge.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,r,s){return hr===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),hr=!0),Ge.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}getInterpolation(t,e,n,r,s){return Ge.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return Ge.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Ge.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let o,a;Kn.subVectors(r,n),jn.subVectors(s,n),Ms.subVectors(t,n);const c=Kn.dot(Ms),l=jn.dot(Ms);if(c<=0&&l<=0)return e.copy(n);Ss.subVectors(t,r);const h=Kn.dot(Ss),u=jn.dot(Ss);if(h>=0&&u<=h)return e.copy(r);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(Kn,o);ys.subVectors(t,s);const m=Kn.dot(ys),g=jn.dot(ys);if(g>=0&&m<=g)return e.copy(s);const v=m*l-c*g;if(v<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(jn,a);const p=h*g-m*u;if(p<=0&&u-h>=0&&m-g>=0)return go.subVectors(s,r),a=(u-h)/(u-h+(m-g)),e.copy(r).addScaledVector(go,a);const f=1/(p+v+d);return o=v*f,a=d*f,e.copy(n).addScaledVector(Kn,o).addScaledVector(jn,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Dc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},vn={h:0,s:0,l:0},ur={h:0,s:0,l:0};function Es(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Nt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ge){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=$t.workingColorSpace){if(t=ha(t,1),e=_e(e,0,1),n=_e(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Es(o,s,t+1/3),this.g=Es(o,s,t),this.b=Es(o,s,t-1/3)}return $t.toWorkingColorSpace(this,r),this}setStyle(t,e=ge){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ge){const n=Dc[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=gi(t.r),this.g=gi(t.g),this.b=gi(t.b),this}copyLinearToSRGB(t){return this.r=us(t.r),this.g=us(t.g),this.b=us(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ge){return $t.fromWorkingColorSpace(Se.copy(this),t),Math.round(_e(Se.r*255,0,255))*65536+Math.round(_e(Se.g*255,0,255))*256+Math.round(_e(Se.b*255,0,255))}getHexString(t=ge){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(Se.copy(this),e);const n=Se.r,r=Se.g,s=Se.b,o=Math.max(n,r,s),a=Math.min(n,r,s);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(r-s)/u+(r<s?6:0);break;case r:c=(s-n)/u+2;break;case s:c=(n-r)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(Se.copy(this),e),t.r=Se.r,t.g=Se.g,t.b=Se.b,t}getStyle(t=ge){$t.fromWorkingColorSpace(Se.copy(this),t);const e=Se.r,n=Se.g,r=Se.b;return t!==ge?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(vn),this.setHSL(vn.h+t,vn.s+e,vn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(vn),t.getHSL(ur);const n=Bi(vn.h,ur.h,e),r=Bi(vn.s,ur.s,e),s=Bi(vn.l,ur.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Se=new Nt;Nt.NAMES=Dc;let kh=0;class dn extends yi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:kh++}),this.uuid=tn(),this.name="",this.type="Material",this.blending=mi,this.side=bn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ws,this.blendDst=Xs,this.blendEquation=In,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Nt(0,0,0),this.blendAlpha=0,this.depthFunc=Or,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=no,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Wn,this.stencilZFail=Wn,this.stencilZPass=Wn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==mi&&(n.blending=this.blending),this.side!==bn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ws&&(n.blendSrc=this.blendSrc),this.blendDst!==Xs&&(n.blendDst=this.blendDst),this.blendEquation!==In&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Or&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==no&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Wn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Wn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Wn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const o=[];for(const a in s){const c=s[a];delete c.metadata,o.push(c)}return o}if(e){const s=r(t.textures),o=r(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Sn extends dn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Nt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=gc,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const le=new R,fr=new rt;class Ve{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Js,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Mn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)fr.fromBufferAttribute(this,e),fr.applyMatrix3(t),this.setXY(e,fr.x,fr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.applyMatrix3(t),this.setXYZ(e,le.x,le.y,le.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.applyMatrix4(t),this.setXYZ(e,le.x,le.y,le.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.applyNormalMatrix(t),this.setXYZ(e,le.x,le.y,le.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)le.fromBufferAttribute(this,e),le.transformDirection(t),this.setXYZ(e,le.x,le.y,le.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Qe(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Yt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Qe(e,this.array)),e}setX(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Qe(e,this.array)),e}setY(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Qe(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Qe(e,this.array)),e}setW(t,e){return this.normalized&&(e=Yt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array),r=Yt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array),r=Yt(r,this.array),s=Yt(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Js&&(t.usage=this.usage),t}}class Uc extends Ve{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Ic extends Ve{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Zt extends Ve{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Wh=0;const Be=new Jt,Ts=new ce,Qn=new R,Ue=new Vn,Ri=new Vn,me=new R;class ve extends yi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Wh++}),this.uuid=tn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Rc(t)?Ic:Uc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new kt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Be.makeRotationFromQuaternion(t),this.applyMatrix4(Be),this}rotateX(t){return Be.makeRotationX(t),this.applyMatrix4(Be),this}rotateY(t){return Be.makeRotationY(t),this.applyMatrix4(Be),this}rotateZ(t){return Be.makeRotationZ(t),this.applyMatrix4(Be),this}translate(t,e,n){return Be.makeTranslation(t,e,n),this.applyMatrix4(Be),this}scale(t,e,n){return Be.makeScale(t,e,n),this.applyMatrix4(Be),this}lookAt(t){return Ts.lookAt(t),Ts.updateMatrix(),this.applyMatrix4(Ts.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Qn).negate(),this.translate(Qn.x,Qn.y,Qn.z),this}setFromPoints(t){const e=[];for(let n=0,r=t.length;n<r;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Zt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Vn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new R(-1/0,-1/0,-1/0),new R(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];Ue.setFromBufferAttribute(s),this.morphTargetsRelative?(me.addVectors(this.boundingBox.min,Ue.min),this.boundingBox.expandByPoint(me),me.addVectors(this.boundingBox.max,Ue.max),this.boundingBox.expandByPoint(me)):(this.boundingBox.expandByPoint(Ue.min),this.boundingBox.expandByPoint(Ue.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new kn);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new R,1/0);return}if(t){const n=this.boundingSphere.center;if(Ue.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];Ri.setFromBufferAttribute(a),this.morphTargetsRelative?(me.addVectors(Ue.min,Ri.min),Ue.expandByPoint(me),me.addVectors(Ue.max,Ri.max),Ue.expandByPoint(me)):(Ue.expandByPoint(Ri.min),Ue.expandByPoint(Ri.max))}Ue.getCenter(n);let r=0;for(let s=0,o=t.count;s<o;s++)me.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(me));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)me.fromBufferAttribute(a,l),c&&(Qn.fromBufferAttribute(t,l),me.add(Qn)),r=Math.max(r,n.distanceToSquared(me))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,r=e.position.array,s=e.normal.array,o=e.uv.array,a=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ve(new Float32Array(4*a),4));const c=this.getAttribute("tangent").array,l=[],h=[];for(let E=0;E<a;E++)l[E]=new R,h[E]=new R;const u=new R,d=new R,m=new R,g=new rt,v=new rt,p=new rt,f=new R,S=new R;function _(E,I,V){u.fromArray(r,E*3),d.fromArray(r,I*3),m.fromArray(r,V*3),g.fromArray(o,E*2),v.fromArray(o,I*2),p.fromArray(o,V*2),d.sub(u),m.sub(u),v.sub(g),p.sub(g);const nt=1/(v.x*p.y-p.x*v.y);isFinite(nt)&&(f.copy(d).multiplyScalar(p.y).addScaledVector(m,-v.y).multiplyScalar(nt),S.copy(m).multiplyScalar(v.x).addScaledVector(d,-p.x).multiplyScalar(nt),l[E].add(f),l[I].add(f),l[V].add(f),h[E].add(S),h[I].add(S),h[V].add(S))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let E=0,I=b.length;E<I;++E){const V=b[E],nt=V.start,D=V.count;for(let O=nt,H=nt+D;O<H;O+=3)_(n[O+0],n[O+1],n[O+2])}const P=new R,w=new R,A=new R,U=new R;function x(E){A.fromArray(s,E*3),U.copy(A);const I=l[E];P.copy(I),P.sub(A.multiplyScalar(A.dot(I))).normalize(),w.crossVectors(U,I);const nt=w.dot(h[E])<0?-1:1;c[E*4]=P.x,c[E*4+1]=P.y,c[E*4+2]=P.z,c[E*4+3]=nt}for(let E=0,I=b.length;E<I;++E){const V=b[E],nt=V.start,D=V.count;for(let O=nt,H=nt+D;O<H;O+=3)x(n[O+0]),x(n[O+1]),x(n[O+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ve(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,m=n.count;d<m;d++)n.setXYZ(d,0,0,0);const r=new R,s=new R,o=new R,a=new R,c=new R,l=new R,h=new R,u=new R;if(t)for(let d=0,m=t.count;d<m;d+=3){const g=t.getX(d+0),v=t.getX(d+1),p=t.getX(d+2);r.fromBufferAttribute(e,g),s.fromBufferAttribute(e,v),o.fromBufferAttribute(e,p),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,v),l.fromBufferAttribute(n,p),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let d=0,m=e.count;d<m;d+=3)r.fromBufferAttribute(e,d+0),s.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,s),u.subVectors(r,s),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)me.fromBufferAttribute(t,e),me.normalize(),t.setXYZ(e,me.x,me.y,me.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let m=0,g=0;for(let v=0,p=c.length;v<p;v++){a.isInterleavedBufferAttribute?m=c[v]*a.data.stride+a.offset:m=c[v]*h;for(let f=0;f<h;f++)d[g++]=l[m++]}return new Ve(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new ve,n=this.index.array,r=this.attributes;for(const a in r){const c=r[a],l=t(c,n);e.setAttribute(a,l)}const s=this.morphAttributes;for(const a in s){const c=[],l=s[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],m=t(d,n);c.push(m)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const m=l[u];h.push(m.toJSON(t.data))}h.length>0&&(r[c]=h,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const l in r){const h=r[l];this.setAttribute(l,h.clone(e))}const s=t.morphAttributes;for(const l in s){const h=[],u=s[l];for(let d=0,m=u.length;d<m;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const _o=new Jt,Pn=new Yr,dr=new kn,vo=new R,ti=new R,ei=new R,ni=new R,bs=new R,pr=new R,mr=new rt,gr=new rt,_r=new rt,xo=new R,Mo=new R,So=new R,vr=new R,xr=new R;class Tt extends ce{constructor(t=new ve,e=new Sn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const a=this.morphTargetInfluences;if(s&&a){pr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const h=a[c],u=s[c];h!==0&&(bs.fromBufferAttribute(u,t),o?pr.addScaledVector(bs,h):pr.addScaledVector(bs.sub(e),h))}e.add(pr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),dr.copy(n.boundingSphere),dr.applyMatrix4(s),Pn.copy(t.ray).recast(t.near),!(dr.containsPoint(Pn.origin)===!1&&(Pn.intersectSphere(dr,vo)===null||Pn.origin.distanceToSquared(vo)>(t.far-t.near)**2))&&(_o.copy(s).invert(),Pn.copy(t.ray).applyMatrix4(_o),!(n.boundingBox!==null&&Pn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Pn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,o=this.material,a=s.index,c=s.attributes.position,l=s.attributes.uv,h=s.attributes.uv1,u=s.attributes.normal,d=s.groups,m=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const p=d[g],f=o[p.materialIndex],S=Math.max(p.start,m.start),_=Math.min(a.count,Math.min(p.start+p.count,m.start+m.count));for(let b=S,P=_;b<P;b+=3){const w=a.getX(b),A=a.getX(b+1),U=a.getX(b+2);r=Mr(this,f,t,n,l,h,u,w,A,U),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(a.count,m.start+m.count);for(let p=g,f=v;p<f;p+=3){const S=a.getX(p),_=a.getX(p+1),b=a.getX(p+2);r=Mr(this,o,t,n,l,h,u,S,_,b),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,v=d.length;g<v;g++){const p=d[g],f=o[p.materialIndex],S=Math.max(p.start,m.start),_=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let b=S,P=_;b<P;b+=3){const w=b,A=b+1,U=b+2;r=Mr(this,f,t,n,l,h,u,w,A,U),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const g=Math.max(0,m.start),v=Math.min(c.count,m.start+m.count);for(let p=g,f=v;p<f;p+=3){const S=p,_=p+1,b=p+2;r=Mr(this,o,t,n,l,h,u,S,_,b),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function Xh(i,t,e,n,r,s,o,a){let c;if(t.side===Ce?c=n.intersectTriangle(o,s,r,!0,a):c=n.intersectTriangle(r,s,o,t.side===bn,a),c===null)return null;xr.copy(a),xr.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(xr);return l<e.near||l>e.far?null:{distance:l,point:xr.clone(),object:i}}function Mr(i,t,e,n,r,s,o,a,c,l){i.getVertexPosition(a,ti),i.getVertexPosition(c,ei),i.getVertexPosition(l,ni);const h=Xh(i,t,e,n,ti,ei,ni,vr);if(h){r&&(mr.fromBufferAttribute(r,a),gr.fromBufferAttribute(r,c),_r.fromBufferAttribute(r,l),h.uv=Ge.getInterpolation(vr,ti,ei,ni,mr,gr,_r,new rt)),s&&(mr.fromBufferAttribute(s,a),gr.fromBufferAttribute(s,c),_r.fromBufferAttribute(s,l),h.uv1=Ge.getInterpolation(vr,ti,ei,ni,mr,gr,_r,new rt),h.uv2=h.uv1),o&&(xo.fromBufferAttribute(o,a),Mo.fromBufferAttribute(o,c),So.fromBufferAttribute(o,l),h.normal=Ge.getInterpolation(vr,ti,ei,ni,xo,Mo,So,new R),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new R,materialIndex:0};Ge.getNormal(ti,ei,ni,u.normal),h.face=u}return h}class He extends ve{constructor(t=1,e=1,n=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,m=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,r,o,2),g("x","z","y",1,-1,t,n,-e,r,o,3),g("x","y","z",1,-1,t,e,n,r,s,4),g("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new Zt(l,3)),this.setAttribute("normal",new Zt(h,3)),this.setAttribute("uv",new Zt(u,2));function g(v,p,f,S,_,b,P,w,A,U,x){const E=b/A,I=P/U,V=b/2,nt=P/2,D=w/2,O=A+1,H=U+1;let $=0,X=0;const W=new R;for(let Q=0;Q<H;Q++){const tt=Q*I-nt;for(let ut=0;ut<O;ut++){const k=ut*E-V;W[v]=k*S,W[p]=tt*_,W[f]=D,l.push(W.x,W.y,W.z),W[v]=0,W[p]=0,W[f]=w>0?1:-1,h.push(W.x,W.y,W.z),u.push(ut/A),u.push(1-Q/U),$+=1}}for(let Q=0;Q<U;Q++)for(let tt=0;tt<A;tt++){const ut=d+tt+O*Q,k=d+tt+O*(Q+1),J=d+(tt+1)+O*(Q+1),ft=d+(tt+1)+O*Q;c.push(ut,k,ft),c.push(k,J,ft),X+=6}a.addGroup(m,X,x),m+=X,d+=$}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new He(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function Si(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function we(i){const t={};for(let e=0;e<i.length;e++){const n=Si(i[e]);for(const r in n)t[r]=n[r]}return t}function qh(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Nc(i){return i.getRenderTarget()===null?i.outputColorSpace:$t.workingColorSpace}const Yh={clone:Si,merge:we};var $h=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends dn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$h,this.fragmentShader=Zh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Si(t.uniforms),this.uniformsGroups=qh(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?e.uniforms[r]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[r]={type:"m4",value:o.toArray()}:e.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Fc extends ce{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Jt,this.projectionMatrix=new Jt,this.projectionMatrixInverse=new Jt,this.coordinateSystem=hn}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class Ie extends Fc{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=qi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Oi*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return qi*2*Math.atan(Math.tan(Oi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,r,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Oi*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;s+=o.offsetX*r/c,e-=o.offsetY*n/l,r*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const ii=-90,ri=1;class Jh extends ce{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Ie(ii,ri,t,e);r.layers=this.layers,this.add(r);const s=new Ie(ii,ri,t,e);s.layers=this.layers,this.add(s);const o=new Ie(ii,ri,t,e);o.layers=this.layers,this.add(o);const a=new Ie(ii,ri,t,e);a.layers=this.layers,this.add(a);const c=new Ie(ii,ri,t,e);c.layers=this.layers,this.add(c);const l=new Ie(ii,ri,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,o,a,c]=e;for(const l of e)this.remove(l);if(t===hn)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===Hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,o),t.setRenderTarget(n,2,r),t.render(e,a),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,r),t.render(e,h),t.setRenderTarget(u,d,m),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Oc extends Pe{constructor(t,e,n,r,s,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:vi,super(t,e,n,r,s,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Kh extends zn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];e.encoding!==void 0&&(zi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Bn?ge:Ne),this.texture=new Oc(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ze}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new He(5,5,5),s=new Gn({name:"CubemapFromEquirect",uniforms:Si(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ce,blending:yn});s.uniforms.tEquirect.value=e;const o=new Tt(r,s),a=e.minFilter;return e.minFilter===Wi&&(e.minFilter=ze),new Jh(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,r);t.setRenderTarget(s)}}const As=new R,jh=new R,Qh=new kt;class Dn{constructor(t=new R(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=As.subVectors(n,e).cross(jh.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(As),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Qh.getNormalMatrix(t),r=this.coplanarPoint(As).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Ln=new kn,Sr=new R;class fa{constructor(t=new Dn,e=new Dn,n=new Dn,r=new Dn,s=new Dn,o=new Dn){this.planes=[t,e,n,r,s,o]}set(t,e,n,r,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=hn){const n=this.planes,r=t.elements,s=r[0],o=r[1],a=r[2],c=r[3],l=r[4],h=r[5],u=r[6],d=r[7],m=r[8],g=r[9],v=r[10],p=r[11],f=r[12],S=r[13],_=r[14],b=r[15];if(n[0].setComponents(c-s,d-l,p-m,b-f).normalize(),n[1].setComponents(c+s,d+l,p+m,b+f).normalize(),n[2].setComponents(c+o,d+h,p+g,b+S).normalize(),n[3].setComponents(c-o,d-h,p-g,b-S).normalize(),n[4].setComponents(c-a,d-u,p-v,b-_).normalize(),e===hn)n[5].setComponents(c+a,d+u,p+v,b+_).normalize();else if(e===Hr)n[5].setComponents(a,u,v,_).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Ln.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Ln.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Ln)}intersectsSprite(t){return Ln.center.set(0,0,0),Ln.radius=.7071067811865476,Ln.applyMatrix4(t.matrixWorld),this.intersectsSphere(Ln)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(Sr.x=r.normal.x>0?t.max.x:t.min.x,Sr.y=r.normal.y>0?t.max.y:t.min.y,Sr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(Sr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Bc(){let i=null,t=!1,e=null,n=null;function r(s,o){e(s,o),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function tu(i,t){const e=t.isWebGL2,n=new WeakMap;function r(l,h){const u=l.array,d=l.usage,m=u.byteLength,g=i.createBuffer();i.bindBuffer(h,g),i.bufferData(h,u,d),l.onUploadCallback();let v;if(u instanceof Float32Array)v=i.FLOAT;else if(u instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(u instanceof Int16Array)v=i.SHORT;else if(u instanceof Uint32Array)v=i.UNSIGNED_INT;else if(u instanceof Int32Array)v=i.INT;else if(u instanceof Int8Array)v=i.BYTE;else if(u instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:g,type:v,bytesPerElement:u.BYTES_PER_ELEMENT,version:l.version,size:m}}function s(l,h,u){const d=h.array,m=h._updateRange,g=h.updateRanges;if(i.bindBuffer(u,l),m.count===-1&&g.length===0&&i.bufferSubData(u,0,d),g.length!==0){for(let v=0,p=g.length;v<p;v++){const f=g[v];e?i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d,f.start,f.count):i.bufferSubData(u,f.start*d.BYTES_PER_ELEMENT,d.subarray(f.start,f.start+f.count))}h.clearUpdateRanges()}m.count!==-1&&(e?i.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d,m.offset,m.count):i.bufferSubData(u,m.offset*d.BYTES_PER_ELEMENT,d.subarray(m.offset,m.offset+m.count)),m.count=-1),h.onUploadCallback()}function o(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function a(l){l.isInterleavedBufferAttribute&&(l=l.data);const h=n.get(l);h&&(i.deleteBuffer(h.buffer),n.delete(l))}function c(l,h){if(l.isGLBufferAttribute){const d=n.get(l);(!d||d.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);if(u===void 0)n.set(l,r(l,h));else if(u.version<l.version){if(u.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(u.buffer,l,h),u.version=l.version}}return{get:o,remove:a,update:c}}class Zr extends ve{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,o=e/2,a=Math.floor(n),c=Math.floor(r),l=a+1,h=c+1,u=t/a,d=e/c,m=[],g=[],v=[],p=[];for(let f=0;f<h;f++){const S=f*d-o;for(let _=0;_<l;_++){const b=_*u-s;g.push(b,-S,0),v.push(0,0,1),p.push(_/a),p.push(1-f/c)}}for(let f=0;f<c;f++)for(let S=0;S<a;S++){const _=S+l*f,b=S+l*(f+1),P=S+1+l*(f+1),w=S+1+l*f;m.push(_,b,w),m.push(b,P,w)}this.setIndex(m),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(v,3)),this.setAttribute("uv",new Zt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Zr(t.width,t.height,t.widthSegments,t.heightSegments)}}var eu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nu=`#ifdef USE_ALPHAHASH
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
#endif`,iu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,ru=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,su=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,au=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ou=`#ifdef USE_AOMAP
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
#endif`,cu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,lu=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
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
#endif`,hu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,uu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,du=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,pu=`#ifdef USE_IRIDESCENCE
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
#endif`,mu=`#ifdef USE_BUMPMAP
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
#endif`,gu=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
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
#endif`,_u=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,vu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,xu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Mu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Su=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,yu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,Eu=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,Tu=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
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
} // validated`,bu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Au=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,wu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ru=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Cu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Pu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Lu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Du=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Uu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Iu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Nu=`#ifdef USE_ENVMAP
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
#endif`,Fu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Ou=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Bu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Gu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Hu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Vu=`#ifdef USE_GRADIENTMAP
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
}`,ku=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Wu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Xu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,qu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Yu=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
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
#endif`,$u=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
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
	#endif
#endif`,Zu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Ju=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Ku=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ju=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Qu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,tf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
	vec3 f0 = material.specularColor;
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ef=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
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
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,nf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,rf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,sf=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,af=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,of=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,cf=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,lf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,hf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,ff=`#if defined( USE_POINTS_UV )
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
#endif`,df=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,pf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,mf=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,_f=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,vf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,xf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Mf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Sf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,yf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ef=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Tf=`#ifdef USE_NORMALMAP
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
#endif`,bf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Af=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,wf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Rf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Cf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Pf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Lf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Df=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Uf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,If=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Nf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Ff=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Of=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Bf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
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
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,zf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,Gf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Hf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Vf=`#ifdef USE_SKINNING
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
#endif`,kf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Wf=`#ifdef USE_SKINNING
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
#endif`,Xf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,qf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Yf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$f=`#ifndef saturate
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
vec3 OptimizedCineonToneMapping( vec3 color ) {
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
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Zf=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Jf=`#ifdef USE_TRANSMISSION
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
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Kf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Qf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,td=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ed=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nd=`uniform sampler2D t2D;
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
}`,id=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rd=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sd=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ad=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,od=`#include <common>
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
}`,cd=`#if DEPTH_PACKING == 3200
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,ld=`#define DISTANCE
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
}`,hd=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,ud=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fd=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dd=`uniform float scale;
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
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pd=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,md=`#include <common>
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
}`,gd=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,_d=`#define LAMBERT
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
}`,vd=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,xd=`#define MATCAP
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
}`,Md=`#define MATCAP
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Sd=`#define NORMAL
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
}`,yd=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ed=`#define PHONG
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
}`,Td=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,bd=`#define STANDARD
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
}`,Ad=`#define STANDARD
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
#include <packing>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,wd=`#define TOON
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
}`,Rd=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Cd=`uniform float size;
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
}`,Pd=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,Ld=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
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
}`,Dd=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Ud=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,Id=`uniform vec3 diffuse;
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
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
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
}`,zt={alphahash_fragment:eu,alphahash_pars_fragment:nu,alphamap_fragment:iu,alphamap_pars_fragment:ru,alphatest_fragment:su,alphatest_pars_fragment:au,aomap_fragment:ou,aomap_pars_fragment:cu,batching_pars_vertex:lu,batching_vertex:hu,begin_vertex:uu,beginnormal_vertex:fu,bsdfs:du,iridescence_fragment:pu,bumpmap_pars_fragment:mu,clipping_planes_fragment:gu,clipping_planes_pars_fragment:_u,clipping_planes_pars_vertex:vu,clipping_planes_vertex:xu,color_fragment:Mu,color_pars_fragment:Su,color_pars_vertex:yu,color_vertex:Eu,common:Tu,cube_uv_reflection_fragment:bu,defaultnormal_vertex:Au,displacementmap_pars_vertex:wu,displacementmap_vertex:Ru,emissivemap_fragment:Cu,emissivemap_pars_fragment:Pu,colorspace_fragment:Lu,colorspace_pars_fragment:Du,envmap_fragment:Uu,envmap_common_pars_fragment:Iu,envmap_pars_fragment:Nu,envmap_pars_vertex:Fu,envmap_physical_pars_fragment:$u,envmap_vertex:Ou,fog_vertex:Bu,fog_pars_vertex:zu,fog_fragment:Gu,fog_pars_fragment:Hu,gradientmap_pars_fragment:Vu,lightmap_fragment:ku,lightmap_pars_fragment:Wu,lights_lambert_fragment:Xu,lights_lambert_pars_fragment:qu,lights_pars_begin:Yu,lights_toon_fragment:Zu,lights_toon_pars_fragment:Ju,lights_phong_fragment:Ku,lights_phong_pars_fragment:ju,lights_physical_fragment:Qu,lights_physical_pars_fragment:tf,lights_fragment_begin:ef,lights_fragment_maps:nf,lights_fragment_end:rf,logdepthbuf_fragment:sf,logdepthbuf_pars_fragment:af,logdepthbuf_pars_vertex:of,logdepthbuf_vertex:cf,map_fragment:lf,map_pars_fragment:hf,map_particle_fragment:uf,map_particle_pars_fragment:ff,metalnessmap_fragment:df,metalnessmap_pars_fragment:pf,morphcolor_vertex:mf,morphnormal_vertex:gf,morphtarget_pars_vertex:_f,morphtarget_vertex:vf,normal_fragment_begin:xf,normal_fragment_maps:Mf,normal_pars_fragment:Sf,normal_pars_vertex:yf,normal_vertex:Ef,normalmap_pars_fragment:Tf,clearcoat_normal_fragment_begin:bf,clearcoat_normal_fragment_maps:Af,clearcoat_pars_fragment:wf,iridescence_pars_fragment:Rf,opaque_fragment:Cf,packing:Pf,premultiplied_alpha_fragment:Lf,project_vertex:Df,dithering_fragment:Uf,dithering_pars_fragment:If,roughnessmap_fragment:Nf,roughnessmap_pars_fragment:Ff,shadowmap_pars_fragment:Of,shadowmap_pars_vertex:Bf,shadowmap_vertex:zf,shadowmask_pars_fragment:Gf,skinbase_vertex:Hf,skinning_pars_vertex:Vf,skinning_vertex:kf,skinnormal_vertex:Wf,specularmap_fragment:Xf,specularmap_pars_fragment:qf,tonemapping_fragment:Yf,tonemapping_pars_fragment:$f,transmission_fragment:Zf,transmission_pars_fragment:Jf,uv_pars_fragment:Kf,uv_pars_vertex:jf,uv_vertex:Qf,worldpos_vertex:td,background_vert:ed,background_frag:nd,backgroundCube_vert:id,backgroundCube_frag:rd,cube_vert:sd,cube_frag:ad,depth_vert:od,depth_frag:cd,distanceRGBA_vert:ld,distanceRGBA_frag:hd,equirect_vert:ud,equirect_frag:fd,linedashed_vert:dd,linedashed_frag:pd,meshbasic_vert:md,meshbasic_frag:gd,meshlambert_vert:_d,meshlambert_frag:vd,meshmatcap_vert:xd,meshmatcap_frag:Md,meshnormal_vert:Sd,meshnormal_frag:yd,meshphong_vert:Ed,meshphong_frag:Td,meshphysical_vert:bd,meshphysical_frag:Ad,meshtoon_vert:wd,meshtoon_frag:Rd,points_vert:Cd,points_frag:Pd,shadow_vert:Ld,shadow_frag:Dd,sprite_vert:Ud,sprite_frag:Id},ot={common:{diffuse:{value:new Nt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new kt}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new kt},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Nt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Nt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0},uvTransform:{value:new kt}},sprite:{diffuse:{value:new Nt(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new kt},alphaMap:{value:null},alphaMapTransform:{value:new kt},alphaTest:{value:0}}},Ke={basic:{uniforms:we([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.fog]),vertexShader:zt.meshbasic_vert,fragmentShader:zt.meshbasic_frag},lambert:{uniforms:we([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Nt(0)}}]),vertexShader:zt.meshlambert_vert,fragmentShader:zt.meshlambert_frag},phong:{uniforms:we([ot.common,ot.specularmap,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,ot.lights,{emissive:{value:new Nt(0)},specular:{value:new Nt(1118481)},shininess:{value:30}}]),vertexShader:zt.meshphong_vert,fragmentShader:zt.meshphong_frag},standard:{uniforms:we([ot.common,ot.envmap,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.roughnessmap,ot.metalnessmap,ot.fog,ot.lights,{emissive:{value:new Nt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag},toon:{uniforms:we([ot.common,ot.aomap,ot.lightmap,ot.emissivemap,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.gradientmap,ot.fog,ot.lights,{emissive:{value:new Nt(0)}}]),vertexShader:zt.meshtoon_vert,fragmentShader:zt.meshtoon_frag},matcap:{uniforms:we([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,ot.fog,{matcap:{value:null}}]),vertexShader:zt.meshmatcap_vert,fragmentShader:zt.meshmatcap_frag},points:{uniforms:we([ot.points,ot.fog]),vertexShader:zt.points_vert,fragmentShader:zt.points_frag},dashed:{uniforms:we([ot.common,ot.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:zt.linedashed_vert,fragmentShader:zt.linedashed_frag},depth:{uniforms:we([ot.common,ot.displacementmap]),vertexShader:zt.depth_vert,fragmentShader:zt.depth_frag},normal:{uniforms:we([ot.common,ot.bumpmap,ot.normalmap,ot.displacementmap,{opacity:{value:1}}]),vertexShader:zt.meshnormal_vert,fragmentShader:zt.meshnormal_frag},sprite:{uniforms:we([ot.sprite,ot.fog]),vertexShader:zt.sprite_vert,fragmentShader:zt.sprite_frag},background:{uniforms:{uvTransform:{value:new kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:zt.background_vert,fragmentShader:zt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:zt.backgroundCube_vert,fragmentShader:zt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:zt.cube_vert,fragmentShader:zt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:zt.equirect_vert,fragmentShader:zt.equirect_frag},distanceRGBA:{uniforms:we([ot.common,ot.displacementmap,{referencePosition:{value:new R},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:zt.distanceRGBA_vert,fragmentShader:zt.distanceRGBA_frag},shadow:{uniforms:we([ot.lights,ot.fog,{color:{value:new Nt(0)},opacity:{value:1}}]),vertexShader:zt.shadow_vert,fragmentShader:zt.shadow_frag}};Ke.physical={uniforms:we([Ke.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new kt},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new kt},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new kt},sheen:{value:0},sheenColor:{value:new Nt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new kt},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new kt},attenuationDistance:{value:0},attenuationColor:{value:new Nt(0)},specularColor:{value:new Nt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new kt},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new kt}}]),vertexShader:zt.meshphysical_vert,fragmentShader:zt.meshphysical_frag};const yr={r:0,b:0,g:0};function Nd(i,t,e,n,r,s,o){const a=new Nt(0);let c=s===!0?0:1,l,h,u=null,d=0,m=null;function g(p,f){let S=!1,_=f.isScene===!0?f.background:null;_&&_.isTexture&&(_=(f.backgroundBlurriness>0?e:t).get(_)),_===null?v(a,c):_&&_.isColor&&(v(_,1),S=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,o):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||S)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),_&&(_.isCubeTexture||_.mapping===Xr)?(h===void 0&&(h=new Tt(new He(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:Si(Ke.backgroundCube.uniforms),vertexShader:Ke.backgroundCube.vertexShader,fragmentShader:Ke.backgroundCube.fragmentShader,side:Ce,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(P,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(h)),h.material.uniforms.envMap.value=_,h.material.uniforms.flipEnvMap.value=_.isCubeTexture&&_.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=f.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,h.material.toneMapped=$t.getTransfer(_.colorSpace)!==ee,(u!==_||d!==_.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,u=_,d=_.version,m=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null)):_&&_.isTexture&&(l===void 0&&(l=new Tt(new Zr(2,2),new Gn({name:"BackgroundMaterial",uniforms:Si(Ke.background.uniforms),vertexShader:Ke.background.vertexShader,fragmentShader:Ke.background.fragmentShader,side:bn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=_,l.material.uniforms.backgroundIntensity.value=f.backgroundIntensity,l.material.toneMapped=$t.getTransfer(_.colorSpace)!==ee,_.matrixAutoUpdate===!0&&_.updateMatrix(),l.material.uniforms.uvTransform.value.copy(_.matrix),(u!==_||d!==_.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,u=_,d=_.version,m=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function v(p,f){p.getRGB(yr,Nc(i)),n.buffers.color.setClear(yr.r,yr.g,yr.b,f,o)}return{getClearColor:function(){return a},setClearColor:function(p,f=1){a.set(p),c=f,v(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,v(a,c)},render:g}}function Fd(i,t,e,n){const r=i.getParameter(i.MAX_VERTEX_ATTRIBS),s=n.isWebGL2?null:t.get("OES_vertex_array_object"),o=n.isWebGL2||s!==null,a={},c=p(null);let l=c,h=!1;function u(D,O,H,$,X){let W=!1;if(o){const Q=v($,H,O);l!==Q&&(l=Q,m(l.object)),W=f(D,$,H,X),W&&S(D,$,H,X)}else{const Q=O.wireframe===!0;(l.geometry!==$.id||l.program!==H.id||l.wireframe!==Q)&&(l.geometry=$.id,l.program=H.id,l.wireframe=Q,W=!0)}X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(W||h)&&(h=!1,U(D,O,H,$),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function d(){return n.isWebGL2?i.createVertexArray():s.createVertexArrayOES()}function m(D){return n.isWebGL2?i.bindVertexArray(D):s.bindVertexArrayOES(D)}function g(D){return n.isWebGL2?i.deleteVertexArray(D):s.deleteVertexArrayOES(D)}function v(D,O,H){const $=H.wireframe===!0;let X=a[D.id];X===void 0&&(X={},a[D.id]=X);let W=X[O.id];W===void 0&&(W={},X[O.id]=W);let Q=W[$];return Q===void 0&&(Q=p(d()),W[$]=Q),Q}function p(D){const O=[],H=[],$=[];for(let X=0;X<r;X++)O[X]=0,H[X]=0,$[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:H,attributeDivisors:$,object:D,attributes:{},index:null}}function f(D,O,H,$){const X=l.attributes,W=O.attributes;let Q=0;const tt=H.getAttributes();for(const ut in tt)if(tt[ut].location>=0){const J=X[ut];let ft=W[ut];if(ft===void 0&&(ut==="instanceMatrix"&&D.instanceMatrix&&(ft=D.instanceMatrix),ut==="instanceColor"&&D.instanceColor&&(ft=D.instanceColor)),J===void 0||J.attribute!==ft||ft&&J.data!==ft.data)return!0;Q++}return l.attributesNum!==Q||l.index!==$}function S(D,O,H,$){const X={},W=O.attributes;let Q=0;const tt=H.getAttributes();for(const ut in tt)if(tt[ut].location>=0){let J=W[ut];J===void 0&&(ut==="instanceMatrix"&&D.instanceMatrix&&(J=D.instanceMatrix),ut==="instanceColor"&&D.instanceColor&&(J=D.instanceColor));const ft={};ft.attribute=J,J&&J.data&&(ft.data=J.data),X[ut]=ft,Q++}l.attributes=X,l.attributesNum=Q,l.index=$}function _(){const D=l.newAttributes;for(let O=0,H=D.length;O<H;O++)D[O]=0}function b(D){P(D,0)}function P(D,O){const H=l.newAttributes,$=l.enabledAttributes,X=l.attributeDivisors;H[D]=1,$[D]===0&&(i.enableVertexAttribArray(D),$[D]=1),X[D]!==O&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](D,O),X[D]=O)}function w(){const D=l.newAttributes,O=l.enabledAttributes;for(let H=0,$=O.length;H<$;H++)O[H]!==D[H]&&(i.disableVertexAttribArray(H),O[H]=0)}function A(D,O,H,$,X,W,Q){Q===!0?i.vertexAttribIPointer(D,O,H,X,W):i.vertexAttribPointer(D,O,H,$,X,W)}function U(D,O,H,$){if(n.isWebGL2===!1&&(D.isInstancedMesh||$.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;_();const X=$.attributes,W=H.getAttributes(),Q=O.defaultAttributeValues;for(const tt in W){const ut=W[tt];if(ut.location>=0){let k=X[tt];if(k===void 0&&(tt==="instanceMatrix"&&D.instanceMatrix&&(k=D.instanceMatrix),tt==="instanceColor"&&D.instanceColor&&(k=D.instanceColor)),k!==void 0){const J=k.normalized,ft=k.itemSize,xt=e.get(k);if(xt===void 0)continue;const mt=xt.buffer,Rt=xt.type,Ut=xt.bytesPerElement,Mt=n.isWebGL2===!0&&(Rt===i.INT||Rt===i.UNSIGNED_INT||k.gpuType===vc);if(k.isInterleavedBufferAttribute){const Lt=k.data,C=Lt.stride,st=k.offset;if(Lt.isInstancedInterleavedBuffer){for(let Y=0;Y<ut.locationSize;Y++)P(ut.location+Y,Lt.meshPerAttribute);D.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=Lt.meshPerAttribute*Lt.count)}else for(let Y=0;Y<ut.locationSize;Y++)b(ut.location+Y);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let Y=0;Y<ut.locationSize;Y++)A(ut.location+Y,ft/ut.locationSize,Rt,J,C*Ut,(st+ft/ut.locationSize*Y)*Ut,Mt)}else{if(k.isInstancedBufferAttribute){for(let Lt=0;Lt<ut.locationSize;Lt++)P(ut.location+Lt,k.meshPerAttribute);D.isInstancedMesh!==!0&&$._maxInstanceCount===void 0&&($._maxInstanceCount=k.meshPerAttribute*k.count)}else for(let Lt=0;Lt<ut.locationSize;Lt++)b(ut.location+Lt);i.bindBuffer(i.ARRAY_BUFFER,mt);for(let Lt=0;Lt<ut.locationSize;Lt++)A(ut.location+Lt,ft/ut.locationSize,Rt,J,ft*Ut,ft/ut.locationSize*Lt*Ut,Mt)}}else if(Q!==void 0){const J=Q[tt];if(J!==void 0)switch(J.length){case 2:i.vertexAttrib2fv(ut.location,J);break;case 3:i.vertexAttrib3fv(ut.location,J);break;case 4:i.vertexAttrib4fv(ut.location,J);break;default:i.vertexAttrib1fv(ut.location,J)}}}}w()}function x(){V();for(const D in a){const O=a[D];for(const H in O){const $=O[H];for(const X in $)g($[X].object),delete $[X];delete O[H]}delete a[D]}}function E(D){if(a[D.id]===void 0)return;const O=a[D.id];for(const H in O){const $=O[H];for(const X in $)g($[X].object),delete $[X];delete O[H]}delete a[D.id]}function I(D){for(const O in a){const H=a[O];if(H[D.id]===void 0)continue;const $=H[D.id];for(const X in $)g($[X].object),delete $[X];delete H[D.id]}}function V(){nt(),h=!0,l!==c&&(l=c,m(l.object))}function nt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:u,reset:V,resetDefaultState:nt,dispose:x,releaseStatesOfGeometry:E,releaseStatesOfProgram:I,initAttributes:_,enableAttribute:b,disableUnusedAttributes:w}}function Od(i,t,e,n){const r=n.isWebGL2;let s;function o(h){s=h}function a(h,u){i.drawArrays(s,h,u),e.update(u,s,1)}function c(h,u,d){if(d===0)return;let m,g;if(r)m=i,g="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),g="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[g](s,h,u,d),e.update(u,s,d)}function l(h,u,d){if(d===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<d;g++)this.render(h[g],u[g]);else{m.multiDrawArraysWEBGL(s,h,0,u,0,d);let g=0;for(let v=0;v<d;v++)g+=u[v];e.update(g,s,1)}}this.setMode=o,this.render=a,this.renderInstances=c,this.renderMultiDraw=l}function Bd(i,t,e){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const A=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const o=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let a=e.precision!==void 0?e.precision:"highp";const c=s(a);c!==a&&(console.warn("THREE.WebGLRenderer:",a,"not supported, using",c,"instead."),a=c);const l=o||t.has("WEBGL_draw_buffers"),h=e.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),g=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),f=i.getParameter(i.MAX_VARYING_VECTORS),S=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),_=d>0,b=o||t.has("OES_texture_float"),P=_&&b,w=o?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:o,drawBuffers:l,getMaxAnisotropy:r,getMaxPrecision:s,precision:a,logarithmicDepthBuffer:h,maxTextures:u,maxVertexTextures:d,maxTextureSize:m,maxCubemapSize:g,maxAttributes:v,maxVertexUniforms:p,maxVaryings:f,maxFragmentUniforms:S,vertexTextures:_,floatFragmentTextures:b,floatVertexTextures:P,maxSamples:w}}function zd(i){const t=this;let e=null,n=0,r=!1,s=!1;const o=new Dn,a=new kt,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const m=u.length!==0||d||n!==0||r;return r=d,n=u.length,m},this.beginShadows=function(){s=!0,h(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,m){const g=u.clippingPlanes,v=u.clipIntersection,p=u.clipShadows,f=i.get(u);if(!r||g===null||g.length===0||s&&!p)s?h(null):l();else{const S=s?0:n,_=S*4;let b=f.clippingState||null;c.value=b,b=h(g,d,_,m);for(let P=0;P!==_;++P)b[P]=e[P];f.clippingState=b,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=S}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,m,g){const v=u!==null?u.length:0;let p=null;if(v!==0){if(p=c.value,g!==!0||p===null){const f=m+v*4,S=d.matrixWorldInverse;a.getNormalMatrix(S),(p===null||p.length<f)&&(p=new Float32Array(f));for(let _=0,b=m;_!==v;++_,b+=4)o.copy(u[_]).applyMatrix4(S,a),o.normal.toArray(p,b),p[b+3]=o.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function Gd(i){let t=new WeakMap;function e(o,a){return a===qs?o.mapping=vi:a===Ys&&(o.mapping=xi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===qs||a===Ys)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new Kh(c.height/2);return l.fromEquirectangularTexture(i,o),t.set(o,l),o.addEventListener("dispose",r),e(l.texture,o.mapping)}else return null}}return o}function r(o){const a=o.target;a.removeEventListener("dispose",r);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class zc extends Fc{constructor(t=-1,e=1,n=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,o=s+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const fi=4,yo=[.125,.215,.35,.446,.526,.582],Nn=20,ws=new zc,Eo=new Nt;let Rs=null,Cs=0,Ps=0;const Un=(1+Math.sqrt(5))/2,si=1/Un,To=[new R(1,1,1),new R(-1,1,1),new R(1,1,-1),new R(-1,1,-1),new R(0,Un,si),new R(0,Un,-si),new R(si,0,Un),new R(-si,0,Un),new R(Un,si,0),new R(-Un,si,0)];class bo{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){Rs=this._renderer.getRenderTarget(),Cs=this._renderer.getActiveCubeFace(),Ps=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ro(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=wo(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Rs,Cs,Ps),t.scissorTest=!1,Er(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===vi||t.mapping===xi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Rs=this._renderer.getRenderTarget(),Cs=this._renderer.getActiveCubeFace(),Ps=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ze,minFilter:ze,generateMipmaps:!1,type:Xi,format:Ye,colorSpace:fn,depthBuffer:!1},r=Ao(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ao(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hd(s)),this._blurMaterial=Vd(s,t,e)}return r}_compileMaterial(t){const e=new Tt(this._lodPlanes[0],t);this._renderer.compile(e,ws)}_sceneToCubeUV(t,e,n,r){const a=new Ie(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(Eo),h.toneMapping=En,h.autoClear=!1;const m=new Sn({name:"PMREM.Background",side:Ce,depthWrite:!1,depthTest:!1}),g=new Tt(new He,m);let v=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,v=!0):(m.color.copy(Eo),v=!0);for(let f=0;f<6;f++){const S=f%3;S===0?(a.up.set(0,c[f],0),a.lookAt(l[f],0,0)):S===1?(a.up.set(0,0,c[f]),a.lookAt(0,l[f],0)):(a.up.set(0,c[f],0),a.lookAt(0,0,l[f]));const _=this._cubeSize;Er(r,S*_,f>2?_:0,_,_),h.setRenderTarget(r),v&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===vi||t.mapping===xi;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ro()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=wo());const s=r?this._cubemapMaterial:this._equirectMaterial,o=new Tt(this._lodPlanes[0],s),a=s.uniforms;a.envMap.value=t;const c=this._cubeSize;Er(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,ws)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),o=To[(r-1)%To.length];this._blur(t,r-1,r,s,o)}e.autoClear=n}_blur(t,e,n,r,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,r,"latitudinal",s),this._halfBlur(o,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Tt(this._lodPlanes[r],l),d=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Nn-1),v=s/g,p=isFinite(s)?1+Math.floor(h*v):Nn;p>Nn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Nn}`);const f=[];let S=0;for(let A=0;A<Nn;++A){const U=A/v,x=Math.exp(-U*U/2);f.push(x),A===0?S+=x:A<p&&(S+=2*x)}for(let A=0;A<f.length;A++)f[A]=f[A]/S;d.envMap.value=t.texture,d.samples.value=p,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:_}=this;d.dTheta.value=g,d.mipInt.value=_-n;const b=this._sizeLods[r],P=3*b*(r>_-fi?r-_+fi:0),w=4*(this._cubeSize-b);Er(e,P,w,3*b,2*b),c.setRenderTarget(e),c.render(u,ws)}}function Hd(i){const t=[],e=[],n=[];let r=i;const s=i-fi+1+yo.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let c=1/a;o>i-fi?c=yo[o-i+fi-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],m=6,g=6,v=3,p=2,f=1,S=new Float32Array(v*g*m),_=new Float32Array(p*g*m),b=new Float32Array(f*g*m);for(let w=0;w<m;w++){const A=w%3*2/3-1,U=w>2?0:-1,x=[A,U,0,A+2/3,U,0,A+2/3,U+1,0,A,U,0,A+2/3,U+1,0,A,U+1,0];S.set(x,v*g*w),_.set(d,p*g*w);const E=[w,w,w,w,w,w];b.set(E,f*g*w)}const P=new ve;P.setAttribute("position",new Ve(S,v)),P.setAttribute("uv",new Ve(_,p)),P.setAttribute("faceIndex",new Ve(b,f)),t.push(P),r>fi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function Ao(i,t,e){const n=new zn(i,t,e);return n.texture.mapping=Xr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Er(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function Vd(i,t,e){const n=new Float32Array(Nn),r=new R(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:Nn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function wo(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:da(),fragmentShader:`

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
		`,blending:yn,depthTest:!1,depthWrite:!1})}function Ro(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:da(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:yn,depthTest:!1,depthWrite:!1})}function da(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function kd(i){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===qs||c===Ys,h=c===vi||c===xi;if(l||h)if(a.isRenderTargetTexture&&a.needsPMREMUpdate===!0){a.needsPMREMUpdate=!1;let u=t.get(a);return e===null&&(e=new bo(i)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),t.set(a,u),u.texture}else{if(t.has(a))return t.get(a).texture;{const u=a.image;if(l&&u&&u.height>0||h&&u&&r(u)){e===null&&(e=new bo(i));const d=l?e.fromEquirectangular(a):e.fromCubemap(a);return t.set(a,d),a.addEventListener("dispose",s),d.texture}else return null}}}return a}function r(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function s(a){const c=a.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function Wd(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const r=e(n);return r===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Xd(i,t,e,n){const r={},s=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const v=d.morphAttributes[g];for(let p=0,f=v.length;p<f;p++)t.remove(v[p])}d.removeEventListener("dispose",o),delete r[d.id];const m=s.get(d);m&&(t.remove(m),s.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],i.ARRAY_BUFFER);const m=u.morphAttributes;for(const g in m){const v=m[g];for(let p=0,f=v.length;p<f;p++)t.update(v[p],i.ARRAY_BUFFER)}}function l(u){const d=[],m=u.index,g=u.attributes.position;let v=0;if(m!==null){const S=m.array;v=m.version;for(let _=0,b=S.length;_<b;_+=3){const P=S[_+0],w=S[_+1],A=S[_+2];d.push(P,w,w,A,A,P)}}else if(g!==void 0){const S=g.array;v=g.version;for(let _=0,b=S.length/3-1;_<b;_+=3){const P=_+0,w=_+1,A=_+2;d.push(P,w,w,A,A,P)}}else return;const p=new(Rc(d)?Ic:Uc)(d,1);p.version=v;const f=s.get(u);f&&t.remove(f),s.set(u,p)}function h(u){const d=s.get(u);if(d){const m=u.index;m!==null&&d.version<m.version&&l(u)}else l(u);return s.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function qd(i,t,e,n){const r=n.isWebGL2;let s;function o(m){s=m}let a,c;function l(m){a=m.type,c=m.bytesPerElement}function h(m,g){i.drawElements(s,g,a,m*c),e.update(g,s,1)}function u(m,g,v){if(v===0)return;let p,f;if(r)p=i,f="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),f="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[f](s,g,a,m*c,v),e.update(g,s,v)}function d(m,g,v){if(v===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let f=0;f<v;f++)this.render(m[f]/c,g[f]);else{p.multiDrawElementsWEBGL(s,g,0,a,m,0,v);let f=0;for(let S=0;S<v;S++)f+=g[S];e.update(f,s,1)}}this.setMode=o,this.setIndex=l,this.render=h,this.renderInstances=u,this.renderMultiDraw=d}function Yd(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case i.TRIANGLES:e.triangles+=a*(s/3);break;case i.LINES:e.lines+=a*(s/2);break;case i.LINE_STRIP:e.lines+=a*(s-1);break;case i.LINE_LOOP:e.lines+=a*s;break;case i.POINTS:e.points+=a*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function $d(i,t){return i[0]-t[0]}function Zd(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Jd(i,t,e){const n={},r=new Float32Array(8),s=new WeakMap,o=new ne,a=[];for(let l=0;l<8;l++)a[l]=[l,0];function c(l,h,u){const d=l.morphTargetInfluences;if(t.isWebGL2===!0){const m=h.morphAttributes.position||h.morphAttributes.normal||h.morphAttributes.color,g=m!==void 0?m.length:0;let v=s.get(h);if(v===void 0||v.count!==g){let D=function(){V.dispose(),s.delete(h),h.removeEventListener("dispose",D)};v!==void 0&&v.texture.dispose();const S=h.morphAttributes.position!==void 0,_=h.morphAttributes.normal!==void 0,b=h.morphAttributes.color!==void 0,P=h.morphAttributes.position||[],w=h.morphAttributes.normal||[],A=h.morphAttributes.color||[];let U=0;S===!0&&(U=1),_===!0&&(U=2),b===!0&&(U=3);let x=h.attributes.position.count*U,E=1;x>t.maxTextureSize&&(E=Math.ceil(x/t.maxTextureSize),x=t.maxTextureSize);const I=new Float32Array(x*E*4*g),V=new Lc(I,x,E,g);V.type=Mn,V.needsUpdate=!0;const nt=U*4;for(let O=0;O<g;O++){const H=P[O],$=w[O],X=A[O],W=x*E*4*O;for(let Q=0;Q<H.count;Q++){const tt=Q*nt;S===!0&&(o.fromBufferAttribute(H,Q),I[W+tt+0]=o.x,I[W+tt+1]=o.y,I[W+tt+2]=o.z,I[W+tt+3]=0),_===!0&&(o.fromBufferAttribute($,Q),I[W+tt+4]=o.x,I[W+tt+5]=o.y,I[W+tt+6]=o.z,I[W+tt+7]=0),b===!0&&(o.fromBufferAttribute(X,Q),I[W+tt+8]=o.x,I[W+tt+9]=o.y,I[W+tt+10]=o.z,I[W+tt+11]=X.itemSize===4?o.w:1)}}v={count:g,texture:V,size:new rt(x,E)},s.set(h,v),h.addEventListener("dispose",D)}let p=0;for(let S=0;S<d.length;S++)p+=d[S];const f=h.morphTargetsRelative?1:1-p;u.getUniforms().setValue(i,"morphTargetBaseInfluence",f),u.getUniforms().setValue(i,"morphTargetInfluences",d),u.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),u.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{const m=d===void 0?0:d.length;let g=n[h.id];if(g===void 0||g.length!==m){g=[];for(let _=0;_<m;_++)g[_]=[_,0];n[h.id]=g}for(let _=0;_<m;_++){const b=g[_];b[0]=_,b[1]=d[_]}g.sort(Zd);for(let _=0;_<8;_++)_<m&&g[_][1]?(a[_][0]=g[_][0],a[_][1]=g[_][1]):(a[_][0]=Number.MAX_SAFE_INTEGER,a[_][1]=0);a.sort($d);const v=h.morphAttributes.position,p=h.morphAttributes.normal;let f=0;for(let _=0;_<8;_++){const b=a[_],P=b[0],w=b[1];P!==Number.MAX_SAFE_INTEGER&&w?(v&&h.getAttribute("morphTarget"+_)!==v[P]&&h.setAttribute("morphTarget"+_,v[P]),p&&h.getAttribute("morphNormal"+_)!==p[P]&&h.setAttribute("morphNormal"+_,p[P]),r[_]=w,f+=w):(v&&h.hasAttribute("morphTarget"+_)===!0&&h.deleteAttribute("morphTarget"+_),p&&h.hasAttribute("morphNormal"+_)===!0&&h.deleteAttribute("morphNormal"+_),r[_]=0)}const S=h.morphTargetsRelative?1:1-f;u.getUniforms().setValue(i,"morphTargetBaseInfluence",S),u.getUniforms().setValue(i,"morphTargetInfluences",r)}}return{update:c}}function Kd(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(r.get(u)!==l&&(t.update(u),r.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==l&&(d.update(),r.set(d,l))}return u}function o(){r=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:o}}class Gc extends Pe{constructor(t,e,n,r,s,o,a,c,l,h){if(h=h!==void 0?h:On,h!==On&&h!==Mi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===On&&(n=xn),n===void 0&&h===Mi&&(n=Fn),super(null,r,s,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:Re,this.minFilter=c!==void 0?c:Re,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Hc=new Pe,Vc=new Gc(1,1);Vc.compareFunction=wc;const kc=new Lc,Wc=new Ih,Xc=new Oc,Co=[],Po=[],Lo=new Float32Array(16),Do=new Float32Array(9),Uo=new Float32Array(4);function Ei(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=Co[r];if(s===void 0&&(s=new Float32Array(r),Co[r]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,i[o].toArray(s,a)}return s}function ue(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function fe(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Jr(i,t){let e=Po[t];e===void 0&&(e=new Int32Array(t),Po[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function jd(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Qd(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2fv(this.addr,t),fe(e,t)}}function tp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(ue(e,t))return;i.uniform3fv(this.addr,t),fe(e,t)}}function ep(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4fv(this.addr,t),fe(e,t)}}function np(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Uo.set(n),i.uniformMatrix2fv(this.addr,!1,Uo),fe(e,n)}}function ip(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Do.set(n),i.uniformMatrix3fv(this.addr,!1,Do),fe(e,n)}}function rp(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(ue(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),fe(e,t)}else{if(ue(e,n))return;Lo.set(n),i.uniformMatrix4fv(this.addr,!1,Lo),fe(e,n)}}function sp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ap(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2iv(this.addr,t),fe(e,t)}}function op(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ue(e,t))return;i.uniform3iv(this.addr,t),fe(e,t)}}function cp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4iv(this.addr,t),fe(e,t)}}function lp(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function hp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(ue(e,t))return;i.uniform2uiv(this.addr,t),fe(e,t)}}function up(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(ue(e,t))return;i.uniform3uiv(this.addr,t),fe(e,t)}}function fp(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(ue(e,t))return;i.uniform4uiv(this.addr,t),fe(e,t)}}function dp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);const s=this.type===i.SAMPLER_2D_SHADOW?Vc:Hc;e.setTexture2D(t||s,r)}function pp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||Wc,r)}function mp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Xc,r)}function gp(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||kc,r)}function _p(i){switch(i){case 5126:return jd;case 35664:return Qd;case 35665:return tp;case 35666:return ep;case 35674:return np;case 35675:return ip;case 35676:return rp;case 5124:case 35670:return sp;case 35667:case 35671:return ap;case 35668:case 35672:return op;case 35669:case 35673:return cp;case 5125:return lp;case 36294:return hp;case 36295:return up;case 36296:return fp;case 35678:case 36198:case 36298:case 36306:case 35682:return dp;case 35679:case 36299:case 36307:return pp;case 35680:case 36300:case 36308:case 36293:return mp;case 36289:case 36303:case 36311:case 36292:return gp}}function vp(i,t){i.uniform1fv(this.addr,t)}function xp(i,t){const e=Ei(t,this.size,2);i.uniform2fv(this.addr,e)}function Mp(i,t){const e=Ei(t,this.size,3);i.uniform3fv(this.addr,e)}function Sp(i,t){const e=Ei(t,this.size,4);i.uniform4fv(this.addr,e)}function yp(i,t){const e=Ei(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ep(i,t){const e=Ei(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Tp(i,t){const e=Ei(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function bp(i,t){i.uniform1iv(this.addr,t)}function Ap(i,t){i.uniform2iv(this.addr,t)}function wp(i,t){i.uniform3iv(this.addr,t)}function Rp(i,t){i.uniform4iv(this.addr,t)}function Cp(i,t){i.uniform1uiv(this.addr,t)}function Pp(i,t){i.uniform2uiv(this.addr,t)}function Lp(i,t){i.uniform3uiv(this.addr,t)}function Dp(i,t){i.uniform4uiv(this.addr,t)}function Up(i,t,e){const n=this.cache,r=t.length,s=Jr(e,r);ue(n,s)||(i.uniform1iv(this.addr,s),fe(n,s));for(let o=0;o!==r;++o)e.setTexture2D(t[o]||Hc,s[o])}function Ip(i,t,e){const n=this.cache,r=t.length,s=Jr(e,r);ue(n,s)||(i.uniform1iv(this.addr,s),fe(n,s));for(let o=0;o!==r;++o)e.setTexture3D(t[o]||Wc,s[o])}function Np(i,t,e){const n=this.cache,r=t.length,s=Jr(e,r);ue(n,s)||(i.uniform1iv(this.addr,s),fe(n,s));for(let o=0;o!==r;++o)e.setTextureCube(t[o]||Xc,s[o])}function Fp(i,t,e){const n=this.cache,r=t.length,s=Jr(e,r);ue(n,s)||(i.uniform1iv(this.addr,s),fe(n,s));for(let o=0;o!==r;++o)e.setTexture2DArray(t[o]||kc,s[o])}function Op(i){switch(i){case 5126:return vp;case 35664:return xp;case 35665:return Mp;case 35666:return Sp;case 35674:return yp;case 35675:return Ep;case 35676:return Tp;case 5124:case 35670:return bp;case 35667:case 35671:return Ap;case 35668:case 35672:return wp;case 35669:case 35673:return Rp;case 5125:return Cp;case 36294:return Pp;case 36295:return Lp;case 36296:return Dp;case 35678:case 36198:case 36298:case 36306:case 35682:return Up;case 35679:case 36299:case 36307:return Ip;case 35680:case 36300:case 36308:case 36293:return Np;case 36289:case 36303:case 36311:case 36292:return Fp}}class Bp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=_p(e.type)}}class zp{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Op(e.type)}}class Gp{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(t,e[a.id],n)}}}const Ls=/(\w+)(\])?(\[|\.)?/g;function Io(i,t){i.seq.push(t),i.map[t.id]=t}function Hp(i,t,e){const n=i.name,r=n.length;for(Ls.lastIndex=0;;){const s=Ls.exec(n),o=Ls.lastIndex;let a=s[1];const c=s[2]==="]",l=s[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===r){Io(e,l===void 0?new Bp(a,i,t):new zp(a,i,t));break}else{let u=e.map[a];u===void 0&&(u=new Gp(a),Io(e,u)),e=u}}}class Fr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),o=t.getUniformLocation(e,s.name);Hp(s,o,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,o=e.length;s!==o;++s){const a=e[s],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const o=t[r];o.id in e&&n.push(o)}return n}}function No(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const Vp=37297;let kp=0;function Wp(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=r;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function Xp(i){const t=$t.getPrimaries($t.workingColorSpace),e=$t.getPrimaries(i);let n;switch(t===e?n="":t===Gr&&e===zr?n="LinearDisplayP3ToLinearSRGB":t===zr&&e===Gr&&(n="LinearSRGBToLinearDisplayP3"),i){case fn:case qr:return[n,"LinearTransferOETF"];case ge:case la:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Fo(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+Wp(i.getShaderSource(t),o)}else return r}function qp(i,t){const e=Xp(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Yp(i,t){let e;switch(t){case Wl:e="Linear";break;case Xl:e="Reinhard";break;case ql:e="OptimizedCineon";break;case Yl:e="ACESFilmic";break;case Zl:e="AgX";break;case $l:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function $p(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(di).join(`
`)}function Zp(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(di).join(`
`)}function Jp(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Kp(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),o=s.name;let a=1;s.type===i.FLOAT_MAT2&&(a=2),s.type===i.FLOAT_MAT3&&(a=3),s.type===i.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:i.getAttribLocation(t,o),locationSize:a}}return e}function di(i){return i!==""}function Oo(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Bo(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const jp=/^[ \t]*#include +<([\w\d./]+)>/gm;function Qs(i){return i.replace(jp,tm)}const Qp=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function tm(i,t){let e=zt[t];if(e===void 0){const n=Qp.get(t);if(n!==void 0)e=zt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Qs(e)}const em=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function zo(i){return i.replace(em,nm)}function nm(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Go(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function im(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===mc?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===vl?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Je&&(t="SHADOWMAP_TYPE_VSM"),t}function rm(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case vi:case xi:t="ENVMAP_TYPE_CUBE";break;case Xr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function sm(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case xi:t="ENVMAP_MODE_REFRACTION";break}return t}function am(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case gc:t="ENVMAP_BLENDING_MULTIPLY";break;case Vl:t="ENVMAP_BLENDING_MIX";break;case kl:t="ENVMAP_BLENDING_ADD";break}return t}function om(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function cm(i,t,e,n){const r=i.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=im(e),l=rm(e),h=sm(e),u=am(e),d=om(e),m=e.isWebGL2?"":$p(e),g=Zp(e),v=Jp(s),p=r.createProgram();let f,S,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(di).join(`
`),f.length>0&&(f+=`
`),S=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(di).join(`
`),S.length>0&&(S+=`
`)):(f=[Go(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(di).join(`
`),S=[m,Go(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==En?"#define TONE_MAPPING":"",e.toneMapping!==En?zt.tonemapping_pars_fragment:"",e.toneMapping!==En?Yp("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",zt.colorspace_pars_fragment,qp("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(di).join(`
`)),o=Qs(o),o=Oo(o,e),o=Bo(o,e),a=Qs(a),a=Oo(a,e),a=Bo(a,e),o=zo(o),a=zo(a),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,f=[g,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,S=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===io?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===io?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+S);const b=_+f+o,P=_+S+a,w=No(r,r.VERTEX_SHADER,b),A=No(r,r.FRAGMENT_SHADER,P);r.attachShader(p,w),r.attachShader(p,A),e.index0AttributeName!==void 0?r.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(p,0,"position"),r.linkProgram(p);function U(V){if(i.debug.checkShaderErrors){const nt=r.getProgramInfoLog(p).trim(),D=r.getShaderInfoLog(w).trim(),O=r.getShaderInfoLog(A).trim();let H=!0,$=!0;if(r.getProgramParameter(p,r.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,p,w,A);else{const X=Fo(r,w,"vertex"),W=Fo(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(p,r.VALIDATE_STATUS)+`

Program Info Log: `+nt+`
`+X+`
`+W)}else nt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",nt):(D===""||O==="")&&($=!1);$&&(V.diagnostics={runnable:H,programLog:nt,vertexShader:{log:D,prefix:f},fragmentShader:{log:O,prefix:S}})}r.deleteShader(w),r.deleteShader(A),x=new Fr(r,p),E=Kp(r,p)}let x;this.getUniforms=function(){return x===void 0&&U(this),x};let E;this.getAttributes=function(){return E===void 0&&U(this),E};let I=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return I===!1&&(I=r.getProgramParameter(p,Vp)),I},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=kp++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=w,this.fragmentShader=A,this}let lm=0;class hm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new um(t),e.set(t,n)),n}}class um{constructor(t){this.id=lm++,this.code=t,this.usedTimes=0}}function fm(i,t,e,n,r,s,o){const a=new ua,c=new hm,l=[],h=r.isWebGL2,u=r.logarithmicDepthBuffer,d=r.vertexTextures;let m=r.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(x){return x===0?"uv":`uv${x}`}function p(x,E,I,V,nt){const D=V.fog,O=nt.geometry,H=x.isMeshStandardMaterial?V.environment:null,$=(x.isMeshStandardMaterial?e:t).get(x.envMap||H),X=$&&$.mapping===Xr?$.image.height:null,W=g[x.type];x.precision!==null&&(m=r.getMaxPrecision(x.precision),m!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",m,"instead."));const Q=O.morphAttributes.position||O.morphAttributes.normal||O.morphAttributes.color,tt=Q!==void 0?Q.length:0;let ut=0;O.morphAttributes.position!==void 0&&(ut=1),O.morphAttributes.normal!==void 0&&(ut=2),O.morphAttributes.color!==void 0&&(ut=3);let k,J,ft,xt;if(W){const Te=Ke[W];k=Te.vertexShader,J=Te.fragmentShader}else k=x.vertexShader,J=x.fragmentShader,c.update(x),ft=c.getVertexShaderID(x),xt=c.getFragmentShaderID(x);const mt=i.getRenderTarget(),Rt=nt.isInstancedMesh===!0,Ut=nt.isBatchedMesh===!0,Mt=!!x.map,Lt=!!x.matcap,C=!!$,st=!!x.aoMap,Y=!!x.lightMap,it=!!x.bumpMap,q=!!x.normalMap,yt=!!x.displacementMap,dt=!!x.emissiveMap,y=!!x.metalnessMap,M=!!x.roughnessMap,F=x.anisotropy>0,et=x.clearcoat>0,K=x.iridescence>0,Z=x.sheen>0,vt=x.transmission>0,ct=F&&!!x.anisotropyMap,gt=et&&!!x.clearcoatMap,bt=et&&!!x.clearcoatNormalMap,Ft=et&&!!x.clearcoatRoughnessMap,j=K&&!!x.iridescenceMap,Xt=K&&!!x.iridescenceThicknessMap,Wt=Z&&!!x.sheenColorMap,Dt=Z&&!!x.sheenRoughnessMap,Et=!!x.specularMap,_t=!!x.specularColorMap,Bt=!!x.specularIntensityMap,qt=vt&&!!x.transmissionMap,se=vt&&!!x.thicknessMap,Ht=!!x.gradientMap,at=!!x.alphaMap,L=x.alphaTest>0,lt=!!x.alphaHash,ht=!!x.extensions,Ct=!!O.attributes.uv1,At=!!O.attributes.uv2,Kt=!!O.attributes.uv3;let jt=En;return x.toneMapped&&(mt===null||mt.isXRRenderTarget===!0)&&(jt=i.toneMapping),{isWebGL2:h,shaderID:W,shaderType:x.type,shaderName:x.name,vertexShader:k,fragmentShader:J,defines:x.defines,customVertexShaderID:ft,customFragmentShaderID:xt,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:m,batching:Ut,instancing:Rt,instancingColor:Rt&&nt.instanceColor!==null,supportsVertexTextures:d,outputColorSpace:mt===null?i.outputColorSpace:mt.isXRRenderTarget===!0?mt.texture.colorSpace:fn,map:Mt,matcap:Lt,envMap:C,envMapMode:C&&$.mapping,envMapCubeUVHeight:X,aoMap:st,lightMap:Y,bumpMap:it,normalMap:q,displacementMap:d&&yt,emissiveMap:dt,normalMapObjectSpace:q&&x.normalMapType===oh,normalMapTangentSpace:q&&x.normalMapType===Ac,metalnessMap:y,roughnessMap:M,anisotropy:F,anisotropyMap:ct,clearcoat:et,clearcoatMap:gt,clearcoatNormalMap:bt,clearcoatRoughnessMap:Ft,iridescence:K,iridescenceMap:j,iridescenceThicknessMap:Xt,sheen:Z,sheenColorMap:Wt,sheenRoughnessMap:Dt,specularMap:Et,specularColorMap:_t,specularIntensityMap:Bt,transmission:vt,transmissionMap:qt,thicknessMap:se,gradientMap:Ht,opaque:x.transparent===!1&&x.blending===mi,alphaMap:at,alphaTest:L,alphaHash:lt,combine:x.combine,mapUv:Mt&&v(x.map.channel),aoMapUv:st&&v(x.aoMap.channel),lightMapUv:Y&&v(x.lightMap.channel),bumpMapUv:it&&v(x.bumpMap.channel),normalMapUv:q&&v(x.normalMap.channel),displacementMapUv:yt&&v(x.displacementMap.channel),emissiveMapUv:dt&&v(x.emissiveMap.channel),metalnessMapUv:y&&v(x.metalnessMap.channel),roughnessMapUv:M&&v(x.roughnessMap.channel),anisotropyMapUv:ct&&v(x.anisotropyMap.channel),clearcoatMapUv:gt&&v(x.clearcoatMap.channel),clearcoatNormalMapUv:bt&&v(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Ft&&v(x.clearcoatRoughnessMap.channel),iridescenceMapUv:j&&v(x.iridescenceMap.channel),iridescenceThicknessMapUv:Xt&&v(x.iridescenceThicknessMap.channel),sheenColorMapUv:Wt&&v(x.sheenColorMap.channel),sheenRoughnessMapUv:Dt&&v(x.sheenRoughnessMap.channel),specularMapUv:Et&&v(x.specularMap.channel),specularColorMapUv:_t&&v(x.specularColorMap.channel),specularIntensityMapUv:Bt&&v(x.specularIntensityMap.channel),transmissionMapUv:qt&&v(x.transmissionMap.channel),thicknessMapUv:se&&v(x.thicknessMap.channel),alphaMapUv:at&&v(x.alphaMap.channel),vertexTangents:!!O.attributes.tangent&&(q||F),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!O.attributes.color&&O.attributes.color.itemSize===4,vertexUv1s:Ct,vertexUv2s:At,vertexUv3s:Kt,pointsUvs:nt.isPoints===!0&&!!O.attributes.uv&&(Mt||at),fog:!!D,useFog:x.fog===!0,fogExp2:D&&D.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:nt.isSkinnedMesh===!0,morphTargets:O.morphAttributes.position!==void 0,morphNormals:O.morphAttributes.normal!==void 0,morphColors:O.morphAttributes.color!==void 0,morphTargetsCount:tt,morphTextureStride:ut,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:x.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:jt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Mt&&x.map.isVideoTexture===!0&&$t.getTransfer(x.map.colorSpace)===ee,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===je,flipSided:x.side===Ce,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionDerivatives:ht&&x.extensions.derivatives===!0,extensionFragDepth:ht&&x.extensions.fragDepth===!0,extensionDrawBuffers:ht&&x.extensions.drawBuffers===!0,extensionShaderTextureLOD:ht&&x.extensions.shaderTextureLOD===!0,extensionClipCullDistance:ht&&x.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:h||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:h||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:h||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()}}function f(x){const E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(const I in x.defines)E.push(I),E.push(x.defines[I]);return x.isRawShaderMaterial===!1&&(S(E,x),_(E,x),E.push(i.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function S(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function _(x,E){a.disableAll(),E.isWebGL2&&a.enable(0),E.supportsVertexTextures&&a.enable(1),E.instancing&&a.enable(2),E.instancingColor&&a.enable(3),E.matcap&&a.enable(4),E.envMap&&a.enable(5),E.normalMapObjectSpace&&a.enable(6),E.normalMapTangentSpace&&a.enable(7),E.clearcoat&&a.enable(8),E.iridescence&&a.enable(9),E.alphaTest&&a.enable(10),E.vertexColors&&a.enable(11),E.vertexAlphas&&a.enable(12),E.vertexUv1s&&a.enable(13),E.vertexUv2s&&a.enable(14),E.vertexUv3s&&a.enable(15),E.vertexTangents&&a.enable(16),E.anisotropy&&a.enable(17),E.alphaHash&&a.enable(18),E.batching&&a.enable(19),x.push(a.mask),a.disableAll(),E.fog&&a.enable(0),E.useFog&&a.enable(1),E.flatShading&&a.enable(2),E.logarithmicDepthBuffer&&a.enable(3),E.skinning&&a.enable(4),E.morphTargets&&a.enable(5),E.morphNormals&&a.enable(6),E.morphColors&&a.enable(7),E.premultipliedAlpha&&a.enable(8),E.shadowMapEnabled&&a.enable(9),E.useLegacyLights&&a.enable(10),E.doubleSided&&a.enable(11),E.flipSided&&a.enable(12),E.useDepthPacking&&a.enable(13),E.dithering&&a.enable(14),E.transmission&&a.enable(15),E.sheen&&a.enable(16),E.opaque&&a.enable(17),E.pointsUvs&&a.enable(18),E.decodeVideoTexture&&a.enable(19),x.push(a.mask)}function b(x){const E=g[x.type];let I;if(E){const V=Ke[E];I=Yh.clone(V.uniforms)}else I=x.uniforms;return I}function P(x,E){let I;for(let V=0,nt=l.length;V<nt;V++){const D=l[V];if(D.cacheKey===E){I=D,++I.usedTimes;break}}return I===void 0&&(I=new cm(i,E,x,s),l.push(I)),I}function w(x){if(--x.usedTimes===0){const E=l.indexOf(x);l[E]=l[l.length-1],l.pop(),x.destroy()}}function A(x){c.remove(x)}function U(){c.dispose()}return{getParameters:p,getProgramCacheKey:f,getUniforms:b,acquireProgram:P,releaseProgram:w,releaseShaderCache:A,programs:l,dispose:U}}function dm(){let i=new WeakMap;function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function e(s){i.delete(s)}function n(s,o,a){i.get(s)[o]=a}function r(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:r}}function pm(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function Ho(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function Vo(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function o(u,d,m,g,v,p){let f=i[t];return f===void 0?(f={id:u.id,object:u,geometry:d,material:m,groupOrder:g,renderOrder:u.renderOrder,z:v,group:p},i[t]=f):(f.id=u.id,f.object=u,f.geometry=d,f.material=m,f.groupOrder=g,f.renderOrder=u.renderOrder,f.z=v,f.group=p),t++,f}function a(u,d,m,g,v,p){const f=o(u,d,m,g,v,p);m.transmission>0?n.push(f):m.transparent===!0?r.push(f):e.push(f)}function c(u,d,m,g,v,p){const f=o(u,d,m,g,v,p);m.transmission>0?n.unshift(f):m.transparent===!0?r.unshift(f):e.unshift(f)}function l(u,d){e.length>1&&e.sort(u||pm),n.length>1&&n.sort(d||Ho),r.length>1&&r.sort(d||Ho)}function h(){for(let u=t,d=i.length;u<d;u++){const m=i[u];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:a,unshift:c,finish:h,sort:l}}function mm(){let i=new WeakMap;function t(n,r){const s=i.get(n);let o;return s===void 0?(o=new Vo,i.set(n,[o])):r>=s.length?(o=new Vo,s.push(o)):o=s[r],o}function e(){i=new WeakMap}return{get:t,dispose:e}}function gm(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new R,color:new Nt};break;case"SpotLight":e={position:new R,direction:new R,color:new Nt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new R,color:new Nt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new R,skyColor:new Nt,groundColor:new Nt};break;case"RectAreaLight":e={color:new Nt,position:new R,halfWidth:new R,halfHeight:new R};break}return i[t.id]=e,e}}}function _m(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let vm=0;function xm(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Mm(i,t){const e=new gm,n=_m(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)r.probe.push(new R);const s=new R,o=new Jt,a=new Jt;function c(h,u){let d=0,m=0,g=0;for(let V=0;V<9;V++)r.probe[V].set(0,0,0);let v=0,p=0,f=0,S=0,_=0,b=0,P=0,w=0,A=0,U=0,x=0;h.sort(xm);const E=u===!0?Math.PI:1;for(let V=0,nt=h.length;V<nt;V++){const D=h[V],O=D.color,H=D.intensity,$=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=O.r*H*E,m+=O.g*H*E,g+=O.b*H*E;else if(D.isLightProbe){for(let W=0;W<9;W++)r.probe[W].addScaledVector(D.sh.coefficients[W],H);x++}else if(D.isDirectionalLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity*E),D.castShadow){const Q=D.shadow,tt=n.get(D);tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,r.directionalShadow[v]=tt,r.directionalShadowMap[v]=X,r.directionalShadowMatrix[v]=D.shadow.matrix,b++}r.directional[v]=W,v++}else if(D.isSpotLight){const W=e.get(D);W.position.setFromMatrixPosition(D.matrixWorld),W.color.copy(O).multiplyScalar(H*E),W.distance=$,W.coneCos=Math.cos(D.angle),W.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),W.decay=D.decay,r.spot[f]=W;const Q=D.shadow;if(D.map&&(r.spotLightMap[A]=D.map,A++,Q.updateMatrices(D),D.castShadow&&U++),r.spotLightMatrix[f]=Q.matrix,D.castShadow){const tt=n.get(D);tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,r.spotShadow[f]=tt,r.spotShadowMap[f]=X,w++}f++}else if(D.isRectAreaLight){const W=e.get(D);W.color.copy(O).multiplyScalar(H),W.halfWidth.set(D.width*.5,0,0),W.halfHeight.set(0,D.height*.5,0),r.rectArea[S]=W,S++}else if(D.isPointLight){const W=e.get(D);if(W.color.copy(D.color).multiplyScalar(D.intensity*E),W.distance=D.distance,W.decay=D.decay,D.castShadow){const Q=D.shadow,tt=n.get(D);tt.shadowBias=Q.bias,tt.shadowNormalBias=Q.normalBias,tt.shadowRadius=Q.radius,tt.shadowMapSize=Q.mapSize,tt.shadowCameraNear=Q.camera.near,tt.shadowCameraFar=Q.camera.far,r.pointShadow[p]=tt,r.pointShadowMap[p]=X,r.pointShadowMatrix[p]=D.shadow.matrix,P++}r.point[p]=W,p++}else if(D.isHemisphereLight){const W=e.get(D);W.skyColor.copy(D.color).multiplyScalar(H*E),W.groundColor.copy(D.groundColor).multiplyScalar(H*E),r.hemi[_]=W,_++}}S>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ot.LTC_FLOAT_1,r.rectAreaLTC2=ot.LTC_FLOAT_2):(r.rectAreaLTC1=ot.LTC_HALF_1,r.rectAreaLTC2=ot.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ot.LTC_FLOAT_1,r.rectAreaLTC2=ot.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=ot.LTC_HALF_1,r.rectAreaLTC2=ot.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=d,r.ambient[1]=m,r.ambient[2]=g;const I=r.hash;(I.directionalLength!==v||I.pointLength!==p||I.spotLength!==f||I.rectAreaLength!==S||I.hemiLength!==_||I.numDirectionalShadows!==b||I.numPointShadows!==P||I.numSpotShadows!==w||I.numSpotMaps!==A||I.numLightProbes!==x)&&(r.directional.length=v,r.spot.length=f,r.rectArea.length=S,r.point.length=p,r.hemi.length=_,r.directionalShadow.length=b,r.directionalShadowMap.length=b,r.pointShadow.length=P,r.pointShadowMap.length=P,r.spotShadow.length=w,r.spotShadowMap.length=w,r.directionalShadowMatrix.length=b,r.pointShadowMatrix.length=P,r.spotLightMatrix.length=w+A-U,r.spotLightMap.length=A,r.numSpotLightShadowsWithMaps=U,r.numLightProbes=x,I.directionalLength=v,I.pointLength=p,I.spotLength=f,I.rectAreaLength=S,I.hemiLength=_,I.numDirectionalShadows=b,I.numPointShadows=P,I.numSpotShadows=w,I.numSpotMaps=A,I.numLightProbes=x,r.version=vm++)}function l(h,u){let d=0,m=0,g=0,v=0,p=0;const f=u.matrixWorldInverse;for(let S=0,_=h.length;S<_;S++){const b=h[S];if(b.isDirectionalLight){const P=r.directional[d];P.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),P.direction.sub(s),P.direction.transformDirection(f),d++}else if(b.isSpotLight){const P=r.spot[g];P.position.setFromMatrixPosition(b.matrixWorld),P.position.applyMatrix4(f),P.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),P.direction.sub(s),P.direction.transformDirection(f),g++}else if(b.isRectAreaLight){const P=r.rectArea[v];P.position.setFromMatrixPosition(b.matrixWorld),P.position.applyMatrix4(f),a.identity(),o.copy(b.matrixWorld),o.premultiply(f),a.extractRotation(o),P.halfWidth.set(b.width*.5,0,0),P.halfHeight.set(0,b.height*.5,0),P.halfWidth.applyMatrix4(a),P.halfHeight.applyMatrix4(a),v++}else if(b.isPointLight){const P=r.point[m];P.position.setFromMatrixPosition(b.matrixWorld),P.position.applyMatrix4(f),m++}else if(b.isHemisphereLight){const P=r.hemi[p];P.direction.setFromMatrixPosition(b.matrixWorld),P.direction.transformDirection(f),p++}}}return{setup:c,setupView:l,state:r}}function ko(i,t){const e=new Mm(i,t),n=[],r=[];function s(){n.length=0,r.length=0}function o(u){n.push(u)}function a(u){r.push(u)}function c(u){e.setup(n,u)}function l(u){e.setupView(n,u)}return{init:s,state:{lightsArray:n,shadowsArray:r,lights:e},setupLights:c,setupLightsView:l,pushLight:o,pushShadow:a}}function Sm(i,t){let e=new WeakMap;function n(s,o=0){const a=e.get(s);let c;return a===void 0?(c=new ko(i,t),e.set(s,[c])):o>=a.length?(c=new ko(i,t),a.push(c)):c=a[o],c}function r(){e=new WeakMap}return{get:n,dispose:r}}class ym extends dn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=sh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Em extends dn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Tm=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bm=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Am(i,t,e){let n=new fa;const r=new rt,s=new rt,o=new ne,a=new ym({depthPacking:ah}),c=new Em,l={},h=e.maxTextureSize,u={[bn]:Ce,[Ce]:bn,[je]:je},d=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:Tm,fragmentShader:bm}),m=d.clone();m.defines.HORIZONTAL_PASS=1;const g=new ve;g.setAttribute("position",new Ve(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const v=new Tt(g,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=mc;let f=this.type;this.render=function(w,A,U){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;const x=i.getRenderTarget(),E=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),V=i.state;V.setBlending(yn),V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);const nt=f!==Je&&this.type===Je,D=f===Je&&this.type!==Je;for(let O=0,H=w.length;O<H;O++){const $=w[O],X=$.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",$,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;r.copy(X.mapSize);const W=X.getFrameExtents();if(r.multiply(W),s.copy(X.mapSize),(r.x>h||r.y>h)&&(r.x>h&&(s.x=Math.floor(h/W.x),r.x=s.x*W.x,X.mapSize.x=s.x),r.y>h&&(s.y=Math.floor(h/W.y),r.y=s.y*W.y,X.mapSize.y=s.y)),X.map===null||nt===!0||D===!0){const tt=this.type!==Je?{minFilter:Re,magFilter:Re}:{};X.map!==null&&X.map.dispose(),X.map=new zn(r.x,r.y,tt),X.map.texture.name=$.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const Q=X.getViewportCount();for(let tt=0;tt<Q;tt++){const ut=X.getViewport(tt);o.set(s.x*ut.x,s.y*ut.y,s.x*ut.z,s.y*ut.w),V.viewport(o),X.updateMatrices($,tt),n=X.getFrustum(),b(A,U,X.camera,$,this.type)}X.isPointLightShadow!==!0&&this.type===Je&&S(X,U),X.needsUpdate=!1}f=this.type,p.needsUpdate=!1,i.setRenderTarget(x,E,I)};function S(w,A){const U=t.update(v);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,m.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,m.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new zn(r.x,r.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,U,d,v,null),m.uniforms.shadow_pass.value=w.mapPass.texture,m.uniforms.resolution.value=w.mapSize,m.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,U,m,v,null)}function _(w,A,U,x){let E=null;const I=U.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)E=I;else if(E=U.isPointLight===!0?c:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const V=E.uuid,nt=A.uuid;let D=l[V];D===void 0&&(D={},l[V]=D);let O=D[nt];O===void 0&&(O=E.clone(),D[nt]=O,A.addEventListener("dispose",P)),E=O}if(E.visible=A.visible,E.wireframe=A.wireframe,x===Je?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:u[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,U.isPointLight===!0&&E.isMeshDistanceMaterial===!0){const V=i.properties.get(E);V.light=U}return E}function b(w,A,U,x,E){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&E===Je)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(U.matrixWorldInverse,w.matrixWorld);const nt=t.update(w),D=w.material;if(Array.isArray(D)){const O=nt.groups;for(let H=0,$=O.length;H<$;H++){const X=O[H],W=D[X.materialIndex];if(W&&W.visible){const Q=_(w,W,x,E);w.onBeforeShadow(i,w,A,U,nt,Q,X),i.renderBufferDirect(U,null,nt,Q,w,X),w.onAfterShadow(i,w,A,U,nt,Q,X)}}}else if(D.visible){const O=_(w,D,x,E);w.onBeforeShadow(i,w,A,U,nt,O,null),i.renderBufferDirect(U,null,nt,O,w,null),w.onAfterShadow(i,w,A,U,nt,O,null)}}const V=w.children;for(let nt=0,D=V.length;nt<D;nt++)b(V[nt],A,U,x,E)}function P(w){w.target.removeEventListener("dispose",P);for(const U in l){const x=l[U],E=w.target.uuid;E in x&&(x[E].dispose(),delete x[E])}}}function wm(i,t,e){const n=e.isWebGL2;function r(){let L=!1;const lt=new ne;let ht=null;const Ct=new ne(0,0,0,0);return{setMask:function(At){ht!==At&&!L&&(i.colorMask(At,At,At,At),ht=At)},setLocked:function(At){L=At},setClear:function(At,Kt,jt,de,Te){Te===!0&&(At*=de,Kt*=de,jt*=de),lt.set(At,Kt,jt,de),Ct.equals(lt)===!1&&(i.clearColor(At,Kt,jt,de),Ct.copy(lt))},reset:function(){L=!1,ht=null,Ct.set(-1,0,0,0)}}}function s(){let L=!1,lt=null,ht=null,Ct=null;return{setTest:function(At){At?Ut(i.DEPTH_TEST):Mt(i.DEPTH_TEST)},setMask:function(At){lt!==At&&!L&&(i.depthMask(At),lt=At)},setFunc:function(At){if(ht!==At){switch(At){case Nl:i.depthFunc(i.NEVER);break;case Fl:i.depthFunc(i.ALWAYS);break;case Ol:i.depthFunc(i.LESS);break;case Or:i.depthFunc(i.LEQUAL);break;case Bl:i.depthFunc(i.EQUAL);break;case zl:i.depthFunc(i.GEQUAL);break;case Gl:i.depthFunc(i.GREATER);break;case Hl:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}ht=At}},setLocked:function(At){L=At},setClear:function(At){Ct!==At&&(i.clearDepth(At),Ct=At)},reset:function(){L=!1,lt=null,ht=null,Ct=null}}}function o(){let L=!1,lt=null,ht=null,Ct=null,At=null,Kt=null,jt=null,de=null,Te=null;return{setTest:function(Qt){L||(Qt?Ut(i.STENCIL_TEST):Mt(i.STENCIL_TEST))},setMask:function(Qt){lt!==Qt&&!L&&(i.stencilMask(Qt),lt=Qt)},setFunc:function(Qt,be,Ze){(ht!==Qt||Ct!==be||At!==Ze)&&(i.stencilFunc(Qt,be,Ze),ht=Qt,Ct=be,At=Ze)},setOp:function(Qt,be,Ze){(Kt!==Qt||jt!==be||de!==Ze)&&(i.stencilOp(Qt,be,Ze),Kt=Qt,jt=be,de=Ze)},setLocked:function(Qt){L=Qt},setClear:function(Qt){Te!==Qt&&(i.clearStencil(Qt),Te=Qt)},reset:function(){L=!1,lt=null,ht=null,Ct=null,At=null,Kt=null,jt=null,de=null,Te=null}}}const a=new r,c=new s,l=new o,h=new WeakMap,u=new WeakMap;let d={},m={},g=new WeakMap,v=[],p=null,f=!1,S=null,_=null,b=null,P=null,w=null,A=null,U=null,x=new Nt(0,0,0),E=0,I=!1,V=null,nt=null,D=null,O=null,H=null;const $=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let X=!1,W=0;const Q=i.getParameter(i.VERSION);Q.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(Q)[1]),X=W>=1):Q.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(Q)[1]),X=W>=2);let tt=null,ut={};const k=i.getParameter(i.SCISSOR_BOX),J=i.getParameter(i.VIEWPORT),ft=new ne().fromArray(k),xt=new ne().fromArray(J);function mt(L,lt,ht,Ct){const At=new Uint8Array(4),Kt=i.createTexture();i.bindTexture(L,Kt),i.texParameteri(L,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(L,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let jt=0;jt<ht;jt++)n&&(L===i.TEXTURE_3D||L===i.TEXTURE_2D_ARRAY)?i.texImage3D(lt,0,i.RGBA,1,1,Ct,0,i.RGBA,i.UNSIGNED_BYTE,At):i.texImage2D(lt+jt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,At);return Kt}const Rt={};Rt[i.TEXTURE_2D]=mt(i.TEXTURE_2D,i.TEXTURE_2D,1),Rt[i.TEXTURE_CUBE_MAP]=mt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Rt[i.TEXTURE_2D_ARRAY]=mt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Rt[i.TEXTURE_3D]=mt(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),a.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Ut(i.DEPTH_TEST),c.setFunc(Or),dt(!1),y(ba),Ut(i.CULL_FACE),q(yn);function Ut(L){d[L]!==!0&&(i.enable(L),d[L]=!0)}function Mt(L){d[L]!==!1&&(i.disable(L),d[L]=!1)}function Lt(L,lt){return m[L]!==lt?(i.bindFramebuffer(L,lt),m[L]=lt,n&&(L===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=lt),L===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=lt)),!0):!1}function C(L,lt){let ht=v,Ct=!1;if(L)if(ht=g.get(lt),ht===void 0&&(ht=[],g.set(lt,ht)),L.isWebGLMultipleRenderTargets){const At=L.texture;if(ht.length!==At.length||ht[0]!==i.COLOR_ATTACHMENT0){for(let Kt=0,jt=At.length;Kt<jt;Kt++)ht[Kt]=i.COLOR_ATTACHMENT0+Kt;ht.length=At.length,Ct=!0}}else ht[0]!==i.COLOR_ATTACHMENT0&&(ht[0]=i.COLOR_ATTACHMENT0,Ct=!0);else ht[0]!==i.BACK&&(ht[0]=i.BACK,Ct=!0);Ct&&(e.isWebGL2?i.drawBuffers(ht):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(ht))}function st(L){return p!==L?(i.useProgram(L),p=L,!0):!1}const Y={[In]:i.FUNC_ADD,[Ml]:i.FUNC_SUBTRACT,[Sl]:i.FUNC_REVERSE_SUBTRACT};if(n)Y[Ra]=i.MIN,Y[Ca]=i.MAX;else{const L=t.get("EXT_blend_minmax");L!==null&&(Y[Ra]=L.MIN_EXT,Y[Ca]=L.MAX_EXT)}const it={[yl]:i.ZERO,[El]:i.ONE,[Tl]:i.SRC_COLOR,[Ws]:i.SRC_ALPHA,[Pl]:i.SRC_ALPHA_SATURATE,[Rl]:i.DST_COLOR,[Al]:i.DST_ALPHA,[bl]:i.ONE_MINUS_SRC_COLOR,[Xs]:i.ONE_MINUS_SRC_ALPHA,[Cl]:i.ONE_MINUS_DST_COLOR,[wl]:i.ONE_MINUS_DST_ALPHA,[Ll]:i.CONSTANT_COLOR,[Dl]:i.ONE_MINUS_CONSTANT_COLOR,[Ul]:i.CONSTANT_ALPHA,[Il]:i.ONE_MINUS_CONSTANT_ALPHA};function q(L,lt,ht,Ct,At,Kt,jt,de,Te,Qt){if(L===yn){f===!0&&(Mt(i.BLEND),f=!1);return}if(f===!1&&(Ut(i.BLEND),f=!0),L!==xl){if(L!==S||Qt!==I){if((_!==In||w!==In)&&(i.blendEquation(i.FUNC_ADD),_=In,w=In),Qt)switch(L){case mi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _i:i.blendFunc(i.ONE,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}else switch(L){case mi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case _i:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case wa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",L);break}b=null,P=null,A=null,U=null,x.set(0,0,0),E=0,S=L,I=Qt}return}At=At||lt,Kt=Kt||ht,jt=jt||Ct,(lt!==_||At!==w)&&(i.blendEquationSeparate(Y[lt],Y[At]),_=lt,w=At),(ht!==b||Ct!==P||Kt!==A||jt!==U)&&(i.blendFuncSeparate(it[ht],it[Ct],it[Kt],it[jt]),b=ht,P=Ct,A=Kt,U=jt),(de.equals(x)===!1||Te!==E)&&(i.blendColor(de.r,de.g,de.b,Te),x.copy(de),E=Te),S=L,I=!1}function yt(L,lt){L.side===je?Mt(i.CULL_FACE):Ut(i.CULL_FACE);let ht=L.side===Ce;lt&&(ht=!ht),dt(ht),L.blending===mi&&L.transparent===!1?q(yn):q(L.blending,L.blendEquation,L.blendSrc,L.blendDst,L.blendEquationAlpha,L.blendSrcAlpha,L.blendDstAlpha,L.blendColor,L.blendAlpha,L.premultipliedAlpha),c.setFunc(L.depthFunc),c.setTest(L.depthTest),c.setMask(L.depthWrite),a.setMask(L.colorWrite);const Ct=L.stencilWrite;l.setTest(Ct),Ct&&(l.setMask(L.stencilWriteMask),l.setFunc(L.stencilFunc,L.stencilRef,L.stencilFuncMask),l.setOp(L.stencilFail,L.stencilZFail,L.stencilZPass)),F(L.polygonOffset,L.polygonOffsetFactor,L.polygonOffsetUnits),L.alphaToCoverage===!0?Ut(i.SAMPLE_ALPHA_TO_COVERAGE):Mt(i.SAMPLE_ALPHA_TO_COVERAGE)}function dt(L){V!==L&&(L?i.frontFace(i.CW):i.frontFace(i.CCW),V=L)}function y(L){L!==gl?(Ut(i.CULL_FACE),L!==nt&&(L===ba?i.cullFace(i.BACK):L===_l?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Mt(i.CULL_FACE),nt=L}function M(L){L!==D&&(X&&i.lineWidth(L),D=L)}function F(L,lt,ht){L?(Ut(i.POLYGON_OFFSET_FILL),(O!==lt||H!==ht)&&(i.polygonOffset(lt,ht),O=lt,H=ht)):Mt(i.POLYGON_OFFSET_FILL)}function et(L){L?Ut(i.SCISSOR_TEST):Mt(i.SCISSOR_TEST)}function K(L){L===void 0&&(L=i.TEXTURE0+$-1),tt!==L&&(i.activeTexture(L),tt=L)}function Z(L,lt,ht){ht===void 0&&(tt===null?ht=i.TEXTURE0+$-1:ht=tt);let Ct=ut[ht];Ct===void 0&&(Ct={type:void 0,texture:void 0},ut[ht]=Ct),(Ct.type!==L||Ct.texture!==lt)&&(tt!==ht&&(i.activeTexture(ht),tt=ht),i.bindTexture(L,lt||Rt[L]),Ct.type=L,Ct.texture=lt)}function vt(){const L=ut[tt];L!==void 0&&L.type!==void 0&&(i.bindTexture(L.type,null),L.type=void 0,L.texture=void 0)}function ct(){try{i.compressedTexImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function gt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function bt(){try{i.texSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Ft(){try{i.texSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function j(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Xt(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Wt(){try{i.texStorage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Dt(){try{i.texStorage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Et(){try{i.texImage2D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function _t(){try{i.texImage3D.apply(i,arguments)}catch(L){console.error("THREE.WebGLState:",L)}}function Bt(L){ft.equals(L)===!1&&(i.scissor(L.x,L.y,L.z,L.w),ft.copy(L))}function qt(L){xt.equals(L)===!1&&(i.viewport(L.x,L.y,L.z,L.w),xt.copy(L))}function se(L,lt){let ht=u.get(lt);ht===void 0&&(ht=new WeakMap,u.set(lt,ht));let Ct=ht.get(L);Ct===void 0&&(Ct=i.getUniformBlockIndex(lt,L.name),ht.set(L,Ct))}function Ht(L,lt){const Ct=u.get(lt).get(L);h.get(lt)!==Ct&&(i.uniformBlockBinding(lt,Ct,L.__bindingPointIndex),h.set(lt,Ct))}function at(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},tt=null,ut={},m={},g=new WeakMap,v=[],p=null,f=!1,S=null,_=null,b=null,P=null,w=null,A=null,U=null,x=new Nt(0,0,0),E=0,I=!1,V=null,nt=null,D=null,O=null,H=null,ft.set(0,0,i.canvas.width,i.canvas.height),xt.set(0,0,i.canvas.width,i.canvas.height),a.reset(),c.reset(),l.reset()}return{buffers:{color:a,depth:c,stencil:l},enable:Ut,disable:Mt,bindFramebuffer:Lt,drawBuffers:C,useProgram:st,setBlending:q,setMaterial:yt,setFlipSided:dt,setCullFace:y,setLineWidth:M,setPolygonOffset:F,setScissorTest:et,activeTexture:K,bindTexture:Z,unbindTexture:vt,compressedTexImage2D:ct,compressedTexImage3D:gt,texImage2D:Et,texImage3D:_t,updateUBOMapping:se,uniformBlockBinding:Ht,texStorage2D:Wt,texStorage3D:Dt,texSubImage2D:bt,texSubImage3D:Ft,compressedTexSubImage2D:j,compressedTexSubImage3D:Xt,scissor:Bt,viewport:qt,reset:at}}function Rm(i,t,e,n,r,s,o){const a=r.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new WeakMap;let u;const d=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(y,M){return m?new OffscreenCanvas(y,M):kr("canvas")}function v(y,M,F,et){let K=1;if((y.width>et||y.height>et)&&(K=et/Math.max(y.width,y.height)),K<1||M===!0)if(typeof HTMLImageElement<"u"&&y instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&y instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&y instanceof ImageBitmap){const Z=M?Vr:Math.floor,vt=Z(K*y.width),ct=Z(K*y.height);u===void 0&&(u=g(vt,ct));const gt=F?g(vt,ct):u;return gt.width=vt,gt.height=ct,gt.getContext("2d").drawImage(y,0,0,vt,ct),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+y.width+"x"+y.height+") to ("+vt+"x"+ct+")."),gt}else return"data"in y&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+y.width+"x"+y.height+")."),y;return y}function p(y){return js(y.width)&&js(y.height)}function f(y){return a?!1:y.wrapS!==qe||y.wrapT!==qe||y.minFilter!==Re&&y.minFilter!==ze}function S(y,M){return y.generateMipmaps&&M&&y.minFilter!==Re&&y.minFilter!==ze}function _(y){i.generateMipmap(y)}function b(y,M,F,et,K=!1){if(a===!1)return M;if(y!==null){if(i[y]!==void 0)return i[y];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+y+"'")}let Z=M;if(M===i.RED&&(F===i.FLOAT&&(Z=i.R32F),F===i.HALF_FLOAT&&(Z=i.R16F),F===i.UNSIGNED_BYTE&&(Z=i.R8)),M===i.RED_INTEGER&&(F===i.UNSIGNED_BYTE&&(Z=i.R8UI),F===i.UNSIGNED_SHORT&&(Z=i.R16UI),F===i.UNSIGNED_INT&&(Z=i.R32UI),F===i.BYTE&&(Z=i.R8I),F===i.SHORT&&(Z=i.R16I),F===i.INT&&(Z=i.R32I)),M===i.RG&&(F===i.FLOAT&&(Z=i.RG32F),F===i.HALF_FLOAT&&(Z=i.RG16F),F===i.UNSIGNED_BYTE&&(Z=i.RG8)),M===i.RGBA){const vt=K?Br:$t.getTransfer(et);F===i.FLOAT&&(Z=i.RGBA32F),F===i.HALF_FLOAT&&(Z=i.RGBA16F),F===i.UNSIGNED_BYTE&&(Z=vt===ee?i.SRGB8_ALPHA8:i.RGBA8),F===i.UNSIGNED_SHORT_4_4_4_4&&(Z=i.RGBA4),F===i.UNSIGNED_SHORT_5_5_5_1&&(Z=i.RGB5_A1)}return(Z===i.R16F||Z===i.R32F||Z===i.RG16F||Z===i.RG32F||Z===i.RGBA16F||Z===i.RGBA32F)&&t.get("EXT_color_buffer_float"),Z}function P(y,M,F){return S(y,F)===!0||y.isFramebufferTexture&&y.minFilter!==Re&&y.minFilter!==ze?Math.log2(Math.max(M.width,M.height))+1:y.mipmaps!==void 0&&y.mipmaps.length>0?y.mipmaps.length:y.isCompressedTexture&&Array.isArray(y.image)?M.mipmaps.length:1}function w(y){return y===Re||y===Pa||y===rs?i.NEAREST:i.LINEAR}function A(y){const M=y.target;M.removeEventListener("dispose",A),x(M),M.isVideoTexture&&h.delete(M)}function U(y){const M=y.target;M.removeEventListener("dispose",U),I(M)}function x(y){const M=n.get(y);if(M.__webglInit===void 0)return;const F=y.source,et=d.get(F);if(et){const K=et[M.__cacheKey];K.usedTimes--,K.usedTimes===0&&E(y),Object.keys(et).length===0&&d.delete(F)}n.remove(y)}function E(y){const M=n.get(y);i.deleteTexture(M.__webglTexture);const F=y.source,et=d.get(F);delete et[M.__cacheKey],o.memory.textures--}function I(y){const M=y.texture,F=n.get(y),et=n.get(M);if(et.__webglTexture!==void 0&&(i.deleteTexture(et.__webglTexture),o.memory.textures--),y.depthTexture&&y.depthTexture.dispose(),y.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(F.__webglFramebuffer[K]))for(let Z=0;Z<F.__webglFramebuffer[K].length;Z++)i.deleteFramebuffer(F.__webglFramebuffer[K][Z]);else i.deleteFramebuffer(F.__webglFramebuffer[K]);F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer[K])}else{if(Array.isArray(F.__webglFramebuffer))for(let K=0;K<F.__webglFramebuffer.length;K++)i.deleteFramebuffer(F.__webglFramebuffer[K]);else i.deleteFramebuffer(F.__webglFramebuffer);if(F.__webglDepthbuffer&&i.deleteRenderbuffer(F.__webglDepthbuffer),F.__webglMultisampledFramebuffer&&i.deleteFramebuffer(F.__webglMultisampledFramebuffer),F.__webglColorRenderbuffer)for(let K=0;K<F.__webglColorRenderbuffer.length;K++)F.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(F.__webglColorRenderbuffer[K]);F.__webglDepthRenderbuffer&&i.deleteRenderbuffer(F.__webglDepthRenderbuffer)}if(y.isWebGLMultipleRenderTargets)for(let K=0,Z=M.length;K<Z;K++){const vt=n.get(M[K]);vt.__webglTexture&&(i.deleteTexture(vt.__webglTexture),o.memory.textures--),n.remove(M[K])}n.remove(M),n.remove(y)}let V=0;function nt(){V=0}function D(){const y=V;return y>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+y+" texture units while this GPU supports only "+r.maxTextures),V+=1,y}function O(y){const M=[];return M.push(y.wrapS),M.push(y.wrapT),M.push(y.wrapR||0),M.push(y.magFilter),M.push(y.minFilter),M.push(y.anisotropy),M.push(y.internalFormat),M.push(y.format),M.push(y.type),M.push(y.generateMipmaps),M.push(y.premultiplyAlpha),M.push(y.flipY),M.push(y.unpackAlignment),M.push(y.colorSpace),M.join()}function H(y,M){const F=n.get(y);if(y.isVideoTexture&&yt(y),y.isRenderTargetTexture===!1&&y.version>0&&F.__version!==y.version){const et=y.image;if(et===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(et.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ft(F,y,M);return}}e.bindTexture(i.TEXTURE_2D,F.__webglTexture,i.TEXTURE0+M)}function $(y,M){const F=n.get(y);if(y.version>0&&F.__version!==y.version){ft(F,y,M);return}e.bindTexture(i.TEXTURE_2D_ARRAY,F.__webglTexture,i.TEXTURE0+M)}function X(y,M){const F=n.get(y);if(y.version>0&&F.__version!==y.version){ft(F,y,M);return}e.bindTexture(i.TEXTURE_3D,F.__webglTexture,i.TEXTURE0+M)}function W(y,M){const F=n.get(y);if(y.version>0&&F.__version!==y.version){xt(F,y,M);return}e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+M)}const Q={[$s]:i.REPEAT,[qe]:i.CLAMP_TO_EDGE,[Zs]:i.MIRRORED_REPEAT},tt={[Re]:i.NEAREST,[Pa]:i.NEAREST_MIPMAP_NEAREST,[rs]:i.NEAREST_MIPMAP_LINEAR,[ze]:i.LINEAR,[Jl]:i.LINEAR_MIPMAP_NEAREST,[Wi]:i.LINEAR_MIPMAP_LINEAR},ut={[ch]:i.NEVER,[ph]:i.ALWAYS,[lh]:i.LESS,[wc]:i.LEQUAL,[hh]:i.EQUAL,[dh]:i.GEQUAL,[uh]:i.GREATER,[fh]:i.NOTEQUAL};function k(y,M,F){if(F?(i.texParameteri(y,i.TEXTURE_WRAP_S,Q[M.wrapS]),i.texParameteri(y,i.TEXTURE_WRAP_T,Q[M.wrapT]),(y===i.TEXTURE_3D||y===i.TEXTURE_2D_ARRAY)&&i.texParameteri(y,i.TEXTURE_WRAP_R,Q[M.wrapR]),i.texParameteri(y,i.TEXTURE_MAG_FILTER,tt[M.magFilter]),i.texParameteri(y,i.TEXTURE_MIN_FILTER,tt[M.minFilter])):(i.texParameteri(y,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(y,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(y===i.TEXTURE_3D||y===i.TEXTURE_2D_ARRAY)&&i.texParameteri(y,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(M.wrapS!==qe||M.wrapT!==qe)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(y,i.TEXTURE_MAG_FILTER,w(M.magFilter)),i.texParameteri(y,i.TEXTURE_MIN_FILTER,w(M.minFilter)),M.minFilter!==Re&&M.minFilter!==ze&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),M.compareFunction&&(i.texParameteri(y,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(y,i.TEXTURE_COMPARE_FUNC,ut[M.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const et=t.get("EXT_texture_filter_anisotropic");if(M.magFilter===Re||M.minFilter!==rs&&M.minFilter!==Wi||M.type===Mn&&t.has("OES_texture_float_linear")===!1||a===!1&&M.type===Xi&&t.has("OES_texture_half_float_linear")===!1)return;(M.anisotropy>1||n.get(M).__currentAnisotropy)&&(i.texParameterf(y,et.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(M.anisotropy,r.getMaxAnisotropy())),n.get(M).__currentAnisotropy=M.anisotropy)}}function J(y,M){let F=!1;y.__webglInit===void 0&&(y.__webglInit=!0,M.addEventListener("dispose",A));const et=M.source;let K=d.get(et);K===void 0&&(K={},d.set(et,K));const Z=O(M);if(Z!==y.__cacheKey){K[Z]===void 0&&(K[Z]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,F=!0),K[Z].usedTimes++;const vt=K[y.__cacheKey];vt!==void 0&&(K[y.__cacheKey].usedTimes--,vt.usedTimes===0&&E(M)),y.__cacheKey=Z,y.__webglTexture=K[Z].texture}return F}function ft(y,M,F){let et=i.TEXTURE_2D;(M.isDataArrayTexture||M.isCompressedArrayTexture)&&(et=i.TEXTURE_2D_ARRAY),M.isData3DTexture&&(et=i.TEXTURE_3D);const K=J(y,M),Z=M.source;e.bindTexture(et,y.__webglTexture,i.TEXTURE0+F);const vt=n.get(Z);if(Z.version!==vt.__version||K===!0){e.activeTexture(i.TEXTURE0+F);const ct=$t.getPrimaries($t.workingColorSpace),gt=M.colorSpace===Ne?null:$t.getPrimaries(M.colorSpace),bt=M.colorSpace===Ne||ct===gt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,bt);const Ft=f(M)&&p(M.image)===!1;let j=v(M.image,Ft,!1,r.maxTextureSize);j=dt(M,j);const Xt=p(j)||a,Wt=s.convert(M.format,M.colorSpace);let Dt=s.convert(M.type),Et=b(M.internalFormat,Wt,Dt,M.colorSpace,M.isVideoTexture);k(et,M,Xt);let _t;const Bt=M.mipmaps,qt=a&&M.isVideoTexture!==!0&&Et!==Tc,se=vt.__version===void 0||K===!0,Ht=P(M,j,Xt);if(M.isDepthTexture)Et=i.DEPTH_COMPONENT,a?M.type===Mn?Et=i.DEPTH_COMPONENT32F:M.type===xn?Et=i.DEPTH_COMPONENT24:M.type===Fn?Et=i.DEPTH24_STENCIL8:Et=i.DEPTH_COMPONENT16:M.type===Mn&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),M.format===On&&Et===i.DEPTH_COMPONENT&&M.type!==ca&&M.type!==xn&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),M.type=xn,Dt=s.convert(M.type)),M.format===Mi&&Et===i.DEPTH_COMPONENT&&(Et=i.DEPTH_STENCIL,M.type!==Fn&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),M.type=Fn,Dt=s.convert(M.type))),se&&(qt?e.texStorage2D(i.TEXTURE_2D,1,Et,j.width,j.height):e.texImage2D(i.TEXTURE_2D,0,Et,j.width,j.height,0,Wt,Dt,null));else if(M.isDataTexture)if(Bt.length>0&&Xt){qt&&se&&e.texStorage2D(i.TEXTURE_2D,Ht,Et,Bt[0].width,Bt[0].height);for(let at=0,L=Bt.length;at<L;at++)_t=Bt[at],qt?e.texSubImage2D(i.TEXTURE_2D,at,0,0,_t.width,_t.height,Wt,Dt,_t.data):e.texImage2D(i.TEXTURE_2D,at,Et,_t.width,_t.height,0,Wt,Dt,_t.data);M.generateMipmaps=!1}else qt?(se&&e.texStorage2D(i.TEXTURE_2D,Ht,Et,j.width,j.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,j.width,j.height,Wt,Dt,j.data)):e.texImage2D(i.TEXTURE_2D,0,Et,j.width,j.height,0,Wt,Dt,j.data);else if(M.isCompressedTexture)if(M.isCompressedArrayTexture){qt&&se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,Et,Bt[0].width,Bt[0].height,j.depth);for(let at=0,L=Bt.length;at<L;at++)_t=Bt[at],M.format!==Ye?Wt!==null?qt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,_t.width,_t.height,j.depth,Wt,_t.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,at,Et,_t.width,_t.height,j.depth,0,_t.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,at,0,0,0,_t.width,_t.height,j.depth,Wt,Dt,_t.data):e.texImage3D(i.TEXTURE_2D_ARRAY,at,Et,_t.width,_t.height,j.depth,0,Wt,Dt,_t.data)}else{qt&&se&&e.texStorage2D(i.TEXTURE_2D,Ht,Et,Bt[0].width,Bt[0].height);for(let at=0,L=Bt.length;at<L;at++)_t=Bt[at],M.format!==Ye?Wt!==null?qt?e.compressedTexSubImage2D(i.TEXTURE_2D,at,0,0,_t.width,_t.height,Wt,_t.data):e.compressedTexImage2D(i.TEXTURE_2D,at,Et,_t.width,_t.height,0,_t.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):qt?e.texSubImage2D(i.TEXTURE_2D,at,0,0,_t.width,_t.height,Wt,Dt,_t.data):e.texImage2D(i.TEXTURE_2D,at,Et,_t.width,_t.height,0,Wt,Dt,_t.data)}else if(M.isDataArrayTexture)qt?(se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,Ht,Et,j.width,j.height,j.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,Wt,Dt,j.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Et,j.width,j.height,j.depth,0,Wt,Dt,j.data);else if(M.isData3DTexture)qt?(se&&e.texStorage3D(i.TEXTURE_3D,Ht,Et,j.width,j.height,j.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,Wt,Dt,j.data)):e.texImage3D(i.TEXTURE_3D,0,Et,j.width,j.height,j.depth,0,Wt,Dt,j.data);else if(M.isFramebufferTexture){if(se)if(qt)e.texStorage2D(i.TEXTURE_2D,Ht,Et,j.width,j.height);else{let at=j.width,L=j.height;for(let lt=0;lt<Ht;lt++)e.texImage2D(i.TEXTURE_2D,lt,Et,at,L,0,Wt,Dt,null),at>>=1,L>>=1}}else if(Bt.length>0&&Xt){qt&&se&&e.texStorage2D(i.TEXTURE_2D,Ht,Et,Bt[0].width,Bt[0].height);for(let at=0,L=Bt.length;at<L;at++)_t=Bt[at],qt?e.texSubImage2D(i.TEXTURE_2D,at,0,0,Wt,Dt,_t):e.texImage2D(i.TEXTURE_2D,at,Et,Wt,Dt,_t);M.generateMipmaps=!1}else qt?(se&&e.texStorage2D(i.TEXTURE_2D,Ht,Et,j.width,j.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Wt,Dt,j)):e.texImage2D(i.TEXTURE_2D,0,Et,Wt,Dt,j);S(M,Xt)&&_(et),vt.__version=Z.version,M.onUpdate&&M.onUpdate(M)}y.__version=M.version}function xt(y,M,F){if(M.image.length!==6)return;const et=J(y,M),K=M.source;e.bindTexture(i.TEXTURE_CUBE_MAP,y.__webglTexture,i.TEXTURE0+F);const Z=n.get(K);if(K.version!==Z.__version||et===!0){e.activeTexture(i.TEXTURE0+F);const vt=$t.getPrimaries($t.workingColorSpace),ct=M.colorSpace===Ne?null:$t.getPrimaries(M.colorSpace),gt=M.colorSpace===Ne||vt===ct?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,M.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,M.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,M.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,gt);const bt=M.isCompressedTexture||M.image[0].isCompressedTexture,Ft=M.image[0]&&M.image[0].isDataTexture,j=[];for(let at=0;at<6;at++)!bt&&!Ft?j[at]=v(M.image[at],!1,!0,r.maxCubemapSize):j[at]=Ft?M.image[at].image:M.image[at],j[at]=dt(M,j[at]);const Xt=j[0],Wt=p(Xt)||a,Dt=s.convert(M.format,M.colorSpace),Et=s.convert(M.type),_t=b(M.internalFormat,Dt,Et,M.colorSpace),Bt=a&&M.isVideoTexture!==!0,qt=Z.__version===void 0||et===!0;let se=P(M,Xt,Wt);k(i.TEXTURE_CUBE_MAP,M,Wt);let Ht;if(bt){Bt&&qt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,se,_t,Xt.width,Xt.height);for(let at=0;at<6;at++){Ht=j[at].mipmaps;for(let L=0;L<Ht.length;L++){const lt=Ht[L];M.format!==Ye?Dt!==null?Bt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L,0,0,lt.width,lt.height,Dt,lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L,_t,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Bt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L,0,0,lt.width,lt.height,Dt,Et,lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L,_t,lt.width,lt.height,0,Dt,Et,lt.data)}}}else{Ht=M.mipmaps,Bt&&qt&&(Ht.length>0&&se++,e.texStorage2D(i.TEXTURE_CUBE_MAP,se,_t,j[0].width,j[0].height));for(let at=0;at<6;at++)if(Ft){Bt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,j[at].width,j[at].height,Dt,Et,j[at].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,_t,j[at].width,j[at].height,0,Dt,Et,j[at].data);for(let L=0;L<Ht.length;L++){const ht=Ht[L].image[at].image;Bt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L+1,0,0,ht.width,ht.height,Dt,Et,ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L+1,_t,ht.width,ht.height,0,Dt,Et,ht.data)}}else{Bt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,0,0,Dt,Et,j[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,0,_t,Dt,Et,j[at]);for(let L=0;L<Ht.length;L++){const lt=Ht[L];Bt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L+1,0,0,Dt,Et,lt.image[at]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+at,L+1,_t,Dt,Et,lt.image[at])}}}S(M,Wt)&&_(i.TEXTURE_CUBE_MAP),Z.__version=K.version,M.onUpdate&&M.onUpdate(M)}y.__version=M.version}function mt(y,M,F,et,K,Z){const vt=s.convert(F.format,F.colorSpace),ct=s.convert(F.type),gt=b(F.internalFormat,vt,ct,F.colorSpace);if(!n.get(M).__hasExternalTextures){const Ft=Math.max(1,M.width>>Z),j=Math.max(1,M.height>>Z);K===i.TEXTURE_3D||K===i.TEXTURE_2D_ARRAY?e.texImage3D(K,Z,gt,Ft,j,M.depth,0,vt,ct,null):e.texImage2D(K,Z,gt,Ft,j,0,vt,ct,null)}e.bindFramebuffer(i.FRAMEBUFFER,y),q(M)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,et,K,n.get(F).__webglTexture,0,it(M)):(K===i.TEXTURE_2D||K>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&K<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,et,K,n.get(F).__webglTexture,Z),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Rt(y,M,F){if(i.bindRenderbuffer(i.RENDERBUFFER,y),M.depthBuffer&&!M.stencilBuffer){let et=a===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(F||q(M)){const K=M.depthTexture;K&&K.isDepthTexture&&(K.type===Mn?et=i.DEPTH_COMPONENT32F:K.type===xn&&(et=i.DEPTH_COMPONENT24));const Z=it(M);q(M)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Z,et,M.width,M.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,Z,et,M.width,M.height)}else i.renderbufferStorage(i.RENDERBUFFER,et,M.width,M.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,y)}else if(M.depthBuffer&&M.stencilBuffer){const et=it(M);F&&q(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,et,i.DEPTH24_STENCIL8,M.width,M.height):q(M)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,et,i.DEPTH24_STENCIL8,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,M.width,M.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,y)}else{const et=M.isWebGLMultipleRenderTargets===!0?M.texture:[M.texture];for(let K=0;K<et.length;K++){const Z=et[K],vt=s.convert(Z.format,Z.colorSpace),ct=s.convert(Z.type),gt=b(Z.internalFormat,vt,ct,Z.colorSpace),bt=it(M);F&&q(M)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,bt,gt,M.width,M.height):q(M)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,bt,gt,M.width,M.height):i.renderbufferStorage(i.RENDERBUFFER,gt,M.width,M.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ut(y,M){if(M&&M.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,y),!(M.depthTexture&&M.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(M.depthTexture).__webglTexture||M.depthTexture.image.width!==M.width||M.depthTexture.image.height!==M.height)&&(M.depthTexture.image.width=M.width,M.depthTexture.image.height=M.height,M.depthTexture.needsUpdate=!0),H(M.depthTexture,0);const et=n.get(M.depthTexture).__webglTexture,K=it(M);if(M.depthTexture.format===On)q(M)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,et,0);else if(M.depthTexture.format===Mi)q(M)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,et,0);else throw new Error("Unknown depthTexture format")}function Mt(y){const M=n.get(y),F=y.isWebGLCubeRenderTarget===!0;if(y.depthTexture&&!M.__autoAllocateDepthBuffer){if(F)throw new Error("target.depthTexture not supported in Cube render targets");Ut(M.__webglFramebuffer,y)}else if(F){M.__webglDepthbuffer=[];for(let et=0;et<6;et++)e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer[et]),M.__webglDepthbuffer[et]=i.createRenderbuffer(),Rt(M.__webglDepthbuffer[et],y,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,M.__webglFramebuffer),M.__webglDepthbuffer=i.createRenderbuffer(),Rt(M.__webglDepthbuffer,y,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Lt(y,M,F){const et=n.get(y);M!==void 0&&mt(et.__webglFramebuffer,y,y.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),F!==void 0&&Mt(y)}function C(y){const M=y.texture,F=n.get(y),et=n.get(M);y.addEventListener("dispose",U),y.isWebGLMultipleRenderTargets!==!0&&(et.__webglTexture===void 0&&(et.__webglTexture=i.createTexture()),et.__version=M.version,o.memory.textures++);const K=y.isWebGLCubeRenderTarget===!0,Z=y.isWebGLMultipleRenderTargets===!0,vt=p(y)||a;if(K){F.__webglFramebuffer=[];for(let ct=0;ct<6;ct++)if(a&&M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer[ct]=[];for(let gt=0;gt<M.mipmaps.length;gt++)F.__webglFramebuffer[ct][gt]=i.createFramebuffer()}else F.__webglFramebuffer[ct]=i.createFramebuffer()}else{if(a&&M.mipmaps&&M.mipmaps.length>0){F.__webglFramebuffer=[];for(let ct=0;ct<M.mipmaps.length;ct++)F.__webglFramebuffer[ct]=i.createFramebuffer()}else F.__webglFramebuffer=i.createFramebuffer();if(Z)if(r.drawBuffers){const ct=y.texture;for(let gt=0,bt=ct.length;gt<bt;gt++){const Ft=n.get(ct[gt]);Ft.__webglTexture===void 0&&(Ft.__webglTexture=i.createTexture(),o.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(a&&y.samples>0&&q(y)===!1){const ct=Z?M:[M];F.__webglMultisampledFramebuffer=i.createFramebuffer(),F.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,F.__webglMultisampledFramebuffer);for(let gt=0;gt<ct.length;gt++){const bt=ct[gt];F.__webglColorRenderbuffer[gt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,F.__webglColorRenderbuffer[gt]);const Ft=s.convert(bt.format,bt.colorSpace),j=s.convert(bt.type),Xt=b(bt.internalFormat,Ft,j,bt.colorSpace,y.isXRRenderTarget===!0),Wt=it(y);i.renderbufferStorageMultisample(i.RENDERBUFFER,Wt,Xt,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+gt,i.RENDERBUFFER,F.__webglColorRenderbuffer[gt])}i.bindRenderbuffer(i.RENDERBUFFER,null),y.depthBuffer&&(F.__webglDepthRenderbuffer=i.createRenderbuffer(),Rt(F.__webglDepthRenderbuffer,y,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(K){e.bindTexture(i.TEXTURE_CUBE_MAP,et.__webglTexture),k(i.TEXTURE_CUBE_MAP,M,vt);for(let ct=0;ct<6;ct++)if(a&&M.mipmaps&&M.mipmaps.length>0)for(let gt=0;gt<M.mipmaps.length;gt++)mt(F.__webglFramebuffer[ct][gt],y,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,gt);else mt(F.__webglFramebuffer[ct],y,M,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0);S(M,vt)&&_(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(Z){const ct=y.texture;for(let gt=0,bt=ct.length;gt<bt;gt++){const Ft=ct[gt],j=n.get(Ft);e.bindTexture(i.TEXTURE_2D,j.__webglTexture),k(i.TEXTURE_2D,Ft,vt),mt(F.__webglFramebuffer,y,Ft,i.COLOR_ATTACHMENT0+gt,i.TEXTURE_2D,0),S(Ft,vt)&&_(i.TEXTURE_2D)}e.unbindTexture()}else{let ct=i.TEXTURE_2D;if((y.isWebGL3DRenderTarget||y.isWebGLArrayRenderTarget)&&(a?ct=y.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(ct,et.__webglTexture),k(ct,M,vt),a&&M.mipmaps&&M.mipmaps.length>0)for(let gt=0;gt<M.mipmaps.length;gt++)mt(F.__webglFramebuffer[gt],y,M,i.COLOR_ATTACHMENT0,ct,gt);else mt(F.__webglFramebuffer,y,M,i.COLOR_ATTACHMENT0,ct,0);S(M,vt)&&_(ct),e.unbindTexture()}y.depthBuffer&&Mt(y)}function st(y){const M=p(y)||a,F=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let et=0,K=F.length;et<K;et++){const Z=F[et];if(S(Z,M)){const vt=y.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ct=n.get(Z).__webglTexture;e.bindTexture(vt,ct),_(vt),e.unbindTexture()}}}function Y(y){if(a&&y.samples>0&&q(y)===!1){const M=y.isWebGLMultipleRenderTargets?y.texture:[y.texture],F=y.width,et=y.height;let K=i.COLOR_BUFFER_BIT;const Z=[],vt=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ct=n.get(y),gt=y.isWebGLMultipleRenderTargets===!0;if(gt)for(let bt=0;bt<M.length;bt++)e.bindFramebuffer(i.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,ct.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ct.__webglFramebuffer);for(let bt=0;bt<M.length;bt++){Z.push(i.COLOR_ATTACHMENT0+bt),y.depthBuffer&&Z.push(vt);const Ft=ct.__ignoreDepthValues!==void 0?ct.__ignoreDepthValues:!1;if(Ft===!1&&(y.depthBuffer&&(K|=i.DEPTH_BUFFER_BIT),y.stencilBuffer&&(K|=i.STENCIL_BUFFER_BIT)),gt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ct.__webglColorRenderbuffer[bt]),Ft===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[vt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[vt])),gt){const j=n.get(M[bt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,j,0)}i.blitFramebuffer(0,0,F,et,0,0,F,et,K,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Z)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),gt)for(let bt=0;bt<M.length;bt++){e.bindFramebuffer(i.FRAMEBUFFER,ct.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.RENDERBUFFER,ct.__webglColorRenderbuffer[bt]);const Ft=n.get(M[bt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,ct.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+bt,i.TEXTURE_2D,Ft,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,ct.__webglMultisampledFramebuffer)}}function it(y){return Math.min(r.maxSamples,y.samples)}function q(y){const M=n.get(y);return a&&y.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&M.__useRenderToTexture!==!1}function yt(y){const M=o.render.frame;h.get(y)!==M&&(h.set(y,M),y.update())}function dt(y,M){const F=y.colorSpace,et=y.format,K=y.type;return y.isCompressedTexture===!0||y.isVideoTexture===!0||y.format===Ks||F!==fn&&F!==Ne&&($t.getTransfer(F)===ee?a===!1?t.has("EXT_sRGB")===!0&&et===Ye?(y.format=Ks,y.minFilter=ze,y.generateMipmaps=!1):M=Cc.sRGBToLinear(M):(et!==Ye||K!==Tn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",F)),M}this.allocateTextureUnit=D,this.resetTextureUnits=nt,this.setTexture2D=H,this.setTexture2DArray=$,this.setTexture3D=X,this.setTextureCube=W,this.rebindTextures=Lt,this.setupRenderTarget=C,this.updateRenderTargetMipmap=st,this.updateMultisampleRenderTarget=Y,this.setupDepthRenderbuffer=Mt,this.setupFrameBufferTexture=mt,this.useMultisampledRTT=q}function Cm(i,t,e){const n=e.isWebGL2;function r(s,o=Ne){let a;const c=$t.getTransfer(o);if(s===Tn)return i.UNSIGNED_BYTE;if(s===xc)return i.UNSIGNED_SHORT_4_4_4_4;if(s===Mc)return i.UNSIGNED_SHORT_5_5_5_1;if(s===Kl)return i.BYTE;if(s===jl)return i.SHORT;if(s===ca)return i.UNSIGNED_SHORT;if(s===vc)return i.INT;if(s===xn)return i.UNSIGNED_INT;if(s===Mn)return i.FLOAT;if(s===Xi)return n?i.HALF_FLOAT:(a=t.get("OES_texture_half_float"),a!==null?a.HALF_FLOAT_OES:null);if(s===Ql)return i.ALPHA;if(s===Ye)return i.RGBA;if(s===th)return i.LUMINANCE;if(s===eh)return i.LUMINANCE_ALPHA;if(s===On)return i.DEPTH_COMPONENT;if(s===Mi)return i.DEPTH_STENCIL;if(s===Ks)return a=t.get("EXT_sRGB"),a!==null?a.SRGB_ALPHA_EXT:null;if(s===nh)return i.RED;if(s===Sc)return i.RED_INTEGER;if(s===ih)return i.RG;if(s===yc)return i.RG_INTEGER;if(s===Ec)return i.RGBA_INTEGER;if(s===ss||s===as||s===os||s===cs)if(c===ee)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(s===ss)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===as)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===os)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===cs)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(s===ss)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===as)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===os)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===cs)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===La||s===Da||s===Ua||s===Ia)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(s===La)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===Da)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===Ua)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===Ia)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===Tc)return a=t.get("WEBGL_compressed_texture_etc1"),a!==null?a.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===Na||s===Fa)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(s===Na)return c===ee?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(s===Fa)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===Oa||s===Ba||s===za||s===Ga||s===Ha||s===Va||s===ka||s===Wa||s===Xa||s===qa||s===Ya||s===$a||s===Za||s===Ja)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(s===Oa)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===Ba)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===za)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===Ga)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===Ha)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===Va)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===ka)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===Wa)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===Xa)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===qa)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===Ya)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===$a)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===Za)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===Ja)return c===ee?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===ls||s===Ka||s===ja)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(s===ls)return c===ee?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===Ka)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===ja)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===rh||s===Qa||s===to||s===eo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(s===ls)return a.COMPRESSED_RED_RGTC1_EXT;if(s===Qa)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===to)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===eo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===Fn?n?i.UNSIGNED_INT_24_8:(a=t.get("WEBGL_depth_texture"),a!==null?a.UNSIGNED_INT_24_8_WEBGL:null):i[s]!==void 0?i[s]:null}return{convert:r}}class Pm extends Ie{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class te extends ce{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Lm={type:"move"};class Ds{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new te,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new te,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new R,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new R),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new te,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new R,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new R),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const v of t.hand.values()){const p=e.getJointPose(v,n),f=this._getHandJoint(l,v);p!==null&&(f.matrix.fromArray(p.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=p.radius),f.visible=p!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),m=.02,g=.005;l.inputState.pinching&&d>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(Lm)))}return a!==null&&(a.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new te;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class Dm extends yi{constructor(t,e){super();const n=this;let r=null,s=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,m=null,g=null;const v=e.getContextAttributes();let p=null,f=null;const S=[],_=[],b=new rt;let P=null;const w=new Ie;w.layers.enable(1),w.viewport=new ne;const A=new Ie;A.layers.enable(2),A.viewport=new ne;const U=[w,A],x=new Pm;x.layers.enable(1),x.layers.enable(2);let E=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(k){let J=S[k];return J===void 0&&(J=new Ds,S[k]=J),J.getTargetRaySpace()},this.getControllerGrip=function(k){let J=S[k];return J===void 0&&(J=new Ds,S[k]=J),J.getGripSpace()},this.getHand=function(k){let J=S[k];return J===void 0&&(J=new Ds,S[k]=J),J.getHandSpace()};function V(k){const J=_.indexOf(k.inputSource);if(J===-1)return;const ft=S[J];ft!==void 0&&(ft.update(k.inputSource,k.frame,l||o),ft.dispatchEvent({type:k.type,data:k.inputSource}))}function nt(){r.removeEventListener("select",V),r.removeEventListener("selectstart",V),r.removeEventListener("selectend",V),r.removeEventListener("squeeze",V),r.removeEventListener("squeezestart",V),r.removeEventListener("squeezeend",V),r.removeEventListener("end",nt),r.removeEventListener("inputsourceschange",D);for(let k=0;k<S.length;k++){const J=_[k];J!==null&&(_[k]=null,S[k].disconnect(J))}E=null,I=null,t.setRenderTarget(p),m=null,d=null,u=null,r=null,f=null,ut.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(k){s=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(k){a=k,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(k){l=k},this.getBaseLayer=function(){return d!==null?d:m},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return r},this.setSession=async function(k){if(r=k,r!==null){if(p=t.getRenderTarget(),r.addEventListener("select",V),r.addEventListener("selectstart",V),r.addEventListener("selectend",V),r.addEventListener("squeeze",V),r.addEventListener("squeezestart",V),r.addEventListener("squeezeend",V),r.addEventListener("end",nt),r.addEventListener("inputsourceschange",D),v.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(b),r.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const J={antialias:r.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,J),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),f=new zn(m.framebufferWidth,m.framebufferHeight,{format:Ye,type:Tn,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let J=null,ft=null,xt=null;v.depth&&(xt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,J=v.stencil?Mi:On,ft=v.stencil?Fn:xn);const mt={colorFormat:e.RGBA8,depthFormat:xt,scaleFactor:s};u=new XRWebGLBinding(r,e),d=u.createProjectionLayer(mt),r.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),f=new zn(d.textureWidth,d.textureHeight,{format:Ye,type:Tn,depthTexture:new Gc(d.textureWidth,d.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,J),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});const Rt=t.properties.get(f);Rt.__ignoreDepthValues=d.ignoreDepthValues}f.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await r.requestReferenceSpace(a),ut.setContext(r),ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function D(k){for(let J=0;J<k.removed.length;J++){const ft=k.removed[J],xt=_.indexOf(ft);xt>=0&&(_[xt]=null,S[xt].disconnect(ft))}for(let J=0;J<k.added.length;J++){const ft=k.added[J];let xt=_.indexOf(ft);if(xt===-1){for(let Rt=0;Rt<S.length;Rt++)if(Rt>=_.length){_.push(ft),xt=Rt;break}else if(_[Rt]===null){_[Rt]=ft,xt=Rt;break}if(xt===-1)break}const mt=S[xt];mt&&mt.connect(ft)}}const O=new R,H=new R;function $(k,J,ft){O.setFromMatrixPosition(J.matrixWorld),H.setFromMatrixPosition(ft.matrixWorld);const xt=O.distanceTo(H),mt=J.projectionMatrix.elements,Rt=ft.projectionMatrix.elements,Ut=mt[14]/(mt[10]-1),Mt=mt[14]/(mt[10]+1),Lt=(mt[9]+1)/mt[5],C=(mt[9]-1)/mt[5],st=(mt[8]-1)/mt[0],Y=(Rt[8]+1)/Rt[0],it=Ut*st,q=Ut*Y,yt=xt/(-st+Y),dt=yt*-st;J.matrixWorld.decompose(k.position,k.quaternion,k.scale),k.translateX(dt),k.translateZ(yt),k.matrixWorld.compose(k.position,k.quaternion,k.scale),k.matrixWorldInverse.copy(k.matrixWorld).invert();const y=Ut+yt,M=Mt+yt,F=it-dt,et=q+(xt-dt),K=Lt*Mt/M*y,Z=C*Mt/M*y;k.projectionMatrix.makePerspective(F,et,K,Z,y,M),k.projectionMatrixInverse.copy(k.projectionMatrix).invert()}function X(k,J){J===null?k.matrixWorld.copy(k.matrix):k.matrixWorld.multiplyMatrices(J.matrixWorld,k.matrix),k.matrixWorldInverse.copy(k.matrixWorld).invert()}this.updateCamera=function(k){if(r===null)return;x.near=A.near=w.near=k.near,x.far=A.far=w.far=k.far,(E!==x.near||I!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),E=x.near,I=x.far);const J=k.parent,ft=x.cameras;X(x,J);for(let xt=0;xt<ft.length;xt++)X(ft[xt],J);ft.length===2?$(x,w,A):x.projectionMatrix.copy(w.projectionMatrix),W(k,x,J)};function W(k,J,ft){ft===null?k.matrix.copy(J.matrixWorld):(k.matrix.copy(ft.matrixWorld),k.matrix.invert(),k.matrix.multiply(J.matrixWorld)),k.matrix.decompose(k.position,k.quaternion,k.scale),k.updateMatrixWorld(!0),k.projectionMatrix.copy(J.projectionMatrix),k.projectionMatrixInverse.copy(J.projectionMatrixInverse),k.isPerspectiveCamera&&(k.fov=qi*2*Math.atan(1/k.projectionMatrix.elements[5]),k.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(d===null&&m===null))return c},this.setFoveation=function(k){c=k,d!==null&&(d.fixedFoveation=k),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=k)};let Q=null;function tt(k,J){if(h=J.getViewerPose(l||o),g=J,h!==null){const ft=h.views;m!==null&&(t.setRenderTargetFramebuffer(f,m.framebuffer),t.setRenderTarget(f));let xt=!1;ft.length!==x.cameras.length&&(x.cameras.length=0,xt=!0);for(let mt=0;mt<ft.length;mt++){const Rt=ft[mt];let Ut=null;if(m!==null)Ut=m.getViewport(Rt);else{const Lt=u.getViewSubImage(d,Rt);Ut=Lt.viewport,mt===0&&(t.setRenderTargetTextures(f,Lt.colorTexture,d.ignoreDepthValues?void 0:Lt.depthStencilTexture),t.setRenderTarget(f))}let Mt=U[mt];Mt===void 0&&(Mt=new Ie,Mt.layers.enable(mt),Mt.viewport=new ne,U[mt]=Mt),Mt.matrix.fromArray(Rt.transform.matrix),Mt.matrix.decompose(Mt.position,Mt.quaternion,Mt.scale),Mt.projectionMatrix.fromArray(Rt.projectionMatrix),Mt.projectionMatrixInverse.copy(Mt.projectionMatrix).invert(),Mt.viewport.set(Ut.x,Ut.y,Ut.width,Ut.height),mt===0&&(x.matrix.copy(Mt.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),xt===!0&&x.cameras.push(Mt)}}for(let ft=0;ft<S.length;ft++){const xt=_[ft],mt=S[ft];xt!==null&&mt!==void 0&&mt.update(xt,J,l||o)}Q&&Q(k,J),J.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:J}),g=null}const ut=new Bc;ut.setAnimationLoop(tt),this.setAnimationLoop=function(k){Q=k},this.dispose=function(){}}}function Um(i,t){function e(p,f){p.matrixAutoUpdate===!0&&p.updateMatrix(),f.value.copy(p.matrix)}function n(p,f){f.color.getRGB(p.fogColor.value,Nc(i)),f.isFog?(p.fogNear.value=f.near,p.fogFar.value=f.far):f.isFogExp2&&(p.fogDensity.value=f.density)}function r(p,f,S,_,b){f.isMeshBasicMaterial||f.isMeshLambertMaterial?s(p,f):f.isMeshToonMaterial?(s(p,f),u(p,f)):f.isMeshPhongMaterial?(s(p,f),h(p,f)):f.isMeshStandardMaterial?(s(p,f),d(p,f),f.isMeshPhysicalMaterial&&m(p,f,b)):f.isMeshMatcapMaterial?(s(p,f),g(p,f)):f.isMeshDepthMaterial?s(p,f):f.isMeshDistanceMaterial?(s(p,f),v(p,f)):f.isMeshNormalMaterial?s(p,f):f.isLineBasicMaterial?(o(p,f),f.isLineDashedMaterial&&a(p,f)):f.isPointsMaterial?c(p,f,S,_):f.isSpriteMaterial?l(p,f):f.isShadowMaterial?(p.color.value.copy(f.color),p.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function s(p,f){p.opacity.value=f.opacity,f.color&&p.diffuse.value.copy(f.color),f.emissive&&p.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.bumpMap&&(p.bumpMap.value=f.bumpMap,e(f.bumpMap,p.bumpMapTransform),p.bumpScale.value=f.bumpScale,f.side===Ce&&(p.bumpScale.value*=-1)),f.normalMap&&(p.normalMap.value=f.normalMap,e(f.normalMap,p.normalMapTransform),p.normalScale.value.copy(f.normalScale),f.side===Ce&&p.normalScale.value.negate()),f.displacementMap&&(p.displacementMap.value=f.displacementMap,e(f.displacementMap,p.displacementMapTransform),p.displacementScale.value=f.displacementScale,p.displacementBias.value=f.displacementBias),f.emissiveMap&&(p.emissiveMap.value=f.emissiveMap,e(f.emissiveMap,p.emissiveMapTransform)),f.specularMap&&(p.specularMap.value=f.specularMap,e(f.specularMap,p.specularMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest);const S=t.get(f).envMap;if(S&&(p.envMap.value=S,p.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=f.reflectivity,p.ior.value=f.ior,p.refractionRatio.value=f.refractionRatio),f.lightMap){p.lightMap.value=f.lightMap;const _=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=f.lightMapIntensity*_,e(f.lightMap,p.lightMapTransform)}f.aoMap&&(p.aoMap.value=f.aoMap,p.aoMapIntensity.value=f.aoMapIntensity,e(f.aoMap,p.aoMapTransform))}function o(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform))}function a(p,f){p.dashSize.value=f.dashSize,p.totalSize.value=f.dashSize+f.gapSize,p.scale.value=f.scale}function c(p,f,S,_){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.size.value=f.size*S,p.scale.value=_*.5,f.map&&(p.map.value=f.map,e(f.map,p.uvTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function l(p,f){p.diffuse.value.copy(f.color),p.opacity.value=f.opacity,p.rotation.value=f.rotation,f.map&&(p.map.value=f.map,e(f.map,p.mapTransform)),f.alphaMap&&(p.alphaMap.value=f.alphaMap,e(f.alphaMap,p.alphaMapTransform)),f.alphaTest>0&&(p.alphaTest.value=f.alphaTest)}function h(p,f){p.specular.value.copy(f.specular),p.shininess.value=Math.max(f.shininess,1e-4)}function u(p,f){f.gradientMap&&(p.gradientMap.value=f.gradientMap)}function d(p,f){p.metalness.value=f.metalness,f.metalnessMap&&(p.metalnessMap.value=f.metalnessMap,e(f.metalnessMap,p.metalnessMapTransform)),p.roughness.value=f.roughness,f.roughnessMap&&(p.roughnessMap.value=f.roughnessMap,e(f.roughnessMap,p.roughnessMapTransform)),t.get(f).envMap&&(p.envMapIntensity.value=f.envMapIntensity)}function m(p,f,S){p.ior.value=f.ior,f.sheen>0&&(p.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),p.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(p.sheenColorMap.value=f.sheenColorMap,e(f.sheenColorMap,p.sheenColorMapTransform)),f.sheenRoughnessMap&&(p.sheenRoughnessMap.value=f.sheenRoughnessMap,e(f.sheenRoughnessMap,p.sheenRoughnessMapTransform))),f.clearcoat>0&&(p.clearcoat.value=f.clearcoat,p.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(p.clearcoatMap.value=f.clearcoatMap,e(f.clearcoatMap,p.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,e(f.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(p.clearcoatNormalMap.value=f.clearcoatNormalMap,e(f.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ce&&p.clearcoatNormalScale.value.negate())),f.iridescence>0&&(p.iridescence.value=f.iridescence,p.iridescenceIOR.value=f.iridescenceIOR,p.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(p.iridescenceMap.value=f.iridescenceMap,e(f.iridescenceMap,p.iridescenceMapTransform)),f.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=f.iridescenceThicknessMap,e(f.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),f.transmission>0&&(p.transmission.value=f.transmission,p.transmissionSamplerMap.value=S.texture,p.transmissionSamplerSize.value.set(S.width,S.height),f.transmissionMap&&(p.transmissionMap.value=f.transmissionMap,e(f.transmissionMap,p.transmissionMapTransform)),p.thickness.value=f.thickness,f.thicknessMap&&(p.thicknessMap.value=f.thicknessMap,e(f.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=f.attenuationDistance,p.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(p.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(p.anisotropyMap.value=f.anisotropyMap,e(f.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=f.specularIntensity,p.specularColor.value.copy(f.specularColor),f.specularColorMap&&(p.specularColorMap.value=f.specularColorMap,e(f.specularColorMap,p.specularColorMapTransform)),f.specularIntensityMap&&(p.specularIntensityMap.value=f.specularIntensityMap,e(f.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,f){f.matcap&&(p.matcap.value=f.matcap)}function v(p,f){const S=t.get(f).light;p.referencePosition.value.setFromMatrixPosition(S.matrixWorld),p.nearDistance.value=S.shadow.camera.near,p.farDistance.value=S.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function Im(i,t,e,n){let r={},s={},o=[];const a=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(S,_){const b=_.program;n.uniformBlockBinding(S,b)}function l(S,_){let b=r[S.id];b===void 0&&(g(S),b=h(S),r[S.id]=b,S.addEventListener("dispose",p));const P=_.program;n.updateUBOMapping(S,P);const w=t.render.frame;s[S.id]!==w&&(d(S),s[S.id]=w)}function h(S){const _=u();S.__bindingPointIndex=_;const b=i.createBuffer(),P=S.__size,w=S.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,P,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,_,b),b}function u(){for(let S=0;S<a;S++)if(o.indexOf(S)===-1)return o.push(S),S;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(S){const _=r[S.id],b=S.uniforms,P=S.__cache;i.bindBuffer(i.UNIFORM_BUFFER,_);for(let w=0,A=b.length;w<A;w++){const U=Array.isArray(b[w])?b[w]:[b[w]];for(let x=0,E=U.length;x<E;x++){const I=U[x];if(m(I,w,x,P)===!0){const V=I.__offset,nt=Array.isArray(I.value)?I.value:[I.value];let D=0;for(let O=0;O<nt.length;O++){const H=nt[O],$=v(H);typeof H=="number"||typeof H=="boolean"?(I.__data[0]=H,i.bufferSubData(i.UNIFORM_BUFFER,V+D,I.__data)):H.isMatrix3?(I.__data[0]=H.elements[0],I.__data[1]=H.elements[1],I.__data[2]=H.elements[2],I.__data[3]=0,I.__data[4]=H.elements[3],I.__data[5]=H.elements[4],I.__data[6]=H.elements[5],I.__data[7]=0,I.__data[8]=H.elements[6],I.__data[9]=H.elements[7],I.__data[10]=H.elements[8],I.__data[11]=0):(H.toArray(I.__data,D),D+=$.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,V,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(S,_,b,P){const w=S.value,A=_+"_"+b;if(P[A]===void 0)return typeof w=="number"||typeof w=="boolean"?P[A]=w:P[A]=w.clone(),!0;{const U=P[A];if(typeof w=="number"||typeof w=="boolean"){if(U!==w)return P[A]=w,!0}else if(U.equals(w)===!1)return U.copy(w),!0}return!1}function g(S){const _=S.uniforms;let b=0;const P=16;for(let A=0,U=_.length;A<U;A++){const x=Array.isArray(_[A])?_[A]:[_[A]];for(let E=0,I=x.length;E<I;E++){const V=x[E],nt=Array.isArray(V.value)?V.value:[V.value];for(let D=0,O=nt.length;D<O;D++){const H=nt[D],$=v(H),X=b%P;X!==0&&P-X<$.boundary&&(b+=P-X),V.__data=new Float32Array($.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=b,b+=$.storage}}}const w=b%P;return w>0&&(b+=P-w),S.__size=b,S.__cache={},this}function v(S){const _={boundary:0,storage:0};return typeof S=="number"||typeof S=="boolean"?(_.boundary=4,_.storage=4):S.isVector2?(_.boundary=8,_.storage=8):S.isVector3||S.isColor?(_.boundary=16,_.storage=12):S.isVector4?(_.boundary=16,_.storage=16):S.isMatrix3?(_.boundary=48,_.storage=48):S.isMatrix4?(_.boundary=64,_.storage=64):S.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",S),_}function p(S){const _=S.target;_.removeEventListener("dispose",p);const b=o.indexOf(_.__bindingPointIndex);o.splice(b,1),i.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function f(){for(const S in r)i.deleteBuffer(r[S]);o=[],r={},s={}}return{bind:c,update:l,dispose:f}}class qc{constructor(t={}){const{canvas:e=Ch(),context:n=null,depth:r=!0,stencil:s=!0,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;n!==null?d=n.getContextAttributes().alpha:d=o;const m=new Uint32Array(4),g=new Int32Array(4);let v=null,p=null;const f=[],S=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ge,this._useLegacyLights=!1,this.toneMapping=En,this.toneMappingExposure=1;const _=this;let b=!1,P=0,w=0,A=null,U=-1,x=null;const E=new ne,I=new ne;let V=null;const nt=new Nt(0);let D=0,O=e.width,H=e.height,$=1,X=null,W=null;const Q=new ne(0,0,O,H),tt=new ne(0,0,O,H);let ut=!1;const k=new fa;let J=!1,ft=!1,xt=null;const mt=new Jt,Rt=new rt,Ut=new R,Mt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Lt(){return A===null?$:1}let C=n;function st(T,N){for(let z=0;z<T.length;z++){const G=T[z],B=e.getContext(G,N);if(B!==null)return B}return null}try{const T={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${oa}`),e.addEventListener("webglcontextlost",at,!1),e.addEventListener("webglcontextrestored",L,!1),e.addEventListener("webglcontextcreationerror",lt,!1),C===null){const N=["webgl2","webgl","experimental-webgl"];if(_.isWebGL1Renderer===!0&&N.shift(),C=st(N,T),C===null)throw st(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&C instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),C.getShaderPrecisionFormat===void 0&&(C.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Y,it,q,yt,dt,y,M,F,et,K,Z,vt,ct,gt,bt,Ft,j,Xt,Wt,Dt,Et,_t,Bt,qt;function se(){Y=new Wd(C),it=new Bd(C,Y,t),Y.init(it),_t=new Cm(C,Y,it),q=new wm(C,Y,it),yt=new Yd(C),dt=new dm,y=new Rm(C,Y,q,dt,it,_t,yt),M=new Gd(_),F=new kd(_),et=new tu(C,it),Bt=new Fd(C,Y,et,it),K=new Xd(C,et,yt,Bt),Z=new Kd(C,K,et,yt),Wt=new Jd(C,it,y),Ft=new zd(dt),vt=new fm(_,M,F,Y,it,Bt,Ft),ct=new Um(_,dt),gt=new mm,bt=new Sm(Y,it),Xt=new Nd(_,M,F,q,Z,d,c),j=new Am(_,Z,it),qt=new Im(C,yt,it,q),Dt=new Od(C,Y,yt,it),Et=new qd(C,Y,yt,it),yt.programs=vt.programs,_.capabilities=it,_.extensions=Y,_.properties=dt,_.renderLists=gt,_.shadowMap=j,_.state=q,_.info=yt}se();const Ht=new Dm(_,C);this.xr=Ht,this.getContext=function(){return C},this.getContextAttributes=function(){return C.getContextAttributes()},this.forceContextLoss=function(){const T=Y.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Y.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return $},this.setPixelRatio=function(T){T!==void 0&&($=T,this.setSize(O,H,!1))},this.getSize=function(T){return T.set(O,H)},this.setSize=function(T,N,z=!0){if(Ht.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}O=T,H=N,e.width=Math.floor(T*$),e.height=Math.floor(N*$),z===!0&&(e.style.width=T+"px",e.style.height=N+"px"),this.setViewport(0,0,T,N)},this.getDrawingBufferSize=function(T){return T.set(O*$,H*$).floor()},this.setDrawingBufferSize=function(T,N,z){O=T,H=N,$=z,e.width=Math.floor(T*z),e.height=Math.floor(N*z),this.setViewport(0,0,T,N)},this.getCurrentViewport=function(T){return T.copy(E)},this.getViewport=function(T){return T.copy(Q)},this.setViewport=function(T,N,z,G){T.isVector4?Q.set(T.x,T.y,T.z,T.w):Q.set(T,N,z,G),q.viewport(E.copy(Q).multiplyScalar($).floor())},this.getScissor=function(T){return T.copy(tt)},this.setScissor=function(T,N,z,G){T.isVector4?tt.set(T.x,T.y,T.z,T.w):tt.set(T,N,z,G),q.scissor(I.copy(tt).multiplyScalar($).floor())},this.getScissorTest=function(){return ut},this.setScissorTest=function(T){q.setScissorTest(ut=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){W=T},this.getClearColor=function(T){return T.copy(Xt.getClearColor())},this.setClearColor=function(){Xt.setClearColor.apply(Xt,arguments)},this.getClearAlpha=function(){return Xt.getClearAlpha()},this.setClearAlpha=function(){Xt.setClearAlpha.apply(Xt,arguments)},this.clear=function(T=!0,N=!0,z=!0){let G=0;if(T){let B=!1;if(A!==null){const pt=A.texture.format;B=pt===Ec||pt===yc||pt===Sc}if(B){const pt=A.texture.type,St=pt===Tn||pt===xn||pt===ca||pt===Fn||pt===xc||pt===Mc,wt=Xt.getClearColor(),Pt=Xt.getClearAlpha(),Gt=wt.r,It=wt.g,Ot=wt.b;St?(m[0]=Gt,m[1]=It,m[2]=Ot,m[3]=Pt,C.clearBufferuiv(C.COLOR,0,m)):(g[0]=Gt,g[1]=It,g[2]=Ot,g[3]=Pt,C.clearBufferiv(C.COLOR,0,g))}else G|=C.COLOR_BUFFER_BIT}N&&(G|=C.DEPTH_BUFFER_BIT),z&&(G|=C.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),C.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",at,!1),e.removeEventListener("webglcontextrestored",L,!1),e.removeEventListener("webglcontextcreationerror",lt,!1),gt.dispose(),bt.dispose(),dt.dispose(),M.dispose(),F.dispose(),Z.dispose(),Bt.dispose(),qt.dispose(),vt.dispose(),Ht.dispose(),Ht.removeEventListener("sessionstart",Te),Ht.removeEventListener("sessionend",Qt),xt&&(xt.dispose(),xt=null),be.stop()};function at(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function L(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const T=yt.autoReset,N=j.enabled,z=j.autoUpdate,G=j.needsUpdate,B=j.type;se(),yt.autoReset=T,j.enabled=N,j.autoUpdate=z,j.needsUpdate=G,j.type=B}function lt(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function ht(T){const N=T.target;N.removeEventListener("dispose",ht),Ct(N)}function Ct(T){At(T),dt.remove(T)}function At(T){const N=dt.get(T).programs;N!==void 0&&(N.forEach(function(z){vt.releaseProgram(z)}),T.isShaderMaterial&&vt.releaseShaderCache(T))}this.renderBufferDirect=function(T,N,z,G,B,pt){N===null&&(N=Mt);const St=B.isMesh&&B.matrixWorld.determinant()<0,wt=fl(T,N,z,G,B);q.setMaterial(G,St);let Pt=z.index,Gt=1;if(G.wireframe===!0){if(Pt=K.getWireframeAttribute(z),Pt===void 0)return;Gt=2}const It=z.drawRange,Ot=z.attributes.position;let oe=It.start*Gt,Le=(It.start+It.count)*Gt;pt!==null&&(oe=Math.max(oe,pt.start*Gt),Le=Math.min(Le,(pt.start+pt.count)*Gt)),Pt!==null?(oe=Math.max(oe,0),Le=Math.min(Le,Pt.count)):Ot!=null&&(oe=Math.max(oe,0),Le=Math.min(Le,Ot.count));const pe=Le-oe;if(pe<0||pe===1/0)return;Bt.setup(B,G,wt,z,Pt);let nn,ie=Dt;if(Pt!==null&&(nn=et.get(Pt),ie=Et,ie.setIndex(nn)),B.isMesh)G.wireframe===!0?(q.setLineWidth(G.wireframeLinewidth*Lt()),ie.setMode(C.LINES)):ie.setMode(C.TRIANGLES);else if(B.isLine){let Vt=G.linewidth;Vt===void 0&&(Vt=1),q.setLineWidth(Vt*Lt()),B.isLineSegments?ie.setMode(C.LINES):B.isLineLoop?ie.setMode(C.LINE_LOOP):ie.setMode(C.LINE_STRIP)}else B.isPoints?ie.setMode(C.POINTS):B.isSprite&&ie.setMode(C.TRIANGLES);if(B.isBatchedMesh)ie.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)ie.renderInstances(oe,pe,B.count);else if(z.isInstancedBufferGeometry){const Vt=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ts=Math.min(z.instanceCount,Vt);ie.renderInstances(oe,pe,ts)}else ie.render(oe,pe)};function Kt(T,N,z){T.transparent===!0&&T.side===je&&T.forceSinglePass===!1?(T.side=Ce,T.needsUpdate=!0,er(T,N,z),T.side=bn,T.needsUpdate=!0,er(T,N,z),T.side=je):er(T,N,z)}this.compile=function(T,N,z=null){z===null&&(z=T),p=bt.get(z),p.init(),S.push(p),z.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),T!==z&&T.traverseVisible(function(B){B.isLight&&B.layers.test(N.layers)&&(p.pushLight(B),B.castShadow&&p.pushShadow(B))}),p.setupLights(_._useLegacyLights);const G=new Set;return T.traverse(function(B){const pt=B.material;if(pt)if(Array.isArray(pt))for(let St=0;St<pt.length;St++){const wt=pt[St];Kt(wt,z,B),G.add(wt)}else Kt(pt,z,B),G.add(pt)}),S.pop(),p=null,G},this.compileAsync=function(T,N,z=null){const G=this.compile(T,N,z);return new Promise(B=>{function pt(){if(G.forEach(function(St){dt.get(St).currentProgram.isReady()&&G.delete(St)}),G.size===0){B(T);return}setTimeout(pt,10)}Y.get("KHR_parallel_shader_compile")!==null?pt():setTimeout(pt,10)})};let jt=null;function de(T){jt&&jt(T)}function Te(){be.stop()}function Qt(){be.start()}const be=new Bc;be.setAnimationLoop(de),typeof self<"u"&&be.setContext(self),this.setAnimationLoop=function(T){jt=T,Ht.setAnimationLoop(T),T===null?be.stop():be.start()},Ht.addEventListener("sessionstart",Te),Ht.addEventListener("sessionend",Qt),this.render=function(T,N){if(N!==void 0&&N.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),Ht.enabled===!0&&Ht.isPresenting===!0&&(Ht.cameraAutoUpdate===!0&&Ht.updateCamera(N),N=Ht.getCamera()),T.isScene===!0&&T.onBeforeRender(_,T,N,A),p=bt.get(T,S.length),p.init(),S.push(p),mt.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),k.setFromProjectionMatrix(mt),ft=this.localClippingEnabled,J=Ft.init(this.clippingPlanes,ft),v=gt.get(T,f.length),v.init(),f.push(v),Ze(T,N,0,_.sortObjects),v.finish(),_.sortObjects===!0&&v.sort(X,W),this.info.render.frame++,J===!0&&Ft.beginShadows();const z=p.state.shadowsArray;if(j.render(z,T,N),J===!0&&Ft.endShadows(),this.info.autoReset===!0&&this.info.reset(),Xt.render(v,T),p.setupLights(_._useLegacyLights),N.isArrayCamera){const G=N.cameras;for(let B=0,pt=G.length;B<pt;B++){const St=G[B];xa(v,T,St,St.viewport)}}else xa(v,T,N);A!==null&&(y.updateMultisampleRenderTarget(A),y.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(_,T,N),Bt.resetDefaultState(),U=-1,x=null,S.pop(),S.length>0?p=S[S.length-1]:p=null,f.pop(),f.length>0?v=f[f.length-1]:v=null};function Ze(T,N,z,G){if(T.visible===!1)return;if(T.layers.test(N.layers)){if(T.isGroup)z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(N);else if(T.isLight)p.pushLight(T),T.castShadow&&p.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||k.intersectsSprite(T)){G&&Ut.setFromMatrixPosition(T.matrixWorld).applyMatrix4(mt);const St=Z.update(T),wt=T.material;wt.visible&&v.push(T,St,wt,z,Ut.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||k.intersectsObject(T))){const St=Z.update(T),wt=T.material;if(G&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ut.copy(T.boundingSphere.center)):(St.boundingSphere===null&&St.computeBoundingSphere(),Ut.copy(St.boundingSphere.center)),Ut.applyMatrix4(T.matrixWorld).applyMatrix4(mt)),Array.isArray(wt)){const Pt=St.groups;for(let Gt=0,It=Pt.length;Gt<It;Gt++){const Ot=Pt[Gt],oe=wt[Ot.materialIndex];oe&&oe.visible&&v.push(T,St,oe,z,Ut.z,Ot)}}else wt.visible&&v.push(T,St,wt,z,Ut.z,null)}}const pt=T.children;for(let St=0,wt=pt.length;St<wt;St++)Ze(pt[St],N,z,G)}function xa(T,N,z,G){const B=T.opaque,pt=T.transmissive,St=T.transparent;p.setupLightsView(z),J===!0&&Ft.setGlobalState(_.clippingPlanes,z),pt.length>0&&ul(B,pt,N,z),G&&q.viewport(E.copy(G)),B.length>0&&tr(B,N,z),pt.length>0&&tr(pt,N,z),St.length>0&&tr(St,N,z),q.buffers.depth.setTest(!0),q.buffers.depth.setMask(!0),q.buffers.color.setMask(!0),q.setPolygonOffset(!1)}function ul(T,N,z,G){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;const pt=it.isWebGL2;xt===null&&(xt=new zn(1,1,{generateMipmaps:!0,type:Y.has("EXT_color_buffer_half_float")?Xi:Tn,minFilter:Wi,samples:pt?4:0})),_.getDrawingBufferSize(Rt),pt?xt.setSize(Rt.x,Rt.y):xt.setSize(Vr(Rt.x),Vr(Rt.y));const St=_.getRenderTarget();_.setRenderTarget(xt),_.getClearColor(nt),D=_.getClearAlpha(),D<1&&_.setClearColor(16777215,.5),_.clear();const wt=_.toneMapping;_.toneMapping=En,tr(T,z,G),y.updateMultisampleRenderTarget(xt),y.updateRenderTargetMipmap(xt);let Pt=!1;for(let Gt=0,It=N.length;Gt<It;Gt++){const Ot=N[Gt],oe=Ot.object,Le=Ot.geometry,pe=Ot.material,nn=Ot.group;if(pe.side===je&&oe.layers.test(G.layers)){const ie=pe.side;pe.side=Ce,pe.needsUpdate=!0,Ma(oe,z,G,Le,pe,nn),pe.side=ie,pe.needsUpdate=!0,Pt=!0}}Pt===!0&&(y.updateMultisampleRenderTarget(xt),y.updateRenderTargetMipmap(xt)),_.setRenderTarget(St),_.setClearColor(nt,D),_.toneMapping=wt}function tr(T,N,z){const G=N.isScene===!0?N.overrideMaterial:null;for(let B=0,pt=T.length;B<pt;B++){const St=T[B],wt=St.object,Pt=St.geometry,Gt=G===null?St.material:G,It=St.group;wt.layers.test(z.layers)&&Ma(wt,N,z,Pt,Gt,It)}}function Ma(T,N,z,G,B,pt){T.onBeforeRender(_,N,z,G,B,pt),T.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),B.onBeforeRender(_,N,z,G,T,pt),B.transparent===!0&&B.side===je&&B.forceSinglePass===!1?(B.side=Ce,B.needsUpdate=!0,_.renderBufferDirect(z,N,G,B,T,pt),B.side=bn,B.needsUpdate=!0,_.renderBufferDirect(z,N,G,B,T,pt),B.side=je):_.renderBufferDirect(z,N,G,B,T,pt),T.onAfterRender(_,N,z,G,B,pt)}function er(T,N,z){N.isScene!==!0&&(N=Mt);const G=dt.get(T),B=p.state.lights,pt=p.state.shadowsArray,St=B.state.version,wt=vt.getParameters(T,B.state,pt,N,z),Pt=vt.getProgramCacheKey(wt);let Gt=G.programs;G.environment=T.isMeshStandardMaterial?N.environment:null,G.fog=N.fog,G.envMap=(T.isMeshStandardMaterial?F:M).get(T.envMap||G.environment),Gt===void 0&&(T.addEventListener("dispose",ht),Gt=new Map,G.programs=Gt);let It=Gt.get(Pt);if(It!==void 0){if(G.currentProgram===It&&G.lightsStateVersion===St)return ya(T,wt),It}else wt.uniforms=vt.getUniforms(T),T.onBuild(z,wt,_),T.onBeforeCompile(wt,_),It=vt.acquireProgram(wt,Pt),Gt.set(Pt,It),G.uniforms=wt.uniforms;const Ot=G.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Ot.clippingPlanes=Ft.uniform),ya(T,wt),G.needsLights=pl(T),G.lightsStateVersion=St,G.needsLights&&(Ot.ambientLightColor.value=B.state.ambient,Ot.lightProbe.value=B.state.probe,Ot.directionalLights.value=B.state.directional,Ot.directionalLightShadows.value=B.state.directionalShadow,Ot.spotLights.value=B.state.spot,Ot.spotLightShadows.value=B.state.spotShadow,Ot.rectAreaLights.value=B.state.rectArea,Ot.ltc_1.value=B.state.rectAreaLTC1,Ot.ltc_2.value=B.state.rectAreaLTC2,Ot.pointLights.value=B.state.point,Ot.pointLightShadows.value=B.state.pointShadow,Ot.hemisphereLights.value=B.state.hemi,Ot.directionalShadowMap.value=B.state.directionalShadowMap,Ot.directionalShadowMatrix.value=B.state.directionalShadowMatrix,Ot.spotShadowMap.value=B.state.spotShadowMap,Ot.spotLightMatrix.value=B.state.spotLightMatrix,Ot.spotLightMap.value=B.state.spotLightMap,Ot.pointShadowMap.value=B.state.pointShadowMap,Ot.pointShadowMatrix.value=B.state.pointShadowMatrix),G.currentProgram=It,G.uniformsList=null,It}function Sa(T){if(T.uniformsList===null){const N=T.currentProgram.getUniforms();T.uniformsList=Fr.seqWithValue(N.seq,T.uniforms)}return T.uniformsList}function ya(T,N){const z=dt.get(T);z.outputColorSpace=N.outputColorSpace,z.batching=N.batching,z.instancing=N.instancing,z.instancingColor=N.instancingColor,z.skinning=N.skinning,z.morphTargets=N.morphTargets,z.morphNormals=N.morphNormals,z.morphColors=N.morphColors,z.morphTargetsCount=N.morphTargetsCount,z.numClippingPlanes=N.numClippingPlanes,z.numIntersection=N.numClipIntersection,z.vertexAlphas=N.vertexAlphas,z.vertexTangents=N.vertexTangents,z.toneMapping=N.toneMapping}function fl(T,N,z,G,B){N.isScene!==!0&&(N=Mt),y.resetTextureUnits();const pt=N.fog,St=G.isMeshStandardMaterial?N.environment:null,wt=A===null?_.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:fn,Pt=(G.isMeshStandardMaterial?F:M).get(G.envMap||St),Gt=G.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,It=!!z.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Ot=!!z.morphAttributes.position,oe=!!z.morphAttributes.normal,Le=!!z.morphAttributes.color;let pe=En;G.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(pe=_.toneMapping);const nn=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,ie=nn!==void 0?nn.length:0,Vt=dt.get(G),ts=p.state.lights;if(J===!0&&(ft===!0||T!==x)){const Oe=T===x&&G.id===U;Ft.setState(G,T,Oe)}let ae=!1;G.version===Vt.__version?(Vt.needsLights&&Vt.lightsStateVersion!==ts.state.version||Vt.outputColorSpace!==wt||B.isBatchedMesh&&Vt.batching===!1||!B.isBatchedMesh&&Vt.batching===!0||B.isInstancedMesh&&Vt.instancing===!1||!B.isInstancedMesh&&Vt.instancing===!0||B.isSkinnedMesh&&Vt.skinning===!1||!B.isSkinnedMesh&&Vt.skinning===!0||B.isInstancedMesh&&Vt.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Vt.instancingColor===!1&&B.instanceColor!==null||Vt.envMap!==Pt||G.fog===!0&&Vt.fog!==pt||Vt.numClippingPlanes!==void 0&&(Vt.numClippingPlanes!==Ft.numPlanes||Vt.numIntersection!==Ft.numIntersection)||Vt.vertexAlphas!==Gt||Vt.vertexTangents!==It||Vt.morphTargets!==Ot||Vt.morphNormals!==oe||Vt.morphColors!==Le||Vt.toneMapping!==pe||it.isWebGL2===!0&&Vt.morphTargetsCount!==ie)&&(ae=!0):(ae=!0,Vt.__version=G.version);let An=Vt.currentProgram;ae===!0&&(An=er(G,N,B));let Ea=!1,Ti=!1,es=!1;const xe=An.getUniforms(),wn=Vt.uniforms;if(q.useProgram(An.program)&&(Ea=!0,Ti=!0,es=!0),G.id!==U&&(U=G.id,Ti=!0),Ea||x!==T){xe.setValue(C,"projectionMatrix",T.projectionMatrix),xe.setValue(C,"viewMatrix",T.matrixWorldInverse);const Oe=xe.map.cameraPosition;Oe!==void 0&&Oe.setValue(C,Ut.setFromMatrixPosition(T.matrixWorld)),it.logarithmicDepthBuffer&&xe.setValue(C,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&xe.setValue(C,"isOrthographic",T.isOrthographicCamera===!0),x!==T&&(x=T,Ti=!0,es=!0)}if(B.isSkinnedMesh){xe.setOptional(C,B,"bindMatrix"),xe.setOptional(C,B,"bindMatrixInverse");const Oe=B.skeleton;Oe&&(it.floatVertexTextures?(Oe.boneTexture===null&&Oe.computeBoneTexture(),xe.setValue(C,"boneTexture",Oe.boneTexture,y)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}B.isBatchedMesh&&(xe.setOptional(C,B,"batchingTexture"),xe.setValue(C,"batchingTexture",B._matricesTexture,y));const ns=z.morphAttributes;if((ns.position!==void 0||ns.normal!==void 0||ns.color!==void 0&&it.isWebGL2===!0)&&Wt.update(B,z,An),(Ti||Vt.receiveShadow!==B.receiveShadow)&&(Vt.receiveShadow=B.receiveShadow,xe.setValue(C,"receiveShadow",B.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(wn.envMap.value=Pt,wn.flipEnvMap.value=Pt.isCubeTexture&&Pt.isRenderTargetTexture===!1?-1:1),Ti&&(xe.setValue(C,"toneMappingExposure",_.toneMappingExposure),Vt.needsLights&&dl(wn,es),pt&&G.fog===!0&&ct.refreshFogUniforms(wn,pt),ct.refreshMaterialUniforms(wn,G,$,H,xt),Fr.upload(C,Sa(Vt),wn,y)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Fr.upload(C,Sa(Vt),wn,y),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&xe.setValue(C,"center",B.center),xe.setValue(C,"modelViewMatrix",B.modelViewMatrix),xe.setValue(C,"normalMatrix",B.normalMatrix),xe.setValue(C,"modelMatrix",B.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Oe=G.uniformsGroups;for(let is=0,ml=Oe.length;is<ml;is++)if(it.isWebGL2){const Ta=Oe[is];qt.update(Ta,An),qt.bind(Ta,An)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return An}function dl(T,N){T.ambientLightColor.needsUpdate=N,T.lightProbe.needsUpdate=N,T.directionalLights.needsUpdate=N,T.directionalLightShadows.needsUpdate=N,T.pointLights.needsUpdate=N,T.pointLightShadows.needsUpdate=N,T.spotLights.needsUpdate=N,T.spotLightShadows.needsUpdate=N,T.rectAreaLights.needsUpdate=N,T.hemisphereLights.needsUpdate=N}function pl(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,N,z){dt.get(T.texture).__webglTexture=N,dt.get(T.depthTexture).__webglTexture=z;const G=dt.get(T);G.__hasExternalTextures=!0,G.__hasExternalTextures&&(G.__autoAllocateDepthBuffer=z===void 0,G.__autoAllocateDepthBuffer||Y.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),G.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(T,N){const z=dt.get(T);z.__webglFramebuffer=N,z.__useDefaultFramebuffer=N===void 0},this.setRenderTarget=function(T,N=0,z=0){A=T,P=N,w=z;let G=!0,B=null,pt=!1,St=!1;if(T){const Pt=dt.get(T);Pt.__useDefaultFramebuffer!==void 0?(q.bindFramebuffer(C.FRAMEBUFFER,null),G=!1):Pt.__webglFramebuffer===void 0?y.setupRenderTarget(T):Pt.__hasExternalTextures&&y.rebindTextures(T,dt.get(T.texture).__webglTexture,dt.get(T.depthTexture).__webglTexture);const Gt=T.texture;(Gt.isData3DTexture||Gt.isDataArrayTexture||Gt.isCompressedArrayTexture)&&(St=!0);const It=dt.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(It[N])?B=It[N][z]:B=It[N],pt=!0):it.isWebGL2&&T.samples>0&&y.useMultisampledRTT(T)===!1?B=dt.get(T).__webglMultisampledFramebuffer:Array.isArray(It)?B=It[z]:B=It,E.copy(T.viewport),I.copy(T.scissor),V=T.scissorTest}else E.copy(Q).multiplyScalar($).floor(),I.copy(tt).multiplyScalar($).floor(),V=ut;if(q.bindFramebuffer(C.FRAMEBUFFER,B)&&it.drawBuffers&&G&&q.drawBuffers(T,B),q.viewport(E),q.scissor(I),q.setScissorTest(V),pt){const Pt=dt.get(T.texture);C.framebufferTexture2D(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,C.TEXTURE_CUBE_MAP_POSITIVE_X+N,Pt.__webglTexture,z)}else if(St){const Pt=dt.get(T.texture),Gt=N||0;C.framebufferTextureLayer(C.FRAMEBUFFER,C.COLOR_ATTACHMENT0,Pt.__webglTexture,z||0,Gt)}U=-1},this.readRenderTargetPixels=function(T,N,z,G,B,pt,St){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let wt=dt.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&St!==void 0&&(wt=wt[St]),wt){q.bindFramebuffer(C.FRAMEBUFFER,wt);try{const Pt=T.texture,Gt=Pt.format,It=Pt.type;if(Gt!==Ye&&_t.convert(Gt)!==C.getParameter(C.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Ot=It===Xi&&(Y.has("EXT_color_buffer_half_float")||it.isWebGL2&&Y.has("EXT_color_buffer_float"));if(It!==Tn&&_t.convert(It)!==C.getParameter(C.IMPLEMENTATION_COLOR_READ_TYPE)&&!(It===Mn&&(it.isWebGL2||Y.has("OES_texture_float")||Y.has("WEBGL_color_buffer_float")))&&!Ot){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=T.width-G&&z>=0&&z<=T.height-B&&C.readPixels(N,z,G,B,_t.convert(Gt),_t.convert(It),pt)}finally{const Pt=A!==null?dt.get(A).__webglFramebuffer:null;q.bindFramebuffer(C.FRAMEBUFFER,Pt)}}},this.copyFramebufferToTexture=function(T,N,z=0){const G=Math.pow(2,-z),B=Math.floor(N.image.width*G),pt=Math.floor(N.image.height*G);y.setTexture2D(N,0),C.copyTexSubImage2D(C.TEXTURE_2D,z,0,0,T.x,T.y,B,pt),q.unbindTexture()},this.copyTextureToTexture=function(T,N,z,G=0){const B=N.image.width,pt=N.image.height,St=_t.convert(z.format),wt=_t.convert(z.type);y.setTexture2D(z,0),C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,z.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,z.unpackAlignment),N.isDataTexture?C.texSubImage2D(C.TEXTURE_2D,G,T.x,T.y,B,pt,St,wt,N.image.data):N.isCompressedTexture?C.compressedTexSubImage2D(C.TEXTURE_2D,G,T.x,T.y,N.mipmaps[0].width,N.mipmaps[0].height,St,N.mipmaps[0].data):C.texSubImage2D(C.TEXTURE_2D,G,T.x,T.y,St,wt,N.image),G===0&&z.generateMipmaps&&C.generateMipmap(C.TEXTURE_2D),q.unbindTexture()},this.copyTextureToTexture3D=function(T,N,z,G,B=0){if(_.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const pt=T.max.x-T.min.x+1,St=T.max.y-T.min.y+1,wt=T.max.z-T.min.z+1,Pt=_t.convert(G.format),Gt=_t.convert(G.type);let It;if(G.isData3DTexture)y.setTexture3D(G,0),It=C.TEXTURE_3D;else if(G.isDataArrayTexture||G.isCompressedArrayTexture)y.setTexture2DArray(G,0),It=C.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}C.pixelStorei(C.UNPACK_FLIP_Y_WEBGL,G.flipY),C.pixelStorei(C.UNPACK_PREMULTIPLY_ALPHA_WEBGL,G.premultiplyAlpha),C.pixelStorei(C.UNPACK_ALIGNMENT,G.unpackAlignment);const Ot=C.getParameter(C.UNPACK_ROW_LENGTH),oe=C.getParameter(C.UNPACK_IMAGE_HEIGHT),Le=C.getParameter(C.UNPACK_SKIP_PIXELS),pe=C.getParameter(C.UNPACK_SKIP_ROWS),nn=C.getParameter(C.UNPACK_SKIP_IMAGES),ie=z.isCompressedTexture?z.mipmaps[B]:z.image;C.pixelStorei(C.UNPACK_ROW_LENGTH,ie.width),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,ie.height),C.pixelStorei(C.UNPACK_SKIP_PIXELS,T.min.x),C.pixelStorei(C.UNPACK_SKIP_ROWS,T.min.y),C.pixelStorei(C.UNPACK_SKIP_IMAGES,T.min.z),z.isDataTexture||z.isData3DTexture?C.texSubImage3D(It,B,N.x,N.y,N.z,pt,St,wt,Pt,Gt,ie.data):z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),C.compressedTexSubImage3D(It,B,N.x,N.y,N.z,pt,St,wt,Pt,ie.data)):C.texSubImage3D(It,B,N.x,N.y,N.z,pt,St,wt,Pt,Gt,ie),C.pixelStorei(C.UNPACK_ROW_LENGTH,Ot),C.pixelStorei(C.UNPACK_IMAGE_HEIGHT,oe),C.pixelStorei(C.UNPACK_SKIP_PIXELS,Le),C.pixelStorei(C.UNPACK_SKIP_ROWS,pe),C.pixelStorei(C.UNPACK_SKIP_IMAGES,nn),B===0&&G.generateMipmaps&&C.generateMipmap(It),q.unbindTexture()},this.initTexture=function(T){T.isCubeTexture?y.setTextureCube(T,0):T.isData3DTexture?y.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?y.setTexture2DArray(T,0):y.setTexture2D(T,0),q.unbindTexture()},this.resetState=function(){P=0,w=0,A=null,q.reset(),Bt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return hn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===la?"display-p3":"srgb",e.unpackColorSpace=$t.workingColorSpace===qr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ge?Bn:bc}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Bn?ge:fn}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class Nm extends qc{}Nm.prototype.isWebGL1Renderer=!0;class Yc{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new Nt(t),this.density=e}clone(){return new Yc(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class $c{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Nt(t),this.near=e,this.far=n}clone(){return new $c(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Fm extends ce{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Om{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Js,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=tn()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let r=0,s=this.stride;r<s;r++)this.array[t+r]=e.array[n+r];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=tn()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ae=new R;class Wr{constructor(t,e,n,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}setX(t,e){return this.normalized&&(e=Yt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Yt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Yt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Yt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Qe(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Qe(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Qe(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Qe(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array),r=Yt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Yt(e,this.array),n=Yt(n,this.array),r=Yt(r,this.array),s=Yt(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=r,this.data.array[t+3]=s,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return new Ve(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new Wr(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const r=n*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)e.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Bm extends dn{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let ai;const Ci=new R,oi=new R,ci=new R,li=new rt,Pi=new rt,Zc=new Jt,Tr=new R,Li=new R,br=new R,Wo=new rt,Us=new rt,Xo=new rt;class $g extends ce{constructor(t=new Bm){if(super(),this.isSprite=!0,this.type="Sprite",ai===void 0){ai=new ve;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new Om(e,5);ai.setIndex([0,1,2,0,2,3]),ai.setAttribute("position",new Wr(n,3,0,!1)),ai.setAttribute("uv",new Wr(n,2,3,!1))}this.geometry=ai,this.material=t,this.center=new rt(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),oi.setFromMatrixScale(this.matrixWorld),Zc.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),ci.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&oi.multiplyScalar(-ci.z);const n=this.material.rotation;let r,s;n!==0&&(s=Math.cos(n),r=Math.sin(n));const o=this.center;Ar(Tr.set(-.5,-.5,0),ci,o,oi,r,s),Ar(Li.set(.5,-.5,0),ci,o,oi,r,s),Ar(br.set(.5,.5,0),ci,o,oi,r,s),Wo.set(0,0),Us.set(1,0),Xo.set(1,1);let a=t.ray.intersectTriangle(Tr,Li,br,!1,Ci);if(a===null&&(Ar(Li.set(-.5,.5,0),ci,o,oi,r,s),Us.set(0,1),a=t.ray.intersectTriangle(Tr,br,Li,!1,Ci),a===null))return;const c=t.ray.origin.distanceTo(Ci);c<t.near||c>t.far||e.push({distance:c,point:Ci.clone(),uv:Ge.getInterpolation(Ci,Tr,Li,br,Wo,Us,Xo,new rt),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ar(i,t,e,n,r,s){li.subVectors(i,e).addScalar(.5).multiply(n),r!==void 0?(Pi.x=s*li.x-r*li.y,Pi.y=r*li.x+s*li.y):Pi.copy(li),i.copy(t),i.x+=Pi.x,i.y+=Pi.y,i.applyMatrix4(Zc)}class qo extends Ve{constructor(t,e,n,r=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=r}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const hi=new Jt,Yo=new Jt,wr=[],$o=new Vn,zm=new Jt,Di=new Tt,Ui=new kn;class Zg extends Tt{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new qo(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let r=0;r<n;r++)this.setMatrixAt(r,zm)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Vn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,hi),$o.copy(t.boundingBox).applyMatrix4(hi),this.boundingBox.union($o)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new kn),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,hi),Ui.copy(t.boundingSphere).applyMatrix4(hi),this.boundingSphere.union(Ui)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){const n=this.matrixWorld,r=this.count;if(Di.geometry=this.geometry,Di.material=this.material,Di.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Ui.copy(this.boundingSphere),Ui.applyMatrix4(n),t.ray.intersectsSphere(Ui)!==!1))for(let s=0;s<r;s++){this.getMatrixAt(s,hi),Yo.multiplyMatrices(n,hi),Di.matrixWorld=Yo,Di.raycast(t,wr);for(let o=0,a=wr.length;o<a;o++){const c=wr[o];c.instanceId=s,c.object=this,e.push(c)}wr.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new qo(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}}class Gm extends dn{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Nt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const Zo=new R,Jo=new R,Ko=new Jt,Is=new Yr,Rr=new kn;class Jg extends ce{constructor(t=new ve,e=new Gm){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let r=1,s=e.count;r<s;r++)Zo.fromBufferAttribute(e,r-1),Jo.fromBufferAttribute(e,r),n[r]=n[r-1],n[r]+=Zo.distanceTo(Jo);t.setAttribute("lineDistance",new Zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Rr.copy(n.boundingSphere),Rr.applyMatrix4(r),Rr.radius+=s,t.ray.intersectsSphere(Rr)===!1)return;Ko.copy(r).invert(),Is.copy(t.ray).applyMatrix4(Ko);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=new R,h=new R,u=new R,d=new R,m=this.isLineSegments?2:1,g=n.index,p=n.attributes.position;if(g!==null){const f=Math.max(0,o.start),S=Math.min(g.count,o.start+o.count);for(let _=f,b=S-1;_<b;_+=m){const P=g.getX(_),w=g.getX(_+1);if(l.fromBufferAttribute(p,P),h.fromBufferAttribute(p,w),Is.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const U=t.ray.origin.distanceTo(d);U<t.near||U>t.far||e.push({distance:U,point:u.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}else{const f=Math.max(0,o.start),S=Math.min(p.count,o.start+o.count);for(let _=f,b=S-1;_<b;_+=m){if(l.fromBufferAttribute(p,_),h.fromBufferAttribute(p,_+1),Is.distanceSqToSegment(l,h,d,u)>c)continue;d.applyMatrix4(this.matrixWorld);const w=t.ray.origin.distanceTo(d);w<t.near||w>t.far||e.push({distance:w,point:u.clone().applyMatrix4(this.matrixWorld),index:_,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}class Hm extends dn{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Nt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const jo=new Jt,ta=new Yr,Cr=new kn,Pr=new R;class Kg extends ce{constructor(t=new ve,e=new Hm){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,r=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Cr.copy(n.boundingSphere),Cr.applyMatrix4(r),Cr.radius+=s,t.ray.intersectsSphere(Cr)===!1)return;jo.copy(r).invert(),ta.copy(t.ray).applyMatrix4(jo);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=n.index,u=n.attributes.position;if(l!==null){const d=Math.max(0,o.start),m=Math.min(l.count,o.start+o.count);for(let g=d,v=m;g<v;g++){const p=l.getX(g);Pr.fromBufferAttribute(u,p),Qo(Pr,p,c,r,t,e,this)}}else{const d=Math.max(0,o.start),m=Math.min(u.count,o.start+o.count);for(let g=d,v=m;g<v;g++)Pr.fromBufferAttribute(u,g),Qo(Pr,g,c,r,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function Qo(i,t,e,n,r,s,o){const a=ta.distanceSqToPoint(i);if(a<e){const c=new R;ta.closestPointToPoint(i,c),c.applyMatrix4(n);const l=r.ray.origin.distanceTo(c);if(l<r.near||l>r.far)return;s.push({distance:l,distanceToRay:Math.sqrt(a),point:c,index:t,face:null,object:o})}}class Vm extends Pe{constructor(t,e,n,r,s,o,a,c,l){super(t,e,n,r,s,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class en{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let r=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,c=s-1,l;for(;a<=c;)if(r=Math.floor(a+(c-a)/2),l=n[r]-o,l<0)a=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===o)return r/(s-1);const h=n[r],d=n[r+1]-h,m=(o-h)/d;return(r+m)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const o=this.getPoint(r),a=this.getPoint(s),c=e||(o.isVector2?new rt:new R);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new R,r=[],s=[],o=[],a=new R,c=new Jt;for(let m=0;m<=t;m++){const g=m/t;r[m]=this.getTangentAt(g,new R)}s[0]=new R,o[0]=new R;let l=Number.MAX_VALUE;const h=Math.abs(r[0].x),u=Math.abs(r[0].y),d=Math.abs(r[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],a),o[0].crossVectors(r[0],s[0]);for(let m=1;m<=t;m++){if(s[m]=s[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(r[m-1],r[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(_e(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(c.makeRotationAxis(a,g))}o[m].crossVectors(r[m],s[m])}if(e===!0){let m=Math.acos(_e(s[0].dot(s[t]),-1,1));m/=t,r[0].dot(a.crossVectors(s[0],s[t]))>0&&(m=-m);for(let g=1;g<=t;g++)s[g].applyMatrix4(c.makeRotationAxis(r[g],m*g)),o[g].crossVectors(r[g],s[g])}return{tangents:r,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class pa extends en{constructor(t=0,e=0,n=1,r=1,s=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e){const n=e||new rt,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(o?s=0:s=r),this.aClockwise===!0&&!o&&(s===r?s=-r:s=s-r);const a=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,m=l-this.aY;c=d*h-m*u+this.aX,l=d*u+m*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class km extends pa{constructor(t,e,n,r,s,o){super(t,e,n,n,r,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ma(){let i=0,t=0,e=0,n=0;function r(s,o,a,c){i=s,t=a,e=-3*s+3*o-2*a-c,n=2*s-2*o+a+c}return{initCatmullRom:function(s,o,a,c,l){r(o,a,l*(a-s),l*(c-o))},initNonuniformCatmullRom:function(s,o,a,c,l,h,u){let d=(o-s)/l-(a-s)/(l+h)+(a-o)/h,m=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,m*=h,r(o,a,d,m)},calc:function(s){const o=s*s,a=o*s;return i+t*s+e*o+n*a}}}const Lr=new R,Ns=new ma,Fs=new ma,Os=new ma;class Wm extends en{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new R){const n=e,r=this.points,s=r.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:c===0&&a===s-1&&(a=s-2,c=1);let l,h;this.closed||a>0?l=r[(a-1)%s]:(Lr.subVectors(r[0],r[1]).add(r[0]),l=Lr);const u=r[a%s],d=r[(a+1)%s];if(this.closed||a+2<s?h=r[(a+2)%s]:(Lr.subVectors(r[s-1],r[s-2]).add(r[s-1]),h=Lr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),m),v=Math.pow(u.distanceToSquared(d),m),p=Math.pow(d.distanceToSquared(h),m);v<1e-4&&(v=1),g<1e-4&&(g=v),p<1e-4&&(p=v),Ns.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,v,p),Fs.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,v,p),Os.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,v,p)}else this.curveType==="catmullrom"&&(Ns.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),Fs.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),Os.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(Ns.calc(c),Fs.calc(c),Os.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new R().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function tc(i,t,e,n,r){const s=(n-t)*.5,o=(r-e)*.5,a=i*i,c=i*a;return(2*e-2*n+s+o)*c+(-3*e+3*n-2*s-o)*a+s*i+e}function Xm(i,t){const e=1-i;return e*e*t}function qm(i,t){return 2*(1-i)*i*t}function Ym(i,t){return i*i*t}function Gi(i,t,e,n){return Xm(i,t)+qm(i,e)+Ym(i,n)}function $m(i,t){const e=1-i;return e*e*e*t}function Zm(i,t){const e=1-i;return 3*e*e*i*t}function Jm(i,t){return 3*(1-i)*i*i*t}function Km(i,t){return i*i*i*t}function Hi(i,t,e,n,r){return $m(i,t)+Zm(i,e)+Jm(i,n)+Km(i,r)}class Jc extends en{constructor(t=new rt,e=new rt,n=new rt,r=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new rt){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Hi(t,r.x,s.x,o.x,a.x),Hi(t,r.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class jm extends en{constructor(t=new R,e=new R,n=new R,r=new R){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new R){const n=e,r=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Hi(t,r.x,s.x,o.x,a.x),Hi(t,r.y,s.y,o.y,a.y),Hi(t,r.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Kc extends en{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qm extends en{constructor(t=new R,e=new R){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new R){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new R){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class jc extends en{constructor(t=new rt,e=new rt,n=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new rt){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(Gi(t,r.x,s.x,o.x),Gi(t,r.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class tg extends en{constructor(t=new R,e=new R,n=new R){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new R){const n=e,r=this.v0,s=this.v1,o=this.v2;return n.set(Gi(t,r.x,s.x,o.x),Gi(t,r.y,s.y,o.y),Gi(t,r.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Qc extends en{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){const n=e,r=this.points,s=(r.length-1)*t,o=Math.floor(s),a=s-o,c=r[o===0?o:o-1],l=r[o],h=r[o>r.length-2?r.length-1:o+1],u=r[o>r.length-3?r.length-1:o+2];return n.set(tc(a,c.x,l.x,h.x,u.x),tc(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new rt().fromArray(r))}return this}}var ea=Object.freeze({__proto__:null,ArcCurve:km,CatmullRomCurve3:Wm,CubicBezierCurve:Jc,CubicBezierCurve3:jm,EllipseCurve:pa,LineCurve:Kc,LineCurve3:Qm,QuadraticBezierCurve:jc,QuadraticBezierCurve3:tg,SplineCurve:Qc});class eg extends en{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ea[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const o=r[s]-n,a=this.curves[s],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const o=s[r],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new ea[r.type]().fromJSON(r))}return this}}class ec extends eg{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Kc(this.currentPoint.clone(),new rt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new jc(this.currentPoint.clone(),new rt(t,e),new rt(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,o){const a=new Jc(this.currentPoint.clone(),new rt(t,e),new rt(n,r),new rt(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Qc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,r,s,o),this}absarc(t,e,n,r,s,o){return this.absellipse(t,e,n,n,r,s,o),this}ellipse(t,e,n,r,s,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,r,s,o,a,c),this}absellipse(t,e,n,r,s,o,a,c){const l=new pa(t,e,n,r,s,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class ga extends ve{constructor(t=1,e=32,n=0,r=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:r},e=Math.max(3,e);const s=[],o=[],a=[],c=[],l=new R,h=new rt;o.push(0,0,0),a.push(0,0,1),c.push(.5,.5);for(let u=0,d=3;u<=e;u++,d+=3){const m=n+u/e*r;l.x=t*Math.cos(m),l.y=t*Math.sin(m),o.push(l.x,l.y,l.z),a.push(0,0,1),h.x=(o[d]/t+1)/2,h.y=(o[d+1]/t+1)/2,c.push(h.x,h.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new Zt(o,3)),this.setAttribute("normal",new Zt(a,3)),this.setAttribute("uv",new Zt(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ga(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class Fe extends ve{constructor(t=1,e=1,n=1,r=32,s=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const h=[],u=[],d=[],m=[];let g=0;const v=[],p=n/2;let f=0;S(),o===!1&&(t>0&&_(!0),e>0&&_(!1)),this.setIndex(h),this.setAttribute("position",new Zt(u,3)),this.setAttribute("normal",new Zt(d,3)),this.setAttribute("uv",new Zt(m,2));function S(){const b=new R,P=new R;let w=0;const A=(e-t)/n;for(let U=0;U<=s;U++){const x=[],E=U/s,I=E*(e-t)+t;for(let V=0;V<=r;V++){const nt=V/r,D=nt*c+a,O=Math.sin(D),H=Math.cos(D);P.x=I*O,P.y=-E*n+p,P.z=I*H,u.push(P.x,P.y,P.z),b.set(O,A,H).normalize(),d.push(b.x,b.y,b.z),m.push(nt,1-E),x.push(g++)}v.push(x)}for(let U=0;U<r;U++)for(let x=0;x<s;x++){const E=v[x][U],I=v[x+1][U],V=v[x+1][U+1],nt=v[x][U+1];h.push(E,I,nt),h.push(I,V,nt),w+=6}l.addGroup(f,w,0),f+=w}function _(b){const P=g,w=new rt,A=new R;let U=0;const x=b===!0?t:e,E=b===!0?1:-1;for(let V=1;V<=r;V++)u.push(0,p*E,0),d.push(0,E,0),m.push(.5,.5),g++;const I=g;for(let V=0;V<=r;V++){const D=V/r*c+a,O=Math.cos(D),H=Math.sin(D);A.x=x*H,A.y=p*E,A.z=x*O,u.push(A.x,A.y,A.z),d.push(0,E,0),w.x=O*.5+.5,w.y=H*.5*E+.5,m.push(w.x,w.y),g++}for(let V=0;V<r;V++){const nt=P+V,D=I+V;b===!0?h.push(D,D+1,nt):h.push(D+1,D,nt),U+=3}l.addGroup(f,U,b===!0?1:2),f+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Fe(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Vi extends Fe{constructor(t=1,e=1,n=32,r=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,r,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new Vi(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Kr extends ve{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],o=[];a(r),l(n),h(),this.setAttribute("position",new Zt(s,3)),this.setAttribute("normal",new Zt(s.slice(),3)),this.setAttribute("uv",new Zt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(S){const _=new R,b=new R,P=new R;for(let w=0;w<e.length;w+=3)m(e[w+0],_),m(e[w+1],b),m(e[w+2],P),c(_,b,P,S)}function c(S,_,b,P){const w=P+1,A=[];for(let U=0;U<=w;U++){A[U]=[];const x=S.clone().lerp(b,U/w),E=_.clone().lerp(b,U/w),I=w-U;for(let V=0;V<=I;V++)V===0&&U===w?A[U][V]=x:A[U][V]=x.clone().lerp(E,V/I)}for(let U=0;U<w;U++)for(let x=0;x<2*(w-U)-1;x++){const E=Math.floor(x/2);x%2===0?(d(A[U][E+1]),d(A[U+1][E]),d(A[U][E])):(d(A[U][E+1]),d(A[U+1][E+1]),d(A[U+1][E]))}}function l(S){const _=new R;for(let b=0;b<s.length;b+=3)_.x=s[b+0],_.y=s[b+1],_.z=s[b+2],_.normalize().multiplyScalar(S),s[b+0]=_.x,s[b+1]=_.y,s[b+2]=_.z}function h(){const S=new R;for(let _=0;_<s.length;_+=3){S.x=s[_+0],S.y=s[_+1],S.z=s[_+2];const b=p(S)/2/Math.PI+.5,P=f(S)/Math.PI+.5;o.push(b,1-P)}g(),u()}function u(){for(let S=0;S<o.length;S+=6){const _=o[S+0],b=o[S+2],P=o[S+4],w=Math.max(_,b,P),A=Math.min(_,b,P);w>.9&&A<.1&&(_<.2&&(o[S+0]+=1),b<.2&&(o[S+2]+=1),P<.2&&(o[S+4]+=1))}}function d(S){s.push(S.x,S.y,S.z)}function m(S,_){const b=S*3;_.x=t[b+0],_.y=t[b+1],_.z=t[b+2]}function g(){const S=new R,_=new R,b=new R,P=new R,w=new rt,A=new rt,U=new rt;for(let x=0,E=0;x<s.length;x+=9,E+=6){S.set(s[x+0],s[x+1],s[x+2]),_.set(s[x+3],s[x+4],s[x+5]),b.set(s[x+6],s[x+7],s[x+8]),w.set(o[E+0],o[E+1]),A.set(o[E+2],o[E+3]),U.set(o[E+4],o[E+5]),P.copy(S).add(_).add(b).divideScalar(3);const I=p(P);v(w,E+0,S,I),v(A,E+2,_,I),v(U,E+4,b,I)}}function v(S,_,b,P){P<0&&S.x===1&&(o[_]=S.x-1),b.x===0&&b.z===0&&(o[_]=P/2/Math.PI+.5)}function p(S){return Math.atan2(S.z,-S.x)}function f(S){return Math.atan2(-S.y,Math.sqrt(S.x*S.x+S.z*S.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Kr(t.vertices,t.indices,t.radius,t.details)}}class tl extends ec{constructor(t){super(t),this.uuid=tn(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new ec().fromJSON(r))}return this}}const ng={triangulate:function(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=el(i,0,r,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,c,l,h,u,d,m;if(n&&(s=og(i,t,s,e)),i.length>80*e){a=l=i[0],c=h=i[1];for(let g=e;g<r;g+=e)u=i[g],d=i[g+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);m=Math.max(l-a,h-c),m=m!==0?32767/m:0}return Yi(s,o,e,a,c,m,0),o}};function el(i,t,e,n,r){let s,o;if(r===vg(i,t,e,n)>0)for(s=t;s<e;s+=n)o=nc(s,i[s],i[s+1],o);else for(s=e-n;s>=t;s-=n)o=nc(s,i[s],i[s+1],o);return o&&jr(o,o.next)&&(Zi(o),o=o.next),o}function Hn(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(jr(e,e.next)||re(e.prev,e,e.next)===0)){if(Zi(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Yi(i,t,e,n,r,s,o){if(!i)return;!o&&s&&fg(i,n,r,s);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,s?rg(i,n,r,s):ig(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Zi(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=sg(Hn(i),t,e),Yi(i,t,e,n,r,s,2)):o===2&&ag(i,t,e,n,r,s):Yi(Hn(i),t,e,n,r,s,1);break}}}function ig(i){const t=i.prev,e=i,n=i.next;if(re(t,e,n)>=0)return!1;const r=t.x,s=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=r<s?r<o?r:o:s<o?s:o,u=a<c?a<l?a:l:c<l?c:l,d=r>s?r>o?r:o:s>o?s:o,m=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=m&&pi(r,a,s,c,o,l,g.x,g.y)&&re(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function rg(i,t,e,n){const r=i.prev,s=i,o=i.next;if(re(r,s,o)>=0)return!1;const a=r.x,c=s.x,l=o.x,h=r.y,u=s.y,d=o.y,m=a<c?a<l?a:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,v=a>c?a>l?a:l:c>l?c:l,p=h>u?h>d?h:d:u>d?u:d,f=na(m,g,t,e,n),S=na(v,p,t,e,n);let _=i.prevZ,b=i.nextZ;for(;_&&_.z>=f&&b&&b.z<=S;){if(_.x>=m&&_.x<=v&&_.y>=g&&_.y<=p&&_!==r&&_!==o&&pi(a,h,c,u,l,d,_.x,_.y)&&re(_.prev,_,_.next)>=0||(_=_.prevZ,b.x>=m&&b.x<=v&&b.y>=g&&b.y<=p&&b!==r&&b!==o&&pi(a,h,c,u,l,d,b.x,b.y)&&re(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;_&&_.z>=f;){if(_.x>=m&&_.x<=v&&_.y>=g&&_.y<=p&&_!==r&&_!==o&&pi(a,h,c,u,l,d,_.x,_.y)&&re(_.prev,_,_.next)>=0)return!1;_=_.prevZ}for(;b&&b.z<=S;){if(b.x>=m&&b.x<=v&&b.y>=g&&b.y<=p&&b!==r&&b!==o&&pi(a,h,c,u,l,d,b.x,b.y)&&re(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function sg(i,t,e){let n=i;do{const r=n.prev,s=n.next.next;!jr(r,s)&&nl(r,n,n.next,s)&&$i(r,s)&&$i(s,r)&&(t.push(r.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),Zi(n),Zi(n.next),n=i=s),n=n.next}while(n!==i);return Hn(n)}function ag(i,t,e,n,r,s){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&mg(o,a)){let c=il(o,a);o=Hn(o,o.next),c=Hn(c,c.next),Yi(o,t,e,n,r,s,0),Yi(c,t,e,n,r,s,0);return}a=a.next}o=o.next}while(o!==i)}function og(i,t,e,n){const r=[];let s,o,a,c,l;for(s=0,o=t.length;s<o;s++)a=t[s]*n,c=s<o-1?t[s+1]*n:i.length,l=el(i,a,c,n,!1),l===l.next&&(l.steiner=!0),r.push(pg(l));for(r.sort(cg),s=0;s<r.length;s++)e=lg(r[s],e);return e}function cg(i,t){return i.x-t.x}function lg(i,t){const e=hg(i,t);if(!e)return t;const n=il(e,i);return Hn(n,n.next),Hn(e,e.next)}function hg(i,t){let e=t,n=-1/0,r;const s=i.x,o=i.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=s&&d>n&&(n=d,r=e.x<e.next.x?e:e.next,d===s))return r}e=e.next}while(e!==t);if(!r)return null;const a=r,c=r.x,l=r.y;let h=1/0,u;e=r;do s>=e.x&&e.x>=c&&s!==e.x&&pi(o<l?s:n,o,c,l,o<l?n:s,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(s-e.x),$i(e,i)&&(u<h||u===h&&(e.x>r.x||e.x===r.x&&ug(r,e)))&&(r=e,h=u)),e=e.next;while(e!==a);return r}function ug(i,t){return re(i.prev,i,t.prev)<0&&re(t.next,i,i.next)<0}function fg(i,t,e,n){let r=i;do r.z===0&&(r.z=na(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,dg(r)}function dg(i){let t,e,n,r,s,o,a,c,l=1;do{for(e=i,i=null,s=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(r=e,e=e.nextZ,a--):(r=n,n=n.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;e=n}s.nextZ=null,l*=2}while(o>1);return i}function na(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function pg(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function pi(i,t,e,n,r,s,o,a){return(r-o)*(t-a)>=(i-o)*(s-a)&&(i-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(r-o)*(n-a)}function mg(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!gg(i,t)&&($i(i,t)&&$i(t,i)&&_g(i,t)&&(re(i.prev,i,t.prev)||re(i,t.prev,t))||jr(i,t)&&re(i.prev,i,i.next)>0&&re(t.prev,t,t.next)>0)}function re(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function jr(i,t){return i.x===t.x&&i.y===t.y}function nl(i,t,e,n){const r=Ur(re(i,t,e)),s=Ur(re(i,t,n)),o=Ur(re(e,n,i)),a=Ur(re(e,n,t));return!!(r!==s&&o!==a||r===0&&Dr(i,e,t)||s===0&&Dr(i,n,t)||o===0&&Dr(e,i,n)||a===0&&Dr(e,t,n))}function Dr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Ur(i){return i>0?1:i<0?-1:0}function gg(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&nl(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function $i(i,t){return re(i.prev,i,i.next)<0?re(i,t,i.next)>=0&&re(i,i.prev,t)>=0:re(i,t,i.prev)<0||re(i,i.next,t)<0}function _g(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function il(i,t){const e=new ia(i.i,i.x,i.y),n=new ia(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function nc(i,t,e,n){const r=new ia(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Zi(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ia(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function vg(i,t,e,n){let r=0;for(let s=t,o=e-n;s<e;s+=n)r+=(i[o]-i[s])*(i[s+1]+i[o+1]),o=s;return r}class ki{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return ki.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];ic(t),rc(n,t);let o=t.length;e.forEach(ic);for(let c=0;c<e.length;c++)r.push(o),o+=e[c].length,rc(n,e[c]);const a=ng.triangulate(n,r);for(let c=0;c<a.length;c+=3)s.push(a.slice(c,c+3));return s}}function ic(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function rc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class _a extends ve{constructor(t=new tl([new rt(.5,.5),new rt(-.5,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let a=0,c=t.length;a<c;a++){const l=t[a];o(l)}this.setAttribute("position",new Zt(r,3)),this.setAttribute("uv",new Zt(s,2)),this.computeVertexNormals();function o(a){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,m=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:m-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const f=e.extrudePath,S=e.UVGenerator!==void 0?e.UVGenerator:xg;let _,b=!1,P,w,A,U;f&&(_=f.getSpacedPoints(h),b=!0,d=!1,P=f.computeFrenetFrames(h,!1),w=new R,A=new R,U=new R),d||(p=0,m=0,g=0,v=0);const x=a.extractPoints(l);let E=x.shape;const I=x.holes;if(!ki.isClockWise(E)){E=E.reverse();for(let C=0,st=I.length;C<st;C++){const Y=I[C];ki.isClockWise(Y)&&(I[C]=Y.reverse())}}const nt=ki.triangulateShape(E,I),D=E;for(let C=0,st=I.length;C<st;C++){const Y=I[C];E=E.concat(Y)}function O(C,st,Y){return st||console.error("THREE.ExtrudeGeometry: vec does not exist"),C.clone().addScaledVector(st,Y)}const H=E.length,$=nt.length;function X(C,st,Y){let it,q,yt;const dt=C.x-st.x,y=C.y-st.y,M=Y.x-C.x,F=Y.y-C.y,et=dt*dt+y*y,K=dt*F-y*M;if(Math.abs(K)>Number.EPSILON){const Z=Math.sqrt(et),vt=Math.sqrt(M*M+F*F),ct=st.x-y/Z,gt=st.y+dt/Z,bt=Y.x-F/vt,Ft=Y.y+M/vt,j=((bt-ct)*F-(Ft-gt)*M)/(dt*F-y*M);it=ct+dt*j-C.x,q=gt+y*j-C.y;const Xt=it*it+q*q;if(Xt<=2)return new rt(it,q);yt=Math.sqrt(Xt/2)}else{let Z=!1;dt>Number.EPSILON?M>Number.EPSILON&&(Z=!0):dt<-Number.EPSILON?M<-Number.EPSILON&&(Z=!0):Math.sign(y)===Math.sign(F)&&(Z=!0),Z?(it=-y,q=dt,yt=Math.sqrt(et)):(it=dt,q=y,yt=Math.sqrt(et/2))}return new rt(it/yt,q/yt)}const W=[];for(let C=0,st=D.length,Y=st-1,it=C+1;C<st;C++,Y++,it++)Y===st&&(Y=0),it===st&&(it=0),W[C]=X(D[C],D[Y],D[it]);const Q=[];let tt,ut=W.concat();for(let C=0,st=I.length;C<st;C++){const Y=I[C];tt=[];for(let it=0,q=Y.length,yt=q-1,dt=it+1;it<q;it++,yt++,dt++)yt===q&&(yt=0),dt===q&&(dt=0),tt[it]=X(Y[it],Y[yt],Y[dt]);Q.push(tt),ut=ut.concat(tt)}for(let C=0;C<p;C++){const st=C/p,Y=m*Math.cos(st*Math.PI/2),it=g*Math.sin(st*Math.PI/2)+v;for(let q=0,yt=D.length;q<yt;q++){const dt=O(D[q],W[q],it);mt(dt.x,dt.y,-Y)}for(let q=0,yt=I.length;q<yt;q++){const dt=I[q];tt=Q[q];for(let y=0,M=dt.length;y<M;y++){const F=O(dt[y],tt[y],it);mt(F.x,F.y,-Y)}}}const k=g+v;for(let C=0;C<H;C++){const st=d?O(E[C],ut[C],k):E[C];b?(A.copy(P.normals[0]).multiplyScalar(st.x),w.copy(P.binormals[0]).multiplyScalar(st.y),U.copy(_[0]).add(A).add(w),mt(U.x,U.y,U.z)):mt(st.x,st.y,0)}for(let C=1;C<=h;C++)for(let st=0;st<H;st++){const Y=d?O(E[st],ut[st],k):E[st];b?(A.copy(P.normals[C]).multiplyScalar(Y.x),w.copy(P.binormals[C]).multiplyScalar(Y.y),U.copy(_[C]).add(A).add(w),mt(U.x,U.y,U.z)):mt(Y.x,Y.y,u/h*C)}for(let C=p-1;C>=0;C--){const st=C/p,Y=m*Math.cos(st*Math.PI/2),it=g*Math.sin(st*Math.PI/2)+v;for(let q=0,yt=D.length;q<yt;q++){const dt=O(D[q],W[q],it);mt(dt.x,dt.y,u+Y)}for(let q=0,yt=I.length;q<yt;q++){const dt=I[q];tt=Q[q];for(let y=0,M=dt.length;y<M;y++){const F=O(dt[y],tt[y],it);b?mt(F.x,F.y+_[h-1].y,_[h-1].x+Y):mt(F.x,F.y,u+Y)}}}J(),ft();function J(){const C=r.length/3;if(d){let st=0,Y=H*st;for(let it=0;it<$;it++){const q=nt[it];Rt(q[2]+Y,q[1]+Y,q[0]+Y)}st=h+p*2,Y=H*st;for(let it=0;it<$;it++){const q=nt[it];Rt(q[0]+Y,q[1]+Y,q[2]+Y)}}else{for(let st=0;st<$;st++){const Y=nt[st];Rt(Y[2],Y[1],Y[0])}for(let st=0;st<$;st++){const Y=nt[st];Rt(Y[0]+H*h,Y[1]+H*h,Y[2]+H*h)}}n.addGroup(C,r.length/3-C,0)}function ft(){const C=r.length/3;let st=0;xt(D,st),st+=D.length;for(let Y=0,it=I.length;Y<it;Y++){const q=I[Y];xt(q,st),st+=q.length}n.addGroup(C,r.length/3-C,1)}function xt(C,st){let Y=C.length;for(;--Y>=0;){const it=Y;let q=Y-1;q<0&&(q=C.length-1);for(let yt=0,dt=h+p*2;yt<dt;yt++){const y=H*yt,M=H*(yt+1),F=st+it+y,et=st+q+y,K=st+q+M,Z=st+it+M;Ut(F,et,K,Z)}}}function mt(C,st,Y){c.push(C),c.push(st),c.push(Y)}function Rt(C,st,Y){Mt(C),Mt(st),Mt(Y);const it=r.length/3,q=S.generateTopUV(n,r,it-3,it-2,it-1);Lt(q[0]),Lt(q[1]),Lt(q[2])}function Ut(C,st,Y,it){Mt(C),Mt(st),Mt(it),Mt(st),Mt(Y),Mt(it);const q=r.length/3,yt=S.generateSideWallUV(n,r,q-6,q-3,q-2,q-1);Lt(yt[0]),Lt(yt[1]),Lt(yt[3]),Lt(yt[1]),Lt(yt[2]),Lt(yt[3])}function Mt(C){r.push(c[C*3+0]),r.push(c[C*3+1]),r.push(c[C*3+2])}function Lt(C){s.push(C.x),s.push(C.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Mg(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new ea[r.type]().fromJSON(r)),new _a(n,t.options)}}const xg={generateTopUV:function(i,t,e,n,r){const s=t[e*3],o=t[e*3+1],a=t[n*3],c=t[n*3+1],l=t[r*3],h=t[r*3+1];return[new rt(s,o),new rt(a,c),new rt(l,h)]},generateSideWallUV:function(i,t,e,n,r,s){const o=t[e*3],a=t[e*3+1],c=t[e*3+2],l=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[r*3],m=t[r*3+1],g=t[r*3+2],v=t[s*3],p=t[s*3+1],f=t[s*3+2];return Math.abs(a-h)<Math.abs(o-l)?[new rt(o,1-c),new rt(l,1-u),new rt(d,1-g),new rt(v,1-f)]:[new rt(a,1-c),new rt(h,1-u),new rt(m,1-g),new rt(p,1-f)]}};function Mg(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class rl extends Kr{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new rl(t.radius,t.detail)}}class va extends Kr{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,r,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new va(t.radius,t.detail)}}class sl extends ve{constructor(t=.5,e=1,n=32,r=1,s=0,o=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:r,thetaStart:s,thetaLength:o},n=Math.max(3,n),r=Math.max(1,r);const a=[],c=[],l=[],h=[];let u=t;const d=(e-t)/r,m=new R,g=new rt;for(let v=0;v<=r;v++){for(let p=0;p<=n;p++){const f=s+p/n*o;m.x=u*Math.cos(f),m.y=u*Math.sin(f),c.push(m.x,m.y,m.z),l.push(0,0,1),g.x=(m.x/e+1)/2,g.y=(m.y/e+1)/2,h.push(g.x,g.y)}u+=d}for(let v=0;v<r;v++){const p=v*(n+1);for(let f=0;f<n;f++){const S=f+p,_=S,b=S+n+1,P=S+n+2,w=S+1;a.push(_,b,w),a.push(b,P,w)}}this.setIndex(a),this.setAttribute("position",new Zt(c,3)),this.setAttribute("normal",new Zt(l,3)),this.setAttribute("uv",new Zt(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new sl(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}}class $e extends ve{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new R,d=new R,m=[],g=[],v=[],p=[];for(let f=0;f<=n;f++){const S=[],_=f/n;let b=0;f===0&&o===0?b=.5/e:f===n&&c===Math.PI&&(b=-.5/e);for(let P=0;P<=e;P++){const w=P/e;u.x=-t*Math.cos(r+w*s)*Math.sin(o+_*a),u.y=t*Math.cos(o+_*a),u.z=t*Math.sin(r+w*s)*Math.sin(o+_*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),v.push(d.x,d.y,d.z),p.push(w+b,1-_),S.push(l++)}h.push(S)}for(let f=0;f<n;f++)for(let S=0;S<e;S++){const _=h[f][S+1],b=h[f][S],P=h[f+1][S],w=h[f+1][S+1];(f!==0||o>0)&&m.push(_,b,w),(f!==n-1||c<Math.PI)&&m.push(b,P,w)}this.setIndex(m),this.setAttribute("position",new Zt(g,3)),this.setAttribute("normal",new Zt(v,3)),this.setAttribute("uv",new Zt(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new $e(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class un extends ve{constructor(t=1,e=.4,n=12,r=48,s=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:r,arc:s},n=Math.floor(n),r=Math.floor(r);const o=[],a=[],c=[],l=[],h=new R,u=new R,d=new R;for(let m=0;m<=n;m++)for(let g=0;g<=r;g++){const v=g/r*s,p=m/n*Math.PI*2;u.x=(t+e*Math.cos(p))*Math.cos(v),u.y=(t+e*Math.cos(p))*Math.sin(v),u.z=e*Math.sin(p),a.push(u.x,u.y,u.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),d.subVectors(u,h).normalize(),c.push(d.x,d.y,d.z),l.push(g/r),l.push(m/n)}for(let m=1;m<=n;m++)for(let g=1;g<=r;g++){const v=(r+1)*m+g-1,p=(r+1)*(m-1)+g-1,f=(r+1)*(m-1)+g,S=(r+1)*m+g;o.push(v,p,S),o.push(p,f,S)}this.setIndex(o),this.setAttribute("position",new Zt(a,3)),this.setAttribute("normal",new Zt(c,3)),this.setAttribute("uv",new Zt(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new un(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}}class Sg extends dn{constructor(t){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new Nt(0),this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.fog=t.fog,this}}class Qi extends dn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Nt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Nt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Ac,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class al extends Qi{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new rt(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return _e(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new Nt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Nt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Nt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessRange=[...t.iridescenceThicknessRange],this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class Qr extends ce{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Nt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class jg extends Qr{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Nt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const Bs=new Jt,sc=new R,ac=new R;class ol{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.map=null,this.mapPass=null,this.matrix=new Jt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new fa,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;sc.setFromMatrixPosition(t.matrixWorld),e.position.copy(sc),ac.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(ac),e.updateMatrixWorld(),Bs.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bs),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Bs)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const oc=new Jt,Ii=new R,zs=new R;class yg extends ol{constructor(){super(new Ie(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new rt(4,2),this._viewportCount=6,this._viewports=[new ne(2,1,1,1),new ne(0,1,1,1),new ne(3,1,1,1),new ne(1,1,1,1),new ne(3,0,1,1),new ne(1,0,1,1)],this._cubeDirections=[new R(1,0,0),new R(-1,0,0),new R(0,0,1),new R(0,0,-1),new R(0,1,0),new R(0,-1,0)],this._cubeUps=[new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,1,0),new R(0,0,1),new R(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,r=this.matrix,s=t.distance||n.far;s!==n.far&&(n.far=s,n.updateProjectionMatrix()),Ii.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ii),zs.copy(n.position),zs.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(zs),n.updateMatrixWorld(),r.makeTranslation(-Ii.x,-Ii.y,-Ii.z),oc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oc)}}class cc extends Qr{constructor(t,e,n=0,r=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=r,this.shadow=new yg}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Eg extends ol{constructor(){super(new zc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Tg extends Qr{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(ce.DEFAULT_UP),this.updateMatrix(),this.target=new ce,this.shadow=new Eg}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class bg extends Qr{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class Qg{constructor(t,e,n=0,r=1/0){this.ray=new Yr(t,e),this.near=n,this.far=r,this.camera=null,this.layers=new ua,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return ra(t,this,n,e),n.sort(lc),n}intersectObjects(t,e=!0,n=[]){for(let r=0,s=t.length;r<s;r++)ra(t[r],this,n,e);return n.sort(lc),n}}function lc(i,t){return i.distance-t.distance}function ra(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){const r=i.children;for(let s=0,o=r.length;s<o;s++)ra(r[s],t,e,!0)}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:oa}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=oa);const hc=.05,Ji=[8,10,12,15,20],Ki=[1.5,1.25,1,.75,.5],sa=[1,1.15,1.25,1.5],Fi={maxHp:3,magSize:8,reloadTime:Ki[0],fireRate:1/Ji[0],damage:1,pierce:0,spread:0,speed:6.2,dropBonus:0},cl={engineer:"#a7a1ff",firepower:"#ffad61",handling:"#76bcf0",survival:"#70dfb8",fortune:"#bdadfa",ability:"#7cff4a",defence:"#62edff"},t0=["engineer","firepower","handling","survival","fortune","ability","defence"],Gs=[0,2,1.4,1.4,1,1],uc=[0,8,8,11,11,11],e0=5,n0=[0,1,1,1,1,3],Ag=[0,1.5,2.5,3],fc=i=>Ag[i]??0;function ln(i){const t=Math.round(i*10)/10;return Number.isInteger(t)?String(t):t.toFixed(1)}function wg(i){return 1/(Ji[i]??Ji[0])}function Rg(i){return Ki[i]??Ki[0]}function Cg(i){return Fi.speed*(sa[i]??1)}function Ni(i){return String(parseFloat(Number(i).toFixed(2)))}function Pg(i){return Math.min(1,20/(5+Math.max(1,i)*3))}const Lg=[{id:"bot",cat:"engineer",name:"HELPER BOT",desc:"Deploy one automatic companion",max:3,stat:i=>{const t=i.upgrades.bot||0,e=fc(t+1);return t?[ln(fc(t)),`${ln(e)} dmg`]:[`Single gun · ${ln(e)} dmg`]},apply:()=>{}},{id:"botGun",cat:"engineer",name:"TWIN GUNS",desc:"Double bot fire • locks out bombs",max:2,ok:i=>i.upgrades.bot&&!i.upgrades.botBomb,stat:i=>[i.upgrades.botGun?"Twin":"Single",i.upgrades.botGun?"Rapid twin":"Twin guns"],apply:()=>{}},{id:"botBomb",cat:"engineer",name:"BOMB LAUNCHER",desc:"Area blasts • locks out twin guns",max:2,ok:i=>i.upgrades.bot&&!i.upgrades.botGun,stat:i=>[i.upgrades.botBomb?"Area bombs":"Single shots",i.upgrades.botBomb?"Wider bombs":"Area bombs"],apply:()=>{}},{id:"mine",cat:"engineer",name:"TRAIL MINES",desc:"One trap every 8s • max 3 active",max:3,stat:i=>{const t=i.upgrades.mine||0,e=3+t+1;return[t?ln(3+t):"Off",`${ln(e)} dmg`]},apply:()=>{}},{id:"shock",cat:"engineer",name:"SHOCK MINES",desc:"Mine blasts slow survivors for 3s",max:1,ok:i=>i.upgrades.mine,stat:()=>["Explosive","+60% slow"],apply:()=>{}},{id:"regen",cat:"survival",name:"SHIELD REGEN",desc:"Recover 1 shield after avoiding hits",max:2,stat:i=>["No damage for",i.upgrades.regen?"8 seconds":"12 seconds"],apply:()=>{}},{id:"pulse",cat:"survival",name:"EMERGENCY PULSE",desc:"Shield loss blasts and slows drones",max:3,stat:i=>{const t=i.upgrades.pulse||0,e=2+(t+1)*2;return[t?ln(2+t*2):"Off",`${ln(e)} dmg`]},apply:()=>{}},{id:"mag",cat:"handling",name:"CELL CAPACITY",desc:"+4 pulses per cell",max:5,stat:i=>[i.magSize,`${i.magSize+4} pulses`],apply:i=>{i.magSize+=4,i.mag=i.magSize}},{id:"reload",cat:"handling",name:"HOT SWAP",desc:"Reload faster",max:4,stat:i=>{const t=i.upgrades.reload||0;return[`${Ni(Ki[t])}s`,`${Ni(Ki[t+1])}s reload`]},apply:i=>{i.reloadTime=Rg(i.upgrades.reload||0)}},{id:"damage",cat:"firepower",name:"PULSE AMPLIFIER",desc:"+0.5 pulse damage",max:6,stat:i=>[ln(i.damage),`${ln(i.damage+.5)} dmg`],apply:i=>{i.damage+=.5}},{id:"rate",cat:"firepower",name:"RAPID CYCLER",desc:"Fire faster",max:4,stat:i=>{const t=i.upgrades.rate||0;return[String(Ji[t]),`${Ji[t+1]}/s`]},apply:i=>{i.fireRate=wg(i.upgrades.rate||0)}},{id:"pierce",cat:"firepower",name:"PIERCING",desc:"Shots pierce +1 drone",max:3,stat:i=>[i.pierce,`${i.pierce+1} thru`],apply:i=>{i.pierce++}},{id:"spread",cat:"firepower",name:"SPLIT BEAM",desc:"+1 pulse per shot",max:3,stat:i=>[1+i.spread,`${2+i.spread} per shot`],apply:i=>{i.spread++}},{id:"hp",cat:"survival",name:"SHIELD ARRAY",desc:"+1 shield and recharge it",max:3,stat:i=>[i.maxHp,`${i.maxHp+1} max hp`],apply:i=>{i.maxHp++,i.hp++}},{id:"speed",cat:"survival",name:"MOTION SERVO",desc:"Move faster",max:3,stat:i=>{const t=i.upgrades.speed||0;return[`${Math.round(sa[t]*100)}%`,`${Math.round(sa[t+1]*100)}%`]},apply:i=>{i.speed=Cg(i.upgrades.speed||0)}},{id:"luck",cat:"fortune",name:"SALVAGE SCANNER",desc:"More Overcharge / Infinite Cell drops",max:3,stat:i=>{const t=Pg(i.wave);return[`${((hc+i.dropBonus)*t*100).toFixed(1)}%`,`${((hc+i.dropBonus+.03)*t*100).toFixed(1)}% drops`]},apply:i=>{i.dropBonus+=.03}},{id:"heal",cat:"survival",name:"SHIELD RESET",desc:"Restore all shield segments",max:1/0,ok:i=>i.hp<i.maxHp,stat:i=>[i.hp,`${i.maxHp} hp`],apply:i=>{i.hp=i.maxHp}},{id:"magnet",cat:"ability",name:"MAGNETIC GEMS",desc:"Gems surge toward you",max:1,stat:()=>["Short pull","Through walls"],apply:()=>{}},{id:"coil",cat:"defence",name:"TESLA COIL",desc:"Bay coil zaps nearby drones",max:5,ok:i=>!!i.bayActive&&i.wave>=11,stat:i=>{const t=i.upgrades.coil||0,e=t+1;return t?e===3?[`${Math.round(uc[t])}u range`,`${Math.round(uc[e])}u range`]:e===5?["Single zap","Chain ×3"]:[`${Ni(Gs[t])}s`,`${Ni(Gs[e])}s`]:[`Power on · ${Ni(Gs[1])}s`]},apply:()=>{}}];function i0(i){return Lg.find(t=>t.id===i)}function r0(i,t,e={}){const n=e.wave??5,r={...Fi,wave:n,hp:e.hp??Fi.maxHp,mag:Fi.magSize,upgrades:{}};(i.id==="botGun"||i.id==="botBomb")&&(r.upgrades.bot=1),i.id==="shock"&&(r.upgrades.mine=1),i.id==="coil"&&(r.bayActive=!0,r.wave=Math.max(r.wave??0,11)),i.id==="heal"&&(r.hp=e.hp??2,r.maxHp=e.maxHp??Fi.maxHp);for(let s=0;s<t;s++)r.upgrades[i.id]=(r.upgrades[i.id]||0)+1,i.apply(r);return r}function Dg(i="base",t={}){const e=Math.max(1,t.rank??1),n=e-1,r=t.detail==="card"?"card":"game",s=r==="card"?[20,16]:[14,12],o=r==="card"?[16,10]:[12,8],a=r==="card"?10:8,c=new te,l=Ir(15129837,{metalness:.12,roughness:.38,emissive:12101832,emissiveIntensity:.08}),h=Ir(2765372,{metalness:.72,roughness:.32}),u=Hs(11816959,1.35),d=Hs(4582655,1.55),m=Hs(4892927,1.4),g=Ir(3818576,{metalness:.78,roughness:.28});c.add(new Tt(new $e(.42,...s),h));const v=new Tt(new un(.4,.035,6,r==="card"?28:20),Ir(1843754,{metalness:.65,roughness:.4}));v.rotation.x=Math.PI/2,c.add(v);const p=.56,f=.36,S=.1,_=[{phi:Math.PI*.5+f*.5,phiLen:Math.PI-f},{phi:Math.PI*1.5+f*.5,phiLen:Math.PI-f}],b=[{theta:S,thetaLen:Math.PI*.5-S*1.15,top:!0},{theta:Math.PI*.5+S*.15,thetaLen:Math.PI*.5-S*1.15,top:!1}];_.forEach(A=>{b.forEach(U=>{c.add(new Tt(new $e(p,o[0],o[1],A.phi,A.phiLen,U.theta,U.thetaLen),l));const x=A.phi+A.phiLen*.5,E=U.theta+U.thetaLen*(U.top?.55:.72),I=p*.94,V=new Tt(U.top?new He(.15,.11,.028):new He(.17,.04,.028),u);V.position.set(-Math.cos(x)*Math.sin(E)*I,Math.cos(E)*I,Math.sin(x)*Math.sin(E)*I),V.lookAt(0,0,0),c.add(V)})});const P=new Tt(new He(.07,.07,.04),m);P.position.set(0,.48,.06),c.add(P);const w=[];if(i==="twin")[-.11,.11].forEach(A=>{const U=new Tt(new Fe(.055,.065,.38+n*.04,a),g);U.rotation.x=Math.PI/2,U.position.set(A,.02,.58),c.add(U);const x=new Tt(new $e(.035,8,6),d);x.position.set(A,.02,.79+n*.02),c.add(x),w.push(x),c.userData.pulse||(c.userData.pulse=x)}),[-.08,.08].forEach(A=>{const U=new Tt(new He(.05,.025,.02),d);U.position.set(A,.14,.5),c.add(U)}),c.userData.rapid=n>=1;else if(i==="bomb"){const A=.14+n*.03,U=new Tt(new Fe(A,A+.02,.42,r==="card"?14:10),g);U.rotation.x=Math.PI/2,U.position.set(0,.02,.58),c.add(U);for(const E of[.48,.62]){const I=new Tt(new un(A+.04,.018,6,14),u);I.position.set(0,.02,E),c.add(I)}const x=new Tt(new $e(.08+n*.02,10,8),u);x.position.set(0,.02,.82),c.add(x),w.push(x),c.userData.pulse=x}else{const A=new Tt(new Fe(.055,.07,.4,a),g);A.rotation.x=Math.PI/2,A.position.set(0,.02,.58),c.add(A);const U=new Tt(new $e(.045+e*.01,8,6),d);U.position.set(0,.02,.81),c.add(U),w.push(U),c.userData.pulse=U}return c.userData.muzzles=w,c.userData.variant=i,c.userData.rank=e,c}function s0(i){i&&i.traverse(t=>{t.geometry&&t.geometry.dispose();const e=t.material;if(e)for(const n of Array.isArray(e)?e:[e])n.dispose()})}function Ir(i,t={}){return new Qi({color:i,roughness:.42,metalness:.45,...t})}function Hs(i,t=1.2){return new Qi({color:i,emissive:i,emissiveIntensity:t,roughness:.25,metalness:.15})}const ll=cl,aa=new Set(["bot","botGun","botBomb","magnet","luck","mag"]),Ug=20*Math.PI/180,Ig=new R(0,0,-1),Ng=new R;function hl(i){return new Nt(i)}function Ee(i,t={}){return new Qi({color:i,roughness:.42,metalness:.45,...t})}function ye(i,t=1.2){return new Qi({color:i,emissive:i,emissiveIntensity:t,roughness:.25,metalness:.15})}function he(i,t,e,n,r,s=0,o=0,a=0){const c=new Tt(new He(e,n,r),t);return c.position.set(s,o,a),c.castShadow=!0,i.add(c),c}function Fg(i){const t=new Tt(new Zr(4.5,4.5),new Sg({opacity:.28}));return t.rotation.x=-Math.PI/2,t.position.y=-.5,t.receiveShadow=!0,i.add(t),t}let ui=null;function Og(){if(ui)return ui;const i=64,t=document.createElement("canvas");t.width=t.height=i;const e=t.getContext("2d"),n=e.createRadialGradient(i/2,i/2,0,i/2,i/2,i/2);return n.addColorStop(0,"rgba(0,0,0,0.40)"),n.addColorStop(.35,"rgba(0,0,0,0.28)"),n.addColorStop(.7,"rgba(0,0,0,0.10)"),n.addColorStop(1,"rgba(0,0,0,0)"),e.fillStyle=n,e.fillRect(0,0,i,i),ui=new Vm(t),ui.colorSpace=Ne,ui.userData.shared=!0,ui}function Bg(i){i.traverse(t=>{t.isMesh&&(t.castShadow=!0,t.receiveShadow=!1)})}function Vs(i="base",t=0){const e=Dg(i,{rank:t+1,detail:"card"});return e.scale.setScalar(.95+(t+1)*.04),e}function dc(i=!1,t=0){const e=new te,n=i?7397304:10985983,r=t+1,s=new Tt(new Fe(.38+r*.04,.5+r*.05,.22,8),ye(n,i?1.3:.55+r*.2));e.add(s);const o=new Tt(new Fe(.22,.28,.1,8),Ee(1712688,{metalness:.7}));o.position.y=.14,e.add(o);for(let c=0;c<4;c++){const l=he(e,Ee(2765636),.08,.06,.55,0,.02,0);l.rotation.y=c/4*Math.PI*2,l.position.set(Math.sin(l.rotation.y)*.35,.02,Math.cos(l.rotation.y)*.35)}if(i){const c=new te;for(let l=0;l<3;l++){const h=new Tt(new un(.55+l*.12,.018,6,24,Math.PI*1.2),ye(10155519,2));h.rotation.set(.4+l*.3,l*1.1,l*.5),c.add(h)}e.add(c),e.userData.arcs=c}const a=he(e,Ee(14212840,{metalness:.8}),.06,.45,.06,0,.35,0);return e.userData.spike=a,e}function ks(){const i=new te,t=Ee(9086134,{emissive:2373704,emissiveIntensity:.22}),e=Ee(12768480,{metalness:.62,roughness:.34,emissive:2768976,emissiveIntensity:.12});he(i,t,.22,.28,.55,0,0,-.15),he(i,e,.16,.18,.7,0,.04,.35),he(i,e,.1,.1,.55,0,.05,.9),he(i,t,.18,.16,.32,0,-.05,.55);const n=he(i,t,.14,.32,.16,0,-.22,.05);return n.rotation.x=.35,i}function zg(){const i=new te,t=new Tt(new He(1,1,1),new Sn({color:14810367,transparent:!0,opacity:1,blending:_i,depthWrite:!1,toneMapped:!1}));t.scale.set(.05,.05,.9),t.position.z=-.35;const e=new Tt(new He(1,1,1),new Sn({color:6483455,transparent:!0,opacity:.45,blending:_i,depthWrite:!1,toneMapped:!1}));return e.scale.set(.15,.15,1.05),e.position.z=-.42,i.add(e,t),i.userData.aura=e,i}function Nr(i,t=1){const e=new tl;e.moveTo(0,.9),e.lineTo(.62,.55),e.lineTo(.55,-.35),e.quadraticCurveTo(0,-.85,-.55,-.35),e.lineTo(-.62,.55),e.closePath();const n=new _a(e,{depth:.12,bevelEnabled:!0,bevelThickness:.03,bevelSize:.03,bevelSegments:2});n.center();const r=new Tt(n,Ee(i,{metalness:.55,roughness:.25,emissive:hl(i),emissiveIntensity:.35,transparent:!0,opacity:.92}));return r.scale.setScalar(t),r}function Gg(i=8191818,t=1){const e=new Tt(new va(.28,0).scale(.72,1.25,.72),new al({color:i,emissive:i,emissiveIntensity:.55,metalness:.15,roughness:.12,transmission:.35,thickness:.4,transparent:!0,opacity:.95}));return e.scale.multiplyScalar(t),e}const pc={bot:(i=0)=>Vs("base",i),botGun:(i=0)=>Vs("twin",i),botBomb:(i=0)=>Vs("bomb",i),mine:(i=0)=>dc(!1,i),shock:()=>dc(!0,0),damage(i=0){const t=ks(),e=i+1,n=new Tt(new $e(.18+e*.035,16,12),ye(16756065,1.4+e*.2));n.position.set(0,.08,1.15),t.add(n);const r=new Tt(new un(.26+e*.03,.035,8,24),ye(16756065,1.2));return r.position.copy(n.position),r.rotation.y=Math.PI/2,t.add(r),t.userData.pulse=n,t.userData.ring=r,t},rate(i=0){const t=ks(),e=new te;e.position.set(0,.05,.95);for(let n=0;n<4;n++){const r=he(e,Ee(10137792,{metalness:.8}),.09,.09,.55,0,.16,.1);r.rotation.z=n/4*Math.PI*2,r.position.set(Math.sin(r.rotation.z)*.16,Math.cos(r.rotation.z)*.16,.1)}return t.add(e),t.userData.rotor=e,t.userData.rotorSpeed=5+i*3,t},pierce(i=0){const t=new te,e=[3359829,3820896,4544616,5268341],n=[];for(let s=0;s<=i;s++)n.push(he(t,Ee(e[s]||5268341),.08,.7,.55,-.45+s*.35,0,.05+s*.12));const r=new Tt(new Vi(.12,1.5+i*.15,6),ye(16756065,1.5));return r.rotation.z=-Math.PI/2,r.position.set(.05,0,.2),t.add(r),t.userData.spike=r,t.userData.plates=n,t},spread(i=0){const t=ks(),e=new ce;e.position.set(0,.05,1.18),t.add(e);const n=new Tt(new $e(.08,10,8),new Sn({color:14810367,transparent:!0,opacity:0,blending:_i,depthWrite:!1,toneMapped:!1}));e.add(n);const r=2+i,s=[];for(let o=0;o<r;o++){const a=(o-(r-1)/2)*.13,c=new R(-Math.sin(a),0,Math.cos(a)),l=zg();t.add(l),s.push({mesh:l,dir:c})}return t.userData.split={muzzle:e,flash:n,beams:s,cycle:0},t},mag(i=0){const t=new te;he(t,Ee(2768204,{metalness:.6}),.55,.95,.35);const e=Math.min(5,i+1);for(let n=0;n<5;n++){const r=n<e;he(t,r?ye(7781616,.9+n*.15):Ee(1713200),.42,.09,.08,0,-.32+n*.18,.2)}return he(t,Ee(9085104,{metalness:.8}),.58,.1,.38,0,.52,0),t},reload(){const i=new te,t=he(i,Ee(3228757),.9,.18,.45,0,-.35,0),e=he(i,ye(7781616,1),.32,.55,.22,-.28,.05,0),n=he(i,Ee(1845814),.32,.55,.22,.35,.35,0);return n.rotation.z=.5,i.userData.swap={cellA:e,cellB:n,cradle:t},i},regen(){const i=new te,t=Nr(7397304,.95);i.add(t);const e=new Tt(new un(.95,.04,8,40),ye(7397304,1.4));return e.rotation.x=Math.PI/2,i.add(e),i.userData.ring=e,i.userData.shield=t,i},pulse(i=0){const t=new te;t.add(Nr(7397304,.85));const e=i+1,n=Array.from({length:e},(r,s)=>{const o=new Tt(new un(.65+s*.28,.03,6,40),new Sn({color:10155519,transparent:!0,opacity:.55-s*.12}));return o.rotation.x=Math.PI/2,t.add(o),o});return t.userData.waves=n,t},hp(i=0){const t=new te,e=Math.min(4,i+2);for(let n=0;n<e;n++){const r=Nr(n===e-1?10155519:7397304,.8-n*.04);r.position.z=-.22+n*.18,r.position.x=n*.06,t.add(r)}return t},speed(i=0){const t=new te,e=new Tt(new Fe(.28,.34,.35,12),Ee(3821922,{metalness:.7}));e.rotation.z=Math.PI/2,t.add(e);const n=[-.28,.28].map(s=>{const o=new Tt(new Vi(.16,.55,10),ye(7397304,1.6));return o.rotation.z=Math.PI/2,o.position.set(-.45,s,0),t.add(o),o}),r=new Tt(new Vi(.18+i*.04,.65+i*.12,10),ye(10155519,2));return r.rotation.z=-Math.PI/2,r.position.set(.55,0,0),t.add(r),t.userData.jets=n,t.userData.flame=r,t},heal(){const i=new te,t=Nr(16740492,.9);i.add(t);const e=new te;return he(e,ye(16756932,1.8),.16,.55,.12),he(e,ye(16756932,1.8),.55,.16,.12),e.position.z=.2,i.add(e),i.userData.plus=e,i},luck(i=0){const t=new te,e=i+1,n=Ee(14212840,{metalness:.9,roughness:.18}),r=[{x:0,y:.08,z:0,rz:.12},{x:.58,y:.02,z:.1,rz:-.28},{x:-.58,y:.04,z:.08,rz:.32}];function s(){const c=new te,l=[[0,.02,0,.028],[.07,.12,.04,.018],[-.06,.1,-.03,.016],[.05,-.1,-.04,.02],[-.07,-.12,.03,.015],[.02,.18,-.02,.014],[-.03,-.18,.02,.014],[.08,0,-.05,.013],[-.08,.02,.05,.013],[.04,.06,-.06,.011],[-.05,-.05,.06,.011],[.01,-.14,-.05,.01],[-.02,.15,.05,.01],[.06,.2,.02,.012],[-.04,.22,-.04,.011],[.09,.08,.01,.012],[-.09,.14,.02,.01],[.03,-.02,.07,.013],[-.01,.05,-.08,.012],[.1,-.08,.03,.011],[-.1,-.06,-.02,.012],[.06,-.2,.04,.011],[-.05,-.22,-.03,.01],[0,.09,.06,.012],[0,-.08,-.06,.011],[.05,0,0,.01],[-.04,0,0,.01],[.02,.25,0,.009],[-.02,-.25,0,.009],[.07,-.15,-.05,.01],[-.08,.18,.04,.01]],h=[7781616,16754252,16742581],u=l.map(([d,m,g,v],p)=>{const f=new Sn({color:h[p%3],transparent:!0,opacity:.95,blending:_i,depthWrite:!1,depthTest:!1,toneMapped:!1}),S=new Tt(new $e(v,10,8),f);return S.position.set(d,m,g),S.userData.phase=p*.7,S.userData.base=v,c.add(S),S});return c.userData.dots=u,c}function o(){const c=new te,l=new al({color:13154559,emissive:12430842,emissiveIntensity:.3,metalness:.05,roughness:.08,transmission:.55,thickness:.35,transparent:!0,opacity:.5,clearcoat:1,clearcoatRoughness:.05,ior:1.45,side:je}),h=new Tt(new Fe(.22,.22,.58,28),l),u=new Fe(.235,.235,.1,28),d=new Tt(u,n);d.position.y=.34;const m=new Tt(u,n);m.position.y=-.34;const g=s();return c.add(h,d,m,g),c.userData.charge=g,c}const a=[];for(let c=0;c<e;c++){const l=o(),h=r[c];l.position.set(h.x,h.y,h.z),l.rotation.z=h.rz,l.userData.phase=c*1.3,l.userData.baseY=h.y,t.add(l),a.push(l)}return t.userData.cells=a,t},magnet(){const i=new te,t=[[0,.35,0,1],[-.7,.05,.2,.62],[.7,.05,.2,.62]],e=t.map(([s,o,a,c])=>{const l=Gg(8191818,c);return l.position.set(s,o,a),l.userData.gemScale=c,i.add(l),l}),n=Og(),r=t.map(([s,,o,a])=>{const c=new Tt(new ga(.42*a,24),new Sn({map:n,transparent:!0,opacity:.9,depthWrite:!1,toneMapped:!1}));return c.rotation.x=-Math.PI/2,c.position.set(s,-.58,o),c.renderOrder=-1,i.add(c),c});return i.userData.gems=e,i.userData.gemShadows=r,i},coil(i=0){const t=new te,e=i+1,n=Ee(4875640,{metalness:.72,roughness:.32}),r=new Tt(new Fe(.55,.62,.18,8),n);r.position.y=-.35,t.add(r);const s=new Tt(new Fe(.28,.34,.12,16),ye(6483455,.55+e*.25));s.position.y=-.22,t.add(s);const o=he(t,n,.14,.95+e*.06,.14,0,.28,0),a=new Tt(new $e(.22+e*.015,14,12),ye(e>=1?10155519:3822952,e>=1?1.4+e*.2:.2));if(a.position.y=.85+e*.04,t.add(a),e>=1){const c=new te;for(let l=0;l<Math.min(3,e);l++){const h=new Tt(new un(.38+l*.1,.016,6,20,Math.PI*1.15),ye(10155519,1.8));h.rotation.set(.5+l*.35,l*1.2,l*.4),c.add(h)}c.position.y=.55,t.add(c),t.userData.arcs=c}return e>=3&&he(t,ye(16754248,.9),.08,.08,.08,.32,-.28,.28),t.userData.coilBall=a,t.userData.mast=o,t}};function Hg(i){i.traverse(t=>{var n;t.geometry&&t.geometry.dispose();const e=t.material;if(e)for(const r of Array.isArray(e)?e:[e])r.map&&!((n=r.map.userData)!=null&&n.shared)&&r.map.dispose(),r.dispose()})}function Vg(i){var l;const t=new Fm,e=new te;t.add(e),Fg(e);const n=new Tg(16777215,1.7);n.position.set(.15,5.5,.35),n.target.position.set(0,0,0),t.add(n.target),n.castShadow=!0,n.shadow.mapSize.set(256,256),n.shadow.radius=6,n.shadow.camera.near=.5,n.shadow.camera.far=14,n.shadow.camera.left=-2.2,n.shadow.camera.right=2.2,n.shadow.camera.top=2.2,n.shadow.camera.bottom=-2.2,n.shadow.bias=-.003,n.shadow.normalBias=.02,t.add(n),t.add(new bg(9086136,.75));const r=new cc(hl(ll[i.cat]||"#9af5ff"),2,9);r.position.set(-1.4,1.2,-1.2),t.add(r);const s=new cc(10155519,.65,7);s.position.set(1.2,.4,1.8),t.add(s);const o=i.owned||0,a=(pc[i.id]||pc.bot)(o);a.position.y=.08,a.scale.multiplyScalar(.64),i.id==="mag"?a.rotation.y=-.28:(i.cat==="firepower"||i.cat==="handling")&&(a.rotation.y=-.55),Bg(a),a.userData.gemShadows&&((l=a.userData.gems)==null||l.forEach(h=>{h.castShadow=!1}),a.userData.gemShadows.forEach(h=>{h.castShadow=!1,h.receiveShadow=!1})),e.add(a),e.userData.subject=a;const c=new Ie(32,1,.1,40);return c.position.set(0,1.05,4.35),c.lookAt(0,.05,0),{scene:t,camera:c,root:e}}function kg(i,t,e,n,r){const{root:s,id:o}=i,a=s.userData.subject;if(!a)return;const c=r.matches?0:1,l=i.dragging?0:(.35+(n?.55:0))*c;i.dragging||(aa.has(o)&&c?i.yaw=i.baseYaw+Math.sin(t*1.15+i.phase)*Ug:aa.has(o)||(i.yaw+=l*e)),s.rotation.y=i.yaw,a.position.y=c?Math.sin(t*1.6+i.phase)*.06:0;const h=a.userData;if(h.pulse&&h.pulse.scale.setScalar(1+.12*Math.sin(t*6)),h.rotor&&(h.rotor.rotation.z+=e*(n?(h.rotorSpeed||5)*1.8:h.rotorSpeed||5)*c),h.ring&&(h.ring.rotation.z+=e*1.5*c),h.arcs&&(h.arcs.rotation.y+=e*2.2*c),h.coilBall){const u=.92+.08*Math.sin(t*5);h.coilBall.scale.setScalar(u)}if(h.waves&&h.waves.forEach((u,d)=>{const m=(t*.9+d*.25)%1;u.scale.setScalar(.7+m*.9),u.material.opacity=(1-m)*.5}),h.split){h.split.cycle=(h.split.cycle+e)%.55;const m=h.split.cycle/.55;h.split.flash.material.opacity=m<.12?(1-m/.12)*.9:0,h.split.flash.scale.setScalar(.8+m*1.2);const g=h.split.muzzle.position;h.split.beams.forEach(v=>{const p=m*3.4,f=m<.78?1:1-(m-.78)/.22;v.mesh.position.copy(v.dir).multiplyScalar(p).add(g),v.mesh.quaternion.setFromUnitVectors(Ig,Ng.copy(v.dir)),v.mesh.visible=f>.02,v.mesh.userData.aura&&(v.mesh.userData.aura.material.opacity=.45*f)})}if(h.spike&&o==="pierce"&&(h.spike.position.x=-.35+t*.7%1*1.1*c),h.flame&&h.flame.scale.set(1,1,.85+.25*Math.sin(t*12)),h.jets&&h.jets.forEach((u,d)=>u.scale.setScalar(.9+.15*Math.sin(t*9+d))),h.cells&&h.cells.forEach(u=>{var m,g;u.position.y=u.userData.baseY+Math.sin(t*1.6+u.userData.phase)*.05*c;const d=(g=(m=u.userData.charge)==null?void 0:m.userData)==null?void 0:g.dots;d&&d.forEach(v=>{const p=.55+.45*Math.sin(t*4.5+v.userData.phase);v.scale.setScalar(.65+p*.7),v.material.opacity=.4+p*.6})}),h.gems&&h.gems.forEach((u,d)=>{var f;u.rotation.y+=e*(1.2+d*.3),u.rotation.x=.25+Math.sin(t*1.8+d)*.15;const m=.55+.35*Math.sin(t*2+d);if(d>0){const S=d===1?-1:1;u.position.x=S*(.35+m*.45),u.position.y=.05+(1-m)*.25}else u.position.y=.25+Math.sin(t*2.4)*.08;const g=(f=h.gemShadows)==null?void 0:f[d];if(!g)return;g.position.x=u.position.x,g.position.z=u.position.z,g.position.y=-.5-a.position.y-.01;const p=1/(1+Math.max(0,u.position.y)*.55);g.scale.setScalar(.94+p*.14),g.material.opacity=.72+p*.2}),h.swap){const u=(Math.sin(t*1.5)+1)*.5;h.swap.cellA.position.y=.05+u*.25,h.swap.cellB.position.y=.35-u*.25,h.swap.cellB.rotation.z=.5-u*.5}}function a0({reducedMotion:i=matchMedia("(prefers-reduced-motion: reduce)"),allowDrag:t=!1,parent:e=document.body}={}){const n=new qc({antialias:!0,alpha:!0,powerPreference:"low-power"});n.setPixelRatio(Math.min(devicePixelRatio,1.75)),n.outputColorSpace=ge,n.setClearColor(0,0),n.shadowMap.enabled=!0,n.shadowMap.type=Je,n.domElement.style.cssText="position:fixed;left:-9999px;top:0;pointer-events:none;opacity:0",e.appendChild(n.domElement);let r=[],s=0,o=performance.now(),a=null;function c(){var g;for(const v of r)(g=v.cleanup)==null||g.call(v),Hg(v.scene);r=[],a&&(a.disconnect(),a=null)}function l(){s&&cancelAnimationFrame(s),s=0}function h(g){s=requestAnimationFrame(h);const v=Math.min(.05,(g-o)/1e3);o=g;const p=g/1e3;for(const f of r){if(!f.visible)continue;const{canvas:S,ctx:_,scene:b,camera:P,card:w}=f,A=S.clientWidth||256,U=S.clientHeight||160,x=n.getPixelRatio();(S.width!==Math.floor(A*x)||S.height!==Math.floor(U*x))&&(S.width=Math.max(1,Math.floor(A*x)),S.height=Math.max(1,Math.floor(U*x))),P.aspect=A/Math.max(1,U);const E=Math.round(U*.28);P.setViewOffset(A,U+E,0,E,A,U),P.updateProjectionMatrix();const I=f.hot||f.dragging||!!(w&&w.matches(":hover, :focus-visible, .pad-sel, .picked"));kg(f,p,v,I,i),n.setSize(A,U,!1),n.render(b,P),_.clearRect(0,0,S.width,S.height),_.drawImage(n.domElement,0,0,S.width,S.height)}}function u(){l(),c()}function d(g){if(u(),!g)return;const v=[...g.querySelectorAll("canvas.icon-stage")];a=new IntersectionObserver(p=>{for(const f of p){const S=r.find(_=>_.canvas===f.target);S&&(S.visible=f.isIntersecting)}},{rootMargin:"80px"}),r=v.map((p,f)=>{const S=p.dataset.id,_=Number(p.dataset.owned||0),b=p.dataset.cat||"engineer",{scene:P,camera:w,root:A}=Vg({id:S,cat:b,owned:_}),U=p.getContext("2d"),x=p.closest(".card"),E=-.35+f%5*.08,I={canvas:p,ctx:U,scene:P,camera:w,root:A,id:S,card:x,yaw:E,baseYaw:E,phase:f*.7,visible:!0,dragging:!1,lastX:0,hot:!1,cleanup:null},V=()=>{I.hot=!0},nt=()=>{I.hot=!1,I.dragging=!1};x==null||x.addEventListener("pointerenter",V),x==null||x.addEventListener("pointerleave",nt);const D=[];if(t){const O=X=>{I.dragging=!0,I.lastX=X.clientX,p.setPointerCapture(X.pointerId)},H=X=>{I.dragging&&(I.yaw+=(X.clientX-I.lastX)*.01,I.lastX=X.clientX)},$=()=>{I.dragging=!1,aa.has(S)&&(I.baseYaw=I.yaw)};p.addEventListener("pointerdown",O),p.addEventListener("pointermove",H),p.addEventListener("pointerup",$),p.addEventListener("pointercancel",$),D.push(["pointerdown",O],["pointermove",H],["pointerup",$],["pointercancel",$])}return I.cleanup=()=>{x==null||x.removeEventListener("pointerenter",V),x==null||x.removeEventListener("pointerleave",nt);for(const[O,H]of D)p.removeEventListener(O,H)},a.observe(p),I}),o=performance.now(),s=requestAnimationFrame(h)}function m(){u(),n.dispose(),n.domElement.remove()}return{mount:d,clear:u,dispose:m,CAT_COLORS:ll}}const Wg='<svg class="card-frame" viewBox="0 0 320 360" preserveAspectRatio="none" aria-hidden="true"><path class="frame-edge" d="M16 1H304L319 16V344L304 359H16L1 344V16Z"/><path class="frame-inner" d="M18 6H302L314 18V342L302 354H18L6 342V18Z"/><path class="frame-rail" d="M16 1H304L313 10H150L145 14H4Z"/></svg>';function Xg(i,t,{label:e=!1}={}){const n=e?` aria-label="${i.name} rank ${t+1} 3D icon"`:' aria-hidden="true"';return`<canvas class="icon-stage" width="512" height="320" data-id="${i.id}" data-cat="${i.cat}" data-owned="${t}"${n}></canvas>`}function qg(i,t){return i.max===1/0?"":Array.from({length:i.max},(e,n)=>`<i class="${n<t?"own":n===t?"next":""}"></i>`).join("")}function o0({u:i,state:t,owned:e=(h=>(h=t==null?void 0:t.upgrades)==null?void 0:h[i.id])()||0,recommended:n=!1,slot:r=null,tag:s="button",attrs:o="",extra:a="",animationDelayMs:c=null,iconLabel:l=!1}={}){const u=i.id==="bot"&&e>0,d=u?"UPGRADE BOT":i.name,m=u?"Stronger companion shots":i.desc,g=i.stat(t);let v;g.length<2||g[1]==null?v=`<b>${g[0]}</b>`:String(g[0]).toLowerCase()==="off"?v=`<b>${g[1]}</b>`:v=`${g[0]} → <b>${g[1]}</b>`;const p=qg(i,e),f=n?"RECOMMENDED":i.cat.toUpperCase(),S=r==null?"":`<span class="ckey">${r}</span>`,_=c==null?"":`;animation-delay:${c}ms`;return`<${s} class="${`card upgrade-card${n?" recommended":""}`}" style="--accent:${cl[i.cat]}${_}"${o}>`+Wg+`<div class="ctop"><span>${f}</span>${S}</div>`+Xg(i,e,{label:l})+`<div class="cname">${d}</div><div class="cdesc">${m}</div><div class="cstat">${v}</div><div class="clvl" aria-hidden="true">${p}</div>`+a+`</${s}>`}export{ji as $,_i as A,He as B,Nt as C,je as D,vl as E,Yc as F,te as G,Xi as H,rl as I,$c as J,kt as K,Gm as L,Tt as M,Vi as N,ce as O,Ie as P,va as Q,sl as R,Gn as S,un as T,Yh as U,R as V,zn as W,ga as X,rt as Y,Qg as Z,qc as _,Jt as a,$r as a0,Zt as a1,Fi as a2,Lg as a3,fc as a4,cl as a5,Pg as a6,hc as a7,Dg as a8,n0 as a9,e0 as aa,Gs as ab,o0 as ac,uc as ad,a0 as ae,s0 as af,t0 as ag,i0 as ah,r0 as ai,Dn as b,ne as c,Fm as d,Zr as e,Sn as f,al as g,Fe as h,ve as i,Ve as j,Kg as k,Hm as l,$g as m,Bm as n,Zg as o,jg as p,Tg as q,cc as r,$e as s,Ce as t,Qi as u,Vm as v,ge as w,Yg as x,Jg as y,Yl as z};
