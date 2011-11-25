(function(){

var doc = document,
    body = doc.body,
    head = doc.getElementsByTagName("head").item(0),
    win = window
;

function clearBrowserSelection() {
    if (win.getSelection){
        win.getSelection().removeAllRanges();
    }
    else
    if (doc.selection) {
        doc.selection.clear();
    }    
}

function isUnd(val){
    return typeof(val)==="undefined";
}

function isStr(val){
    return typeof(val)==="string";
}

function isObj(val){
    return typeof(val)==="object" && (val!==null);
}

function isFunc(val){
    return typeof(val)==="function";
}

function isArr(val){
    return val.constructor===Array;
}

function isEl(el) {
    return isObj(el) && el.nodeType===1;
}

function forPinO(o, f, scope){
    if (isUnd(scope)){
        scope = win;
    }
    for (var p in o){
        if (o.hasOwnProperty(p)){
            if(f.call(scope, p, o[p])===false){
                return;
            }
        }
    }
}

function forIinA(a, f, scope){
    if (isUnd(scope)){
        scope = win;
    }
    for (var i=0, l=a.length; i<l; i++){
        if(f.call(scope, i, a[i])===false){
            return;
        }
    }
}

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

function el(id) {
    var e;
    if (isStr(id)) {
        e = doc.getElementById(id);
    }
    else 
    if (isEl(id)) {
        e = id;
    }
    return e;
}

function tag(name, node){
    if (isUnd(node)){
        node = doc;
    }
    else {
        node = el(node);
    }
    return node.getElementsByTagName(name).item(0);
}

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
        if (cls!=="") {
            ret[cls] = cls;
        }
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
        if (isStr(classes)) {
            classes = classes.split(" ");
        }
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
    addOrRemoveClasses(e, classes, MERGE_MODE_DELETE);
}

function removeClass(e, classes){
    removeClasses(e, classes);
}

function _sAtts(e, atts){
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

function _gAtt(e, att){
    return el(e).getAttribute(att);
}

function _sAtt(e, att, val){
    el(e).setAttribute(att, val);
}

function _chs(e, chs) {
    var m;
    e = el(e);
    if (!isArr(chs)){
        chs = [chs];
    }
    for (var i=0, n=chs.length, c; i<n; i++){
        c = chs[i];
        if (isStr(c)) {
            c = doc.createTextNode(c);
        }
        e.appendChild(c);
    }
}

function _crEl(tag, atts, chs, p){
    var el = doc.createElement(tag);
    if (atts) {
        _sAtts(el, atts);
    }
    if (chs) {
        _chs(el, chs);
    }
    if (p) {
        _chs(p, el)
    }
    return el;
}

var MERGE_MODE_MERGE = 0,
    MERGE_MODE_OVERWRITE = 1,
    MERGE_MODE_DELETE_IF_NULL = 2,
    MERGE_MODE_DELETE = 4
;

function merge(dst, src, mode){
    var p,v;
    mode = parseInt(mode, 10);
    mode = mode ? mode : 0;
    if (isUnd(dst)) {
        dst = {};
    }
    forPinO(src, function(p, o){
        if (((o===null) && (mode & MERGE_MODE_DELETE_IF_NULL)) || (mode & MERGE_MODE_DELETE)) {
            delete dst[p];
        }
        else 
        if (isUnd(dst[p]) || (mode&MERGE_MODE_OVERWRITE)) {
            dst[p] = o;
        }
    });
    return dst;
}

/***************************************************************
*   
*   Event
*
***************************************************************/
var Event = function(e) {
    if (!e) {
        e = win.event;
    }
    this.browserEvent = e;
    return this;
}

Event.prototype = {    
    getTarget: function(){ 
        var browserEvent = this.browserEvent;
        if (browserEvent.target) {
            target = browserEvent.target;
        }
        else 
        if (browserEvent.srcElement) {
            target = browserEvent.srcElement
        }
        else {
            target = null;
        }
        return target;
    },
    getButton: function(){
        if (doc.addEventListener) {
            return this.browserEvent.button;
        }
        else
        if (doc.attachEvent) {
            switch (this.browserEvent.button) {
                case 1: 
                    return 0;
                case 2:
                    return 2;
                case 4:
                    return 1;
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

Event.Saved = function() {
};

Event.Saved.prototype = {
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
    if (!e) {
        e = win.event;
    }
    GlobalEvent.browserEvent = e;
    return GlobalEvent;
};

function listen(node, type, listener, scope) {
    if (!scope) {
        scope = win;
    }
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
var Observable = function() {
};

Observable.prototype = {
    listen: function(type, method, scope) {
        var listeners, handlers;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        handlers.push({
            method: method,
            scope: (scope ? scope : win)
        });
    },
    fireEvent: function(type, data) {
        var listeners, handlers, i, n, handler;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (handler.method.call(
                handler.scope, this, type, data
            )===false) {
                return false;
            }
        }
        return true;
    }
};

/***************************************************************
*   
*   DDHandler
*
***************************************************************/
var DDHandler = function (config) {
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
            me.dragProxy = _crEl("DIV", {
                id: isStr(config.dragProxy) ? config.dragProxy : ""
            }, null, node);
        }
    }
    if (config.dropProxy!==false) {
        me.dropProxy = el(config.dropProxy);
        if (!me.dropProxy) {
            me.dropProxy = _crEl("DIV", {
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
};

DDHandler.prototype = {
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

var KBHandler = function (config) {
    this.config = config;
}; 

KBHandler.prototype = {
    render: function() {
        var me = this,
            config = me.config,
            container = el(config.container),
            textArea = _crEl("TEXTAREA", {
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
        this.textArea.focus();
    }
};

merge(KBHandler.prototype, Observable.prototype);

/***************************************************************
*   
*   wxl
*
***************************************************************/

win["wxl"] = {};

/***************************************************************
*   
*   Stylesheet
*
***************************************************************/
win["wxl"]["StyleSheet"] = function(config){
    this.config = config = merge(config, {
        enabled: true,
        rules: {}
    });
    if (config.id){ 
        this.style = el(config.id);
        if (this.style!==null) {
            //todo: load the rules
        }
    }
};

wxl.StyleSheet.prototype = {
    render: function(){
        var me = this, 
            config = me.config
        ;
        me.style = _crEl("STYLE", {
            type: "text/css",
            id: config.id
        }, null, head);
        if (config.rules) {
            me.addRules(config.rules);
        }
    },
    enable: function(enabled){
        this.config.enabled = enabled;
        if (this.style) {
            this.style.disabled = !enabled;
        }
    },
    getRule: function(selector){ 
        var ruleset = this.getRuleSet(), rule = null;
        selector = selector.toUpperCase();
        forIinA(ruleset, function(i, r){
            if (r.selectorText.toUpperCase()===selector) {
                rule = r;
                return false;
            }
        });
        return rule;
    },
    getStyle: function(selector) {
        var rule;
        if (rule = this.getRule(selector)) {
            return rule.style;
        }
        return null;
    },
    unApplyStyle: function(selector, style){
        var s = this.getStyle(selector);
        if (s === null) {
            return;
        }
        merge(s, style, MERGE_MODE_DELETE);
    },
    applyStyle: function(selector, style, create){
        var r = this.getRule(selector);
        if (r === null) {
            if (create!==false) {
                this.addRule(selector, style);
            }
            return;
        }
        merge(r.style, style, MERGE_MODE_OVERWRITE);
        
    },
    getCssText: function(properties) {
        var property, value, cssText = "";
        for (property in properties){
            if (properties.hasOwnProperty(property)) {
                value = properties[property];
                if (value===null){
                    continue;
                }
                if (cssText!==""){
                    cssText += ";";
                }
                cssText += "\n" + property + ": " + value;
            }
        }
        return cssText;
    },
    addRule: function(selector, properties){
        var stylesheet, styles, property, value, index;
        if (arguments.length===1) {
            properties = selector.properties;
            selector = selector.selector;
        }
        if (isStr(properties)) {
            styles = properties;
        }
        else if (isObj(properties)) {
            styles = this.getCssText(properties);
        }        
        if (stylesheet = this.style.styleSheet) {   //IE
            index = stylesheet.addRule.call(stylesheet, selector, styles);
        }
        else 
        if (stylesheet = this.style.sheet) {        
            if (stylesheet.addRule) {               //chrome
                index = stylesheet.addRule.call(stylesheet, selector, styles);
            }
            else 
            if (stylesheet.insertRule) {            //opera, firefox
                index = stylesheet.insertRule.call(
                    stylesheet, 
                    selector + "{" + styles + "}", 
                    stylesheet.cssRules.length
                );
            }
        }
        else {
            throw "No stylesheet";
        }
    },
    addRules: function(rules){
        if (isObj(rules)){
            if (isArr(rules)){
                var i, numRules = rules.length, rule;
                for (i=0; i<numRules; i++){
                    rule = rules[i];
                    this.addRule(rule.selector, rule.styles);
                }
            }
            else {
                for (selector in rules){
                    if (rules.hasOwnProperty(selector)) {
                        this.addRule(selector, rules[selector]);
                    }
                }
            }
        }
        return true;
    },
    getRuleSet: function(){
        if (!this.style) {
            return null;
        }
        var sheet = this.style.sheet || this.style.styleSheet;
        return sheet.rules || sheet.cssRules;
    },    
    getRules: function(selector){
        var r = {};
        if (isStr(selector)){
            selector = [selector];
        }
        else 
        if (isArr(selector)){
            
        }
        else 
        if (isObj(selector)){
            
        }
        return r;
    }
};

/***************************************************************
*   
*   Range
*
***************************************************************/
win["wxl"]["Range"] = function(config){
    this.config = config;
};

wxl.Range.prototype = {
    each: function(callback, scope) {
        var config = this.config,
            start = config.start,
            end = config.end,
            rowIndex = start.row, 
            lastRowIndex = end.row,
            colIndex, 
            lastColIndex = end.col,
            rows = config.spreadsheet.getRows(), 
            row, cell
        ;
        if (!scope) {
            scope = win;
        }
        for (; rowIndex <= lastRowIndex; rowIndex++) {
            row = rows.item(rowIndex);
            colIndex = start.col;
            for (; colIndex <= lastColIndex; colIndex++) {
                cell = row.cells.item(colIndex);
                callback.call(scope, cell);
            }            
        }
    },
    allRows: function(){
        return  this.start.row===1 &&
                this.end.row === this.config.spreadsheet.numRows
        ;
    },
    allCols: function(){
        return  this.start.col===1 &&
                this.end.col === this.config.spreadsheet.numCols
        ;
    }
};

/***************************************************************
*   
*   DataGrid
*
***************************************************************/
win["wxl"]["DataGrid"] = function(config){
    var me = this;
    me.config = config = merge(config, {
        firstDisplayCol: 1,
        firstDisplayRow: 1
    });
    me.numRows = Math.max(config.lastRow, config.numDisplayRows);
    me.numCols = Math.max(config.lastCol, config.numDisplayCols);
    me.firstDisplayCol = config.firstDisplayCol ? config.firstDisplayCol : 1;
    me.firstDisplayRow = config.firstDisplayRow ? config.firstDisplayRow : 1;
    me.selection = [];
    me.stylesheet = new wxl.StyleSheet({
        id: config.id + "-style"
    });
    me.render();
};

wxl.DataGrid.getColumnHeaderName = function(num){
    var r,h="";
    do {
        r = num % 26;
        num = (num - r) / 26;
        h = String.fromCharCode(r + 65) + h;
    } while (num-- > 0);
    return h;
};

wxl.DataGrid.getColumnIndex = function(address) {
    var i, n = address.length-1, col = 0;
    for (i=n; i >= 0; i--) {
        col += (address.charCodeAt(i) - 64);
    }
    return col;
}

wxl.DataGrid.getCellName = function(td){
    return  wxl.DataGrid.getColumnHeaderName(td.cellIndex-1) + 
            td.parentNode.rowIndex
    ;
}

wxl.DataGrid.prototype = {
    render: function(){
        var me = this,
            config = me.config,
            table = "", row = "", thead = "", tbody = "",
            firstDisplayCol = config.firstDisplayCol,
            firstDisplayRow = config.firstDisplayRow,
            lastDisplayCol = firstDisplayCol + me.config.numDisplayCols -1,
            lastDisplayRow = firstDisplayRow + me.config.numDisplayRows -1,
            container = (this.container = el(config.div)),
            id = container.id,
            stylePrefix1 = "\n#" + id + " > TABLE > * > TR",
            stylePrefix2 = "",
            styles = {},
            className,
            i, n
        ;
        addClass(container, "wxl_spreadsheet")
        stylePrefix2 = stylePrefix1 + " > ."
        for (i=0, n = me.numCols; i <= n; i++) {
            className = "c" + i;
            thead += "<th class=\"" + className + "\" scope=\"col\">";
            thead += 
                "<div class=\"wxl_header wxl_column_header\">" + 
                    (i ? "<span>" + wxl.DataGrid.getColumnHeaderName(i-1) + "</span>" + 
                         "<div class=\"wxl_resize wxl_resize_horizontal\"></div>": ""
                    ) + 
                "</div>"
            ;
            thead += "</th>";
            if (i) {
                row += "<td class=\"" + className + "\" ><div></div></td>";
                //add style rules to hide cells outside the display range
                if (i>lastDisplayCol){
                    styles[stylePrefix2 + className] = {
                        display: "none"
                    };
                }
            }
        }
        tagName = "tr";
        row += "</tr>";
        stylePrefix1 += ".";
        for (i=1, n = me.numRows; i <= n; i++) {
            className = "r" + i;
            tbody += 
                "<tr class=\"" + className + "\">" +
                "<th class=\"th\" scope=\"row\" >" +
                    "<div class=\"wxl_header wxl_row_header\">" +
                        "<span>" + i + "</span>" + 
                        "<div class=\"wxl_resize wxl_resize_vertical\"></div>" + 
                    "</div>" +
                "</th>" + row
            ;
            //add style rules to hide cells outside the display range
            if (i>lastDisplayRow) {
                styles[stylePrefix1 + className] = {
                    display: "none"
                };
            }
        }
        container.innerHTML = 
            "<table cellspacing=\"0\" cellpadding=\"0\" class=\"wxl_spreadsheet\" id=\"wxl_" + id + "\">" +
                "<thead><tr class=\"r0\">" + thead + "</tr></thead>" +
                "<tbody>" + tbody + "</tbody>" +
            "</table>"
        ;
        me.table = tag("table", container);
        me.stylesheet.render();
        me.stylesheet.addRules(styles);
        me.initDnD();
        me.initResizing();
        me.initMoving();
        return;
    },
    getKBHandler: function() {
        var me = this,
            kbHandler = this.kbHandler
        ;
        if (!kbHandler) {
            kbHandler = this.kbHandler = new KBHandler({
                container: me.container
            });
            kbHandler.render();    
        }
        listen(me.table, "click", this.clickHandler, me);
        return kbHandler;
    },
    initListeners: function() {
        listen(this.table, "click", this.clickHandler, this);
        listen(doc, "keydown", this.keydownHandler, this);
    },
    initDnD: function() {
        this.ddHandler = new DDHandler({
            node: this.container
        });
    },
    initResizing: function() {
        var table = this.table;
        this.ddHandler.listen({
            scope: this,
            startDrag: function(event, ddHandler){
                var target = event.getTarget();
                if (target.tagName==="DIV" && hasClass(target, "wxl_resize")) {
                    var pos = event.getXY(), 
                        tabPos = position(table), 
                        cls,
                        startDragEvent = ddHandler.startDragEvent,
                        dragProxy = ddHandler.dragProxy,
                        dragProxyStyle = dragProxy.style 
                    ;
                    dragProxy.className = "";
                    if (hasClass(target, "wxl_resize_vertical")) {
                        pos.y += target.clientHeight;
                        dragProxyStyle.width = table.clientWidth + "px";;
                        dragProxyStyle.height = "1px";
                        dragProxyStyle.top = (startDragEvent.top = (pos.y - tabPos.top)) + "px";
                        dragProxyStyle.left = "0px";
                        cls = "wxl_resizer_vertical";
                    }
                    else
                    if (hasClass(target, "wxl_resize_horizontal")) {
                        pos.x += target.clientWidth;
                        dragProxyStyle.width = "1px";
                        dragProxyStyle.height = table.clientHeight + "px";
                        dragProxyStyle.left = (startDragEvent.left = (pos.x - tabPos.left)) + "px";
                        dragProxyStyle.top = "0px";
                        cls = "wxl_resizer_horizontal";
                    }
                    startDragEvent.cls = cls;
                    addClasses(dragProxy,  ["wxl_resizer", cls]);
                    return true;
                }
                return false;
            },
            endDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    startDragEvent = ddHandler.startDragEvent,
                    target = startDragEvent.target,
                    targetParent = target.parentNode,
                    startPos = startDragEvent.getXY(),
                    pos = event.getXY(),
                    clientDim, newDim, minDim
                ;
                dragProxy.className = "";
                if (hasClass(target, "wxl_resize_vertical")) {
                    clientDim = targetParent.clientHeight;
                    newDim = clientDim + (pos.y - startPos.y);
                    minDim = target.clientHeight;
                    targetParent.style.height = (newDim >= minDim ? newDim : minDim) + "px";
                }
                else
                if (hasClass(target, "wxl_resize_horizontal")) {
                    clientDim = targetParent.clientWidth;
                    newDim = clientDim + (pos.x - startPos.x);
                    minDim = target.clientWidth;
                    targetParent.style.width = (newDim >= minDim ? newDim : minDim) + "px";
                }
                this.kbHandler.focus();
            },
            whileDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    startDragEvent = ddHandler.startDragEvent,
                    startXY = startDragEvent.getXY(),
                    xy = event.getXY()
                ;
                switch (startDragEvent.cls) {
                    case "wxl_resizer_vertical":
                        dragProxy.style.top = (startDragEvent.top + (xy.y - startXY.y)) + "px";
                        break;
                    case "wxl_resizer_horizontal":
                        dragProxy.style.left = (startDragEvent.left + (xy.x - startXY.x)) + "px";
                        break;
                }
            }
        });
    },
    moveRow: function(sourceIndex, targetIndex) {
        if (targetIndex===sourceIndex) return;

        var table = this.table,
            rows = table.rows, 
            sourceRow = rows.item(sourceIndex), sourceCell,
            sourceCells = sourceRow.cells,
            n = sourceCells.length, i, 
            targetRow, targetCell,
            activeCell = this.activeCell
        ;
        if (activeCell && activeCell.parentNode.rowIndex === sourceIndex) {
            activeCell = activeCell.cellIndex;
            this.setActiveCell(null);
        }
        targetRow = table.insertRow(targetIndex);
        targetRow.className = "r" + targetIndex;
        targetRow.appendChild(_crEl("th", {
            "class": "th",
            scope: "row"
        }, tag("DIV", sourceCells.item(0))));
        tag("SPAN", targetRow.cells.item(0)).innerHTML = targetIndex;
        for (i = 1; i<n; i++) {
            sourceCell = sourceCells.item(i);
            targetCell = targetRow.insertCell(i);
            targetCell.className = sourceCell.className;
            targetCell.appendChild(tag("DIV", sourceCell));
        }
        this.table.deleteRow(sourceRow.rowIndex);
        for (i = sourceIndex; i !== targetIndex; i += (sourceIndex < targetIndex ? 1 : -1)) {
            row = rows.item(i);
            row.className = "r" + i;
            tag("SPAN", row.cells.item(0)).innerHTML = i;
        }
        if (activeCell) {
            this.setActiveCell(targetRow.cells.item(activeCell));
        }
    },
    moveColumn: function(sourceIndex, targetIndex) {
        if (targetIndex===sourceIndex) return;
        var table = this.table,
            rows = table.rows,
            i, n = rows.length, row,
            sourceCell, targetCell,
            activeCell = this.activeCell
        ;
        if (activeCell && activeCell.cellIndex === sourceIndex) {
            activeCell = activeCell.parentNode.rowIndex;
            this.setActiveCell(null);
        }
        else {
            activeCell = null;
        }
        for (var i = 1; i < n; i++){
            row = rows.item(i);
            sourceCell = row.cells(sourceIndex);
            targetCell = row.insertCell(targetIndex);
            targetCell.appendChild(tag("DIV", sourceCell));
            row.deleteCell(sourceCell.cellIndex);
        }
        if (activeCell) {
            this.setActiveCell(rows.item(activeCell).cells.item(targetIndex));
        }
    },
    initMoving: function() {
        var container = this.container,
            table = this.table
        ;
        this.ddHandler.listen({
            scope: this,
            startDrag: function(event, ddHandler){
                var target = event.getTarget();
                if (target.tagName==="DIV" && hasClass(target, "wxl_header")) {
                    var dragProxy = ddHandler.dragProxy,
                        dragProxyStyle = dragProxy.style,
                        dropProxy = ddHandler.dropProxy,
                        dropProxyStyle = dropProxy.style,
                        parent = target.parentNode, 
                        pos = position(parent), 
                        tabPos = position(table), cls,
                        startDragEvent = ddHandler.startDragEvent,
                        offset, size
                    ;
                    pos.x = pos.left - tabPos.left;
                    pos.y = pos.top - tabPos.top;                    
                    dragProxy.className = "";
                    if (hasClass(target, "wxl_row_header")) {
                        offset = (pos.x + parent.clientWidth) + "px";
                        size = (table.clientWidth - parent.clientWidth) + "px";
                        
                        dragProxyStyle.width = size;
                        dragProxyStyle.left = offset;
                        dragProxyStyle.height = parent.clientHeight + "px";
                        dragProxyStyle.top =  (startDragEvent.top = pos.y) + "px";

                        cls = "wxl_row_mover";
                        dropProxyStyle.width = size;
                        dropProxyStyle.left = offset;
                        dropProxy.className = "wxl_row_drop";
                        dropProxyStyle.height = "3px";
                    }
                    else
                    if (hasClass(target, "wxl_column_header")) {
                        offset = (pos.y + parent.clientHeight) + "px";
                        size = (table.clientHeight - parent.clientHeight) + "px";
                        
                        dragProxyStyle.height = size;
                        dragProxyStyle.top = offset;
                        dragProxyStyle.width = parent.clientWidth + "px";
                        dragProxyStyle.left =  (startDragEvent.left = pos.x) + "px";
                        
                        cls = "wxl_column_mover";
                        dropProxyStyle.height = size;
                        dropProxyStyle.top = offset;
                        dropProxy.className = "wxl_column_drop";
                        dropProxyStyle.width = "3px";
                    }
                    startDragEvent.cls = cls;
                    addClasses(dragProxy, ["wxl_mover", cls]);
                    return true;
                }
                return false;
            },
            endDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    dragProxyStyle = dragProxy.style,
                    dropProxy = ddHandler.dropProxy,
                    dropProxyStyle = dropProxy.style,
                    startEvent = ddHandler.startDragEvent,
                    startTarget = startEvent.target,
                    targetPos,
                    target = event.getTarget(),
                    targetParent = target.parentNode,
                    targetIndex,
                    xy = event.getXY()
                ;
                switch(startEvent.cls){
                    case "wxl_row_mover":
                        if (target.tagName === "DIV" && hasClass(target, "wxl_row_header")) {
                            sourceIndex = startTarget.parentNode.parentNode.rowIndex;
                            targetIndex = targetParent.parentNode.rowIndex;
                            targetPos = position(targetParent);
                            if ((xy.y - targetPos.top) >= (targetParent.clientHeight/2)) {
                                targetIndex++;
                            }
                            this.moveRow(sourceIndex, targetIndex);
                        }
                        break;
                    case "wxl_column_mover":
                        if (target.tagName === "DIV" && hasClass(target, "wxl_column_header")) {
                            sourceIndex = startTarget.parentNode.cellIndex;
                            targetIndex = targetParent.cellIndex;
                            targetPos = position(targetParent);
                            if ((xy.x - targetPos.left) >= (targetParent.clientWidth/2)) {
                                targetIndex++;
                            }
                            this.moveColumn(sourceIndex, targetIndex);
                        }
                        break;
                }
                dragProxy.className = "";
                dropProxyStyle.display = "none";
                this.kbHandler.focus();
            },
            whileDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    dragProxyStyle = dragProxy.style,
                    dropProxy = ddHandler.dropProxy,
                    dropProxyStyle = dropProxy.style,
                    tabPos, targetPos,
                    startEvent = ddHandler.startDragEvent,
                    startTarget = startEvent.target,
                    startXY = startEvent.getXY(),
                    xy = event.getXY(),
                    target = event.getTarget(),
                    targetParent = target.parentNode
                ;
                switch(startEvent.cls){
                    case "wxl_row_mover":
                        dragProxyStyle.top = (startEvent.top + (xy.y - startXY.y)) + "px";
                        if (target.tagName === "DIV" && hasClass(target, "wxl_row_header")) {
                            targetPos = position(targetParent);
                            tabPos = position(table);
                            dropProxyStyle.display = "";
                            dropProxyStyle.top = (targetPos.top - tabPos.top) +
                                (((xy.y - targetPos.top) < (targetParent.clientHeight/2)) ? 0 : targetParent.clientHeight) + "px"
                            ;
                        }
                        else {
                            dropProxyStyle.display = "none";
                        }
                        break;
                    case "wxl_column_mover":
                        dragProxyStyle.left = (startEvent.left + (xy.x - startXY.x)) + "px";
                        if (target.tagName === "DIV" && hasClass(target, "wxl_column_header")) {
                            targetPos = position(targetParent);
                            tabPos = position(table);
                            dropProxyStyle.display = "";
                            dropProxyStyle.left = (targetPos.left - tabPos.left) +
                                (((xy.x - targetPos.left) < (targetParent.clientWidth/2)) ? 0 : targetParent.clientWidth) + "px"
                            ;
                        }
                        else {
                            dropProxyStyle.display = "none";
                        }
                        break;
                }
            }
        });
    },
    getColumnHeader: function(col){
        if (/[A-Z]+/.test(col)) {
            col = wxl.DataGrid.getColumnIndex(col);
        }
        return this.table.rows.item(0).cells.item(col);
    },
    getRowHeader: function(row) {
        return this.table.rows.item(row).cells.item(0);
    },
    createRange: function(startRow, startCol, endRow, endCol){
        return new wxl.Range({
            spreadsheet: this,
            start: {
                row: startRow,
                col: startCol
            },
            end: {
                row: endRow,
                col: endCol
            }
        });
    },
    clearSelection: function(){
        var range, re = / wxl_selected/g;
        while (this.selection.length){
            range = this.selection.shift();
            range.each(function(cell){
                removeClass(cell, "wxl_selected");
            });
        }
    },
    addToSelection: function(range) {
        var selected = " wxl_selected";
        range.each(function(cell){
            var className = cell.className;
            if (className.indexOf(selected)===-1){
                cell.className = className + selected;
            }
        });
        this.selection.push(range);
    },
    selectRow: function(index){
        this.addToSelection(this.createRange(index, 1, index, this.numCols));
    },
    selectColumn: function(index){
        this.addToSelection(this.createRange(1, index, this.numRows, index));
    },
    selectCell: function(td){
        this.addToSelection(this.createRange(
            td.parentNode.rowIndex, td.cellIndex, 
            td.parentNode.rowIndex, td.cellIndex
        ));
    },
    focus: function() {
        this.table.focus();
    },
    getActiveCell: function() {
        return this.activeCell;
    },
    setActiveCell: function(td){
        var activeCell;
        if (activeCell = this.activeCell) {
            if (this.fireEvent("beforecelldeactivated", activeCell)===false) {
                return;
            }
            removeClass([
                activeCell, 
                this.getColumnHeader(activeCell.cellIndex),
                this.getRowHeader(activeCell.parentNode.rowIndex)
            ], "wxl_active");
            this.fireEvent("celldeactivated", activeCell);
        }
        this.activeCell = td;
        if (td) {
            addClass([
                td, 
                this.getColumnHeader(td.cellIndex),
                this.getRowHeader(td.parentNode.rowIndex)
            ], "wxl_active");
            this.scrollIntoView(td);
            this.fireEvent("cellactivated", td);
        }
    },
    scrollIntoView: function(td) {
        var style = this.stylesheet,
            cellIndex = td.cellIndex,
            rowIndex = td.parentNode.rowIndex,
            len, inc, diff,
            config = this.config,
            numDisplayCols = config.numDisplayCols,
            firstDisplayCol = config.firstDisplayCol,
            lastDisplayCol = firstDisplayCol + numDisplayCols - 1,
            numDisplayRows = config.numDisplayRows,
            firstDisplayRow = config.firstDisplayRow,
            lastDisplayRow = firstDisplayRow + numDisplayRows - 1,
            id = this.container.id,
            stylePrefix1 = "#" + id + " > TABLE > * > TR"
        ;
        if (cellIndex < firstDisplayCol) {
            config.firstDisplayCol = cellIndex;
            len = firstDisplayCol;
            inc = 1;
        }
        else
        if (cellIndex > lastDisplayCol) {
            config.firstDisplayCol = cellIndex - numDisplayCols + 1;
            len = lastDisplayCol;
            inc = -1;
        }
        else {
            cellIndex = len;
        }
        diff = inc * numDisplayCols;
        for (; cellIndex != len; cellIndex += inc) {
            style.applyStyle(stylePrefix1 + " > .c" + cellIndex, {
                display: ""
            });
            style.applyStyle(stylePrefix1 + " > .c" + (cellIndex + diff), {
                display: "none"
            });
        }
        
        if (rowIndex < firstDisplayRow) {
            config.firstDisplayRow = rowIndex;
            len = firstDisplayRow;
            inc = 1;
        }
        else
        if (rowIndex > lastDisplayRow) {
            config.firstDisplayRow = rowIndex - numDisplayRows + 1;
            len = lastDisplayRow;
            inc = -1;
        }
        else {
            rowIndex = len;
        }
        diff = inc * numDisplayRows;
        for (; rowIndex != len; rowIndex += inc) {
            style.applyStyle(stylePrefix1 + ".r" + rowIndex, {
                display: ""
            });
            style.applyStyle(stylePrefix1 + ".r" + (rowIndex + diff), {
                display: "none"
            });
        }
    },
    getRows: function() {
        return this.table.rows;
    },
    getCellValue: function(cell) {
        return txt(tag("DIV", cell));
    },
    setCellValue: function(cell, value) {
        value = escXML(value);
        tag("DIV", cell).innerHTML = value;
    },
    clearCellValue: function(cell) {
        tag("DIV", cell).innerHTML = "";
    },
    startEditing: function(cell) {
        this.fireEvent("startediting", cell);
    },
    clickHandler: function(e) {
        var target = e.getTarget(), 
            className = target.className,
            parentNode
        ;
        this.kbHandler.focus();
        tagname: switch (target.tagName) { 
            case "SPAN":
                parentNode = target.parentNode;
                if (parentNode.tagName!=="DIV") {
                    break;
                }
                target = parentNode;
                className = target.className;
                //fall through
            case "DIV":
                switch (className) {
                    case "wxl_header wxl_column_header":
/*                    
                        if (!e.getCtrlKey()) {
                            this.clearSelection();
                        }
                        this.selectColumn(target.parentNode.cellIndex);
*/
                        break tagname;
                    case "wxl_header wxl_row_header":
/*
                        if (!e.getCtrlKey()) {
                            this.clearSelection();
                        }
                        this.selectRow(target.parentNode.parentNode.rowIndex);
*/
                        break tagname;
                    default: 
                        parentNode = target.parentNode;
                        if (parentNode.tagName==="TD") {
                            target = parentNode;
                        }
                        else {
                            break tagname;
                        }
                }
                //fall through
            case "TD":
                this.setActiveCell(target);
/*
                if (!e.getCtrlKey()) {
                    this.clearSelection();
                }
                this.selectCell(target);
*/
                break;
        }
    },
    keydownHandler: function(kbHandler, type, e) {
        var keyCode = e.getKeyCode(),
            shiftKey = e.getShiftKey()
        ;
        switch (keyCode) {
            case 9:     //tab
                e.preventDefault();
            case 13:    //newline
            case 33:    //page up
            case 34:    //page down
            case 35:    //end
            case 36:    //home
            case 37:    //left
            case 38:    //up
            case 39:    //right
            case 40:    //down
                this.moveToCell(keyCode, shiftKey);
                break;
            case 46:
                if (this.activeCell){
                    this.setCellValue(this.activeCell, ""); 
                }
                break;
            case 8:     //backspace
            case 16:    //shift
            case 17:    //ctrl
            case 18:    //alt
            case 27:    //esc
            case 112:   //F1
            case 113:   //F2
            case 114:   //F3
            case 115:   //F4
            case 116:   //F5
            case 117:   //F6
            case 118:   //F7
            case 119:   //F8
            case 120:   //F9
            case 121:   //F10
            case 122:   //F11
            case 123:   //F12
                break;
            default:
                if (this.activeCell) {
                    this.startEditing(this.activeCell);
                }
        }
        return false;
    },
    setDisplayDimensions: function(numRows, numCols){
    }
};

merge(wxl.DataGrid.prototype, Observable.prototype);

/***************************************************************
*   
*   CellEditor
*
***************************************************************/
window["wxl"]["CellEditor"] = function(config) {
    this.config = config = merge(config, {
    });    
    this.dataGrid = null;
    this.cell = null;
    this.init();
};

wxl.CellEditor.prototype = {
    init: function(){
        var dataGrid = this.config.dataGrid;
        dataGrid.listen("cellactivated", this.cellActivated, this);
        dataGrid.getKBHandler().listen("keydown", this.dataGridKeyDownHandler, this);
        this.render();
    },
    render: function() {
        var me = this,
            textarea = el(me.config.textarea)
        ;
        me.editing = false;
        textarea.className = "wxl_celleditor";
        listen(textarea, "keydown", me.keydownHandler, me);
        listen(textarea, "keyup", me.keyupHandler, me);
        listen(textarea, "focus", me.focusHandler, me);
        listen(textarea, "click", me.clickHandler, me);
        me.textarea = textarea;
    },
    focus: function(){
        this.textarea.focus();
    },
    setEnabled: function(enabled) {
        this.textarea.disabled = !enabled;
    },
    cellActivated: function(dataGrid, event, cell){
        this.textarea.value = dataGrid.getCellValue(cell);
    },
    isEditing: function() {
        return this.editing;
    },
    startEditing: function(dataGrid, event, cell) {
        addClass(this.textarea, "wxl_active");
        this.textarea.select();
        this.cell = cell;
        this.editing = true;
        if (event !== "focus" ) {
            this.focus();
        }
    },
    stopEditing: function() {
        removeClass(this.textarea, "wxl_active");
        this.editing = false;
        var dataGrid = this.config.dataGrid;
        if (dataGrid) {
            this.textarea.blur();
            dataGrid.focus();
        }
    },
    dataGridKeyDownHandler: function(kbHandler, type, event){
        var keyCode = event.getKeyCode();
        switch (keyCode) {
            case 9:     //tab
            case 13:    //newline
            case 33:    //page up
            case 34:    //page down
            case 35:    //end
            case 36:    //home
            case 37:    //left
            case 38:    //up
            case 39:    //right
            case 40:    //down
            case 8:     //backspace
            case 16:    //shift
            case 17:    //ctrl
            case 18:    //alt
            case 27:    //esc
            case 112:   //F1
            case 113:   //F2
            case 114:   //F3
            case 115:   //F4
            case 116:   //F5
            case 117:   //F6
            case 118:   //F7
            case 119:   //F8
            case 120:   //F9
            case 121:   //F10
            case 122:   //F11
            case 123:   //F12
                return;
        }
        var dataGrid = this.config.dataGrid,
            cell = dataGrid.activeCell
        if (cell) {
            if (keyCode === 46) {
                dataGrid.clearCellValue(cell);
            }
            else {
                this.startEditing(dataGrid, event, cell);
            }
            return false;
        }
    },
    keydownHandler: function(e) {
        var keyCode = e.getKeyCode();
        switch (keyCode) {
            case 9:     //tab
            case 13:    //newline
                e.preventDefault();
            case 33:    //page up
            case 34:    //page down
            case 35:    //end
            case 36:    //home
            case 37:    //left
            case 38:    //up
            case 39:    //right
            case 40:    //down
                var dataGrid = this.config.dataGrid;
                if ((keyCode===9 || keyCode===13) && dataGrid) {
                    if (this.isEditing()) {
                        this.stopEditing();
                        var kbHandler = dataGrid.getKBHandler();
                        kbHandler.focus();
                        kbHandler.fireEvent("keydown", e);
                    }
                }
                break;
        }
        return false;
    },
    keyupHandler: function(e) {
        var keyCode = e.getKeyCode();
        switch (keyCode) {
            case 9:     //tab
            case 13:    //newline
            case 33:    //page up
            case 34:    //page down
            case 35:    //end
            case 36:    //home
            case 37:    //left
            case 38:    //up
            case 39:    //right
            case 40:    //down
                e.preventDefault();
                break;
            default:
                var cell = this.cell;
                if (cell) {
                    this.config.dataGrid.setCellValue(cell, this.textarea.value);
                }
        }
        return false;
    },
    focusHandler: function(e) {
        if (this.spreadSheet && this.cell) {
            this.startEditing(this.spreadSheet, "focus", this.cell);
        }
    },
    clickHandler: function(e) {
        if (this.spreadSheet && this.cell) {
            this.focus();
        }
    }
};
/***************************************************************
*   
*   KeyboardNavigator
*
***************************************************************/
win["wxl"]["KeyboardNavigator"] = function(config) {
    this.config = config;
    this.init();
};

wxl.KeyboardNavigator.prototype = {
    init: function() {
        var me = this,
            dataGrid = me.config.dataGrid;
        dataGrid.getKBHandler().listen("keydown", me.moveToCell, me);
    },
    moveToCell: function(kbHandler, type, event){
        var dataGrid = this.config.dataGrid,
            cell = dataGrid.activeCell
        ;
        if (!cell) return;
        var cellIndex = cell.cellIndex,
            row = cell.parentNode,
            rowIndex = row.rowIndex,
            rows = row.parentNode.parentNode.rows
        ;
        switch (event.getKeyCode()) {
            case 9:    //right
                event.preventDefault(); 
                if (event.getShiftKey()) {
                    if (--cellIndex === 0){
                        cellIndex = row.cells.length-1;
                        rowIndex--;
                    }
                }
                else {
                    if (++cellIndex === row.cells.length){
                        cellIndex = 1;
                        rowIndex++;
                    }
                }
                break;
            case 13:    //right                
                rowIndex += event.getShiftKey() ? -1 : 1;
                break;
            case 33:    //page up
                rowIndex = rowIndex - (rowIndex > dataGrid.config.numDisplayRows ? dataGrid.config.numDisplayRows : rowIndex) + 1;
                break;
            case 34:    //page down
                rowIndex = rowIndex + (dataGrid.numRows - rowIndex > dataGrid.config.numDisplayRows ? dataGrid.config.numDisplayRows : dataGrid.numRows - rowIndex) - 1;
                break;
            case 35:    //end
                cellIndex = row.cells.length-1;
                break;
            case 36:    //home
                cellIndex = 1;
                break;
            case 37:    //left
                cellIndex--;
                break;
            case 39:    //right
                cellIndex++;
                break;
            case 38:    //up                
                rowIndex--;
                break;
            case 40:    //down
                rowIndex++;
                break;
            default:
                return;
        }
        if (!cellIndex || !rowIndex) {
            return;
        }
        row = rows.item(rowIndex);
        if (!row) {
            return;
        }
        cell = row.cells.item(cellIndex);
        if (!cell){
            return;
        }
        dataGrid.setActiveCell(cell);
        return false;
    },
};

/***************************************************************
*   
*   CellNavigator
*
***************************************************************/

win["wxl"]["CellNavigator"] = function(config) {
    this.config = config = merge(config, {
    }); 
    this.init();
};

wxl.CellNavigator.prototype = {
    init: function(){
        var dataGrid = this.config.dataGrid;
        dataGrid.listen("cellactivated", this.cellActivated, this);
        this.render();
    },
    render: function() {
        var me = this,
            input = el(me.config.input)
        ;
        input.size = 8;
        input.className = "wxl_cellnavigator";
        listen(input, "change", this.changeHandler, this);
        listen(input, "focus", this.focusHandler, this);
        this.input = input;
    },
    cellActivated: function(spreadSheet, event, cell){
        this.input.value = wxl.DataGrid.getCellName(cell);
    },
    changeHandler: function() {
    },
    focusHandler: function() {
        this.input.select();
    }
}

/***************************************************************
*   
*   Application
*
***************************************************************/
win["wxl"]["SpreadSheet"] = function(config) {
    this.config = merge(config, {
        id: body,
        numDisplayRows: 50,
        numDisplayCols: 50,
        lastRow: 50,
        lastCol: 50,
    });
    this.render();
};

wxl.SpreadSheet.prototype = {
    render: function() {
        var config = this.config,
            container = el(config.id),
            cellNavigator = "wxl_navigator", 
            cellEditor = "wxl_editor", 
            dataGrid = "wxl_datagrid"
        ;
        _chs(container, [
            _crEl(
                "DIV", {
                "class": "wxl_toolbar",
            }, _crEl("DIV")),
            _crEl("DIV", {
                "class": "wxl_toolbar",
            }, _crEl("DIV", null, [
                _crEl("INPUT", {
                    id: cellNavigator
                }),
                _crEl("TEXTAREA", {
                    id: cellEditor
                }),
            ])),
            _crEl("DIV", {
                id: dataGrid,
                style: {
                    top: "60px",
                    left: "0px"
                }
            })
        ]);
        dataGrid = new wxl.DataGrid(merge({
            div: dataGrid
        }, this.config));
        cellEditor = new wxl.CellEditor({
            dataGrid: dataGrid,
            textarea: cellEditor
        });
        cellNavigator = new wxl.CellNavigator({
            dataGrid: dataGrid,
            input: cellNavigator
        });
        keyboardNavigator = new wxl.KeyboardNavigator({
            dataGrid: dataGrid
        });
    }
};
 
})();
