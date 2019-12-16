const csv    = require('../index')
const concat = require("concat-stream")
const bufferReader = require("../buffer-reader")

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

bufferReader(items)
  .pipe(csv.stream(options))
  .pipe(process.stdout)
