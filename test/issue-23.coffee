jsoncsv = require '../index'
should = require "should"

describe "Issue 23", ->
  describe "When excluding label definitions", ->
    before (done) ->
      @items = [{a: "first", b: "second"}, {a: "third", b:"fourth"}, {a: "fifth", b: "sixth"}]
      jsoncsv.csvBuffered @items, {
        fields: [
          {name: "a", label: "a"}
          {name: "b"} # this is breaking (before fix)
        ]}, (err, csv) =>
          @csv = csv
          @err = err
        done()

    it "should export a and b", -> @csv.should.equal "a,b\r\nfirst,second\r\nthird,fourth\r\nfifth,sixth\r\n"

  #also this issue came up (because of the first one)
  describe "When exporting a column that resolves undefined in the data set", ->
    before (done) ->
      @items = [{a: "first", b: "second"}, {a: "third", b:"fourth"}, {a: "fifth", b: "sixth"}]
      jsoncsv.csvBuffered @items, {
        fields: [
          {name: "a"}
          {name: "b"}
          {name: "c"} #breaking before fix
        ]}, (err, csv) =>
          @csv = csv
          @err = err
        done()

    it "should export a, b, and c", -> @csv.should.equal "a,b,c\r\nfirst,second,\r\nthird,fourth,\r\nfifth,sixth,\r\n"
