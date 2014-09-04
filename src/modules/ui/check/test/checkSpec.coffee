

describe 'check', ->

	beforeEach(module('kb.ui.check'))

	it 'should change status', inject(($rootScope, $compile) ->
		$rootScope.someFlag = false
		element = angular.element('<kb-check ng-model="someFlag"></kb-check>')
		$compile(element)($rootScope)

		$rootScope.$digest()
		expect(element.find('i').hasClass('fa-times')).toBe(true)
		expect(element.find('i').hasClass('fa-check')).toBe(false)

		$rootScope.someFlag = true
		$rootScope.$digest()
		expect(element.find('i').hasClass('fa-times')).toBe(false)
		expect(element.find('i').hasClass('fa-check')).toBe(true)
	)

