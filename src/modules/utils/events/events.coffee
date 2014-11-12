
# Event service

angular.module('kb.utils.events', [])
  .service 'kbEvents', ["$q", "$rootScope", ($q, $rootScope) ->

    # raise an event with a given name, returns an array of promises for each listener
    publish: (name, args) ->

      # no listeners
      if !$rootScope.$$listeners[name]
        return []

      # setup a deferred promise for each listener
      deferred = []
      i = 0

      while i < $rootScope.$$listeners[name].length
        deferred.push $q.defer()
        i++

      # create a new event args object to pass to the
      # $broadcast containing methods that will allow listeners
      # to return data in an async if required
      eventArgs =
        args: args
        reject: (a) ->
          deferred.pop().reject(a)
          return

        resolve: (a) ->
          deferred.pop().resolve(a)
          return

      # send the event
      $rootScope.$broadcast(name, eventArgs)

      # return an array of promises
      promises = _.map(deferred, (p) ->
        p.promise
      )
      promises

    # subscribe to a method, or use scope.$on = same thing
    subscribe: (name, callback) ->
      $rootScope.$on(name, callback)

    # pass in the result of subscribe to this method,
    # or just call the method returned from subscribe to unsubscribe
    unsubscribe: (handle) ->
      if angular.isFunction(handle)
        handle()
      return

]