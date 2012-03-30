define(function(require){

require("utils");
var WorkSheet = require("WorkSheet");
var Range = require("Range");
var Movable = require("Movable");
var Resizable = require("Resizable");
var KeyboardNavigable = require("KeyboardNavigable");
var CellEditor = require("CellEditor");
var CellNavigator = require("CellNavigator");
var CellValues = require("CellValues");
var FormulaSupport = require("FormulaSupport");
var FunctionModuleManager = require("FunctionModuleManager");
var standardTextFunctions = require("standardTextFunctions");
var standardDateTimeFunctions = require("standardDateTimeFunctions");
var standardMathFunctions = require("standardMathFunctions");
var experimentalFunctions = require("experimentalFunctions");

var SpreadSheetApplication;

(SpreadSheetApplication = function(config) {
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
            worksheet = "wxl_datagrid"
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
                id: worksheet,
                style: {
                    top: "60px",
                    left: "0px"
                }
            })
        ]);

        worksheet = new WorkSheet(merge({
            div: worksheet
        }, this.config));

        //allow grid to be navigated using the keyboard
        new KeyboardNavigable({
            worksheet: worksheet
        });

        //allow columns and rows to be moved around
        new Movable({
            worksheet: worksheet,
            ddsupport: true
        });

        //allow columns and rows to be moved around
        new Resizable({
            worksheet: worksheet,
            ddsupport: true
        });

        //add a value helper
        worksheet.setValueSupport(
            new CellValues({
                worksheet: worksheet,
                formulaSupport: new FormulaSupport({
                    moduleManager: new FunctionModuleManager({
                        modules: [
                            standardTextFunctions,
                            standardDateTimeFunctions,
                            standardMathFunctions,
                            experimentalFunctions
                        ]
                    })
                })
            })
        );

        //add a celleditor
        worksheet.setCellEditor(
            new CellEditor({
                textarea: cellEditor
            })
        );

        //add a widget to show the cell address
        new CellNavigator({
            worksheet: worksheet,
            input: cellNavigator
        });

        var data = {
            1: {
                1: "bla",
                4: "boe"
            },
            2: {
                3: "=A1 & A4"
            }
        };
        worksheet.setData(data);
        var d = worksheet.getData();
    }
};

return SpreadSheetApplication;

});
