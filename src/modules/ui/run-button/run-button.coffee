

angular.module('kb.ui.runButton', ['kb.ui.loader'])
  .directive('kbRunButton', ->
      restrict: 'E'
      template: """
        <button class="btn btn-default run-transformation kb-loader">
          <i class="fa fa-fw fa-play"> </i>
        </button>
      """
      replace: true
      link: (scope, element, attrs) ->
        icon = element.find('i')
        scope.$watch(attrs.isDisabled, (newValue) ->
          if (newValue)
            element.addClass('disabled')
          else
            element.removeClass('disabled')
        )
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