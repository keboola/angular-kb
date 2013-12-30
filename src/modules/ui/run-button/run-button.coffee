

angular.module('kb.ui.runButton', ['kb.ui.loader'])
	.directive('kbRunButton', ->
			restrict: 'E'
			template: """
				<button class="btn run-transformation kb-loader">
					<i  class="glyphicon glyphicon-play"> </i>
				</button>
			"""
			replace: true
			link: (scope, element, attrs) ->
				icon = element.find('i')
				scope.$watch(attrs.isRunning, (newValue) ->
					element.removeClass('running')
					icon.removeClass('glyphicon-refresh')
					icon.removeClass('glyphicon-play')
					icon.removeClass('loading')
					if newValue
						element.addClass('running')
						icon.addClass('glyphicon-refresh loading')
					else
						icon.addClass('glyphicon-play')
				)
		)