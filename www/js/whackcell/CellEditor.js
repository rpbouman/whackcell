define(function(require) {

require("js/utils.js");
var DataGrid = require("js/whackcell/DataGrid.js");

var CellEditor;
(CellEditor = function(config) {
    this.config = config = merge(config, {
    });
    this.dataGrid = null;
    this.cell = null;
    this.render();
}).prototype = {
    initDataGrid: function(dataGrid){
        dataGrid.cellEditor = this;
        dataGrid.listen("cellactivated", this.cellActivated, this);
        dataGrid.listen("click", this.cellClicked, this);
        var kbHandler = dataGrid.getKBHandler();
        kbHandler.listen("keydown", this.dataGridKeyDownHandler, this);
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
    cellClicked: function(dataGrid, event, cell){
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
            cellName = DataGrid.getCellName(cell)
        ;
        textarea.value = s + cellName + e;
        textarea.selectionStart = textarea.selectionEnd = pos + cellName.length;
        this.syncCell();
        this.focus();
        return false;
    },
    cellActivated: function(dataGrid, event, cell){
        var textarea = this.textarea;
        if (this.isEditing() && cell !== this.cell) {
            this.stopEditing();
        }
        this.dataGrid = dataGrid;
        this.cell = cell;
        textarea.value = dataGrid.getCellContent(cell);
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
        me.textarea.select();
        if (event !== "focus" ) me.focus();
    },
    stopEditing: function() {
        if (!this.editing) return;
        var dataGrid = this.dataGrid,
            cell = this.cell,
            textarea = this.textarea
        ;
        if (!cell) return true;
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
            alert(exception.message||exception);
//            debugger;
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
        var dataGrid = this.dataGrid,
            activeCell = dataGrid.getActiveCell()
        ;
        dataGrid.setCellText(activeCell, "");
        dataGrid.setCellText(activeCell, this.textarea.value);
    },
    focus: function(){
        this.textarea.focus();
    },
    focusHandler: function(e) {
        var dataGrid = this.dataGrid, cell;
        if (dataGrid &&  (cell = dataGrid.getActiveCell())) {
            //this.startEditing(dataGrid, "focus", cell);
        }
    },
    clickHandler: function(e) {
        this.focus();
    }
};

return CellEditor;
});
