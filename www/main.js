require([
    "js/whackcell/SpreadSheetApplication.js",
],  function(SpreadSheetApplication){
        new SpreadSheetApplication({
            numDisplayRows: 10,
            numDisplayCols: 10,
            lastRow: 20,
            lastCol: 20
        });
    }
);
