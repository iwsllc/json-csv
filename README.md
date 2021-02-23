json-csv
========

[![Build Status](https://travis-ci.com/IWSLLC/json-csv.svg?branch=main)](https://travis-ci.com/IWSLLC/json-csv)

Simple CSV export module that can export a rich JSON array of objects to CSV. 

Usage
-----

### Buffered
```js
const jsoncsv = require('json-csv')
jsoncsv.buffered(data, options) //returns Promise

//optionally, you can use the callback
jsoncsv.buffered(data, options, (err, csv) => {...}))
```
 - data: Array of JS objects
 - options: {fields: [], ...}
 - callback: returns buffered result (see below)

```js
let callback = function(err, csv) {
  //csv contains Utf8 (or encoding of your choice) string of converted data in CSV format.
}
```

### Streaming
When using the streaming API, you can pipe data to it in object mode.

```js
const jsoncsv = require('json-csv')

let readable = some_readable_source //<readable source in object mode>
readable
  .pipe(jsoncsv.stream(options)) //transforms to Utf8 string and emits lines
  .pipe(something_else_writable)

//optionally, you can use the callback
jsoncsv.stream(options, (err, streamToCsv) => {
  readable
    .pipe(streamToCsv) //transforms to Utf8 string and emits lines
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
      name : 'string',

      //required: column label for CSV header
      label : 'string',

      //optional: filter to transform value before exporting
      filter : function(value) { return value; }
    }
  ],

  // Other default options:
  fieldSeparator: ","
  ,ignoreHeader: false
  ,buffered: true
  ,encoding: "utf8"
}
```

Example
-------
Simple structure with basic CSV conversion.

```js
const jsoncsv = require('json-csv')
let items = [
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

jsoncsv.buffered(items, {
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
  (err, csv) => {
    console.log(csv);
  });

//OR Streaming
let options = {
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
Readable.from(items) //node 12
  .pipe(jsoncsv.stream(options))
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
const jsoncsv = require('json-csv')
let items = [
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

jsoncsv.buffered(items, {
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
  function(err, csv) {
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
const fs = require("fs")

let options = {
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
let out = fs.createWriteStream("output.csv", {encoding: 'utf8'})
let readable = Readable.from(items) //node 12
readable
  .pipe(jsoncsv.stream(options))
  .pipe(out)
```



### "OR" || operator for column merging

Example using "OR" || operator to combine two object attributes at once column.

```js
const jsoncsv = require("json-csv");
let items = [
  {
    name: "White Shoes",
    price: 12.10,
    category1: "Apparel",
    category2: "Bottom Apparel",
    category3: "Shoes",
  },
  {
    name: "Grey Pants",
    price: 50.30,
    category1: "Apparel",
    category2: "Bottom Apparel",
    category3: "Pants",
  },
  {
    name: "Black Belt",
    price: 5.30,
    category1: "Apparel",
    category2: "Belts",
  },
  {
    name: "Normal Glasses",
    price: 10.20,
    category1: "Glasses",
  },
  {
    name: "Dark Glasses",
    price: 20.30,
    category1: "",
    category2: "Sunglasses",
  },
]

jsoncsv.buffered(
  items,
  {
    fields: [
      {
        name: "name",
        label: "Name",
      },
      {
        name: "price",
        label: "Price",
      },
      {
        name: "category1||category2||category3",
        label: "Category",
      },
    ],
  }, (err, csv) => {
    console.log(csv);
  }
)
```

Generates Output:

```csv
Name,             Price,  Category
"White Shoes",    12.10,  Shoes
"Grey Pants",     50.30,  Pants
"Black Belt",     10.30,  Belts
"Normal Glasses", 10.20,  Glasses
"Dark Glasses",   20.30,  Sunglasses
```
