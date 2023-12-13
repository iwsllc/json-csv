# json-csv

[![Push to json-csv (legacy)](https://github.com/iwsllc/json-csv/actions/workflows/push-json-csv.yml/badge.svg)](https://github.com/iwsllc/json-csv/actions/workflows/push-json-csv.yml)

This is a Node.JS package that can transorm data to CSV. I originally built this back in the 2014 (in the Node v0.10 days). We've come a long way, and it still works! So I won't be deprecating this until it can no longer function in active LTS versions of Node.JS. As LTS versions of Node.JS release, I'll keep this test pipeline up to date.

However, this version of the package (json-csv), 4.x is in maintenance mode and will only receive critical updates and occasionally tooling updates. For more recent improvements like ESM, Typescript support, etc, please refer to [@iwsio/json-csv-node](https://www.npmjs.com/package/@iwsio/json-csv-node) for the latest, active version of this package. It shares an identical API with this one and should be pretty seamless to replace.

If you need just a buffered CSV that works in browser apps, checkout the core project [@iwsio/json-csv-core](https://www.npmjs.com/package/@iwsio/json-csv-core). It supports everything except Node Stream API.

## [@iwsio/json-csv-node](https://www.npmjs.com/package/@iwsio/json-csv-node) v6 - June 2023
The latest version 6 just released in June 2023 and includes better type definitions along with ESM & CommonJS support. [Read more about it on the v6 blog post.](https://iws.io/2023/json-csv-v6)

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