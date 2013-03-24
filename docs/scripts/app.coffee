
((angular) ->

	app = angular.module('kbDocs', ['kb'])

	app.value('kb.config',
		ui:
			'copy-button':
				swfPath: 'components/zeroclipboard/ZeroClipboard.swf'
	)

	modules = [
		'kb.ui.inline-edit'
		'kb.ui.datetime'
		'kb.ui.tree'
		'kb.ui.toggable'
		'kb.ui.run-button'
		'kb.ui.loader'
		'kb.ui.copy-button'
	]

	app.config(($routeProvider) ->
		angular.forEach(modules, (module) ->
			$routeProvider
					.when( "/#{module}",
						controller: module,
						templateUrl: "templates/#{module}.html"
						module: module
					)
		)

		$routeProvider.otherwise(
			redirectTo : modules[0]
		)
	)


	app.controller('app', ($scope, $location) ->
		$scope.modules = modules

		$scope.openModule = (module) ->
			$location.path("/#{module}")

		$scope.$on('$routeChangeSuccess', (event, route) ->
			$scope.currentModule = route.module
		)
	)


	app.controller('kb.ui.loader', ($scope, $timeout) ->
		$scope.loader1loading = false
		$scope.loader2loading = false
		$scope.loader2start = ->
			$scope.loader2loading = true
			$timeout( ->
				$scope.loader2loading = false
			, 1000)
	)

	app.controller('kb.ui.run-button', ($scope, $timeout) ->
		$scope.isRunning = false
		$scope.run = ->
			$scope.isRunning = true
			$timeout( ->
				$scope.isRunning = false
			, 1000)
	)

	app.controller('kb.ui.toggable', ($scope) ->
		$scope.opened = true
	)

	app.controller('kb.ui.tree', ($scope) ->

		$scope.tree = {
				"id": 37382043,
				"uri": "https://connection.keboola.com//v2/storage/events/37382043",
				"event": "storage.bucketsListed",
				"component": "storage",
				"message": "Buckets listed.",
				"description": "",
				"type": "info",
				"runId": null,
				"created": "2013-03-22T14:08:58+0100",
				"published": "2013-03-22T14:08:58+0100",
				"configurationId": null,
				"context": {
						"remoteAddr": "10.77.5.27",
						"httpReferer": null,
						"httpUserAgent": "Keboola Storage API PHP Client",
						"apiVersion": {
							"major": "33",
							"minor": "2"
						}
				},
				"params": [
					'this',
					'is',
					'array'
				],
				"results": [
					{
						"duration": 234
					},
					{
						"duration": 204
					}
				],
				"performance": [],
				"token": {
						"name": "Master Token",
						"id": "491"
				},
				"attachments": []
		}
	)

	app.controller('kb.ui.datetime', ($scope) ->
			$scope.times = [
				"2013-03-06T15:24:12+00:00"
				"Something..."
				""
			]
	)

	app.controller('kb.ui.inline-edit', ($scope) ->
		$scope.textEditValue = 'Martin'
		$scope.textEditPlaceholder = 'Enter some value'
		$scope.textEditTitle = 'Click to edit.'
		$scope.textEditDisabled = false

		$scope.saveTextEdit = ->

		$scope.textAreaValue = """
			Some text
			with new

			lines
    """
		$scope.textAreaPlaceholder = 'Enter some text...'
		$scope.textAreaTitle = 'Click to edit.'
		$scope.textAreaDisabled = false

		$scope.selectValue = 'Option 1'
		$scope.selectTitle = 'Edit selection'
		$scope.selectOptions = [
			'Option 1'
			'Option 2'
			'Option 3'
		]
		$scope.selectDisabled = false
	)

	app.controller('kb.ui.copy-button', ($scope) ->
		$scope.copyValue = "Text to copy"
		$scope.copyMessage = "Text copied!"
		$scope.copyTitle = "Copy text"
	)


)(window.angular)