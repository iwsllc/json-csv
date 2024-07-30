const { prepValue } = require('../../packages/json-csv-core/dist/exporter')

describe('Field value prep', function () {
	it('surround with quotes (and double-qoute inner) if any quotes detected within the value', function () {
		const test = 'someString"'
		const result = prepValue(test, false, ',')
		expect(result).to.equal('"someString"""')
	})

	it('surround with quotes if any commas detected within the value', function () {
		const test = 'someString,'
		const result = prepValue(test, false, ',')
		expect(result).to.equal('"someString,"')
	})

	it('surround with quotes if any fieldSeparator detected within the value', function () {
		const test = 'someString;'
		const result = prepValue(test, false, ';')
		expect(result).to.equal('"someString;"')
	})

	it('surround with quotes if force quote option is true', function () {
		const test = 'someString'
		const result = prepValue(test, true, ',')
		expect(result).to.equal('"someString"')
	})

	it('should not quote the value if it does not contain field separator nor is forced.', function () {
		const test = 'someString'
		const result = prepValue(test, false, ',')
		expect(result).to.equal('someString')
	})
})
