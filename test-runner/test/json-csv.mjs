import 'should'
import { toCsv, toCsvStream, StringWriter } from '@iwsio/json-csv-node'
import { Readable } from 'stream'

describe('ESM: JSON - CSV', function () {
	describe('buffered', function () {
		describe('When converting a buffer of data to CSV using fieldSeparator', function () {
			before(function (done) {
				this.data = [{ contact: { name: 'test', amount: 4.3 } }, { contact: { name: 'test2', amount: 5 } }]
				toCsv(this.data, {
					fields: [{
						name: 'contact.name',
						label: 'contact'
					},
					{
						name: 'contact.amount',
						label: 'amount'
					}
					],
					fieldSeparator: ';'
				}
				, (err, csv) => {
					this.result = csv
					done(err)
				})
			})

			it('should convert list of data to csv using fieldSeparator', function () { return this.result.should.equal('contact;amount\r\ntest;4.3\r\ntest2;5\r\n') })
		})
		describe('When converting a buffer of data to CSV with field filters', function () {
			before(function (done) {
				this.data = [{ contact: { name: 'test', amount: 4.3 } }, { contact: { name: 'test2', amount: 5 } }]
				toCsv(this.data, {
					fields: [{
						name: 'contact.name',
						label: 'contact',
						filter(_value) {
							return 'something else'
						}
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
			it('should convert list of data to csv using filters', function () { return this.result.should.equal('contact,amount\r\nsomething else,4.3\r\nsomething else,5\r\n') })
		})
		return describe('When filter is provided and the value is falsey', function () {
			before(function (done) {
				this.data = [{ contact: { name: 'test', thing: false, amount: 4.3 } }, { contact: { thing: true, name: null, amount: 5 } }]
				toCsv(this.data, {
					fields: [{
						name: 'contact.thing',
						label: 'thing',
						filter(value) {
							if (value === true) return 'Yes'
							else return 'No'
						}
					},
					{
						name: 'contact.name',
						label: 'name'
					},
					{
						name: 'contact.amount',
						label: 'amount'
					}
					]
				}
				, (err, csv) => {
					this.result = csv
					done()
				})
			})
			it('should write empty data', function () { return this.result.should.equal('thing,name,amount\r\nNo,test,4.3\r\nYes,,5\r\n') })
		})
	})
	describe('stream', function () {
		return describe('When piping data through the Exporter to a buffer', function () {
			before(function (done) {
				this.data = [{ contact: { name: 'test', amount: 4.3 } }, { contact: { name: 'test2', amount: 5 } }]

				this.fields = [{
					name: 'contact.name',
					label: 'contact'
				},
				{
					name: 'contact.amount',
					label: 'amount'
				}
				]
				this.result = ''
				const writer = new StringWriter()
				Readable.from(this.data)
					.pipe(toCsvStream({ fields: this.fields }))
					.pipe(writer)
					.on('finish', () => {
						this.result = writer.data
						done()
					})
			})

			it('should contain CSV result', function () { return this.result.should.equal('contact,amount\r\ntest,4.3\r\ntest2,5\r\n') })
		})
	})
})
