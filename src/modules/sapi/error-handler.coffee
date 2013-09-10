angular.module("kb.sapi.errorHandler", ["ui.bootstrap.dialog"]).factory "kbSapiErrorHandler", ["$dialog", ($dialog) ->
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
      btns = [
        label: "Close"
        cssClass: "btn-danger"
      ]
      dialog = $dialog.messageBox("Application Error", errorMessage, btns)
      dialog.open()

  handler
]