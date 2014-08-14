jsoncsv = require '../index'
should = require "should"

describe "Issue 1", ->
  it "should contain a final endquote", (done) ->
    items = [ { s : "foo \"bar\""} ]; #--> this should be turned into "foo ""bar"""
    jsoncsv.csvBuffered items, { fields: [ { name : 's', label : 's' } ] }, (err,csv)->
      csv.should.equal 's\r\n"foo ""bar"""\r\n'
      done()
