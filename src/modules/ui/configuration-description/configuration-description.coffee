angular.module('kb.ui.configurationDescription', ['kb.sapi.sapiService', 'kb.ui.inlineEdit'])
  .directive('kbConfigurationDescription', [ 'kbSapiService', (storageService) ->
    template: """
      <kb-inline-edit-textarea value="configuration.description" edit-title="Click to edit configuration description" placeholder="Describe the confguration..." on-save="saveDescription(newValue)"></kb-inline-edit-textarea>
    """
    restrict: 'E'
    scope:
      componentId: "="
      configuration: "="
    link: (scope) ->
      console.log scope.configuration
      console.log scope.componentId
      scope.saveDescription = () ->
        data =
          name: scope.configuration.name
          description: scope.configuration.description
        storageService.updateComponentConfiguration(scope.componentId, scope.configuration.id, data)

  ])