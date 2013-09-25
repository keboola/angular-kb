angular.module("kb.exceptionHandler", ["kb.exceptionHandler.logger"]).factory "$exceptionHandler", ["$window", "$log", "kbLogger", ($window, $log, logger) ->

	$window.onerror = jQuery.proxy logger.onError, logger

	(exception, cause) ->
		logger.logException exception, cause
		$log.error.apply $log, arguments

]