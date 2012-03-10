define(function(require){

require("js/utils.js");

var WorkSheet = require("js/whackcell/WorkSheet.js")

var CellNavigator;
(CellNavigator = function(config) {
    this.config = config = merge(config, {
    });
    this.init();
}).prototype = {
    init: function(){
        var worksheet = this.config.worksheet;
        worksheet.listen("cellactivated", this.cellActivated, this);
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
    cellActivated: function(worksheet, event, cell){
        this.input.value = WorkSheet.getCellName(cell);
    },
    changeHandler: function() {
    },
    focusHandler: function() {
        this.input.select();
    }
};

return CellNavigator;
});
