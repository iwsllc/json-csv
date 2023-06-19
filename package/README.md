# @iwsio/json-csv-node

[![Tests CI](https://github.com/IWSLLC/json-csv/actions/workflows/test.yaml/badge.svg)](https://github.com/IWSLLC/json-csv/actions/workflows/test.yaml)

This package extends [@iwsio/json-csv-core](https://www.npmjs.com/package/@iwsio/json-csv-core) specifically targeting Node.JS to support streaming. It's all the same code as before, just moved around. You can [read more about it on my blog.](https://iws.io/2022/json-csv-v5)

# Usage
## Buffered (Converts to CSV with an in-memory data source)
```js
const { toCsv, toCsvSync } = require('@iwsio/json-csv-node') // CJS
import { toCsv, toCsvSync } from '@iwsio/json-csv-node' // ESM

// as a promise
const csv = await toCsv(data, options) // toCsv returns Promise<string>

// optionally, you can use a classic callback instead
toCsv(data, options, function(err, csv) {...}))

// synchronous
const csv = toCsvSync(data, options) // toCsvSync returns string
```
 
## Streaming (Converts a "row at a time" from a stream source)
When using the streaming API, you can pipe data to it in object mode.

```js
const { toCsvStream } = require('@iwsio/json-csv-node') // CJS
import { toCsvStream } from '@iwsio/json-csv-node' // ESM

const things = [
  {name: 'thing1', age: 20},
  {name: 'thing2', age: 30},
  {name: 'thing3', age: 45}
]
Readable.from(things) // <readable source in object mode>
  .pipe(toCsvStream(options)) // transforms to string and emits lines
  .pipe(process.stdout) // anything Writable


// toCsvStream(options) supports classic callback (for backwards compatibility)
toCsvStream(options, (err, transform) => {
  Readable.from(things)
    .pipe(toCsvStream(options))
})
```

### NOTE: All the aliases from previous versions remain intact.

I renamed this API mostly for cosmetics and to cleanup named exports for ES Modules. It made more sense to me to `import { toCSV } from 'json-csv'` rather than importing the default and calling its prop. (I've been doing a lot of Typescript lately). But all the original versions are kept intact and tests are in place to assert they work.

```js
const jsonCsv = require('@iwsio/json-csv-node') // CJS
import jsonCsv, { toCSV, toCsvStream, buffered, stream } from '@iwsio/json-csv-node' // ESM

jsonCsv.buffered // buffered (promise or callback)
jsonCsv.bufferedSync // buffered synchronous (passthrough from core)
jsonCsv.stream // stream (or callback w/ stream)

jsonCsv.toCsv // buffered, returns promise, callback optional
jsonCsv.toCsvSync // buffered synchronous (passthrough from core)
jsonCsv.toCsvStream // stream, returns stream, callback optional

// These are deprecated
jsonCsv.csv // alias to toCsvStream (streamed)
jsonCsv.csvBuffered // alias to toCsv (buffered)
```


## Options
```js
{
  // field definitions for CSV export
  fields :
  [
    {
      // required: field name for source value
      name: 'string',

      // optional: column label for CSV header
      label: 'string',

      // optional: transform value before exporting
      transform: function(value) { return value; }
    }
  ],

  // Other default options:
  fieldSeparator: ",",
  ignoreHeader: false
}
```

## Advanced Example
Here, you can see we're using a deeper set of objects for our source data, and we're using dot notation in the field definitions like: `contact.name` for the contact name. 

```javascript
const items = [
  {
    downloaded: false,
    contact: {
      company: 'Widgets, LLC',
      name: 'John Doe',
      email: 'john@widgets.somewhere',
    },
    registration: {
      year: 2013,
      level: 3,
    },
  },
  {
    downloaded: true,
    contact: {
      company: 'Sprockets, LLC',
      name: 'Jane Doe',
      email: 'jane@sprockets.somewhere',
    },
    registration: {
      year: 2013,
      level: 2,
    },
  },
]
const options = {
  fields: [
    {
      name: 'contact.company', // uses dot notation
      label: 'Company',
    },
    {
      name: 'contact.name',
      label: 'Name',
    },
    {
      name: 'contact.email',
      label: 'Email',
    },
    {
      name: 'downloaded',
      label: "Downloaded",
      transform: (v) => v ? 'downloaded' : 'pending',
    },
    {
      name: 'registration.year',
      label: 'Year',
    },
    {
      name: 'registration.level',
      label: 'Level',
      transform: (v) => {
        switch (v) {
          case 1: return 'Test 1'
          case 2: return 'Test 2'
          default: return 'Unknown'
        }
      },
    },
  ],
}

(async () => {
  let result = await toCsv(items, options)
  console.log(result)
})()

// OR synchronous

(() => {
  let result = toCsvSync(items, options)
  console.log(result)
})()
```

### Output
```
Company,Name,Email,Downloaded,Year,Level
"Widgets, LLC",John Doe,john@widgets.somewhere,pending,2013,Unknown
"Sprockets, LLC",Jane Doe,jane@sprockets.somewhere,downloaded,2013,Test 2
```