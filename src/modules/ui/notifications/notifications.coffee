angular.module('kb.ui.notifications', [])
  .directive('kbNotifications', [ 'kbNotifications', 'kbEvents', (kbNotifications, kbEvents) ->
    template: """
      <div class="alert alert-{{notification.level}} alert-dismissable"  ng-repeat="notification in notifications">
          <button type="button" class="close" ng-click="close($index)">
              <span>×</span>
              <span class="sr-only">Close</span>
          </button>
          <div><span ng-bind-html="notification.message"></span></div>
      </div>
    """
    restrict: 'E'
    link: (scope) ->

      # reload list
      refresh = () ->
        scope.notifications = kbNotifications.list()

      # close button
      scope.close = (index) ->
        kbNotifications.remove(index)

      refresh()

      # listen to events
      kbEvents.subscribe("kbNotifications.change", refresh)
  ])