
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.22.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\LeftColumn.svelte generated by Svelte v3.22.3 */

    const file = "src\\LeftColumn.svelte";

    function create_fragment(ctx) {
    	let div;
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			if (img.src !== (img_src_value = "images/foto.jpg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file, 1, 4, 25);
    			attr_dev(div, "class", "image");
    			add_location(div, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LeftColumn> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LeftColumn", $$slots, []);
    	return [];
    }

    class LeftColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LeftColumn",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\SocialButtons.svelte generated by Svelte v3.22.3 */

    const file$1 = "src\\SocialButtons.svelte";

    function create_fragment$1(ctx) {
    	let ul;
    	let li0;
    	let a0;
    	let span0;
    	let t1;
    	let li1;
    	let a1;
    	let span1;
    	let t3;
    	let i;
    	let t4;
    	let a2;

    	const block = {
    		c: function create() {
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			span0 = element("span");
    			span0.textContent = "github";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			span1 = element("span");
    			span1.textContent = "LinkedIn";
    			t3 = space();
    			i = element("i");
    			t4 = text("Made using ");
    			a2 = element("a");
    			a2.textContent = "SvelteJS";
    			attr_dev(span0, "class", "label");
    			add_location(span0, file$1, 1, 98, 118);
    			attr_dev(a0, "href", "https://github.com/souzace");
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "icon brands style2 fa-github");
    			add_location(a0, file$1, 1, 8, 28);
    			add_location(li0, file$1, 1, 4, 24);
    			attr_dev(span1, "class", "label");
    			add_location(span1, file$1, 3, 112, 280);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/souzace");
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "icon brands style2 fa-linkedin-in");
    			add_location(a1, file$1, 3, 8, 176);
    			add_location(li1, file$1, 3, 4, 172);
    			attr_dev(ul, "class", "icons");
    			add_location(ul, file$1, 0, 0, 0);
    			attr_dev(a2, "href", "https://svelte.dev/");
    			attr_dev(a2, "target", "_blank");
    			add_location(a2, file$1, 6, 14, 353);
    			add_location(i, file$1, 6, 0, 339);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(a0, span0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(a1, span1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, i, anchor);
    			append_dev(i, t4);
    			append_dev(i, a2);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(i);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SocialButtons> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SocialButtons", $$slots, []);
    	return [];
    }

    class SocialButtons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SocialButtons",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\LanguagesButtons.svelte generated by Svelte v3.22.3 */

    const file$2 = "src\\LanguagesButtons.svelte";

    // (9:4) {:else}
    function create_else_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "images/usa-disabled.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 9, 8, 237);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(9:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (7:4) {#if language === 'en'}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "images/usa-enabled.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 7, 8, 171);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(7:4) {#if language === 'en'}",
    		ctx
    	});

    	return block;
    }

    // (17:4) {:else}
    function create_else_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "images/brazil-disabled.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 17, 8, 475);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(17:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (15:4) {#if language === 'pt-BR'}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = "images/brazil-enabled.png")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$2, 15, 8, 406);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(15:4) {#if language === 'pt-BR'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let a0;
    	let t;
    	let a1;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*language*/ ctx[0] === "en") return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*language*/ ctx[0] === "pt-BR") return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			a0 = element("a");
    			if_block0.c();
    			t = space();
    			a1 = element("a");
    			if_block1.c();
    			attr_dev(a0, "href", "#");
    			attr_dev(a0, "class", "flag svelte-19p66zw");
    			add_location(a0, file$2, 5, 0, 77);
    			attr_dev(a1, "href", "#");
    			attr_dev(a1, "class", "flag svelte-19p66zw");
    			add_location(a1, file$2, 13, 0, 306);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor, remount) {
    			insert_dev(target, a0, anchor);
    			if_block0.m(a0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, a1, anchor);
    			if_block1.m(a1, null);
    			if (remount) run_all(dispose);

    			dispose = [
    				listen_dev(
    					a0,
    					"click",
    					function () {
    						if (is_function(/*changeLang*/ ctx[1]("en"))) /*changeLang*/ ctx[1]("en").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				),
    				listen_dev(
    					a1,
    					"click",
    					function () {
    						if (is_function(/*changeLang*/ ctx[1]("pt-BR"))) /*changeLang*/ ctx[1]("pt-BR").apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				)
    			];
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(a0, null);
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(a1, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a0);
    			if_block0.d();
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(a1);
    			if_block1.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { language } = $$props;
    	let { changeLang } = $$props;
    	const writable_props = ["language", "changeLang"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LanguagesButtons> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("LanguagesButtons", $$slots, []);

    	$$self.$set = $$props => {
    		if ("language" in $$props) $$invalidate(0, language = $$props.language);
    		if ("changeLang" in $$props) $$invalidate(1, changeLang = $$props.changeLang);
    	};

    	$$self.$capture_state = () => ({ language, changeLang });

    	$$self.$inject_state = $$props => {
    		if ("language" in $$props) $$invalidate(0, language = $$props.language);
    		if ("changeLang" in $$props) $$invalidate(1, changeLang = $$props.changeLang);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [language, changeLang];
    }

    class LanguagesButtons extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { language: 0, changeLang: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LanguagesButtons",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*language*/ ctx[0] === undefined && !("language" in props)) {
    			console.warn("<LanguagesButtons> was created without expected prop 'language'");
    		}

    		if (/*changeLang*/ ctx[1] === undefined && !("changeLang" in props)) {
    			console.warn("<LanguagesButtons> was created without expected prop 'changeLang'");
    		}
    	}

    	get language() {
    		throw new Error("<LanguagesButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set language(value) {
    		throw new Error("<LanguagesButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changeLang() {
    		throw new Error("<LanguagesButtons>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set changeLang(value) {
    		throw new Error("<LanguagesButtons>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\Text.svelte generated by Svelte v3.22.3 */

    const file$3 = "src\\Text.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h3;
    	let t0;
    	let t1;
    	let p0;
    	let t2;
    	let t3;
    	let p1;
    	let t4;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[0]);
    			t1 = space();
    			p0 = element("p");
    			t2 = text(/*mainText*/ ctx[1]);
    			t3 = space();
    			p1 = element("p");
    			t4 = text(/*contactText*/ ctx[2]);
    			attr_dev(h3, "class", "svelte-1tfo07k");
    			add_location(h3, file$3, 23, 2, 253);
    			attr_dev(p0, "class", "major svelte-1tfo07k");
    			add_location(p0, file$3, 24, 2, 273);
    			attr_dev(p1, "class", "svelte-1tfo07k");
    			add_location(p1, file$3, 26, 2, 310);
    			attr_dev(div, "class", "text svelte-1tfo07k");
    			add_location(div, file$3, 21, 0, 229);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(h3, t0);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(p0, t2);
    			append_dev(div, t3);
    			append_dev(div, p1);
    			append_dev(p1, t4);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*title*/ 1) set_data_dev(t0, /*title*/ ctx[0]);
    			if (dirty & /*mainText*/ 2) set_data_dev(t2, /*mainText*/ ctx[1]);
    			if (dirty & /*contactText*/ 4) set_data_dev(t4, /*contactText*/ ctx[2]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { title } = $$props;
    	let { mainText } = $$props;
    	let { contactText } = $$props;
    	const writable_props = ["title", "mainText", "contactText"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Text> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Text", $$slots, []);

    	$$self.$set = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("mainText" in $$props) $$invalidate(1, mainText = $$props.mainText);
    		if ("contactText" in $$props) $$invalidate(2, contactText = $$props.contactText);
    	};

    	$$self.$capture_state = () => ({ title, mainText, contactText });

    	$$self.$inject_state = $$props => {
    		if ("title" in $$props) $$invalidate(0, title = $$props.title);
    		if ("mainText" in $$props) $$invalidate(1, mainText = $$props.mainText);
    		if ("contactText" in $$props) $$invalidate(2, contactText = $$props.contactText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [title, mainText, contactText];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { title: 0, mainText: 1, contactText: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*title*/ ctx[0] === undefined && !("title" in props)) {
    			console.warn("<Text> was created without expected prop 'title'");
    		}

    		if (/*mainText*/ ctx[1] === undefined && !("mainText" in props)) {
    			console.warn("<Text> was created without expected prop 'mainText'");
    		}

    		if (/*contactText*/ ctx[2] === undefined && !("contactText" in props)) {
    			console.warn("<Text> was created without expected prop 'contactText'");
    		}
    	}

    	get title() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get mainText() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set mainText(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get contactText() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set contactText(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\RightColumn.svelte generated by Svelte v3.22.3 */
    const file$4 = "src\\RightColumn.svelte";

    // (46:4) {:else}
    function create_else_block$1(ctx) {
    	let current;

    	const text_1 = new Text({
    			props: {
    				title: "Desenvolvedor Web",
    				mainText: "Sou desenvolvedor web, atualmente\r\n        morando em Fortaleza - CE, Brasil. Entre 2010 e 2017, trabalhei com Java\r\n        Script, PHP 5.x, MySQL, PostgresSQL, Firebird e outros... depois,\r\n        surgiram projetos usando Frameworks PHP como CodeIgniter, Zend e\r\n        Laravel, depois de 2017, precisei mudar meu foco, para se concentrar nas\r\n        bibliotecas Java Script modernas para UI, então recebi meu primeiro\r\n        projeto de aplicativo móvel feito em Ionic, desde então, fiz projetos\r\n        usando NodeJS, MongoDB, SQLite, Angular, ElectronJS, VueJS, GraphQL e\r\n        mais recentemente, envolvido em um projeto usando ReactJS.",
    				contactText: "Se você gostaria de entrar em contato, sinta-se a vontade\r\n        para dizer um Olá através de alguma das redes sociais nos links abaixo."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(46:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (32:4) {#if languageSelected === 'en'}
    function create_if_block$1(ctx) {
    	let current;

    	const text_1 = new Text({
    			props: {
    				title: "Web Developer",
    				mainText: "I am a web developer, currently\r\n        living in Fortaleza - CE, Brazil. Between 2010 and 2017, i worked with\r\n        Java Script, PHP 5.x, MySQL, PostgresSQL, Firebird and anothers...\r\n        after, came projects using PHP frameworks like CodeIgniter, Zend and\r\n        Laravel, after 2017, i needed change my stack to focus in modern Java\r\n        Script libraries for UI, and i made my first mobile app project using\r\n        Ionic, since then, i made projects using NodeJS, MongoDB, SQLite,\r\n        Angular, ElectronJS, VueJS, GraphQL and most recently, envolved in a\r\n        project using ReactJS.",
    				contactText: "If you’d like to get in touch, feel free to say hello\r\n        through any of the social links below."
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(32:4) {#if languageSelected === 'en'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let section;
    	let div;
    	let h1;
    	let t1;
    	let t2;
    	let current_block_type_index;
    	let if_block;
    	let t3;
    	let current;

    	const languagesbuttons = new LanguagesButtons({
    			props: {
    				language: /*languageSelected*/ ctx[0],
    				changeLang: /*changeLang*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*languageSelected*/ ctx[0] === "en") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	const socialbuttons = new SocialButtons({ $$inline: true });

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Fabio Souza (souzace)";
    			t1 = space();
    			create_component(languagesbuttons.$$.fragment);
    			t2 = space();
    			if_block.c();
    			t3 = space();
    			create_component(socialbuttons.$$.fragment);
    			attr_dev(h1, "class", "svelte-1by36so");
    			add_location(h1, file$4, 28, 4, 603);
    			attr_dev(div, "class", "content svelte-1by36so");
    			add_location(div, file$4, 26, 2, 574);
    			attr_dev(section, "class", "banner style1 orient-left content-align-left image-position-right\r\n  fullscreen onload-image-fade-in onload-content-fade-right");
    			add_location(section, file$4, 22, 0, 421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(languagesbuttons, div, null);
    			append_dev(div, t2);
    			if_blocks[current_block_type_index].m(div, null);
    			append_dev(div, t3);
    			mount_component(socialbuttons, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const languagesbuttons_changes = {};
    			if (dirty & /*languageSelected*/ 1) languagesbuttons_changes.language = /*languageSelected*/ ctx[0];
    			languagesbuttons.$set(languagesbuttons_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, t3);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(languagesbuttons.$$.fragment, local);
    			transition_in(if_block);
    			transition_in(socialbuttons.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(languagesbuttons.$$.fragment, local);
    			transition_out(if_block);
    			transition_out(socialbuttons.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(languagesbuttons);
    			if_blocks[current_block_type_index].d();
    			destroy_component(socialbuttons);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let languageSelected = "en";

    	function changeLang(language) {
    		$$invalidate(0, languageSelected = language);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<RightColumn> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("RightColumn", $$slots, []);

    	$$self.$capture_state = () => ({
    		SocialButtons,
    		LanguagesButtons,
    		Text,
    		languageSelected,
    		changeLang
    	});

    	$$self.$inject_state = $$props => {
    		if ("languageSelected" in $$props) $$invalidate(0, languageSelected = $$props.languageSelected);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [languageSelected, changeLang];
    }

    class RightColumn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "RightColumn",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.22.3 */
    const file$5 = "src\\App.svelte";

    function create_fragment$5(ctx) {
    	let div;
    	let section;
    	let t;
    	let current;
    	const leftcolumn = new LeftColumn({ $$inline: true });
    	const rightcolumn = new RightColumn({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			section = element("section");
    			create_component(leftcolumn.$$.fragment);
    			t = space();
    			create_component(rightcolumn.$$.fragment);
    			attr_dev(section, "class", "banner style1 orient-left content-align-left image-position-right fullscreen onload-image-fade-in onload-content-fade-right");
    			add_location(section, file$5, 7, 2, 181);
    			attr_dev(div, "id", "wrapper");
    			attr_dev(div, "class", "divided");
    			add_location(div, file$5, 5, 1, 139);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, section);
    			mount_component(leftcolumn, section, null);
    			append_dev(section, t);
    			mount_component(rightcolumn, section, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftcolumn.$$.fragment, local);
    			transition_in(rightcolumn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftcolumn.$$.fragment, local);
    			transition_out(rightcolumn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(leftcolumn);
    			destroy_component(rightcolumn);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ LeftColumn, RightColumn });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
