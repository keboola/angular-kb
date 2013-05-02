
describe 'kbfilesize', ->

	filesizeFilter = null

	beforeEach(module('kb.filters.filesize'))
	beforeEach(inject(($filter) ->
		filesizeFilter = $filter('kbfilesize')
	))

	it 'should convert B', ->
		expect(filesizeFilter(125)).toBe('125B')

	it 'should convert KB', ->
		expect(filesizeFilter(1356)).toBe('1.32KB')

	it 'should convert MB', ->
		expect(filesizeFilter(2345678)).toBe('2.24MB')
		expect(filesizeFilter(797540352)).toBe('760.59MB')

	it 'should convert GB', ->
		expect(filesizeFilter(2345678000)).toBe('2.18GB')


