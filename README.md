json-csv
========

[![Tests CI](https://github.com/IWSLLC/json-csv/actions/workflows/test.yaml/badge.svg)](https://github.com/IWSLLC/json-csv/actions/workflows/test.yaml)

Simple CSV export module that can export a rich JSON array of objects to CSV. 

## Update `4.0.0`
I decided to update this repo and drop unnecessary code. Version `3.0.1` already was constrained to Node v6; but by breaking some eggs and moving to >= v10, I'm able to drop some dependencies and remove some unnecessary code (i.e. buffered-reader -> Readable.from). I decided to bump the major version with this breaking change. The API itself hasn't changed at all and still works as-is.

# Usage
## Buffered
```js
const jsoncsv = require('json-csv')

let csv = await jsoncsv.buffered(data, options) //returns Promise

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

let readable = some_readable_source //<readable source in object mode>
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

      //optional: filter to transform value before exporting
      filter: function(value) { return value; }
    }
  ],

  // Other default options:
  fieldSeparator: ","
  ,ignoreHeader: false
  ,encoding: "utf8"
}
```

# Examples

## Given these items and options: 

```javascript
let items = [
  {
    name: 'fred',
    email: 'fred@somewhere',
    amount: 1.02,
  },
  {
    name: 'jo',
    email: 'jo@somewhere',
    amount: 1.02,
  },
  {
    name: 'jo with a comma,',
    email: 'jo@somewhere',
    amount: 1.02,
  },
  {
    name: 'jo with a quote"',
    email: 'jo@somewhere',
    amount: 1.02,
  }]

let options = {
  fields: [
    {
      name: 'name',
      label: 'Name',
      quoted: true,
    },
    {
      name: 'email',
      label: 'Email',
    },
    {
      name: 'amount',
      label: 'Amount',
    },
  ],
}
```

## Buffered

This method will take an array of data and convert it into a CSV string all in runtime memory. This works well for small amounts of data.

```javascript
const jsoncsv = require('json-csv')
async function writeCsv() {
  try {
    let csv = await jsoncsv.buffered(items, options)
    console.log(csv)
  } catch (err) {
    console.error(err)
  }
}

writeCsv()
```

## Streamed

Here, we want to pipe data from a source to the converter, write the headers and then pipe it to an output (one row at a time). This works really well for large amounts of data like exporting from a MongoDb query directly. 


```javascript
const jsoncsv = require('json-csv')
const {Readable} = require('stream')

Readable.from(items)
  .pipe(csv.stream(options))
  .pipe(process.stdout)
```

## Output

```
Name,Email,Amount
"fred",fred@somewhere,1.02
"jo",jo@somewhere,1.02
"jo with a comma,",jo@somewhere,1.02
"jo with a quote""",jo@somewhere,1.02
```


## Advanced Example

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
      name: 'contact.company',
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