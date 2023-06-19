import { StringWriter } from './string-writer.cjs'

export { StringWriter } from './string-writer.cjs'

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
export default StringWriter