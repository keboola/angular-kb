angular.module('kb.ui.bucketDescription', ['kb.sapi.sapiService', 'kb.ui.inlineEdit'])
  .directive('kbBucketDescription', [ 'kbSapiService', (storageService) ->
    template: """
          <kb-inline-edit-markdown value="bucket.description" edit-title="Click to edit the description" placeholder="Describe the bucket..." on-save="saveDescription(newValue)"></kb-inline-edit-markdown>
    """
    restrict: 'E'
    scope:
      bucket: '='
    link: (scope) ->
      scope.saveDescription = () ->
        data =
          description: scope.bucket.description
        storageService.updateBucketMetadata(scope.bucket.id, data)
])