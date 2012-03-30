define(function(require) {

require("utils");
var WorkSheet = require("WorkSheet");

var CellEditor;
(CellEditor = function(config) {
    this.config = config = merge(config, {
    });
    this.worksheet = null;
    this.cell = null;
    this.render();
}).prototype = {
    initWorkSheet: function(worksheet){
        worksheet.cellEditor = this;
        worksheet.listen("cellactivated", this.cellActivated, this);
        worksheet.listen("click", this.cellClicked, this);
        var kbHandler = worksheet.getKBHandler();
        kbHandler.listen("keydown", this.worksheetKeyDownHandler, this);
    },
    render: function() {
        var me = this,
            textarea = el(me.config.textarea)
        ;
        me.editing = false;
        sAtts(textarea, {
            class: "wxl_celleditor",
            autocomplete: "off"
        });
        listen(textarea, "keydown", me.keydownHandler, me);
        listen(textarea, "keyup", me.keyupHandler, me);
        listen(textarea, "focus", me.focusHandler, me);
        listen(textarea, "click", me.clickHandler, me);
        me.textarea = textarea;
    },
    setEnabled: function(enabled) {
        this.textarea.disabled = !enabled;
    },
    cellClicked: function(worksheet, event, cell){
        if (!this.editing) return;
        var textarea = this.textarea,
            value = textarea.value
        ;
        //TODO: detect if we currently have formula support,
        //use a nicer check to see if we're editing a formula
        if (value.charAt(0) !== "=") return this.stopEditing();
        var pos = textarea.selectionStart,
            s = value.substr(0, pos),
            e = value.substr(textarea.selectionEnd),
            cellName = WorkSheet.getCellName(cell)
        ;
        textarea.value = s + cellName + e;
        textarea.selectionStart = textarea.selectionEnd = pos + cellName.length;
        this.syncCell();
        this.focus();
        return false;
    },
    cellActivated: function(worksheet, event, cell){
        var textarea = this.textarea;
        if (this.isEditing() && cell !== this.cell) {
            this.stopEditing();
        }
        this.worksheet = worksheet;
        this.cell = cell;
        textarea.value = worksheet.getCellContent(cell);
    },
    isEditing: function() {
        return this.editing;
    },
    startEditing: function(worksheet, event, cell) {
        var me = this;
        me.worksheet = worksheet;
        me.cell = cell;
        this.oldValue = worksheet.getCellContent(cell);
        me.editing = true;
        me.syncCell();
        addClass(this.textarea, "wxl_active");
        addClass(cell, "wxl_editing");
        me.textarea.select();
        if (event !== "focus" ) me.focus();
    },
    stopEditing: function() {
        if (!this.editing) return;
        var worksheet = this.worksheet,
            cell = this.cell,
            textarea = this.textarea
        ;
        if (!cell) return true;
        try {
            worksheet.setCellContent(cell, textarea.value);
            removeClass(textarea, "wxl_active");
            this.editing = false;
            removeClass(cell, "wxl_editing");
            textarea.blur();
            worksheet.focus();
            this.cell = null;
            this.worksheet = null;
            stopEditing = true;
        } catch (exception) {
            exception = JSON.stringify(exception)
            if (isUnd(console)) {
                alert(exception);
            }
            else {
                console.log(exception);
            }
//            debugger;
            stopEditing = false;
        }
        return stopEditing;
    },
    worksheetKeyDownHandler: function(kbHandler, type, event){
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
        var worksheet = this.worksheet,
            cell = this.cell
        ;
        if (cell) {
            if (keyCode === 46) {   //del
                worksheet.clearCell(cell);
                this.textarea.value = "";
            }
            else {
                this.startEditing(worksheet, event, cell);
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
                var worksheet = this.worksheet;
                if (this.isEditing()) {
                    e.preventDefault();
                    if (this.stopEditing()) {
                        var kbHandler = worksheet.getKBHandler();
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
        var worksheet = this.worksheet,
            activeCell = worksheet.getActiveCell()
        ;
        worksheet.setCellText(activeCell, this.textarea.value);
    },
    focus: function(){
        this.textarea.focus();
    },
    focusHandler: function(e) {
        var worksheet = this.worksheet, cell;
        if (worksheet &&  (cell = worksheet.getActiveCell())) {
            this.startEditing(worksheet, "focus", cell);
        }
    },
    clickHandler: function(e) {
        this.focus();
    }
};

return CellEditor;
});
