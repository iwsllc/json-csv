should = require "should"
jsoncsv = require "../json-csv"

describe "JSON - CSV", -> 
  describe "Value Evaluator", -> 
    it "should evaluate value of contact.name", (done) ->
      test = {contact : {name : 'some name'}}
      result = jsoncsv.getValue(test, 'contact.name')
      result.should.equal 'some name'
      done()

    it "should evaluate value of contact.name.middle.initial", (done) ->
      test = {contact : {name : { middle : {initial : 'L'}}}}
      result = jsoncsv.getValue(test, 'contact.name.middle.initial')
      result.should.equal 'L'
      done()

    it "should evaluate undefined value of contact.name.middle.initial as blank string", (done) ->
      test = {contact : {name : 'test'}}
      result = jsoncsv.getValue(test, 'contact.test.somethingelse')
      result.should.equal ''
      done()

  describe 'JSON to CSV converter', ->
    it 'should convert list of data to csv', (done) ->
      test = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
      jsoncsv.toCSV 
        data : test
        fields : [
          name : 'contact.name'
          label : 'contact'
        ,
          name : 'contact.amount'
          label : 'amount'
        ]
      , (err,csv) ->
        csv.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n')
        done()   

    it 'run custom method if filter is provided', (done) ->
      test = [{contact : {name : 'test', amount : 4.3}}, {contact : {name : 'test2', amount : 5}}]
      jsoncsv.toCSV 
        data : test
        fields : [
          name : 'contact.name'
          label : 'contact'
          filter : (value) ->
            return 'something else'
        ,
          name : 'contact.amount'
          label : 'amount'
        ]
      , (err,csv) ->
        csv.should.equal('contact,amount\r\nsomething else,4.3\r\nsomething else,5\r\n')
        done() 
    it 'run custom method if filter is provided and the value is falsey', (done) ->
      test = [{contact : {name : 'test', thing: false, amount : 4.3}}, {contact : {thing: true, name : null, amount : 5}}]
      jsoncsv.toCSV 
        data : test
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
      , (err,csv) ->
        csv.should.equal('thing,name,amount\r\nNo,test,4.3\r\nYes,,5\r\n')
        done() 

  describe 'Field value prep', ->
    it 'surround with quotes (and double-qoute inner) if any quotes detected within the value', (done) ->
      test = 'someString"'
      result = jsoncsv.prepValue test
      result.should.equal '"someString"""'
      done()
    it 'surround with quotes if any commas detected within the value', (done) ->
      test = 'someString,'
      result = jsoncsv.prepValue test
      result.should.equal '"someString,"'
      done() 
    it 'surround with quotes if force quote option is true', (done) ->
      test = 'someString'
      result = jsoncsv.prepValue test, true
      result.should.equal '"someString"'
      done()      
