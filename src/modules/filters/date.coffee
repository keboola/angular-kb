
# kbdate filter formats only dates in format 2012-08-16T16:25:39+0200

angular.module( 'kb.filters.date', [])
  .filter( 'kbdate', [ "$filter", ($filter) ->
    dateFilter = $filter('date')
    R_ISO8601_STR = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d):?(\d\d)?$/

    (date, format) ->
      if date && date.match(R_ISO8601_STR)
        return dateFilter date, format

      date
  ])