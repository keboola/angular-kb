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

		constructor: (@eventsUrl, @storageService, filter = null) ->
			@events = []
			@olderEventsLoading = false
			@newEventsLoading = false
			@hasOlderEvents = true
			@filter = filter || (event) -> return event
			@loaded = false
			@defaultParams =
					count: 50
					offset: 0

		setDefaultParam: (name, value) ->
			@defaultParams[name] = value
			@

		load: (params) ->
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
				eventsService.events = eventsService.events.concat(_.filter(events, eventsService.filter))
				eventsService.hasOlderEvents = false if !eventsService.events.length
			)

		loadNewEvents: ->
			return if @newEventsLoading
			eventsService = @
			newest = _.max( @events , (event) ->
				event.id
			)
			@newEventsLoading = true
			@load(
				sinceId: newest?.id
			).success ->
				eventsService.newEventsLoading = false


		loadOlderEvents: ->
			return if @olderEventsLoading
			eventsService = @
			oldest = _.min( @events , (event) ->
				event.id
			)
			@olderEventsLoading = true
			@load(
				maxId: oldest.id
			).success (events) ->
				eventsService.olderEventsLoading = false
				eventsService.hasOlderEvents = false if !events.length

)(window.angular)