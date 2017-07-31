angular.module('kb.ui.tableDescription', ['kb.sapi.sapiService', 'kb.ui.inlineEdit'])
  .directive('kbTableDescription', [ 'kbSapiService', (storageService) ->
    template: """
        <kb-inline-edit-markdown value="table.description" edit-title="Click to edit the description" placeholder="Describe the table..." on-save="saveDescription(newValue)"></kb-inline-edit-markdown>
    """
    restrict: 'E'
    scope:
      table: '='
    link: (scope) ->
      scope.saveDescription = () ->
        data =
          description: scope.table.description
        storageService.updateTableMetadata(scope.table.id, data)
])