define(function(require){

require("js/utils.js");

var CascadingStyleSheet;
(CascadingStyleSheet = function(config){
    this.config = config = merge(config, {
        enabled: true,
        rules: {}
    });
    if (config.id){
        this.style = el(config.id);
        if (this.style!==null) {
            //todo: load the rules
        }
    }
}).prototype = {
    render: function(){
        var me = this,
            config = me.config
        ;
        me.style = crEl("STYLE", {
            type: "text/css",
            id: config.id
        }, null, head);
        if (config.rules) {
            me.addRules(config.rules);
        }
    },
    enable: function(enabled){
        this.config.enabled = enabled;
        if (this.style) {
            this.style.disabled = !enabled;
        }
    },
    getRule: function(selector){
        var ruleset = this.getRuleSet(), rule = null;
        selector = selector.toUpperCase();
        forIinA(ruleset, function(i, r){
            if (r.selectorText.toUpperCase()===selector) {
                rule = r;
                return false;
            }
        });
        return rule;
    },
    getStyle: function(selector) {
        var rule;
        if (rule = this.getRule(selector)) return rule.style;
        return null;
    },
    unApplyStyle: function(selector, style){
        var s = this.getStyle(selector);
        if (s === null) return;
        merge(s, style, merge.DELETE);
    },
    applyStyle: function(selector, style, create){
        var r = this.getRule(selector);
        if (r === null) {
            if (create !== false) this.addRule(selector, style);
            return;
        }
        merge(r.style, style, merge.OVERWRITE);
    },
    getCssText: function(properties) {
        var property, value, cssText = "";
        for (property in properties){
            if (properties.hasOwnProperty(property)) {
                value = properties[property];
                if (value === null) continue;
                if (cssText !== "") cssText += ";";
                cssText += "\n" + property + ": " + value;
            }
        }
        return cssText;
    },
    addRule: function(selector, properties){
        var stylesheet, styles, property, value, index;
        if (arguments.length === 1) {
            properties = selector.properties;
            selector = selector.selector;
        }
        if (isStr(properties)) styles = properties;
        else
        if (isObj(properties)) styles = this.getCssText(properties);
        if (stylesheet = this.style.styleSheet) {   //IE
            index = stylesheet.addRule.call(stylesheet, selector, styles);
        }
        else
        if (stylesheet = this.style.sheet) {
            if (stylesheet.addRule) {               //chrome
                index = stylesheet.addRule.call(stylesheet, selector, styles);
            }
            else
            if (stylesheet.insertRule) {            //opera, firefox
                index = stylesheet.insertRule.call(
                    stylesheet,
                    selector + "{" + styles + "}",
                    stylesheet.cssRules.length
                );
            }
        }
        else throw "No stylesheet";
    },
    addRules: function(rules){
        if (isObj(rules)){
            if (isArr(rules)){
                var i, n = rules.length, rule;
                for (i = 0; i < n; i++){
                    rule = rules[i];
                    this.addRule(rule.selector, rule.styles);
                }
            }
            else for (selector in rules) if (rules.hasOwnProperty(selector)) this.addRule(selector, rules[selector]);
        }
        return true;
    },
    getRuleSet: function(){
        if (!this.style) return null;
        var sheet = this.style.sheet || this.style.styleSheet;
        return sheet.rules || sheet.cssRules;
    },
    getRules: function(selector){
        var r = {};
        if (isStr(selector)) selector = [selector];
        else
        if (isArr(selector)){

        }
        else
        if (isObj(selector)){

        }
        return r;
    }
};

return CascadingStyleSheet;
});
