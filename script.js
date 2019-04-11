// functions
// shuffle an array in place
function shuffle(a) {
	var j, x, i
	for (i = a.length; i; i -= 1) {
		j = Math.floor(Math.random() * i)
		x = a[i - 1]
		a[i - 1] = a[j]
		a[j] = x
	}
}

// get a list of random, unique indexes
function getIndexes(count, total) {
	var i = 0
	var result = []
	while (i < count) {
		x = Math.floor((Math.random() * total) + 1)
		if (result.indexOf(x) == -1) {
			result.push(x)
			i++
		}
	}
	return result
}

// find an item in similars that is not in already_used
// starts at the origin index and make its way in both directions
function find_similar(origin, similars, already_used) {
	for (var i = 0; i < (similars.length / 2 + 1); i++) {
		candidate = similars[(origin + i) % similars.length]
		// include only if it is not already included
		if (already_used.indexOf(candidate) == -1) {
			return candidate
		}
		candidate = similars[(origin - i) % similars.length]
		// include only if it is not already included
		if (already_used.indexOf(candidate) == -1) {
			return candidate
		}
	}
	return false
}

// settings
study_id = 1
form_url = "https://getform.io/f/077906f4-02f3-4907-98ca-193c3f1600cc"
// typefaces used
// the first in the pair is for lexical, the second for recognition
typefaces = [["sansforgetica", "sansforgetica"], ["arial", "arial"]]
shuffle(typefaces)

// group words and non-words by their first letter
var grouped = [{}, {}]
for (var j = 0; j < 2; j++) {
	for (var i = 0; i < source[j].length; i++) {
		w = source[j][i]
		letter = w[0]
		if (letter in grouped[j]) {
			grouped[j][letter].push(w)
		} else {
			grouped[j][letter] = [w]
		}
	}
}

// generate 2 x 10 random words and 2 x 10 non-words
lexical_total = 10
var random = [getIndexes(2 * lexical_total, source[0].length), getIndexes(2 * lexical_total, source[1].length)]  // 0: words, 1: non-words
var lexical = [[], []]
var recognition = [[], []]
var all_samples = []
// for each sequence
for (var t = 0; t < 2; t++) {
	// for words and non-words
	for (var j = 0; j < 2; j++) {
		match_samples = []
		// lexical tasks: add 10 randomly selected samples
		for (var i = 0; i < lexical_total; i++) {
			x = random[j][t * lexical_total + i]
			w = source[j][x]
			what = ["word", "non-word"][j]
			// add to lexical task
			lexical[t].push([what, w])
			// add first 4 to the recognition task
			if (i < 4) {
				recognition[t].push([what, w, "seen", w])
			}
			else {
				match_samples.push(w)
			}
			all_samples.push(w)
		}
		// add foils to the recognition task
		// 4 samples that have the same first letter
		// as those that are not included in the recognition task already
		for (var i = 0; i < 4; i++) {			
			candidate = false
			letter = match_samples[i][0]
			while (!candidate) {
				similars = grouped[j][letter]
				origin = similars.indexOf(match_samples[i])
				candidate = find_similar(origin, similars, all_samples)
				letter = String.fromCharCode(letter.charCodeAt(0) + 1)
			}
			recognition[t].push([what, candidate, "non-seen", match_samples[i]])
			all_samples.push(candidate)
		}
	}
}

var counter = 0
var totalwords = lexical[0].length + recognition[0].length + lexical[1].length + recognition[1].length

// compile the forms

// set url of the form to submit to
var form = $("form")
form.attr("action", form_url)

// add a series of samples/fieldsets for the lexical decision task
fs = $("#practice")
// but first record the study ID
fs.append('<input type="hidden" name="studyid" id="studyid" value="' + study_id + '"">')
typeface = "timesnewroman"
totalpractice = 3
source_practice.forEach(function (sample, index, array) {
	type = "practice"
	trialID =  "practice_" + (index + 1)
	// create fieldset for a word
	fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>Practice: is this a word or a non-word?</h2></fieldset>')
	fs = $("#fs_" + trialID)
	wordSVGURL = "samples/" + type + "/" + typeface + "/" + sample + ".svg"
	fs.append('<div class="trialarea">' +
			  '<div class="sample"><img src="' +  wordSVGURL + '" alt=""></div>' +
		      '<input type="button" class="next button" value="Sure word">' +
		      '<input type="button" class="next button" value="Probably word">' +
		      '<input type="button" class="next button" value="Probably non-word">' +
		      '<input type="button" class="next button right" value="Sure non-word">' +
		      '</div>')

	// progress bar
	fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(counter / totalpractice * 100) + '%"></div></div>')
	counter += 1
})

counter = 0

for (var i = 0; i < 2; i++) {
	typeface = typefaces[i]
	lexical_samples = lexical[i]
	recognition_samples = recognition[i]

	// shuffle the samples to mix words and non-words
	shuffle(lexical_samples)
	shuffle(recognition_samples)

	// add a series of samples/fieldsets for the lexical decision task
	fs = $("#test_" + (i + 1) + "_lexical")
	lexical_samples.forEach(function (tuple, index, array) {
		type = tuple[0]
		sample = tuple[1]
		trialID =  "test_" + (i + 1) + "_lexical_" + (index + 1)
		// create fieldset for a word
		fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>First part: is this a word or a non-word?</h2></fieldset>')
		fs = $("#fs_" + trialID)
		wordSVGURL = "samples/" + type + "/" + typeface[0] + "/" + sample + ".svg"
		fs.append('<div class="trialarea">' +
				  '<div class="sample"><img src="' +  wordSVGURL + '" alt=""></div>' +
				  '<input type="button" class="next button" value="Sure word">' +
				  '<input type="button" class="next button" value="Probably word">' +
				  '<input type="button" class="next button" value="Probably non-word">' +
				  '<input type="button" class="next button right" value="Sure non-word">' +
				  '</div>')

		// this record will contain: typeface, sample, response, miliseconds
		fs.append('<input type="hidden" name="' + trialID + '" id="' + trialID + '" value="' + typeface[0] + ", " + type + ", " + sample + '" class="hidden response">')

		// progress bar
		fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(counter / totalwords * 100) + '%"></div></div>')
		counter += 1
	})

	// questionnaire
	$("#test_" + (i + 1) + "_remember").attr("name", "test_" + (i + 1) +  "_remember") 
	$("#test_" + (i + 1) + "_legibility").attr("name", "test_" + (i + 1) +  "_legibility")

	// add the following after questionnaire intermezzo
	fs = $("#test_" + (i + 1) + "_evaluation")

	// series of fieldsets for recognition trials
	recognition_samples.forEach(function (tuple, index, array) {
		type = tuple[0]
		sample = tuple[1]
		seen = tuple[2] + ", " + tuple[3]
		trialID =  "test_" + (i + 1) + "_recognition_" + (index + 1)
		// create fieldset for a word
		fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>Second part: did you see this word/non-word in the previous part?</h2></fieldset>')
		fs = $("#fs_" + trialID)
		wordSVGURL = "samples/" + type + "/" + typeface[1] + "/" + sample + ".svg"
		fs.append('<div class="trialarea">' +
				  '<div class="sample"><img src="' +  wordSVGURL + '" alt=""></div>' +
				  '<input type="button" class="next blue button" value="Sure seen">' +
				  '<input type="button" class="next blue button" value="Probably seen">' +
				  '<input type="button" class="next blue button" value="Probably not seen">' +
				  '<input type="button" class="next blue button right" value="Sure not seen">' +
				  '</div>')

		// this record will contain: typeface, sample, response, miliseconds
		fs.append('<input type="hidden" name="' + trialID + '" id="' + trialID + '" value="' + typeface[1] + ", " + type + ", " + sample + ", " + seen + '" class="hidden response">')
		
		// progress bar
		fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(counter / totalwords * 100) + '%"></div></div>')
		counter += 1
	})
}

// passing through the fieldsets
var current_fs, next_fs  // fieldsets
var opacity  // fieldset property which we will animate
var animating  // flag to prevent quick multi-click glitches
var previous_time  // last time when participant clicked any button
var current_time
function nextSection() {
	if (animating) return false
	form.validate()
	if(!form.valid()) return false
	animating = true

	current_fs = $(this).parent()
	if (current_fs.attr("class") == "trialarea") {
		current_fs = current_fs.parent()
	}
	next_fs = current_fs.next()
	current_time = Number(new Date().getTime())

	// record a trial response
	if (current_fs.attr("class") == "trial") {
		miliseconds = current_time - previous_time
		response = current_fs.children(".response").val()
		response += ", " + $(this).val() + ", " + miliseconds
		current_fs.children(".response").val(response)
	}
	previous_time = current_time

	if (next_fs.attr("id") == "final") {
		// submit when clicking on a button in the penultimate group
		$("form").submit()
	} else {
		//show the next fieldset
		next_fs.show()
		//hide the current fieldset with style
		current_fs.animate({
			opacity: 0
			}, {
			step: function(now, mx) {
				opacity = 1 - now;
				current_fs.css("position", "absolute");
				next_fs.css("opacity", opacity);
			},
			duration: 300,
			complete: function() {
				current_fs.hide();
				animating = false;
			},
		})
		return false
	}
}

jQuery.validator.setDefaults({
	errorPlacement: function(error, element) {
		element.before(error)
	}
})

jQuery.extend(jQuery.validator.messages, {
	required: "Please select one of the options.",
	remote: "Please fix this field.",
	email: "Please enter a valid email address.",
	url: "Please enter a valid URL.",
	date: "Please enter a valid date.",
	dateISO: "Please enter a valid date (ISO).",
	number: "Please enter a valid number.",
	digits: "Please enter only digits.",
	creditcard: "Please enter a valid credit card number.",
	equalTo: "Please enter the same value again.",
	accept: "Please enter a value with a valid extension.",
	maxlength: jQuery.validator.format("Please enter no more than {0} characters."),
	minlength: jQuery.validator.format("Please enter at least {0} characters."),
	rangelength: jQuery.validator.format("Please enter a value between {0} and {1} characters long."),
	range: jQuery.validator.format("Please enter a value between {0} and {1}."),
	max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
	min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
})

$(".next").click(nextSection)

// sliders updates
$('input[type="range"]').change(function () {
	$(this).siblings(".slider_value").text("Value: " + $(this).val())
})
