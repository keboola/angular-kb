###
  Formats duration in seconds to minutes, hours, ...
###
angular.module( 'kb.filters.duration', [])
	.filter( 'kbDuration', ->

		(duration) ->

			value = (durationCoverted, singular, plural) ->
				rounded  = Math.round(durationCoverted * 2) / 2
				if rounded > 1
					"#{rounded} #{plural}"
				else
					"#{rounded} #{singular}"

			switch
				when duration < 60 then value(duration, 'sec', 'secs')
				when duration < 60*60 then value(duration/60, 'min', 'mins')
				else value(duration/(60*60), 'hour', 'hours')
	)