###
  Storage API wrapper
###

((angular) ->
  angular.module('kb.sapi.sapiService', [
    'kb.utils.csv',
    'kb.utils.multipartUpload'
  ])
  .factory("kbSapiService", [
      'kbSapiServiceFactory'
      (kbSapiServiceFactory) ->
        kbSapiServiceFactory()
    ])

  .factory("kbSapiServiceFactory", [
      '$http'
      '$rootScope'
      'kbCsv'
      'kbMultipartUpload'
      '$q'
      '$timeout'
      ($http, $rootScope, csv, multipartUpload, $q, $timeout) ->
        return ->
          new StorageService($http, $rootScope, csv, multipartUpload, $q, $timeout)
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

    canAccessComponent: (componentId) ->
      @data.componentAccess[componentId]

    hasAccessToBuckets: ->
      count = 0
      for own key, value of @data.bucketPermissions
        count++
      count > 0

    isAdminToken: ->
      !!@data.admin

    isOrganizationMember: ->
      @isAdminToken() is true and @data.admin.isOrganizationMember is true

  class StorageService

    constructor: (@$http, @$rootScope, @csv, @multipartUpload, @$q, @$timeout) ->
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
      @$http(
        url: @url '/storage/tokens/verify'
        method: 'GET'
        headers:
          'x-storageapi-token': token
      ).success(@setVerifiedToken)

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

    index: ->
      @http(
        url: @url("/storage")
        method: 'GET'
      )

    createBucket: (stage, name, backend = 'mysql') ->
      @http(
        url: @url("/storage/buckets")
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          name: name
          stage: stage
          backend: backend
        )
      )

    linkBucket: (stage, name, sourceProjectId, sourceBucketId) ->
      @http(
        url: @url("/storage/buckets")
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          name: name
          stage: stage
          sourceProjectId: sourceProjectId
          sourceBucketId: sourceBucketId
        )
      )

    createTable: (bucketId, name, columns) ->
      @http(
        url: @url("/storage/buckets/#{bucketId}/tables")
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          name: name
          dataString: columns.join(",")
        )
      )

    createTableAsync: (bucketId, params) ->
      params.transactional = Number(params.transactional) if !angular.isUndefined params.transactional
      @http(
        url: @url("/storage/buckets/#{bucketId}/tables-async")
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(params)
      )

    createTableFromSnapshot: (bucketId, snapshotId, name = null) ->
      @createTableAsync(bucketId, {
        snapshotId: snapshotId
        name: name
      })

    rollbackTableFromSnapshot: (tableId, snapshotId) ->
      @http(
        url: @url("/storage/tables/#{tableId}/rollback")
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          snapshotId: snapshotId
        )
      )

    getTable: (id) ->
      @http(
        url: @url('/storage/tables/' + id)
        method: 'GET'
        params:
          include: "metadata,columnMetadata"
      )

    createTableSnapshot: (tableId, description = null) ->
      @http(
        url: @url("/storage/tables/#{tableId}/snapshots")
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          description: description
        )
      )

    getTableSnapshots: (tableId, params) ->
      @http(
        url: @url("/storage/tables/#{tableId}/snapshots")
        method: 'GET'
        params: params
      )

    getSnapshot: (id) ->
      @http(
        url: @url ("/storage/snapshots/#{id}")
        method: 'GET'
      )

    deleteSnapshot: (id) ->
      @http(
        url: @url '/storage/snapshots/' + id
        method: 'DELETE'
      )

    getTables: (params) ->
      @http(
        url: @url('/storage/tables/')
        method: 'GET'
        params: params
      )

    deleteTable: (id, force) ->
      @http(
        url: @url '/storage/tables/' + id
        method: 'DELETE'
        params:
          force: force
      )

    unlinkTable: (id) ->
      @http(
        url: @url '/storage/tables/' + id
        method: 'DELETE'
        params:
          unlink: 1
      )

    # columns
    deleteTableColumn: (tableId, columnName, force) ->
      @http(
        url: @url "/storage/tables/#{tableId}/columns/#{columnName}"
        method: 'DELETE'
        params:
          force: force
      )

    addTableColumn: (tableId, columnName) ->
      @http(
        url: @url '/storage/tables/' + tableId + '/columns/'
        method: 'POST'
        params:
          name: columnName
      )

    addTableColumnToIndexed: (tableId, columnName) ->
      @http(
        url: @url '/storage/tables/' + tableId + '/indexed-columns'
        method: 'POST'
        params:
          name: columnName
      )


    removeTableColumnFromIndexedColumns: (tableId, columnName) ->
      @http(
        url: @url '/storage/tables/' + tableId + '/indexed-columns/' + columnName
        method: 'DELETE'
      )

    createTablePrimaryKey: (tableId, columns) ->
      @http(
        url: @url "/storage/tables/#{tableId}/primary-key"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          columns: columns
        )
      )

    removeTablePrimaryKey: (tableId) ->
      @http(
        url: @url "/storage/tables/#{tableId}/primary-key"
        method: 'DELETE'
      )

    deleteTableRows: (tableId, params) ->
      @http(
        url: @url "/storage/tables/#{tableId}/rows"
        method: 'DELETE'
        params: params
      )

    truncateTable: (tableId) ->
      @deleteTableRows(tableId)

    updateTable: (tableId, data) ->
      @http(
        url: @url '/storage/tables/' + tableId
        method: 'PUT'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(data)
      )

    # aliases
    createAliasTable: (bucketId, options) ->
      @http(
        url: @url "/storage/buckets/#{bucketId}/table-aliases"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(options)
      )

    setAliasTableFilter: (tableId, filterOptions) ->
      @http(
        url: @url "/storage/tables/#{tableId}/alias-filter"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(filterOptions)
      )

    removeAliasTableFilter: (tableId) ->
      @http(
        url: @url "/storage/tables/#{tableId}/alias-filter"
        method: 'DELETE'
      )

    enableAliasTableColumnsAutoSync: (tableId) ->
      @http(
        url: @url "/storage/tables/#{tableId}/alias-columns-auto-sync"
        method: 'POST'
      )

    disableAliasTableColumnsAutoSync: (tableId) ->
      @http(
        url: @url "/storage/tables/#{tableId}/alias-columns-auto-sync"
        method: 'DELETE'
      )

    # attributes
    deleteTableAttribute: (tableId, attributeName) ->
      @http(
        url: @url '/storage/tables/' + tableId + '/attributes/' + attributeName
        method: 'DELETE'
      )

    saveTableAttribute: (tableId, name, value, protectedValue) ->
      data =
        value: value

      data['protected'] = protectedValue if !angular.isUndefined(protectedValue)
      @http(
        url: @url '/storage/tables/' + tableId + '/attributes/' + name
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(data)
      )
      .success((data) ->
          #      table.attributes = data
        )

    deleteBucketAttribute: (bucketId, attributeName) ->
      @http(
        url: @url '/storage/buckets/' + bucketId + '/attributes/' + attributeName
        method: 'DELETE'
      )

    saveBucketAttribute: (bucketId, name, value, protectedValue) ->
      data =
        value: value

      data['protected'] = protectedValue if !angular.isUndefined(protectedValue)
      @http(
        url: @url '/storage/buckets/' + bucketId + '/attributes/' + name
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(data)
      )

    deleteBucket: (id, force) ->
      @http(
        url: @url '/storage/buckets/' + id
        method: 'DELETE'
        params:
          force: force
      )

    errorHandler: (data, status, headers, config) =>
      return if _.isEmpty data # load canceled usually
      @$rootScope.$broadcast('storageError', data)

    # get buckets and table together
    getBucketsWithTables: (tablesParams = null, bucketsParams = null) ->
      storageService = @
      buckets = []
      tmpBuckets = []
      tmpTables = []

      # load buckets
      bucketsLoading = @getBuckets(bucketsParams)
      .success (data, status) ->
          tmpBuckets = data
      .error(->
          storageService.bucketsLoading = false
        )

      # load tables in parallel
      tablesLoading = @getTables(tablesParams)
      .success (data) ->
          tmpTables = data

      deferred = @$q.defer()
      @$q.all([bucketsLoading, tablesLoading]).then(->
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
        angular.forEach(_.sortBy(tmpBuckets, (bucket) ->
          bucket.id), (bucket) ->
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


    getBuckets: (params) ->
      @http(
        url: @url '/storage/buckets/'
        method: 'GET'
        params: params
      )

    getSharedBuckets: (params) ->
      @http(
        url: @url '/storage/shared-buckets/'
        method: 'GET'
        params: params
      )

    shareBucket: (bucketId, params = {}) ->
      @http(
        url: @url '/storage/buckets/' + bucketId + '/share'
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(params)
      )

    changeBucketShareType: (bucketId, params = {}) ->
      @http(
        url: @url '/storage/buckets/' + bucketId + '/share'
        method: 'PUT'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(params)
      )

    unshareBucket: (bucketId) ->
      @http(
        url: @url '/storage/buckets/' + bucketId + '/share'
        method: 'DELETE'
      )

    getBucket: (id) ->
      @http(
        url: @url '/storage/buckets/' + id
        method: 'GET'
      )

    dataPreviewUrl: (tableId, limit) ->
      @url '/storage/tables/' + tableId + '/data-preview' +
      (if limit then '?limit=' + limit else '')

    saveTableData: (tableId, rawData, options) ->
      params = angular.extend {}, options, dataString: rawData
      params.incremental = Number(params.incremental) if !angular.isUndefined params.incremental
      params.partial = Number(params.partial) if !angular.isUndefined params.partial

      @http(
        url: @url('/storage/tables/' + tableId + '/import')
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(params)
      )

    saveTableDataAsync: (tableId, params) ->
      params.incremental = Number(params.incremental) if !angular.isUndefined params.incremental
      params.partial = Number(params.partial) if !angular.isUndefined params.partial

      @http(
        url: @url('/storage/tables/' + tableId + '/import-async')
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(params)
      )

    updateColumnMetadata: (columnId, data) ->
      payload = this.prepareMetadataPayload(data)
      @http(
        url: @url "/storage/columns/#{columnId}/metadata"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(payload)
      )

    updateTableMetadata: (tableId, data) ->
      payload = this.prepareMetadataPayload(data)
      @http(
        url: @url "/storage/tables/#{tableId}/metadata"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(payload)
      )

    updateBucketMetadata: (bucketId, data) ->
      payload = this.prepareMetadataPayload(data)
      @http(
        url: @url "/storage/buckets/#{bucketId}/metadata"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(payload)
      )

    jsonTableData: (tableId, options = {}, callback = null) ->
      deferred = @$q.defer()
      # BC compatibility
      params = if angular.isNumber(options) then limit: options else options
      params.format = "json"

      @http(
        url: @dataPreviewUrl(tableId) + "?" + $.param(params)
        method: 'GET'
      ).success((data) ->
        callback(data) if callback
        deferred.resolve(data)
      )
      .error((data, status, headers, config) ->
          deferred.reject(
            data: data
            status: status
            headers: headers
            config: config
          )
        )
      promise = deferred.promise
      promise.success = (fn) ->
        promise.then((data) ->
          fn(data)
        )
        promise

      promise.error = (fn) ->
        promise.then(null, (response) ->
          fn(response.data, response.status, response.headers)
        )
        promise

      return promise

    # Read and parse table data
    # returns promise
    tableData: (tableId, options = {}, callback = null) ->
      csv = @csv
      deferred = @$q.defer()
      # BC compatibility
      params = if angular.isNumber(options) then limit: options else options

      @http(
        url: @dataPreviewUrl(tableId) + "?" + $.param(params)
        method: 'GET'
      ).success((data) ->
        parsed = csv.parse(data)
        parsed =
          header: parsed.shift()
          data: parsed
        callback(parsed) if callback
        deferred.resolve(parsed)
      )
      .error((data, status, headers, config) ->
          deferred.reject(
            data: data
            status: status
            heders: headers
            config: config
          )
        )

      promise = deferred.promise
      promise.success = (fn) ->
        promise.then((parsedData) ->
          fn(parsedData)
        )
        promise

      promise.error = (fn) ->
        promise.then(null, (response) ->
          fn(response.data, response.status, response.headers)
        )
        promise

      return promise

    # return table data as an array of objects (headers and data combined)
    tableDataArray: (tableId, options = {}, callback = null) ->
      return @tableData(tableId, options, callback).then((response) ->
        result = []
        angular.forEach(response.data, (line) ->
          result.push(_.object(response.header, line))
        )
        return result
      )

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
      params =
        description: token.description
        expiresIn: token.expiresIn
        canManageBuckets: token.canManageBuckets
        canReadAllFileUploads: token.canReadAllFileUploads

      angular.forEach(token.bucketPermissions, (permission, bucketId) ->
        params['bucketPermissions[' + bucketId + ']'] = permission
      )

      if !token.canManageBuckets
        angular.forEach(token.componentAccess, (componentId, ind) ->
          params['componentAccess[' + ind + ']'] = componentId;
        )

      @http(
        url: @url '/storage/tokens/'
        method: 'POST'
        params: params
      ).success (data, status) ->
        angular.copy(data, token)

    saveToken: (token) ->
      params =
        description: token.description

      angular.forEach(token.bucketPermissions, (permission, bucketId) ->
        params['bucketPermissions[' + bucketId + ']'] = permission
      )

      if !token.canManageBuckets
        angular.forEach(token.componentAccess, (componentId, ind) ->
          params['componentAccess[' + ind + ']'] = componentId;
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

    deleteToken: (tokenId) ->
      @http(
        url: @url '/storage/tokens/' + tokenId
        method: 'DELETE'
      )

    shareToken: (tokenId, recipientEmail, message) ->
      @http(
        url: @url "/storage/tokens/#{tokenId}/share"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          recipientEmail: recipientEmail
          message: message
        )
      )

    # files
    getFiles: (params) ->
      @http(
        url: @url '/storage/files'
        method: 'GET'
        params: params
      )

    deleteFile: (fileId) ->
      @http(
        url: @url '/storage/files/' + fileId
        method: 'DELETE'
      )

    prepareFileUpload: (params) ->
      @http(
        url: @url '/storage/files/prepare'
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(params)
      )

    # jobs
    getJobs: (params) ->
      @http(
        url: @url '/storage/jobs'
        method: 'GET'
        params: params
      )

    getJob: (id) ->
      @http(
        url: @url "/storage/jobs/#{id}"
        method: 'GET'
      )

    ###
    # Accepts HTTP requests promise - expects job resource returned
    # Returns promise
    # Job resource is polled until job is executed
    # Promise is resolved when job finishes with success otherwise promise is rejected
    ###
    resolveAsyncRequest: (httpRequestPromise) ->
      deferred = @$q.defer()
      service = @

      jobError = (error) ->
        service.errorHandler error
        deferred.reject error

      jobSuccess = (results) ->
        deferred.resolve results

      fetchJob = (jobId) ->
        service
        .pollJobUntilDone(jobId)
        .then((finishedJob) ->
            jobSuccess(finishedJob.results) if finishedJob.status == 'success'
            jobError(finishedJob.error) if finishedJob.status == 'error'
          , (error) ->
            jobError error
          )

      httpRequestPromise
      .success((job) ->
          fetchJob job.id
        )
      .error((error) ->
          jobError(error)
        )

      deferred.promise

    ###
    # Poll job resource until job status is `success` or `error`
    # Resolved as error after 20 tries
    # Returns promise - resolved when job is finished
    ###
    pollJobUntilDone: (id, maxAttemptsCount = 20) ->
      deferred = @$q.defer()
      service = @
      attemptsCount = 0

      jobReceived = (job) ->
        if job.status == 'success' || job.status == 'error'
          deferred.resolve(job)
          return
        checkJob()

      jobFetchError = (data) ->
        service.errorHandler data
        deferred.reject(data)

      checkJob = ->
        service.$timeout(->
          attemptsCount++
          if attemptsCount >= maxAttemptsCount
            jobFetchError(
              error: "Timeout after #{maxAttemptsCount} requests"
            )
            return

          service.getJob(id)
          .success(jobReceived)
          .error(jobFetchError)
        , Math.min((Math.pow(2, attemptsCount) * 100) + (Math.round(Math.random() * 100)), 60 * 1000), false)

      checkJob()

      deferred.promise

    # ticketing service
    generateId: ->
      @http(
        url: @url '/storage/tickets'
        method: 'POST'
      ).error(@errorHandler)

    # components
    getComponents: (params) ->
      @http(
        url: @url '/storage/components'
        method: 'GET'
        params: params
      ).error(@errorHandler)

    deleteComponentConfiguration: (componentId, configurationId) ->
      @http(
        url: @url "/storage/components/#{componentId}/configs/#{configurationId}"
        method: 'DELETE'
      )

    addComponentConfiguration: (componentId, configuration) ->
      @http(
        url: @url "/storage/components/#{componentId}/configs"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(configuration)
      )

    updateComponentConfiguration: (componentId, configurationId, data) ->
      @http(
        url: @url "/storage/components/#{componentId}/configs/#{configurationId}"
        method: 'PUT'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(data)
      )

    getComponentConfiguration: (componentId, configurationId) ->
      @http(
        url: @url "/storage/components/#{componentId}/configs/#{configurationId}"
        method: 'GET'
      )


    # bucket credentials
    getCredentials: ->
      @http(
        url: @url '/storage/credentials'
        method: 'GET'
      ).error(@errorHandler)

    getBucketCredentials: (bucketId) ->
      @http(
        url: @url "/storage/buckets/#{bucketId}/credentials"
        method: 'GET'
      ).error(@errorHandler)

    createBucketCredentials: (bucketId, name) ->
      @http(
        url: @url "/storage/buckets/#{bucketId}/credentials"
        method: 'POST'
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
        data: $.param(
          name: name
        )
      )

    deleteBucketCredentials: (id) ->
      @http(
        url: @url "/storage/credentials/#{id}"
        method: 'DELETE'
      )

    prepareMetadataPayload: (data) ->
      metadata = []
      angular.forEach(data, (v, k) ->
        metadata = metadata.concat({
          key: "KBC." + k,
          value: v
        })
      )
      return {
        provider: "user",
        metadata: metadata
      }

)(window.angular)
