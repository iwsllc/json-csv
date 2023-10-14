import type { ExportOptions } from '@iwsio/json-csv-core/types'
import nodeStream = require('stream')
import core = require('@iwsio/json-csv-core')

const { buffered: baseBuffered, exporter: { getHeaderRow, getBodyRow, checkOptions: baseCheckOptions } } = core
const { Transform } = nodeStream

export type NodeExportOptions = ExportOptions & { encoding: BufferEncoding }

/**
 * Check the options; ensure defaults. This extends core's check options with new, encoding option for streams.
 * @param opts
 * @returns
 */
export const checkOptions = (opts?: Partial<NodeExportOptions>): NodeExportOptions => {
	const options: Partial<NodeExportOptions> = baseCheckOptions(opts)
	options.encoding = opts.encoding ?? 'utf8'
	return options as NodeExportOptions
}

/**
 * Same as the core's buffered function except this returns a promise for async callers rather than classic callback.
 * @param data Array of objects to be transformed.
 * @param options CSV Options
 * @returns Promise resulting in CSV output
 */
export const buffered = (data: Record<string, any>[], options?: Partial<NodeExportOptions>) => {
	return new Promise<string>((resolve, reject) => {
		try {
			const result = baseBuffered(data, options)
			resolve(result)
		} catch (err) {
			reject(err)
		}
	})
}

/**
 * Creates a transform stream that can be uses to pipe readable objects into for conversion to CSV.
 * @param opts CSV options
 * @returns Tranform stream that converts readable objects to csv string
 */
export const stream = (opts?: Partial<NodeExportOptions>): nodeStream.Transform => {
	let writtenHeader = false
	const options = checkOptions(opts)
	const { ignoreHeader, fields, encoding } = options

	const transformer = new Transform({
		writableObjectMode: true,
		transform(chunk, _encoding, callback) {
			// debug(`incoming chunk: ${require('util').inspect(chunk)}`)
			// debug(encoding)
			if (!writtenHeader && !ignoreHeader) {
				writtenHeader = true
				const header = getHeaderRow(fields, options.fieldSeparator)
				// debug(`writing header ${header}`)
				this.push(header)
			}
			const row = getBodyRow(chunk, fields, options.fieldSeparator)
			// debug(`writing row ${require("util").inspect(row)}`)
			this.push(row)
			callback()
		}
	})
	transformer.setEncoding(encoding)
	return transformer
}
