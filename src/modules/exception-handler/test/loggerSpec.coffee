

describe 'kbLogger', ->

	Logger = null
	$httpBackend = null

	beforeEach(module('kb.exceptionHandler.logger'))
	beforeEach(inject(($injector) ->
		Logger = $injector.get('kb.Logger')
		$httpBackend  = $injector.get('$httpBackend')
	))

	it 'should receive onError and propagete to log method', ->
		logger = new Logger()

		spyOn logger, 'log'

		logger.onError 'message', 'test.js', 12

		expect(logger.log).toHaveBeenCalledWith(
			message: 'message'
			file: 'test.js'
			lineNumber: 12
		)

	it 'should log exception', ->
		logger = new Logger()

		spyOn logger, 'log'
		exception =
			message: 'test'
			stack: 'trace'

		logger.logException exception

		expect(logger.log).toHaveBeenCalledWith(
			message: exception.message
			stackTrace: exception.stack
		)


