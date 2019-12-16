should       = require "should"
jsoncsv      = require("../index")
concat       = require('concat-stream')
Exporter     = jsoncsv.Exporter
stream       = require "stream"
bufferReader = require "../buffer-reader"

describe "JSON - CSV", ->
  describe "Value Evaluator", ->
    it "should evaluate value of contact.name", (done) ->
      test = {contact : {name : 'some name'}}
      result = new Exporter(test).getValue(test, 'contact.name')
      result.should.equal 'some name'
      done()
    it "should evaluate value of contact.name.middle.initial", (done) ->
      test = {contact : {name : { middle : {initial : 'L'}}}}
      result = new Exporter(test).getValue(test, 'contact.name.middle.initial')
      result.should.equal 'L'
      done()
    it "should evaluate undefined value of contact.name.middle.initial as blank string", (done) ->
      test = {contact : {name : 'test'}}
      result = new Exporter(test).getValue(test, 'contact.test.somethingelse')
      result.should.equal ''
      done()

  describe 'JSON to CSV converter', ->
    describe "Converting buffer to CSV; internal API", ->
      before (done) ->
        @exporter = new Exporter
          buffered: true
          fields: [
            name : 'contact.name'
            label : 'contact'
          ,
            name : 'contact.amount'
            label : 'amount'
          ]
        @data = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
        @exporter.buffered @data
        .catch (err) => done err
        .then (csv) =>
          @result = csv
          done()
        return
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "When converting a buffer of data to CSV using fieldSeparator", ->
      before (done) ->
        @data = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
        jsoncsv.buffered @data,
          fields : [
            name : 'contact.name'
            label : 'contact'
          ,
            name : 'contact.amount'
            label : 'amount'
          ],
          fieldSeparator : ';'
        , (err, csv) =>
          @result = csv
          done err
        return

      it 'should convert list of data to csv using fieldSeparator', -> @result.should.equal('contact;amount\r\ntest;4.3\r\ntest2;5\r\n')
    describe "When converting a buffer of data to CSV with field filters", ->
      before (done) ->
        @data = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
        jsoncsv.buffered @data,
          fields : [
            name : 'contact.name'
            label : 'contact'
            filter : (value) ->
              return 'something else'
          ,
            name : 'contact.amount'
            label : 'amount'
          ]
        , (err,csv) =>
          @result = csv
          done err
      return
      it "should convert list of data to csv using filters", -> @result.should.equal('contact,amount\r\nsomething else,4.3\r\nsomething else,5\r\n')
    describe "When filter is provided and the value is falsey", ->
      before (done) ->
        @data = [{contact : {name : 'test', thing: false, amount : 4.3}}, {contact : {thing: true, name : null, amount : 5}}]
        jsoncsv.buffered @data,
          fields : [
            name : 'contact.thing'
            label : 'thing'
            filter : (value) ->
              return if value == true then 'Yes' else 'No'
          ,
            name : 'contact.name'
            label : 'name'
          ,
            name : 'contact.amount'
            label : 'amount'
          ]
        , (err,csv) =>
          @result = csv
          done()
        return
      it "should write empty data", -> @result.should.equal('thing,name,amount\r\nNo,test,4.3\r\nYes,,5\r\n')

  describe 'Field value prep', ->
    it 'surround with quotes (and double-qoute inner) if any quotes detected within the value', (done) ->
      test = 'someString"'
      result = new Exporter().prepValue test
      result.should.equal '"someString"""'
      done()
    it 'surround with quotes if any commas detected within the value', (done) ->
      test = 'someString,'
      result = new Exporter({fieldSeparator: ','}).prepValue test
      result.should.equal '"someString,"'
      done()
    it 'surround with quotes if any fieldSeparator detected within the value', (done) ->
      test = 'someString;'
      result = new Exporter({fieldSeparator: ';'}).prepValue test
      result.should.equal '"someString;"'
      done()
    it 'surround with quotes if force quote option is true', (done) ->
      test = 'someString'
      result = new Exporter().prepValue test, true
      result.should.equal '"someString"'
      done()

  describe 'JSON to CSV stream', ->
    describe "When piping data through the Exporter to a buffer", ->
      before (done) ->
        @data = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]

        @fields = [
          name : 'contact.name'
          label : 'contact'
        ,
          name : 'contact.amount'
          label : 'amount'
        ]
        @result = ''
        bufferReader(@data)
          .pipe(jsoncsv.csv {fields : @fields})
          .pipe concat (buffer) =>
            @result = buffer
            done()

      it "should contain CSV result", -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
