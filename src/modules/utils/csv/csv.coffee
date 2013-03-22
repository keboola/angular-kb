###
  CSV parer
  Depends on: /app/libs/csv/csv.js
###

angular.module('kb.utils.csv', [])
	.factory( 'kbCsv', ->
		'parse': csvParser.parse
		'create': (data) ->
			rows = []
			data.forEach((row) ->
				columns = []
				row.forEach((column) ->
					return if column == null
					columns.push('"' + column.replace(/"/g, '""') + '"')
				)
				rows.push(columns.join(','))
			)
			rows.join('\n')
	)