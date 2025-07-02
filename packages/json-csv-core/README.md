# @iwsio/json-csv-core

[![Push to main - @iwsio/json-csv-core](https://github.com/iwsllc/json-csv/actions/workflows/push-core.yml/badge.svg)](https://github.com/iwsllc/json-csv/actions/workflows/push-core.yml)

Simple CSV export module that can export an array of JSON objects to CSV. This core library will focus on the buffered, single object conversion to CSV and is built for node and browser. You can [read more about it and see a live example on my blog.](https://iws.io/2023/json-csv-v6) 

## Getting Started

### Install
```bash
npm i @iwsio/json-csv-core
```

### Import with named or default exports.
```es6
import { toCsv } from '@iwsio/json-csv-core'
import toCsv from '@iwsio/json-csv-core'
```

### In Typescript, `toCsv` is defined as:
```typescript
declare function toCsv(data: Record<string, unknown>[], opts: Partial<ExportOptions>): string;
```

## Example
```es6
import { toCsv } from '@iwsio/json-csv-core'

const data = [
  {
    field1: 'test',
    field2: 123,
    thing: {
      field3: true,
      field4: 'test'
    }
  },
  {field1: 'test', field2: 123, thing: { field3: true, field4: 'test'}},
  {field1: 'test', field2: 123, thing: { field3: false, field4: 'test'}},
  {field1: 'test', field2: 123, thing: { field3: true, field4: 'test'}}
]

const options = {
  fields: [
    {name: 'field1'}, // regular field by name
    {name: 'field2'},
    
    // using dot notation, we can specify which value to use.
    // provide a transform if you want the value to be modified for output.
    {name: 'thing.field3', label: 'field3', transform: (v) => v ? 'yes' : 'no'},
    {name: 'thing.field4', label: 'field4'},
  ]
}
const csv = toCsv(data, options)
```
```csv
field1,field2,field3,field4
test,123,yes,test
test,123,yes,test
test,123,no,test
test,123,yes,test
```

## Options
```js
{
  //field definitions for CSV export
  fields: [
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
  fieldSeparator: ',',
  ignoreHeader: false
}
```
