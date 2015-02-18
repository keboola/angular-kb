describe 'kb.syrup.asyncRunner', ->

  beforeEach ->
    angular.module('kb.config', [])
      .value('kb.config', {})
      .value('kb.components', [{"id":"gooddata-writer","uri":"https:\/\/syrup.keboola.com\/gooddata-writer"}])

  runner = null

  beforeEach(module('kb.syrup.asyncRunner'))

  beforeEach(inject(($injector) ->
    runner = $injector.get('kbSyrupAsyncRunner')
  ))

  it 'it should return uri of a component', ->
    expect(runner.uri('gooddata-writer', 'run')).toBe("https:\/\/syrup.keboola.com\/gooddata-writer\/run")

  it 'it should return uri of a component if not component in list', ->
    expect(runner.uri('https://transformation.keboola.com', 'run')).toBe("https:\/\/transformation.keboola.com\/run")

  it 'it should process https params correctly ', ->
    params = runner.httpParams({
      data:
        config: 'test'
      token: '123456'
      component: 'gooddata-writer'
    })
    expect(params.headers['X-StorageApi-Token']).toBe('123456')
    expect(params.data.config).toBe('test')
    expect(params.url).toBe("https:\/\/syrup.keboola.com\/gooddata-writer\/run")
    expect(params.method).toBe('POST')

  it 'should return default job uri if not set by config', ->
    expect(runner.jobUri 123).toBe "jobs#/job/123"


describe 'kb.syrup.asyncRunner config set', ->

  beforeEach ->
    angular.module('kb.config', [])
      .value('kb.config',
        syrup:
          jobUriTemplate: "jobs/<%= jobId %>"
      )
      .value('kb.components', [{"id":"gooddata-writer","uri":"https:\/\/syrup.keboola.com\/gooddata-writer"}])

  runner = null
  beforeEach(module('kb.syrup.asyncRunner'))

  beforeEach(inject(($injector) ->
    runner = $injector.get('kbSyrupAsyncRunner')
  ))

  it 'should return job uri from template in config', ->
    expect(runner.jobUri 123).toBe "jobs/123"
