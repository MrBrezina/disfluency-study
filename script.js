// function to shuffle array in place
function shuffle(a) {
  var j, x, i;
  for (i = a.length; i; i -= 1) {
    j = Math.floor(Math.random() * i);
    x = a[i - 1];
    a[i - 1] = a[j];
    a[j] = x;
  }
}

// get a list of random, unique indexes
function getIndexes(count, total) {
  var i = 0;
  var result = [];
  while (i < count) {
    x = Math.floor((Math.random() * total) + 1)
    if (result.indexOf(x) == -1) {
      result.push(x);
      i++;
    }
  }
  return result;
}

// settings
var form_url = "https://getform.io/f/47e35945-d668-4db5-9730-7712c49ccd6a";
var typefaces = ["inputsans", "sansforgetica"];
shuffle(typefaces);
var total_words = source_word.length;
var total_nonwords = source_nonword.length;

// group words and non-words by their first letter
var letters_to_words = {};
var letters_to_nonwords = {};
for (var i = 0; i < total_words; i++) {
  w = source_word[i];
  if (w[0] in letters_to_words) {
    letters_to_words[w[0]].push(w);
  } else {
    letters_to_words[w[0]] = [w];
  }
}
for (var i = 0; i < total_nonwords; i++) {
  nw = source_nonword[i];
  if (nw[0] in letters_to_nonwords) {
    letters_to_nonwords[nw[0]].push(nw);
  } else {
    letters_to_nonwords[nw[0]] = [nw];
  }
}

// generate 2 x X random and unique indexes
var random = [getIndexes(28, total_words), getIndexes(20, total_nonwords)];  // 0: words, 1: non-words
var lexical = [[], []];
var recognition = [[], []];
all_words_indexes = random[0].slice();  // make a hard copy
all_nonwords_indexes = random[1].slice();  // make a hard copy
for (var t = 0; t < 2; t++) {
  var match_letters = [[], []];  // 0: words, 1: non-words
  // lexical tasks: randomly select 10 words and 10 non-words
  for (var i = 0; i < 10; i++) {
    x = random[0][t * random[0].length/2 + i];
    w = ["word", x, source_word[x]];
    y = random[1][t * random[1].length/2 + i];
    nw = ["nonword", y, source_nonword[y]];
    // add to lexical task
    lexical[t].push(w);
    lexical[t].push(nw);
    // add to the recognition task
    // add first 4 words and non-words
    if (i < 4) {
      recognition[t].push(w);
      recognition[t].push(nw);
    } else {
      // collect first letters from the other words and non-words
      match_letters[0].push(source_word[x][0])
      match_letters[1].push(source_nonword[y][0])
    }
  }
  // add foils to the recognition task
  // 4 words that have the same first letter
  // with the other words in the lexical task
  for (var i = 0; i < 4; i++) {
    letter = match_letters[0][i];
    if (letter in letters_to_words) {
      similar = letters_to_words[letter].slice();
      shuffle(similar);
      for (var j = 0; j < similar.length; j++) {
        w = similar[j];
        x = source_word.indexOf(w);
        // test if it is not already included
        if (all_words_indexes.indexOf(x) == -1) {
          all_words_indexes.push(x);
          recognition[t].push(["word", x, w]);
          break;
        }
      }
    }
  }
  // 4 non-words that have the same first letter
  // with the other non-words in the lexical task
  for (var i = 0; i < 4; i++) {
    letter = match_letters[1][i];
    if (letter in letters_to_nonwords) {
      similar = letters_to_nonwords[letter].slice();
      shuffle(similar);
      for (var j = 0; j < similar.length; j++) {
        nw = similar[j];
        x = source_nonword.indexOf(nw);
        // test if it is not already included
        if (all_nonwords_indexes.indexOf(x) == -1) {
          all_nonwords_indexes.push(x);
          recognition[t].push(["nonword", x, nw]);
          break;
        }
      }
    }
  }
}



var wordindex = 0;
var totalwords = lexical[0].length + recognition[0].length + lexical[1].length + recognition[1].length

// compile the forms

// set url of the form to submit to
var form = $("form");
form.attr("action", form_url)

// add a series of samples/fieldsets for the lexical decision task
fs = $("#practice");
typeface = "timesnewroman";
totalpractice = 3;
source_practice.forEach(function (sample, index, array) {
	type = "practice";
	x = index;
	trialID =  "practice_" + (index + 1);
	// create fieldset for a word
	fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>Practice: is this a word or a non-word?</h2></fieldset>');
	fs = $("#fs_" + trialID)
    wordSVGURL = "samples/" + type + "/" + typeface + "/" + x + "_" + sample + ".svg";
	fs.append('<img src="' +  wordSVGURL + '" alt="" class="sample">');
	fs.append('<input type="button" class="next button float" value="Sure word">');
	fs.append('<input type="button" class="next button float" value="Probably word">');
	fs.append('<input type="button" class="next button float" value="Probably non-word">');
	fs.append('<input type="button" class="next button" value="Sure non-word">');

	// progress bar
	fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(wordindex / totalpractice * 100) + '%"></div></div>');
	wordindex += 1;
});
var wordindex = 0;

for (var i = 0; i < 2; i++) {
  typeface = typefaces[i];
  lexical_samples = lexical[i];
  recognition_samples = recognition[i];
  lexical_indexes = [];

  // shuffle the samples to mix words and non-words
  shuffle(lexical_samples);
  shuffle(recognition_samples);

  // add a series of samples/fieldsets for the lexical decision task
  fs = $("#test_" + (i + 1) + "_lexical");
  lexical_samples.forEach(function (tuple, index, array) {
    type = tuple[0];
    x = tuple[1];
    sample = tuple[2];
    lexical_indexes.push(x);
    trialID =  "test_" + (i + 1) + "_lexical_" + (index + 1);
    // create fieldset for a word
    fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>First part: is this a word or a non-word?</h2></fieldset>');
    fs = $("#fs_" + trialID)
    wordSVGURL = "samples/" + type + "/" + typeface + "/" + x + "_" + sample + ".svg";
    fs.append('<img src="' +  wordSVGURL + '" alt="" class="sample">');
    fs.append('<input type="button" class="next button float" value="Sure word">');
    fs.append('<input type="button" class="next button float" value="Probably word">');
    fs.append('<input type="button" class="next button float" value="Probably non-word">');
    fs.append('<input type="button" class="next button" value="Sure non-word">');

    // this record will contain: typeface, sample, response, miliseconds
    fs.append('<input type="hidden" name="' + trialID + '" id="' + trialID + '" value="' + typeface + ", " + sample + '" class="hidden response">');

    // progress bar
    fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(wordindex / totalwords * 100) + '%"></div></div>');
    wordindex += 1;
  });

  // questionnaire
  $("#test_" + (i + 1) + "_remember").attr("name", "test_" + (i + 1) +  "_remember") 
  $("#test_" + (i + 1) + "_legibility").attr("name", "test_" + (i + 1) +  "_legibility")

  // add the following after questionnaire intermezzo
  fs = $("#test_" + (i + 1) + "_evaluation");

  // series of fieldsets for recognition trials
  recognition_samples.forEach(function (tuple, index, array) {
    type = tuple[0]
    x = tuple[1]
    sample = tuple[2]
    trialID =  "test_" + (i + 1) + "_recognition_" + (index + 1);
    // create fieldset for a word
    fs.after('<fieldset class="trial" id="fs_' + trialID + '"><h2>Second part: did you see this word/non-word in the previous part?</h2></fieldset>');
    fs = $("#fs_" + trialID)
    wordSVGURL = "samples/" + type + "/" + typeface + "/" + x + "_" + sample + ".svg";
    fs.append('<img src="' +  wordSVGURL + '" alt="" class="sample">');
    fs.append('<input type="button" class="next blue button float" value="Sure seen">');
    fs.append('<input type="button" class="next blue button float" value="Probably seen">');
    fs.append('<input type="button" class="next blue button float" value="Probably non-seen">');
    fs.append('<input type="button" class="next blue button" value="Sure non-seen">');

    // whether this sample appeared in the lexical task or not
    if (lexical_indexes.indexOf(x) != -1) {
      var seen = "seen";
    } else {
      var seen = "non-seen";
    }
    // this record will contain: typeface, sample, response, miliseconds
    fs.append('<input type="hidden" name="' + trialID + '" id="' + trialID + '" value="' + typeface + ", " + sample + ", " + seen + '" class="hidden response">');
    
    // progress bar
    fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(wordindex / totalwords * 100) + '%"></div></div>');
    wordindex += 1;
  });
}

// passing through the fieldsets
var current_fs, next_fs;  // fieldsets
var opacity;  // fieldset property which we will animate
var animating;  // flag to prevent quick multi-click glitches
var previous_time;  // last time when participant clicked any button
var current_time;
function nextSection() {
  if (animating) return false;
  form.validate();
  if(!form.valid()) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = current_fs.next();
  current_time = Number(new Date().getTime());

  // record a trial response
  if (current_fs.attr("class") == "trial") {
  	miliseconds = current_time - previous_time;
  	response = current_fs.children(".response").val();
  	response += ", " + $(this).val() + ", " + miliseconds;
    current_fs.children(".response").val(response);
  }
  previous_time = current_time;
  
  if (next_fs.attr("id") == "final") {
    // submit when clicking on a button in the penultimate group
    $("form").submit();
  } else {
    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({
      opacity: 0
      }, {
      step: function(now, mx) {
        opacity = 1 - now;
        current_fs.css("position", "absolute");
        next_fs.css("opacity", opacity);
      },
      duration: 400,
      complete: function() {
        current_fs.hide();
        animating = false;
      },
    });
    return false;
  }
}

jQuery.validator.setDefaults({
  errorPlacement: function(error, element) {
    element.before(error);
  }
});

jQuery.extend(jQuery.validator.messages, {
    required: "This field is required. Please select on of the options.",
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
});

$(".next").click(nextSection);

