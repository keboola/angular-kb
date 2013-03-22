

angular.module('kb.ui.runButton', ['kb.ui.loader'])
	.directive('kbRunButton', ->
			restrict: 'E'
			template: """
				<a class="btn run-transformation kb-loader">
					<i  class="icon-play"> </i>
				</a>
			"""
			replace: true
			link: (scope, element, attrs) ->
				icon = element.find('i')
				scope.$watch(attrs.isRunning, (newValue) ->
					element.removeClass('running')
					icon.removeClass('icon-refresh')
					icon.removeClass('icon-play')
					icon.removeClass('loading')
					if newValue
						element.addClass('running')
						icon.addClass('icon-refresh loading')
					else
						icon.addClass('icon-play')
				)
		)