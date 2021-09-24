import{a3 as a,a4 as e,S as s,i as t,s as n,l as r,f as o,r as l,u as c,w as $,x as i,d as m,V as u,e as p,c as d,a as g,X as f,Y as h,Z as y,a5 as v,j as w,k as x,m as E,n as A,b,o as j,O as k,v as D,a6 as C,a7 as M,a8 as P,t as L,g as N,T as O}from"./vendor-23fb87d9.js";import{i as T,c as U,h as _,u as z,j as B}from"./CustomContainer-6347260b.js";import{d as I}from"./Loading-d281598b.js";const R=U.API_URL_PROD,S=async e=>{T.set({film:null,loading:!0,message:""});try{const s={headers:{"Content-type":"Application/json"}},{data:t}=await a.get(`${R}/api/film/${e}`,s);return T.set({film:t.value,loading:!1,message:""}),{film:t.value,loading:!1,message:""}}catch(s){return T.set({film:null,loading:!1,message:"Error loading the film"+s}),{film:null,loading:!1,message:"Error loading the film"+s}}},V=async(s,t)=>{_.set({success:!1,loading:!0,message:""});const n=e(z);try{const e={headers:{"Content-type":"Application/json",Authorization:`Bearer ${n.token}`}},{data:r}=await a.put(`${R}/api/film/${s}`,t,e);_.set({success:!0,loading:!1,message:"film updated"})}catch(r){_.set({success:!1,loading:!1,message:"Error updating film "+r})}},W=async s=>{const t={title:{},location:s,real:{},url:{},summury:{},infosGenerales:{},actions:[]};B.set({success:!1,loading:!0,message:""});const n=e(z);try{const e={headers:{"Content-type":"Application/json",Authorization:`Bearer ${n.token}`}},{data:s}=await a.post(`${R}/api/film`,t,e);return B.set({success:!0,loading:!1,message:"film updated"}),s.value._id}catch(r){B.set({success:!1,loading:!1,message:"Error updating film "+r})}},q=async a=>{a.url&&a.url.values.length&&q(a.url.values),a.values&&a.values.length&&q(a.values);for(let e=0;e<a.length;e++)a[e].url&&a[e].url.length&&await I(a[e].url),a[e].component&&a[e].component.values&&a[e].component.values.length&&q(a[e].component.values),a[e].values&&a[e].values.length&&q(a[e].values)};function G(a){let e,s;const t=a[7].default,n=u(t,a,a[11],null);return{c(){e=p("span"),n&&n.c()},l(a){e=d(a,"SPAN",{});var s=g(e);n&&n.l(s),s.forEach(m)},m(a,t){o(a,e,t),n&&n.m(e,null),s=!0},p(a,e){n&&n.p&&(!s||2048&e)&&f(n,t,a,a[11],s?y(t,a[11],e,null):h(a[11]),null)},i(a){s||(i(n,a),s=!0)},o(a){c(n,a),s=!1},d(a){a&&m(e),n&&n.d(a)}}}function X(a){let e,s,t,n;s=new v({props:{class:"align-items-center",$$slots:{default:[J]},$$scope:{ctx:a}}});const r=a[7].default,l=u(r,a,a[11],null);return{c(){e=p("div"),w(s.$$.fragment),t=x(),l&&l.c(),this.h()},l(a){e=d(a,"DIV",{class:!0});var n=g(e);E(s.$$.fragment,n),t=A(n),l&&l.l(n),n.forEach(m),this.h()},h(){b(e,"class","moving-container border-light rounded-3 mt-3 mb-1 p-3 bg-lavande shadow-lg svelte-187qscu")},m(a,r){o(a,e,r),j(s,e,null),k(e,t),l&&l.m(e,null),n=!0},p(a,e){const t={};2048&e&&(t.$$scope={dirty:e,ctx:a}),s.$set(t),l&&l.p&&(!n||2048&e)&&f(l,r,a,a[11],n?y(r,a[11],e,null):h(a[11]),null)},i(a){n||(i(s.$$.fragment,a),i(l,a),n=!0)},o(a){c(s.$$.fragment,a),c(l,a),n=!1},d(a){a&&m(e),D(s),l&&l.d(a)}}}function Y(a){let e,s,t;return e=new P({props:{name:"caret-up"}}),{c(){w(e.$$.fragment),s=L("  UP")},l(a){E(e.$$.fragment,a),s=N(a,"  UP")},m(a,n){j(e,a,n),o(a,s,n),t=!0},p:O,i(a){t||(i(e.$$.fragment,a),t=!0)},o(a){c(e.$$.fragment,a),t=!1},d(a){D(e,a),a&&m(s)}}}function Z(a){let e,s,t;return e=new P({props:{name:"caret-down"}}),{c(){w(e.$$.fragment),s=L("  DOWN")},l(a){E(e.$$.fragment,a),s=N(a,"  DOWN")},m(a,n){j(e,a,n),o(a,s,n),t=!0},p:O,i(a){t||(i(e.$$.fragment,a),t=!0)},o(a){c(e.$$.fragment,a),t=!1},d(a){D(e,a),a&&m(s)}}}function F(a){let e,s,t;return e=new P({props:{name:"trash"}}),{c(){w(e.$$.fragment),s=L("  DELETE")},l(a){E(e.$$.fragment,a),s=N(a,"  DELETE")},m(a,n){j(e,a,n),o(a,s,n),t=!0},p:O,i(a){t||(i(e.$$.fragment,a),t=!0)},o(a){c(e.$$.fragment,a),t=!1},d(a){D(e,a),a&&m(s)}}}function H(a){let e,s,t,n,r,l;return e=new M({props:{class:"mx-3",color:"secondary",$$slots:{default:[Y]},$$scope:{ctx:a}}}),e.$on("click",a[8]),t=new M({props:{class:"mx-3",color:"secondary",$$slots:{default:[Z]},$$scope:{ctx:a}}}),t.$on("click",a[9]),r=new M({props:{class:"mx-3",color:"danger",$$slots:{default:[F]},$$scope:{ctx:a}}}),r.$on("click",a[10]),{c(){w(e.$$.fragment),s=x(),w(t.$$.fragment),n=x(),w(r.$$.fragment)},l(a){E(e.$$.fragment,a),s=A(a),E(t.$$.fragment,a),n=A(a),E(r.$$.fragment,a)},m(a,c){j(e,a,c),o(a,s,c),j(t,a,c),o(a,n,c),j(r,a,c),l=!0},p(a,s){const n={};2048&s&&(n.$$scope={dirty:s,ctx:a}),e.$set(n);const o={};2048&s&&(o.$$scope={dirty:s,ctx:a}),t.$set(o);const l={};2048&s&&(l.$$scope={dirty:s,ctx:a}),r.$set(l)},i(a){l||(i(e.$$.fragment,a),i(t.$$.fragment,a),i(r.$$.fragment,a),l=!0)},o(a){c(e.$$.fragment,a),c(t.$$.fragment,a),c(r.$$.fragment,a),l=!1},d(a){D(e,a),a&&m(s),D(t,a),a&&m(n),D(r,a)}}}function J(a){let e,s;return e=new C({props:{class:"text-center mb-2",$$slots:{default:[H]},$$scope:{ctx:a}}}),{c(){w(e.$$.fragment)},l(a){E(e.$$.fragment,a)},m(a,t){j(e,a,t),s=!0},p(a,s){const t={};2048&s&&(t.$$scope={dirty:s,ctx:a}),e.$set(t)},i(a){s||(i(e.$$.fragment,a),s=!0)},o(a){c(e.$$.fragment,a),s=!1},d(a){D(e,a)}}}function K(a){let e,s,t,n;const u=[X,G],p=[];function d(a,e){return a[0]?0:1}return e=d(a),s=p[e]=u[e](a),{c(){s.c(),t=r()},l(a){s.l(a),t=r()},m(a,s){p[e].m(a,s),o(a,t,s),n=!0},p(a,[n]){let r=e;e=d(a),e===r?p[e].p(a,n):(l(),c(p[r],1,1,(()=>{p[r]=null})),$(),s=p[e],s?s.p(a,n):(s=p[e]=u[e](a),s.c()),i(s,1),s.m(t.parentNode,t))},i(a){n||(i(s),n=!0)},o(a){c(s),n=!1},d(a){p[e].d(a),a&&m(t)}}}function Q(a,e,s){let{$$slots:t={},$$scope:n}=e,{array:r=[]}=e,{position:o=0}=e,{admin:l=!1}=e,{updateMovedArray:c}=e;const $=(a,e,s)=>{var t=a[e];return a.splice(e,1),a.splice(s,0,t),a},i=()=>{o>0&&s(4,r=$(r,o,o-1)),c(r)},m=()=>{o<r.length-1&&s(4,r=$(r,o,o+1)),c(r)},u=async()=>{const a=r[o];await q(a),r.splice(o,1),c(r)};return a.$$set=a=>{"array"in a&&s(4,r=a.array),"position"in a&&s(5,o=a.position),"admin"in a&&s(0,l=a.admin),"updateMovedArray"in a&&s(6,c=a.updateMovedArray),"$$scope"in a&&s(11,n=a.$$scope)},[l,i,m,u,r,o,c,t,()=>i(),()=>m(),async()=>await u(),n]}class aa extends s{constructor(a){super(),t(this,a,Q,K,n,{array:4,position:5,admin:0,updateMovedArray:6})}}export{aa as M,W as c,S as g,q as r,V as u};
