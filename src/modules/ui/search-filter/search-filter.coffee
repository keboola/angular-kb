
angular.module('kb.ui.searchFilter', [])
.directive 'kbSearchFilter', [->
		templateUrl: "kb/ui/search-filter/templates/search-filter.html"
		restrict: 'E'
		scope:
			query: '='
		link: (scope) ->
			scope.remove = ->
				scope.query = ''

			scope.hasQuery = ->
				!!scope.query
	]
