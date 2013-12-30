
angular.module('kb.ui.loader', [])
	.directive('kbLoader', ->
		restrict: 'E'
		template: """
			<a kb-loader class="kb-loader">
				<i class="glyphicon glyphicon-refresh"> </i>
			</a>
		"""
		replace: true
		link: (scope, element, attrs) ->
			icon = element.find('i')

			scope.$watch(attrs.isLoading, (newValue) ->
				icon.removeClass('loading')
				icon.addClass('loading') if newValue
			)
	)