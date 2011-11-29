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

function isNum(val){
    return typeof(val)==="number";
}

function isInt(val){
    return isNum(val) && (val===parseInt(val, 10));
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
                return false;
            }
        }
    }
    return true;
}

function forIinA(a, f, scope){
    if (isUnd(scope)){
        scope = win;
    }
    for (var i=0, l=a.length; i<l; i++){
        if(f.call(scope, i, a[i])===false){
            return false;
        }
    }
    return true;
}

function free(o) {
    var p;
    for (p in o) {
        if (o.hasOwnProperty(p)) delete o.p;
    }
};

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
    addOrRemoveClasses(e, classes, merge.DELETE);
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

function _rAtt(e, att){
    el(e).removeAttribute(att);
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

function merge(dst, src, mode){
    var p,v;
    mode = parseInt(mode, 10);
    mode = mode ? mode : 0;
    if (!isObj(dst)) {
        dst = {};
    }
    forPinO(src, function(p, o){
        if (((o===null) && (mode & merge.DELETE_IF_NULL)) || (mode & merge.DELETE)) {
            delete dst[p];
        }
        else 
        if (isUnd(dst[p]) || (mode & merge.OVERWRITE)) {
            dst[p] = o;
        }
    });
    return dst;
}

merge.MERGE = 0;
merge.OVERWRITE = 1;
merge.DELETE_IF_NULL = 2;
merge.DELETE = 4;

/***************************************************************
*   
*   Event
*
***************************************************************/
var Event;
(Event = function(e) {
    if (!e) {
        e = win.event;
    }
    this.browserEvent = e;
    return this;
}).prototype = {    
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
var Observable;
(Observable = function() {
}).prototype = {
    listen: function(type, method, scope, context) {
        var listeners, handlers, scope;
        if (!(listeners = this.listeners)) {
            listeners = this.listeners = {};
        }
        if (!(handlers = listeners[type])){
            handlers = listeners[type] = [];
        }
        scope = (scope ? scope : win);
        handlers.push({
            method: method,
            scope: scope,
            context: (context ? context : scope)
        });
    },
    fireEvent: function(type, data, context) {
        var listeners, handlers, i, n, handler, scope;
        if (!(listeners = this.listeners)) {
            return;
        }
        if (!(handlers = listeners[type])){
            return;
        }
        for (i = 0, n = handlers.length; i < n; i++){
            handler = handlers[i];
            if (!isUnd(context) && context !== handler.context) continue; 
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
}, Observable.prototype);

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
(win["wxl"]["StyleSheet"] = function(config){
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
}).prototype = {
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
        merge(s, style, merge.DELETE);
    },
    applyStyle: function(selector, style, create){
        var r = this.getRule(selector);
        if (r === null) {
            if (create!==false) {
                this.addRule(selector, style);
            }
            return;
        }
        merge(r.style, style, merge.OVERWRITE);
        
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
(win["wxl"]["Range"] = function(config){
    this.config = config;
}).prototype = {
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
(win["wxl"]["DataGrid"] = function(config){
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
    if (isObj(config.kbHandler)) {
        this.kbHandler = config.kbHandler;
    }
    if (isObj(config.ddHandler)) {
        this.ddHandler = config.ddHandler;
    }
    me.render();
}).prototype = merge({
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
        addClass(container, "wxl_datagrid")
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
            "<table cellspacing=\"0\" cellpadding=\"0\" class=\"wxl_datagrid\" id=\"wxl_" + id + "\">" +
                "<thead><tr class=\"r0\">" + thead + "</tr></thead>" +
                "<tbody>" + tbody + "</tbody>" +
            "</table>"
        ;
        me.table = tag("table", container);
        me.initStyleSheet(styles);
        return;
    },
    initStyleSheet: function(styles) {
        var me = this;
        me.stylesheet = new wxl.StyleSheet({
            id: me.config.id + "-style"
        });
        me.stylesheet.render();
        me.stylesheet.addRules(styles || {});
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
    getDDHandler: function() {
        var me = this,
            ddHandler = this.ddHandler
        ;
        if (!ddHandler) {
            ddHandler = this.ddHandler = new DDHandler({
                node: this.container
            });
        }
        return ddHandler;
    },
    getColumnHeader: function(col){
        col = wxl.DataGrid.getColumnIndex(col);
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
    getCellContent: function(cell) {
        return this.getCellText();
    },
    setCellContent: function(cell, text) {
        this.setCellText(cell, text);
    },
    getCellText: function(cell) {
        return txt(tag("DIV", cell));
    },
    setCellText: function(cell, text) {
        tag("DIV", cell).innerHTML = escXML(text);
    },
    clearCell: function(cell) {
        _rAtt(cell, "data-content");
        tag("DIV", cell).innerHTML = "";
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
    setCellEditor: function(cellEditor) {
        cellEditor.initDataGrid(this);
    },
    setCellNavigator: function() {
    }
}, Observable.prototype);

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
    if (isInt(address)) {
        col = address;
    }
    else
    if (/[A-Z]+/.test(address)) {
        var i, n = address.length-1, col = 0;
        for (i=n; i >= 0; i--) {
            col += (address.charCodeAt(i) - 64);
        }
    }
    else
    if (/\d+/) {
        col = parseInt(address, 10);
    }
    return col;
};

wxl.DataGrid.getCellName = function(td){
    return  wxl.DataGrid.getColumnHeaderName(td.cellIndex-1) + 
            td.parentNode.rowIndex
    ;
};

/***************************************************************
*   
*   Resizable
*
***************************************************************/
(win["wxl"]["Resizable"] = function(config) {
    this.config = merge(config, {
        rows: true,
        columns: true
    });
    this.init();
}).prototype = {
    init: function(){ 
        var config = this.config,
            dataGrid = config.dataGrid;
        if (config.columns!==false) {
            dataGrid.setColumnWidth = this.setColumnWidth;
            dataGrid.getColumnWidth = this.getColumnWidth;
        }
        if (config.rows!==false) {
            dataGrid.setRowHeight = this.setRowHeight;
            dataGrid.getRowHeight = this.getRowHeight;
        }
        if (config.ddsupport) {
            new wxl.ResizableDDSupport(
                merge(config.ddsupport, config)
            );
        }
    },
    setColumnWidth: function(index, width) {
        var div = tag("DIV", this.getColumnHeader(index)),
            sizer = tag("DIV", div)
        ;
        if (sizer && width < sizer.clientWidth) {
            width = sizer.clientWidth;
        }
        div.style.width = width + "px";
    },
    getColumnWidth: function(index) {
        return tag("DIV", this.getColumnHeader(index)).clientWidth;
    },
    setRowHeight: function(index, height) {
        var div = tag("DIV", this.getRowHeader(index)),
            sizer = tag("DIV", div)
        ;
        if (sizer && width < sizer.clientHeight) {
            height = sizer.clientHeight;
        }
        div.style.height = height + "px";
    },
    getRowHeight: function(index) {
        return tag("DIV", this.getRowHeader(index)).clientHeight;
    }
};

(win["wxl"]["ResizableDDSupport"] = function(config) {
    this.config = config;
    this.init();
}).prototype = {
    init: function() {
        var config = this.config,
            dataGrid = config.dataGrid,
            container = dataGrid.container,
            table = dataGrid.table
        ;
        dataGrid.getDDHandler().listen({
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
                        if (config.rows===false) return false; 

                        pos.y += target.clientHeight;
                        dragProxyStyle.width = table.clientWidth + "px";;
                        dragProxyStyle.height = "1px";
                        dragProxyStyle.top = (startDragEvent.top = (pos.y - tabPos.top)) + "px";
                        dragProxyStyle.left = "0px";
                        cls = "wxl_resizer_vertical";
                    }
                    else
                    if (hasClass(target, "wxl_resize_horizontal")) {
                        if (config.columns===false) return false; 

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
                dataGrid.getKBHandler().focus();
            }
        });
    }
};
/***************************************************************
*   
*   Movable
*
***************************************************************/
(win["wxl"]["Movable"] = function(config) {
    this.config = merge(config, {
        rows: true,
        columns: true
    });
    this.init();
}).prototype = {
    init: function(){ 
        var config = this.config,
            dataGrid = config.dataGrid;
        if (config.rows!==false) dataGrid.moveRow = this.moveRow;
        if (config.columns!==false) dataGrid.moveColumn = this.moveColumn;
        if (config.ddsupport) {
            new wxl.MovableDDSupport(
                merge(config.ddsupport, config)
            );
        }
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
    }
};

(win["wxl"]["MovableDDSupport"] = function(config) {
    this.config = config;
    this.init();
}).prototype = {
   init: function() {
        var config = this.config,
            dataGrid = config.dataGrid,
            container = dataGrid.container,
            table = dataGrid.table
        ;
        dataGrid.getDDHandler().listen({
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
                        if (config.rows === false) return false;

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
                        if (config.columns === false) return false;

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
                            dataGrid.moveRow(sourceIndex, targetIndex);
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
                            dataGrid.moveColumn(sourceIndex, targetIndex);
                        }
                        break;
                }
                dragProxy.className = "";
                dropProxyStyle.display = "none";
                dataGrid.getKBHandler().focus();
            }
        });
    }
 };
/***************************************************************
*   
*   CellEditor
*
***************************************************************/
(win["wxl"]["CellEditor"] = function(config) {
    this.config = config = merge(config, {
    });    
    this.dataGrid = null;
    this.cell = null;
    this.render();
}).prototype = {
    initDataGrid: function(dataGrid){
        dataGrid.listen("cellactivated", this.cellActivated, this);
        dataGrid.getKBHandler().listen("keydown", this.dataGridKeyDownHandler, this);
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
    setEnabled: function(enabled) {
        this.textarea.disabled = !enabled;
    },
    cellActivated: function(dataGrid, event, cell){
        if (this.isEditing() && cell!==this.cell) {
            if (!this.stopEditing()) return false;
        } 
        this.dataGrid = dataGrid;
        this.cell = cell;
        this.textarea.value = dataGrid.getCellContent(cell);
    },
    isEditing: function() {
        return this.editing;
    },
    startEditing: function(dataGrid, event, cell) {
        var me = this;
        me.dataGrid = dataGrid;
        me.cell = cell;
        this.oldValue = dataGrid.getCellContent(cell);
        me.editing = true;
        me.syncCell();
        addClass(this.textarea, "wxl_active");
        addClass(cell, "wxl_editing");
        if (event !== "focus" ) {
            me.focus();
        }
        me.textarea.select();
    },
    stopEditing: function() {
        var dataGrid = this.dataGrid,
            cell = this.cell,
            textarea = this.textarea
        ;
        try {
            dataGrid.setCellContent(cell, textarea.value);
            removeClass(textarea, "wxl_active");
            this.editing = false;
            removeClass(cell, "wxl_editing");
            textarea.blur();
            dataGrid.focus();
            this.cell = null;
            this.dataGrid = null;
            stopEditing = true;
        } catch (exception) {
            stopEditing = false;
        }
        return stopEditing;
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
        var dataGrid = this.dataGrid,
            cell = this.cell
        ;
        if (cell) {
            if (keyCode === 46) {   //del
                dataGrid.clearCell(cell);
                this.textarea.value = "";
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
            case 27:    //esc
                this.textarea.value = this.oldValue;
            case 9:     //tab
            case 13:    //newline
                var dataGrid = this.dataGrid;
                if (this.isEditing()) {
                    e.preventDefault();
                    if (this.stopEditing()) {
                        var kbHandler = dataGrid.getKBHandler();
                        kbHandler.focus();
                        kbHandler.fireEvent("keydown", e);
                    }
                }
                break;
            case 33:    //page up
            case 34:    //page down
            case 35:    //end
            case 36:    //home
            case 37:    //left
            case 38:    //up
            case 39:    //right
            case 40:    //down
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
                this.syncCell();
        }
        return false;
    },
    syncCell: function() {
        var dataGrid = this.dataGrid;
        dataGrid.setCellText(dataGrid.getActiveCell(), this.textarea.value);
    },
    focus: function(){
        this.textarea.focus();
    },
    focusHandler: function(e) {
        var dataGrid = this.dataGrid, cell; 
        if (dataGrid &&  (cell = dataGrid.getActiveCell())) {
            this.startEditing(dataGrid, "focus", cell);
        }
    },
    clickHandler: function(e) {
        this.focus();
    }
};
/***************************************************************
*   
*   CellValues
*
***************************************************************/
(win["wxl"]["CellValues"] = function(config) {
    this.config = config;
    this.init();
}).prototype = {
    patterns: [
        {
            regexp: /'(.+)/,
            parser: function(arr){
                return {
                    value: arr[0].substr(1)
                };
            },
            toText: function(value){
                return value;
            }
        },
        {
            regexp: /=(.+)/,
            parser: function(arr){
                return {
                    error: "Not yet implemented"
                };
            },
            toText: function(value) {
                return value;
            }
        },
        {   //see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/parse
            //see http://www.w3.org/TR/NOTE-datetime and http://tools.ietf.org/html/rfc822#section-5
            regexp: /(\d{2,4}[\/\.\-]\d{1,2}([\/\.\-]\d{1,2}(T\d\d:\d\d(:\d\d)?(Z|[+-]\d\d:\d\d))?)?)|(((Mon?|Tue?|Wed?|Thu?|Fri?|Sat?|Sun?),?\W*)?\d{1,2}\W*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\W*\d{1,4}(\W+\d\d:\d\d(:\d\d(\W+(UT|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT|Z|A|M|N|Y|([+-]\W*\d{4})))?)?)?)/,
            parser: function(arr){
                var ts = Date.parse(arr[0]),
                    obj = {}
                ;
                if (isNaN(ts)) {
                    obj.error = "Invalid date";
                }
                else {
                    obj.value = new Date(ts);
                }
                return obj;
            },
            toText: function(value) {
                return value.toString();
            }
        },
        {
            regexp: /[+-]?((((\d+)|(\d{1,3}(,\d{3})+))(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?/,
            parser: function(arr){
                return {
                    value: Number(arr[0].replace(",", ""))
                };
            },
            toText: function(value) {
                return String(value);
            }
        }
    ],
    init: function() {
        var config = this.config,
            dataGrid = config.dataGrid,
            pattern, groups = 0
        ;
        dataGrid.valueHelper = this;
        dataGrid.setCellContent = this.setCellContent;
        dataGrid.getCellContent = this.getCellContent;
        pattern = "";
        forIinA(this.patterns, function(i, a){
            var source, noLiteralParenthesis 
            if (pattern.length) {
                pattern += "|";
            }
            source = a.regexp.source;
            groups += 1;
            a.startGroup = groups;
            noLiteralParenthesis = source.replace(/\\\(/g, "");
            groups += noLiteralParenthesis.length - noLiteralParenthesis.replace(/\(/g, "").length;
            a.endGroup = groups + 1;
            pattern += "(" + source + ")";
        });
        //note that we must not set the global flag
        //global flag will cause the regexp to maintain state
        //leading to unexpected results.
        this.regexp = new RegExp("^" + pattern + "$", "i");
    },
    setCellContent: function(cell, content) {
        var valueHelper = this.valueHelper,
            obj = valueHelper.parse(content),
            value
        ;
        if (obj.error) {
            throw obj.error;
        }
        _sAtt(cell, "data-content", content);
        if (obj.type) {
            value = obj.type.toText(obj.value);
        }
        else {
            value = obj.value;
        }
        free(obj);
        this.setCellText(cell, value);
    },
    getCellContent: function(cell) {
        var content = _gAtt(cell, "data-content");
        return (content===null) ?  this.getCellText(cell) : content;
    },
    parse: function(text){
        var items = this.regexp.exec(text), value;
        if (!items) return {
            value: text
        };
        if(forIinA(this.patterns, function(i, a){
            if (items[a.startGroup]!==text) return;
            value = a.parser(items.slice(a.startGroup, a.endGroup));
            value.type = a;
            return false;
        })) {
            return {
                value: text
            };
        }
        return value;
    }
};
/***************************************************************
*   
*   KeyboardNavigable
*
***************************************************************/
(win["wxl"]["KeyboardNavigable"] = function(config) {
    this.config = config;
    this.init();
}).prototype = {
    init: function() {
        var me = this,
            dataGrid = me.config.dataGrid;
        dataGrid.moveToCell = this.moveToCell;
        dataGrid.getKBHandler().listen("keydown", dataGrid.moveToCell, dataGrid);
    },
    moveToCell: function(kbHandler, type, event){
        var dataGrid = this,
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
        event.preventDefault(); 
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
    }
};

/***************************************************************
*   
*   CellNavigator
*
***************************************************************/

(win["wxl"]["CellNavigator"] = function(config) {
    this.config = config = merge(config, {
    }); 
    this.init();
}).prototype = {
    init: function(){
        var dataGrid = this.config.dataGrid;
        dataGrid.listen("cellactivated", this.cellActivated, this);
        this.render();
    },
    render: function() {
        var me = this,
            input = el(me.config.input)
        ;
        input.size = 4;
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
};

/***************************************************************
*   
*   Application
*
***************************************************************/
(win["wxl"]["SpreadSheet"] = function(config) {
    this.config = merge(config, {
        id: body,
        numDisplayRows: 50,
        numDisplayCols: 50,
        lastRow: 50,
        lastCol: 50,
    });
    this.render();
}).prototype = {
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
        
        //allow grid to be navigated using the keyboard
        new wxl.KeyboardNavigable({
            dataGrid: dataGrid
        });
        //allow columns and rows to be moved around
        new wxl.Movable({
            dataGrid: dataGrid,
            ddsupport: true
        });
        //allow columns and rows to be moved around
        new wxl.Resizable({
            dataGrid: dataGrid,
            ddsupport: true
        });
        //add a value helper
        new wxl.CellValues({
            dataGrid: dataGrid
        });
        
        //add a celleditor
        dataGrid.setCellEditor(
            new wxl.CellEditor({
                textarea: cellEditor
            })
        );
        //add a widget to show the cell address
        new wxl.CellNavigator({
            dataGrid: dataGrid,
            input: cellNavigator
        });
    }
};
 
})();
