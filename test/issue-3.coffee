jsoncsv = require '../index'
should = require "should"

describe "Issue 3", ->
  before (done) ->
    @data = [{contact : {name : '', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
    jsoncsv.csvBuffered @data,
      fields : [
        name : 'contact.name'
        label : 'contact'
      ,
        name : 'contact.amount'
        label : 'amount'
      ]
    , (err,csv) =>
      @result = csv
      done err

  it 'should convert list of data to csv', -> @result.should.equal('contact,amount\r\n,4.3\r\ntest2,5\r\n')
