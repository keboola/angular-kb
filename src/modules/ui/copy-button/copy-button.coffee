
###
  Copy button
  Copy value to clipboard on click
  @TODO: add dependency for ZeroClipboard
###

angular
	.module( 'kb.ui.copyButton', [])
	.directive('kbCopyButton', ['$timeout', ($timeout) ->
		restrict: 'E'
		scope:
			copyValue: '='
			copyMessage: '@'
		replace: true
		transclude: true
		template: """
			<div class="copy-button-container">
				<div ng-transclude class="copy-button"></div>
			</div>
		"""
		link: (scope, element, attrs) ->
			element.css('position', 'relative')
			ZeroClipboard.setMoviePath( '/lib/zero-clipboard/ZeroClipboard.swf' )
			clip = new ZeroClipboard.Client();
			clip.glue( element.find('.copy-button')[0], angular.element(element)[0] )
			clip.setText( scope.copyValue )

			element.find('div').last().addClass('zero-clipboard-overlay')

			scope.$watch('copyValue', (newValue) ->
				clip.setText( newValue )
			)

			scope.$on('$destroy', ->
				clip.destroy()
			)

			clip.addEventListener( 'onComplete', (client, text) ->
				# modify tooltip
				tooltip = element.data('tooltip')
				return if !tooltip

				originalTitle = element.attr('data-original-title')
				element.removeAttr('data-original-title')

				tooltip.options.title = scope.copyMessage
				tooltip.show()

				setOriginalTitle = ->
					tooltip.options.title = originalTitle

				$timeout(setOriginalTitle, 2000)
			)
	])