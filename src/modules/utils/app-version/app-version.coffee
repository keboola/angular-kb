
# Application version for assets links

angular
	.module('kb.utils.appVersion', [])
	.provider('kbAppVersion', ->

				version = 'v1'
				basePath = '/'

				# should be set on app run start
				@setVersion = (newVersion) ->
					version = newVersion
					@

				@setBasePath = (newBasePath) ->
					basePath = newBasePath
					@

				@versionUrl = (url) ->
					basePath + url + '?version=' + version

				provider = @
				# service factory function
				@$get = ->
					version: ->
						version
					versionUrl: (url) ->
						provider.versionUrl(url)
	)