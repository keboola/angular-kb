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
				errorMessage = undefined
				errorMessage = errorResponse.message or errorResponse.error or "Unknown error during comunication with API"
				if errorResponse.status is "maintenance"
					errorMessage = errorResponse.reason
					errorMessage += ". Please repeat the action " + @remainingTimeText(new Date(errorResponse.estimatedEndTime))

				modalInstance = $modal.open(
					template: """
										<div class="modal-header">
										<h4 class="modal-title">Application error</h4>
										</div>
										<div class="modal-body">
										<p>{{ message }}</p>
										<p ng-show="exceptionId">
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
						exceptionId: ->
							errorResponse.exceptionId

					controller: ["$scope", "$modalInstance", "message", "exceptionId", ($scope, $modalInstance, message, exceptionId) ->
						$scope.message = message
						$scope.exceptionId = exceptionId
						$scope.close = ->
							$modalInstance.close()
					]
				)

		handler
	]