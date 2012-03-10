define(function(require){

require("js/utils.js");

var CellValues;
(CellValues = function(config) {
    this.config = config;
    this.init();
}).prototype = {
    CSS_PREFIX: "wxl_datatype_",
    init: function() {
        var config = this.config,
            worksheet = config.worksheet,
            pattern, groups = 0,
            patterns = {},
            formulaSupport = config.formulaSupport,
            formulaHelper
        ;
        if (formulaSupport) {
            formulaHelper = formulaSupport.createCellValueHelper();
            patterns[formulaHelper.name] = formulaHelper;
            formulaSupport.worksheet = worksheet;
        }
        worksheet.valueHelper = this;
        worksheet.setCellContent = this.setCellContent;
        worksheet.getCellContent = this.getCellContent;
        worksheet.setCellValue = this.setCellValue;
        worksheet.getCellValue = this.getCellValue;
        pattern = "";
        this.patterns = merge(patterns, config.patterns || CellValues.patterns);
        forPinO(this.patterns, function(p, o){
            var source;
            o.name = p;
            if (pattern.length) pattern += "|";
            source = o.regexp.source;
            o.startGroup = ++groups;
            groups += numGroups(source);
            o.endGroup = groups + 1;
            pattern += "(" + source + ")";
        });
        this.regexp = new RegExp("^" + pattern + "$", "i");
    },
    setCellContent: function(cell, content) {
        var valueHelper = this.valueHelper,
            formulaSupport = valueHelper.config.formulaSupport,
            obj = valueHelper.parse(content, cell),
            value = obj.value,
            type = obj.type,
            typeName,
            CSS_PREFIX = valueHelper.CSS_PREFIX,
            className = cell.className = normalizeSpace(cell.className.replace(
                new RegExp("\\b" + CSS_PREFIX + "\\w+\\b", "g"),
                ""
            ))
        ;
        if (obj.error) this.setCellError(cell, obj.error);
        sAtt(cell, "data-content", content);
        this.setCellValue(cell, value, type);
        if (formulaSupport) formulaSupport.updateDependencies(cell);
    },
    setCellValue: function(cell, value, type) {
        var className = cell.className,
            typeName,
            valueHelper = this.valueHelper,
            CSS_PREFIX = valueHelper.CSS_PREFIX
        ;
        cell.value = value;
        if (type) {
            typeName = type.name;
            className = className + " " + CSS_PREFIX + typeName;
            if (typeName === "formula") {
                typeName = typeof(value);
                switch(typeName) {
                    case "string":
                    case "number":
                    case "boolean":
                        break;
                    case "object":
                        if (value.constructor === Date) typename = "date";
                        else typeName = null;
                        break;
                    default:
                        typeName = null;
                }
                if (typeName) className += " " + CSS_PREFIX + typeName;
            }
            cell.className = normalizeSpace(className);
            value = type.toText(value);
        }
        this.setCellText(cell, value);
    },
    getCellValue: function(cell) {
        var value = cell.value;
        if (isUnd(value)) value = CellValues.prototype.getCellContent(cell);
        return value;
    },
    getCellContent: function(cell) {
        var content = gAtt(cell, "data-content");
        return (content === null) ? txt(cell) : content;
    },
    parse: function(text, cell){
        var value, items = this.regexp.exec(text);
        if (!items) return {
            value: text
        };
        if(forPinO(this.patterns, function(p, o){
            if (items[o.startGroup] !== text) return;
            value = o.parser(items.slice(o.startGroup, o.endGroup), cell);
            value.type = o;
            return false;
        })) return {
            value: text
        };
        return value;
    }
};

CellValues.patterns = {
    string: {
        regexp: /'(.+)/,
        parser: function(arr){
            return {
                value: arr[0].substr(1)
            };
        },
        toText: function(value){
            return value;
        }
    },
    date: {
        //see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Date/parse
        //see http://www.w3.org/TR/NOTE-datetime and http://tools.ietf.org/html/rfc822#section-5
        regexp: /(\d{2,4}[\/\.\-]\d{1,2}([\/\.\-]\d{1,2}(T\d\d:\d\d(:\d\d)?(Z|[+-]\d\d:\d\d))?)?)|(((Mon?|Tue?|Wed?|Thu?|Fri?|Sat?|Sun?),?\s*)?\d{1,2}\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*\d{1,4}(\s+\d\d:\d\d(:\d\d(\s+(UT|GMT|EST|EDT|CST|CDT|MST|MDT|PST|PDT|Z|A|M|N|Y|([+-]\s*\d{4})))?)?)?)/,
        parser: function(arr){
            var ts = Date.parse(arr[0]), obj = {};
            if (isNaN(ts)) obj.error = "Invalid date";
            else obj.value = new Date(ts);
            return obj;
        },
        toText: function(value) {
            return value.toString();
        }
    },
    number: {
        regexp: /[+-]?((((\d+)|(\d{1,3}(,\d{3})+))(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?/,
        parser: function(arr){
            return {
                value: Number(arr[0].replace(",", ""))
            };
        },
        toText: function(value) {
            return String(value);
        }
    },
    boolean: {
        regexp: /([Ff][Aa][Ll][Ss][Es])|([Tt][Rr][Uu][Ee])/,
        parser: function(arr){
            var value = {};
            switch(arr[0].toLowerCase()) {
                case "true":
                  value.value = true;
                  break;
                case "false":
                  value.value = false;
                  break;
            }
            return value;
        },
        toText: function(value){
            return String(value).toUpperCase();
        }
    }
};

return CellValues;
});
