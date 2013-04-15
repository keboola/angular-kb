

angular
	.module( 'kb.ui.copyButton', ['kb.config'])
	.directive('kbCopyButton', ['$timeout', 'kb.config', ($timeout, config) ->

		# set zeroclipboard swf path
		swfPath = config['ui']?['copy-button']?['swfPath']
		swfPath = '/components/zeroclipboard/ZeroClipboard.swf' if !swfPath
		clip = new ZeroClipboard(null,
			moviePath: swfPath
		)

		getTooltip = ->
			angular.element(clip.htmlBridge).data('tooltip')

		clip.on 'complete', (client, text) ->
			console.log @
			tooltip = getTooltip()
			tooltip.options.title = angular.element(@).attr 'copy-message'
			tooltip.show()

		clip.on 'load', (client) ->
			angular.element(client.htmlBridge).tooltip()

		clip.on 'mouseover', (client) ->
			tooltip = getTooltip()
			tooltip.options.title = angular.element(@).attr 'title'
			tooltip.show()

		return {
			restrict: 'E'
			scope:
				copyValue: '='
				copyTitle: '@'
				copyMessage: '@'
			transclude: true
			template: """
					<span ng-transclude class="kb-copy-button" title="{{ copyTitle }}" data-clipboard-text="{{ copyValue }}" copy-message="{{ copyMessage }}"></span>
			"""
			link: (scope, element) ->

				copyElement = element.find('.kb-copy-button')
				clip.glue(copyElement)

				scope.$on('$destroy', ->
					clip.unglue(copyElement)
				)

		}
	])