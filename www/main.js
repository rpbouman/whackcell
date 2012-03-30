require.config({
    paths: {
        "CascadingStyleSheet": "js/CascadingStyleSheet",
        "CellEditor": "js/whackcell/CellEditor",
        "CellNavigator": "js/whackcell/CellNavigator",
        "CellValues": "js/whackcell/CellValues",
        "experimentalFunctions": "js/whackcell/ExperimentalFunctions",
        "FormulaSupport": "js/whackcell/FormulaSupport",
        "FunctionModuleManager": "js/whackcell/FunctionModuleManager",
        "KeyboardNavigable": "js/whackcell/KeyboardNavigable",
        "Movable": "js/whackcell/Movable",
        "Range": "js/whackcell/Range",
        "Resizable": "js/whackcell/Resizable",
        "SpreadSheetApplication": "js/whackcell/SpreadSheetApplication",
        "standardTextFunctions": "js/whackcell/StandardTextFunctions",
        "standardDateTimeFunctions": "js/whackcell/StandardDateTimeFunctions",
        "standardMathFunctions": "js/whackcell/StandardMathFunctions",
        "utils": "js/utils",
        "WorkSheet": "js/whackcell/WorkSheet"
    },
    waitSeconds: 15,
    locale: "en-us"
});

require([
    "SpreadSheetApplication",
],  function(SpreadSheetApplication){
        new SpreadSheetApplication({
            numDisplayRows: 10,
            numDisplayCols: 10,
            lastRow: 20,
            lastCol: 20
        });
    }
);
