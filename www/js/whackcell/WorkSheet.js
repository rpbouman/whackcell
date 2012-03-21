define(function(require){

require("js/utils.js");

var CascadingStyleSheet = require("js/CascadingStyleSheet.js");

var WorkSheet;

(WorkSheet = function(config){
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
    if (isObj(config.kbHandler)) this.kbHandler = config.kbHandler;
    if (isObj(config.ddHandler)) this.ddHandler = config.ddHandler;
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
            thead += "<th class=\"" + className + "\" scope=\"col\" style=\"width:54px\">";
            thead +=
                "<div class=\"wxl_header wxl_column_header\" >" +
                    (i ? "<span>" + WorkSheet.getColumnHeaderName(i-1) + "</span>" +
                         "<div class=\"wxl_resize wxl_resize_horizontal\"></div>": ""
                    ) +
                "</div>"
            ;
            thead += "</th>";
            if (i) {
                row += "<td class=\"" + className + "\" ></td>";
                //add style rules to hide cells outside the display range
                if (i > lastDisplayCol){
                    styles[stylePrefix2 + className] = {
                        display: "none"
                    };
                }
            }
        }
        tagName = "tr";
        row += "</tr>";
        stylePrefix1 += ".";
        for (i = 1, n = me.numRows; i <= n; i++) {
            className = "r" + i;
            tbody +=
                "<tr class=\"" + className + "\" style=\"height: 16px;\">" +
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
        listen(me.table, "click", this.clickHandler, me);
        if (config.data) this.setData(config.data);
        return;
    },
    initStyleSheet: function(styles) {
        var me = this;
        me.stylesheet = new CascadingStyleSheet({
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
        col = WorkSheet.getColumnIndex(col);
        return this.table.rows.item(0).cells.item(col);
    },
    getRowHeader: function(row) {
        return this.table.rows.item(row).cells.item(0);
    },
    createRange: function(startRow, startCol, endRow, endCol){
        return new Range({
            worksheet: this,
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
            if (this.fireEvent("beforecelldeactivated", activeCell)===false) return;
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
        var config = this.config,
            numDisplayCols = config.numDisplayCols,
            firstDisplayCol = config.firstDisplayCol,
            lastDisplayCol = firstDisplayCol + numDisplayCols - 1,
            numDisplayRows = config.numDisplayRows,
            firstDisplayRow = config.firstDisplayRow,
            lastDisplayRow = firstDisplayRow + numDisplayRows - 1,
            cellIndex = td.cellIndex,
            rowIndex = td.parentNode.rowIndex,
            i, n, j, m,
            style = this.stylesheet,
            id = this.container.id,
            stylePrefix1 = "#" + id + " > TABLE > * > TR"
        ;
        //cols:
        if (cellIndex < firstDisplayCol) {
            config.firstDisplayCol = i = cellIndex;
            n = Math.min(i + numDisplayCols, firstDisplayCol);
            j = Math.max(i + numDisplayCols, firstDisplayCol);
            m = lastDisplayCol + 1;
        }
        else
        if (cellIndex > lastDisplayCol) {
            n = cellIndex + 1;
            config.firstDisplayCol = i = n - numDisplayCols;
            j = firstDisplayCol;
            m = Math.min(j + numDisplayCols, i);
        }
        else {
            i = n = 0;
        }
        //unhide the new column window
        for (; i < n; i++) {
            style.applyStyle(stylePrefix1 + " > .c" + i, {
                display: ""
            });
        }
        //hide the old column window
        for (; j < m; j++) {
            style.applyStyle(stylePrefix1 + " > .c" + j, {
                display: "none"
            });
        }

        //Rows
        if (rowIndex < firstDisplayRow) {
            config.firstDisplayRow = i = rowIndex;
            n = Math.min(i + numDisplayRows, firstDisplayRow);
            j = Math.max(i + numDisplayRows, firstDisplayRow);
            m = lastDisplayRow + 1;
        }
        else
        if (rowIndex > lastDisplayRow) {
            n = rowIndex + 1;
            config.firstDisplayRow = i = n - numDisplayRows;
            j = firstDisplayRow;
            m = Math.min(j + numDisplayRows, i)
        }
        else {
            i = n = 0;
        }
        //unhide the new row window
        for (; i < n; i++) {
            style.applyStyle(stylePrefix1 + ".r" + i, {
                display: ""
            });
        }
        //hide the old row window
        for (; j < m; j++) {
            style.applyStyle(stylePrefix1 + ".r" + j, {
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
        sAtt(cell, "data-content", text);
        this.setCellText(cell, text);
    },
    getCellText: function(cell) {
        return txt(cell);
    },
    setCellText: function(cell, text) {
        //clear out the text first.
        //we found this was required to ensure the new value is rendered by the browser,
        cell.innerHTML = "";
        cell.innerHTML = escXML(text);
    },
    clearCell: function(cell) {
        this.setCellContent(cell, "");
    },
    copyCell: function(sourceCell, targetCell) {
        cAtts(sourceCell, targetCell);
        targetCell.innerHTML = sourceCell.innerHTML;
    },
    clickHandler: function(e) {
        var target = e.getTarget(),
            className = target.className,
            parentNode
        ;
        tagname: switch (target.tagName) {
            case "SPAN":
                parentNode = target.parentNode;
                switch (parentNode.tagName) {
                    case "DIV":
                    case "TD":
                        target = parentNode;
                        className = target.className;
                        break;
                    default:
                        break tagname;
                }
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
                if (this.fireEvent("click", target)===false) return;
                this.setActiveCell(target);
/*
                if (!e.getCtrlKey()) {
                    this.clearSelection();
                }
                this.selectCell(target);
*/
                break;
        }
        if (this.getKBHandler().focus() === false) {
            if (this.cellEditor) {
                this.cellEditor.focus();
            }
            return false;
        }
    },
    setCellEditor: function(cellEditor) {
        cellEditor.initWorkSheet(this);
    },
    setCellNavigator: function() {
    },
    setData: function(d) {
        var rows = this.getRows(),
            r, c,
            row, cell,
            tr, td,
            txt
        ;
        for (r in d) {
            row = d[r];
            tr = rows.item(parseInt(r, 10));
            for (c in row) {
                cell = row[c];
                td = tr.cells.item(parseInt(c, 10));
                if (isStr(cell)) txt = cell;
                else
                if (isObj(cell)){
                    if (cell.atts) sAtts(td, cell.atts);
                    txt = isUnd(cell.text) ? "" : cell.text
                }
                this.setCellContent(td, txt);
            }
        }
    },
    getData: function() {
        var rows = this.getRows(),
            r, n = rows.length,
            tr, row, cells, td, cell,
            txt,
            c, m,
            att, atts, attributes,
            k, o,
            data = {}
        ;
        for (r = 1; r < n; r++) {
            tr = rows.item(r);
            cells = tr.cells;
            m = cells.length;
            for (c = 1; c < m; c++) {
                td = cells.item(c);
                txt = gAtt(td, "data-content");
                if (txt) {
                    row = data[r];
                    if (!row) row = data[r] = {};
                    cell = row[c] = {
                        text: txt,
                        atts: {}
                    };
                    atts = cell.atts;
                    attributes = td.attributes;
                    o = attributes.length;
                    for (k = 0; k < o; k++) {
                        att = attributes[k];
                        if (!att.name.indexOf("data-")) continue;
                        atts[att.name] = att.value;
                    }
                }
            }
        }
        return data;
    }
}, Observable.prototype);

WorkSheet.getColumnHeaderName = function(num){
    var r,h="";
    do {
        r = num % 26;
        num = (num - r) / 26;
        h = String.fromCharCode(r + 65) + h;
    } while (num-- > 0);
    return h;
};

WorkSheet.getColumnIndex = function(address) {
    if (isInt(address)) col = address;
    else
    if (/^[A-Z]+$/i.test(address)) {
        address = address.toUpperCase();
        var i, n = address.length-1, col = 0;
        for (i = n; i >= 0; i--) col += (address.charCodeAt(i) - 64);
    }
    else
    if (/\d+/) col = parseInt(address, 10);
    return col;
};

WorkSheet.getCellName = function(td){
    return  WorkSheet.getColumnHeaderName(td.cellIndex-1) +
            td.parentNode.rowIndex
    ;
};

return WorkSheet;
});
