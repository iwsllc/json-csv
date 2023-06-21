const jsonCsv = require('@iwsio/json-csv-node')

const items = [
  {
    name: 'fred',
    email: 'fred@somewhere',
    amount: 1.02
  },
  {
    name: 'jo',
    email: 'jo@somewhere',
    amount: 1.02
  },
  {
    name: 'jo with a comma,',
    email: 'jo@somewhere',
    amount: 1.02
  },
  {
    name: 'jo with a quote"',
    email: 'jo@somewhere',
    amount: 1.02
  }
]

const options = {
  fields: [
    {
      name: 'name',
      label: 'Name',
      quoted: true
    },
    {
      name: 'email',
      label: 'Email'
    },
    {
      name: 'amount',
      label: 'Amount'
    }
  ]
}

async function writeCsv() {
  try {
    const result = await jsonCsv.buffered(items, options)
    console.log(result)
  } catch (err) {
    console.error(err)
  }
}

writeCsv()
