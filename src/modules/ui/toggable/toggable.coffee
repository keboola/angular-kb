###
  Toggable element ang group
  Based on http://twitter.github.com/bootstrap/javascript.html#collapse styles
###
angular.module('kb.ui.toggable', [])
	.directive('kbToggableGroup', ->
		restrict: 'E'
		transclude: true
		replace: true
		template: """
		<div class="accordion kb-toggable" ng-transclude>
		</div>
				"""
	)
	.directive('kbToggable', ->
		restrict: 'E'
		replace: true
		transclude: true
		scope:
			title: '@header'
			opened: '='
		template: """
					<div class="accordion-group">
						<div class="accordion-heading">
						<a class="accordion-toggle">
							<span class="toggle-arrow-wrap"><i class="toggle-arrow"></i></span> {{ title }}
						</a>
					</div>
					<div class="accordion-body collapse">
						<div class="accordion-inner" ng-transclude></div>
					</div>
		</div>
		"""
		link: (scope, element) ->
			title = element.find('.accordion-toggle')
			elements = element.find('.accordion-body,.accordion-heading')

			opened = false
			scope.$watch('opened', (openedNewValue) ->
				opened = openedNewValue
				toggle()
			)

			toggle = ->
				elements.removeClass 'in'
				elements.addClass 'in' if opened

			title.bind 'click', ->
				scope.$apply ->
					opened = !opened
					toggle()
	)
