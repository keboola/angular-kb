angular
  .module( 'kb.syrup.asyncRunner', ['kb.config', 'kb.sapi.errorHandler'])
  .factory('kbSyrupAsyncRunner', ["$http", "kb.components", "kbSapiErrorHandler", "$q", "kb.config", ($http, components, errorHandler, $q, kbConfig) ->

    class SyrupAsyncRunner

      constructor: (@$http, @$q, @jobUriTemplate) ->

      # makes the async call, returns a wrapper promise
      # config params:
      # - config.component: component id or url
      # - config.token: storage ap token
      # - config.data: POST data
      # - config.method: API method ('run' as default)
      call: (config) ->
        params = @httpParams(config)
        deferred = @$q.defer()
        runner = @
        $http(params)
          .then ((response) ->
            data = runner.runEnd(response)
            deferred.resolve(data)
          ), (response) ->
            runner.handleError(response)
            deferred.reject(response)
        deferred.promise

      # prepare http params from config
      httpParams: (config) ->
        if !config.method
          config.method = 'run'
        if !config.data
          config.data = {}
        params =
          data: config.data
          url: @uri(config.component, config.method)
          method: 'POST'
          headers:
            'X-StorageApi-Token': config.token
        return params

      # try to find the component uri in kb.components,
      # otherwise use the component string as uri
      uri: (component, method) ->
        componentConfig = _.find(components, (c) ->
          c.id == component
        )
        if componentConfig && componentConfig.uri
          uri = componentConfig.uri
        else
          uri = component
        uri + '/' + method

      # return jobId and jobUri from a response
      runEnd: (response) ->
        data = {
          jobUri: @jobUri response.data.id
          jobId: response.data.id
        }
        return data

      jobUri: (jobId) ->
        _.template(@jobUriTemplate)(
          jobId: jobId
        )

      # sapi error handler
      handleError: (response) ->
        errorHandler.handleError(response.data)

    # resolve job jobUriTemplate
    jobUriTemplate = kbConfig.syrup?.jobUriTemplate || "jobs#/job/<%= jobId %>"

    new SyrupAsyncRunner($http, $q, jobUriTemplate)

  ])
