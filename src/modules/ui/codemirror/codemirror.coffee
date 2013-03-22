
###
  kbCodemirror options passed to CodeMirror instance create
  Special options:
  	- cursorPos: sets cursor position after initialization

  CodeMirror
###

angular.module('kb.ui.codemirror', ['kb.config'])
	.directive('kbCodemirror', ["$timeout", "$window", "kb.config", ($timeout, $window, config) ->
		restrict: 'A'
		require: 'ngModel'
		link: (scope, element, attrs, ngModel) ->

			opts = angular.extend({}, config.codemirror || {}, scope.$eval(attrs.kbCodemirror))

			$timeout( ->
				codeMirror = CodeMirror.fromTextArea(element[0], opts)

				# cursor position
				if opts.cursorPos
					codeMirror.setCursor(opts.cursorPos)
					$window.scrollTo(codeMirror.cursorCoords().left, codeMirror.cursorCoords().top)

				codeMirror.on('change', (cm) ->
					newValue = cm.getValue()
					ngModel.$setViewValue(newValue)
				)

				codeMirror.on('blur', (cm) ->
					angular
						.element(cm.getWrapperElement())
						.removeClass('focused')
				)

				codeMirror.on('focus', (cm) ->
					angular
						.element(cm.getWrapperElement())
						.addClass('focused')
				)

				ngModel.$formatters.push((value) ->
					if (angular.isUndefined(value) || value == null)
						return ''

					if (angular.isObject(value) || angular.isArray(value))
						throw new Error('ui-codemirror cannot use an object or an array as a model')

					value
				)

				ngModel.$render = ->
					codeMirror.setValue(ngModel.$viewValue)

			)
	])