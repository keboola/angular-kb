###
  SAPI events service
###

((angular) ->
  angular.module('kb.sapi.eventsService', [
      'kb.sapi.sapiService'
    ]).factory( "kbSapiEventsService", ['kbSapiService', (storageService) ->
      (eventsUrl, filter = null) ->
        new StorageEventsService(eventsUrl, storageService, filter)
    ])


  class StorageEventsService

    constructor: (@eventsUrl, @storageService) ->
      @events = []
      @olderEventsLoading = false
      @newEventsLoading = false
      @hasOlderEvents = true
      @loaded = false
      @defaultParams =
        limit: 50
        offset: 0

    setDefaultParam: (name, value) ->
      @defaultParams[name] = value
      @

    load: (params) ->
      eventsService = @
      @_load(params)
        .success (events) ->
          eventsService.events = eventsService.uniqEvents(eventsService.events.concat( events ))
          eventsService.hasOlderEvents = false if !eventsService.events.length

    refresh: ->
      eventsService = @
      @newEventsLoading = true
      @hasOlderEvents = true
      @load()
        .success (events) ->
          eventsService.newEventsLoading = false
          eventsService.events = events

    loadNewEvents: ->
      eventsService = @
      newest = _.max( @events , (event) ->
        event.id
      )
      @newEventsLoading = true
      @_load(
        sinceId: newest.id
      ).success (events) ->
        eventsService.newEventsLoading = false
        eventsService.events = eventsService.uniqEvents(eventsService.events.concat( events ))

    uniqEvents: (events) ->
      _.uniq events, (event) ->
        event.id

    loadOlderEvents: ->
      eventsService = @
      oldest = _.min( @events , (event) ->
        event.id
      )
      @olderEventsLoading = true
      @_load(
        maxId: oldest.id
      ).success (events) ->
        eventsService.olderEventsLoading = false
        eventsService.events = eventsService.uniqEvents(eventsService.events.concat( events ))
        eventsService.hasOlderEvents = false if !events.length

    _load: (params) ->
      eventsService = @

      @storageService.http(
        url: @storageService.url( @eventsUrl )
        method: 'GET'
        params: angular.extend( {}, @defaultParams, params )
       ).error( ( data, status, headers, config ) ->
        eventsService.newEventsLoading = false
        eventsService.olderEventsLoading =  false
        eventsService.storageService.errorHandler( data, status, headers, config )
      )
      .success( (events) ->
        eventsService.loaded = true
      )

)(window.angular)

