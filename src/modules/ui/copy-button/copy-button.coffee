

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
			tooltip = getTooltip()
			tooltip.options.title = angular.element(@).attr 'data-copy-message'
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
			replace: true
			transclude: true
			template: """
					<span ng-transclude class="kb-copy-button" title="{{ copyTitle }}" data-clipboard-text="{{ copyValue }}" data-copy-message="{{ copyMessage }}"></span>
			"""
			link: (scope, element, attrs) ->

				clip.glue(element)

				scope.$on('$destroy', ->
					clip.unglue(element)
				)

		}
	])