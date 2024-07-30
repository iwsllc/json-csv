const jsoncsv = require('@iwsio/json-csv-node')
require('should')

describe('Issue 13', function () {
	describe('When exporting fields containing literal periods as opposed to object separators', function () {
		before(function (done) {
			this.items = [{
				'website url': 'http ://www.somewhere.com',
				'phone no.': '(555) 123-4567',
				'contact person': 'JOHN DOE',
				'title': 'WWW Widgets Association Inc.',
				'service area': 'KANSAS CITY',
				'address': '123 MAIN ST KANSAS CITY, MO 64145',
				'hcr_data_url': 'https://github.com/LocalHousingOrgLists/Profile.aspx?applid=9',
				'email': 'somebodythis.github.com',
				'description': 'The WWW Widgets Association...'
			}]
			this.options = [
				{ name: 'title', label: 'org name' },
				{ name: 'website url', label: 'website' },
				{ name: 'email', label: 'email' },
				{ name: 'phone no.', label: 'phone' },
				{ name: 'contact person', label: 'contact person' },
				{ name: 'service area', label: 'service area' },
				{ name: 'address', label: 'address' },
				{ name: 'hcr_data_url', label: 'hcr url' },
				{ name: 'description', label: 'description' }
			]
			jsoncsv.toCsv(this.items, { fields: this.options }, (err, csv) => {
				this.csv = csv
				this.err = err
				done()
			})
		})
		it('should export correct header row', function () { /^org name,website,email,phone,contact person,service area,address,hcr url,description\r\n/.test(this.csv).should.be.true() })
		it('should NOT export phone field because periods in names is a known issue.', function () { /\(555\) 123-4567/.test(this.csv).should.be.false() })
		it('should export title field', function () { /WWW Widgets Association Inc\./.test(this.csv).should.be.true() })
		it('should export email field', function () { /somebodythis.github\.com/.test(this.csv).should.be.true() })
		it('should export contact person field', function () { /JOHN DOE/.test(this.csv).should.be.true() })
		it('should export service area field', function () { /KANSAS CITY/.test(this.csv).should.be.true() })
		it('should export address field', function () { /123 MAIN ST KANSAS CITY, MO 64145/.test(this.csv).should.be.true() })
		it('should export hcr field', function () { /https:\/\/github\.com\/LocalHousingOrgLists\/Profile\.aspx\?applid=9/.test(this.csv).should.be.true() })
		it('should export description field', function () { /The WWW Widgets Association\.\.\./.test(this.csv).should.be.true() })
	})
})
