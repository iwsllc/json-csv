jsoncsv = require '../index'
should = require "should"

describe "Issue 21", ->
  describe "When exporting a column, concatenated from two source fields", ->
    before (done) ->
      @items = [{a: "first", b: "second"}, {a: "third", b:"fourth"}, {a: "fifth", b: "sixth"}]
      jsoncsv.csvBuffered @items, {
        fields: [
          {
            name: "this"
            label: 'c'
            filter: (v) ->
              return "#{v?.a}#{v?.b}"
          }
        ]}, (err, csv) =>
          @csv = csv
          @err = err
        done()

    it "should export concatenated a and b", -> @csv.should.equal "c\r\nfirstsecond\r\nthirdfourth\r\nfifthsixth\r\n"
