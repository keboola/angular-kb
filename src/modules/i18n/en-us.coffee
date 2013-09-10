
angular.module "kb.i18n", [], ["$provide", ($provide) ->
  PLURAL_CATEGORY =
    ZERO: "zero"
    ONE: "one"
    TWO: "two"
    FEW: "few"
    MANY: "many"
    OTHER: "other"

  $provide.value "$locale",
    DATETIME_FORMATS:
      MONTH: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
      SHORTMONTH: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      DAY: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
      SHORTDAY: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      AMPMS: ["AM", "PM"]
      medium: "MMM d, y h:mm:ss a"
      short: "M/d/yy h:mm a"
      fullDate: "yyyy-MM-dd HH:mm"
      longDate: "MMMM d, y"
      mediumDate: "MMM d, y"
      shortDate: "M/d/yy"
      mediumTime: "h:mm:ss a"
      shortTime: "h:mm a"

    NUMBER_FORMATS:
      DECIMAL_SEP: "."
      GROUP_SEP: ","
      PATTERNS: [
        minInt: 1
        minFrac: 0
        macFrac: 0
        posPre: ""
        posSuf: ""
        negPre: "-"
        negSuf: ""
        gSize: 3
        lgSize: 3
        maxFrac: 3
      ,
        minInt: 1
        minFrac: 2
        macFrac: 0
        posPre: "¤"
        posSuf: ""
        negPre: "(¤"
        negSuf: ")"
        gSize: 3
        lgSize: 3
        maxFrac: 2
      ]
      CURRENCY_SYM: "$"

    pluralCat: (n) ->
      returnPLURAL_CATEGORY.ONE  if n is 1
      returnPLURAL_CATEGORY.OTHER

    id: "en-us"

]
