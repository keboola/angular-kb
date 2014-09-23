###
  Link to SAPI Console
  params:
  	component: component hashmap from https://connection.keboola.com/v2/storage
###

angular.module( 'kb.ui.sapiComponentIcon', [])
.directive('kbSapiComponentIcon', [ ->
	template: """
		<span ng-if="hasIcon()">
			<img ng-src="{{ url() }}" width="{{ width }}" height="{{ height }}"/>
		</span>
		<span ng-if="!hasIcon()" class='kb-default'>
			<i class="fa {{ defaultIconClass[component.type] }}" style="font-size: {{ size - 5 }}px; height: {{ size }}px; position: relative; top: 5px"></i>
		</span>
	"""
	restrict: 'E'
	scope:
		component: '='
		size: '@'
	link: (scope, element) ->

		element.addClass 'kb-sapi-component-icon'

		scope.defaultIconClass =
			extractor: 'fa-cloud-download'
			writer: 'fa-cloud-upload'
			transformation: 'fa-cogs'
			other: 'fa-cogs'

		scope.hasIcon = () ->
			!!scope.component["ico#{scope.size}"]

		scope.url = ->
			scope.component["ico#{scope.size}"]

])