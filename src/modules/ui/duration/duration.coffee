###
  Formatted duration
###

angular
	.module( 'kb.ui.duration', ['kb.filters.duration'])
	.directive('kbDuration', ->
		restrict: 'E'
		scope:
			duration: '='
			emptyValue: '@'
		replace: true
		template: """
			<span title="{{ duration }} seconds">
				<span ng-hide="isEmpty()">{{ duration | kbDuration }}</span>
				<span ng-show="isEmpty()" class="muted">{{ getEmptyValue() }}</span>
			</span>
    """
		link: (scope) ->

			scope.isEmpty = ->
				scope.duration == null || angular.isUndefined(scope.duration)

			scope.getEmptyValue = ->
				if angular.isUndefined(scope.emptyValue) then "N/A" else scope.emptyValue

	)
