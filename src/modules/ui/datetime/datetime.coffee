###
# Accepts datetime in ISO_8601 format and converts to current client timezone
# otherwise original value is displayed
###

angular
	.module( 'kb.ui.datetime', [])
	.directive('kbDatetime', ["$filter", ($filter) ->

		dateFilter = $filter('date')
		R_ISO8601_STR = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d):?(\d\d)?$/

		return {
			restrict: 'E'
			transclude: true
			replace: true
			scope:
				datetime: '='
				emptyValue: '@'
			template: """
				<span ng-cloak>
					{{ formattedValue() }}
					<i class="kb-datetime icon-time" ng-show="isDatetime()"></i>
				</span>
			"""
			link: (scope, element, attrs) ->

				scope.resolveEmptyValue = ->
					console.log scope
					return 'N/A' if !scope.emptyValue
					scope.emptyValue

				tooltipTitle = ->
					if scope.isDatetime() then "Original time: " + scope.datetime else ""

				scope.isDatetime = ->
					!!(scope.datetime && scope.datetime.match(R_ISO8601_STR))

				scope.$watch('datetime', (newValue) ->
					element.removeClass('empty')
					element.addClass('empty') if !newValue

					element.find('i').tooltip(
						title: tooltipTitle()
					)
				)

				scope.formattedValue = ->
					return scope.resolveEmptyValue() if !scope.datetime
					if scope.isDatetime()
						return dateFilter scope.datetime, 'fullDate'

					# value is not date, show original value
					scope.datetime
		}
	])