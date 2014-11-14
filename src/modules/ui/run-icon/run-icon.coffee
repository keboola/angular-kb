

angular.module('kb.ui.runIcon', ['kb.ui.loader'])
  .directive('kbRunIcon', ->
      restrict: 'E'
      template: """
        <span class="kb-loader">
          <i class="fa fa-fw fa-play"> </i>
        </span>
      """
      replace: true
      link: (scope, element, attrs) ->
        icon = element.find('i')
        scope.$watch(attrs.isRunning, (newValue) ->
          element.removeClass('running')
          icon.removeClass('fa-refresh')
          icon.removeClass('fa-play')
          icon.removeClass('fa-spin')
          if newValue
            element.addClass('running')
            icon.addClass('fa-refresh fa-spin')
          else
            icon.addClass('fa-play')
        )
    )