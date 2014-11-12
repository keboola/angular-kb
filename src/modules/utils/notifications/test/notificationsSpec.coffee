describe 'kb.utils.notifications', ->

  notifications = null
  events = null

  beforeEach(module('kb.utils.notifications'))

  beforeEach(inject(($injector) ->
    notifications = $injector.get('kbNotifications')
    events = $injector.get('kbEvents')
  ))

  it 'should add a notification and emit event', ->
    changed = false
    events.subscribe("kbNotifications.change", () ->
      changed = true
    )
    expect(notifications.list().length).toBe(0)
    expect(changed).toBe(false)
    notifications.add("success", "test")
    expect(notifications.list().length).toBe(1)
    expect(changed).toBe(true)

  it 'should remove a notification and emit event', ->
    notifications.add("success", "test")
    notifications.add("danger", "test")
    changed = false
    events.subscribe("kbNotifications.change", () ->
      changed = true
    )
    expect(notifications.list().length).toBe(2)
    expect(changed).toBe(false)
    notifications.remove(1)
    expect(notifications.list().length).toBe(1)
    expect(changed).toBe(true)
