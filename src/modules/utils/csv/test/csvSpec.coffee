

describe 'kb.utils.csv', ->

  kbCsv = null

  beforeEach(module('kb.utils.csv'))

  beforeEach(inject (_kbCsv_) ->
    kbCsv = _kbCsv_
  )

  it 'should create valid csv', ->

    data = [
        input:   [
          ['col1', 'col2']
          ['val1', 'val2']
        ]
        expected: '"col1","col2"\n"val1","val2"'
      ,
        input: [

        ]
        expected: ''
      ,
        input: [
          ['col1', 'col2'],
          ['neco', null]
          [12,35]
        ]
        expected: '"col1","col2"\n"neco",""\n"12","35"'
    ]
    data.forEach((test) ->
      expect(kbCsv.create(test.input)).toBe(test.expected)
    )
