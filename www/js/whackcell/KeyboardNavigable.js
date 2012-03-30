define(function(require){

require("utils");

var KeyboardNavigable;
(KeyboardNavigable = function(config) {
    this.config = config;
    this.init();
}).prototype = {
    init: function() {
        var me = this,
        worksheet = me.config.worksheet;
        worksheet.moveToCell = this.moveToCell;
        worksheet.getKBHandler().listen("keydown", worksheet.moveToCell, worksheet);
    },
    moveToCell: function(kbHandler, type, event){
        var worksheet = this,
            cell = worksheet.activeCell
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
                rowIndex = rowIndex - (rowIndex > worksheet.config.numDisplayRows ? worksheet.config.numDisplayRows : rowIndex) + 1;
                break;
            case 34:    //page down
                rowIndex = rowIndex + (worksheet.numRows - rowIndex > worksheet.config.numDisplayRows ? worksheet.config.numDisplayRows : worksheet.numRows - rowIndex) - 1;
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
        if (!cellIndex || !rowIndex) return;
        row = rows.item(rowIndex);
        if (!row) return;
        cell = row.cells.item(cellIndex);
        if (!cell) return;
        worksheet.setActiveCell(cell);
        return false;
    }
};

return KeyboardNavigable;
});
