

angular
.module( 'kb.ui.confirm', ['kb.config', 'ui.bootstrap.modal', 'ngSanitize'])
.factory('kbConfirm', ['$modal', ($modal) ->
	defaultParams =
		header: ''
		message: ''
		cancelButton:
			label: 'Cancel'
			type: ''
		confirmButton:
			label: 'Confirm'
			type: 'primary'

	confirm =
		confirm:
			(params) ->
				$modal.open(
					templateUrl: "kb/ui/confirm/templates/confirm.html"
					resolve:
						params: ->
							jQuery.extend true, {}, defaultParams, params
					controller: ['$scope', '$modalInstance', 'params', ($scope, $modalInstance, params) ->

						$scope.params = params

						$scope.close = ->
							$modalInstance.dismiss()

						$scope.confirm = ->
							$modalInstance.close()
					]
				)
	confirm
])
.directive('kbConfirm', ['kbConfirm', '$parse', (kbConfirm, $parse) ->
	restrict: 'A'
	link: (scope, element, attrs) ->
		action =  $parse(attrs['onConfirm'])
		element.on('click', ->
			params =
				header: attrs.header
				message: attrs.message
				confirmButton: {}

			if attrs.confirmLabel != ''
				params.confirmButton.label = attrs.confirmLabel

			if attrs.confirmType != ''
				params.confirmButton.type = attrs.confirmType

			modal = kbConfirm.confirm(params)
			modal.result.then(->
				action(scope)
			)
		)

		return
])