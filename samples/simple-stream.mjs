import { stream } from '@iwsio/json-csv-node'
import { Readable } from 'stream'

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
	}]

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

Readable.from(items)
	.pipe(stream(options))
	.pipe(process.stdout)
