/* eslint-disable no-unused-expressions */
const { toCsv } = require('../src/index')
const { expect } = require('chai')

describe('JSON - CSV, async', function() {
  before(function(done) {
    this.data = [
      {
        contact: {
          name: 'test',
          amount: 4.3
        }
      }, {
        contact: {
          name: 'test2',
          amount: 5
        }
      }
    ]

    const aBuffered = async function(data) {
      return await toCsv(data, {
        fields: [
          {
            name: 'contact.name',
            label: 'contact',
            filter: function() {
              return 'something else'
            }
          }, {
            name: 'contact.amount',
            label: 'amount'
          }
        ]
      })
    }

    aBuffered(this.data)
      .then(result => { this.result = result; done() })
      .catch(err => { this.err = err; done() })
  })
  it('should work', function() { this.result.should.equal('contact,amount\r\nsomething else,4.3\r\nsomething else,5\r\n') })
  it('should not throw error', function() { expect(this.err).to.not.exist })
})
