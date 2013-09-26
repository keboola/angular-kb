
describe 'inline edit', ->

	elm = null
	$rootScope = null
	$timeout = null

	beforeEach(module 'kb.templates')
	beforeEach(module 'kb.ui.inlineEdit' )
	beforeEach(inject((_$rootScope_, $compile, _$timeout_) ->

		_$rootScope_.edit =
			value: 'edit value'
			disabled: false
			placeholder: 'Enter value'

		elm = angular.element """
 			<kb-inline-edit value="edit.value" disabled="edit.disabled" placeholder="edit.placeholder"></kb-inline-edit>"
		"""

		$compile(elm)(_$rootScope_)
		$rootScope = _$rootScope_
		$timeout = _$timeout_
		$rootScope.$digest()
	))

	goToEditMode = ->
		elm.find('.static').click()

	it 'should add kb-inline-edit class to element', ->
		expect(elm.hasClass 'kb-inline-edit').toBeTruthy()


	it 'should be in static mode by default', ->
		expect(elm.hasClass 'disabled').toBeFalsy()

		expect(elm.find('.static').hasClass('ng-hide')).toBeFalsy()
		expect(elm.find('.editing').hasClass('ng-hide')).toBeTruthy()

	it 'should switch to editing mode on click', ->
		goToEditMode()
		expect(elm.find('.static').hasClass('ng-hide')).toBeTruthy()
		expect(elm.find('.editing').hasClass('ng-hide')).toBeFalsy()

	it 'should not switch to edit model when disabled', ->
		$rootScope.edit.disabled = true
		$rootScope.$digest()
		goToEditMode()

		expect(elm.find('.static').hasClass('ng-hide')).toBeFalsy()
		expect(elm.find('.editing').hasClass('ng-hide')).toBeTruthy()

	it 'should be able change edit value', ->
		newValue = 'changed value'
		goToEditMode()
		elm.find('.editing').find('input').val newValue
		elm.find('.editing').find('button.btn-success').click()
		$timeout ->
			expect($rootScope.edit.value).toBe newValue

	it 'model value is not changed during edit', ->
		initialValue = $rootScope.edit.value
		goToEditMode()

		expect(elm.find('.editing').find(':input').val()).toBe initialValue
		elm.find('.editing').find('input').val 'some new value'
		$rootScope.$digest()

		expect($rootScope.edit.value).toBe initialValue

		# cancel edit
		elm.find('.editing').find('button').eq(2).click()
		expect(elm.find('.static').text()).toContain initialValue

		elm.find('.editing').find('button.btn-success').click()