json-csv
========

Simple CSV export module that can export a rich JSON array of objects to CSV. 


Example
-------
Simple structure with basic CSV conversion. 

```
var csv = require('json-csv')
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
  }]

csv.toCSV({
  data : items,
  fields : [ 
    {
        name : 'name',
        label : 'Name'
    },
    {
        name : 'email',
        label : 'Email'
    }
  ]},
  function(err,csv) {
    console.log(csv);
  });
```

``` output
Name,Email
fred,fred@somewhere
jo,jo@somewhere
"jo with a comma,",jo@somewhere
```

Here's a little more advanced sample that uses sub-structures and a filter for manipulating output for individual columns. 

```
var csv = require('json-csv')
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

csv.toCSV({
  data : items,
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

``` output
Company,Name,Email,Year,Level
"Widgets, LLC",John Doe,john@widgets.somewhere,2013,Unknown
"Sprockets, LLC",Jane Doe,jane@sprockets.somewhere,2013,Test 2
```