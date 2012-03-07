define(function(require){

//see http://office.microsoft.com/en-us/excel-help/excel-functions-by-category-HP005204211.aspx#BMdate_and_time_functions

var seconds_per_minute = 60,
    minutes_per_hour = 60,
    hours_per_day = 24,
    seconds_per_day = hours_per_day * minutes_per_hour * seconds_per_minute,
    milliseconds_per_day = seconds_per_day * 1000
;

function dateArg(date, newInstance) {
    var err = {
        error: "Invalid date"
    };
    switch (typeof(date)) {
        case "string":
            date = Date.parse(date)
        case "number":
            date = Date(date);
            break;
        case "object":
            if (date === null || date.constructor !== Date) throw err;
            if (newInstance) {
                date = new Date(date.getTime());
            }
            break;
        default:
            throw err;
    }
    return date;
};

function lastMonthDay30US(date){
    date = dateArg(date, true);
    var nextDay = new Date(date.getTime());
    nextDay.setDate(nextDay.getDate()+1);
    if (nextDay.getDate() === 1) date.setDate(30);
    return date;
}

function lastMonthDay30EU(date){
    date = dateArg(date, true);
    if (date.getDate() === 31) date.setDate(30);
    return date;
}

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
                start_date = dateArg(start_date, true);
                end_date = dateArg(end_date, true);
                if (method === true) {
                    start_date = lastMonthDay30EU(start_date);
                    end_date = lastMonthDay30EU(end_date);
                }
                else {
                    start_date = lastMonthDay30US(start_date);
                    end_date = lastMonthDay30US(end_date);
                }
                return Math.round((end_date.getTime() - start_date.getTime()) / milliseconds_per_day);
            }
        },
        EDATE: {
            description: "Returns the serial number of the date that is the indicated number of months before or after the start date",
            help: "Returns the serial number that represents the date that is the indicated number of months before or after a specified date (the start_date). Use EDATE to calculate maturity dates or due dates that fall on the same day of the month as the date of issue.",
            arguments: [
                {
                    name: "start_date",
                    description: "is a date that represents the start date. Dates should be entered by using the DATE function, or as results of other formulas or functions. For example, use DATE(2008,5,23) for the 23rd day of May, 2008. Problems can occur if dates are entered as text.",
                    type: "date"
                },
                {
                    name: "months",
                    description: "is the number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.",
                    type: "number"
                }
            ],
            remarks: [
                "If start_date is not a valid date, EDATE returns the #VALUE! error value.",
                "If months is not an integer, it is truncated."
            ],
            function: function(start_date, months) {
                start_date = dateArg(start_date, true);
                months = parseInt(months);
                start_date.setMonth(start_date.getMonth() + months);
                return start_date;
            }
        },
        EOMONTH: {
            description: "Returns the serial number of the last day of the month before or after a specified number of months",
            help: "Returns the serial number for the last day of the month that is the indicated number of months before or after start_date. Use EOMONTH to calculate maturity dates or due dates that fall on the last day of the month.",
            arguments: [
                {
                    name: "start_date",
                    description: "is a date that represents the starting date. Dates should be entered by using the DATE function, or as results of other formulas or functions. For example, use DATE(2008,5,23) for the 23rd day of May, 2008. Problems can occur if dates are entered as text.",
                    type: "date"
                },
                {
                    name: "months",
                    description: "is the number of months before or after start_date. A positive value for months yields a future date; a negative value yields a past date.",
                    type: "number"
                }
            ],
            remarks: [
                "If months is not an integer, it is truncated.",
                "If start_date is not a valid date, EOMONTH returns the #NUM! error value.",
                "If start_date plus months yields an invalid date, EOMONTH returns the #NUM! error value."
            ],
            function: function(start_date, months) {
                start_date = dateArg(start_date, true);
                months = parseInt(months);
                start_date.setMonth(start_date.getMonth() + months + 1);
                start_date.setDate(0);
                return start_date;
            }
        },
        HOUR: {
            description: "Converts a serial number to an hour",
            help: "Returns the hour of a time value. The hour is given as an integer, ranging from 0 (12:00 A.M.) to 23 (11:00 P.M.).",
            arguments: [
                {
                    name: "serial_number",
                    description: "is the time that contains the hour you want to find."+
                                " Times may be entered as text strings within quotation marks"+
                                " (for example, \"6:45 PM\"), as decimal numbers (for example, 0.78125, which represents 6:45 PM)," +
                                " or as results of other formulas or functions (for example, TIMEVALUE(\"6:45 PM\")).",
                    type: "Date"
                }
            ],
            remarks: [
                "Microsoft Excel for Windows and Excel for the Macintosh use different date systems as their defaults."+
                " Time values are a portion of a date value and represented by a decimal number (for example, 12:00 PM is represented as 0.5 because it is half of a day)."
            ],
            function: function(date) {
                //TODO: implement
                return dateArg(date).getHours();
            }
        },
        MINUTE: {
            description: "Converts a serial number to a minute",
            help: "Returns the minutes of a time value. The minute is given as an integer, ranging from 0 to 59.",
            arguments: [
                {
                    name: "serial_number",
                    description: "is the time that contains the minute you want to find."+
                                " Times may be entered as text strings within quotation marks (for example, \"6:45 PM\")," +
                                " as decimal numbers (for example, 0.78125, which represents 6:45 PM)," +
                                " or as results of other formulas or functions (for example, TIMEVALUE(\"6:45 PM\")).",
                    type: "Date"
                }
            ],
            remarks: [
                "Microsoft Excel for Windows and Excel for the Macintosh use different date systems as their defaults."+
                " Time values are a portion of a date value and represented by a decimal number (for example, 12:00 PM is represented as 0.5 because it is half of a day)."
            ],
            function: function(date) {
                //TODO: implement
                return dateArg(date).getMinutes();
            }
        },
        MONTH: {
            description: "Converts a serial number to a month",
            help: "Returns the month of a date represented by a serial number. The month is given as an integer, ranging from 1 (January) to 12 (December).",
            arguments: [
                {
                    name: "serial_number",
                    description: "is the date of the month you are trying to find."+
                                " Dates should be entered by using the DATE function,"+
                                " or as results of other formulas or functions."+
                                " For example, use DATE(2008,5,23) for the 23rd day of May, 2008."+
                                " Problems can occur if dates are entered as text.",
                    type: "Date"
                }
            ],
            function: function(date) {
                //TODO: implement
                return dateArg(date).getMonth() + 1;
            }
        },
        NETWORKDAYS: {
            description: "Returns the number of whole workdays between two dates",
            help: "Returns the number of whole working days between start_date and end_date."+
                  " Working days exclude weekends and any dates identified in holidays."+
                  " Use NETWORKDAYS to calculate employee benefits that accrue based on the number of days worked during a specific term",
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
                    name: "holidays",
                    description: "is an optional range of one or more dates to exclude from the working calendar,"+
                                 " such as state and federal holidays and floating holidays."+
                                 " The list can be either a range of cells that contains the dates or an array constant of the serial numbers that represent the dates.",
                    type: ""
                }
            ],
            function: function() {
                //TODO: implement this.
            }
        },
        NOW: {
            description: "Returns the serial number of the current date and time",
            help: "Returns the serial number of the current date and time. If the cell format was General before the function was entered, the result is formatted as a date.",
            remarks: [
                "Microsoft Excel stores dates as sequential serial numbers so they can be used in calculations."+
                " By default, January 1, 1900 is serial number 1, and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900."+
                " Microsoft Excel for the Macintosh uses a different date system as its default.",
                "Numbers to the right of the decimal point in the serial number represent the time; numbers to the left represent the date. For example, the serial number .5 represents the time 12:00 noon.",
                "The NOW function changes only when the worksheet is calculated or when a macro that contains the function is run. It is not updated continuously."
            ],
            function: function() {
                return new Date();
            }
        },
        SECOND: {
            description: "Converts a serial number to a second",
            help: "Returns the seconds of a time value. The second is given as an integer in the range 0 (zero) to 59.",
            arguments: [
                {
                    name: "serial_number",
                    description: "is the time that contains the seconds you want to find."+
                                " Times may be entered as text strings within quotation marks (for example, \"6:45 PM\"),"+
                                " as decimal numbers (for example, 0.78125, which represents 6:45 PM)," +
                                " or as results of other formulas or functions (for example, TIMEVALUE(\"6:45 PM\")).",
                    type: "Date"
                }
            ],
            remarks: [
                "Microsoft Excel for Windows and Microsoft Excel for the Macintosh use different date systems as their default."+
                " Time values are a portion of a date value and represented by a decimal number"+
                " (for example, 12:00 PM is represented as 0.5 because it is half of a day)."
            ],
            function: function(date) {
                return dateArg(date).getSeconds();
            }
        },
        TIME: {
            description: "Returns the serial number of a particular time",
            help: "Returns the decimal number for a particular time. If the cell format was General before the function was entered, the result is formatted as a date." +
                  " The decimal number returned by TIME is a value ranging from 0 (zero) to 0.99999999, representing the times from 0:00:00 (12:00:00 AM) to 23:59:59 (11:59:59 P.M.).",
            arguments: [
                {
                    name: "hour",
                    description: "is a number from 0 (zero) to 32767 representing the hour."+
                                " Any value greater than 23 will be divided by 24 and the remainder will be treated as the hour value."+
                                " For example, TIME(27,0,0) = TIME(3,0,0) = .125 or 3:00 AM.",
                    type: "number"
                },
                {
                    name: "minute",
                    description: "is a number from 0 to 32767 representing the minute."+
                                " Any value greater than 59 will be converted to hours and minutes."+
                                " For example, TIME(0,750,0) = TIME(12,30,0) = .520833 or 12:30 PM.",
                    type: "number"
                },
                {
                    name: "second",
                    description: "is a number from 0 to 32767 representing the second."+
                                " Any value greater than 59 will be converted to hours, minutes, and seconds."+
                                " For example, TIME(0,0,2000) = TIME(0,33,22) = .023148 or 12:33:20 AM",
                    type: "number"
                }
            ],
            remarks: [
                "Microsoft Excel for Windows and Microsoft Excel for the Macintosh use different date systems as their default."+
                " Time values are a portion of a date value and represented by a decimal number"+
                " (for example, 12:00 PM is represented as 0.5 because it is half of a day)."
            ],
            function: function(date) {
                //TODO: implement
            }
        },
        TIMEVALUE: {
            description: "Converts a time in the form of text to a serial number",
            help: "Returns the decimal number of the time represented by a text string." +
                  " The decimal number is a value ranging from 0 (zero) to 0.99999999,"+
                  " representing the times from 0:00:00 (12:00:00 AM) to 23:59:59 (11:59:59 P.M.).",
            arguments: [
                {
                    name: "time_text",
                    description: "is a text string that represents a time in any one of the Microsoft Excel time formats;"+
                                " for example, \"6:45 PM\" and \"18:45\" text strings within quotation marks that represent time.",
                    type: "string"
                }
            ],
            remarks: [
                "Date information in time_text is ignored."+
                " Excel for Windows and Excel for the Macintosh use different date systems as their default."+
                " Time values are a portion of a date value and represented by a decimal number"+
                "(for example, 12:00 PM is represented as 0.5 because it is half of a day)."
            ],
            function: function() {
                //TODO: implement.
            }
        },
        TODAY: {
            description: "Returns the serial number of today's date",
            help: "Returns the serial number of the current date."+
                  " The serial number is the date-time code used by Microsoft Excel for date and time calculations." +
                  " If the cell format was General before the function was entered, the result is formatted as a date.",
            remarks: [
                "Excel stores dates as sequential serial numbers so they can be used in calculations."+
                " By default, January 1, 1900 is serial number 1,"+
                " and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900."
            ],
            function: function() {
                var date = new Date();
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                date.setMilliseconds(0);
                return date;
            }
        },
        WEEKDAY: {
            description: "Converts a serial number to a day of the week",
            help: "Returns the day of the week corresponding to a date."+
                  " The day is given as an integer, ranging from 1 (Sunday) to 7 (Saturday), by default.",
            arguments: [
                {
                    name: "serial_number",
                    description: "is a sequential number that represents the date of the day you are trying to find."+
                                " Dates should be entered by using the DATE function, or as results of other formulas or functions."+
                                " For example, use DATE(2008,5,23) for the 23rd day of May, 2008. Problems can occur if dates are entered as text.",
                    type: "date"
                },
                {
                    name: "return_type",
                    description: "is a number that determines the type of return value."+
                                  " If 1 or omitted, Numbers 1 (Sunday) through 7 (Saturday). Behaves like previous versions of Microsoft Excel."+
                                  " If 2 Numbers 1 (Monday) through 7 (Sunday)."+
                                  " If 3 Numbers 0 (Monday) through 6 (Sunday).",
                    type: "number"
                }
            ],
            remarks: [
                "Excel stores dates as sequential serial numbers so they can be used in calculations."+
                " By default, January 1, 1900 is serial number 1,"+
                " and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900."
            ],
            function: function(date, return_type) {
                if (typeof(return_type) === "undefined") return_type = 1;
                date = dateArg(date).getDay();
                switch (return_type) {
                    case 1:
                      date += 1
                      break;
                    case 2:
                      if (date === 0) date = 7;
                      break;
                    case 3: //do nothing, already in right format
                      if (date === 0) date = 6;
                      else date -= 1;
                      break;
                    default:
                      throw {
                          error: "invalid return type specified"
                      }
                }
                return date;
            }
        },
        WEEKNUM: {
            description: "Converts a serial number to a number representing where the week falls numerically with a year",
            help: "Returns a number that indicates where the week falls numerically within a year." +
                  " IMPORTANT: The WEEKNUM function considers the week containing January 1 to be the first week of the year."+
                  " However, there is a European standard that defines the first week as the one with the majority of days (four or more) falling in the new year."+
                  " This means that for years in which there are three days or less in the first week of January,"+
                  " the WEEKNUM function returns week numbers that are incorrect according to the European standard.",
            arguments: [
                {
                    name: "serial_number",
                    description: "is a date within the week."+
                                " Dates should be entered by using the DATE function, or as results of other formulas or functions."+
                                " For example, use DATE(2008,5,23) for the 23rd day of May, 2008."+
                                " Problems can occur if dates are entered as text.",
                    type: "date"
                },
                {
                    name: "return_type",
                    description: "is a number that determines on which day the week begins. The default is 1." +
                                  "If 1, Week begins on Sunday. Weekdays are numbered 1 through 7."+
                                  "If 2, Week begins on Monday. Weekdays are numbered 1 through 7.",
                    type: "number"
                }
            ],
            function: function() {
                //TODO: implement.
            }
        },
        WORKDAY: {
            description: "Returns the serial number of the date before or after a specified number of workdays",
            help: "Returns a number that represents a date that is the indicated number of working days before or after a date (the starting date)."+
                  " Working days exclude weekends and any dates identified as holidays."+
                  " Use WORKDAY to exclude weekends or holidays when you calculate invoice due dates, expected delivery times, or the number of days of work performed.",
            arguments: [
                {
                    name: "start_date",
                    description: "is a date that represents the start date.",
                    type: "date"
                },
                {
                    name: "days",
                    description: "is the number of nonweekend and nonholiday days before or after start_date. A positive value for days yields a future date; a negative value yields a past date.",
                    type: "number"
                },
                {
                    name: "holidays",
                    description: "is an optional list of one or more dates to exclude from the working calendar, such as state and federal holidays and floating holidays. The list can be either a range of cells that contain the dates or an array constant of the serial numbers that represent the dates.",
                    type: ""
                }
            ],
            remarks: [
                "Excel stores dates as sequential serial numbers so they can be used in calculations."+
                " By default, January 1, 1900 is serial number 1,"+
                " and January 1, 2008 is serial number 39448 because it is 39,448 days after January 1, 1900.",
                "If any argument is not a valid date, WORKDAY returns the #VALUE! error value.",
                "If start_date plus days yields an invalid date, WORKDAY returns the #NUM! error value.",
                "If days is not an integer, it is truncated."
            ],
            function: function() {
                //TODO: implement this.
            }
        },
        YEAR: {
            description: "Converts a serial number to a year",
            help: "Returns the year corresponding to a date. The year is returned as an integer in the range 1900-9999.",
            arguments: [
                {
                    name: "serial_number",
                    description: "is the date of the year you want to find."+
                                " Dates should be entered by using the DATE function, or as results of other formulas or functions."+
                                " For example, use DATE(2008,5,23) for the 23rd day of May, 2008. Problems can occur if dates are entered as text.",
                    type: "date"
                }
            ],
            function: function(date) {
                return dateArg(date).getFullYear();
            }
        },
        YEARFRAC: {
            description: "Returns the year fraction representing the number of whole days between start_date and end_date",
            help: "Calculates the fraction of the year represented by the number of whole days between two dates (the start_date and the end_date)."+
                  " Use the YEARFRAC worksheet function to identify the proportion of a whole year's benefits or obligations to assign to a specific term.",
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
                    name: "basis",
                    description: " is the type of day count basis to use."+
                                " If 0 or omitted, US (NASD) 30/360." +
                                " If 1, Actual/actual." +
                                " If 2, Actual/360." +
                                " If 3, Actual/365." +
                                " If 4, European 30/360.",
                    type: "number"
                }
            ],
            remarks: [
                "All arguments are truncated to integers.",
                "If start_date or end_date are not valid dates, YEARFRAC returns the #VALUE! error value.",
                "If basis < 0 or if basis > 4, YEARFRAC returns the #NUM! error value."
            ],
            function: function(start_date, end_date, basis) {
                if (typeof(basis) === "undefined") basis = 0;
                var div, days;
                switch (basis) {
                    case 0:
                        start_date = lastMonthDay30US(start);
                        end_date = lastMonthDay30US(end);
                        div = 360
                        break;
                    case 1:
                        start_date = dateArg(start_date);
                        end_date = dateArg(end_date);
                        break;
                    case 2:
                        div = 360
                        start_date = dateArg(start_date);
                        end_date = dateArg(end_date);
                        break;
                    case 3:
                        div = 365
                        break;
                    case 4:
                        start_date = lastMonthDay30EU(start);
                        end_date = lastMonthDay30EU(end);
                        div = 360
                        break;
                    default:
                        throw {
                            error: "Invalid basis."
                        };
                }
                return Math.round(((end_date.getTime() - start_date.getTime()) / milliseconds_per_day)) / div;
            }
        }
    }
};

});
