angular.module('kb.ui.extractorInfo', [])
  .directive('kbExtractorInfo', ->
      restrict: 'E'
      scope:
        "configuration": '='
        "authorizedFor": '='
      template: """
        <div class="extractor-info text-muted small">
          <p ng-show="authorizedFor">
            Authorized for <br />{{ authorizedFor }}
          </p>
          <p>
            Created by <br />{{ configuration.creatorToken.description }}
          </p>
          <p>
            Created on <br /><kb-datetime datetime="configuration.created"></kb-datetime>
          </p>
      """
      replace: true
    )