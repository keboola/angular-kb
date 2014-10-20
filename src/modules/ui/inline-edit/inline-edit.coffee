((angular) ->
  module = angular.module('kb.ui.inlineEdit', [])

  inlineEditFactory = (templateUrl) ->
    return ->
      restrict: 'E'
      scope:
        value: '='
        disabled: '='
        onSave: '&'
        placeholder: '@'
        editTitle: '@'
      templateUrl: templateUrl
      controller: ["$scope", "$element", "$attrs", "$timeout", (scope, element, attrs, $timeout) ->
        element.addClass 'kb-inline-edit'
        element.addClass element[0].tagName.toLowerCase()

        scope.tooltipTitle = ''

        resolveTooltip = ->
          if scope.isEditing || scope.disabled
            scope.tooltipTitle = ''
          else
            scope.tooltipTitle = scope.editTitle

        scope.$watch('disabled', (disabled) ->
          if disabled
            element.addClass('disabled')
          else
            element.removeClass('disabled')

          if scope.isEditing && !disabled then scope.edit() else scope.cancel()
          resolveTooltip()
        )

        scope.$watch('isEditing', resolveTooltip)
        scope.$watch('editTitle', resolveTooltip)

        scope.edit = ->
          return if scope.disabled
          scope.isEditing = true
          scope.editValue = scope.value

          #  click outsid element = cancel editing state
          angular.element('body').bind('click.inlineEdit', ->
            scope.$apply ->
              scope.cancel()
            return true
          )

          element.bind('click.inlineEdit', (e) ->
            e.stopPropagation()
          )

          element.bind('keyup.inlineEdit', (e) ->
            # save on enter
            scope.$apply(scope.save) if e.keyCode == 13 && element.get(0).tagName.toLocaleLowerCase() != 'kb-inline-edit-textarea'

            # close on escape
            scope.$apply(scope.cancel) if e.keyCode == 27
            false
          )

          $timeout(->
            element.find(':input').not('button').focus()
          )

        scope.cancel = ->
          scope.isEditing = false

          angular.element('body').unbind('.inlineEdit')
          element.unbind('.inlineEdit')
          return

        scope.save = ->
          scope.value = scope.editValue
          if angular.isFunction(scope.onSave)
            # timeout ensures that when onSave is called, new scope value is already propagated
            $timeout(->
              scope.onSave(
                newValue: scope.editValue
              )
            )
          scope.cancel()
      ]


  module.factory('kbInlineEdit', ->
    return inlineEditFactory
  )
  .directive('kbInlineEdit', inlineEditFactory("kb/ui/inline-edit/templates/text.html"))
  .directive('kbInlineEditDatetime', inlineEditFactory("kb/ui/inline-edit/templates/datetime.html"))
  .directive('kbInlineEditTextarea', inlineEditFactory("kb/ui/inline-edit/templates/textarea.html"))
  .directive('kbInlineEditSelect', ->
      config = inlineEditFactory("kb/ui/inline-edit/templates/select.html")()
      config.scope.options = '='
      config
    ))(window.angular)