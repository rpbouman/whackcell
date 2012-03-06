define(function(require) {

require("js/utils.js");

var DataGrid = require("js/whackcell/DataGrid.js")
var CellValues = require("js/whackcell/CellValues.js");

var FormulaSupport;
(FormulaSupport = function(config) {
    if (!config) config = {};
    this.config = config;
    this.init();
    this.formulas = {
        //map:
        //key = canonical formula text
        //value = {generated id, refcount}
    };
    this.compiledFunctions = {
        //maps:
        //key = formula id (values in formulas map)
        //value = compiled formula (function)
    };
    this.parser = new FormulaParser();
    this.runtime = config.moduleManager ? config.moduleManager.getRuntime() : null;
}).prototype = {
    init: function() {
    },
    resolveCell: function(rows, cellDef){
        var cell;
        switch (cellDef.format) {
            case "A1":
                cell = rows.item(cellDef.row).cells.item(cellDef.col);
                break;
            case "R1C1":
                cell = rows.item(
                    row.rowIndex + (cellDef.rowInc ? cellDef.rowInc : 0)
                ).cells.item(
                    cell.cellIndex + (cellDef.colInc ? cellDef.colInc : 0)
                );
                break;
            default:
                throw "Invalid parameter";
        }
        return cell;
    },
    getCellRows: function(cell) {
        return cell.parentNode.parentNode.parentNode.rows;
    },
    getDependencies: function(cell){
        var dependencies = gAtt(cell, "data-dependent-cells");
        return dependencies ? JSON.parse(dependencies) : [];
    },
    sortDependencies: function(cell) {
        var me = this,
            allDependencies = me.getAllDependencies(cell),
            dependencies = [], r, rD, c,
            rows = me.getCellRows(cell),
            row
        ;
        for (r in allDependencies) {
            row = rows.item(parseInt(r, 10));
            rD = allDependencies[r];
            for (c in rD) {
                dependencies.push(row.cells.item(parseInt(c, 10)));
            }
        }
        dependencies.sort(function(a, b){
            allDependencies = me.getAllDependencies(a);
            c = b.cellIndex;
            r = b.parentNode.rowIndex;
            rD = allDependencies[r];
            if (!rD) return 1;      //if b does not depend on a, evaluate b first
            if (rD[c]) return -1;   //if b depends upon a, evaluate a first
            return 1;               //if b does not depend on a, evaluate b first
        });
        return dependencies;
    },
    updateDependencies: function(cell){
        var dependencies = this.sortDependencies(cell),
            i, n = dependencies.length, dependency
        ;
        for (i = 0; i < n; i++) {
            dependency = dependencies[i];
            this.dataGrid.setCellValue(
                dependency,
                this.calculate(dependency),
                this.valueHelper
            );
        }
    },
    getAllDependencies: function(cell){
        var rows = this.getCellRows(cell),
            cells = [], i = 0, a = {},
            r, c, rA, dependencies, j, n, dependency;
        do {
            dependencies = this.getDependencies(cell);
            n = dependencies.length;
            for (j = 0; j < n; j++) {
                dependency = dependencies[j];
                r = dependency.r;
                if (!(rA = a[r])) rA = a[r] = {};
                c = dependency.c;
                if (!(rA[c])) {
                    rA[c] = true;
                    cells.push(rows.item(r).cells.item(c));
                }
            }
        } while (cell = cells[i++]);
        return a;
    },
    registerCellDependency: function(cell, dependsOn){
        var circRef = {
            message: "Circular reference"
        }
        if (cell === dependsOn) throw circRef;
        var dependencies = this.getDependencies(dependsOn),
            i, dependency, n = dependencies.length,
            r = cell.parentNode.rowIndex,
            c = cell.cellIndex,
            allDependencies, rAllDependencies,
            cDependencies
        ;
        //check if the dependency exists alreay
        for (i = 0; i < n; i++) {
            dependency = dependencies[i];
            if(dependency.r===r && dependency.c===c) return;
        }
        //check if it would introduce a circular dependency
        allDependencies = this.getAllDependencies(cell);
        rAllDependencies = allDependencies[dependsOn.parentNode.rowIndex];
        if (rAllDependencies && rAllDependencies[dependsOn.cellIndex]) throw circRef;
        dependencies.push({r:r, c:c});
        sAtt(dependsOn, "data-dependent-cells", JSON.stringify(dependencies));
    },
    calculate: function(cell) {
        var formula = gAtt(cell, "data-formula");
        if (!formula) throw "Not a formula";
        formula = JSON.parse(formula);

        var params, n;
        if (params = formula.params) {
            if (!isArr(params)) throw "Invalid parameters";
            n = params.length;
        }
        else n = 0;

        var id = formula.id;
        if (isUnd(id)) throw "Invalid formula";
        if (isUnd(formula = this.compiledFunctions[id])) throw "Invalid formula";

        var i, param, paramCell, args=[], rows = this.getCellRows(cell);
        for (i = 0; i < n; i++) {
            param = params[i];
            if (!isUnd(param.value)) {
                args[i] = param.value;
                continue;
            }
            paramCell = this.resolveCell(rows, param.cell);
            args[i] = CellValues.prototype.getCellValue(paramCell);
        }
        return formula.func.apply(this.runtime, args);
    },
    clearFormula: function(cell) {
        var formula = gAtt(cell, "data-formula");
        if (!formula) return;
        formula = JSON.parse(formula);
        //clean up dependencies
        var params;
        if (params = formula.params) {
            if (!isArr(params)) throw "Invalid parameters";
            var i, n = params.length, param, paramCell;
            for (i = 0; i < n; i++){
                param = params[i];
                if (isUnd(param.cell)) continue;
                paramCell = this.resolveCell(rows, param.cell);
                this.unRegisterCellDependency(cell, paramCell);
            }
        }
        //clean up formula.
        var id = formula.id,
            func = this.compiledFunctions[id],
            text = func.text;
        ;
        formula = this.formulas[text];
        if (!(--formula.refCount)) {
            del(this.compiledFunctions, id);
            del(func);
            del(this.formulas, text);
            del(formula);
        }
    },
    createCellValueHelper: function(){
        var me = this;
        if (!me.valueHelper) me.valueHelper = {
            regexp: /=(.+)/,
            name: "formula",
            parser: function(arr, cell){
                var parseTree,
                    formulaId, formulaText, formula,
                    formulas = me.formulas,
                    compiledFunctions = me.compiledFunctions,
                    params = [],
                    n, i, param,
                    dependsOn,
                    rows = me.getCellRows(cell),
                    retValue
                ;
                try {
                    parseTree = me.parser.parse(arr[1], cell);
                    formulaText = me.compile(parseTree, params);
                    n = params.length;
                    if (!(formula = formulas[formulaText])){
                        //for now, formulaId === formulaText. TODO: compress.
                        formulaId = formulaText;
                        formula = {
                            id: formulaId,
                            refCount: 1
                        };
                        formulas[formulaText] = formula;
                        var args = [];
                        for (i = 0; i < n; i++) {
                            param = params[i];
                            args.push(param.name);
                        }
                        args.push("return " + formulaText + ";");
                        compiledFunctions[formulaId] = {
                            text: formulaText,
                            func: Function.apply(null, args)
                        };
                    }
                    else {
                        formulaId = formula.id;
                        formula.refCount++;
                    }

                    sAtt(cell, "data-formula", JSON.stringify({
                        id: formulaId,
                        params: params
                    }));

                    //register dependencies to referenced cells
                    for (i = 0; i < n; i++) {
                        param = params[i];
                        if (!param.cell) continue;
                        dependsOn = me.resolveCell(rows, param.cell);
                        me.registerCellDependency(cell, dependsOn);
                    }
                    retValue = {
                        value: me.calculate(cell)
                    };
                }
                catch (exception) {
                    retValue = {
                        error: exception.message
                    };
                }
                return retValue;
            },
            toText: function(value) {
                return String(value);
            }
        };
        return me.valueHelper;
    },
    compile: function(node, params) {
        var tokenClasses = this.parser.tokenClasses,
            tc = tokenClasses[node.c],
            s, p, a, c
        ;
        if (s = tc.semantics) {
            if (a = node.l) s = s.replace(/_l/g, this.compile(a, params));
            if (a = node.r) s = s.replace(/_r/g, this.compile(a, params));
            if (a = node.n) {
                switch (node.c) {
                    case "func":
                      a = "this." + a;
                      break;
                    case "relop0":
                    case "relop2":
                      a = "=" + a;
                      break;
                }
                s = s.replace(/_n/g, a);
            }
            if (a = node.a) {
                var t = "";
                if (isArr(a)){
                    var i = 0, n = a.length;
                    for (; i < n; i++) {
                        if (t.length) t += ",";
                        t += this.compile(a[i], params);
                    }
                }
                else t = this.compile(a, params);
                s = s.replace(/_a/g, t);
            }
        }
        else {
            s = ""
            if (tc.type !== "operand") throw "Unexpected parse node type (not an operand)";
            n = "_" + params.length;
            p = {name: n};
            if (tc.name === "cell") p.cell = node;
            else p.value = node.v;
            params.push(p);
            s += n;
        }
        return s;
    }
};

var FormulaParser;
(FormulaParser = function(config) {
    this.config = config;
    this.init();
}).prototype = {
    name: "formula",
    tokenClasses: {
        whitespace: {
            patt: /\s+/,
            type: "separator"
        },
        ":": {
            patt: /:/,
            type: "binary",
            precedence: 90,
            semantics: "Range(_l,_r)"
        },
        "~": {
            patt: /~/,
            type: "binary",
            precedence: 90,
            semantics: "Intersect(_l,_r)"
        },
        "!": {
            patt: /!/,
            type: "binary",
            precedence: 90,
            semantics: "Union(_l,_r)"
        },
        "%": {
            patt: /%/,
            type: "post",
            precedence: 80,
            semantics: "(_l/100)"
        },
        "unop": {
            type: "pre",
            precedence: 80,
            semantics: "_n_r"
        },
        "^": {
            patt: /\^/,
            type: "binary",
            precedence: 70,
            semantics: "_l_n_r"
        },
        "[*\/]": {
            patt: /[\*\/]/,
            type: "binary",
            precedence: 60,
            semantics: "_l_n_r"
        },
        "[+-]": {
            patt: /[+-]/,
            type: "binary",
            precedence: 50,
            semantics: "_l_n_r"
        },
        "&": {
            patt: /&/,
            type: "binary",
            precedence: 40,
            semantics: "String(_l)+String(_r)"
        },
        relop0: {
            patt: /==/,
            type: "binary",
            precedence: 30,
            semantics: "_l_n_r"
        },
        relop1: {
            patt: /<=|>=|<>|>|</,
            type: "binary",
            precedence: 30,
            semantics: "_l_n_r"
        },
        relop2: {
            patt: /=/,
            type: "binary",
            precedence: 30,
            semantics: "_l_n_r"
        },
        "[,;]": {
            patt: /[,;]/,
            type: "binary",
            precedence: 20,
            semantics: "_l,_r"
        },
        "(": {
            patt: /\(/,
            type: "left",
            precedence: 10,
            semantics: "(_a)"
        },
        ")": {
            patt: /\)/,
            type: "right",
            precedence: 10
        },
        func: {
            semantics: "_n(_a)"
        },
        num: {
            patt: /[+-]?((((\d+)|(\d{1,3}(,\d{3})+))(\.\d*)?)|(\.\d+))([eE][+-]?\d+)?/,
            type: "operand"
        },
        str: {
            patt: /"(([^"]|"")*)"/,
            type: "operand"
        },
        cell: {
            patt: /(([Rr]((\[([+-]?\d+)\]|\d*)))([Cc](\[([+-]?\d+)\]|(\d*))))|(((\$)?([A-Za-z]+))((\$)?(\d+)))/,
            type: "operand"
        },
        name: {
            patt: /\w+/,
            type: "operand"
        }
    },
    init: function() {
        var allTokens = "",
            tokenClasses = this.tokenClasses,
            tokenClass, patt,
            groups = 1,
            tokenTypes = (this.tokenTypes = {})
        ;
        forPinO(tokenClasses, function(name, tokenClass){
            tokenClass.name = name;
            if (!tokenClass.patt) return;
            if (allTokens.length) allTokens += "|";
            patt = tokenClass.patt.source;
            groups += 1;
            allTokens += "(" + patt + ")";

            tokenClass.groups = numGroups(patt);
            tokenTypes[String(groups)] = tokenClass;
            groups += tokenClass.groups;
        })
        this.regexp = new RegExp("(" + allTokens + ")", "g");
    },
    setText: function(text){
        this.text = text;
        this.regexp.lastIndex = 0;
        this.from = 0;
    },
    nextToken: function(){
        var items = this.regexp.exec(this.text),
            tokenTypes = this.tokenTypes,
            item, i, tokenType, groups
        ;
        if (items === null) throw "Match Error";
        for (i in tokenTypes) {
            i = parseInt(i, 10);
            item = items[i];
            if (!item) continue;
            tokenType = tokenTypes[i];
            return {
                type: tokenType.type,
                c: tokenType.name,
                groups: (groups = items.splice(i, tokenType.groups + 1)),
                f: this.from,
                t: (this.from += groups[0].length)
            };
        }
    },
    tokenize: function(text) {
        var tokenClasses = this.tokenClasses,
            lparen = tokenClasses["("],
            rparen = tokenClasses[")"],
            firstToken, token,
            length = text.length,
            groups,
            prevToken = (firstToken = {
                type: lparen.type,
                c: lparen.name
            });
        this.setText(text);
        do {
            token = this.nextToken();
            groups = token.groups;
            if (token.type === "separator") continue;
            switch (token.c) {
                case "str":
                    token.v = groups[1].replace(/""/, "\"");
                    break;
                case "num":
                    token.v = Number(groups[0].replace(/,/, ""))
                    break;
                case "cell":
                    if (groups[1]) {
                        token.format = "R1C1";
                        if (groups[5]) token.colInc = parseInt(groups[5], 10);
                        if (groups[8]) token.rowInc = parseInt(groups[8], 10);
                    }
                    else
                    if (groups[10]){
                        token.format = "A1";
                        token.fixedCol = (groups[12] ? true : false);
                        token.col = DataGrid.getColumnIndex(groups[11]);
                        token.fixedRow = (groups[15] ? true : false);
                        token.row = parseInt(groups[16], 10);
                    }
                    break;
                default:
                    token.n = groups[0];
            };
            token.prevToken = prevToken;
            prevToken.nextToken = token;
            prevToken = token;
            delete token.groups;
        } while (token.t < length);
        token = {
            type: rparen.type,
            c: rparen.name,
            prevToken: prevToken
        };
        prevToken.nextToken = token;
        return {
            firstToken: firstToken,
            lastToken: token
        };
    },
    parse: function(text) {
        var tokenClasses = this.tokenClasses,
            tokens, firstToken, lastToken, token, prevToken;
        tokens = this.tokenize(text);
        token = prevToken = firstToken = tokens.firstToken;
        lastToken = tokens.lastToken;
        outer: while (token = token.nextToken) {
            if (token.type === "operand") continue;
            if (token.c === "[+-]" && token.prevToken.type !== "operand") {
                token.type = "pre";
                token.c = "unop";
            }
            while (
                (tokenClasses[prevToken.c].precedence >= tokenClasses[token.c].precedence)
            &&  (token.type !== "left" && token.type !== "pre")
            ) {
                tokens = this.reduce(prevToken, token);
                token = tokens.token;
                prevToken = tokens.prevToken;
                if (!(token && prevToken)) break outer;
            };
            prevToken = token;
        };
        if (firstToken.r !== lastToken) {
            this.throwException("Parse exception", null, null);
        }
        return firstToken.a;
    },
    throwException: function(message, oprtr, oprnd){
        throw {
            text: this.text,
            message: message,
            "operator": {
                from: oprtr.f,
                to: oprtr.t
            },
            operand: {
                from: oprnd.f,
                to: oprnd.t
            }
        }
    },
    reduce: function(prevToken, token) {
        var type = prevToken.type, left, right, arg, args, name;
        if (type === "left") {          //left parenthesis
            arg = prevToken.nextToken;

            if ((name = prevToken.prevToken) && name.c === "name") {    //name precedes left parenthesis: this is a function
                prevToken.c = "func";
                prevToken.n = name.n.toUpperCase();
                prevToken.f = name.f;
                if (prevToken.prevToken = name.prevToken) name.prevToken.nextToken = prevToken;
                del(name, "nextToken", "prevToken", "type");

                args = prevToken.a = [];
                if (arg && arg.type === "operand") {        //unwrap arguments tree to arguments list.
                    while (arg.c === "[,;]") {
                        args.unshift(arg.r);
                        arg = arg.l;
                    }
                    if (arg) args.unshift(arg);
                    del(arg, "nextToken", "prevToken");
                    right = token;
                }
                else right = arg;   //no arguments, reset so we can find the right parenthesis.
            }
            else
            if ((!arg) || (arg.type !== "operand")) {       //not a function. In this case, parenthesis cannot be empty
                this.throwException("Missing operand", prevToken, operand);
            }
            else {                                          //parenthesis not empty, store contents.
                prevToken.a = arg;
                right = arg.nextToken;
                del(arg, "nextToken", "prevToken", "type");
            }

            if ((!right) || (right.type !== "right")) {
                this.throwException("Missing right parenthesis", prevToken, right);
            }
            token = right.nextToken;
        }
        else {
            if (type !== "pre") {
                if (!(left = prevToken.prevToken) || (left.type !== "operand")) {
                    this.throwException("Missing left operand", prevToken, left);
                }
                prevToken.l = left;
                prevToken.prevToken = left.prevToken;
                if (left.prevToken) left.prevToken.nextToken = prevToken;

                del(left, "nextToken", "prevToken", "type", "f", "t");
            }
            if (type !== "post" && (!(right = prevToken.nextToken) || (right.type !== "operand"))) {
                this.throwException("Missing right operand", prevToken, right);
            }
        }

        if (type !== "post") {
            if (type === "left") {
                if (prevToken.prevToken) prevToken.t = right.t  //left parentheses spans string up to closing right parentheses
                else prevToken.r = right;                       //for outmost left parentheses, store the closing right parentheses (checksum)
            }
            else prevToken.r = right;                           //binary and prefix operators store the right argument

            prevToken.nextToken = right.nextToken;
            if (right.nextToken) right.nextToken.prevToken = prevToken;
            del(right, "nextToken", "prevToken", "type", "f", "t");
        }
        prevToken.type = "operand";
        var r = {
            prevToken: prevToken.prevToken,
            token: token
        };
        return r;
    }
};

return FormulaSupport;
});
