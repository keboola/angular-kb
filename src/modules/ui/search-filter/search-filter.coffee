
angular.module('kb.ui.searchFilter', [])
.directive 'kbSearchFilter', [->
		templateUrl: "kb/ui/search-filter/templates/search-filter.html"
		restrict: 'E'
		scope:
			query: '='
		transclude: true
		link: (scope) ->
			scope.remove = () ->
				scope.query = ''
	]
