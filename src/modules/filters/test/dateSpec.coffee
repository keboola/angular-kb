
describe 'kbdate', ->

	kbdateFilter = null
	dateFilter = null

	beforeEach(module('kb.filters.date'))
	beforeEach(inject(($filter) ->
		kbdateFilter = $filter('kbdate')
		dateFilter = $filter('date')
	))

	it 'should format date in ISO 8601', ->
		sampleDate = '2012-02-12T16:25:39+0000'
		format = 'yy-MM-dd HH:mm:ss'
		expect(kbdateFilter(sampleDate, format)).toBe(dateFilter(sampleDate, format))

	it 'should not format in other formats than ISO 8601', ->
		[
			'2012-02-16 16:25:39'
			'Saturday, June 9th, 2007, 5:46:21 PM'
		].forEach( (date) ->
			expect(kbdateFilter(date, 'yy-MM-dd HH:mm:ss')).toBe(date) # test that nothing is changed
		)

