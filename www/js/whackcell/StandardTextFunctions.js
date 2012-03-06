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
            function: function(number) {
                return String.fromCharCode(number)
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
            function: function(text) {
                return text.replace(/[\x00-\x20]/g, "");
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
            function: function(text) {
                return text.charCodeAt(0);
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
            function: function(number, decimals) {
                if (typeof(number)!=="number") return NaN;
                if (typeof(decimals)==="undefined") decimals = 2;
                if (typeof(decimals)!=="number") return NaN;
                return "$ " + (number).toFixed(decimals);
            }
        },
        EXACT: {
            description: "Checks to see if two text values are identical",
            help: "Compares two text strings and returns TRUE if they are exactly the same, FALSE otherwise. EXACT is case-sensitive but ignores formatting differences. Use EXACT to test text being entered into a document.",
            arguments: [
                {
                    name: "text1",
                    description: "is the first text string.",
                    type: "string"
                },
                {
                    name: "text2",
                    description: "is the second text string.",
                    type: "string"
                }
            ],
            function: function(text1, text2){
                return text1===text2;
            }
        },
        FIND: {
            description: "Finds one text value within another (case-sensitive)",
            help: "FIND locates one text string within a second text string, and return the number of the starting position of the first text string from the first character of the second text string.",
            remarks: [
                "FIND is case sensitive and don't allow wildcard characters. If you don't want to do a case sensitive search or use wildcard characters, you can use SEARCH.",
                "If find_text is \"\" (empty text), FIND matches the first character in the search string (that is, the character numbered start_num or 1).",
                "Find_text cannot contain any wildcard characters.",
                "If find_text does not appear in within_text, FIND returns the #VALUE! error value.",
                "If start_num is not greater than zero, FIND returns the #VALUE! error value.",
                "If start_num is greater than the length of within_text, FIND returns the #VALUE! error value.",
                "Use start_num to skip a specified number of characters." +
                " Using FIND as an example, suppose you are working with the text string \"AYF0093.YoungMensApparel\"." +
                " To find the number of the first \"Y\" in the descriptive part of the text string, set start_num equal to 8 so that the serial-number portion of the text is not searched." +
                " FIND begins with character 8, finds find_text at the next character, and returns the number 9." +
                " FIND always returns the number of characters from the start of within_text, counting the characters you skip if start_num is greater than 1."
            ],
            arguments: [
                {
                    name: "find_text",
                    description: "is the text you want to find.",
                    type: "string"
                },
                {
                    name: "within_text",
                    description: "is the text containing the text you want to find.",
                    type: "string"
                },
                {
                    name: "start_num",
                    description: "specifies the character at which to start the search. The first character in within_text is character number 1. If you omit start_num, it is assumed to be 1.",
                    type: "number"
                }
            ],
            function: function(find, within, start){
                var r;
                switch (typeof(start)) {
                    case "undefined":
                        start = 1;
                    case "number":
                        if (start < 1) r = {
                            error: "start_num is not greater than zero"
                        }
                        else
                        if (start > within.length) r =  {
                            error: "start_num is greater than length of within"
                        }
                        else {
                            start -= 1;
                        }
                        break;
                    default:
                        r = {
                            error: "start_num must be a number"
                        };
                }
                if (!r) {
                    r = within.indexOf(find, start);
                    if (r === -1) r = {
                      error: "find_text does not appear in within_text"
                    }
                    else r += 1;
                }
                return r;
            }
        },
        FIXED: {
            description: "Formats a number as text with a fixed number of decimals",
            help: "Rounds a number to the specified number of decimals, formats the number in decimal format using a period and commas, and returns the result as text.",
            arguments: [
                {
                    name: "number",
                    description: "is the number you want to round and convert to text.",
                    type: "number"
                },
                {
                    name: "decimals",
                    description: "is the number of digits to the right of the decimal point.",
                    type: "number"
                },
                {
                    name: "no_commas",
                    description: " is a logical value that, if TRUE, prevents FIXED from including commas in the returned text.",
                    type: "boolean"
                }
            ],
            remarks: [
                "Numbers in whackcell can never have more than 15 significant digits, but decimals can be as large as 127.",
                "If decimals is negative, number is rounded to the left of the decimal point.",
                "If you omit decimals, it is assumed to be 2.",
                "If no_commas is FALSE or omitted, then the returned text includes commas as usual.",
                "The major difference between formatting a cell containing a number with the Cells command (Format menu) and formatting a number directly with the FIXED function is that FIXED converts its result to text. A number formatted with the Cells command is still a number."
            ],
            function: function(number, decimals, no_commas) {
                if (typeof(decimals)==="undefined") decimals = 2;
                if (decimals < 0) decimals = 0;
                number = (number).toFixed(decimals);
                if (no_commas !== "TRUE") {
                    var str, i = number.length;
                    if (decimals) {
                        str = "." + number.substr(i - decimals);
                        i -= (decimals + 2);
                    }
                    else str = number;
                    for (j = 1; i >= 0; i--, j++){
                        str = number[i] + str;
                        if (!(j % 3)) if (i) str = "," + str;
                    }
                    number = str;
                }
                return number;
            }
        },
        JIS: {
            description: "Changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters",
            help: "The function described in this Help topic converts half-width (single-byte) letters within a character string to full-width (double-byte) characters. The name of the function (and the characters that it converts) depends upon your language settings. For Japanese, this function changes half-width (single-byte) English letters or katakana within a character string to full-width (double-byte) characters.",
            arguments: [
                {
                    name: "text",
                    description: "is the text or a reference to a cell that contains the text you want to change. If text does not contain any half-width English letters or katakana, text is not changed.",
                    type: "string"
                }
            ]
        },
        LEFT: {
            description: "Returns the leftmost characters from a text value",
            help: "LEFT returns the first character or characters in a text string, based on the number of characters you specify.",
            arguments: [
                {
                    name: "text",
                    description: "is the text string that contains the characters you want to extract.",
                    type: "string"
                },
                {
                    name: "num_chars",
                    description: "specifies the number of characters you want LEFT to extract.",
                    type: "number"
                }
            ],
            function: function(text, num_chars) {
                if (typeof(num_chars)==="undefined") num_chars = 1;
                if (!(num_chars >= 0)) return {
                    error: "num_chars must be greater than or equal to zero."
                }
                return text.substr(0, num_chars);
            }
        },
        LOWER: {
            description: "Returns the leftmost characters from a text value",
            help: "Converts all uppercase letters in a text string to lowercase.",
            arguments: [
                {
                    name: "text",
                    description: "is the text you want to convert to lowercase. LOWER does not change characters in text that are not letters.",
                    type: "string"
                }
            ],
            function: function(text) {
                return text.toLowerCase();
            }
        }
    }
}

});
