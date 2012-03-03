require([
    "js/whackcell/SpreadSheet.js",
],  function(SpreadSheet){
        new SpreadSheet({
            numDisplayRows: 10,
            numDisplayCols: 10,
            lastRow: 20,
            lastCol: 20
        });
    }
);
