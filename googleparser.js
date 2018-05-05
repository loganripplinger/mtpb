//node googleparser.js url term1 term2 term3 term4 term5

//question
//'Harvard Grads'

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
const axios = require('axios');
var serp = require("serp");
 
//terms
// terms = {'Stephen Colbert': 0,'Natalie Portman': 0,"Conan O'Brien": 0}


//connect to url get text as string


async function googleAnswer(question, choices) { 
	var options = {
	  host : "google.com",
	  qs : {
	    q : question
	  },
	  num : 1
	};

	answerCounter = {}
	//seed answerCounter with choices
	choices.forEach(function(choice) {
		answerCounter[choice] = 0
	})
	
	var results = []
	try {
		var webSites = await serp.search(options)
		// console.log(webSites.length)
		for (i = 0; i < webSites.length; i++) {
			results.push(webSites[i].url)
		}
	} catch(e) {
		console.log(e)
	}

	console.log(results)

	for (var i = 0; i < results.length; i++) {
		// console.log(webSites)
		console.log(`first for: ${i}`)
		try {
			var res = await axios.get(results[i]);
			var searchCorpus = res.data		

			for (var j = 0; j < choices.length; j++) {
				console.log(`second for: ${j}, ${choices[j]}`)
				var occurenceCount = countOccurences(searchCorpus, choices[j])
				// We don't have to check if (choice in answerCounter)
				// because we seeded it
				// console.log(`occurenceCount = ${occurenceCount}`)
				answerCounter[choices[j]] += occurenceCount
			}

		} catch(e) {
			console.log(e)
		}
	}	
	console.log(answerCounter)
	return answerCounter
}

function countOccurences(searchCorpus, text) {
	// given a corpus and a text, returns the count of occurences of text within corpus
	var regExp = new RegExp(text, "gi");
	occurenceCount = (searchCorpus.match(regExp) || []).length;
	return occurenceCount
}

// var question = 'Which Girl Scout cookie is covered in chocolate?'
// var choices = ["Tagalongs","Savannah Smiles","Do-si-dos","Trefoils"]
// googleAnswer(question, choices)

module.exports.googleAnswer = googleAnswer;