import { toCsv } from '@iwsio/json-csv-node'

const items = [
	{
		downloaded: false,
		contact: {
			company: 'Widgets, LLC',
			name: 'John Doe',
			email: 'john@widgets.somewhere'
		},
		registration: {
			year: 2013,
			level: 3
		}
	},
	{
		downloaded: true,
		contact: {
			company: 'Sprockets, LLC',
			name: 'Jane Doe',
			email: 'jane@sprockets.somewhere'
		},
		registration: {
			year: 2013,
			level: 2
		}
	}
]
const options = {
	fields: [
		{
			name: 'contact.company',
			label: 'Company'
		},
		{
			name: 'contact.name',
			label: 'Name'
		},
		{
			name: 'contact.email',
			label: 'Email'
		},
		{
			name: 'downloaded',
			label: 'Downloaded',
			transform: v => v ? 'downloaded' : 'pending'
		},
		{
			name: 'registration.year',
			label: 'Year'
		},
		{
			name: 'registration.level',
			label: 'Level',
			transform: function (value) {
				switch (value) {
					case 1: return 'Test 1'
					case 2: return 'Test 2'
					default: return 'Unknown'
				}
			}
		}
	]
}

async function writeCsv() {
	try {
		const result = await toCsv(items, options)
		console.log(result)
	} catch (err) {
		console.error(err)
	}
}

writeCsv()
