

((angular) ->

	angular
		.module('kb.ui.inlineEdit', [])
		.directive( 'kbInlineEdit', ->
			restrict: 'E'
			scope:
				value: '='
				disabled: '='
				onSave: '&'
				placeholder: '@'
			template: """
				<span class="static" ng-hide="isEditing" ng-click="edit()">
				 	{{ value }}
					 <a class="placeholder" ng-show="!value">
							<i class="icon-edit"></i>
							{{ placeholder }}
						</a>
				</span>
				<div ng-show="isEditing" class="input-append editing">
					<input type="text" ng-model="editValue" /><button
							class="btn btn-success" ng-click="save()">
								<i class="icon-ok" title="save"></i></button><button
						class="btn" ng-click="cancel()"><i class="icon-remove" title="Cancel"></i></button>
				</div>
			"""

			controller: InlineEditController
		)

		.directive( 'kbInlineEditDatetime', ->
			restrict: 'E'
			scope:
				value: '='
				disabled: '='
				onSave: '&'
			template: '
				<span class="static" ng-hide="isEditing" ng-click="edit()"><kb-datetime datetime="value"></kb-datetime></span>
				<div ng-show="isEditing" class="input-append editing">
					<input type="text" ng-model="editValue" /><button
							class="btn btn-success" ng-click="save()">
								<i class="icon-ok" title="save"></i></button><button
						class="btn" ng-click="cancel()"><i class="icon-remove" title="Cancel"></i></button>
				</div>'

			controller: InlineEditController
		)

		.directive( 'kbInlineEditTextarea', ->
			restrict: 'E'
			scope:
				value: '='
				disabled: '='
				onSave: '&'
				placeholder: '@'
			template: """
				<span class="static" ng-hide="isEditing" ng-click="edit()">
						<span kb-nl2br="value"></span>
						<a class="placeholder" ng-show="!value">
							<i class="icon-edit"></i>
							{{ placeholder }}
						</a>
				</span>
				<div ng-show="isEditing" class="editing">
					<textarea type="text" ng-model="editValue" placeholder="{{ placeholder }}">
					</textarea>
					<div class="form-actions">
								<button class="btn btn-primary" ng-click="save()">Save</button>
								<button class="btn" ng-click="cancel()">Cancel</button>
					</div>
				</div>
				"""
			controller: InlineEditController
		)

		.directive( 'kbInlineEditSelect', ->
			restrict: 'E'
			scope:
				value: '='
				disabled: '='
				onSave: '&'
				options: '='
			template: """
				<span class="static" ng-hide="isEditing" ng-click="edit()">{{ value }}
					<span class="placeholder" ng-show="!value">{{ placeholder }}</span>
				<span>
				<div ng-show="isEditing" class="input-append editing">
					<select ng-options="value for value in options" class="span2" ng-model="editValue" /><button
							class="btn btn-success" ng-click="save()"></select>
								<i class="icon-ok" title="save"></i></button><button
						class="btn" ng-click="cancel()"><i class="icon-remove" title="Cancel"></i></button>
				</div>'
				"""
			controller: InlineEditController
		)

		InlineEditController = (scope, element, attrs, $timeout) ->

			element.addClass 'form-inline'
			element.addClass 'inline-edit'
			element.addClass element.get(0).tagName.toLowerCase()

			disabled = false
			title = attrs.title
			element.removeAttr('title')
			tooltip = null
			scope.$watch('disabled', (newValue) ->
				disabled = newValue
				if disabled
					element.find('.static')
						.removeAttr('title')
					element.addClass('disabled')
				else
					element.find('.static')
						.tooltip(
							title: title
						)
					element.removeClass('disabled')

					tooltip = element.find('.static')
										.data('tooltip')

				redraw()
			)

			redraw = ->
				if scope.isEditing and !disabled then scope.edit() else scope.cancel()

			closeEditing = ->
				scope.isEditing = false
				angular.element('body').unbind('.inlineEdit')

			scope.edit = ->
				return if disabled
				scope.isEditing = true
				scope.editValue = scope.value

				angular.element('body').bind('click.inlineEdit', ->
					scope.$apply ->
						scope.cancel()
					return true
				)

				element.bind('click.inlineEdit', (e) ->
					e.stopPropagation()
				)

				element.bind('keyup.inlineEdit', (e) ->
					# save on enter
					scope.$apply( scope.save ) if e.keyCode == 13 && element.get(0).tagName.toLocaleLowerCase() != 'kb-inline-edit-textarea'

					# close on escape
					scope.$apply( closeEditing ) if e.keyCode == 27
					false
				)

				$timeout( ->
					element.find( ':input' ).not('button').focus()
				)

			scope.cancel = ->
				closeEditing()

			scope.$on('$destroy', ->
				tooltip.destroy() if tooltip
			)

			scope.save = ->
				scope.value = scope.editValue
				if angular.isFunction( scope.onSave )
					# timeout ensures that when onSave is called, new scope value is already propagated
					$timeout( ->
						scope.onSave( { newValue: scope.editValue } )
					)
				closeEditing()

		InlineEditController.$inject = ['$scope', '$element', '$attrs', '$timeout']
)(window.angular)