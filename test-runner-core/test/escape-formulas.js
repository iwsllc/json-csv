const { buffered, escapeFormula } = require('../../packages/json-csv-core/dist/exporter')

describe('escapeFormulas', function () {
	describe('escapeFormula', function () {
		it('prefixes a quote to each formula trigger', function () {
			for (const value of ['=SUM(A1:A2)', '+1+1', '-1+1', '@cmd', '\tx', '\rx']) {
				expect(escapeFormula(value)).to.equal(`'${value}`)
			}
		})

		it('leaves plain numbers alone, including negatives and decimals', function () {
			for (const value of ['-1234.56', '+5', '42', '-0.5']) {
				expect(escapeFormula(value)).to.equal(value)
			}
		})

		it('leaves ordinary text alone', function () {
			expect(escapeFormula('Acme = Co')).to.equal('Acme = Co')
			expect(escapeFormula('')).to.equal('')
		})
	})

	describe('buffered', function () {
		const fields = [{ name: 'name' }, { name: 'amount' }]
		const source = [{ name: '=HYPERLINK("http://x","y")', amount: -12.5 }]

		it('does not escape by default', function () {
			expect(buffered(source, { fields })).to.equal('name,amount\r\n"=HYPERLINK(""http://x"",""y"")",-12.5\r\n')
		})

		it('escapes formulas but not numbers when enabled, and still quotes', function () {
			expect(buffered(source, { fields, escapeFormulas: true })).to.equal('name,amount\r\n"\'=HYPERLINK(""http://x"",""y"")",-12.5\r\n')
		})

		it('escapes before forced quoting', function () {
			const result = buffered([{ name: '@x' }], { fields: [{ name: 'name', quoted: true }], escapeFormulas: true })
			expect(result).to.equal('"name"\r\n"\'@x"\r\n')
		})

		it('applies after transform', function () {
			const result = buffered([{ name: 'x' }], { fields: [{ name: 'name', transform: v => `=${v}` }], escapeFormulas: true })
			expect(result).to.equal('name\r\n\'=x\r\n')
		})
	})
})
