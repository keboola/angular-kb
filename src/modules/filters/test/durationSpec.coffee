
describe 'kbduration', ->

	durationFilter = null

	beforeEach(module('kb.filters.duration'))
	beforeEach(inject(($filter) ->
		durationFilter = $filter('kbDuration')
	))

	it 'should format seconds', ->
		expect(durationFilter(23)).toBe('23 secs')

	it 'should accept string', ->
		expect(durationFilter('23')).toBe('23 secs')

	it 'should format minutes', ->
		expect(durationFilter(125)).toBe('2 mins')

	it 'should format minutes', ->
			expect(durationFilter(90)).toBe('1.5 mins')

	it 'should format minutes', ->
		expect(durationFilter(70)).toBe('1 min')

	it 'should format hours', ->
		expect(durationFilter(8000)).toBe('2 hours')

	it 'should format hour', ->
		expect(durationFilter(4000)).toBe('1 hour')





