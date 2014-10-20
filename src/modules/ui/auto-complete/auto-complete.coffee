

angular
  .module( 'kb.ui.autoComplete', [])
  .directive('kbAutoComplete', ->
      restrict: 'A'
      require: 'ngModel'
      link: (scope, element, attrs, ngModel) ->
        options = scope.$eval(attrs.kbAutoComplete) || {}

        changeHandler = (event, ui) ->
          if ui.item?.value
            scope.$apply( ->
              ngModel.$setViewValue(ui.item.value)
            )

        if options.change
          options.change = (event, ui) ->
            options.change(event, ui)
            changeHandler(event, ui)
        else
          options.change = changeHandler

        element.autocomplete(options)
  )