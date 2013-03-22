###
  Keyboard shortcuts registration service
  Depends: /app/libs/mousetrap
###

angular.module('kb.utils.keyboardShortcuts', [])
	.factory( 'kbKeyboardShortcuts', ->

		# modify Mousetrap stop callback action
		originalStopCallback = Mousetrap.stopCallback
		Mousetrap.stopCallback = (e, element, combo) ->
			return true if originalStopCallback(e, element, combo)

			return element.tagName == 'BUTTON'

		($scope, shortcuts) ->
			angular.forEach( shortcuts, (methodName, shortcut) ->
				Mousetrap.bind( shortcut, ->
					$scope.$apply ->
						$scope[methodName]()
					false
				)
				$scope.$on('$destroy', ->
					Mousetrap.unbind( shortcut )
				)
			)
	)