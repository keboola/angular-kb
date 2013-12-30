###
# Accepts datetime in ISO_8601 format and converts to current client timezone
# otherwise original value is displayed
###

angular
	.module( 'kb.ui.datetime', ['ui.bootstrap.tooltip', 'ui.bootstrap.tpls'])
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
				<span ng-cloak ng-class="{'muted': isEmpty()}">
					{{ formattedValue() }}
					<i class="kb-datetime glyphicon glyphicon-time" tooltip="{{ tooltipTitle }}" ng-show="isDatetime()"></i>
				</span>
			"""
			link: (scope, element, attrs) ->

				scope.tooltipTitle = ''

				scope.resolveEmptyValue = ->
					return 'N/A' if !scope.emptyValue
					scope.emptyValue

				scope.isEmpty = ->
					!scope.datetime

				scope.isDatetime = ->
					!!(scope.datetime && scope.datetime.match(R_ISO8601_STR))

				scope.$watch('datetime', () ->
					scope.tooltipTitle = if scope.isDatetime() then "Original time: " + scope.datetime else ""
				)

				scope.formattedValue = ->
					return scope.resolveEmptyValue() if scope.isEmpty()
					if scope.isDatetime()
						return dateFilter scope.datetime, 'fullDate'

					# value is not date, show original value
					scope.datetime
		}
	])