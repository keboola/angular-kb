
# Application version for assets links

angular
	.module('kb.utils.appVersion', [])
	.provider('kbAppVersion', ['$sceDelegateProvider', ($sceDelegateProvider) ->

				version = 'v1'
				basePath = '/'

				# should be set on app run start
				@setVersion = (newVersion) ->
					version = newVersion
					@

				@setBasePath = (newBasePath) ->
					basePath = newBasePath
					$sceDelegateProvider.resourceUrlWhitelist([
						'self'
						basePath + '**'
					])
					@

				@versionUrl = (url) ->
					basePath + url + '?version=' + version

				provider = @
				# service factory function
				@$get = ['$sce', ($sce) ->
						version: ->
							version
						versionUrl: (url) ->
							provider.versionUrl(url)
				]

				return
	])