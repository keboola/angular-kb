###
  Link to SAPI Console
  Token is transfered threw POST body instead of URL parameters
  Implemented by form submit into blank window
###

angular.module( 'kb.ui.sapiConsoleHref', ['kb.sapi.sapiService'])
	.directive('kbSapiConsoleHref', [ "kbSapiService", (sapiService) ->
		restrict: 'E'
		transclude: true
		scope:
			path: '@'

		template: """
			<form action="{{ url() }}" method="post" class="kb-sapi-console-href" target="_blank">
				<a ng-click="submit()" ng-transclude></a>
				<input type="hidden" name="token" value="{{ sapiService.apiToken }}" />
			</form>
		"""
		link: (scope, element) ->

			path = ->
				scope.path || "/"

			scope.sapiService = sapiService

			scope.url = ->
				"#{sapiService.consoleUrl}#{path()}?endpoint=#{sapiService.endpoint}"

			scope.submit = ->
				element.find('form').submit()

	])