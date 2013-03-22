
###
  Convert new lines into <br/>
###

angular
	.module('kb.ui.nl2br', [])
	.directive('kbNl2br', ->
		(scope, element, attr) ->
			scope.$watch(attr.kbNl2br, (text = '') ->
				textWithNormalizedLineBreaks = text.replace('\r\n', '\n')
				textParts = textWithNormalizedLineBreaks.split('\n')

				element.empty()
				angular.forEach(textParts, (textPart, index) ->

					textElement = angular.element('<span></span>')
					textElement.text(textPart)
					element.append(textElement)

					isLastTextPart = (textParts.length - 1) == index
					element.append(angular.element('<br/>')) if !isLastTextPart
				)
			)
	)