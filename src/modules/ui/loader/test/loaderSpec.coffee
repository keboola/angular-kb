

describe 'loader', ->

	beforeEach(module('kb.ui.loader'))

	it 'should change loading status', inject(($rootScope, $compile) ->
			element = angular.element('<kb-loader is-loading="loaderLoading"/>')
			$compile(element)($rootScope)

			$rootScope.$digest()
			expect(element.find('i').hasClass('loading')).toBe(false)

			$rootScope.loaderLoading = true
			$rootScope.$digest()
			expect(element.find('i').hasClass('loading')).toBe(true)
	)

