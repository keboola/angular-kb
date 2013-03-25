###
  Storage API wrapper
###

((angular) ->

	angular.module('kb.sapi.sapiService', [
		'kb.utils.csv',
		'kb.utils.multipartUpload',
		'kb.sapi.errorHandler'
	])
	.factory( "kbSapiService", [ '$http', '$rootScope', 'kbCsv', 'kbMultipartUpload', '$q', ($http, $rootScope, csv, multipartUpload, $q) ->
		new StorageService($http, $rootScope, csv, multipartUpload, $q)
	])

	# SAPI Token
	class Token

		constructor: (@data) ->

		canManageTokens: ->
			@data.canManageTokens

		canCreateBucket: ->
			@data.canManageBuckets

		canWriteBucket: (bucketId) ->
			@data.bucketPermissions[bucketId] is 'write' or @data.bucketPermissions[bucketId] is 'manage'

		canManageBucket: (bucketId) ->
			@data.bucketPermissions[bucketId] is 'manage'

		setBucketPermission: (bucketId, permission) ->
			@data.bucketPermissions[bucketId] = permission

		hasAccessToBuckets: ->
			count = 0
			for own key, value of @data.bucketPermissions
				count++
			count > 0

	class StorageService

		constructor: (@$http, @$rootScope, @csv, @multipartUpload, @$q) ->

			@apiToken = ''
			@token = {}
			@endpoint = @defaultEndpoint = 'https://connection.keboola.com'
			@consoleUrl = 'https://storage-api-console.keboola.com'
			@apiVersion = 'v2'

		isAuthenticated: ->
			@apiToken != ''

		setApiToken: (token) ->
			@apiToken = token
			@

		verifyAndSetToken: (token, callback) ->
			service = @
			@$http(
				url: @url '/storage/tokens/verify'
				method: 'GET'
				headers:
					'x-storageapi-token': token
			 )
			.success(@setVerifiedToken)

		setVerifiedToken: (tokenData) =>
			@setApiToken(tokenData.token)
			@token = new Token(tokenData)

		http: (params) ->

			params.headers = {} if !params.headers
			angular.extend params.headers,
				'x-storageapi-token': @apiToken

			@$http(params).error(@errorHandler)


		url: (path) ->
			@endpoint + '/' + @apiVersion + path

		resetSession: ->
			@apiToken = ''

		consoleSignedUrl: (path = '/') ->
			"#{@consoleUrl}#{path}?token=#{@apiToken}&endpoint=#{@endpoint}"

		createBucket: (stage, name, description) ->
			@http(
				url: @url("/storage/buckets")
				method: 'POST'
				headers:
					'Content-Type': 'application/x-www-form-urlencoded'
				data: $.param(
					name: name
					stage: stage
					description: description
				)
			)


		createTable: (bucketId, name, columns) ->
			@http(
				url: @url( "/storage/buckets/#{bucketId}/tables" )
				method: 'POST'
				headers:
					'Content-Type': 'application/x-www-form-urlencoded'
				data: $.param(
					name: name
					dataString: columns.join(",")
				)
			)

		getTable: (id) ->
			@http(
				url:  @url( '/storage/tables/' + id )
				method: 'GET'
			 )

		getTables: ->
			@http(
				url:  @url( '/storage/tables/' )
				method: 'GET'
			 )

		deleteTable: (id) ->
			service = @
			@http(
				url:  @url  '/storage/tables/' + id
				method: 'DELETE'
			)

		unlinkTable: (id) ->
			@http(
				url:  @url '/storage/tables/' + id
				method: 'DELETE'
				params:
					unlink: 1
			 )


		# attributes
		deleteTableAttribute: (tableId, attributeName) ->
			@http(
				url: @url '/storage/tables/' + tableId + '/attributes/' + attributeName
				method: 'DELETE'
			)

		saveTableAttribute: (tableId, name, value) ->

			@http(
				url: @url '/storage/tables/' + tableId + '/attributes/' + name
				method: 'POST'
				headers:
					'Content-Type': 'application/x-www-form-urlencoded'
				data: $.param(
					value: value
				)
			)
			.success( (data) ->
	#			table.attributes = data
			)

		deleteBucketAttribute: (bucketId, attributeName) ->
			@http(
				url: @url '/storage/buckets/' + bucketId + '/attributes/' + attributeName
				method: 'DELETE'
			)

		saveBucketAttribute: (bucketId, name, value) ->
			@http(
				url: @url '/storage/buckets/' + bucketId + '/attributes/' + name
				method: 'POST'
				headers:
					'Content-Type': 'application/x-www-form-urlencoded'
				data: $.param(
					value: value
				)
			)

		deleteBucket: (id) ->
			@http(
				url:  @url '/storage/buckets/' + id
				method: 'DELETE'
			 )

		errorHandler: (data, status, headers, config) =>

			@$rootScope.$broadcast('storageError', data)

		# get buckets and table together
		getBucketsWithTables: ->
			storageService = @
			buckets = []
			tmpBuckets = []
			tmpTables = []

			# load buckets
			bucketsLoading = @http(
				url: @url '/storage/buckets/'
				method: 'GET'
			 )
			.success (data, status) ->
				tmpBuckets = data
			.error( ->
				storageService.bucketsLoading = false
			)

			# load tables in parallel
			tablesLoading = @http(
				url: @url '/storage/tables/'
				method: 'GET'
			)
			.success (data) ->
				tmpTables = data

			deferred = @$q.defer()
			@$q.all([bucketsLoading, tablesLoading]).then( ->
				# assign table to buckets
				tablesMap = {}
				angular.forEach(tmpTables, (table) ->
					tablesMap[table.bucket.id] = [] if !tablesMap[table.bucket.id]
					tablesMap[table.bucket.id].push table
				)
				angular.forEach(tmpBuckets, (bucket) ->
					bucket.tables = []
					bucket.tables = tablesMap[bucket.id] if tablesMap[bucket.id]
				)

				# set buckets
				angular.forEach(_.sortBy( tmpBuckets, (bucket) -> bucket.id), (bucket) ->
					buckets.push bucket
				)
				deferred.resolve(buckets)
			)

			promise = deferred.promise
			promise.success = (fn) ->
				promise.then((response) ->
						fn(response.data, response.status, response.headers)
				)
				promise
			return promise


		getBuckets: () ->
			@http(
				url: @url '/storage/buckets/'
				method: 'GET'
			)

		getBucket: (id) ->
			@http(
				url: @url '/storage/buckets/' + id
				method: 'GET'
			)

		exportUrl: (tableId, limit) ->
			@url '/storage/tables/' + tableId + '/export' +
				(if limit then '?limit=' + limit else '')

		exportDownloadUrl: (tableId, limit) ->
			@url '/storage/tables/' + tableId + '/export?token=' + @apiToken +
				(if limit then '&limit=' + limit else '')

		saveTableData: (tableId, rawData) ->
			@http(
				url: @url( '/storage/tables/' + tableId  + '/import')
				method: 'POST'
				headers:
					'Content-Type': 'application/x-www-form-urlencoded'
				data: $.param(
					name: name
					dataString: rawData
				)
			)

		# Read and parse table data
		# returns promise
		tableData: (tableId, limit, callback) ->
			csv = @csv
			deferred = @$q.defer()
			@http(
				url: @exportUrl( tableId, limit )
				method: 'GET'
			 )
			.success( (data) ->
				parsed = csv.parse(data)
				parsed =
					header: parsed.shift()
					data: parsed
				callback( parsed ) if callback
				deferred.resolve( parsed )
			)

			promise = deferred.promise
			promise.success = (fn) ->
				promise.then((parsedData) ->
						fn(parsedData)
				)
				promise
			return promise


		# tokens
		getTokens: ->
			@http(
				url: @url '/storage/tokens/'
				method: 'GET'
			 )

		getToken: (id) ->
			@http(
				url: @url "/storage/tokens/#{id}"
				method: 'GET'
			 )

		createToken: (token) ->
			@tokens.push(token)
			params =
				description: token.description
				expiresIn: token.expiresIn
				canManageBuckets: token.canManageBuckets
				canReadAllFileUploads: token.canReadAllFileUploads

			angular.forEach(token.bucketPermissions, (permission, bucketId) ->
				params['bucketPermissions[' + bucketId + ']'] = permission
			)

			@http(
				url: @url '/storage/tokens/'
				method: 'POST'
				params: params
			 )
			.success (data, status) ->
				angular.copy(data, token)

		saveToken: (token) ->
			params =
				description: token.description

			angular.forEach(token.bucketPermissions, (permission, bucketId) ->
				params['bucketPermissions[' + bucketId + ']'] = permission
			)

			@http(
				url: @url '/storage/tokens/' + token.id
				method: 'PUT'
				params: params
			 )
			.success (data, status) ->
				angular.copy(data, token)

		refreshToken: (token) ->
			service = @
			@http(
				url: @url '/storage/tokens/' + token.id + '/refresh'
				method: 'POST'
			)
			.success (data, status) ->
				# current token is refreshed
				if token.token == service.apiToken
					service.verifyAndSetToken data.token

				angular.copy(data, token)

		deleteToken: (token) ->
			service = @
			angular.forEach(@tokens, (listToken, index) ->
				service.tokens.splice( index, 1) if listToken.id == token.id
			)

			@http(
				url:  @url '/storage/tokens/' + token.id
				method: 'DELETE'
			)

		# files
		getFiles: (limit = 100, offset = 0) ->
			@http(
				url: @url '/storage/files'
				method: 'GET'
				params:
					limit: limit
					offset: offset
			)

		# ticketing service
		generateId: ->
			@http(
				url: @url '/storage/tickets'
				method: 'POST'
			).error(@errorHandler)


)(window.angular)