###
  Link to SAPI Console
  Token is transfered threw POST body instead of URL parameters
  Implemented by form submit into blank window
###

angular.module( 'kb.ui.sapiConsoleHref', ['kb.sapi.sapiService', 'kb.config'])
.directive('kbSapiConsoleHref', [ "kbSapiService", "$sce", "kb.config", (sapiService, $sce, config) ->
    restrict: 'E'
    transclude: true
    scope:
      path: '@'

    template: """
      <a href="{{ url() }}" ng-transclude></a>
    """
    link: (scope) ->
            
      path = ->
        scope.path || "/"
        
      if !config.projectBaseUrl
        throw "'kb.config' property projectBaseUrl is not defined"

      scope.url = ->
        if !config.projectBaseUrl
          return "/"
        return $sce.trustAsResourceUrl(config.projectBaseUrl + "/storage#" + path())


  ])