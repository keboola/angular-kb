
describe 'kb.sapi.service', ->

	sapiService = null
	$httpBackend = null
	sapiBaseUrl = "https://connection.keboola.com"

	beforeEach(module('kb.sapi.sapiService'))
	beforeEach(inject(($injector) ->
		sapiService = $injector.get('kbSapiService')
		sapiService.endpoint = sapiBaseUrl
		$httpBackend  = $injector.get('$httpBackend');
	))


	it 'should compose sapi url with version and endpoing', ->
		expect(sapiService.url('/storage/tables')).toBe "#{sapiBaseUrl}/#{sapiService.apiVersion}/storage/tables"

	describe 'table write', ->

		it 'should accept options', ->
			$httpBackend
				.expectPOST("#{sapiBaseUrl}/v2/storage/tables/in.c-tests.users/import", $.param
					partial: 0
					incremental: 1
					delimiter: ","
					dataString: '"id","name"'
				)
				.respond(200)
			sapiService.saveTableData 'in.c-tests.users', '"id","name"',
				partial: false
				incremental: true
				delimiter: ","
			$httpBackend.flush()


	describe 'table export', ->

		it 'should accept options', ->
			$httpBackend
				.expectGET("#{sapiBaseUrl}/v2/storage/tables/in.c-tests.users/export?" + $.param
					limit: 10
					whereColumn: 'id'
					whereValues: [234]
				)
				.respond(200, '"id","name"')

			sapiService.tableData('in.c-tests.users',
				limit: 10
				whereColumn: 'id'
				whereValues: [234]
			)
			$httpBackend.flush()

		it 'should keep limit parameter BC', ->
			$httpBackend
				.expectGET("#{sapiBaseUrl}/v2/storage/tables/in.c-tests.users/export?limit=10")
				.respond(200, '"id","name"')

			sapiService.tableData('in.c-tests.users', 10)
			$httpBackend.flush()

		it 'should not require options', ->
			$httpBackend
				.expectGET("#{sapiBaseUrl}/v2/storage/tables/in.c-tests.users/export?")
				.respond(200, '"id","name"')
			sapiService.tableData('in.c-tests.users')
			$httpBackend.flush()

		it 'should propagate error', ->
			$httpBackend
				.expectGET("#{sapiBaseUrl}/v2/storage/tables/in.c-tests.users/export?")
				.respond(500,
					'error': 'Unknown error'
				)

			errorHandler = jasmine.createSpy 'errorHandler'

			sapiService
				.tableData('in.c-tests.users')
				.error((error) ->
					errorHandler(error)
				)

			$httpBackend.flush()
			expect(errorHandler).toHaveBeenCalled()

