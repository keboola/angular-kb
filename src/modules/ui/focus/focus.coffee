###
  Input autofocus
###

angular
	.module( 'kb.ui.focus', [])
	.directive( 'kbFocus', [ "$timeout", ($timeout) ->
		(scope, element) ->
			$timeout ->
				element.focus()
			, 50 # focus inside modal fix
	])