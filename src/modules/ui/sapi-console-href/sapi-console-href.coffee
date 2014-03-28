###
  Link to SAPI Console
  Token is transfered threw POST body instead of URL parameters
  Implemented by form submit into blank window
###

angular.module( 'kb.ui.sapiConsoleHref', ['kb.sapi.sapiService'])
	.directive('kbSapiConsoleHref', [ "kbSapiService", "$sce", (sapiService, $sce) ->
		restrict: 'E'
		transclude: true
		scope:
			path: '@'
			token: '@'

		template: """
			<form action="{{ url() }}" method="post" class="kb-sapi-console-href" target="_blank">
				<a ng-click="submit()" ng-transclude></a>
				<input type="hidden" name="token" value="{{ getToken() }}" />
			</form>
		"""
		link: (scope, element) ->

			path = ->
				scope.path || "/"

			scope.getToken = ->
				if scope.token
					return scope.token
				else
					sapiService.apiToken

			scope.url = ->
				$sce.trustAsResourceUrl("#{sapiService.consoleUrl}#{path()}?endpoint=#{sapiService.endpoint}")

			scope.submit = ->
				element.find('form').submit()
				return

	])