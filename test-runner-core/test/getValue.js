const { getValue } = require('../../packages/json-csv-core/dist/exporter')

describe('Value Evaluator', function () {
	it('should evaluate value of contact.name', function () {
		const test = { contact: { name: 'some name' } }
		const result = getValue(test, 'contact.name')
		expect(result).to.equal('some name')
	})

	it('should evaluate value of contact.name.middle.initial', function () {
		const test = { contact: { name: { middle: { initial: 'L' } } } }
		const result = getValue(test, 'contact.name.middle.initial')
		expect(result).to.equal('L')
	})

	it('should evaluate undefined value of contact.name.middle.initial as blank string', function () {
		const test = { contact: { name: 'test' } }
		const result = getValue(test, 'contact.test.somethingelse')
		expect(result).to.equal('')
	})
})
