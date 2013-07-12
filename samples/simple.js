var csv = require('../json-csv')
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