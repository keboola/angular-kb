###
 SAPI error handler
 Renders error modal
 Must be wired with sapi error event on application run start
###
angular
	.module('kb.sapi.errorHandler', ['modal'])
	.factory('kbSapiErrorHandler', ["$bsModal", ($bsModal) ->
		handler =
			remainingTimeText: (estimatedEndTime) ->
				minutes = Math.round((estimatedEndTime - new Date()) / (1000 * 60))
				if minutes > 0
					return "after #{minutes} minutes."
				else
					return ' in few minutes.'

			handleError: (errorResponse) ->
				errorMessage =  errorResponse.message || errorResponse.error || "Unknown error during comunication with API"

				if errorResponse.status == 'maintenance'
					errorMessage = errorResponse.reason
					errorMessage += '. Please repeat the action ' + @remainingTimeText(new Date(errorResponse.estimatedEndTime))

				$bsModal.ThisOrThat('Application Error', errorMessage, 'Close', null, null, null, 'danger')
					.addClass('alert alert-error')

		handler
	])