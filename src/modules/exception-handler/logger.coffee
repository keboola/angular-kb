angular.module("kb.exceptionHandler.logger", [])
	.factory("kb.Logger", ->

		# Logs errors to server
		class Logger

			onError: (errorMsg, file, lineNumber) ->
				@log
					message: errorMsg
					file: file
					lineNumber: lineNumber


			log: (data) ->
				jQuery.ajax
					url: "/utils/errors"
					method: "POST"
					contentType: "application/json"
					data: JSON.stringify(data)
					dataType: "json"

			logException: (exception) ->
				@log
					message: exception.message
					stackTrace: exception.stack

	)
	.factory("kbLogger", ["kb.Logger", (Logger) ->
		new Logger()
	])

