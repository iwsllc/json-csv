import { Writable, WritableOptions } from 'stream'
import { StringDecoder } from 'string_decoder'

/**
 * This is a writable stream that encodes data to an internal buffered string. It's pulled from Node14 docs and used as a test utility here.
 * Ex:
 * ```
 * const writer = new StringWriter({defaultEncoding: 'utf8'})
 * Readable.from(['1', '2', '3']).pipe(writer).finish(() => { console.log(writer.data) })
 * '123'
 * ```
 * See: https://nodejs.org/docs/latest-v14.x/api/stream.html#stream_decoding_buffers_in_a_writable_stream
 */
export default class StringWriter extends Writable {
	_decoder: StringDecoder
	data: string
	constructor(options?: WritableOptions) {
		super(options)
		this._decoder = new StringDecoder(options?.defaultEncoding ?? 'utf8')
		this.data = ''
	}

	_write(chunk: Buffer | string, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
		if (encoding != null) {
			chunk = this._decoder.write(chunk)
		}
		this.data += chunk
		callback()
	}

	_final(callback: (error?: Error | null) => void) {
		this.data += this._decoder.end()
		callback()
	}
}

export { StringWriter }
