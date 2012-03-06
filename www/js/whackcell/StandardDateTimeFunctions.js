define(function(require){

//see http://office.microsoft.com/en-us/excel-help/excel-functions-by-category-HP005204211.aspx#BMdate_and_time_functions

function dateArg(date) {
    var err = {
        error: "Invalid date"
    };
    switch (typeof(date)) {
        case "string":
            date = Date.parse(date)
        case "number":
            date = Date(date);
        case "object":
            if (date === null || date.constructor !== Date) throw err
            break;
        default:
            throw err;
    }
    return date;
};

var seconds_per_minute = 60,
    minutes_per_hour = 60,
    hours_per_day = 24,
    seconds_per_day = hours_per_day * minutes_per_hour * seconds_per_minute,
    milliseconds_per_day = seconds_per_day * 1000
;

return {
    name: "Date and Time",
    description: "Functions for manipulating date and time values.",
    functions: {
        DATE: {
            description: "Returns the serial number of a particular date",
            help: "Returns the sequential serial number that represents a particular date. If the cell format was General before the function was entered, the result is formatted as a date.",
            arguments: [
                {
                    name: "year",
                    description: "The year argument can be one to four digits. ",
                    type: "number"
                },
                {
                    name: "month",
                    description: "is a positive or negative integer representing the month of the year from 1 to 12 (January to December).",
                    type: "number"
                },
                {
                    name: "day",
                    description: "is a positive or negative integer representing the day of the month from 1 to 31.",
                    type: "number"
                }
            ],
            remarks: [
                "If month is greater than 12, month adds that number of months to the first month in the year specified. For example, DATE(2008,14,2) returns the serial number representing February 2, 2009",
                "If month is less than 1, month subtracts that number of months plus 1 from the first month in the year specified. For example, DATE(2008,-3,2) returns the serial number representing September 2, 2007.",
                "If day is greater than the number of days in the month specified, day adds that number of days to the first day in the month. For example, DATE(2008,1,35) returns the serial number representing February 4, 2008.",
                "If day is less than 1, day subtracts that number of days plus one from the first day in the month. For example, DATE(2008,1,-15) returns the serial number representing December 16, 2007.",
                "Excel stores dates as sequential serial numbers so they can be used in calculations. By default, January 1, 1900 is serial number 1, and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900.",
                "The DATE function is most useful in formulas where year, month, and day are formulas, not constants."
            ],
            function: function(year, month, day) {
                return new Date(year, month - 1, day);
            }
        },
        DATEVALUE: {
            description: "Converts a date in the form of text to a serial number",
            help: "Returns the serial number of the date represented by date_text. Use DATEVALUE to convert a date represented by text to a serial number.",
            arguments: [
                {
                    name: "date_text",
                    description:"is text that represents a date in a Microsoft Excel date format. For example, \"1/30/2008\" or \"30-Jan-2008\" are text strings within quotation marks that represent dates. Using the default date system in Excel for Windows, date_text must represent a date from January 1, 1900, to December 31, 9999. Using the default date system in Excel for the Macintosh, date_text must represent a date from January 1, 1904, to December 31, 9999. DATEVALUE returns the #VALUE! error value if date_text is out of this range." +
                                "If the year portion of date_text is omitted, DATEVALUE uses the current year from your computer's built-in clock. Time information in date_text is ignored.",
                    type: "string"
                }
            ],
            remarks: [
                "Excel stores dates as sequential serial numbers so they can be used in calculations. By default, January 1, 1900 is serial number 1, and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900.",
                "Most functions automatically convert date values to serial numbers."
            ],
            function: function(date_text) {
                return Date(Date.parse(date_text));
            }
        },
        DAY: {
            description: "Converts a serial number to a day of the month",
            help: "Returns the day of a date, represented by a serial number. The day is given as an integer ranging from 1 to 31.",
            arguments: [
                {
                    name: "serial_number",
                    description: "is the date of the day you are trying to find."+
                                " Dates should be entered by using the DATE function, or as results of other formulas or functions."+
                                " For example, use DATE(2008,5,23) for the 23rd day of May, 2008. Problems can occur if dates are entered as text.",
                    type: "Date"
                }
            ],
            remarks: [
                "Excel stores dates as sequential serial numbers so they can be used in calculations. By default, January 1, 1900 is serial number 1, and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900.",
                "Most functions automatically convert date values to serial numbers."
            ],
            function: function(date) {
                return dateArg(date).getDate();
            }
        },
        DAYS360: {
            description: "Calculates the number of days between two dates based on a 360-day year",
            help: "Returns the number of days between two dates based on a 360-day year (twelve 30-day months), which is used in some accounting calculations. Use this function to help compute payments if your accounting system is based on twelve 30-day months.",
            arguments: [
                {
                    name: "start_date",
                    description: "start date for the period",
                    type: "Date"
                },
                {
                    name: "end_date",
                    description: "end date for the period",
                    type: "Date"
                },
                {
                    name: "method",
                    description: "is a logical value that specifies whether to use the U.S. or European method in the calculation." +
                                " If FALSE or omitted, use the U.S. (NASD) method." +
                                " If the starting date is the last day of a month, it becomes equal to the 30th of the same month." +
                                " If the ending date is the last day of a month and the starting date is earlier than the 30th of a month," +
                                " the ending date becomes equal to the 1st of the next month;" +
                                " otherwise the ending date becomes equal to the 30th of the same month." +
                                " If TRUE, use the  European method." +
                                " Starting dates and ending dates that occur on the 31st of a month become equal to the 30th of the same month.",
                    type: "boolean"
                },
            ],
            remarks: [
                "Excel stores dates as sequential serial numbers so they can be used in calculations." +
                " By default, January 1, 1900 is serial number 1, and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900.",
                "Most functions automatically convert date values to serial numbers."
            ],
            function: function(start_date, end_date, method) {
                start_date = dateArg(start_date);
                end_date = dateArg(end_date);
                if (method === true) {
                    if (start_date.getDate() === 31) start_date.setDate(30);
                    if (end_date.getDate() === 31) end_date.setDate(30);
                }
                else {
                    var nextDay;
                    nextDay = new Date(start_date.getTime());
                    nextDay.setDate(nextDay.getDate()+1);
                    if (nextDay.getDate() === 1) start_date.setDate(30);
                    nextDay = new Date(end_date.getTime());
                    nextDay.setDate(nextDay.getDate()+1);
                    if (nextDay.getDate() === 1) end_date.setDate(30);
                }
                return Math.round((end_date.getTime() - start_date.getTime()) / milliseconds_per_day);
            }
        },
        _: {
            description: "",
            help: "",
            arguments: [
                {
                    name: "",
                    description: "",
                    type: ""
                }
            ],
            remarks: [
                ""
            ],
            function: function() {
            }
        },
    }
};

});
