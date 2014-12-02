

angular.module('kb.ui.protected', [])
  .directive('kbProtected', ->
    restrict: 'E'
    scope:
      "protected": '='
    transclude: true
    replace: true
    template: """
      <div class="kb-protected">
        <span class="locked" ng-show="protected" ng-click="unlock()">
          <i class="fa fa-fw fa-lock"></i>
        </span>
        <span ng-transclude ng-show="!protected"></span>
      </div>
    """
    link: (scope) ->
      scope.unlock = () ->
        scope.protected = false

  )