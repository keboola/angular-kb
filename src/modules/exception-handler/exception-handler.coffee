angular.module("kb.exceptionHandler", []).factory "$exceptionHandler", ["$window", "$log", ($window, $log) ->

	# Logs errors to server
	Logger = ->
		@register()

	Logger::register = ->
		$window.onerror = jQuery.proxy(@onError, this)

	Logger::onError = (errorMsg, file, lineNumber) ->
		@log
			message: errorMsg
			file: file
			lineNumber: lineNumber


	Logger::log = (data) ->
		jQuery.ajax
			url: "/utils/errors"
			method: "POST"
			contentType: "application/json"
			data: JSON.stringify(data)
			dataType: "json"


	Logger::logException = (exception) ->
		@log
			message: exception.message
			stackTrace: exception.stack

	logger = new Logger()
	(exception, cause) ->
		logger.logException exception, cause
		$log.error.apply $log, arguments
]