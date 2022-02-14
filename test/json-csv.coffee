should = require "should"
{ toCsv, toCsvStream, Exporter } = require("../src/index")
StringWriter = require('../src/string-writer')
{ Readable } = require "stream"

describe "JSON - CSV", ->
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
        @exporter.toCsv @data
        .catch (err) => done err
        .then (csv) =>
          @result = csv
          done()
        return
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "When converting a buffer of data to CSV using fieldSeparator", ->
      before (done) ->
        @data = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
        toCsv @data,
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
        toCsv @data,
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
        toCsv @data,
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
        writer = new StringWriter()
        Readable.from(@data)
          .pipe(toCsvStream {fields : @fields})
          .pipe writer
          .on 'finish', () =>
            @result = writer.data
            done()

      it "should contain CSV result", -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
