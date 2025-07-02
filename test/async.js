/* eslint-disable promise/no-callback-in-promise */
const jsoncsv = require('../src/index')
const should = require('should')

describe('JSON - CSV, async', function () {
	before(function (done) {
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

		let aBuffered = async function (data) {
			return await jsoncsv.buffered(data, {
				fields: [
					{
						name: 'contact.name',
						label: 'contact',
						filter() {
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
			.then((result) => { this.result = result; done() })
			.catch((err) => { this.err = err; done() })
	})
	it('should work', function () { this.result.should.equal('contact,amount\r\nsomething else,4.3\r\nsomething else,5\r\n') })
	it('should not throw error', function () { should.not.exist(this.err) })
})
