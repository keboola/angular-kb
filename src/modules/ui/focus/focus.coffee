###
  Input autofocus
###

angular
	.module( 'kb.ui.focus', [])
	.directive( 'kbFocus', [ "$timeout", "$parse", ($timeout, $parse) ->
		(scope, element, attrs) ->

			focusElement = ->
				$timeout ->
					element.focus()
				, 50 # focus inside modal fix

			if !attrs.kbFocus
				# just focus
				focusElement()
				return

			scope.$watch attrs.kbFocus, (value) ->
				focusElement() if value

	])