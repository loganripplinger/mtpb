//node googleparser.js url term1 term2 term3 term4 term5

//question
//Harvard Grads

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



//connect to url get text as string

const https = require('https');

websiteurl = 'https://stackoverflow.com/questions/6287297/reading-content-from-url-with-node-js'
 
https.get(websiteurl, (resp) => {
  let data = '';
 
  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });
 
  // The whole response has been received. Print out the result.
  resp.on('end', () => {
    console.log(`Got data from ${websiteurl}`);

    var text = data.toString().toLowerCase()

    countTerms_split(text)
    countTerms_regex(text)

  });
 
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
 
// console.log( data.toString() );

// var websitetext = "This is a string.";

terms = ['javascript', 'java', 'programming', 'heroin']

function countTerms_split(text) {
	//counts via split
	terms.forEach(function(term) {
		count = text.split(term).length - 1; //should output '2'
		console.log(`${term}: ${count}`)
	});
}

function countTerms_regex(text) {
	terms.forEach(function(term) {
		var regExp = new RegExp(term, "gi");
  		console.log((text.match(regExp) || []).length);
	});
}
