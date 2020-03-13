(function(e){function t(t){for(var o,a,u=t[0],c=t[1],s=t[2],d=0,l=[];d<u.length;d++)a=u[d],Object.prototype.hasOwnProperty.call(r,a)&&r[a]&&l.push(r[a][0]),r[a]=0;for(o in c)Object.prototype.hasOwnProperty.call(c,o)&&(e[o]=c[o]);p&&p(t);while(l.length)l.shift()();return i.push.apply(i,s||[]),n()}function n(){for(var e,t=0;t<i.length;t++){for(var n=i[t],o=!0,u=1;u<n.length;u++){var c=n[u];0!==r[c]&&(o=!1)}o&&(i.splice(t--,1),e=a(a.s=n[0]))}return e}var o={},r={app:0},i=[];function a(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=o,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)a.d(n,o,function(t){return e[t]}.bind(null,o));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="/smooth-sounds/";var u=window["webpackJsonp"]=window["webpackJsonp"]||[],c=u.push.bind(u);u.push=t,u=u.slice();for(var s=0;s<u.length;s++)t(u[s]);var p=c;i.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"065e":function(e,t,n){e.exports=n.p+"media/fire.bfe0c851.mp3"},1053:function(e,t,n){e.exports=n.p+"media/night.3cd67b50.mp3"},"19d1":function(e,t,n){e.exports=n.p+"media/steps.16059232.mp3"},"281a":function(e,t,n){e.exports=n.p+"img/rain.99187a74.gif"},"293e":function(e,t,n){e.exports=n.p+"img/chimney.b0664fda.gif"},"3bab":function(e,t,n){e.exports=n.p+"media/thunder.0fc33b51.mp3"},"41ed":function(e,t,n){e.exports=n.p+"media/rain.5cf8732f.mp3"},5472:function(e,t,n){e.exports=n.p+"media/chimney.940e50a8.mp3"},"56d7":function(e,t,n){"use strict";n.r(t);n("e260"),n("e6cf"),n("cca6"),n("a79d");var o=n("2b0e"),r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("Sounds"),n("Timer")],1)},i=[],a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"Sounds"}},e._l(e.sounds,(function(e){return n("Sound",{key:e.id,attrs:{cover:e.cover,file:e.path,autoPlay:e.autoPlay,loop:e.loop}})})),1)},u=[],c=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"Sound",class:{playing:e.playing},on:{click:function(t){t.preventDefault(),e.playing=!e.playing}}},[n("div",{staticClass:"cover"},[n("img",{staticClass:"cover-image",attrs:{src:e.cover,alt:""}}),n("svg",{staticClass:"progress-ring",attrs:{viewBox:"0 0 150 150"}},[n("circle",{staticClass:"progress-ring__circle",attrs:{stroke:"#FF00FF","stroke-width":"6",fill:"transparent",cx:"75",cy:"75",r:"72","stroke-linecap":"round","stroke-dasharray":e.circumference+" "+e.circumference,"stroke-dashoffset":e.strokeDashoffset}})])]),n("div",{staticClass:"controls"},[n("input",{directives:[{name:"model",rawName:"v-model.lazy.number",value:e.volume,expression:"volume",modifiers:{lazy:!0,number:!0}}],staticClass:"sound-slider",attrs:{type:"range",min:"0",max:"100"},domProps:{value:e.volume},on:{click:function(e){e.stopPropagation()},change:function(t){e.volume=e._n(t.target.value)},blur:function(t){return e.$forceUpdate()}}})]),n("audio",{ref:"audiofile",staticStyle:{display:"none"},attrs:{loop:e.innerLoop,src:e.file,preload:"auto"}})])},s=[],p=(n("c975"),function(e){var t=new Date(1e3*e).toISOString().substr(11,8);return 0===t.indexOf("00:")?t.substr(3):t}),d={name:"Sound",props:{file:{type:String,default:null},autoPlay:{type:Boolean,default:!1},loop:{type:Boolean,default:!1},cover:{type:String,default:null}},data:function(){return{audio:void 0,currentSeconds:0,durationSeconds:0,innerLoop:!1,loaded:!1,playing:!1,previousVolume:35,volume:100,radius:0,circumference:0}},computed:{currentTime:function(){return p(this.currentSeconds)},durationTime:function(){return p(this.durationSeconds)},percentComplete:function(){return parseInt(this.currentSeconds/this.durationSeconds*100)},strokeDashoffset:function(){return this.circumference-this.percentComplete/100*this.circumference}},watch:{playing:function(e){if(e)return this.audio.play();this.audio.pause()},volume:function(){this.audio.volume=this.volume/100}},methods:{load:function(){if(this.audio.readyState>=2)return this.loaded=!0,this.durationSeconds=parseInt(this.audio.duration),this.playing=this.autoPlay;throw new Error("Failed to load sound file.")},seek:function(e){if(this.playing&&"SPAN"!==e.target.tagName){var t=e.target.getBoundingClientRect(),n=(e.clientX-t.left)/t.width;this.audio.currentTime=parseInt(this.audio.duration*n)}},update:function(){this.currentSeconds=parseInt(this.audio.currentTime)}},created:function(){this.innerLoop=this.loop},mounted:function(){var e=this;this.audio=this.$el.querySelectorAll("audio")[0],this.audio.addEventListener("timeupdate",this.update),this.audio.addEventListener("loadeddata",this.load),this.audio.addEventListener("pause",(function(){e.playing=!1,e.audio.currentTime=0})),this.audio.addEventListener("play",(function(){e.playing=!0}));var t=document.querySelector("circle"),n=t.r.baseVal.value;this.circumference=2*n*Math.PI}},l=d,f=(n("a2c6"),n("2877")),m=Object(f["a"])(l,c,s,!1,null,"a7517dfc",null),h=m.exports,v={name:"Sounds",components:{Sound:h},data:function(){return{sounds:[{id:1,path:n("bebc"),cover:n("a116"),autoPlay:!1,loop:!0},{id:2,path:n("065e"),cover:n("dfa6"),autoPlay:!1,loop:!0},{id:3,path:n("41ed"),cover:n("281a"),autoPlay:!1,loop:!0},{id:4,path:n("3bab"),cover:n("abe4"),autoPlay:!1,loop:!0},{id:5,path:n("1053"),cover:n("7371"),autoPlay:!1,loop:!0},{id:6,path:n("aca6"),cover:n("aa54"),autoPlay:!1,loop:!0},{id:7,path:n("f333"),cover:n("cea0"),autoPlay:!1,loop:!0},{id:8,path:n("a0de"),cover:n("641e"),autoPlay:!1,loop:!0},{id:9,path:n("5472"),cover:n("293e"),autoPlay:!1,loop:!0},{id:10,path:n("c7fc"),cover:n("601c"),autoPlay:!1,loop:!0},{id:11,path:n("57a3"),cover:n("9fcc"),autoPlay:!1,loop:!0},{id:12,path:n("19d1"),cover:n("e36b"),autoPlay:!1,loop:!0}]}}},g=v,y=(n("60d2"),Object(f["a"])(g,a,u,!1,null,"5495cebe",null)),b=y.exports,x=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"Timer"}},[e._v(" Timer ")])},S=[],P={name:"Timer"},w=P,_=Object(f["a"])(w,x,S,!1,null,"6909f69d",null),O=_.exports,k={name:"App",components:{Sounds:b,Timer:O}},j=k,T=(n("5c0b"),Object(f["a"])(j,r,i,!1,null,null,null)),C=T.exports;o["a"].config.productionTip=!1,new o["a"]({render:function(e){return e(C)}}).$mount("#app")},"57a3":function(e,t,n){e.exports=n.p+"media/wiper.603d4767.mp3"},"5c0b":function(e,t,n){"use strict";var o=n("9c0c"),r=n.n(o);r.a},"601c":function(e,t,n){e.exports=n.p+"img/underwater.4aebc41f.gif"},"60d2":function(e,t,n){"use strict";var o=n("70cf"),r=n.n(o);r.a},"641e":function(e,t,n){e.exports=n.p+"img/pedestrian_street.6256bebd.gif"},"70cf":function(e,t,n){},7371:function(e,t,n){e.exports=n.p+"img/night.b7157d1a.gif"},"9c0c":function(e,t,n){},"9fcc":function(e,t,n){e.exports=n.p+"img/wiper.6805688f.gif"},a0de:function(e,t,n){e.exports=n.p+"media/pedestrian_street.62f91a62.mp3"},a116:function(e,t,n){e.exports=n.p+"img/forest.3e522cd8.gif"},a2c6:function(e,t,n){"use strict";var o=n("c1fa"),r=n.n(o);r.a},aa54:function(e,t,n){e.exports=n.p+"img/river.8828ba7e.gif"},abe4:function(e,t,n){e.exports=n.p+"img/thunder.94378acb.gif"},aca6:function(e,t,n){e.exports=n.p+"media/river.ad524d47.mp3"},bebc:function(e,t,n){e.exports=n.p+"media/forest.efd5fde3.mp3"},c1fa:function(e,t,n){},c7fc:function(e,t,n){e.exports=n.p+"media/underwater.c892eb7f.mp3"},cea0:function(e,t,n){e.exports=n.p+"img/wave.b7f5d329.gif"},dfa6:function(e,t,n){e.exports=n.p+"img/fire.4ca68a02.gif"},e36b:function(e,t,n){e.exports=n.p+"img/no_image.4eae4afe.png"},f333:function(e,t,n){e.exports=n.p+"media/wave.d0f64b2e.mp3"}});
//# sourceMappingURL=app.b1fb74ce.js.map