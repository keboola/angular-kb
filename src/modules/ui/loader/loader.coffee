
angular.module('kb.ui.loader', [])
	.directive('kbLoader', ->
		restrict: 'E'
		template: """
			<a kb-loader class="kb-loader">
				<i class="fa fa-refresh"> </i>
			</a>
		"""
		replace: true
		link: (scope, element, attrs) ->
			icon = element.find('i')

			scope.$watch(attrs.isLoading, (newValue) ->
				icon.removeClass('fa-spin')
				icon.addClass('fa-spin') if newValue
			)
	)