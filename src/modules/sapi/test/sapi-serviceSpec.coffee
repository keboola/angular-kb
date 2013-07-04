
describe 'kb.sapi.service', ->

	sapiService = null
	$httpBackend = null
	$timeout = null
	$rootScope = null
	sapiBaseUrl = "https://connection.keboola.com"

	beforeEach(module('kb.sapi.sapiService'))
	beforeEach(inject(($injector) ->
		sapiService = $injector.get('kbSapiService')
		sapiService.endpoint = sapiBaseUrl
		$httpBackend  = $injector.get('$httpBackend');
		$timeout = $injector.get('$timeout')
		$rootScope = $injector.get('$rootScope')
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

	describe 'job poll', ->

		it 'should stop polling on success', ->

			jobUrl = "#{sapiBaseUrl}/v2/storage/jobs/12"

			# 1. check
			$httpBackend
					.expectGET(jobUrl)
					.respond(200,
						'id': '12'
						'status': 'waiting'
					)

			doneCallback = jasmine.createSpy('done');
			sapiService
				.pollJobUntilDone(12)
				.then(doneCallback)

			$timeout.flush()
			$httpBackend.flush()
			expect(doneCallback).not.toHaveBeenCalled()

			# 2. check
			$httpBackend
					.expectGET(jobUrl)
					.respond(200,
						'id': '12'
						'status': 'processing'
					)

			$timeout.flush()
			$httpBackend.flush()
			expect(doneCallback).not.toHaveBeenCalled()

			# 3. check
			$httpBackend
					.expectGET(jobUrl)
					.respond(200,
						'id': '12'
						'status': 'success'
					)

			$timeout.flush()
			$httpBackend.flush()
			expect(doneCallback).toHaveBeenCalled()

			job = doneCallback.mostRecentCall.args[0]
			expect(job.id).toBe '12'
			expect(job.status).toBe 'success'

		it 'should return error on job fetch error', ->

			jobUrl = "#{sapiBaseUrl}/v2/storage/jobs/12"

			# 1. check
			$httpBackend
					.expectGET(jobUrl)
					.respond(200,
						'id': '12'
						'status': 'waiting'
					)

			doneCallback = jasmine.createSpy('done')
			errorCallback = jasmine.createSpy('error')

			sapiService
				.pollJobUntilDone(12)
				.then(doneCallback, errorCallback)

			$timeout.flush()
			$httpBackend.flush()
			expect(doneCallback).not.toHaveBeenCalled()
			expect(errorCallback).not.toHaveBeenCalled()

			# 2. check
			errorResponse =
				'error': 'Core dumped'
				'message': 'error'

			$httpBackend
					.expectGET(jobUrl)
					.respond(500, errorResponse)


			$timeout.flush()
			$httpBackend.flush()
			expect(doneCallback).not.toHaveBeenCalled()
			expect(errorCallback).toHaveBeenCalled()

			errorHandlerArgs = job = errorCallback.mostRecentCall.args
			expect(errorHandlerArgs[0]).toBe errorResponse


		it 'should timeout after 20 attempts', ->

			jobUrl = "#{sapiBaseUrl}/v2/storage/jobs/12"

			doneCallback = jasmine.createSpy('done')
			errorCallback = jasmine.createSpy('error')

			sapiService
				.pollJobUntilDone(12)
				.then(doneCallback, errorCallback)

			performCheck = ->
				$httpBackend
						.expectGET(jobUrl)
						.respond(200,
							'id': '12'
							'status': 'processing'
						)

				$timeout.flush()
				$httpBackend.flush()
				expect(doneCallback).not.toHaveBeenCalled()
				expect(errorCallback).not.toHaveBeenCalled()

			limit = 20
			performCheck() while limit -= 1

			# timeout
			$timeout.flush()
			$rootScope.$apply()
			expect(doneCallback).not.toHaveBeenCalled()
			expect(errorCallback).toHaveBeenCalled()

