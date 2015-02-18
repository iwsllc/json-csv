jsoncsv = require '../index'
should = require "should"

describe "Issue 10", ->
  describe "@kameamea's test", ->
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

  describe "@Elavarasan83's test", ->
    before (done) ->
      @data = [{"car": "","price": 40000,"color": "blue"}, {"car": "BMW","price": 35000,"color": "red"}, {"car": "Tata","price": 60000,"color": "green"}];

      jsoncsv.csvBuffered @data,
        fields : [
          name : 'car'
          label : 'CAR'
        ,
          name : 'color'
          label : 'COLOR'
        ,
          name : 'price'
          label : 'PRICE'
        ]
      , (err,csv) =>
        @result = csv
        done err

    it 'should convert list of data to csv', -> @result.should.equal('CAR,COLOR,PRICE\r\n,blue,40000\r\nBMW,red,35000\r\nTata,green,60000\r\n')
