define(function(require){

//see http://office.microsoft.com/en-us/excel-help/excel-functions-by-category-HP005204211.aspx#BMtext_functions

function escapeRegex(string) {
    return string.replace(/[\\\^\$\*\+\?\.\(\)\[\]\{\}]/g, "\\$&");
}

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
                if (typeof(text)!=="string") text = String(text);
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
                if (typeof(text)!=="string") text = String(text);
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
                return text1 === text2;
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
                if (typeof(within)!=="string") within = String(text);
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
                if (no_commas !== true) {
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
                if (typeof(text)!=="string") text = String(text);
                return text.substr(0, num_chars);
            }
        },
        LEN: {
            description: "Returns the number of characters in a text string",
            help: "LEN returns the number of characters in a text string.",
            arguments: [
                {
                    name: "text",
                    description: "is the text whose length you want to find. Spaces count as characters.",
                    type: "string"
                }
            ],
            function: function(text) {
                if (typeof(text)!=="string") text = String(text);
                return text.length;
            }
        },
        LOWER: {
            description: "Converts text to lowercase",
            help: "Converts all uppercase letters in a text string to lowercase.",
            arguments: [
                {
                    name: "text",
                    description: "is the text you want to convert to lowercase. LOWER does not change characters in text that are not letters.",
                    type: "string"
                }
            ],
            function: function(text) {
                if (typeof(text)!=="string") text = String(text);
                return text.toLowerCase();
            }
        },
        MID: {
            description: "Returns a specific number of characters from a text string starting at the position you specify",
            help: "MID returns a specific number of characters from a text string, starting at the position you specify, based on the number of characters you specify.",
            arguments: [
                {
                    name: "text",
                    description: "is the text string containing the characters you want to extract.",
                    type: "string"
                },
                {
                    name: "start_num",
                    description: "is the position of the first character you want to extract in text. The first character in text has start_num 1, and so on.",
                    type: "number"
                },
                {
                    name: "Num_chars",
                    description: "specifies the number of characters you want MID to return from text.",
                    type: "number"
                }
            ],
            remarks: [
                "If start_num is greater than the length of text, MID returns \"\" (empty text).",
                "If start_num is less than the length of text, but start_num plus num_chars exceeds the length of text, MID returns the characters up to the end of text.",
                "If start_num is less than 1, MID returns the #VALUE! error value.",
                "If num_chars is negative, MID returns the #VALUE! error value.",
                "If num_bytes is negative, MIDB returns the #VALUE! error value."
            ],
            function: function(text, start, num) {
                if (start < 1) return {
                    error: "start_num is less than 1"
                }
                else
                if (num < 0) return {
                    error: "num_chars is negative"
                }
                if (typeof(text)!=="string") text = String(text);
                return text.substr(start - 1, num);
            }
        },
        PHONETIC: {
            description: "Extracts the phonetic (furigana) characters from a text string",
            help: "Extracts the phonetic (furigana) characters from a text string.",
            arguments: [
                {
                    name: "reference",
                    description: "is a text string or a reference to a single cell or a range of cells that contain a furigana text string.",
                    type: "string"
                }
            ],
            remarks: [
                "If reference is a range of cells, the furigana text string in the upper-left corner cell of the range is returned.",
                "If the reference is a range of nonadjacent cells, the #N/A error value is returned."
            ]
        },
        PROPER: {
            description: "Capitalizes the first letter in each word of a text value",
            help: "Capitalizes the first letter in a text string and any other letters in text that follow any character other than a letter. Converts all other letters to lowercase letters.",
            arguments: [
                {
                    name: "text",
                    description: "is text enclosed in quotation marks, a formula that returns text, or a reference to a cell containing the text you want to partially capitalize.",
                    type: "string"
                }
            ],
            function: function(text) {
                if (typeof(text)!=="string") text = String(text);
                return text.toLowerCase().replace(/\b\w/g, function(match){
                    return match.toUpperCase();
                });
            }
        },
        REPLACE: {
            description: "Replaces characters within text",
            help: "REPLACE replaces part of a text string, based on the number of characters you specify, with a different text string.",
            arguments: [
                {
                    name: "old_text",
                    description: "is text in which you want to replace some characters.",
                    type: "string"
                },
                {
                    name: "start_num",
                    description: " is the position of the character in old_text that you want to replace with new_text.",
                    type: "number"
                },
                {
                    name: "num_chars",
                    description: " is the number of characters in old_text that you want REPLACE to replace with new_text.",
                    type: "number"
                },
                {
                    name: "new_text",
                    description: "is the text that will replace characters in old_text.",
                    type: "string"
                }
            ],
            function: function(old_text, start_num, num_chars, new_text) {
                if (start_num < 1) return {
                    error: "start_num is less than 1"
                }
                else
                if (num_chars < 0) return {
                    error: "num_chars is negative"
                }
                if (typeof(old_text)!=="string") old_text = String(old_text);
                start_num -= 1;
                return old_text.substr(0, start_num) + new_text + old_text.substr(start_num + num_chars);
            }
        },
        REPT: {
            description: "Repeats text a given number of times",
            help: "Repeats text a given number of times. Use REPT to fill a cell with a number of instances of a text string.",
            arguments: [
                {
                    name: "text",
                    description: "is the text you want to repeat.",
                    type: "string"
                },
                {
                    name: "number_times",
                    description: "is a positive number specifying the number of times to repeat text.",
                    type: "number"
                }
            ],
            remarks: [
                "If number_times is 0 (zero), REPT returns \"\" (empty text).",
                "If number_times is not an integer, it is truncated."
            ],
            function: function(text, number_times) {
                if (typeof(text) !== "string") text = String(text);
                if (isNaN(number_times = parseInt(number_times))) number_times = 0;
                var ret = "";
                for (var i = 0; i < number_times; i++){
                    ret += text;
                }
                return ret;
            }
        },
        RIGHT: {
            description: "Returns the rightmost characters from a text value",
            help: "RIGHT returns the last character or characters in a text string, based on the number of characters you specify.",
            arguments: [
                {
                    name: "text",
                    description: "is the text string containing the characters you want to extract.",
                    type: "string"
                },
                {
                    name: "num_chars",
                    description: "specifies the number of characters you want RIGHT to extract.",
                    type: "number"
                }
            ],
            remarks: [
                "Num_chars must be greater than or equal to zero.",
                "If num_chars is greater than the length of text, RIGHT returns all of text.",
                "If num_chars is omitted, it is assumed to be 1."
            ],
            function: function(text, num_chars) {
                if (typeof(num_chars)==="undefined") num_chars = 1;
                if (!(num_chars >= 0)) return {
                    error: "num_chars must be greater than or equal to zero."
                }
                if (typeof(text)!=="string") text = String(text);
                var offset;
                if ((offset = text.length - num_chars) < 0) offset = 0;
                return text.substr(offset, num_chars);
            }
        },
        SEARCH: {
            description: "Finds one text value within another (not case-sensitive)",
            help: "SEARCH locates one text string within a second text string, and returns the number of the starting position of the first text string from the first character of the second text string.",
            arguments: [
                {
                    name: "find_text",
                    description: "is the text you want to find.",
                    type: "string"
                },
                {
                    name: "within_text",
                    description: "is the text in which you want to search for find_text.",
                    type: "string"
                },
                {
                    name: "start_num",
                    description: " is the character number in within_text at which you want to start searching.",
                    type: "number"
                }
            ],
            remarks: [
                "Use SEARCH and SEARCHB to determine the location of a character or text string within another text string so that you can use the MID and MIDB or REPLACE and REPLACEB functions to change the text.",
                "SEARCH and SEARCHB are not case sensitive. If you want to do a case sensitive search, you can use FIND and FINDB.",
                "You can use the wildcard characters, question mark (?) and asterisk (*), in find_text. A question mark matches any single character; an asterisk matches any sequence of characters. If you want to find an actual question mark or asterisk, type a tilde (~) before the character.",
                "If find_text is not found, the #VALUE! error value is returned.",
                "If start_num is omitted, it is assumed to be 1.",
                "If start_num is not greater than 0 (zero) or is greater than the length of within_text, the #VALUE! error value is returned.",
                "Use start_num to skip a specified number of characters. Using SEARCH as an example, suppose you are working with the text string \"AYF0093.YoungMensApparel\". To find the number of the first \"Y\" in the descriptive part of the text string, set start_num equal to 8 so that the serial-number portion of the text is not searched. SEARCH begins with character 8, finds find_text at the next character, and returns the number 9. SEARCH always returns the number of characters from the start of within_text, counting the characters you skip if start_num is greater than 1."
            ],
            function: function(find_text, within_text, start_num) {
                if (typeof(within_text) !== "string") within_text = String(within_text);
                if (typeof(find_text) !== "string") find_text = String(find_text);
                if (typeof(start_num) === "undefined") start_num = 1;
                //TODO: implement
                return {
                    error: "Not yet implemented"
                };
            }
        },
        SUBSTITUTE: {
            description: "Finds one text value within another (not case-sensitive)",
            help: "Substitutes new_text for old_text in a text string."+
                  " Use SUBSTITUTE when you want to replace specific text in a text string;"+
                  " use REPLACE when you want to replace any text that occurs in a specific location in a text string.",
            arguments: [
                {
                    name: "text",
                    description: "is the text or the reference to a cell containing text for which you want to substitute characters.",
                    type: "string"
                },
                {
                    name: "old_text",
                    description: "is the text you want to replace.",
                    type: "string"
                },
                {
                    name: "new_text",
                    description: "is the text you want to replace old_text with.",
                    type: "string"
                },
                {
                    name: "instance_num",
                    description: "specifies which occurrence of old_text you want to replace with new_text. If you specify instance_num, only that instance of old_text is replaced. Otherwise, every occurrence of old_text in text is changed to new_text.",
                    type: "number"
                }
            ],
            function: function(text, old_text, new_text, instance_num) {
                if (typeof(text) !== "string") text = String(text);
                if (typeof(old_text) !== "string") old_text = String(old_text);
                old_text = escapeRegex(old_text);
                var re = new RegExp(old_text, "gim");
                switch (typeof(new_text)) {
                    case "undefined":
                        new_text = "";
                        //intentionally fall through
                    case "string":
                        break;
                    default:
                        new_text = String(new_text);
                }
                if (typeof(instance_num)==="number") {
                    var match, i = 0;
                    instance_num += 1;
                    while ((instance_num > ++i) && (match = re.exec(text)));
                    if (match && instance_num === i) {
                        text = text.substr(0, match.index) + new_text + text.substr(match.index + old_text.length);
                    }
                }
                else {
                    text = text.replace(re, new_text);
                }
                return text;
            }
        },
        T: {
            description: "Converts its arguments to text",
            help: "Returns the text referred to by value.",
            arguments: [
                {
                    name: "value",
                    description: "is the value you want to test.",
                    type: "any"
                }
            ],
            remarks: [
                "If value is or refers to text, T returns value. If value does not refer to text, T returns \"\" (empty text).",
                "You do not generally need to use the T function in a formula because Microsoft Excel automatically converts values as necessary. This function is provided for compatibility with other spreadsheet programs."
            ],
            function: function(value) {
                return typeof(value)==="string" ? value : "";
            }
        },
        TEXT: {
            description: "Formats a number and converts it to text",
            help: "Converts a value to text in a specific number format.",
            arguments: [
                {
                    name: "value",
                    description: "is a numeric value, a formula that evaluates to a numeric value, or a reference to a cell containing a numeric value.",
                    type: "number"
                },
                {
                    name: "format_text ",
                    description: "is a numeric format as a text string enclosed in quotation marks. You can see various numeric formats by clicking the Number, Date, Time, Currency, or Custom in the Category box of the Number tab in the Format Cells dialog box, and then viewing the formats displayed.",
                    type: "string"
                }
            ],
            remarks: [
                "Format_text cannot contain an asterisk (*).",
                "Formatting a cell with an option on the Number tab (Cells command, Format menu) changes only the format, not the value. Using the TEXT function converts a value to formatted text, and the result is no longer calculated as a number."
            ],
            function: function(value, format_text) {
                //TODO: implement
                return {
                    error: "Not implemented"
                };
            }
        },
        TRIM: {
            description: "Removes spaces from text",
            help: "Removes all spaces from text except for single spaces between words. Use TRIM on text that you have received from another application that may have irregular spacing.",
            arguments: [
                {
                    name: "text",
                    description: "is the text from which you want spaces removed.",
                    type: "string"
                }
            ],
            function: function(text) {
                if (typeof(text) !== "string") text = String(text);
                return text.replace(/^\s*|\s*$/, "");
            }
        },
        UPPER: {
            description: "Converts text to uppercase",
            help: "Converts all lowercase letters in a text string to uppercase.",
            arguments: [
                {
                    name: "text",
                    description: "is the text you want to convert to uppercase. UPPER does not change characters in text that are not letters.",
                    type: "string"
                }
            ],
            function: function(text) {
                if (typeof(text)!=="string") text = String(text);
                return text.toUpperCase();
            }
        },
        VALUE: {
            description: "",
            help: "Converts a text string that represents a number to a number.",
            arguments: [
                {
                    name: "text",
                    description: "is the text enclosed in quotation marks or a reference to a cell containing the text you want to convert.",
                    type: "string"
                }
            ],
            remarks: [
                "Text can be in any of the constant number, date, or time formats recognized by Microsoft Excel. If text is not in one of these formats, VALUE returns the #VALUE! error value.",
                "You do not generally need to use the VALUE function in a formula because Excel automatically converts text to numbers as necessary. This function is provided for compatibility with other spreadsheet programs."
            ]
        }
    }
};

});
