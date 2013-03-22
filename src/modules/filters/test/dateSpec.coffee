
describe 'kbdate', ->

	dateFilter = null

	beforeEach(module('kb.filters.date'))
	beforeEach(inject(($filter) ->
		dateFilter = $filter('kbdate')
	))

	it 'should format date in ISO 8601', ->
		expect(dateFilter('2012-02-12T16:25:39+0000', 'yy-MM-dd HH:mm:ss')).toBe('12-02-12 17:25:39')

	it 'should not format in other formats than ISO 8601', ->
		[
			'2012-02-16 16:25:39'
			'Saturday, June 9th, 2007, 5:46:21 PM'
		].forEach( (date) ->
			expect(dateFilter(date, 'yy-MM-dd HH:mm:ss')).toBe(date) # test that nothing is changed
		)

