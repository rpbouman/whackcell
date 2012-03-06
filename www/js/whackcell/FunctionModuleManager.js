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
    registerModuleFunction: function(moduleFunction) {
        var functionName = moduleFunction.name.toUpperCase();
        moduleFunction.name = functionName;
        this.functions[functionName] = moduleFunction;
        this.runtime[functionName] = moduleFunction["function"];
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
