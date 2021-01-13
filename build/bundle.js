var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function r(e){e.forEach(t)}function a(e){return"function"==typeof e}function o(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}function i(e,t){e.appendChild(t)}function s(e,t,n){e.insertBefore(t,n||null)}function c(e){e.parentNode.removeChild(e)}function l(e){return document.createElement(e)}function u(e){return document.createTextNode(e)}function d(){return u(" ")}function f(e,t,n,r){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n,r)}function g(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function m(e,t){t=""+t,e.data!==t&&(e.data=t)}let p;function h(e){p=e}const $=[],b=[],v=[],x=[],y=Promise.resolve();let w=!1;function S(e){v.push(e)}let k=!1;const L=new Set;function _(){if(!k){k=!0;do{for(let e=0;e<$.length;e+=1){const t=$[e];h(t),T(t.$$)}for($.length=0;b.length;)b.pop()();for(let e=0;e<v.length;e+=1){const t=v[e];L.has(t)||(L.add(t),t())}v.length=0}while($.length);for(;x.length;)x.pop()();w=!1,k=!1,L.clear()}}function T(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(S)}}const z=new Set;let j;function E(e,t){e&&e.i&&(z.delete(e),e.i(t))}function J(e,t,n,r){if(e&&e.o){if(z.has(e))return;z.add(e),j.c.push(()=>{z.delete(e),r&&(n&&e.d(1),r())}),e.o(t)}}function P(e){e&&e.c()}function B(e,n,o){const{fragment:i,on_mount:s,on_destroy:c,after_update:l}=e.$$;i&&i.m(n,o),S(()=>{const n=s.map(t).filter(a);c?c.push(...n):r(n),e.$$.on_mount=[]}),l.forEach(S)}function I(e,t){const n=e.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function M(e,t){-1===e.$$.dirty[0]&&($.push(e),w||(w=!0,y.then(_)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Q(t,a,o,i,s,l,u=[-1]){const d=p;h(t);const f=a.props||{},g=t.$$={fragment:null,ctx:null,props:l,update:e,not_equal:s,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:[]),callbacks:n(),dirty:u};let m=!1;if(g.ctx=o?o(t,f,(e,n,...r)=>{const a=r.length?r[0]:n;return g.ctx&&s(g.ctx[e],g.ctx[e]=a)&&(g.bound[e]&&g.bound[e](a),m&&M(t,e)),n}):[],g.update(),m=!0,r(g.before_update),g.fragment=!!i&&i(g.ctx),a.target){if(a.hydrate){const e=function(e){return Array.from(e.childNodes)}(a.target);g.fragment&&g.fragment.l(e),e.forEach(c)}else g.fragment&&g.fragment.c();a.intro&&E(t.$$.fragment),B(t,a.target,a.anchor),_()}h(d)}class C{$destroy(){I(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(){}}function H(t){let n;return{c(){n=l("div"),n.innerHTML='<img src="images/foto.jpg" alt="">',g(n,"class","image")},m(e,t){s(e,n,t)},p:e,i:e,o:e,d(e){e&&c(n)}}}class A extends C{constructor(e){super(),Q(this,e,null,H,o,{})}}function F(t){let n,r,a;return{c(){n=l("ul"),n.innerHTML='<li><a href="https://github.com/souzace" target="_blank" class="icon brands style2 fa-github"><span class="label">github</span></a></li> \n    <li><a href="https://www.linkedin.com/in/souzace" target="_blank" class="icon brands style2 fa-linkedin-in"><span class="label">LinkedIn</span></a></li>',r=d(),a=l("div"),a.innerHTML='<i>Made using <a href="https://svelte.dev/" target="_blank">Svelte</a></i>',g(n,"class","icons")},m(e,t){s(e,n,t),s(e,r,t),s(e,a,t)},p:e,i:e,o:e,d(e){e&&c(n),e&&c(r),e&&c(a)}}}class R extends C{constructor(e){super(),Q(this,e,null,F,o,{})}}function N(e){let t,n;return{c(){t=l("img"),t.src!==(n="images/brazil-disabled.png")&&g(t,"src","images/brazil-disabled.png"),g(t,"alt","")},m(e,n){s(e,t,n)},d(e){e&&c(t)}}}function D(e){let t,n;return{c(){t=l("img"),t.src!==(n="images/brazil-enabled.png")&&g(t,"src","images/brazil-enabled.png"),g(t,"alt","")},m(e,n){s(e,t,n)},d(e){e&&c(t)}}}function O(e){let t,n;return{c(){t=l("img"),t.src!==(n="images/usa-disabled.png")&&g(t,"src","images/usa-disabled.png"),g(t,"alt","")},m(e,n){s(e,t,n)},d(e){e&&c(t)}}}function G(e){let t,n;return{c(){t=l("img"),t.src!==(n="images/usa-enabled.png")&&g(t,"src","images/usa-enabled.png"),g(t,"alt","")},m(e,n){s(e,t,n)},d(e){e&&c(t)}}}function U(t){let n,o,i,u;function m(e,t){return"pt-BR"===e[0]?D:N}let p=m(t),h=p(t);function $(e,t){return"en"===e[0]?G:O}let b=$(t),v=b(t);return{c(){n=l("a"),h.c(),o=d(),i=l("a"),v.c(),g(n,"href","#"),g(n,"class","flag svelte-19p66zw"),g(i,"href","#"),g(i,"class","flag svelte-19p66zw")},m(e,c,l){s(e,n,c),h.m(n,null),s(e,o,c),s(e,i,c),v.m(i,null),l&&r(u),u=[f(n,"click",(function(){a(t[1]("pt-BR"))&&t[1]("pt-BR").apply(this,arguments)})),f(i,"click",(function(){a(t[1]("en"))&&t[1]("en").apply(this,arguments)}))]},p(e,[r]){p!==(p=m(t=e))&&(h.d(1),h=p(t),h&&(h.c(),h.m(n,null))),b!==(b=$(t))&&(v.d(1),v=b(t),v&&(v.c(),v.m(i,null)))},i:e,o:e,d(e){e&&c(n),h.d(),e&&c(o),e&&c(i),v.d(),r(u)}}}function V(e,t,n){let{language:r}=t,{changeLang:a}=t;return e.$set=e=>{"language"in e&&n(0,r=e.language),"changeLang"in e&&n(1,a=e.changeLang)},[r,a]}class W extends C{constructor(e){super(),Q(this,e,V,U,o,{language:0,changeLang:1})}}function Z(t){let n,r,a,o,f,p,h,$,b;return{c(){n=l("div"),r=l("h3"),a=u(t[0]),o=d(),f=l("p"),p=u(t[1]),h=d(),$=l("p"),b=u(t[2]),g(r,"class","svelte-1tfo07k"),g(f,"class","major svelte-1tfo07k"),g($,"class","svelte-1tfo07k"),g(n,"class","text svelte-1tfo07k")},m(e,t){s(e,n,t),i(n,r),i(r,a),i(n,o),i(n,f),i(f,p),i(n,h),i(n,$),i($,b)},p(e,[t]){1&t&&m(a,e[0]),2&t&&m(p,e[1]),4&t&&m(b,e[2])},i:e,o:e,d(e){e&&c(n)}}}function q(e,t,n){let{title:r}=t,{mainText:a}=t,{contactText:o}=t;return e.$set=e=>{"title"in e&&n(0,r=e.title),"mainText"in e&&n(1,a=e.mainText),"contactText"in e&&n(2,o=e.contactText)},[r,a,o]}class K extends C{constructor(e){super(),Q(this,e,q,Z,o,{title:0,mainText:1,contactText:2})}}function X(e){let t;const n=new K({props:{title:"Desenvolvedor Web",mainText:"Sou desenvolvedor web, atualmente\r\n        morando em Fortaleza - CE, Brasil. Entre 2010 e 2017, trabalhei com Java\r\n        Script, PHP 5.x, MySQL, PostgresSQL, Firebird e outros... depois,\r\n        surgiram projetos usando Frameworks PHP como CodeIgniter, Zend e\r\n        Laravel, depois de 2017, precisei mudar meu foco, para se concentrar nas\r\n        bibliotecas Java Script modernas para UI, então recebi meu primeiro\r\n        projeto de aplicativo móvel feito em Ionic, desde então, fiz projetos\r\n        usando NodeJS, MongoDB, SQLite, Angular, ElectronJS, VueJS, GraphQL e\r\n        mais recentemente, envolvido em um projeto usando ReactJS.",contactText:"Se você gostaria de entrar em contato, sinta-se a vontade\r\n        para dizer um Olá através de alguma das redes sociais nos links abaixo."}});return{c(){P(n.$$.fragment)},m(e,r){B(n,e,r),t=!0},i(e){t||(E(n.$$.fragment,e),t=!0)},o(e){J(n.$$.fragment,e),t=!1},d(e){I(n,e)}}}function Y(e){let t;const n=new K({props:{title:"Web Developer",mainText:"I am a web developer, currently\r\n        living in Fortaleza - CE, Brazil. Between 2010 and 2017, i worked with\r\n        Java Script, PHP 5.x, MySQL, PostgresSQL, Firebird and anothers...\r\n        after, came projects using PHP frameworks like CodeIgniter, Zend and\r\n        Laravel, after 2017, i needed change my stack to focus in modern Java\r\n        Script libraries for UI, and i made my first mobile app project using\r\n        Ionic, since then, i made projects using NodeJS, MongoDB, SQLite,\r\n        Angular, ElectronJS, VueJS, GraphQL and most recently, envolved in a\r\n        project using ReactJS.",contactText:"If you’d like to get in touch, feel free to say hello\r\n        through any of the social links below."}});return{c(){P(n.$$.fragment)},m(e,r){B(n,e,r),t=!0},i(e){t||(E(n.$$.fragment,e),t=!0)},o(e){J(n.$$.fragment,e),t=!1},d(e){I(n,e)}}}function ee(e){let t,n,a,o,u,f,m,p,h;const $=new W({props:{language:e[0],changeLang:e[1]}}),b=[Y,X],v=[];function x(e,t){return"en"===e[0]?0:1}f=x(e),m=v[f]=b[f](e);const y=new R({});return{c(){t=l("section"),n=l("div"),a=l("h1"),a.textContent="Fabio Souza (souzace)",o=d(),P($.$$.fragment),u=d(),m.c(),p=d(),P(y.$$.fragment),g(a,"class","svelte-1by36so"),g(n,"class","content svelte-1by36so"),g(t,"class","banner style1 orient-left content-align-left image-position-right\r\n  fullscreen onload-image-fade-in onload-content-fade-right")},m(e,r){s(e,t,r),i(t,n),i(n,a),i(n,o),B($,n,null),i(n,u),v[f].m(n,null),i(n,p),B(y,n,null),h=!0},p(e,[t]){const a={};1&t&&(a.language=e[0]),$.$set(a);let o=f;f=x(e),f!==o&&(j={r:0,c:[],p:j},J(v[o],1,1,()=>{v[o]=null}),j.r||r(j.c),j=j.p,m=v[f],m||(m=v[f]=b[f](e),m.c()),E(m,1),m.m(n,p))},i(e){h||(E($.$$.fragment,e),E(m),E(y.$$.fragment,e),h=!0)},o(e){J($.$$.fragment,e),J(m),J(y.$$.fragment,e),h=!1},d(e){e&&c(t),I($),v[f].d(),I(y)}}}function te(e,t,n){let r="pt-BR";return[r,function(e){n(0,r=e)}]}class ne extends C{constructor(e){super(),Q(this,e,te,ee,o,{})}}function re(t){let n,r,a,o;const u=new A({}),f=new ne({});return{c(){n=l("div"),r=l("section"),P(u.$$.fragment),a=d(),P(f.$$.fragment),g(r,"class","banner style1 orient-left content-align-left image-position-right fullscreen onload-image-fade-in onload-content-fade-right"),g(n,"id","wrapper"),g(n,"class","divided")},m(e,t){s(e,n,t),i(n,r),B(u,r,null),i(r,a),B(f,r,null),o=!0},p:e,i(e){o||(E(u.$$.fragment,e),E(f.$$.fragment,e),o=!0)},o(e){J(u.$$.fragment,e),J(f.$$.fragment,e),o=!1},d(e){e&&c(n),I(u),I(f)}}}return new class extends C{constructor(e){super(),Q(this,e,null,re,o,{})}}({target:document.body,props:{}})}();
//# sourceMappingURL=bundle.js.map
