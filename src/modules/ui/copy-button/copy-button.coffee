

angular
	.module( 'kb.ui.copyButton', [])
	.directive('kbCopyButton', ['$timeout', ($timeout) ->
		ZeroClipboard.setMoviePath( '/components/zeroclipboard/ZeroClipboard.swf' )
		return {
			restrict: 'E'
			scope:
				copyValue: '='
				copyTitle: '@'
				copyMessage: '@'
			replace: true
			transclude: true
			template: """
				<div class="copy-button-container">
					<div ng-transclude class="copy-button"></div>
				</div>
			"""
			link: (scope, element, attrs) ->
				clip = new ZeroClipboard.Client();
				clip.glue( element.find('.copy-button')[0], angular.element(element)[0] )
				clip.setText( scope.copyValue )

				element.find('div').last().addClass('zero-clipboard-overlay')
				element.tooltip(
					title: scope.copyTitle
				)
				tooltip = element.data('tooltip')

				setTooltipTitle = (title) ->
					element.removeAttr('data-original-title')
					tooltip.options.title = title

				scope.$watch('copyValue', (newValue) ->
					clip.setText( newValue )
				)

				scope.$watch('copyTitle', (copyTitle) ->
					setTooltipTitle(copyTitle)
				)

				scope.$on('$destroy', ->
					clip.destroy()
					tooltip.destroy()
				)

				clip.addEventListener( 'onComplete', (client, text) ->

					setTooltipTitle(scope.copyMessage)
					tooltip.show()

					$timeout(	->
						setTooltipTitle(scope.copyTitle)
					, 2000)
				)
		}
	])