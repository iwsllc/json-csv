const csv = require('../src/index')
const { Readable } = require('stream')

let items = [
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
	}]

let options = {
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

Readable.from(items)
	.pipe(csv.stream(options))
	.pipe(process.stdout)
