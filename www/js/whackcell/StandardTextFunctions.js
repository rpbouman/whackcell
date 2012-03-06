define(function(require){

//see http://office.microsoft.com/en-us/excel-help/excel-functions-by-category-HP005204211.aspx#BMtext_functions

return {
    name: "Text",
    description: "Functions for manipulating text.",
    functions: {
        ASC: {
            description: "Changes full-width (double-byte) English letters or katakana within a character string to half-width (single-byte) characters",
            help: "For Double-byte character set (DBCS) languages, changes full-width (double-byte) characters to half-width (single-byte) characters.",
            arguments: [
                {
                    name: "text",
                    description: "is the text or a reference to a cell that contains the text you want to change. If text does not contain any full-width letters, text is not changed.",
                    type: "string"
                }
            ],
            examples: [
                {
                    code: "=ASC(\"EXCEL\") equals \"EXCEL\"",
                    description: "equals \"EXCEL\""
                }
            ]
        },
        BAHTTEXT: {
            description: "Converts a number to text, using the ß (baht) currency format",
            help: "Converts a number to Thai text and adds a suffix of \"Baht.\"",
            arguments: [
                {
                    name: "number",
                    description: "is a number you want to convert to text, or a reference to a cell containing a number, or a formula that evaluates to a number.",
                    type: "number"
                }
            ]
        },
        CHAR: {
            description: "Returns the character specified by the code number",
            help: "Returns the character specified by a number. Use CHAR to translate code page numbers you might get from files on other types of computers into characters.",
            arguments: [
                {
                    name: "number",
                    description: "is a number between 1 and 255 specifying which character you want. The character is from the character set used by your computer.",
                    type: "number"
                }
            ],
            examples: [
              {
                  code: "=CHAR(65)",
                  description: "Displays the 65 character in the set (A)"
              }
            ],
            function: function(c) {
                return String.fromCharCode(c)
            }
        },
        CLEAN: {
            description: "Removes all nonprintable characters from text",
            help: "Removes all nonprintable characters from text. Use CLEAN on text imported from other applications that contains characters that may not print with your operating system. For example, you can use CLEAN to remove some low-level computer code that is frequently at the beginning and end of data files and cannot be printed.",
            arguments: [
                {
                    name: "text",
                    description: "is any worksheet information from which you want to remove nonprintable characters.",
                    type: "string"
                }
            ],
            function: function(t) {
                return t.replace(/[\x00-\x20]/g, "");
            }
        },
        CODE: {
            description: "Returns a numeric code for the first character in a text string",
            help: "Returns a numeric code for the first character in a text string. The returned code corresponds to the character set used by your computer.",
            arguments: [
                {
                    name: "text",
                    description: "is the text for which you want the code of the first character.",
                    type: "string"
                }
            ],
            examples: {
              code: "=CODE(\"A\")",
              description: "Displays the numeric code for A (65)"
            },
            function: function(t) {
                return t.charCodeAt(0);
            }
        },
        CONCATENATE: {
            description: "Joins several text items into one text item",
            help: "Joins several text strings into one text string.",
            arguments: [
                {
                    name: "text1, text2, ...",
                    description: "are 1 to 30 text items to be joined into a single text item. The text items can be text strings, numbers, or single-cell references.",
                    type: "string"
                }
            ],
            function: function(){
                var a, s = "", i, n = arguments.length;
                for (i = 0; i < n; i++) {
                    a = arguments[i];
                    if (typeof(a) !== "string") a = String(a);
                    s += a;
                }
                return s;
            }
        },
        DOLLAR: {
            description: "Converts a number to text, using the $ (dollar) currency format",
            help: "The function described in this Help topic converts a number to text format and applies a currency symbol. The name of the function (and the symbol that it applies) depends upon your language settings. This function converts a number to text using currency format, with the decimals rounded to the specified place. The format used is $#,##0.00_);($#,##0.00).Joins several text strings into one text string.",
            arguments: [
                {
                    name: "number",
                    description: "is a number, a reference to a cell containing a number, or a formula that evaluates to a number.",
                    type: "number"
                },
                {
                    name: "decimals",
                    description: "is the number of digits to the right of the decimal point. If decimals is negative, number is rounded to the left of the decimal point. If you omit decimals, it is assumed to be 2.",
                    type: "number"
                }
            ],
            function: function(num, dec) {
                if (typeof(num)!=="number") return NaN;
                if (typeof(dec)==="undefined") dec = 2;
                if (typeof(dec)!=="number") return NaN;
                return "$ " + (num).toFixed(dec);
            }
        },
    }
}

});
