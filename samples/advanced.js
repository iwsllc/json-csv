// var csv = require('../index')
// var items = [
//   {
//     downloaded : false,
//     contact : {
//       company : 'Widgets, LLC',
//       name : 'John Doe',
//       email : 'john@widgets.somewhere'
//     },
//     registration : {
//       year : 2013,
//       level : 3
//     }
//   },
//   {
//     downloaded : false,
//     contact : {
//       company : 'Sprockets, LLC',
//       name : 'Jane Doe',
//       email : 'jane@sprockets.somewhere'
//     },
//     registration : {
//       year : 2013,
//       level : 2
//     }
//   }
// ];
//
// csv.csvBuffered(items, {
//   fields : [
//     {
//       name : 'contact.company',
//       label : 'Company'
//     },
//     {
//       name : 'contact.name',
//       label : 'Name'
//     },
//     {
//       name : 'contact.email',
//       label : 'Email'
//     },
//     {
//       name : 'registration.year',
//       label : 'Year'
//     },
//     {
//       name : 'registration.level',
//       label : 'Level',
//       filter : function(value) {
//         switch(value) {
//           case 1 : return 'Test 1'
//           case 2 : return 'Test 2'
//           default : return 'Unknown'
//         }
//       }
//     }]
//   },
//   function(err,csv) {
//     console.log(csv);
//   });
