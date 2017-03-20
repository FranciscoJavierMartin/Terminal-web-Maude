/*

 |       __ _____                     ________                              __
 |      / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /
 |  __ / // // // // // _  // _// // / / // _  // _//     // //  \/ // _ \/ /
 | /  / // // // // // ___// / / // / / // ___// / / / / // // /\  // // / /__
 | \___//____ \\___//____//_/ _\_  / /_//____//_/ /_/ /_//_//_/ /_/ \__\_\___/
 |           \/              /____/                              version 0.3.6
 http://terminal.jcubic.pl

 Licensed under GNU LGPL Version 3 license
 Copyright (c) 2011 Jakub Jankiewicz <http://jcubic.pl>

 Includes:

 Storage plugin Distributed under the MIT License
 Copyright (c) 2010 Dave Schindler

 LiveQuery plugin Dual MIT and GPL
 Copyright (c) 2008 Brandon Aaron (http://brandonaaron.net)

 jQuery Timers licenced with the WTFPL
 <http://jquery.offput.ca/every/>

 Date: Tue, 09 Aug 2011 13:12:19 +0000
*/
Array.prototype.has = function(h) { for (var w = this.length; w--;)
        if (this[w] == h) return true;
    return false };

function get_stack(h) { return h ? [h.toString().match(/.*\n.*\n/)].concat(get_stack(h.caller)) : [] }
(function(h, w) {
    function S(a, c) { var f; if (typeof a === "string" && typeof c === "string") { localStorage[a] = c; return true } else if (typeof a === "object" && typeof c === "undefined") { for (f in a)
                if (a.hasOwnProperty(f)) localStorage[f] = a[f];
            return true } return false }

    function O(a, c) {
        var f, d;
        f = new Date;
        f.setTime(f.getTime() + 31536E6);
        f = "; expires=" + f.toGMTString();
        if (typeof a === "string" && typeof c === "string") { document.cookie = a + "=" + c + f + "; path=/"; return true } else if (typeof a === "object" && typeof c === "undefined") {
            for (d in a)
                if (a.hasOwnProperty(d)) document.cookie =
                    d + "=" + a[d] + f + "; path=/";
            return true
        }
        return false
    }

    function T(a) { return localStorage[a] }

    function U(a) { var c, f, d;
        a += "=";
        c = document.cookie.split(";"); for (f = 0; f < c.length; f++) { for (d = c[f]; d.charAt(0) === " ";) d = d.substring(1, d.length); if (d.indexOf(a) === 0) return d.substring(a.length, d.length) } return null }

    function V(a) { return delete localStorage[a] }

    function W(a) { return O(a, "", -1) }

    function P(a, c) { var f = [],
            d = a.length; if (d < c) return [a]; for (var j = 0; j < d; j += c) f.push(a.substring(j, j + c)); return f }

    function z(a) {
        if (typeof a ==
            "string") {
            a = a.replace(/&(?!#[0-9]*;)/g, "&amp;");
            a = a.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            a = a.replace(/\n/g, "<br/>");
            a = a.replace(/ /g, "&nbsp;");
            a = a.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
            var c = a.split(X);
            if (c.length > 1) a = h.map(c, function(f) {
                return f[0] == "[" ? f.replace(Y, function(d, j, q, u, C) {
                    d = "";
                    if (j.indexOf("b") != -1) d += "font-weight:bold;";
                    if (j.indexOf("u") != -1) d += "text-decoration:underline;";
                    if (j.indexOf("i") != -1) d += "font-style:italic; ";
                    if (q.match(Q)) d += "color:" + q + ";";
                    if (u.match(Q)) d += "background-color:" +
                        u;
                    return a = '<span style="' + d + '">' + C + "</span>"
                }) : "<span>" + f + "</span>"
            }).join("");
            return a
        } else return ""
    }

    function R(a) { var c = a instanceof Array ? a : a ? [a] : [],
            f = 0;
        h.extend(this, { left: function() { if (f === 0) f = c.length - 1;
                else --f; return c[f] }, right: function() { if (f == c.length - 1) f = 0;
                else ++f; return c[f] }, current: function() { return c[f] }, data: function() { return c }, reset: function() { f = 0 }, append: function(d) { c.push(d);
                this.reset() } }) }

    function Z(a) {
        var c = a ? [a] : [];
        h.extend(this, {
            size: function() { return c.length },
            pop: function() {
                if (c.length ===
                    0) return null;
                else { var f = c[c.length - 1];
                    c = c.slice(0, c.length - 1); return f }
            },
            push: function(f) { c = c.concat([f]); return f },
            top: function() { return c.length > 0 ? c[c.length - 1] : null }
        })
    }

    function $(a) {
        var c = true;
        if (typeof a === "string" && a !== "") a += "_";
        var f = h.Storage.get(a + "commands"),
            d = new R(f ? eval("(" + f + ")") : [""]);
        h.extend(this, {
            append: function(j) { if (c && d.current() != j) { d.append(j);
                    h.Storage.set(a + "commands", h.json_stringify(d.data())) } },
            data: function() { return d.data() },
            next: function() { return d.right() },
            last: function() { d.reset() },
            previous: function() { return d.left() },
            clear: function() { d = new R;
                h.Storage.remove(a + "commands") },
            enable: function() { c = true },
            disable: function() { c = false }
        })
    }
    h.extend(h.fn, {
        livequery: function(a, c, f) { var d = this,
                j; if (h.isFunction(a)) { f = c;
                c = a;
                a = w }
            h.each(h.livequery.queries, function(q, u) { if (d.selector == u.selector && d.context == u.context && a == u.type && (!c || c.$lqguid == u.fn.$lqguid) && (!f || f.$lqguid == u.fn2.$lqguid)) return (j = u) && false });
            j = j || new h.livequery(this.selector, this.context, a, c, f);
            j.stopped = false;
            j.run(); return this },
        expire: function(a, c, f) { var d = this; if (h.isFunction(a)) { f = c;
                c = a;
                a = w }
            h.each(h.livequery.queries, function(j, q) { if (d.selector == q.selector && d.context == q.context && (!a || a == q.type) && (!c || c.$lqguid == q.fn.$lqguid) && (!f || f.$lqguid == q.fn2.$lqguid) && !this.stopped) h.livequery.stop(q.id) }); return this }
    });
    h.livequery = function(a, c, f, d, j) {
        this.selector = a;
        this.context = c || document;
        this.type = f;
        this.fn = d;
        this.fn2 = j;
        this.elements = [];
        this.stopped = false;
        this.id = h.livequery.queries.push(this) - 1;
        d.$lqguid = d.$lqguid || h.livequery.guid++;
        if (j) j.$lqguid = j.$lqguid || h.livequery.guid++;
        return this
    };
    h.livequery.prototype = {
        stop: function() { var a = this; if (this.type) this.elements.unbind(this.type, this.fn);
            else this.fn2 && this.elements.each(function(c, f) { a.fn2.apply(f) });
            this.elements = [];
            this.stopped = true },
        run: function() {
            if (!this.stopped) {
                var a = this,
                    c = this.elements,
                    f = h(this.selector, this.context),
                    d = f.not(c);
                this.elements = f;
                if (this.type) { d.bind(this.type, this.fn);
                    c.length > 0 && h.each(c, function(j, q) { h.inArray(q, f) < 0 && h.event.remove(q, a.type, a.fn) }) } else {
                    d.each(function() { a.fn.apply(this) });
                    this.fn2 && c.length > 0 && h.each(c, function(j, q) { h.inArray(q, f) < 0 && a.fn2.apply(q) })
                }
            }
        }
    };
    h.extend(h.livequery, {
        guid: 0,
        queries: [],
        queue: [],
        running: false,
        timeout: null,
        checkQueue: function() { if (h.livequery.running && h.livequery.queue.length)
                for (var a = h.livequery.queue.length; a--;) h.livequery.queries[h.livequery.queue.shift()].run() },
        pause: function() { h.livequery.running = false },
        play: function() { h.livequery.running = true;
            h.livequery.run() },
        registerPlugin: function() {
            h.each(arguments, function(a, c) {
                if (h.fn[c]) {
                    var f =
                        h.fn[c];
                    h.fn[c] = function() { var d = f.apply(this, arguments);
                        h.livequery.run(); return d }
                }
            })
        },
        run: function(a) { if (a != w) h.inArray(a, h.livequery.queue) < 0 && h.livequery.queue.push(a);
            else h.each(h.livequery.queries, function(c) { h.inArray(c, h.livequery.queue) < 0 && h.livequery.queue.push(c) });
            h.livequery.timeout && clearTimeout(h.livequery.timeout);
            h.livequery.timeout = setTimeout(h.livequery.checkQueue, 20) },
        stop: function(a) { a != w ? h.livequery.queries[a].stop() : h.each(h.livequery.queries, function(c) { h.livequery.queries[c].stop() }) }
    });
    h.livequery.registerPlugin("append", "prepend", "after", "before", "wrap", "attr", "removeAttr", "addClass", "removeClass", "toggleClass", "empty", "remove");
    h(function() { h.livequery.play() });
    var aa = h.prototype.init;
    h.prototype.init = function(a, c) { var f = aa.apply(this, arguments); if (a && a.selector) { f.context = a.context;
            f.selector = a.selector } if (typeof a == "string") { f.context = c || document;
            f.selector = a } return f };
    h.prototype.init.prototype = h.prototype;
    var K = typeof window.localStorage !== "undefined";
    h.extend({
        Storage: {
            set: K ?
                S : O,
            get: K ? T : U,
            remove: K ? V : W
        }
    });
    jQuery.fn.extend({ everyTime: function(a, c, f, d, j) { return this.each(function() { jQuery.timer.add(this, a, c, f, d, j) }) }, oneTime: function(a, c, f) { return this.each(function() { jQuery.timer.add(this, a, c, f, 1) }) }, stopTime: function(a, c) { return this.each(function() { jQuery.timer.remove(this, a, c) }) } });
    jQuery.extend({
        timer: {
            guid: 1,
            global: {},
            regex: /^([0-9]+)\s*(.*s)?$/,
            powers: { ms: 1, cs: 10, ds: 100, s: 1E3, das: 1E4, hs: 1E5, ks: 1E6 },
            timeParse: function(a) {
                if (a == w || a == null) return null;
                var c = this.regex.exec(jQuery.trim(a.toString()));
                return c[2] ? parseInt(c[1], 10) * (this.powers[c[2]] || 1) : a
            },
            add: function(a, c, f, d, j, q) {
                var u = 0;
                if (jQuery.isFunction(f)) { j || (j = d);
                    d = f;
                    f = c }
                c = jQuery.timer.timeParse(c);
                if (!(typeof c != "number" || isNaN(c) || c <= 0)) {
                    if (j && j.constructor != Number) { q = !!j;
                        j = 0 }
                    j = j || 0;
                    q = q || false;
                    if (!a.$timers) a.$timers = {};
                    a.$timers[f] || (a.$timers[f] = {});
                    d.$timerID = d.$timerID || this.guid++;
                    var C = function() { if (!(q && this.inProgress)) { this.inProgress = true; if (++u > j && j !== 0 || d.call(a, u) === false) jQuery.timer.remove(a, f, d);
                            this.inProgress = false } };
                    C.$timerID = d.$timerID;
                    a.$timers[f][d.$timerID] || (a.$timers[f][d.$timerID] = window.setInterval(C, c));
                    this.global[f] || (this.global[f] = []);
                    this.global[f].push(a)
                }
            },
            remove: function(a, c, f) { var d = a.$timers,
                    j; if (d) { if (c) { if (d[c]) { if (f) { if (f.$timerID) { window.clearInterval(d[c][f.$timerID]);
                                    delete d[c][f.$timerID] } } else
                                for (f in d[c]) { window.clearInterval(d[c][f]);
                                    delete d[c][f] }
                            for (j in d[c]) break; if (!j) { j = null;
                                delete d[c] } } } else
                        for (c in d) this.remove(a, c, f); for (j in d) break; if (!j) a.$timers = null } }
        }
    });
    if (jQuery.browser.msie) jQuery(window).one("unload",
        function() { var a = jQuery.timer.global,
                c; for (c in a)
                for (var f = a[c], d = f.length; --d;) jQuery.timer.remove(f[d], c) });
    var X = /(\[\[[biu]*;[^;]*;[^\]]*\][^\]]*\])/g,
        Y = /\[\[([biu]*);([^;]*);([^\]]*)\]([^\]]*)\]/g,
        Q = /#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})/;
    h.json_stringify = function(a, c) {
        var f = "";
        c = c === w ? 1 : c;
        switch (typeof a) {
            case "function":
                f += a;
                break;
            case "boolean":
                f += a ? "true" : "false";
                break;
            case "object":
                if (a === null) f += "null";
                else if (a instanceof Array) {
                    f += "[";
                    for (var d = a.length, j = 0; j < d - 1; ++j) f += h.json_stringify(a[j],
                        c + 1);
                    f += h.json_stringify(a[d - 1], c + 1) + "]"
                } else { f += "{"; for (d in a)
                        if (a.hasOwnProperty(d)) f += '"' + d + '":' + h.json_stringify(a[d], c + 1);
                    f += "}" }
                break;
            case "string":
                d = a;
                var q = { "\\\\": "\\\\", '"': '\\"', "/": "\\/", "\\n": "\\n", "\\r": "\\r", "\\t": "\\t" };
                for (j in q)
                    if (q.hasOwnProperty(j)) d = d.replace(RegExp(j, "g"), q[j]);
                f += '"' + d + '"';
                break;
            case "number":
                f += String(a)
        }
        f += c > 1 ? "," : "";
        if (c == 1) f = f.replace(/,([\]}])/g, "$1");
        return f.replace(/([\[{]),/g, "$1")
    };
    h.fn.cmd = function(a) {
        function c(g) {
            var r = g.substring(0, q - u - 1);
            g =
                g.substring(q - u - 1);
            return [r].concat(P(g, q))
        }

        function f() { j.focus();
            d.oneTime(1, function() { d.insert(j.val());
                j.blur();
                j.val("") }) }
        var d = this;
        d.addClass("cmd");
        d.append('<span class="prompt"></span><span></span><span class="cursor">&nbsp;</span><span></span>');
        var j = h("<textarea/>").addClass("clipboard").appendTo(d);
        a.width && d.width(a.width);
        var q, u, C = a.mask || false,
            o = "",
            m = 0,
            D, E = a.enabled,
            L, A, N = function() { var g = d.find(".cursor"); return function() { g.toggleClass("inverted") } }(),
            e = d.find(".cursor"),
            y = function(g) {
                function r(i,
                    k) { if (k == i.length) { p.html(z(i));
                        x.html("&nbsp;");
                        b.html("") } else if (k === 0) { p.html("");
                        x.html(z(i.slice(0, 1)));
                        b.html(z(i.slice(1))) } else { var n = z(i.slice(0, k));
                        p.html(n);
                        n = i.slice(k, k + 1);
                        x.html(n == " " ? "&nbsp;" : z(n));
                        k == i.lenght - 1 ? b.html("") : b.html(z(i.slice(k + 1))) } }

                function l(i) { return "<div>" + z(i) + "</div>" }

                function F(i) { var k = b;
                    h.each(i, function(n, s) { k = h(l(s)).insertAfter(k) }) }

                function J(i) { h.each(i, function(k, n) { p.before(l(n)) }) }
                var x = g.find(".cursor"),
                    p = x.prev(),
                    b = x.next();
                return function() {
                    var i =
                        C ? o.replace(/./g, "*") : o;
                    g.find("div").remove();
                    p.html("");
                    if (i.length > q - u - 1) {
                        var k = c(i),
                            n = k[0].length;
                        if (m < n) { r(k[0], m);
                            F(k.slice(1)) } else if (m == n) { p.before(l(k[0]));
                            r(k[1], 0);
                            F(k.slice(2)) } else {
                            var s = k.length;
                            if (m < n) { r(k[0], m);
                                F(k.slice(1)) } else if (m == n) { p.before(l(k[0]));
                                r(k[1], 0);
                                F(k.slice(2)) } else {
                                var v = k.slice(-1)[0];
                                i = i.length - m;
                                if (i <= v.length) { J(k.slice(0, -1));
                                    n = v.length == i ? 0 : v.length - i;
                                    r(v, n) } else if (s == 3) { p.before("<div>" + z(k[0]) + "</div>");
                                    r(k[1], m - n - 1);
                                    b.after("<div>" + z(k[2]) + "</div>") } else {
                                    v =
                                        Math.floor((m + u) / q);
                                    s = k[v];
                                    n = function(t) { for (var B = 0, G = t.length; G--;) B += t[G].length; return B }(k.slice(0, v));
                                    n = m - n;
                                    if (n == q) { n = 0;
                                        s = k[++v] }
                                    z(s.slice(0, n));
                                    r(s, n);
                                    J(k.slice(0, v));
                                    F(k.slice(v + 1))
                                }
                            }
                        }
                    } else if (i === "") { p.html("");
                        x.html("&nbsp;");
                        b.html("") } else r(i, m)
                }
            }(d),
            H = function() { var g = d.find(".prompt"); return function() { if (typeof D == "string") { u = D.length;
                        g.html(z(D) + "&nbsp;") } else D(function(r) { u = r.length;
                        g.html(z(r) + "&nbsp;") }) } }();
        h.extend(d, {
            name: function(g) { if (g !== w) { L = g;
                    A = new $(g) } else return L },
            history: function() { return A },
            set: function(g, r) { if (g !== w) { o = g; if (!r) m = o.length;
                    y() } },
            insert: function(g, r) { if (m == o.length) o += g;
                else o = m === 0 ? g + o : o.slice(0, m) + g + o.slice(m);
                r || (m += g.length);
                y() },
            get: function() { return o },
            commands: function(g) { if (g) a.commands = g;
                else return g },
            destroy: function() { h(document.documentElement).unbind(".commandline");
                d.find(".prompt").remove() },
            prompt: function(g) {
                if (g === w) return D;
                else {
                    if (typeof g == "string" || typeof g == "function") D = g;
                    else throw "prompt must be a function or string";
                    H()
                }
            },
            position: function(g) { if (typeof g == "number") { m = g < 0 ? 0 : g > o.length ? o.length : g;
                    y() } else return m },
            resize: function(g) { if (g) q = g;
                else { g = d.width(); var r = e.innerWidth();
                    q = Math.floor(g / r) }
                y() },
            enable: function() { if (!E) { d.everyTime(500, "blink", N);
                    E = true } },
            isenabled: function() { return E },
            disable: function() { if (E) { d.stopTime("blink", N);
                    d.find(".cursor").removeClass("inverted");
                    E = false } },
            mask: function(g) { if (typeof g == "boolean") { C = g;
                    y() } else return C }
        });
        d.name(a.name || "");
        D = a.prompt || ">";
        H();
        if (a.enabled === w ||
            a.enabled === true) d.enable();
        h(document.documentElement).keypress(function(g) { var r; if (g.ctrlKey && g.which == 99) return true; if (a.keypress) r = a.keypress(g); if (r === w || r) { if (E)
                    if ([38, 32, 13, 0, 8].has(g.which) && g.keyCode != 123 && !(g.which == 38 && g.shiftKey)) return false;
                    else if (!g.ctrlKey && !(g.altKey && g.which == 100)) { d.insert(String.fromCharCode(g.which)); return false } } else return r; if (g.which == 100 && g.ctrlKey) return false }).keydown(function(g) {
            if (a.keydown && a.keydown(g) === false) return false;
            if (E) {
                var r;
                if (g.keyCode ==
                    13) { A && o && A.append(o);
                    A.last();
                    g = o;
                    d.set("");
                    typeof D == "function" && H();
                    a.commands && a.commands(g) } else if (g.which == 32) d.insert(" ");
                else if (g.which == 8) { if (o !== "" && m > 0) { o = o.slice(0, m - 1) + o.slice(m, o.length);--m;
                        y() } } else if (g.which == 9 && !(g.ctrlKey || g.altKey)) d.insert("\t");
                else if (g.which == 46 || g.which == 68 && g.ctrlKey) { if (o !== "" && m < o.length) { o = o.slice(0, m) + o.slice(m + 1, o.length);
                        y() } return true } else if (A && g.which == 38 || g.which == 80 && g.ctrlKey) d.set(A.previous());
                else if (A && g.which == 40 || g.which == 78 && g.ctrlKey) d.set(A.next());
                else if (g.which == 27) d.set("");
                else if (g.which == 37 || g.which == 66 && g.ctrlKey)
                    if (g.ctrlKey && g.which != 66) { r = m - 1;
                        g = 0; for (o[r] == " " && --r; r > 0; --r)
                            if (o[r] == " " && o[r + 1] != " ") { g = r + 1; break }
                        d.position(g) } else { if (m > 0) {--m;
                            y() } }
                else if (g.which == 39 || g.which == 70 && g.ctrlKey)
                    if (g.ctrlKey && g.which != 70) { o[m] == " " && ++m;
                        g = o.slice(m).match(/[^ ] {2,}| +[^ ]?/); if (!g || g[0].match(/^ +$/)) m = o.length;
                        else if (g[0][0] != " ") m += g.index + 1;
                        else { m += g.index + g[0].length - 1;
                            g[0][g[0].length - 1] != " " && --m }
                        y() } else { if (m < o.length) {++m;
                            y() } }
                else if (g.which ==
                    123) return true;
                else if (g.which == 36) d.position(0);
                else if (g.which == 35) d.position(o.length);
                else if (g.ctrlKey || g.metaKey)
                    if (g.shiftKey) { if (g.which == 84) return true } else { if (!g.altKey)
                            if (g.which == 65) d.position(0);
                            else if (g.which == 69) d.position(o.length);
                        else if (g.which == 88 || g.which == 67 || g.which == 87 || g.which == 84) return true;
                        else if (g.which == 86) { f(); return true } else if (g.which == 75)
                            if (m === 0) d.set("");
                            else m != o.length && d.set(o.slice(0, m));
                        else if (g.which == 17) return true }
                else if (g.altKey) g.which == 68 && d.set(o.slice(0,
                    m) + o.slice(m).replace(/[^ ]+ |[^ ]+$/, ""), true);
                else return true;
                return false
            }
        });
        return d
    };
    var M = [];
    h.jrpc = function(a, c, f, d, j, q) { c = h.json_stringify({ jsonrpc: "2.0", method: f, params: d, id: c }); return h.ajax({ url: a, data: c, success: j, error: q, contentType: "application/json", dataType: "json", beforeSend: function(u) { M.push(u) }, async: true, cache: false, type: "POST" }) };
    K = / {13}$/;
    var ba = [
            ["jQuery Terminal", "(c) 2011 jcubic"],
            ["JQuery Terminal Emulator v. 0.3.6", "Copyright (c) 2011 Jakub Jankiewicz <http://jcubic.pl>".replace(/ *<.*>/,
                "")],
            ["JQuery Terminal Emulator version version 0.3.6", "Copyright (c) 2011 Jakub Jankiewicz <http://jcubic.pl>"],
            ["      _______                 ________                        __", "     / / _  /_ ____________ _/__  ___/______________  _____  / /", " __ / / // / // / _  / _/ // / / / _  / _/     / /  \\/ / _ \\/ /", "/  / / // / // / ___/ // // / / / ___/ // / / / / /\\  / // / /__", "\\___/____ \\\\__/____/_/ \\__ / /_/____/_//_/ /_/ /_/  \\/\\__\\_\\___/", "         \\/          /____/                                   ".replace(K,
                "") + "version 0.3.6", "Copyright (c) 2011 Jakub Jankiewicz <http://jcubic.pl>"],
            ["      __ _____                     ________                              __", "     / // _  /__ __ _____ ___ __ _/__  ___/__ ___ ______ __ __  __ ___  / /", " __ / // // // // // _  // _// // / / // _  // _//     // //  \\/ // _ \\/ /", "/  / // // // // // ___// / / // / / // ___// / / / / // // /\\  // // / /__", "\\___//____ \\\\___//____//_/ _\\_  / /_//____//_/ /_/ /_//_//_/ /_/ \\__\\_\\___/", "          \\/              /____/                                          ".replace(K,
                "") + "version 0.3.6", "Copyright (c) 2011 Jakub Jankiewicz <http://jcubic.pl>"]
        ],
        I = new function(a) { var c = a ? [a] : [],
                f = 0;
            h.extend(this, { rotate: function() { if (c.length == 1) return c[0];
                    else { if (f == c.length - 1) f = 0;
                        else ++f; return c[f] } }, length: function() { return c.length }, set: function(d) { for (var j = c.length; j--;)
                        if (c[j] === d) { f = j; return }
                    this.append(d) }, front: function() { return c[f] }, append: function(d) { c.push(d) } }) };
    M = [];
    h.fn.terminal = function(a, c) {
        function f() {
            var b = h("<span>x</span>").appendTo(e),
                i = Math.floor(e.width() /
                    b.width());
            b.remove();
            return i
        }

        function d(b, i) { if (typeof b == "string") e.error("&#91;" + i + "&#93;: " + b);
            else { e.error("&#91;" + i + "&#93;: " + b.fileName + ": " + b.message);
                e.pause();
                h.get(b.fileName, function(k) { e.resume(); var n = b.lineNumber - 1;
                    e.error("&#91;" + b.lineNumber + "&#93;: " + k.split("\n")[n]) }) } }

        function j(b, i) { try { if (typeof i == "function") i(function() {});
                else if (typeof i != "string") throw b + " must be string or function"; } catch (k) { d(k, b.toUpperCase()); return false } return true }

        function q() {
            var b = e.prop ? e.prop("scrollHeight") :
                e.attr("scrollHeight");
            e.scrollTop(b)
        }

        function u(b) { b = typeof b == "string" ? b : String(b); var i; if (b.length > r) { b = b.split("\n");
                i = h("<div></div>"); for (var k = b.length, n = 0; n < k; ++n)
                    if (b[n] === "" || b[n] == "\r") i.append("<div>&nbsp;</div>");
                    else if (b[n].length > r) { var s = P(b[n], r);
                    h.each(s, function(v, t) { h("<div/>").html(z(t)).appendTo(i) }) } else h("<div/>").html(z(b[n])).appendTo(i) } else i = h("<div/>").html(z(b));
            H.append(i);
            i.width("100%");
            q(); return i }

        function C(b, i) {
            var k = 1,
                n = function(s, v) {
                    i.pause();
                    h.jrpc(b, k++,
                        s, v,
                        function(t) { if (t.error) i.error("&#91;RPC&#93; " + t.error.message);
                            else if (typeof t.result == "string") i.echo(t.result);
                            else if (t.result instanceof Array) i.echo(t.result.join(" "));
                            else if (typeof t.result == "object") { var B = "",
                                    G; for (G in t.result)
                                    if (t.result.hasOwnProperty(G)) B += G + ": " + t.result[G] + "\n";
                                i.echo(B) }
                            i.resume() },
                        function(t, B) { i.error("&#91;AJAX&#93; " + B + " - Server reponse is: \n" + t.responseText);
                            i.resume() })
                };
            return function(s, v) {
                if (s !== "") {
                    var t, B;
                    if (s.match(/[^ ]* /)) {
                        s = s.split(/ +/);
                        t = s[0];
                        B = s.slice(1)
                    } else { t = s;
                        B = [] }
                    if (!l.login || t == "help") n(t, B);
                    else { var G = v.token();
                        G ? n(t, [G].concat(B)) : v.error("&#91;AUTH&#93; Access denied (no token)") }
                }
            }
        }

        function o(b) { var i = p.prompt(); if (p.mask()) b = b.replace(/./g, "*");
            typeof i == "function" ? i(function(k) { e.echo(k + " " + b) }) : e.echo(i + " " + b) }

        function m(b) {
            try { var i = x.top(); if (b == "exit" && l.exit)
                    if (x.size() == 1) l.login ? E() : e.echo("You can exit from main interpeter");
                    else e.pop("exit");
                else { o(b);
                    b == "clear" && l.clear ? e.clear() : i.eval(b, e) } } catch (k) {
                d(k,
                    "USER");
                throw k;
            }
        }

        function D() { var b = null;
            p.prompt("login:");
            l.history && p.history().disable();
            p.commands(function(i) { try { o(i); if (b) { p.mask(false);
                        e.pause();
                        l.login(b, i, function(n) { if (n) { var s = l.name;
                                s = s ? "_" + s : "";
                                h.Storage.set("token" + s, n);
                                h.Storage.set("login" + s, b);
                                p.commands(m);
                                A() } else { e.error("Wrong password try again");
                                p.prompt("login:");
                                b = null }
                            e.resume();
                            l.history && p.history().enable() }) } else { b = i;
                        p.prompt("password:");
                        p.mask(true) } } catch (k) { d(k, "LOGIN", e); throw k; } }) }

        function E() {
            var b = l.name;
            b = b ? "_" + b : "";
            h.Storage.remove("token" + b, null);
            h.Storage.remove("login" + b, null);
            l.history && p.history().disable();
            D()
        }

        function L() { var b = x.top(),
                i = ""; if (b.name !== w && b.name !== "") i += b.name + "_";
            i += g;
            p.name(i);
            p.prompt(b.prompt);
            l.history && p.history().enable();
            p.set(""); if (typeof b.onStart == "function") b.onStart(e) }

        function A() { L(); if (c.greetings === w) e.echo(e.signature);
            else c.greetings && e.echo(c.greetings); if (typeof l.onInit == "function") l.onInit(e) }

        function N(b) {
            if (l.keypress && l.keypress(b, e) === false) return false;
            if (e.paused()) { if (b.which == 100 && b.ctrlKey) { for (b = M.length; b--;) { var i = M[b]; if (4 != i.readyState) try { i.abort() } catch (k) { e.error("error in aborting ajax") } }
                    e.resume(); return false } } else if (b.which == 100 && b.ctrlKey) { if (l.exit && p.get() === "")
                    if (x.size() > 1 || l.login !== w) e.pop("");
                    else { e.resume();
                        e.echo("") }
                return false } else if (b.which == 118 && b.ctrlKey) { e.oneTime(1, function() { q() }); return true } else if (b.keyCode == 9 && b.ctrlKey) e.focus(false);
            else if (b.keyCode == 34) e.scroll(e.height());
            else b.keyCode == 33 ? e.scroll(-e.height()) :
                e.attr({ scrollTop: e.attr("scrollHeight") })
        }
        var e = this,
            y = [],
            H, g = I.length(),
            r, l = { name: null, prompt: ">", history: true, exit: true, clear: true, enabled: true, login: null, onInit: null, onExit: null, keypress: null, keydown: null };
        if (c) { c.width && e.width(c.width);
            c.height && e.height(c.height);
            h.extend(l, c) }
        var F = !l.enabled;
        if (e.length === 0) throw 'Sorry, but terminal said that "' + e.selector + '" is not valid selector';
        if (e.data("terminal")) { e.ajaxSend(function(b, i) { M.push(i) }); return e.data("terminal") }
        H = h("<div>").addClass("terminal-output").appendTo(e);
        e.addClass("terminal").append("<div/>");
        h.extend(e, {
            clear: function() { H.html("");
                p.set("");
                y = [];
                e.attr({ scrollTop: 0 }); return e },
            paused: function() { return F },
            pause: function() { if (p) { e.disable();
                    p.hide() } return e },
            resume: function() { if (p) { e.enable();
                    p.show();
                    q() } return e },
            cols: function() { return r },
            rows: function() { return y.length },
            history: function() { return p.history().data() },
            next: function() {
                if (I.length() == 1) return e;
                else {
                    var b = e.offset().top;
                    e.height();
                    e.scrollTop();
                    var i = e,
                        k = h(window).scrollTop(),
                        n = k +
                        h(window).height(),
                        s = h(i).offset().top;
                    if (s + h(i).height() >= k && s <= n) { I.front().disable();
                        b = I.rotate().enable();
                        i = b.offset().top - 50;
                        h("html,body").animate({ scrollTop: i }, 500); return b } else { e.enable();
                        h("html,body").animate({ scrollTop: b - 50 }, 500); return e }
                }
            },
            focus: function(b) { e.oneTime(1, function() { if (I.length() == 1) b === false ? e.disable() : e.enable();
                    else if (b === false) e.next();
                    else { I.front().disable();
                        I.set(e);
                        e.enable() } }); return e },
            enable: function() { r === w && e.resize(); if (F)
                    if (p) { p.enable();
                        F = false }
                return e },
            disable: function() { if (p) { F = true;
                    p.disable() } return e },
            enabled: function() { return F },
            signature: function() { var b = e.cols();
                b = b < 15 ? null : b < 35 ? 0 : b < 55 ? 1 : b < 64 ? 2 : b < 75 ? 3 : 4; return b !== null ? ba[b].join("\n") + "\n" : "" },
            get_command: function() { return p.get() },
            insert: function(b) { p.insert(b); return e },
            set_prompt: function(b) { j("prompt", b) && p.prompt(b); return e },
            set_command: function(b) { p.set(b); return e },
            set_mask: function(b) { p.mask(b); return e },
            get_output: function() {
                return h.map(y, function(b, i) {
                    return typeof i == "function" ?
                        i() : i
                }).get().join("\n")
            },
            resize: function(b, i) { if (b && i) { e.width(b);
                    e.height(i) }
                r = f();
                p.resize(r); var k = H.detach();
                H.html("");
                h.each(y, function(n, s) { u(typeof s == "function" ? s() : s) });
                e.prepend(k);
                q(); return e },
            echo: function(b) { y.push(b); return u(typeof b == "function" ? b() : b) },
            error: function(b) { e.echo(b).addClass("error") },
            scroll: function(b) {
                if (e.prop) { b > e.prop("scrollTop") && b > 0 && e.prop("scrollTop", 0); var i = e.prop("scrollTop");
                    e.prop("scrollTop", i + b) } else {
                    b > e.attr("scrollTop") && b > 0 && e.attr("scrollTop",
                        0);
                    i = e.attr("scrollTop");
                    e.attr("scrollTop", i + b)
                }
                return e
            },
            logout: l.login ? function() { for (; x.size() > 1;) x.pop();
                E(); return e } : function() { throw "You don't have login function"; },
            token: l.login ? function() { var b = l.name; return h.Storage.get("token" + (b ? "_" + b : "")) } : null,
            login_name: l.login ? function() { var b = l.name; return h.Storage.get("login_" + (b ? "_" + b : "")) } : null,
            name: function() { return l.name },
            push: function(b, i) {
                if (!i.prompt || j("prompt", i.prompt)) {
                    if (typeof b == "string") b = C(i.eval, e);
                    x.push(h.extend({ eval: b },
                        i));
                    L()
                }
                return e
            },
            pop: function(b) { b !== w && o(b); if (x.top().name === l.name) { if (l.login) { E(); if (typeof l.onExit == "function") l.onExit(e) } } else { b = x.pop();
                    L(); if (typeof b.onExit == "function") b.onExit(e) } return e }
        });
        var J;
        switch (typeof a) {
            case "string":
                J = a;
                a = C(a, e); break;
            case "object":
                a = function(b) { return function(i) { if (i != "") { i = i.split(/ */); var k = i[0];
                            i = i.slice(1); var n = b[k];
                            typeof n == "function" ? n.apply(e, i) : e.echo("Command '" + k + "' Not Found") } } }(a) }
        if (J && typeof l.login == "string" || J) l.login = function(b) {
            var i =
                1;
            return function(k, n, s) { e.pause();
                h.jrpc(J, i++, b, [k, n], function(v) { e.resume();!v.error && v.result ? s(v.result) : s(null) }, function(v, t) { e.resume();
                    e.error("&#91;AJAX&#92; Response: " + t + "\n" + v.responseText) }) }
        }(typeof l.login == "boolean" ? "login" : l.login);
        if (j("prompt", l.prompt)) {
            var x = new Z({ name: l.name, eval: a, prompt: l.prompt, greetings: l.greetings }),
                p = e.find(".terminal-output").next().cmd({
                    prompt: l.prompt,
                    history: l.history,
                    width: "100%",
                    keydown: l.keydown ? function(b) { return l.keydown(b, e) } : null,
                    keypress: N,
                    commands: m
                });
            e.livequery(function() { e.resize() });
            I.append(e);
            l.enabled === true ? e.focus() : e.disable();
            h(window).resize(e.resize);
            e.click(function() { e.focus() });
            e.token && !e.token() && e.login_name && !e.login_name() ? D() : A();
            typeof h.fn.init.prototype.mousewheel === "function" && e.mousewheel(function(b, i) { i > 0 ? e.scroll(-40) : e.scroll(40); return false }, true)
        }
        e.data("terminal", e);
        return e
    }
})(jQuery);