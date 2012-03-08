define(function(require){

//see: http://office.microsoft.com/en-us/excel-help/excel-functions-by-category-HP005204211.aspx#BMmath_and_trigonometry_functions
//also: http://en.wikipedia.org/wiki/Inverse_hyperbolic_function

var m = Math,
    abs = m.abs,
    ln = m.log,
    ln10 = m.LN10,
    V = m.sqrt,
    pow = m.pow,
    exp = m.exp,
    e = m.E,
    pi = m.PI
;

function cosh(n){
  return (exp(n) + exp(-n)) / 2;
};

function sinh(n){
  return (exp(n) - exp(-n)) / 2;
};

var fact;
(fact = function(n){
    if ((n = parseInt(n)) < 0 || isNaN(n)) throw {
        error: "Must be non-negative number"
    };
    var cache = fact.cache, i = cache.length - 1;
    while (i < n) cache.push(cache[i++] * i);
    return cache[n];
}).cache = [
    1 /*,
    1,
    2,
    6,
    24,
    120,
    720,
    5040,
    40320,
    362880,
    3628800,
    39916800,
    479001600,
    6227020800,
    87178291200,
    1307674368000,
    20922789888000,
    355687428096000,
    6402373705728000,
    121645100408832000,
    2432902008176640000,
    51090942171709440000,
    1124000727777607680000,
    25852016738884976640000,
    620448401733239439360000,
    15511210043330985984000000,
    403291461126605635584000000,
    10888869450418352160768000000,
    304888344611713860501504000000,
    8841761993739701954543616000000,
    265252859812191058636308480000000,
    8222838654177922817725562880000000,
    263130836933693530167218012160000000,
    8683317618811886495518194401280000000,
    295232799039604140847618609643520000000,
    10333147966386144929666651337523200000000,
    371993326789901217467999448150835200000000,
    13763753091226345046315979581580902400000000,
    523022617466601111760007224100074291200000000,
    20397882081197443358640281739902897356800000000,
    815915283247897734345611269596115894272000000000,
    33452526613163807108170062053440751665152000000000,
    1405006117752879898543142606244511569936384000000000,
    60415263063373835637355132068513997507264512000000000,
    2658271574788448768043625811014615890319638528000000000,
    119622220865480194561963161495657715064383733760000000000,
    5502622159812088949850305428800254892961651752960000000000,
    258623241511168180642964355153611979969197632389120000000000,
    12413915592536072670862289047373375038521486354677760000000000,
    608281864034267560872252163321295376887552831379210240000000000,
    30414093201713378043612608166064768844377641568960512000000000000,
    1551118753287382280224243016469303211063259720016986112000000000000,
    80658175170943878571660636856403766975289505440883277824000000000000,
    4274883284060025564298013753389399649690343788366813724672000000000000,
    230843697339241380472092742683027581083278564571807941132288000000000000,
    12696403353658275925965100847566516959580321051449436762275840000000000000,
    710998587804863451854045647463724949736497978881168458687447040000000000000,
    40526919504877216755680601905432322134980384796226602145184481280000000000000,
    2350561331282878571829474910515074683828862318181142924420699914240000000000000,
    138683118545689835737939019720389406345902876772687432540821294940160000000000000,
    8320987112741390144276341183223364380754172606361245952449277696409600000000000000,
    507580213877224798800856812176625227226004528988036003099405939480985600000000000000,
    31469973260387937525653122354950764088012280797258232192163168247821107200000000000000,
    1982608315404440064116146708361898137544773690227268628106279599612729753600000000000000,
    126886932185884164103433389335161480802865516174545192198801894375214704230400000000000000,
    8247650592082470666723170306785496252186258551345437492922123134388955774976000000000000000,
    544344939077443064003729240247842752644293064388798874532860126869671081148416000000000000000,
    36471110918188685288249859096605464427167635314049524593701628500267962436943872000000000000000,
    2480035542436830599600990418569171581047399201355367672371710738018221445712183296000000000000000,
    171122452428141311372468338881272839092270544893520369393648040923257279754140647424000000000000000,
    11978571669969891796072783721689098736458938142546425857555362864628009582789845319680000000000000000,
    850478588567862317521167644239926010288584608120796235886430763388588680378079017697280000000000000000,
    61234458376886086861524070385274672740778091784697328983823014963978384987221689274204160000000000000000,
    4470115461512684340891257138125051110076800700282905015819080092370422104067183317016903680000000000000000,
    330788544151938641225953028221253782145683251820934971170611926835411235700971565459250872320000000000000000,
    24809140811395398091946477116594033660926243886570122837795894512655842677572867409443815424000000000000000000,
    1885494701666050254987932260861146558230394535379329335672487982961844043495537923117729972224000000000000000000,
    145183092028285869634070784086308284983740379224208358846781574688061991349156420080065207861248000000000000000000,
    11324281178206297831457521158732046228731749579488251990048962825668835325234200766245086213177344000000000000000000,
    894618213078297528685144171539831652069808216779571907213868063227837990693501860533361810841010176000000000000000000,
    71569457046263802294811533723186532165584657342365752577109445058227039255480148842668944867280814080000000000000000000,
    5797126020747367985879734231578109105412357244731625958745865049716390179693892056256184534249745940480000000000000000000,
    475364333701284174842138206989404946643813294067993328617160934076743994734899148613007131808479167119360000000000000000000,
    39455239697206586511897471180120610571436503407643446275224357528369751562996629334879591940103770870906880000000000000000000,
    3314240134565353266999387579130131288000666286242049487118846032383059131291716864129885722968716753156177920000000000000000000,
    281710411438055027694947944226061159480056634330574206405101912752560026159795933451040286452340924018275123200000000000000000000,
    24227095383672732381765523203441259715284870552429381750838764496720162249742450276789464634901319465571660595200000000000000000000,
    2107757298379527717213600518699389595229783738061356212322972511214654115727593174080683423236414793504734471782400000000000000000000,
    185482642257398439114796845645546284380220968949399346684421580986889562184028199319100141244804501828416633516851200000000000000000000,
    16507955160908461081216919262453619309839666236496541854913520707833171034378509739399912570787600662729080382999756800000000000000000000,
    1485715964481761497309522733620825737885569961284688766942216863704985393094065876545992131370884059645617234469978112000000000000000000000,
    135200152767840296255166568759495142147586866476906677791741734597153670771559994765685283954750449427751168336768008192000000000000000000000,
    12438414054641307255475324325873553077577991715875414356840239582938137710983519518443046123837041347353107486982656753664000000000000000000000,
    1156772507081641574759205162306240436214753229576413535186142281213246807121467315215203289516844845303838996289387078090752000000000000000000000,
    108736615665674308027365285256786601004186803580182872307497374434045199869417927630229109214583415458560865651202385340530688000000000000000000000,
    10329978488239059262599702099394727095397746340117372869212250571234293987594703124871765375385424468563282236864226607350415360000000000000000000000,
    991677934870949689209571401541893801158183648651267795444376054838492222809091499987689476037000748982075094738965754305639874560000000000000000000000,
    96192759682482119853328425949563698712343813919172976158104477319333745612481875498805879175589072651261284189679678167647067832320000000000000000000000,
    9426890448883247745626185743057242473809693764078951663494238777294707070023223798882976159207729119823605850588608460429412647567360000000000000000000000,
    933262154439441526816992388562667004907159682643816214685929638952175999932299156089414639761565182862536979208272237582511852109168640000000000000000000000,
    93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000
  */];

function numArg(num, lower, upper) {
    if (typeof(num) === "number") {
        if (typeof(lower)==="number" && num < lower) {
            throw {
                error: "Number out of bounds"
            };
        }
        else
        if (typeof(upper)==="number" && num > upper) {
            throw {
                error: "Number out of bounds"
            };
        }
    }
    else {
        throw {
            error: "Invalid number"
        };
    }
    return num;
}

return {
    name: "Math and trigonometry",
    description: "Math and trigonometry functions",
    functions: {
        ABS: {
              description: "Returns the absolute value of a number",
              help: "Returns the absolute value of a number. The absolute value of a number is the number without its sign.",
              arguments: [
                  {
                      name: "number",
                      description: "is the real number of which you want the absolute value.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return abs(n);
              }
        },
        ACOS: {
              description: "Returns the arccosine of a number",
              help: "Returns the arccosine, or inverse cosine, of a number."+
                    " The arccosine is the angle whose cosine is number."+
                    " The returned angle is given in radians in the range 0 (zero) to pi.",
              arguments: [
                  {
                      name: "number",
                      description: "is the cosine of the angle you want and must be from -1 to 1.",
                      type: "number"
                  }
              ],
              remarks: [
                "If you want to convert the result from radians to degrees, multiply it by 180/PI() or use the DEGREES function."
              ],
              function: function(n) {
                  return m.acos(n);
              }
        },
        ACOSH: {
              description: "Returns the inverse hyperbolic cosine of a number",
              help: "Returns the inverse hyperbolic cosine of a number."+
                    " Number must be greater than or equal to 1."+
                    " The inverse hyperbolic cosine is the value whose hyperbolic cosine is number, so ACOSH(COSH(number)) equals number.",
              arguments: [
                  {
                      name: "number",
                      description: "is any real number equal to or greater than 1.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return ln(n + V(n+1) * V(n-1))
              }
        },
        ASIN: {
              description: "Returns the arcsine of a number",
              help: "Returns the arcsine, or inverse sine, of a number."+
                    " The arcsine is the angle whose sine is number."+
                    " The returned angle is given in radians in the range -pi/2 to pi/2.",
              arguments: [
                  {
                      name: "number",
                      description: "is the sine of the angle you want and must be from -1 to 1.",
                      type: "number"
                  }
              ],
              remarks: [
                "If you want to convert the result from radians to degrees, multiply it by 180/PI() or use the DEGREES function."
              ],
              function: function(n) {
                  return m.asin(n);
              }
        },
        ASINH: {
              description: "Returns the inverse hyperbolic sine of a number",
              help: "Returns the inverse hyperbolic sine of a number."+
                    " The inverse hyperbolic sine is the value whose hyperbolic sine is number," +
                    " so ASINH(SINH(number)) equals number.",
              arguments: [
                  {
                      name: "number",
                      description: "is any real number",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return ln(n + sqrt(n * n + 1));
              }
        },
        ATAN: {
              description: "Returns the arctangent of a number",
              help: "Returns the arctangent, or inverse tangent, of a number."+
                  " The arctangent is the angle whose tangent is number."+
                  " The returned angle is given in radians in the range -pi/2 to pi/2.",
              arguments: [
                  {
                      name: "number",
                      description: "is the tangent of the angle you want.",
                      type: "number"
                  }
              ],
              remarks: [
                "To express the arctangent in degrees, multiply the result by 180/PI( ) or use the DEGREES function."
              ],
              function: function(n) {
                  return m.atan(n);
              }
        },
        ATAN2: {
              description: "Returns the arctangent from x- and y-coordinates",
              help: "Returns the arctangent, or inverse tangent, of the specified x- and y-coordinates."+
                    " The arctangent is the angle from the x-axis to a line containing the origin (0, 0) and a point with coordinates (x_num, y_num)."+
                    "The angle is given in radians between -pi and pi, excluding -pi.",
              arguments: [
                  {
                      name: "x",
                      description: "is the x-coordinate of the point.",
                      type: "number"
                  },
                  {
                      name: "y",
                      description: "is the y-coordinate of the point.",
                      type: "number"
                  }
              ],
              remarks: [
                  "A positive result represents a counterclockwise angle from the x-axis; a negative result represents a clockwise angle.",
                  "ATAN2(a,b) equals ATAN(b/a), except that a can equal 0 in ATAN2.",
                  "If both x_num and y_num are 0, ATAN2 returns the #DIV/0! error value.",
                  "To express the arctangent in degrees, multiply the result by 180/PI( ) or use the DEGREES function."
              ],
              function: function(x, y) {
                  return m.atan(y, x);
              }
        },
        ATANH: {
              description: "Returns the inverse hyperbolic tangent of a number",
              help: "Returns the inverse hyperbolic tangent of a number."+
                    " Number must be between -1 and 1 (excluding -1 and 1)."+
                    " The inverse hyperbolic tangent is the value whose hyperbolic tangent is number,"+
                    " so ATANH(TANH(number)) equals number.",
              arguments: [
                  {
                      name: "number",
                      description: "is any real number between 1 and -1.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return (ln(1 + n) - ln(1 - n)) / 2;
              }
        },
        CEILING: {
              description: "Rounds a number to the nearest integer or to the nearest multiple of significance",
              help: "Returns number rounded up, away from zero, to the nearest multiple of significance."+
                    " For example, if you want to avoid using pennies in your prices and your product is priced at $4.42,"+
                    " use the formula =CEILING(4.42,0.05) to round prices up to the nearest nickel.",
              arguments: [
                  {
                      name: "number",
                      description: "is the value you want to round.",
                      type: "number"
                  },
                  {
                      name: "significance",
                      description: "is the multiple to which you want to round.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If either argument is nonnumeric, CEILING returns the #VALUE! error value.",
                  "Regardless of the sign of number, a value is rounded up when adjusted away from zero."+
                  " If number is an exact multiple of significance, no rounding occurs.",
                  "If number and significance have different signs, CEILING returns the #NUM! error value."
              ],
              function: function(n, s) {
                  if (s===1) return m.ceil(n);
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  }
              }
        },
        COMBIN: {
              description: "Returns the number of combinations for a given number of objects",
              help: "Returns the number of combinations for a given number of items."+
                    " Use COMBIN to determine the total possible number of groups for a given number of items.",
              arguments: [
                  {
                      name: "number",
                      description: "is the number of items.",
                      type: "number"
                  },
                  {
                      name: "number_chosen",
                      description: " is the number of items in each combination.",
                      type: "number"
                  }
              ],
              remarks: [
                  "Numeric arguments are truncated to integers.",
                  "If either argument is nonnumeric, COMBIN returns the #VALUE! error value.",
                  "If number < 0, number_chosen < 0, or number < number_chosen, COMBIN returns the #NUM! error value.",
                  "A combination is any set or subset of items, regardless of their internal order."+
                  " Combinations are distinct from permutations, for which the internal order is significant.",
                  ""
              ],
              function: function(n, k) {
                  return fact(n) / (fact(k) * fact(n-k));
              }
        },
        COS: {
              description: "Returns the cosine of a number",
              help: "Returns the cosine of the given angle.",
              arguments: [
                  {
                      name: "number",
                      description: "is the angle in radians for which you want the cosine.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If you want to convert the result from radians to degrees, multiply it by 180/PI() or use the DEGREES function."
              ],
              function: function(n) {
                  return m.cos(n);
              }
        },
        COSH: {
              description: "Returns the hyperbolic cosine of a number",
              help: "Returns the hyperbolic cosine of a number.",
              arguments: [
                  {
                      name: "number",
                      description: "is any real number for which you want to find the hyperbolic cosine.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return cosh(n)
              }
        },
        DEGREES: {
              description: "Converts radians to degrees",
              help: "Converts radians into degrees.",
              arguments: [
                  {
                      name: "angle",
                      description: "is the angle in radians that you want to convert.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return n*180/pi;
              }
        },
        EVEN: {
              description: "Rounds a number up to the nearest even integer",
              help: "Returns number rounded up to the nearest even integer."+
                    " You can use this function for processing items that come in twos."+
                    " For example, a packing crate accepts rows of one or two items."+
                    " The crate is full when the number of items, rounded up to the nearest two, matches the crate's capacity.",
              arguments: [
                  {
                      name: "number",
                      description: "is the value to round.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  n = Math.ceil(n);
                  if (n%2 !== 0) n += (n > 0 ? 1 : -1);
                  return n;
              }
        },
        EXP: {
              description: "Returns e raised to the power of a given number",
              help: "Returns e raised to the power of number. The constant e equals 2.71828182845904, the base of the natural logarithm.",
              arguments: [
                  {
                      name: "number",
                      description: "is the exponent applied to the base e.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return exp(n);
              }
        },
        EXP: {
              description: "Returns e raised to the power of a given number",
              help: "Returns e raised to the power of number. The constant e equals 2.71828182845904, the base of the natural logarithm.",
              arguments: [
                  {
                      name: "number",
                      description: "is the exponent applied to the base e.",
                      type: "number"
                  }
              ],
              remarks: [
                  "To calculate powers of other bases, use the exponentiation operator (^).",
                  "EXP is the inverse of LN, the natural logarithm of number."
              ],
              function: function(n) {
                  return exp(n);
              }
        },
        FACT: {
              description: "Returns the factorial of a number",
              help: "Returns the factorial of a number. The factorial of a number is equal to 1*2*3*...* number.",
              arguments: [
                  {
                      name: "number",
                      description: "is the nonnegative number you want the factorial of. If number is not an integer, it is truncated.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return fact(n);
              }
        },
        FACTDOUBLE: {
              description: "Returns the double factorial of a number",
              help: "Returns the double factorial of a number.",
              arguments: [
                  {
                      name: "number",
                      description: "is the value for which to return the double factorial. If number is not an integer, it is truncated.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If number is nonnumeric, FACTDOUBLE returns the #VALUE! error value.",
                  "If number is negative, FACTDOUBLE returns the #NUM! error value.",
                  "If number is even: n!! = n(n - 2)(n-4)...(4)(2)",
                  "If number is odd: n!! = n(n - 2)(n-4)...(3)(1)"
              ],
              function: function(n) {
                  //TODO: implement
                  return {
                      error: "not implement"
                  }
              }
        },
        FLOOR: {
              description: "Rounds a number down, toward zero",
              help: "Rounds number down, toward zero, to the nearest multiple of significance.",
              arguments: [
                  {
                      name: "number",
                      description: "is the value you want to round.",
                      type: "number"
                  },
                  {
                      name: "significance",
                      description: "is the multiple to which you want to round.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If either argument is nonnumeric, FLOOR returns the #VALUE! error value.",
                  "If number and significance have different signs, FLOOR returns the #NUM! error value."+
                  "Regardless of the sign of number, a value is rounded down when adjusted away from zero. If number is an exact multiple of significance, no rounding occurs."
              ],
              function: function(n, s) {
                  if (s===1) return m.floor(n);
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  }
              }
        },
        GCD: {
              description: "Returns the greatest common divisor",
              help: "Returns the greatest common divisor of two or more integers. The greatest common divisor is the largest integer that divides both number1 and number2 without a remainder.",
              arguments: [
                  {
                      name: "number1,..,number2",
                      description: " are 1 to 29 values. If any value is not an integer, it is truncated.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If any argument is nonnumeric, GCD returns the #VALUE! error value.",
                  "If any argument is less than zero, GCD returns the #NUM! error value.",
                  "One divides any value evenly.",
                  "A prime number has only itself and one as even divisors."
              ],
              function: function(n, s) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  }
              }
        },
        INT: {
              description: "Rounds a number down to the nearest integer",
              help: "Rounds a number down to the nearest integer.",
              arguments: [
                  {
                      name: "number",
                      description: " is the real number you want to round down to an integer.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return m.floor(n);
              }
        },
        LCM: {
              description: "Returns the least common multiple",
              help: "Returns the least common multiple of integers. The least common multiple is the smallest positive integer that is a multiple of all integer arguments number1, number2, and so on. Use LCM to add fractions with different denominators.",
              arguments: [
                  {
                      name: "number1,..,number2",
                      description: "are 1 to 29 values for which you want the least common multiple. If value is not an integer, it is truncated.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If any argument is nonnumeric, LCM returns the #VALUE! error value.",
                  "If any argument is less than zero, LCM returns the #NUM! error value."
              ],
              function: function(n, s) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  }
              }
        },
        LN: {
              description: "Returns the natural logarithm of a number",
              help: "Returns the natural logarithm of a number. Natural logarithms are based on the constant e (2.71828182845904).",
              arguments: [
                  {
                      name: "number",
                      description: " is the positive real number for which you want the natural logarithm.",
                      type: "number"
                  }
              ],
              remarks: [
                  "LN is the inverse of the EXP function."
              ],
              function: function(n) {
                  return ln(n);
              }
        },
        LOG: {
              description: "Returns the logarithm of a number to a specified base",
              help: "Returns the logarithm of a number to the base you specify.",
              arguments: [
                  {
                      name: "number",
                      description: "is the positive real number for which you want the logarithm.",
                      type: "number"
                  },
                  {
                      name: "base",
                      description: " is the base of the logarithm. If base is omitted, it is assumed to be 10.",
                      type: "number"
                  }
              ],
              function: function(n,b) {
                  b = (typeof(b) === "undefined") ? ln10 : ln(b);
                  return ln(n) / b;
              }
        },
        LOG10: {
              description: "Returns the base-10 logarithm of a number",
              help: "Returns the base-10 logarithm of a number.",
              arguments: [
                  {
                      name: "number",
                      description: "is the positive real number for which you want the base-10 logarithm.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return ln(n) / ln10;
              }
        },
        MDETERM: {
              description: "Returns the matrix determinant of an array",
              help: "Returns the matrix determinant of an array.",
              arguments: [
                  {
                      name: "array",
                      description: " is a numeric array with an equal number of rows and columns.",
                      type: "number"
                  }
              ],
              remarks: [
                  "Array can be given as a cell range, for example, A1:C3; as an array constant, such as {1,2,3;4,5,6;7,8,9}; or as a name to either of these.",
                  "MDTERM returns the #VALUE! error when:" +
                  "1) Any cells in array are empty or contain text."+
                  "2) Array does not have an equal number of rows and columns."+
                  "3) The size of array exceeds 73 columns by 73 rows.",
                  "The matrix determinant is a number derived from the values in array. For a three-row, three-column array, A1:C3, the determinant is defined as:",
                  "MDETERM(A1:C3) equals A1*(B2*C3-B3*C2) + A2*(B3*C1-B1*C3) + A3*(B1*C2-B2*C1)",
                  "Matrix determinants are generally used for solving systems of mathematical equations that involve several variables.",
                  "MDETERM is calculated with an accuracy of approximately 16 digits, which may lead to a small numeric error when the calculation is not complete. For example, the determinant of a singular matrix may differ from zero by 1E-16"
              ],
              function: function(n) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        MINVERSE: {
              description: "Returns the matrix inverse of an array",
              help: "Returns the inverse matrix for the matrix stored in an array.",
              arguments: [
                  {
                      name: "array",
                      description: "is a numeric array with an equal number of rows and columns.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The size of the array must not exceed 52 columns by 52 rows. If it does, the function returns a #VALUE! error.",
                  "Array can be given as a cell range, such as A1:C3; as an array constant, such as {1,2,3;4,5,6;7,8,9}; or as a name for either of these.",
                  "If any cells in array are empty or contain text, MINVERSE returns the #VALUE! error value.",
                  "MINVERSE also returns the #VALUE! error value if array does not have an equal number of rows and columns.",
                  "Formulas that return arrays must be entered as array formulas.",
                  "Inverse matrices, like determinants, are generally used for solving systems of mathematical equations involving several variables. The product of a matrix and its inverse is the identity matrix — the square array in which the diagonal values equal 1, and all other values equal 0.",
                  "As an example of how a two-row, two-column matrix is calculated, suppose that the range A1:B2 contains the letters a, b, c, and d that represent any four numbers. The following table shows the inverse of the matrix A1:B2.",
                  "COLUMN A COLUMN B",
                  "Row 1  d/(a*d-b*c) b/(b*c-a*d)",
                  "Row 2  c/(b*c-a*d) a/(a*d-b*c)",
                  "MINVERSE is calculated with an accuracy of approximately 16 digits, which may lead to a small numeric error when the cancellation is not complete.",
                  "Some square matrices cannot be inverted and will return the #NUM! error value with MINVERSE. The determinant for a noninvertable matrix is 0."
              ],
              function: function(n) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        MMULT: {
              description: "Returns the matrix product of two arrays",
              help: "Returns the matrix product of two arrays. The result is an array with the same number of rows as array1 and the same number of columns as array2.",
              arguments: [
                  {
                      name: "array1",
                      description: "is an the array you want to multiply.",
                      type: "number"
                  },
                  {
                      name: "array2",
                      description: "is the other array you want to multiply.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The number of columns in array1 must be the same as the number of rows in array2, and both arrays must contain only numbers.",
                  "Array1 and array2 can be given as cell ranges, array constants, or references.",
                  "MMULT returns the #VALUE! error when:",
                  "Any cells are empty or contain text.",
                  "The number of columns in array1 is different from the number of rows in array2.",
                  "The size of the resulting array is equal to or greater than a total of 5,461 cells.",
                  "The matrix product array a of two arrays b and c is:",
                  "where i is the row number, and j is the column number.",
                  "Formulas that return arrays must be entered as array formulas."
              ],
              function: function(n) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        MOD: {
              description: "Returns the remainder from division",
              help: "Returns the remainder after number is divided by divisor. The result has the same sign as divisor.",
              arguments: [
                  {
                      name: "number",
                      description: " is the number for which you want to find the remainder.",
                      type: "number"
                  },
                  {
                      name: "divisor",
                      description: "is the number by which you want to divide number.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If divisor is 0, MOD returns the #DIV/0! error value.",
                  "The MOD function can be expressed in terms of the INT function: MOD(n, d) = n - d*INT(n/d)"
              ],
              function: function(n, d) {
                  return n % d;
              }
        },
        MROUND: {
              description: "Returns a number rounded to the desired multiple",
              help: "Returns a number rounded to the desired multiple.",
              arguments: [
                  {
                      name: "number",
                      description: "is the value to round.",
                      type: "number"
                  },
                  {
                      name: "multiple",
                      description: "is the multiple to which you want to round number.",
                      type: "number"
                  }
              ],
              remarks: [
                  "MROUND rounds up, away from zero, if the remainder of dividing number by multiple is greater than or equal to half the value of multiple."
              ],
              function: function(n, m) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        MULTINOMIAL: {
              description: "Returns the multinomial of a set of numbers",
              help: "Returns the ratio of the factorial of a sum of values to the product of factorials.",
              arguments: [
                  {
                      name: "number1, ... number2",
                      description: " are 1 to 29 values for which you want the multinomial.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If any argument is nonnumeric, MULTINOMIAL returns the #VALUE! error value.",
                  "If any argument is less than zero, MULTINOMIAL returns the #NUM! error value.",
                  "The multinomial is: (a1 + ... + an)! / a1! ... an!"
              ],
              function: function() {
                  var denom = 0, divis = 1, i, n = arguments.length, arg;
                  for (i = 0; i < n; i++) {
                      arg = arguments[i];
                      denom += arg;
                      divis *= fact(arg);
                  }
                  return fact(denom) / divis;
              }
        },
        ODD: {
              description: "Rounds a number up to the nearest odd integer",
              help: "Returns number rounded up to the nearest odd integer.",
              arguments: [
                  {
                      name: "number",
                      description: "is the value to round.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If number is nonnumeric, ODD returns the #VALUE! error value.",
                  "Regardless of the sign of number, a value is rounded up when adjusted away from zero. If number is an odd integer, no rounding occurs."
              ],
              function: function(n) {
                  n = Math.ceil(n);
                  if (n%2 !== 1) n += (n > 0 ? 1 : -1);
                  return n;
              }
        },
        PI: {
              description: "Returns the value of pi",
              help: "Returns the number 3.14159265358979, the mathematical constant pi, accurate to 15 digits.",
              remarks: [
                  "If number is nonnumeric, ODD returns the #VALUE! error value.",
                  "Regardless of the sign of number, a value is rounded up when adjusted away from zero. If number is an odd integer, no rounding occurs."
              ],
              function: function() {
                  return pi;
              }
        },
        POWER: {
              description: "Returns the result of a number raised to a power",
              help: "Returns the result of a number raised to a power.",
              arguments: [
                  {
                      name: "number",
                      description: "is the base number. It can be any real number.",
                      type: "number"
                  },
                  {
                      name: "power",
                      description: "is the exponent to which the base number is raised.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The \"^\" operator can be used instead of POWER to indicate to what power the base number is to be raised, such as in 5^2."
              ],
              function: function(n,p) {
                  return pow(n, p);
              }
        },
        PRODUCT: {
              description: "Multiplies its arguments",
              help: "Multiplies all the numbers given as arguments and returns the product.",
              arguments: [
                  {
                      name: "number1, ..., number2",
                      description: "are 1 to 30 numbers that you want to multiply.",
                      type: "number"
                  },
              ],
              remarks: [
                  "Arguments that are numbers, logical values, or text representations of numbers are counted;"+
                  " arguments that are error values or text that cannot be translated into numbers cause errors.",
                  "If an argument is an array or reference, only numbers in the array or reference are counted."+
                  " Empty cells, logical values, text, or error values in the array or reference are ignored."
              ],
              function: function() {
                  var i, n = arguments.length, arg, res, vale;
                  for (i = 0; i < n; i++) {
                      arg = arguments[i];
                      val = null;
                      switch (typeof(arg)) {
                          case "number":
                              val = arg;
                              break;
                      }
                      if (val !== null) res = (typeof(res) === "undefined") ? val : res * val;
                  }
                  return res;
              }
        },
        QUOTIENT: {
              description: "Returns the integer portion of a division",
              help: "Returns the integer portion of a division. Use this function when you want to discard the remainder of a division.",
              arguments: [
                  {
                      name: "numerator",
                      description: "is the dividend.",
                      type: "number"
                  },
                  {
                      name: "denominator",
                      description: "is the divisor.",
                      type: "number"
                  },
              ],
              remarks: [
                  "If either argument is nonnumeric, QUOTIENT returns the #VALUE! error value."
              ],
              function: function(n,d) {
                  return parseInt(n/d);
              }
        },
        RADIANS: {
              description: "Converts degrees to radians",
              help: "Converts degrees to radians.",
              arguments: [
                  {
                      name: "angle",
                      description: "is an angle in degrees that you want to convert.",
                      type: "number"
                  }
              ],
              function: function(a) {
                  return pi * a/180;
              }
        },
        RAND: {
              description: "Returns a random number between 0 and 1",
              help: "Returns an evenly distributed random real number greater than or equal to 0 and less than 1."+
                    "A new random real number is returned every time the worksheet is calculated.",
              remarks: [
                  "To generate a random real number between a and b, use: RAND()*(b-a)+a",
                  "If you want to use RAND to generate a random number but don't want the numbers to change every time the cell is calculated,"+
                  " you can enter =RAND() in the formula bar, and then press F9 to change the formula to a random number."
              ],
              function: function() {
                  return m.random();
              }
        },
        RANDBETWEEN: {
              description: "Returns a random number between the numbers you specify",
              help: "Returns a random integer number between the numbers you specify. A new random integer number is returned every time the worksheet is calculated.",
              arguments: [
                  {
                      name: "bottom",
                      description: "is the smallest integer RANDBETWEEN will return.",
                      type: "number"
                  },
                  {
                      name: "top",
                      description: "is the largest integer RANDBETWEEN will return.",
                      type: "number"
                  }
              ],
              function: function(b, t) {
                  return m.random() * (t - b) + b;
              }
        },
        ROMAN: {
              description: "Converts an arabic numeral to roman, as text",
              help: "Converts an arabic numeral to roman, as text.",
              arguments: [
                  {
                      name: "number",
                      description: " is the Arabic numeral you want converted.",
                      type: "number"
                  },
                  {
                      name: "form",
                      description: "is a number specifying the type of roman numeral you want. The roman numeral style ranges from Classic to Simplified, becoming more concise as the value of form increases. See the example following ROMAN(499,0) below."+
                                  " If 0 or ommitted: Classic." +
                                  " If 1: more concise." +
                                  " If 2: more concise." +
                                  " If 3: more concise." +
                                  " If 4: simplified." +
                                  " If TRUE: classic." +
                                  " If FALSE: Simplified.",
                      type: "number"
                  }
              ],
              examples: [
                {
                  code: "=ROMAN(499,0)",
                  description: "CDXCIX"
                },
                {
                  code: "=ROMAN(499,1)",
                  description: "LDVLIV"
                },
                {
                  code: "=ROMAN(499,2)",
                  description: "XDIX"
                },
                {
                  code: "=ROMAN(499,3)",
                  description: "VDIV"
                },
                {
                  code: "=ROMAN(499,4)",
                  description: "ID"
                }
              ],
              function: function(number, form) {
                  if (typeof(number)!=="number" || number < 0 || number > 3999) throw {
                      error: "invalid number"
                  }
                  switch (typeof(form)) {
                      case "number":
                          break;
                      case "undefined":
                          form = 1;
                          break;
                      case "boolean":
                          form = form ? 1 : 4;
                          break;
                      default: throw {
                          error: "Invalid number format"
                      };
                  }
                  //todo: Implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        ROUND: {
              description: "Rounds a number to a specified number of digits",
              help: "Rounds a number to a specified number of digits.",
              arguments: [
                  {
                      name: "number",
                      description: "is the number you want to round.",
                      type: "number"
                  },
                  {
                      name: "num_digits",
                      description: "specifies the number of digits to which you want to round number.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If num_digits is greater than 0 (zero), then number is rounded to the specified number of decimal places.",
                  "If num_digits is 0, then number is rounded to the nearest integer.",
                  "If num_digits is less than 0, then number is rounded to the left of the decimal point."
              ],
              function: function(number, num_digits) {
                  if (num_digits < 0) {
                      var factor = pow(10, abs(num_digits))
                      number /= factor;
                      number = number.toFixed(0);
                      number *= factor;
                  }
                  else number = number.toFixed(num_digits);
                  return number;
              }
        },
        ROUNDDOWN: {
              description: "Rounds a number down, toward zero",
              help: "Rounds a number down, toward zero.",
              arguments: [
                  {
                      name: "number",
                      description: "is the number you want to round.",
                      type: "number"
                  },
                  {
                      name: "num_digits",
                      description: "specifies the number of digits to which you want to round number.",
                      type: "number"
                  }
              ],
              remarks: [
                  "ROUNDDOWN behaves like ROUND, except that it always rounds a number down.",
                  "If num_digits is greater than 0 (zero), then number is rounded down to the specified number of decimal places.",
                  "If num_digits is 0, then number is rounded down to the nearest integer.",
                  "If num_digits is less than 0, then number is rounded down to the left of the decimal point."
              ],
              function: function(number, num_digits) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        ROUNDUP: {
              description: "Rounds a number up, away from zero",
              help: "Rounds a number up, away from 0 (zero).",
              arguments: [
                  {
                      name: "number",
                      description: "is the number you want to round.",
                      type: "number"
                  },
                  {
                      name: "num_digits",
                      description: "specifies the number of digits to which you want to round number.",
                      type: "number"
                  }
              ],
              remarks: [
                  "ROUNDUP behaves like ROUND, except that it always rounds a number up.",
                  "If num_digits is greater than 0 (zero), then number is rounded down to the specified number of decimal places.",
                  "If num_digits is 0, then number is rounded down to the nearest integer.",
                  "If num_digits is less than 0, then number is rounded down to the left of the decimal point."
              ],
              function: function(number, num_digits) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SERIESSUM: {
              description: "Returns the sum of a power series based on the formula",
              help: "Returns the sum of a power series based on the formula:" +
                    "a1 * pow(x, n + 0*m) + a2 * pow(x, n+ 1*m) + ... + ai * pow(x, n + (i-1)*m)",
              arguments: [
                  {
                      name: "x",
                      description: "is the input value to the power series.",
                      type: "number"
                  },
                  {
                      name: "n",
                      description: "is the initial power to which you want to raise x.",
                      type: "number"
                  },
                  {
                      name: "m",
                      description: "is the step by which to increase n for each term in the series.",
                      type: "number"
                  },
                  {
                      name: "c",
                      description: "is a set of coefficients by which each successive power of x is multiplied."+
                                  " The number of values in coefficients determines the number of terms in the power series."+
                                  " For example, if there are three values in coefficients, then there will be three terms in the power series.",
                      type: "number"
                  },
              ],
              remarks: [
                  "If any argument is nonnumeric, SERIESSUM returns the #VALUE! error value."
              ],
              function: function(number, num_digits) {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SIGN: {
              description: "Returns the sign of a number",
              help: "Determines the sign of a number. Returns 1 if the number is positive, zero (0) if the number is 0, and -1 if the number is negative.",
              arguments: [
                  {
                      name: "number",
                      description: "is any real number.",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return n === abs(n) ? 1 : 0;
              }
        },
        SIN: {
              description: "Returns the sine of the given angle",
              help: "Returns the sine of the given angle.",
              arguments: [
                  {
                      name: "number",
                      description: "is the angle in radians for which you want the sine.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If you want to convert the result from radians to degrees, multiply it by 180/PI() or use the DEGREES function."
              ],
              function: function(n) {
                  return m.sin(n);
              }
        },
        SINH: {
              description: "Returns the hyperbolic sine of a number",
              help: "Returns the hyperbolic sine of a number.",
              arguments: [
                  {
                      name: "number",
                      description: "is any real number",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return sinh(n);
              }
        },
        SQRT: {
              description: "Returns a positive square root",
              help: "Returns a positive square root",
              arguments: [
                  {
                      name: "number",
                      description: "is the number for which you want the square root.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If number is negative, SQRT returns the #NUM! error value."
              ],
              function: function(n) {
                  if (n < 0) throw {
                    error: "Number may not be negative."
                  };
                  return V(n);
              }
        },
        SQRTPI: {
              description: "Returns the square root of (number * pi)",
              help: "Returns the square root of (number * pi).",
              arguments: [
                  {
                      name: "number",
                      description: "is the number by which pi is multiplied.",
                      type: "number"
                  }
              ],
              remarks: [
                  "If number is negative, SQRT returns the #NUM! error value."
              ],
              function: function(n) {
                  if (n < 0) throw {
                      error: "Number may not be negative."
                  };
                  return V(pi * n);
              }
        },
        SUBTOTAL: {
              description: "Returns a subtotal in a list or database",
              help: "Returns a subtotal in a list or database."+
                    " It is generally easier to create a list with subtotals using the Subtotals command (Data menu)."+
                    " Once the subtotal list is created, you can modify it by editing the SUBTOTAL function.",
              arguments: [
                  {
                      name: "function_num",
                      description: " is the number 1 to 11 (includes hidden values) or 101 to 111 (ignores hidden values) that specifies which function to use in calculating subtotals within a list." +
                                    " If  1 or 101: AVERAGE"+
                                    " If  2 or 102: COUNT"+
                                    " If  3 or 103: COUNTA"+
                                    " If  4 or 104: MAX"+
                                    " If  5 or 105: MIN"+
                                    " If  6 or 106: PRODUCT"+
                                    " If  7 or 107: STDEV"+
                                    " If  8 or 108: STDEVP"+
                                    " If  9 or 109: SUM"+
                                    " If 10 or 110: VAR"+
                                    " If 11 or 111: VARP",
                      type: "number"
                  },
                  {
                      name: "ref1, ..., ref2",
                      description: "are 1 to 29 ranges or references for which you want the subtotal.",
                      type: ""
                  }
              ],
              remarks: [
                  "If there are other subtotals within ref1, ref2,… (or nested subtotals), these nested subtotals are ignored to avoid double counting.",
                  "For the function_num constants from 1 to 11, the SUBTOTAL function includes the values of rows hidden by the Hide command under the Row submenu of the Format menu)."+
                    " Use these constants when you want to subtotal hidden and nonhidden numbers in a list."+
                    " For the function_Num constants from 101 to 111, the SUBTOTAL function ignores values of rows hidden by the Hide command under the Row submenu of the Format menu)."+
                    " Use these constants when you want to subtotal only nonhidden numbers in a list.",
                  "The SUBTOTAL function ignores any rows that are not included in the result of a filter, no matter which function_num value you use.",
                  "The SUBTOTAL function is designed for columns of data, or vertical ranges."+
                    " It is not designed for rows of data, or horizontal ranges."+
                    " For example, when you subtotal a horizontal range using a function_num of 101 or greater, such as SUBTOTAL(109,B2:G2), hiding a column does not affect the subtotal."+
                    " But, hiding a row in a subtotal of a vertical range does affect the subtotal.",
                  "If any of the references are 3-D references, SUBTOTAL returns the #VALUE! error value."
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SUM: {
              description: "Adds its arguments",
              help: "Adds all the numbers in a range of cells.",
              arguments: [
                  {
                      name: "number1, ..., number2",
                      description: "are 1 to 30 arguments for which you want the total value or sum.",
                      type: "number"
                  }
              ],
              remarks: [
                  "Numbers, logical values, and text representations of numbers that you type directly into the list of arguments are counted."+
                  " See the first and second examples following.",
                  "If an argument is an array or reference, only numbers in that array or reference are counted."+
                  " Empty cells, logical values, or text in the array or reference are ignored. See the third example following.",
                  "Arguments that are error values or text that cannot be translated into numbers cause errors."
              ],
              function: function() {
              }
        },
        SUMIF: {
              description: "Adds the cells specified by a given criteria",
              help: "Adds the cells specified by a given criteria.",
              arguments: [
                  {
                      name: "range",
                      description: "is the range of cells that you want evaluated by criteria",
                      type: "number"
                  },
                  {
                      name: "criteria",
                      description: " is the criteria in the form of a number, expression, or text that defines which cells will be added. For example, criteria can be expressed as 32, \"32\", \">32\", or \"apples\".",
                      type: "misc"
                  },
                  {
                      name: "sum_range",
                      description: "are the actual cells to add if their corresponding cells in range match criteria."+
                                  "If sum_range is omitted, the cells in range are both evaluated by criteria and added if they match criteria.",
                      type: "number"
                  },
              ],
              remarks: [
                  "Sum_range does not have to be the same size and shape as range."+
                  " The actual cells that are added are determined by using the top, left cell in sum_range as the beginning cell,"+
                  " and then including cells that correspond in size and shape to range. For example:",
                  "You can use the wildcard characters, question mark (?) and asterisk (*), in criteria."+
                  " A question mark matches any single character; an asterisk matches any sequence of characters."+
                  " If you want to find an actual question mark or asterisk, type a tilde (~) preceding the character."
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SUMPRODUCT: {
              description: "Returns the sum of the products of corresponding array components",
              help: "Multiplies corresponding components in the given arrays, and returns the sum of those products.",
              arguments: [
                  {
                      name: "array1, array2, ...",
                      description: "are 2 to 30 arrays whose components you want to multiply and then add.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The array arguments must have the same dimensions. If they do not, SUMPRODUCT returns the #VALUE! error value.",
                  "SUMPRODUCT treats array entries that are not numeric as if they were zeros."
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SUMSQ: {
              description: "Returns the sum of the squares of the arguments",
              help: "Returns the sum of the squares of the arguments.",
              arguments: [
                  {
                      name: "number, number, ...",
                      description: "are 1 to 30 arguments for which you want the sum of the squares. You can also use a single array or a reference to an array instead of arguments separated by commas.",
                      type: "number"
                  }
              ],
              remarks: [
                  "Arguments can either be numbers or names, arrays, or references that contain numbers.",
                  "Numbers, logical values, and text representations of numbers that you type directly into the list of arguments are counted.",
                  "If an argument is an array or reference, only numbers in that array or reference are counted."+
                    " Empty cells, logical values, text, or error values in the array or reference are ignored.",
                  "Arguments that are error values or text that cannot be translated into numbers cause errors."
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SUMX2MY2: {
              description: "Returns the sum of the difference of squares of corresponding values in two arrays",
              help: "Returns the sum of the difference of squares of corresponding values in two arrays.",
              arguments: [
                  {
                      name: "array_x",
                      description: "is the first array or range of values.",
                      type: "number"
                  },
                  {
                      name: "array_y",
                      description: "is the second array or range of values.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The arguments should be either numbers or names, arrays, or references that contain numbers.",
                  "If an array or reference argument contains text, logical values, or empty cells, those values are ignored; however, cells with the value zero are included.",
                  "If array_x and array_y have a different number of values, SUMX2MY2 returns the #N/A error value.",
                  "The equation for the sum of the difference of squares is:"
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SUMX2PY2: {
              description: "Returns the sum of the sum of squares of corresponding values in two arrays",
              helpe: "Returns the sum of the sum of squares of corresponding values in two arrays. The sum of the sum of squares is a common term in many statistical calculations.",
              arguments: [
                  {
                      name: "array_x",
                      description: "is the first array or range of values.",
                      type: "number"
                  },
                  {
                      name: "array_y",
                      description: "is the second array or range of values.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The arguments should be either numbers or names, arrays, or references that contain numbers.",
                  "If an array or reference argument contains text, logical values, or empty cells, those values are ignored; however, cells with the value zero are included.",
                  "If array_x and array_y have a different number of values, SUMX2PY2 returns the #N/A error value.",
                  "The equation for the sum of the sum of squares is:"
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        SUMXMY2: {
              description: "Returns the sum of squares of differences of corresponding values in two arrays",
              helpe: "Returns the sum of squares of differences of corresponding values in two arrays.",
              arguments: [
                  {
                      name: "array_x",
                      description: "is the first array or range of values.",
                      type: "number"
                  },
                  {
                      name: "array_y",
                      description: "is the second array or range of values.",
                      type: "number"
                  }
              ],
              remarks: [
                  "The arguments should be either numbers or names, arrays, or references that contain numbers.",
                  "If an array or reference argument contains text, logical values, or empty cells, those values are ignored; however, cells with the value zero are included.",
                  "If array_x and array_y have a different number of values, SUMXMY2 returns the #N/A error value.",
                  "The equation for the sum of the sum of squares is:"
              ],
              function: function() {
                  //TODO: implement
                  return {
                      error: "Not implemented"
                  };
              }
        },
        TAN: {
              description: "Returns the tangent of a number",
              help: "Returns the tangent of the given angle.",
              arguments: [
                  {
                      name: "number",
                      description: " is the angle in radians for which you want the tangent.",
                      type: "number"
                  }
              ],
              remarks: [
                "If you want to convert the result from radians to degrees, multiply it by 180/PI() or use the DEGREES function."
              ],
              function: function(n) {
                  return m.tan(n);
              }
        },
        TANH: {
              description: "Returns the hyperbolic tangent of a number",
              help: "Returns the hyperbolic tangent of a number",
              arguments: [
                  {
                      name: "number",
                      description: " is any real number",
                      type: "number"
                  }
              ],
              function: function(n) {
                  return sinh(n) / cosh(n);
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
        }
    }
};

});
