should = require "should"
{ csv, csvBuffered, stream, buffered, toCsv, toCsvStream } = require("../src/index")
StringWriter = require('../src/string-writer')
{ Readable } = require "stream"

describe "Module exports", ->
  before ->
    @data = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]

    @fields = [
      name : 'contact.name'
      label : 'contact'
    ,
      name : 'contact.amount'
      label : 'amount'
    ]
    @options =
      buffered: true
      fields: @fields

  describe 'Buffered exports', ->
    describe "csvBuffered: always callback", ->
      before (done) ->
        csvBuffered @data, @options, (err, @result) => done(err)
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "buffered: callback", ->
      before (done) ->
        buffered @data, @options, (err, @result) => done(err)
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "toCsv: promise", ->
      before (done) ->
        toCsv @data, @options
          .catch (err) => done err
          .then (csv) =>
            @result = csv
            done()
        return # because promise returned conflicts with mocha
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "toCsv: callback", ->
      before (done) ->
        toCsv @data, @options, (err, @result) => done(err)
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "buffered: promise", ->
      before (done) ->
        buffered @data, @options
          .catch (err) => done err
          .then (csv) =>
            @result = csv
            done()
        return # because promise returned conflicts with mocha
      it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')

  describe 'Stream exports', ->
    describe "stream: return stream", ->
      before (done) ->
        csvStream = stream {fields : @fields}
        writer = new StringWriter()
        @result = ''
        Readable.from(@data)
          .pipe(csvStream)
          .pipe writer
          .on 'finish', () =>
            @result = writer.data
            done()
      it "should contain CSV result", -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "stream: callback", ->
      before (done) ->
        stream {fields : @fields}, (err, csvStream) =>
          writer = new StringWriter()
          @result = ''
          Readable.from(@data)
            .pipe(csvStream)
            .pipe writer
            .on 'finish', () =>
              @result = writer.data
              done()
      it "should contain CSV result", -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "toCsvStream: alias for stream", ->
      before (done) ->
        csvStream = toCsvStream {fields : @fields}
        writer = new StringWriter()
        @result = ''
        Readable.from(@data)
          .pipe(csvStream)
          .pipe writer
          .on 'finish', () =>
            @result = writer.data
            done()
      it "should contain CSV result", -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
    describe "csv: always stream", ->
      before (done) ->
        csvStream = csv {fields : @fields}
        writer = new StringWriter()
        @result = ''
        Readable.from(@data)
          .pipe(csvStream)
          .pipe writer
          .on 'finish', () =>
            @result = writer.data
            done()
      it "should contain CSV result", -> @result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
