var doc = document,
    body = doc.body,
    head = doc.getElementsByTagName("HEAD").item(0),
    win = window
;

/**
 *  @function normalizeSpace
 *  @static
 *  @description Replaces multiple whitespace characters with a single space character
 *  @param str {string}
 *  @return {string}
 */
function normalizeSpace(str) {
    return str.replace(/\s\s+/g, " ");
}

/**
 *  @function clearBrowserSelection
 *  @static
 *  @description cancels the browser's native selection
 */
function clearBrowserSelection() {
    if (win.getSelection){
        win.getSelection().removeAllRanges();
    }
    else
    if (doc.selection) {
        doc.selection.clear();
    }
}

/**
 *  @function isUnd
 *  @static
 *  @description returns true if the argument is undefined, false otherwise.
 *  @param val
 *  @return {boolean} true if val is undefined, false otherwise
 */
function isUnd(val){
    return typeof(val)==="undefined";
}

/**
 *  @function isStr
 *  @static
 *  @description returns true if the argument is a string, false otherwise.
 *  @param val
 *  @return {boolean} true if val is a string, false otherwise
 */
function isStr(v){
    return typeof(v)==="string";
}

function isObj(v){
    return typeof(v)==="object" && (v!==null);
}

function isFunc(v){
    return typeof(v)==="function";
}

function isArr(v){
    return isObj(v) && v.constructor===Array;
}

function isNum(v){
    return typeof(v)==="number";
}

function toInt(v){
    return parseInt(v, 10);
}

function isInt(v){
    return isNum(v) && (v===toInt(v));
}

function isEl(e) {
    return isObj(e) && e.nodeType===1;
}

/**
 *  @function forPinO
 *  @static
 *  @description Iterate over properties in object and call a callback
 *  @param o {object} Object to iterate
 *  @param f {function} callback {boolean} function(property, value). If callback returns false, iteration aborts.
 *  @param s {object} (optional) scope for calling the callback.
 *  @return false if the callback returned false and iteration was aborted, true otherwise.
 */
function forPinO(o, f, s){
    if (isUnd(s)) s = null;
    for (var p in o) if (o.hasOwnProperty(p)) if(f.call(s, p, o[p])===false) return false;
    return true;
}

/**
 *  @function forIinA
 *  @static
 *  @description Iterate over elements in an Array and call a callback
 *  @param a {array} Array to iterate
 *  @param f {function} callback {boolean} function(index, element). If callback returns false, iteration aborts.
 *  @param s {object} (optional) scope for calling the callback.
 *  @return false if the callback returned false and iteration was aborted, true otherwise.
 */
function forIinA(a, f, s){
    var i, n = a.length;
    if (isUnd(s)) s = null;
    for (i = 0; i < n; i++) if(f.call(s, i, a[i])===false) return false;
    return true;
}

/**
 *  @function del
 *  @static
 *  @description Delete specified properties from the argument object, or all properties if none specified. Properties are specified as a variable number of string arguments after the initial object argument.
 *  @param o {object} The object to delete properties from
 */
function del(o){
    var i, p, n = arguments.length;
    if (n === 1) {
        for (p in o) if (o.hasOwnProperty(p)) delete o[p];
    }
    else {
        for (i = 1; i < n; i++) if (o.hasOwnProperty(p = arguments[i])) delete o[p];
    }
}

/**
 *  @function position
 *  @static
 *  @description Get the absolute coordinaes of the first argument element. If a second argument element is specified, Coordinates are relative to that second argument element.
 *  @param el1 {DOMElement|string} Element to get the coordinates from.
 *  @param el2 {DOMElement|string} (optional) Element to compute relative coordinates of e1 from.
 *  @return {object} An object with members left and top representing e1's coordinates.
 */
function position(e1, e2){
    var left = 0, top = 0;
    e1 = el(e1);
    do {
        left += e1.offsetLeft;
        top += e1.offsetTop;
    } while (e1 = e1.offsetParent);

    if (e2) {
        var pos = position(e2);
        left -= pos.left;
        top -= pos.top;
    }

    return {
        left: left,
        top: top
    };
}

/**
 *  @function el
 *  @description Get the DOM element specified by the argument. If the argument is a string, get the element with that id. If the argument is already an element, return the element.
 *  @param {string} id The id of the element to retrieve.
 *  @return {DOMelement} the DOM element.
 */
function el(id) {
    var e;
    if (isStr(id)) e = doc.getElementById(id);
    else
    if (isEl(id)) e = id;
    return e;
}

/**
 *  @function tag
 *  @static
 *  @description Get the first DomElement with the specified tag name either from the document or from the specified DomElement
 *  @param name {string} The tagname for which to retrieve a DOMElement
 *  @param node {node} (optional) The node where to start searching for elements.
 *  @return {DOMElement} the element with the specified tagname
 */
function tag(name, node){
    if (isUnd(node)) node = doc;
    else node = el(node);
    return node.getElementsByTagName(name).item(0);
}

/**
 *  @function txt
 *  @static
 *  @description Get the text content of the specified DOMElement
 *  @param el {DOMElement} the element to get the text from.
 *  @return {string} The text inside the specified element.
 */
function txt(el){
    //on first call, we examine the properies of the argument element
    //to try and find a native (and presumably optimized) method to grab
    //the text value of the element.
    //We then overwrite the original _getElementText
    //to use the optimized one in any subsequent calls
    var func;
    if (!isUnd(el.innerText)) {         //ie
        func = function(el){
            return el.innerText;
        };
    }
    else
    if (!isUnd(el.textContent)) {       //ff, chrome
        func = function(el){
            return el.textContent;
        };
    }
    else
    if (!isUnd(el.nodeTypedValue)) {    //ie8
        func = function(el){
            return el.nodeTypedValue;
        };
    }
    else
    if (el.normalize){
        func = function(el) {
            el.normalize();
            if (el.firstChild){
                return el.firstChild.data;
            }
            else {
                return null;
            }
        }
    }
    else {                      //generic
        func = function(el) {
            var text = [], childNode,
                childNodes = el.childNodes, i,
                numChildNodes = childNodes.length
            ;
            for (i=0; i<numChildNodes; i += 1){
                childNode = childNodes.item(i);
                if (childNode.data!==null) {
                    text.push(childNode.data);
                }
            }
            return text.length ? text.join("") : null;
        }
    }
    txt = func;
    return func(el);
};

function escXML(txt) {
    return txt
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
    ;
}

function hasClass(e, cls){
    return new RegExp("\\b" + cls + "\\b", "g").test(el(e).className);
}

function getClasses(e){
    var e = el(e),
        classes = e.className.split(" "),
        ret = {}
    ;
    forIinA(classes, function(i, cls){
        if (cls !== "") ret[cls] = cls;
    })
    return ret;
}

function addOrRemoveClasses(e, classes, addRemove) {
    if (isArr(e)) {
        forIinA(e, function(i,v){
            addOrRemoveClasses(v, classes, addRemove);
        });
    }
    else {
        e = el(e);
        var s = "", c, cls = getClasses(e);
        if (isStr(classes)) classes = classes.split(" ");
        if (isArr(classes)){
            var cc = {};
            forIinA(classes, function(i,v){
                cc[v] = v;
            });
            classes = cc;
        }
        merge(cls, classes, addRemove);
        forPinO(cls, function(c,o){
            s += c + " ";
        });
        e.className = s;
    }
}

function addClasses(e, classes){
    addOrRemoveClasses(e, classes);
}

function addClass(e, classes){
    addOrRemoveClasses(e, classes);
}

function removeClasses(e, classes){
    addOrRemoveClasses(e, classes, merge.DELETE);
}

function removeClass(e, classes){
    removeClasses(e, classes);
}

function replaceClass(e, class1, class2) {
    e.className = e.className.replace(new RegExp("\\b" + class1 + "\\b", "g"), class2);
}

function sAtts(e, atts){
    e = el(e);
    var name, val;
    for (name in atts) {
        val = atts[name];
        if (isArr(val)) {
            val = val.join(" ");
        }
        else
        if (isObj(val)) {
            if (name==="style"){
                var p, s = "";
                for (p in val) {
                    s += p + ": " + val[p] + ";";
                }
                val = s;
            }
            else {
                val = val.toString();
            }
        }
        e.setAttribute(name, val);
    }
}

function sAtt(e, a, v){
    el(e).setAttribute(a, v);
}

function gAtt(e, a){
    return el(e).getAttribute(a);
}

function rAtt(e, a){
    el(e).removeAttribute(a);
}

function hAtt(e, a){
    return el(e).hasAttribute(a);
}

function cAtts(source, target) {
    var i, atts, att, n, name;
    atts = target.attributes;
    n = atts.length;
    for (i = 0; i < n; i++) {
        name = atts[i].nodeName;
        if (!hAtt(source, name)) rAtt(target, name);
    }
    atts = source.attributes;
    n = atts.length;
    for (i = 0; i < n; i++) {
        att = atts[i];
        name = att.nodeName;
        sAtt(target, name, att.value);
    }
};

function chs(e, chs) {
    var m;
    e = el(e);
    if (!isArr(chs)) chs = [chs];
    for (var i=0, n=chs.length, c; i<n; i++){
        c = chs[i];
        if (isStr(c)) c = doc.createTextNode(c);
        e.appendChild(c);
    }
}

function crEl(tag, atts, ch, p){
    var el = doc.createElement(tag);
    if (atts) sAtts(el, atts);
    if (ch) chs(el, ch);
    if (p) chs(p, el);
    return el;
}

function merge(dst, src, mode){
    var p,v;
    if (!(mode = toInt(mode))) mode = merge.MERGE;
    if (!isObj(dst)) dst = {};
    forPinO(src, function(p, o){
        if (((o===null) && (mode & merge.DELETE_IF_NULL)) || (mode & merge.DELETE)) delete dst[p];
        else
        if (isUnd(dst[p]) || (mode & merge.OVERWRITE)) dst[p] = o;
    });
    return dst;
}

merge.MERGE = 0;
merge.OVERWRITE = 1;
merge.DELETE_IF_NULL = 2;
merge.DELETE = 4;

function numGroups(regexp) {
    if (regexp instanceof RegExp) regexp = regexp.source;
    regexp = regexp.replace(/\\\(/g, "");
    return regexp.length - regexp.replace(/\(/g, "").length;
}
/***************************************************************
*
*   Event
*
***************************************************************/
var Event;
(Event = function(e) {
    if (!e) e = win.event;
    this.browserEvent = e;
    return this;
}).prototype = {
    getTarget: function(){
        var browserEvent = this.browserEvent;
        if (browserEvent.target) target = browserEvent.target;
        else
        if (browserEvent.srcElement) target = browserEvent.srcElement
        else
        target = null;
        return target;
    },
    getButton: function(){
        if (doc.addEventListener) return this.browserEvent.button;
        else
        if (doc.attachEvent) {
            switch (this.browserEvent.button) {
                case 1: return 0;
                case 2: return 2;
                case 4: return 1;
            }
        }
        return null;
    },
    getKeyCode: function(){
        return this.browserEvent.keyCode;
    },
    getShiftKey: function(){
        return this.browserEvent.shiftKey;
    },
    getCtrlKey: function(){
        return this.browserEvent.ctrlKey;
    },
    getXY: function(){
        return {
            x: this.browserEvent.clientX,
            y: this.browserEvent.clientY
        }
    },
    preventDefault: function() {
        this.browserEvent.preventDefault();
    },
    save: function(){
        var proto = Event.prototype, savedEvent = new Event.Saved(), property;
        for (property in proto) {
            if (property.indexOf("get")===0 && isFunc(proto[property])) {
                savedEvent[
                    property.substr(3,1).toLowerCase() + property.substr(4)
                ] = this[property]();
            }
        }
        return savedEvent;
    }
};

(Event.Saved = function() {
}).prototype = {
    destroy: function(){
        for (var p in this) {
            if (this.hasOwnProperty(p)){
                delete this.p;
            }
        }
    }
};

for (property in Event.prototype) {
    if (property.indexOf("get")===0 && isFunc(Event.prototype[property])) {
        Event.Saved.prototype[property] = new Function(
            "return this." + property.substr(3,1).toLowerCase() + property.substr(4) + ";"
        )
    }
}

var GlobalEvent = new Event(null);

Event.get = function(e) {
    if (!e) e = win.event;
    GlobalEvent.browserEvent = e;
    return GlobalEvent;
};

function listen(node, type, listener, scope) {
    if (!scope) scope = null;
    if (node.addEventListener) {
        node.addEventListener(type, function(e){
            listener.call(scope, Event.get(e));
        }, true);
    }
    else
    if (node.attachEvent){
        node.attachEvent("on" + type, function(){
            listener.call(scope, Event.get(win.event));
        });
    }
}

/***************************************************************
*
*   Observable
*
***************************************************************/
var Observable;
(Observable = function() {
}).prototype = {
    listen: function(type, method, scope, context) {
        var listeners, handlers, scope;
        if (!(listeners = this.listeners)) listeners = this.listeners = {};
        if (!(handlers = listeners[type])) handlers = listeners[type] = [];
        scope = (scope ? scope : win);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    },
    fireEvent: function(type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) return;
        if (!(handlers = listeners[type])) return;
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (!isUnd(context) && context !== handler.context) continue;
            if (handler.method.call(handler.scope, this, type, data) === false) return false;
        }
        return true;
    }
};

/***************************************************************
*
*   DDHandler
*
***************************************************************/
var DDHandler;
(DDHandler = function (config) {
    config = merge(config, {
        node: doc.body
    });
    var me = this;
    me.listeners = [];
    me.endDragListeners = null;
    me.whileDragListeners = null;
    me.node = (node = el(config.node));
    me.mousedown = false;
    me.initdrag = false;
    if (config.dragProxy!==false) {
        me.dragProxy = el(config.dragProxy);
        if (!me.dragProxy) {
            me.dragProxy = crEl("DIV", {
                id: isStr(config.dragProxy) ? config.dragProxy : ""
            }, null, node);
        }
    }
    if (config.dropProxy!==false) {
        me.dropProxy = el(config.dropProxy);
        if (!me.dropProxy) {
            me.dropProxy = crEl("DIV", {
                id: isStr(config.dropProxy) ? config.dropProxy : ""
            }, null, node);
        }
    }
    me.startDragEvent = null;
    listen(this.node, "mousedown", function(e){
        me.event = e;
        if (e.getButton()===0) {
            me.handleMouseDown(e);
        }
    }, this);
    listen(this.node, "mouseup", function(e){
        me.event = e;
        if (e.getButton()===0) {
            me.handleMouseUp(e);
        }
    }, this);
    listen(this.node, "mousemove", function(e){
        me.event = e;
        me.handleMouseMove(e);
    }, this);
}).prototype = {
    listen: function(listener){
        if (!listener.scope) {
            listener.scope = win;
        }
        this.listeners.push(listener);
    },
    handleMouseDown: function(e) {
        var me = this;
        me.mousedown = true;
        if (!me.initdrag) {
            me.initdrag = true;
            me.startDrag(e);
        }
    },
    handleMouseUp: function(e){
        var me = this;
        if (me.mousedown) {
            if (me.initdrag) {
                me.initdrag = false;
                me.endDrag(e);
            }
            me.mousedown = false;
        }
    },
    handleMouseMove: function(e) {
        var me = this;
        if (me.mousedown) {
            if (!me.initdrag) {
                me.initdrag = true;
                me.startDrag(e);
            }
            else {
                me.whileDrag(e);
            }
        }
    },
    startDrag: function(e) {
        var me = this;
        me.endDragListeners = [];
        me.whileDragListeners = [];
        me.startDragEvent = e.save();
        forIinA(me.listeners, function(i, a){
            //check all listeners if they are interested
            //in this particular drag event
            if (a.startDrag.call(a.scope, e, me)) {
                //this listener is interested, so we now save the
                //corresponding listeners for
                //the remaining phases of the DnD event
                if (isFunc(a.endDrag)) {
                    me.endDragListeners.push(a);
                }
                if (isFunc(a.whileDrag)) {
                    me.whileDragListeners.push(a);
                }
            }
        });
    },
    endDrag: function(e) {
        var me = this;
        if (me.startDragEvent) {
            forIinA(me.endDragListeners, function(i, a){
                a.endDrag.call(a.scope, e, me);
            });
            me.startDragEvent.destroy();
            me.startDragEvent = null;
        }
        me.endDragListeners = null;
        me.whileDragListeners = null;
    },
    whileDrag: function(e) {
        var me = this;
        if (me.startDragEvent) {
            clearBrowserSelection();
            forIinA(me.whileDragListeners, function(i, a){
                a.whileDrag.call(a.scope, e, me);
            });
        }
    }
};

var KBHandler;
(KBHandler = function (config) {
    this.config = config;
}).prototype = merge({
    render: function() {
        var me = this,
            config = me.config,
            container = el(config.container),
            textArea = crEl("TEXTAREA", {
                style: {
                    position: "absolute",
                    height: "0px",
                    width: "0px",
                    top: "0px",
                    left: "0px",
                    "z-index": -1
                }
            }, null, container);
        me.textArea = textArea;
        listen(textArea, "keydown", function(e) {
            me.fireEvent("keydown", e);
        });
        listen(textArea, "keyup", function(e) {
            me.fireEvent("keyup", e);
        });
        listen(textArea, "keypress", function(e) {
            me.fireEvent("keypress", e);
        });
    },
    focus: function() {
        if (this.fireEvent("focus") !== false) this.textArea.focus();
        else return false;
    }
}, Observable.prototype);
