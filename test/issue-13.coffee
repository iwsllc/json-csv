jsoncsv = require '../index'
should = require "should"

describe.skip "Issue 13", ->
  describe "When exporting fields containing literal periods as opposed to object separators", ->
    before (done) ->
      @items = [{
        "website url"   : "http ://www.somewhere.com"
        "phone no."     : "(555) 123-4567"
        "contact person": "JOHN DOE"
        "title"         : "WWW Widgets Association Inc."
        "service area"  : "KANSAS CITY"
        "address"       : "123 MAIN ST KANSAS CITY, MO 64145"
        "hcr_data_url"  : "https://github.com/LocalHousingOrgLists/Profile.aspx?applid=9"
        "email"         : "somebody@github.com"
        "description"   : "The WWW Widgets Association..."
      }]
      @options = [
        {name: 'title', label: 'org name'}
        {name: 'website url', label: 'website'}
        {name: 'email', label: 'email'}
        {name: 'phone no.', label: 'phone'}
        {name: 'contact person', label: 'contact person'}
        {name: 'service area', label: 'service area'}
        {name: 'address', label: 'address'}
        {name: 'hcr_data_url', label: 'hcr url'}
        {name: 'description', label: 'description'}
      ]
      jsoncsv.csvBuffered @items, {fields: @options}, (err, csv) =>
        @csv = csv
        @err = err
        done()

    it "should export correct header row", -> /^org name,website,email,phone,contact person,service area,address,hcr url,description\r\n/.test(@csv).should.be.true()
    it "should export phone field", -> /\(555\) 123-4567/.test(@csv).should.be.true()
    it "should export title field", -> /WWW Widgets Association Inc\./.test(@csv).should.be.true()
    it "should export email field", -> /somebody@github\.com/.test(@csv).should.be.true()
    it "should export contact person field", -> /JOHN DOE/.test(@csv).should.be.true()
    it "should export service area field", -> /KANSAS CITY/.test(@csv).should.be.true()
    it "should export address field", -> /123 MAIN ST KANSAS CITY, MO 64145/.test(@csv).should.be.true()
    it "should export hcr field", -> /https:\/\/github\.com\/LocalHousingOrgLists\/Profile\.aspx\?applid=9/.test(@csv).should.be.true()
    it "should export description field", -> /The WWW Widgets Association\.\.\./.test(@csv).should.be.true()
