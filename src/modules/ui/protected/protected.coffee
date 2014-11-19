

angular.module('kb.ui.protected', [])
  .directive('kbProtected', ->
    restrict: 'E'
    scope:
      "protected": '='
    transclude: true
    replace: true
    template: """
      <div class="kb-protected">
        <span class="locked" ng-show="locked" ng-click="unlock()">
          <i class="fa fa-fw  fa-lock"></i>
        </span>
        <span ng-transclude ng-show="!locked"></span>
      </div>
    """
    link: (scope) ->
      scope.locked = scope.protected

      scope.$watch('protected', (newValue) ->
        scope.locked = newValue
      )

      scope.unlock = () ->
        scope.protected = false

  )