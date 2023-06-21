import { Transform } from 'stream'
import { buffered as bufferedCore } from '@iwsio/json-csv-core'
import * as exporter from './exporter.cjs'
import type { NodeExportOptions } from './exporter.cjs'
import { StringWriter } from './string-writer.cjs'

export { StringWriter } from './string-writer.cjs'

type StreamCallback = (err?: Error | null, result?: Transform) => void;
type BufferedCallback = (err?: Error | null, result?: string) => void

/**
 * Generate a CSV transform for a stream of objects.
 * @param options Export options
 * @param callback Optional callback for classic style Node. If null or undefined, returns a promise
 * @returns If callback provided, return void; otherwise, returns Transform stream
 */
export const stream = (options: Partial<NodeExportOptions>, callback?: StreamCallback): Transform | void => {
	if (callback == null) return exporter.stream(options)
	callback(null, exporter.stream(options))
}

/**
 * Generate a CSV transform for a stream of objects.
 * @param options Export options
 * @param callback Optional callback for classic style Node. If null or undefined, returns a promise
 * @returns If callback provided, return void; otherwise, returns Transform stream
 */
export const toCsvStream = stream


/**
 * Convert array of objects to CSV in a synchronous operation
 * @param data Array of objects to be transformed
 * @param options CSV Options
 * @returns The result CSV string
 */
export const bufferedSync = bufferedCore

/**
 * Convert array of objects to CSV in a synchronous operation
 * @param data Array of objects to be transformed
 * @param options CSV Options
 * @returns The result CSV string
 */
export const toCsvSync = bufferedSync


/**
 * Convert array of objects to CSV
 * @param data Array of objects to be transformed
 * @param options CSV Options
 * @param callback (optional): If provided, calls back with the result error or CSV string
 * @returns If callback provided, returns void; otherwise, returns a promise of the result CSV string
 */
export const buffered = (data: Record<string, any>[], options: Partial<NodeExportOptions>, callback?: BufferedCallback): Promise<string> | string => {
	if (callback == null) return exporter.buffered(data, options)

	exporter.buffered(data, options)
		.then((result) => callback(null, result))
		.catch((err) => callback(err))
}

/**
 * Convert array of objects to CSV
 * @param data Array of objects to be transformed
 * @param options CSV Options
 * @param callback (optional): If provided, calls back with the result error or CSV string
 * @returns If callback provided, returns void; otherwise, returns a promise of the result CSV string
 */
export const toCsv = buffered

/**
 * @deprecated Please use stream or toCsvStream
 */
export const csv = stream

/**
 * @deprecated Please use buffered or toCsv
 */
export const csvBuffered = buffered

module.exports = {
	buffered,
	bufferedSync,
	stream,
	toCsv,
	toCsvSync,
	toCsvStream,
	StringWriter,
	csv,
	csvBuffered
}

export default {
	buffered,
	bufferedSync,
	stream,
	toCsv,
	toCsvSync,
	toCsvStream,
	StringWriter,
	csv,
	csvBuffered
}