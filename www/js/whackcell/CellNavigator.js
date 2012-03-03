define(function(require){

require("js/utils.js");

var DataGrid = require("js/whackcell/DataGrid.js")

var CellNavigator;
(CellNavigator = function(config) {
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
        sAtts(input, {
            size: 4,
            class: "wxl_cellnavigator",
            autocomplete: "off"
        });
        listen(input, "change", this.changeHandler, this);
        listen(input, "focus", this.focusHandler, this);
        this.input = input;
    },
    cellActivated: function(dataGrid, event, cell){
        this.input.value = DataGrid.getCellName(cell);
    },
    changeHandler: function() {
    },
    focusHandler: function() {
        this.input.select();
    }
};

return CellNavigator;
});
