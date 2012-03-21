define(function(require){

var FunctionModuleManager;
(FunctionModuleManager = function(config) {
    this.runtime = {};
    this.functions = {};
    this.modules = {};
    this.registerModule({
        name: "Uncategorized",
        description: "Various functions of no particular category.",
        functions: {}
    });
    this.config = config;
    if (config.modules) this.registerModules(config.modules);
}).prototype = {
    getFunction: function(name) {
        return this.functions[name];
    },
    isModuleFunctionRegistered: function(name) {
        return this.getFunction(name);
    },
    registerModuleFunction: function(moduleFunction) {
        var functionName = moduleFunction.name.toUpperCase(),
            func = moduleFunction.function,
            assertion
        ;
        moduleFunction.name = functionName;
        this.functions[functionName] = moduleFunction;
        assertion = this.createModuleFunctionAssertion(moduleFunction);
        func = moduleFunction.function;
        if (!isFunc(func)) func = function() {
            throw {
                message: functionName + " is not implemented!"
            };
        };
        this.runtime[functionName] = assertion ? function() {
            var args = assertion.apply(this, arguments);
            return func.apply(this, args);
        } : func;
    },
    createModuleFunctionAssertion: function(moduleFunction) {
        var args = moduleFunction.arguments,
            funcName = moduleFunction.name,
            ex = " throw {"+
                "\nfunction:\"" + funcName + "\"," +
                "\ntype:\"value error\"," +
                "\ncode:\"%code%\"," +
                "\nmessage:\"%message%\"" +
            "\n};",
            i, arg, n = args ? args.length : 0,
            argMandatory = true, numMandatoryArgs = 0,
            argName, type, hasMin, min, hasMax, max, def, exp, isStr,
            assertionFunctionText = "", message, code,
            multipleArgs
        ;
        //
        function getThrow(code, message) {
            return ex.replace(/%code%/g, code).replace(/%message%/g, message.replace(/"/g, "\\\""));
        };
        //utility to quote values if necessary
        function lit(val) {
            if (isStr) val = "\"" + val.replace(/"/g, "\\\"") +"\"";
            return val;
        };
        //add a check for each declared argument
        for (i = 0; i < n; i++) {
            arg = args[i];

            if (argMandatory && (arg.mandatory !== false)) ++numMandatoryArgs;
            else argMandatory = false;

            isStr = ((type = arg.type) === "string");
            if (hasMin = !isUnd(min = arg.min)) min = lit(min);
            if (hasMax = !isUnd(max = arg.max)) max = lit(max);
            if (type || hasMin || hasMax) {
                argName = arg.name;
                message = "Argument \"" + argName + "\" at position " + (i+1) + " must ";
                exp = "\na = arguments["+i+"];";
                if (type) exp += "\nif (typeof(a) !== \"" + type + "\")" + getThrow("#VALUE!", message + "have the " + type + " datatype.");
                code = (type === "number" ? "#NUM!" : "#VALUE!");
                if (hasMin) exp += "\nif (a < " + min + ")" + getThrow(code, message + "not be less than " + min + ".");
                if (hasMax) exp += "\nif (a > " + max + ")" + getThrow(code, message + "not be greater than " + max + ".");
                if (!argMandatory) {
                    exp = "\nif (n > "+i+"){" +
                    "\n"+ exp +
                    "\n}";
                    if (!isUnd(def = arg.default)) exp += "\nelse arguments["+i+"] = " + lit(def);
                }
                assertionFunctionText += exp;
            }
        }
        multipleArgs = arg ? (arg.multiple === true) : false;
        //handle flexible number of arguments. Only the last argument declaration may be a multiple
        if (multipleArgs) {
            if (exp) {
              exp.replace(/a = arguments\[\d+\]/g, "a = arguments[i]");
              assertionFunctionText += "\nfor (var i = " + i + "; i < n; i++) {" + exp + "\n}";
            }
        }
        else assertionFunctionText = "\nif (n > " + n + ") " +
                                      getThrow("#VALUE!", "Too many arguments: expected at most " + n + " arguments.") +
                                      assertionFunctionText;
        //precede individual argument checks with general check for the number of arguments
        if (numMandatoryArgs) assertionFunctionText = "\nif (n < " + numMandatoryArgs + ") " +
                                                      getThrow("#N\/A", "Not enough arguments: expected at least " + numMandatoryArgs + " arguments.") +
                                                      assertionFunctionText;
        if (assertionFunctionText.length) assertionFunctionText = "var n = arguments.length" +
                                                                  (arg ? ", a" : "") + ";" +
                                                                  assertionFunctionText;
        assertionFunctionText = (assertionFunctionText.length ? assertionFunctionText : "") + "\nreturn arguments;"
        return assertionFunctionText.length ? new Function(assertionFunctionText) : null;
    },
    registerModule: function(module) {
        var moduleName = module.name,
            moduleFunctions = module.functions,
            functionName, func
        ;
        for (functionName in moduleFunctions) {
            func = moduleFunctions[functionName];
            func.module = moduleName;
            func.name = functionName;
            this.registerModuleFunction(func);
        }
    },
    registerModules: function(modules) {
        var i, n = modules.length;
        for (i = 0; i < n; i++) this.registerModule(modules[i]);
    },
    getRuntime: function() {
        return this.runtime;
    },
    findFunctions: function(searchString, categories) {
        //TODO: implement. Use for autocomplete/suggestion UI.
    }
};

return FunctionModuleManager;

});
