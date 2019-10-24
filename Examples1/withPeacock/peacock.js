//     Peacock.js 1.0.0

(function(){

var booleanAttrs = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "compact", "controls", "declare",
        "default", "defaultchecked", "defaultmuted", "defaultselected", "defer", "disabled", "draggable",
        "enabled", "formnovalidate", "hidden", "indeterminate", "inert", "ismap", "itemscope", "loop", "multiple",
        "muted", "nohref", "noresize", "noshade", "novalidate", "nowrap", "open", "pauseonexit", "readonly",
        "required", "reversed", "scoped", "seamless", "selected", "sortable", "spellcheck", "translate",
        "truespeed", "typemustmatch", "visible"];
    var xlinkNS = 'http://www.w3.org/1999/xlink';
    var xmlNS = 'http://www.w3.org/XML/1998/namespace';
    var colonChar = 58;
    var xChar = 120;
    var booleanAttrsDict = Object.create(null);
    for (var i = 0, len = booleanAttrs.length; i < len; i++) {
        booleanAttrsDict[booleanAttrs[i]] = true;
    }
    function updateAttrs(oldVnode, vnode) {
        var key, elm = vnode.elm, oldAttrs = oldVnode.data.attrs, attrs = vnode.data.attrs;
        if (!oldAttrs && !attrs)
            return;
        if (oldAttrs === attrs)
            return;
        oldAttrs = oldAttrs || {};
        attrs = attrs || {};
        for (key in attrs) {
            if(key && typeof key !== 'undefined'){
                var key = key.replace(/[|&;$%@"<>()+,]/g, "");
                var cur = attrs[key];
                var old = oldAttrs[key];
                if (old !== cur) {
                    if (booleanAttrsDict[key]) {
                        if (cur) {
                            elm.setAttribute(key, "");
                        }
                        else {
                            elm.removeAttribute(key);
                        }
                    }
                    else {
                        if (key.charCodeAt(0) !== xChar) {
                            elm.setAttribute(key, cur);
                        }
                        else if (key.charCodeAt(3) === colonChar) {
                            // Assume xml namespace
                            elm.setAttributeNS(xmlNS, key, cur);
                        }
                        else if (key.charCodeAt(5) === colonChar) {
                            // Assume xlink namespace
                            elm.setAttributeNS(xlinkNS, key, cur);
                        }
                        else {
                            elm.setAttribute(key, cur);
                        }
                    }
                }
            }
        }

        for (key in oldAttrs) {
            if (!(key in attrs)) {
                elm.removeAttribute(key);
            }
        }
    }
    var pk_attributes = { create: updateAttrs, update: updateAttrs };


     function updateClass(oldVnode, vnode) {
            var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
            if (!oldClass && !klass)
                return;
            if (oldClass === klass)
                return;
            oldClass = oldClass || {};
            klass = klass || {};
            for (name in oldClass) {
                if (!klass[name]) {
                    elm.classList.remove(name);
                }
            }
            for (name in klass) {
                cur = klass[name];
                if (cur !== oldClass[name]) {
                    elm.classList[cur ? 'add' : 'remove'](name);
                }
            }
        }
    var pk_class = { create: updateClass, update: updateClass };




        var CAPS_REGEX = /[A-Z]/g;
        function updateDataset(oldVnode, vnode) {
            var elm = vnode.elm, oldDataset = oldVnode.data.dataset, dataset = vnode.data.dataset, key;
            if (!oldDataset && !dataset)
                return;
            if (oldDataset === dataset)
                return;
            oldDataset = oldDataset || {};
            dataset = dataset || {};
            var d = elm.dataset;
            for (key in oldDataset) {
                if (!dataset[key]) {
                    if (d) {
                        if (key in d) {
                            delete d[key];
                        }
                    }
                    else {
                        elm.removeAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase());
                    }
                }
            }
            for (key in dataset) {
                if (oldDataset[key] !== dataset[key]) {
                    if (d) {
                        d[key] = dataset[key];
                    }
                    else {
                        elm.setAttribute('data-' + key.replace(CAPS_REGEX, '-$&').toLowerCase(), dataset[key]);
                    }
                }
            }
        }
    var pk_dataset = { create: updateDataset, update: updateDataset };
        

     function updateProps(oldVnode, vnode) {
            var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
            if (!oldProps && !props)
                return;
            if (oldProps === props)
                return;
            oldProps = oldProps || {};
            props = props || {};
            for (key in oldProps) {
                if (!props[key]) {
                    delete elm[key];
                }
            }
            for (key in props) {
                cur = props[key];
                old = oldProps[key];
                if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
                    elm[key] = cur;
                }
            }
        }
    var pk_props = { create: updateProps, update: updateProps };




    var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
        var nextFrame = function (fn) { raf(function () { raf(fn); }); };
        function setNextFrame(obj, prop, val) {
            nextFrame(function () { obj[prop] = val; });
        }
        function updateStyle(oldVnode, vnode) {
            var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
            if (!oldStyle && !style)
                return;
            if (oldStyle === style)
                return;
            oldStyle = oldStyle || {};
            style = style || {};
            var oldHasDel = 'delayed' in oldStyle;
            for (name in oldStyle) {
                if (!style[name]) {
                    if (name[0] === '-' && name[1] === '-') {
                        elm.style.removeProperty(name);
                    }
                    else {
                        elm.style[name] = '';
                    }
                }
            }
            for (name in style) {
                cur = style[name];
                if (name === 'delayed' && style.delayed) {
                    for (var name2 in style.delayed) {
                        cur = style.delayed[name2];
                        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                            setNextFrame(elm.style, name2, cur);
                        }
                    }
                }
                else if (name !== 'remove' && cur !== oldStyle[name]) {
                    if (name[0] === '-' && name[1] === '-') {
                        elm.style.setProperty(name, cur);
                    }
                    else {
                        elm.style[name] = cur;
                    }
                }
            }
        }
        function applyDestroyStyle(vnode) {
            var style, name, elm = vnode.elm, s = vnode.data.style;
            if (!s || !(style = s.destroy))
                return;
            for (name in style) {
                elm.style[name] = style[name];
            }
        }
        function applyRemoveStyle(vnode, rm) {
            var s = vnode.data.style;
            if (!s || !s.remove) {
                rm();
                return;
            }
            var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
            for (name in style) {
                applied.push(name);
                elm.style[name] = style[name];
            }
            compStyle = getComputedStyle(elm);
            var props = compStyle['transition-property'].split(', ');
            for (; i < props.length; ++i) {
                if (applied.indexOf(props[i]) !== -1)
                    amount++;
            }
            elm.addEventListener('transitionend', function (ev) {
                if (ev.target === elm)
                    --amount;
                if (amount === 0)
                    rm();
            });
        }
    var pk_style = {
            create: updateStyle,
            update: updateStyle,
            destroy: applyDestroyStyle,
            remove: applyRemoveStyle
        };
        
        
    function vnode(sel, data, children, text, elm) {
        var key = data === undefined ? undefined : data.key;
        return { sel: sel, data: data, children: children,
            text: text, elm: elm, key: key };
    }

    var is = {};
    is.primitive = function (s) {
        return typeof s === 'string' || typeof s === 'number';
    }
    is.array = function (s) {
        return Array.isArray(s);
    }

    function addNS(data, children, sel) {
        data.ns = 'http://www.w3.org/2000/svg';
        if (sel !== 'foreignObject' && children !== undefined) {
            for (var i = 0; i < children.length; ++i) {
                var childData = children[i].data;
                if (childData !== undefined) {
                    addNS(childData, children[i].children, children[i].sel);
                }
            }
        }
    }


function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (is.array(c)) {
            children = c;
        }
        else if (is.primitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (is.array(b)) {
            children = b;
        }
        else if (is.primitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (children !== undefined) {
        for (i = 0; i < children.length; ++i) {
            if (is.primitive(children[i]))
                children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}

function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
var emptyNode = vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
    return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];


function pkinit(modules, domApi) {
    var i, j, cbs = {};
    //var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode(tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = parentNode(childElm);
                removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode, insertedVnodeQueue) {
        var i, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode);
                data = vnode.data;
            }
        }
        var children = vnode.children, sel = vnode.sel;
        if (sel === '!') {
            if (isUndef(vnode.text)) {
                vnode.text = '';
            }
            vnode.elm = createComment(vnode.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode.elm = isDef(data) && isDef(i = data.ns) ? createElementNS(i, tag)
                : createElement(tag);
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode);
            if (is.array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (is.primitive(vnode.text)) {
                appendChild(elm, createTextNode(vnode.text));
            }
            i = vnode.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode);
                if (i.insert)
                    insertedVnodeQueue.push(vnode);
            }
        }
        else {
            vnode.elm = createTextNode(vnode.text);
        }
        return vnode.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode) {
        var i, j, data = vnode.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode);
            if (vnode.children !== undefined) {
                for (j = 0; j < vnode.children.length; ++j) {
                    i = vnode.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                insertBefore(parentElm, oldStartVnode.elm, nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx > oldEndIdx) {
            before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
            addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
        }
        else if (newStartIdx > newEndIdx) {
            removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
        }
    }
    function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode);
        }
        var elm = vnode.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode.children;
        if (oldVnode === vnode)
            return;
        if (vnode.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode);
            i = vnode.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode);
        }
        if (isUndef(vnode.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode.text) {
            setTextContent(elm, vnode.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode);
        }
    }
    return function patch(oldVnode, vnode) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode)) {
            patchVnode(oldVnode, vnode, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = parentNode(elm);
            createElm(vnode, insertedVnodeQueue);
            if (parent !== null) {
                insertBefore(parent, vnode.elm, nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode;
    };
}


function copyToThunk(vnode, thunk) {
    thunk.elm = vnode.elm;
    vnode.data.fn = thunk.data.fn;
    vnode.data.args = thunk.data.args;
    thunk.data = vnode.data;
    thunk.children = vnode.children;
    thunk.text = vnode.text;
    thunk.elm = vnode.elm;
}
function init(thunk) {
    var cur = thunk.data;
    var vnode = cur.fn.apply(undefined, cur.args);
    copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
    var i, old = oldVnode.data, cur = thunk.data;
    var oldArgs = old.args, args = cur.args;
    if (old.fn !== cur.fn || oldArgs.length !== args.length) {
        copyToThunk(cur.fn.apply(undefined, args), thunk);
        return;
    }
    for (i = 0; i < args.length; ++i) {
        if (oldArgs[i] !== args[i]) {
            copyToThunk(cur.fn.apply(undefined, args), thunk);
            return;
        }
    }
    copyToThunk(oldVnode, thunk);
}


function thunk(sel, key, fn, args) {
    if (args === undefined) {
        args = fn;
        fn = key;
        key = undefined;
    }
    return h_1.h(sel, {
        key: key,
        hook: { init: init, prepatch: prepatch },
        fn: fn,
        args: args
    });
};


function toVNode(node, domApi) {
    //var api = domApi !== undefined ? domApi : htmldomapi_1.default;
    var text;
    if (isElement(node)) {
        var id = node.id ? '#' + node.id : '';
        var cn = node.getAttribute('class');
        var c = cn ? '.' + cn.split(' ').join('.') : '';
        var sel = tagName(node).toLowerCase() + id + c;
        var attrs = {};
        var children = [];
        var name_1;
        var i = void 0, n = void 0;
        var elmAttrs = node.attributes;
        var elmChildren = node.childNodes;
        for (i = 0, n = elmAttrs.length; i < n; i++) {
            name_1 = elmAttrs[i].nodeName;
            if (name_1 !== 'id' && name_1 !== 'class') {
                attrs[name_1] = elmAttrs[i].nodeValue;
            }
        }
        for (i = 0, n = elmChildren.length; i < n; i++) {
            children.push(toVNode(elmChildren[i]));
        }
        return vnode(sel, { attrs: attrs }, children, undefined, node);
    }
    else if (isText(node)) {
        text = getTextContent(node);
        return vnode(undefined, undefined, undefined, text, node);
    }
    else if (isComment(node)) {
        text = getTextContent(node);
        return vnode('!', {}, [], text, node);
    }
    else {
        return vnode('', {}, [], undefined, undefined);
    }
}



var domParser = new DOMParser();
var patch = pkinit([
        pk_attributes,
        pk_class,
        pk_dataset,
        pk_props,
        pk_style
    ]);
var View = _.isUndefined(Backbone.NativeView) ? Backbone.View : Backbone.NativeView;



function parseHTMLToDOM(html_str) {
    
    if (typeof html_str !== 'string') {
      throw new Error('Invalid parameter type in parseHTMLToDOM');
    }

    if (!('DOMParser' in window)) {
      throw new Error('DOMParser is not available, ' + 'so parsing string to DOM node is not possible.');
    }

    if (!html_str) {
      return document.createTextNode('');
    }

    domParser = domParser || new DOMParser();
    var doc = domParser.parseFromString(html_str, 'text/html'); // most tags default to body

    if (doc.body) {
      return doc.getElementsByTagName('body')[0]; // some tags, like script and style, default to head
    } else if (doc.head.firstChild && (doc.head.firstChild.tagName !== 'TITLE' || doc.title)) {
      return doc.head.firstChild; // special case for html comment, cdata, doctype
    } else if (doc.firstChild && doc.firstChild.tagName !== 'HTML') {
      return doc.firstChild; // other element, such as whitespace, or html/body/head tag, fallback to empty text node
    } else {
      return document.createTextNode('');
    }
  }


  Backbone.PKView = Backbone.View.extend({
    updateEventListeners: function(old_vnode, new_vnode) {
      this.setElement(new_vnode.elm);
    },
    render: function(data) {
      if (_.isFunction(this.beforeRender)) {
        this.beforeRender();
      }

      var new_vnode;

      if (!_.isNull(this.pkRender)) {
          if(typeof data === 'undefined'){
            new_vnode = toVNode(parseHTMLToDOM(this.pkRender()));
          }else{
            new_vnode = toVNode(parseHTMLToDOM(this.pkRender(data)));
          }
      } else {
        new_vnode = toVNode(this.toDOM());
      }

      new_vnode.data.hook = _.extend({
        create: this.updateEventListeners.bind(this),
        update: this.updateEventListeners.bind(this)
      });
      var el = this.vnode ? this.vnode.elm : this.el;

      if (el.outerHTML !== new_vnode.elm.outerHTML) {
        this.vnode = patch(this.vnode || this.el, new_vnode);
      }

      if (_.isFunction(this.afterRender)) {
        this.afterRender();
      }

      return this;
    }
  });

  
})();