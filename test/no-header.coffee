jsoncsv = require '../index'
should = require 'should'

describe 'No Header Row', ->
  it 'should not contain a header', (done) ->
    items = [
      { k: 'foo' }
      { k: 'bar' }
    ]
    jsoncsv.csvBuffered items, {
      ignoreHeader: true
      fields: [ { name: 'k' } ]  # Label not needed
    }, (err, csv) ->
      csv.should.equal 'foo\r\nbar\r\n'
      done()
