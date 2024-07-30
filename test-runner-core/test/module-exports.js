/// <reference types="../../packages/json-csv-core/dist" />

const buffered_index = require('../../packages/json-csv-core/dist')
const direct_default = require('../../packages/json-csv-core/dist/exporter')

const { buffered: index_named, toCsv } = buffered_index
const { buffered: direct_named, toCsv: direct_toCsv } = direct_default

describe('module exports', function () {
	it('index named export should exist', function () { expect(index_named).to.be.a('function') })
	it('toCsv named export should exist', function () { expect(toCsv).to.be.a('function') })
	it('index default export should be a func', function () { expect(buffered_index.default).to.be.a('function') })
	it('index default export should work', function () {
		const result = buffered_index.default([{ name: 'test' }], { fields: [{ name: 'name', label: 'Name' }] })
		expect(result).to.eq('Name\r\ntest\r\n')
	})
	it('direct default export should be a func', function () { expect(direct_default.default).to.be.a('function') })
	it('direct named export should exist', function () { expect(direct_named).to.be.a('function') })
	it('direct toCsv export should exist', function () { expect(direct_toCsv).to.be.a('function') })
})
