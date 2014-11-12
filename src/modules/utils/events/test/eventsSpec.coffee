describe 'kb.utils.events', ->

  events = null

  beforeEach(module('kb.utils.events'))

  beforeEach(inject(($injector) ->
    events = $injector.get('kbEvents')
  ))


  it 'should trigger event and pass string', ->

    responseData = null
    events.subscribe('test', (event, data) ->
      responseData = data.args
    )
    events.publish('test', 'test response')

    expect(responseData).toBe('test response')