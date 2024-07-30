const { buffered } = require('../../packages/json-csv-core/dist/exporter')

describe('buffered', function () {
	describe('buffered simple data with default options', function () {
		before(function () {
			const options = {
				fields: [
					{ name: 'name', label: 'Name', transform: v => `${v != null ? v : ''}`.toUpperCase() },
					{ name: 'age', label: 'Age' }
				]
			}
			this.source = [
				{ name: 'fred', age: 14 },
				{ name: 'george', age: 24 },
				{ name: 'frank', age: 53 },
				{ name: 'susie', age: 43 },
				{ name: null, age: 44 },
				{ age: 45 },
				{ name: 'Test,Test', age: 43 },
				null
			]
			this.result = buffered(this.source, options)
		})
		it('should have the correct output', function () {
			expect(this.result).to.equal('Name,Age\r\nFRED,14\r\nGEORGE,24\r\nFRANK,53\r\nSUSIE,43\r\n,44\r\n,45\r\n"TEST,TEST",43\r\n,\r\n')
		})
	})
})
