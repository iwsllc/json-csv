json-csv
========

[![Build status](https://travis-ci.org/IWSLLC/json-csv.svg?branch=master)](https://travis-ci.org/IWSLLC/json-csv)

Simple CSV export module that can export a rich JSON array of objects to CSV.

Usage
-----

### Buffered
```js
var jsoncsv = require('json-csv')

jsoncsv.csvBuffered(data, options, callback)
```

 - data : Array of JS objects
 - callback : returns buffered result (see below)

```js
var callback = function(err,csv) {
  //csv contains string of converted data in CSV format.
}
```

### Streaming
When using the streaming API, you'll need to also stream data into it.

```js
var jsoncsv = require('json-csv')

var readable_source = <something readable that emits data row by row>
readable_source
  .pipe(jsoncsv.csv(options))
  .pipe(something_else_writable)
```


### Options
```js
{
  //field definitions for CSV export
  fields :
  [
    {
      //required: field name for source value
      name : 'string',

      //required: column label for CSV header
      label : 'string',

      //optional: filter to transform value before exporting
      filter : function(value) { return value; }
    }
  ],
  // use a different field separator char
  fieldSeparator : ';'
}
```

Example
-------
Simple structure with basic CSV conversion.

```js
var jsoncsv = require('../json-csv')
var items = [
  {
    name : 'fred',
    email : 'fred@somewhere',
    amount : 1.02
  },
  {
    name : 'jo',
    email : 'jo@somewhere',
    amount : 1.02
  },
  {
    name : 'jo with a comma,',
    email : 'jo@somewhere',
    amount : 1.02
  },
  {
    name : 'jo with a quote"',
    email : 'jo@somewhere',
    amount : 1.02
  }]

jsoncsv.csvBuffered(items, {
  fields : [
    {
        name : 'name',
        label : 'Name',
        quoted : true
    },
    {
        name : 'email',
        label : 'Email'
    },
    {
        name : 'amount',
        label : 'Amount'
    }
  ]},
  function(err,csv) {
    console.log(csv);
});

//OR Streaming
var options = {
  fields : [
    {
        name : 'name',
        label : 'Name',
        quoted : true
    },
    {
        name : 'email',
        label : 'Email'
    },
    {
        name : 'amount',
        label : 'Amount'
    }
  ]}
var source = es.readArray(items)
source
  .pipe(jsoncsv.csv(options))
  .pipe(process.stdout)
```

Generates Output:
```csv
Name,Email,Amount
"fred",fred@somewhere,1.02
"jo",jo@somewhere,1.02
"jo with a comma,",jo@somewhere,1.02
"jo with a quote""",jo@somewhere,1.02
```

Here's a little more advanced sample that uses sub-structures and a filter for manipulating output for individual columns.

```js
var jsoncsv = require('json-csv')
var items = [
  {
    contact : {
      company : 'Widgets, LLC',
      name : 'John Doe',
      email : 'john@widgets.somewhere'
    },
    registration : {
      year : 2013,
      level : 3
    }
  },
  {
    contact : {
      company : 'Sprockets, LLC',
      name : 'Jane Doe',
      email : 'jane@sprockets.somewhere'
    },
    registration : {
      year : 2013,
      level : 2
    }
  }
];

jsoncsv.csvBuffered(items, {
  fields : [
    {
      name : 'contact.company',
      label : 'Company'
    },
    {
      name : 'contact.name',
      label : 'Name'
    },
    {
      name : 'contact.email',
      label : 'Email'
    },
    {
      name : 'registration.year',
      label : 'Year'
    },
    {
      name : 'registration.level',
      label : 'Level',
      filter : function(value) {
        switch(value) {
          case 1 : return 'Test 1'
          case 2 : return 'Test 2'
          default : return 'Unknown'
        }
      }
    }]
  },
  function(err,csv) {
    console.log(csv);
  });
```

Generates Output:
```csv
Company,Name,Email,Year,Level
"Widgets, LLC",John Doe,john@widgets.somewhere,2013,Unknown
"Sprockets, LLC",Jane Doe,jane@sprockets.somewhere,2013,Test 2
```

Pipe to File (Using example above):
```js
var fs = require("fs")
var es = require("event-stream")

var options = {
  fields : [
    {
      name : 'contact.company',
      label : 'Company'
    },
    {
      name : 'contact.name',
      label : 'Name'
    },
    {
      name : 'contact.email',
      label : 'Email'
    },
    {
      name : 'registration.year',
      label : 'Year'
    },
    {
      name : 'registration.level',
      label : 'Level',
      filter : function(value) {
        switch(value) {
          case 1 : return 'Test 1'
          case 2 : return 'Test 2'
          default : return 'Unknown'
        }
      }
    }]
  }
var out = fs.createWriteStream("output.csv", {encoding: 'utf8'})
var readable = es.readArray(items)
readable
  .pipe(jsoncsv.csv(options))
  .pipe(out)
```
