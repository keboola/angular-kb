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
				<span ng-show="isEmpty()" class="muted">{{ emptyValue || 'N/A' }}</span>
			</span>
    """
		link: (scope) ->

			scope.isEmpty = ->
				scope.duration == null


	)
