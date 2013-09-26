
describe 'kb.appVersion', ->

	appVersion = null
	$sce = null
	
	version = 'v1'
	basePath = 'https://example.com/'

	beforeEach( ->
		angular
		.module('app.test', ['kb.utils.appVersion'])
			.config((kbAppVersionProvider) ->
				kbAppVersionProvider.setVersion version
				kbAppVersionProvider.setBasePath basePath
			)
	)

	beforeEach(module('app.test'))
	beforeEach(inject(($injector) ->
		appVersion = $injector.get('kbAppVersion')
		$sce = $injector.get('$sce')
	))

	it 'should return absolute url', ->
		expect(appVersion.versionUrl('neco/test')).toBe(basePath + 'neco/test?version=' + version)

	it 'should return SCE trusted url', ->
		url = appVersion.versionUrl('neco/test')
		expect($sce.getTrustedResourceUrl(url)).toBe(url)

