# json-csv

[![Tests CI](https://github.com/IWSLLC/json-csv/actions/workflows/test.yaml/badge.svg?branch=json-csv)](https://github.com/IWSLLC/json-csv/actions/workflows/test.yaml)

Simple Node.JS CSV export module that can export a rich JSON array of objects to CSV. 

## Update v5
I've decided to consolidate this package under my @iwsio scope as a new package named `@iwsio/json-csv-node`. This was in part inspired by the lack of support for browser due to the streaming API usage like `stream.Readable`.  Version 5 is 100% backwork compatible with v4. You can [read more about it on my blog.](https://iws.io/2022/json-csv-v5) 

[Checkout @iwsio/json-csv-node](https://www.npmjs.com/package/@iwsio/json-csv-node) for the update!

# Usage
## Buffered
```js
const jsoncsv = require('json-csv')

const csv = await jsoncsv.buffered(data, options) //returns Promise

//optionally, you can use the callback
jsoncsv.buffered(data, options, (err, csv) => {...}))
```
 - data: Array of JS objects
 - options: {fields: [], ...}
 - optional callback: returns string result

## Streaming
When using the streaming API, you can pipe data to it in object mode.

```js
const jsoncsv = require('json-csv')

const readable = some_readable_source //<readable source in object mode>
readable
  .pipe(jsoncsv.stream(options)) //transforms to Utf8 string and emits lines
  .pipe(something_else_writable)
})
```


### Options
```js
{
  //field definitions for CSV export
  fields :
  [
    {
      //required: field name for source value
      name: 'string',

      //required: column label for CSV header
      label: 'string',

      //optional: transform value before exporting
      transform: function(value) { return value; }
    }
  ],

  // Other default options:
  fieldSeparator: ","
  ,ignoreHeader: false
  ,encoding: "utf8"
}
```

## Advanced Example
Here, you can see we're using a deeper set of objects for our source data and we're using dot notation in the field definitions. 

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

async function writeCsv() {
  try {
    let result = await csv.buffered(items, options)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

writeCsv()
```

### Output
```
Company,Name,Email,Downloaded,Year,Level
"Widgets, LLC",John Doe,john@widgets.somewhere,pending,2013,Unknown
"Sprockets, LLC",Jane Doe,jane@sprockets.somewhere,downloaded,2013,Test 2
```