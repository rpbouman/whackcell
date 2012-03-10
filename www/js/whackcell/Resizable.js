define(function(require){

require("js/utils.js");

var Resizable;
(Resizable = function(config) {
    this.config = merge(config, {
        rows: true,
        columns: true
    });
    this.init();
}).prototype = {
    init: function(){
        var config = this.config,
            worksheet = config.worksheet;
        if (config.columns!==false) {
            worksheet.setColumnWidth = this.setColumnWidth;
            worksheet.getColumnWidth = this.getColumnWidth;
        }
        if (config.rows!==false) {
            worksheet.setRowHeight = this.setRowHeight;
            worksheet.getRowHeight = this.getRowHeight;
        }
        if (config.ddsupport) {
            new ResizableDDSupport(
                merge(config.ddsupport, config)
            );
        }
    },
    setColumnWidth: function(index, width) {
        var th = this.getColumnHeader(index),
            div = tag("DIV", th),
            sizer = tag("DIV", div)
        ;
        if (sizer && width < sizer.clientWidth) {
            width = sizer.clientWidth;
        }
        th.style.width = div.style.width = width + "px";
    },
    getColumnWidth: function(index) {
        return tag("DIV", this.getColumnHeader(index)).clientWidth;
    },
    setRowHeight: function(index, height) {
        var th = this.getRowHeader(index),
            div = tag("DIV", th),
            sizer = tag("DIV", div)
        ;
        if (sizer && width < sizer.clientHeight) {
            height = sizer.clientHeight;
        }
        th.style.height = div.style.height = height + "px";
    },
    getRowHeight: function(index) {
        return tag("DIV", this.getRowHeader(index)).clientHeight;
    }
};

var ResizableDDSupport;
(ResizableDDSupport = function(config) {
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
                if (target.tagName==="DIV" && hasClass(target, "wxl_resize")) {
                    var pos = event.getXY(),
                        tabPos = position(table),
                        cls,
                        startDragEvent = ddHandler.startDragEvent,
                        dragProxy = ddHandler.dragProxy,
                        dragProxyStyle = dragProxy.style
                    ;
                    dragProxy.className = "";
                    if (hasClass(target, "wxl_resize_vertical")) {
                        if (config.rows===false) return false;

                        pos.y += target.clientHeight;
                        dragProxyStyle.width = table.clientWidth + "px";;
                        dragProxyStyle.height = "1px";
                        dragProxyStyle.top = (startDragEvent.top = (pos.y - tabPos.top)) + "px";
                        dragProxyStyle.left = "0px";
                        cls = "wxl_resizer_vertical";
                    }
                    else
                    if (hasClass(target, "wxl_resize_horizontal")) {
                        if (config.columns===false) return false;

                        pos.x += target.clientWidth;
                        dragProxyStyle.width = "1px";
                        dragProxyStyle.height = table.clientHeight + "px";
                        dragProxyStyle.left = (startDragEvent.left = (pos.x - tabPos.left)) + "px";
                        dragProxyStyle.top = "0px";
                        cls = "wxl_resizer_horizontal";
                    }
                    startDragEvent.cls = cls;
                    addClasses(dragProxy,  ["wxl_resizer", cls]);
                    return true;
                }
                return false;
            },
            whileDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    startDragEvent = ddHandler.startDragEvent,
                    startXY = startDragEvent.getXY(),
                    xy = event.getXY()
                ;
                switch (startDragEvent.cls) {
                    case "wxl_resizer_vertical":
                        dragProxy.style.top = (startDragEvent.top + (xy.y - startXY.y)) + "px";
                        break;
                    case "wxl_resizer_horizontal":
                        dragProxy.style.left = (startDragEvent.left + (xy.x - startXY.x)) + "px";
                        break;
                }
            },
            endDrag: function(event, ddHandler){
                var dragProxy = ddHandler.dragProxy,
                    startDragEvent = ddHandler.startDragEvent,
                    target = startDragEvent.target,
                    targetParent = target.parentNode,
                    startPos = startDragEvent.getXY(),
                    pos = event.getXY(),
                    clientDim, newDim, minDim
                ;
                dragProxy.className = "";
                if (hasClass(target, "wxl_resize_vertical")) {
                    clientDim = targetParent.clientHeight;
                    newDim = clientDim + (pos.y - startPos.y);
                    minDim = target.clientHeight;
                    targetParent.parentNode.parentNode.style.height = targetParent.parentNode.style.height = targetParent.style.height = (newDim >= minDim ? newDim : minDim) + "px";
                }
                else
                if (hasClass(target, "wxl_resize_horizontal")) {
                    clientDim = targetParent.clientWidth;
                    newDim = clientDim + (pos.x - startPos.x);
                    minDim = target.clientWidth;
                    targetParent.style.width = (newDim >= minDim ? newDim : minDim) + "px";
                    targetParent.parentNode.style.width = ((newDim >= minDim ? newDim : minDim) + 4) + "px"
                }
                worksheet.getKBHandler().focus();
            }
        });
    }
};

return Resizable;
});
