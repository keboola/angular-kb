
# Notifications service

angular.module('kb.utils.notifications', ['kb.utils.events'])
  .factory 'kbNotifications', ["kbEvents", (kbEvents) ->
    class Notifications
      notifications: []

      # add a new notification, emit event
      add: (level, message) ->
        @notifications.push
          level: level,
          message: message
        kbEvents.publish('kbNotifications.change')

      # remove a notification using index number, emit event
      remove: (index) ->
        @notifications = _.reject(@notifications, (item, key) ->
          key == index
        )
        kbEvents.publish('kbNotifications.change')

      # return all notifications
      list: ->
        @notifications

    new Notifications()
]