describe 'kb.sapi.service', ->

  sapiServiceFactory = null
  injector = null

  beforeEach(module('kb.sapi.sapiService'))
  beforeEach(inject(($injector) ->
    sapiServiceFactory = $injector.get('kbSapiServiceFactory')
    injector = $injector
  ))

  it 'should return new instance of sapi service', ->
    service = sapiServiceFactory()
    anotherService = sapiServiceFactory()
    expect(typeof service.index).toBe('function')
    expect(service).not.toBeNull()
    expect(service).not.toBe(anotherService)
    expect(service).not.toBe(injector.get('kbSapiService'))
    expect(injector.get('kbSapiService')).toBe(injector.get('kbSapiService'))
