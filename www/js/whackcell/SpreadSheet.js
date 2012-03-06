define(function(require){

require("js/utils.js");
var DataGrid = require("js/whackcell/DataGrid.js");
var Range = require("js/whackcell/Range.js");
var Movable = require("js/whackcell/Movable.js");
var Resizable = require("js/whackcell/Resizable.js");
var KeyboardNavigable = require("js/whackcell/KeyboardNavigable.js");
var CellEditor = require("js/whackcell/CellEditor.js");
var CellNavigator = require("js/whackcell/CellNavigator.js");
var CellValues = require("js/whackcell/CellValues.js");
var FormulaSupport = require("js/whackcell/FormulaSupport.js");
var FunctionModuleManager = require("js/whackcell/FunctionModuleManager.js");
var standardTextFunctions = require("js/whackcell/StandardTextFunctions.js");

var SpreadSheet;

(SpreadSheet = function(config) {
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
        chs(container, [
            crEl(
                "DIV", {
                "class": "wxl_toolbar",
            }, crEl("DIV")),
            crEl("DIV", {
                "class": "wxl_toolbar",
            }, crEl("DIV", null, [
                crEl("INPUT", {
                    id: cellNavigator
                }),
                crEl("TEXTAREA", {
                    id: cellEditor
                }),
            ])),
            crEl("DIV", {
                id: dataGrid,
                style: {
                    top: "60px",
                    left: "0px"
                }
            })
        ]);
        dataGrid = new DataGrid(merge({
            div: dataGrid
        }, this.config));

        //allow grid to be navigated using the keyboard
        new KeyboardNavigable({
            dataGrid: dataGrid
        });
        //allow columns and rows to be moved around
        new Movable({
            dataGrid: dataGrid,
            ddsupport: true
        });
        //allow columns and rows to be moved around
        new Resizable({
            dataGrid: dataGrid,
            ddsupport: true
        });

        //add a value helper
        new CellValues({
            dataGrid: dataGrid,
            formulaSupport: new FormulaSupport({
                moduleManager: new FunctionModuleManager({
                    modules: [
                      standardTextFunctions
                    ]
                })
            })
        });

        //add a celleditor
        dataGrid.setCellEditor(
            new CellEditor({
                textarea: cellEditor
            })
        );
        //add a widget to show the cell address
        new CellNavigator({
            dataGrid: dataGrid,
            input: cellNavigator
        });
    }
};

return SpreadSheet;

});
