define(function(require){

var Movable;
(Movable = function(config) {
    this.config = merge(config, {
        rows: true,
        columns: true
    });
    this.init();
}).prototype = {
    init: function(){
        var config = this.config,
            worksheet = config.worksheet;
        if (config.rows!==false) worksheet.moveRow = this.moveRow;
        if (config.columns!==false) worksheet.moveColumn = this.moveColumn;
        if (config.ddsupport) {
            new MovableDDSupport(
                merge(config.ddsupport, config)
            );
        }
    },
    moveRow: function(sourceIndex, targetIndex) {
        if (targetIndex===sourceIndex) return;

        var table = this.table,
            rows = table.rows,
            sourceRow = rows.item(sourceIndex), sourceCell,
            sourceCells = sourceRow.cells,
            n = sourceCells.length, i,
            targetRow, targetCell,
            activeCell = this.activeCell
        ;
        if (activeCell && activeCell.parentNode.rowIndex === sourceIndex) {
            activeCell = activeCell.cellIndex;
            this.setActiveCell(null);
        }
        targetRow = table.insertRow(targetIndex);
        targetRow.className = "r" + targetIndex;
        targetRow.appendChild(crEl("TH", {
            "class": "th",
            scope: "row"
        }, tag("DIV", sourceCells.item(0))));
        tag("SPAN", targetRow.cells.item(0)).innerHTML = targetIndex;
        for (i = 1; i<n; i++) {
            sourceCell = sourceCells.item(i);
            targetCell = targetRow.insertCell(i);
            this.copyCell(sourceCell, targetCell);
        }
        this.table.deleteRow(sourceRow.rowIndex);
        for (i = sourceIndex; i !== targetIndex; i += (sourceIndex < targetIndex ? 1 : -1)) {
            row = rows.item(i);
            row.className = "r" + i;
            tag("SPAN", row.cells.item(0)).innerHTML = i;
        }
        if (activeCell) {
            this.setActiveCell(targetRow.cells.item(activeCell));
        }
    },
    moveColumn: function(sourceIndex, targetIndex) {
        if (targetIndex===sourceIndex) return;
        var table = this.table,
            rows = table.rows,
            i, n = rows.length, row,
            sourceCell, targetCell,
            activeCell = this.activeCell
        ;
        if (activeCell && activeCell.cellIndex === sourceIndex) {
            activeCell = activeCell.parentNode.rowIndex;
            this.setActiveCell(null);
        }
        else {
            activeCell = null;
        }
        for (var i = 1; i < n; i++){
            row = rows.item(i);
            sourceCell = row.cells.item(sourceIndex);
            targetCell = row.insertCell(targetIndex);
            this.copyCell(sourceCell, targetCell);
            row.deleteCell(sourceCell.cellIndex);
        }
        if (activeCell) {
            this.setActiveCell(rows.item(activeCell).cells.item(targetIndex));
        }
    }
};

var MovableDDSupport;
(MovableDDSupport = function(config) {
    this.config = config;
    this.init();
}).prototype = {
   init: function() {
        var config = this.config,
            worksheet = config.worksheet,
            container = worksheet.container,
            table = worksheet.table
        ;
        worksheet.getDDHandler().listen({
            scope: this,
            startDrag: function(event, ddHandler){
                var target = event.getTarget();
                if (target.tagName==="DIV" && hasClass(target, "wxl_header")) {
                    var dragProxy = ddHandler.dragProxy,
                        dragProxyStyle = dragProxy.style,
                        dropProxy = ddHandler.dropProxy,
                        dropProxyStyle = dropProxy.style,
                        parent = target.parentNode,
                        pos = position(parent),
                        tabPos = position(table), cls,
                        startDragEvent = ddHandler.startDragEvent,
                        offset, size
                    ;
                    pos.x = pos.left - tabPos.left;
                    pos.y = pos.top - tabPos.top;
                    dragProxy.className = "";
                    if (hasClass(target, "wxl_row_header")) {
                        if (config.rows === false) return false;

                        offset = (pos.x + parent.clientWidth) + "px";
                        size = (table.clientWidth - parent.clientWidth) + "px";

                        dragProxyStyle.width = size;
                        dragProxyStyle.left = offset;
                        dragProxyStyle.height = parent.clientHeight + "px";
                        dragProxyStyle.top =  (startDragEvent.top = pos.y) + "px";

                        cls = "wxl_row_mover";
                        dropProxyStyle.width = size;
                        dropProxyStyle.left = offset;
                        dropProxy.className = "wxl_row_drop";
                        dropProxyStyle.height = "3px";
                    }
                    else
                    if (hasClass(target, "wxl_column_header")) {
                        if (config.columns === false) return false;

                        offset = (pos.y + parent.clientHeight) + "px";
                        size = (table.clientHeight - parent.clientHeight) + "px";

                        dragProxyStyle.height = size;
                        dragProxyStyle.top = offset;
                        dragProxyStyle.width = parent.clientWidth + "px";
                        dragProxyStyle.left =  (startDragEvent.left = pos.x) + "px";

                        cls = "wxl_column_mover";
                        dropProxyStyle.height = size;
                        dropProxyStyle.top = offset;
                        dropProxy.className = "wxl_column_drop";
                        dropProxyStyle.width = "3px";
                    }
                    startDragEvent.cls = cls;
                    addClasses(dragProxy, ["wxl_mover", cls]);
                    return true;
                }
                return false;
            },
            whileDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    dragProxyStyle = dragProxy.style,
                    dropProxy = ddHandler.dropProxy,
                    dropProxyStyle = dropProxy.style,
                    tabPos, targetPos,
                    startEvent = ddHandler.startDragEvent,
                    startTarget = startEvent.target,
                    startXY = startEvent.getXY(),
                    xy = event.getXY(),
                    target = event.getTarget(),
                    targetParent = target.parentNode
                ;
                switch(startEvent.cls){
                    case "wxl_row_mover":
                        dragProxyStyle.top = (startEvent.top + (xy.y - startXY.y)) + "px";
                        if (target.tagName === "SPAN") target = target.parentNode;
                        if (target.tagName !== "DIV") break;
                        if (hasClass(target, "wxl_resize")) target = target.parentNode;
                        if (!hasClass(target, "wxl_row_header")) break;
                        targetPos = position(targetParent);
                        tabPos = position(table);
                        dropProxyStyle.display = "";
                        dropProxyStyle.top = (targetPos.top - tabPos.top) +
                            (((xy.y - targetPos.top) < (targetParent.clientHeight/2)) ? 0 : targetParent.clientHeight) + "px"
                        ;
                        return;
                    case "wxl_column_mover":
                        dragProxyStyle.left = (startEvent.left + (xy.x - startXY.x)) + "px";
                        if (target.tagName === "SPAN") target = target.parentNode;
                        if (target.tagName !== "DIV") break;
                        if (hasClass(target, "wxl_resize")) target = target.parentNode;
                        if (!hasClass(target, "wxl_column_header")) break;
                        targetPos = position(targetParent);
                        tabPos = position(table);
                        dropProxyStyle.display = "";
                        dropProxyStyle.left = (targetPos.left - tabPos.left) +
                            (((xy.x - targetPos.left) < (targetParent.clientWidth/2)) ? 0 : targetParent.clientWidth) + "px"
                        ;
                        return;
                }
                dropProxyStyle.display = "none";
            },
            endDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    dragProxyStyle = dragProxy.style,
                    dropProxy = ddHandler.dropProxy,
                    dropProxyStyle = dropProxy.style,
                    startEvent = ddHandler.startDragEvent,
                    startTarget = startEvent.target,
                    targetPos,
                    target = event.getTarget(),
                    targetParent,
                    targetIndex,
                    xy = event.getXY()
                ;
                switch(startEvent.cls){
                    case "wxl_row_mover":
                        if (target.tagName === "SPAN") target = target.parentNode;
                        if (target.tagName !== "DIV") break;
                        if (hasClass(target, "wxl_resize")) target = target.parentNode;
                        if (!hasClass(target, "wxl_row_header")) break;
                        targetParent = target.parentNode,
                        sourceIndex = startTarget.parentNode.parentNode.rowIndex;
                        targetIndex = targetParent.parentNode.rowIndex;
                        targetPos = position(targetParent);
                        if ((xy.y - targetPos.top) >= (targetParent.clientHeight/2)) {
                            targetIndex++;
                        }
                        worksheet.moveRow(sourceIndex, targetIndex);
                        break;
                    case "wxl_column_mover":
                        if (target.tagName === "SPAN") target = target.parentNode;
                        if (target.tagName !== "DIV") break;
                        if (hasClass(target, "wxl_resize")) target = target.parentNode;
                        if (!hasClass(target, "wxl_column_header")) break;
                        targetParent = target.parentNode,
                        sourceIndex = startTarget.parentNode.cellIndex;
                        targetIndex = targetParent.cellIndex;
                        targetPos = position(targetParent);
                        if ((xy.x - targetPos.left) >= (targetParent.clientWidth/2)) {
                            targetIndex++;
                        }
                        worksheet.moveColumn(sourceIndex, targetIndex);
                        break;
                }
                dragProxy.className = "";
                dropProxyStyle.display = "none";
                worksheet.getKBHandler().focus();
            }
        });
    }
};

return Movable;
});
