
###
  Inverts value of kbClickToggle attribute on click
###

angular.module('kb.ui.clickToggle', [])
  .directive('kbClickToggle', ['$parse', ($parse) ->
    (scope, element, attrs) ->
      getter = $parse(attrs.kbClickToggle)
      setter = getter.assign

      toggle = (event) ->
        scope.$apply ->
          setter(scope, !getter(scope))

      element.bind('click', toggle )

      element.bind('$destroy', ->
        element.unbind('click', toggle)
      )

  ])