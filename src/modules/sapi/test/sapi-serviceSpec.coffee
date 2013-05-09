
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

