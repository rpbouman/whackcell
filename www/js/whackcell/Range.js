define(function(require){

require("js/utils.js");

var Range;
(Range = function(config){
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
            rows = config.dataGrid.getRows(),
            row, cell
        ;
        if (!scope) scope = win;
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
                this.end.row === this.config.dataGrid.numRows
        ;
    },
    allCols: function(){
        return  this.start.col===1 &&
                this.end.col === this.config.dataGrid.numCols
        ;
    }
};

return Range;
});
