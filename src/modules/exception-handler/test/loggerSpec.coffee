

describe 'kbLogger', ->

	Logger = null
	$httpBackend = null
	expectedHref = 'http://localhost/neco#/some-page'

	beforeEach(module('kb.exceptionHandler.logger'))
	beforeEach(module(($provide) ->
		$provide.value('$window',
			location:
				href: expectedHref
		)
		return
	))

	beforeEach(inject(($injector) ->
		Logger = $injector.get('kb.Logger')
		$httpBackend  = $injector.get('$httpBackend')
	))

	it 'should receive onError and propagete to log method', ->
		logger = new Logger()
		spyOn logger, 'logRaw'

		logger.onError 'message', 'test.js', 12

		expect(logger.logRaw).toHaveBeenCalledWith(
			message: 'message'
			file: 'test.js'
			lineNumber: 12
			href: expectedHref
		)

	it 'should log exception', ->
		logger = new Logger()

		spyOn logger, 'logRaw'
		exception =
			message: 'test'
			stack: 'trace'

		logger.logException exception

		expect(logger.logRaw).toHaveBeenCalledWith(
			message: exception.message
			stackTrace: exception.stack
			href: expectedHref
		)


