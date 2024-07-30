import { buffered } from '@iwsio/json-csv-node'
import { expect } from 'chai'

describe('ESM: JSON - CSV, async', function () {
	before(async function () {
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

		const options = {
			fields: [
				{
					name: 'contact.name',
					label: 'contact',
					filter: function () {
						return 'something else'
					}
				}, {
					name: 'contact.amount',
					label: 'amount'
				}
			]
		}
		this.result = await buffered(this.data, options)
	})
	it('should work', function () { expect(this.result).to.eql('contact,amount\r\nsomething else,4.3\r\nsomething else,5\r\n') })
	it('should not throw error', function () { expect(this.err).to.not.exist })
})
