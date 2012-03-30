define(function(require){

return {
    name: "Experimental",
    description: "Functions for R&D.",
    functions: {
        HTML: {
            description: "Write HTML to the specified output cell",
            help: "",
            arguments: [
                {
                    name: "text",
                    description: "Html text.",
                    type: "string"
                },
                {
                    name: "cell",
                    description: "Output cell.",
                    type: "cell"
                }
            ]
        }
    }
};

});
