
describe 'kbWebalize', ->

  webalizeFilter = null

  beforeEach(module('kb.filters.webalize'))
  beforeEach(inject(($filter) ->
    webalizeFilter = $filter('kbwebalize')
  ))

  it 'should not change common string', ->
    expect(webalizeFilter('abcd')).toBe 'abcd'

  it 'should convert to lower case', ->
    expect(webalizeFilter('AbCD')).toBe 'abcd'

  it 'should replace spaces by dash', ->
    expect(webalizeFilter('some sentence with   spaces')).toBe 'some-sentence-with---spaces'