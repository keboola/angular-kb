angular.module("kb.sapi.errorHandler", ["ui.bootstrap.modal", "ui.bootstrap.tpls"]).factory "kbSapiErrorHandler",
  ["$modal", ($modal) ->
    handler = undefined
    handler =
      remainingTimeText: (estimatedEndTime) ->
        minutes = undefined
        minutes = Math.round((estimatedEndTime - new Date()) / (1000 * 60))
        if minutes > 0
          "after " + minutes + " minutes."
        else
          " in few minutes."

      handleError: (errorResponse) ->
        userError = false
        if errorResponse.code && errorResponse.code >= 400 && errorResponse.code < 500
          userError = true
          
        errorMessage = undefined
        errorMessage = errorResponse.message or errorResponse.error or "Unknown error during communication with API"
        if errorResponse.status is "maintenance"
          errorMessage = errorResponse.reason
          errorMessage += ". Please repeat the action " + @remainingTimeText(new Date(errorResponse.estimatedEndTime))

        modalInstance = $modal.open(
          template: """
                    <div class="modal-header">
                    <h4 class="modal-title"><span ng-show="!userError">Application error</span><span ng-show="userError">User error</span></h4>
                    </div>
                    <div class="modal-body">
                    <p>{{ message }}</p>
                    <p ng-show="exceptionId && !userError">
                      Exception ID: <strong>{{ exceptionId }}</strong>
                    </p>
                    </div>
                    <div class="modal-footer">
                    <button class="btn btn-danger" ng-click="close()">Close</button>
                    </div>
                    """
          resolve:
            message: ->
              errorMessage
            userError: ->
              userError
            exceptionId: ->
              errorResponse.exceptionId

          controller: ["$scope", "$modalInstance", "message", "exceptionId", "userError", ($scope, $modalInstance, message, exceptionId, userError) ->
            $scope.message = message
            $scope.exceptionId = exceptionId
            $scope.userError = userError
            $scope.close = ->
              $modalInstance.close()
          ]
        )

    handler
  ]