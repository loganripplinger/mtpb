//node googleparser.js url term1 term2 term3 term4 term5

//question
var question = 'Harvard Grads'

//urls
//https://www.cnbc.com/2016/09/14/10-of-the-most-famous-harvard-grads--and-dropouts--of-modern-time.html
//https://en.wikipedia.org/wiki/List_of_Harvard_University_people
//http://www.businessinsider.com/30-most-famous-harvard-students-of-all-time-2010-4
//http://www.businessinsider.com/10-richest-harvard-grads-2017-7
//http://www.vault.com/blog/admit-one-vaults-mba-law-school-and-college-blog/heres-where-harvard-grads-will-be-working-next-year


//terms
//Stephen Colbert
//Natalie Portman
//Conan O’Brien


urls = [
'https://www.cnbc.com/2016/09/14/10-of-the-most-famous-harvard-grads--and-dropouts--of-modern-time.html',
'https://en.wikipedia.org/wiki/List_of_Harvard_University_people',
'https://www.businessinsider.com/30-most-famous-harvard-students-of-all-time-2010-4',
'https://www.businessinsider.com/10-richest-harvard-grads-2017-7',
'https://www.vault.com/blog/admit-one-vaults-mba-law-school-and-college-blog/heres-where-harvard-grads-will-be-working-next-year'
]

//terms
// terms = {'Stephen Colbert': 0,'Natalie Portman': 0,"Conan O'Brien": 0}
terms = ['Stephen Colbert','Natalie Portman',"Conan O'Brien"]

var counter = {}

//connect to url get text as string


var google = require('google')

google.resultsPerPage = 5

google(question, function(err,res) {
	if (err) console.log(err)

	for (var i = 0; i < res.links.length; i++) {
		countTermsUrl(res.links[i].link)
	}


})

var request = require('request-promise');

function countTermsUrl(url) {
	console.log(url)
	request(url).then(function(body) {
		
		// console.log(body)
		countTerms_regex(body)		// console.log(body)
	}) 
}

function countTerms_regex(text) {
	terms.forEach(function(term) {
		var regExp = new RegExp(term, "gi");
  		count = (text.match(regExp) || []).length;
  		console.log(counter[term])
  		counter[term] =+ count
	});
	console.log(counter)
}
