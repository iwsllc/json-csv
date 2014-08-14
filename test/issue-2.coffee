jsoncsv = require '../index'
should = require "should"

describe "Issue 2", ->
  describe "When providing a filter function that returns null or undefined", ->
    before (done) ->
      @items = [ { s : 5 } ];
      jsoncsv.csvBuffered @items, { fields: [ { name : 's', label : 's', filter : (v) -> return undefined; } ] }, (err,csv) =>
        @csv = csv
        @err = err
        done()

    it "should filter before prepping the value", -> @csv.should.equal 's\r\n\r\n'
    it "should not throw an error", -> should.not.exist @err
