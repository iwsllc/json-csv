import { buffered } from '@iwsio/json-csv-node'
import 'should'

describe('ESM: Issue 10', function() {
	describe("@kameamea's test", function() {
		before(function(done) {
			this.data = [{ contact: { name: '', amount: 4.3 } }, { contact: { name: 'test2', amount: 5 } }]
			buffered(this.data,
				{
					fields: [
						{
							name: 'contact.name',
							label: 'contact'
						},
						{
							name: 'contact.amount',
							label: 'amount'
						}
					]
				}
				, (err, csv) => {
					this.result = csv
					done(err)
				})
		})
		it('should convert list of data to csv', function() { this.result.should.equal('contact,amount\r\n,4.3\r\ntest2,5\r\n') })
	})
	describe("@Elavarasan83's test", function() {
		before(function(done) {
			this.data = [{ car: '', price: 40000, color: 'blue' }, { car: 'BMW', price: 35000, color: 'red' }, { car: 'Tata', price: 60000, color: 'green' }]

			buffered(this.data,
				{
					fields: [
						{
							name: 'car',
							label: 'CAR'
						},
						{
							name: 'color',
							label: 'COLOR'
						},
						{
							name: 'price',
							label: 'PRICE'
						}
					]
				}
				, (err, csv) => {
					this.result = csv
					done(err)
				}
			)
		})
		it('should convert list of data to csv', function() { this.result.should.equal('CAR,COLOR,PRICE\r\n,blue,40000\r\nBMW,red,35000\r\nTata,green,60000\r\n') })
	})
})
