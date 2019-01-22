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

// check if item is in array
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }
    return false;
}

// settings
var times = []; // for timing while piloting
var form_url = "https://getform.io/f/a9b9ea0e-44e9-458b-a1e1-78c64c3be50b";
var typefaces = ["inputsans", "sansforgetica"];
shuffle(typefaces);
var total = source_word.length;

// generate X random indexes
var random = [];
for (var i = 0; i < 24; i++) {
  random.push(Math.floor((Math.random() * total) + 1));
}
// lexical tasks: select two sequences of 10 words and 10 non-words
var lexical = [[], []];
// recognition tasks: use 4 words and 4 non-words from the lexical lists
// and add other 4 words and 4 non-words to make up
// two sequences of 8 words and 8 non-words
var recognition = [[], []];
for (var i = 0; i < 4; i++) {
  x = random[i];
  lexical[0].push(["word", x, source_word[x]]);
  lexical[0].push(["nonword", x, source_nonword[x]]);
  recognition[0].push(["word", x, source_word[x]]);
  recognition[0].push(["nonword", x, source_nonword[x]]);
}
for (var i = 4; i < 10; i++) {
  x = random[i];
  lexical[0].push(["word", x, source_word[x]]);
  lexical[0].push(["nonword", x, source_nonword[x]]);
}
for (var i = 10; i < 14; i++) {
  x = random[i];
  lexical[1].push(["word", x, source_word[x]]);
  lexical[1].push(["nonword", x, source_nonword[x]]);
  recognition[1].push(["word", x, source_word[x]]);
  recognition[1].push(["nonword", x, source_nonword[x]]);
}
for (var i = 14; i < 20; i++) {
  x = random[i];
  lexical[1].push(["word", x, source_word[x]]);
  lexical[1].push(["nonword", x, source_nonword[x]]);
}
for (var i = 20; i < 24; i++) {
  x = random[i];
  recognition[0].push(["word", x, source_word[x]]);
  recognition[0].push(["nonword", x, source_nonword[x]]);
  recognition[1].push(["word", total - x, source_word[total - x]]);
  recognition[1].push(["nonword", total - x, source_nonword[total - x]]);
}

var wordindex = 0;
var totalwords = lexical[0].length + recognition[0].length + lexical[1].length + recognition[1].length

// compile the forms

// set url of the form to submit to
var form = $("form");
form.attr("action", form_url)

for (var i = 0; i < 2; i++) {
  typeface = typefaces[i];
  lexical_samples = lexical[i];
  recognition_samples = recognition[i];
  lexical_indexes = []; // piloting

  // shuffle the samples to mix words and non-words
  shuffle(lexical_samples);
  shuffle(recognition_samples);

  fs = $("#test_" + (i + 1) + "_lexical")

  // add hidden input to record the order of typeface sequences
  fs.append('<input type="hidden" name="order_' + typeface + '" value="' + (i + 1) + '">');
  $("#test_" + (i + 1) + "_remembered").attr("name", typeface + "_remembered") 
  $("#test_" + (i + 1) + "_legibility").attr("name", typeface + "_legibility") 

  // add a series of samples/fieldsets for the lexical decision task
  lexical_samples.forEach(function (tuple, index, array) {
    type = tuple[0]
    x = tuple[1]
    sample = tuple[2]
    wordID =  (i + 1) + "_lexical_" + typeface + "_" + sample;
    // create fieldset for a word
    fs.after('<fieldset class="trial" id="fs_' + wordID + '"><h2>Is this a word or non-word?</h2></fieldset>');
    fs = $("#fs_" + wordID)
    wordSVGURL = "samples/" + type + "/" + typeface + "/" + x + "_" + sample + ".svg";
    fs.append('<img src="' +  wordSVGURL + '" alt="" class="sample">');
    fs.append('<input type="hidden" name="' + wordID + '" id="' + wordID + '" value="" class="hidden response">');
    fs.append('<input type="button" class="next button float" value="Sure word">');
    fs.append('<input type="button" class="next button float" value="Probably word">');
    fs.append('<input type="button" class="next button float" value="Probably non-word">');
    fs.append('<input type="button" class="next button" value="Sure non-word">');
    
    fs.append('<input type="hidden" value="' + typeface + '" class="hidden pilot_typeface">');
    fs.append('<input type="hidden" value="' + sample + '" class="hidden pilot_word">');
    fs.append('<input type="hidden" value="' + type + '" class="hidden pilot_expected">');

    fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(wordindex / totalwords * 100) + '%"></div></div>');
    lexical_indexes.push(x);
    wordindex += 1;
  });

  // add the following after questionnaire intermezzo
  fs = $("#test_" + (i + 1) + "_recognition")

  // series of fieldsets for recognition trials
  recognition_samples.forEach(function (tuple, index, array) {
    type = tuple[0]
    x = tuple[1]
    sample = tuple[2]
    wordID =  (i + 1) + "_recognition_" + typeface + "_" + sample;
    // create fieldset for a word
    fs.after('<fieldset class="trial" id="fs_' + wordID + '"><h2>Have you seen this word in the previous part?</h2></fieldset>');
    fs = $("#fs_" + wordID)
    wordSVGURL = "samples/" + type + "/" + typeface + "/" + x + "_" + sample + ".svg";
    fs.append('<img src="' +  wordSVGURL + '" alt="" class="sample">');
    fs.append('<input type="hidden" name="' + wordID + '" id="' + wordID + '" value="0" class="hidden response">');
    fs.append('<input type="button" class="next blue button float" value="Sure seen">');
    fs.append('<input type="button" class="next blue button float" value="Probably seen">');
    fs.append('<input type="button" class="next blue button float" value="Probably non-seen">');
    fs.append('<input type="button" class="next blue button" value="Sure non-seen">');

    // piloting
    var seen;
    if (containsObject(x, lexical_indexes)) {
      seen = "seen";
    } else {
      seen = "non-seen";
    }    
    fs.append('<input type="hidden" value="' + typeface + '" class="hidden pilot_typeface">');
    fs.append('<input type="hidden" value="' + sample + '" class="hidden pilot_word">');
    fs.append('<input type="hidden" value="' + seen + '" class="hidden pilot_expected">');
    
    fs.append('<h4>Progress</h4><div class="bar"><div class="progressbar" style="width:' + Math.floor(wordindex / totalwords * 100) + '%"></div></div>');
    wordindex += 1;
  });
}

// passing through the fieldsets
var current_fs, next_fs; // fieldsets
var opacity; // fieldset property which we will animate
var animating; // flag to prevent quick multi-click glitches
function nextSection() {
  if (animating) return false;
  form.validate();
  if(!form.valid()) return false;
  animating = true;

  current_fs = $(this).parent();
  next_fs = current_fs.next();
  if (current_fs.attr("class") == "trial") {
    current_fs.children(".response").val($(this).val());
  }

  // piloting
  if (current_fs.attr("id").startsWith("test_")) {
    times.push(new Date().getTime())
  }
  
  if (next_fs.attr("id") == "final") {
    // submit when clicking on a button in the penultimate group
    // !! $("form").submit();
    // piloting
    times.push(new Date().getTime())
    next_fs.append("<h2>Times (in miliseconds)</h2>");
    next_fs.append("<p>Test 1, first part: " +  (times[1] - times[0]) + "</p>");
    next_fs.append("<p>Test 1, questionnaire: " +  (times[2] - times[1]) + "</p>");
    next_fs.append("<p>Test 1, second part: " +  (times[3] - times[2]) + "</p>");
    next_fs.append("<p>Test 2, first part: " +  (times[4] - times[3]) + "</p>");
    next_fs.append("<p>Test 2, questionnaire: " +  (times[5] - times[4]) + "</p>");
    next_fs.append("<p>Test 2, second part: " +  (times[6] - times[5]) + "</p>");
    next_fs.append("<h2>Responses</h2>");
    next_fs.append("<table>")
    next_fs.append("<tr><th>Word</th><th>Typeface</th><th>Expected</th><th>Response</th><th>Result</th></tr>")
    $(".trial").each(function (index, value) {
      t = $(this).children(".pilot_typeface").val();
      w = $(this).children(".pilot_word").val();
      p = $(this).children(".pilot_expected").val();
      r = $(this).children(".response").val();
      result = "incorrect";
      if ((p == "word") && ((r == "Sure word") || (r == "Probably word"))) {
        result = "correct";
      }
      if ((p == "nonword") && ((r == "Sure non-word") || (r == "Probably non-word"))) {
        result = "correct";
      }
      if ((p == "seen") && ((r == "Sure seen") || (r == "Probably seen"))) {
        result = "correct";
      }
      if ((p == "non-seen") && ((r == "Sure non-seen") || (r == "Probably non-seen"))) {
        result = "correct";
      }
      next_fs.append("<tr><td>" + w + "</td><td>" + t + "</td><td>" + p + "</td><td>" + r + "</td><td class='" + result + "'>" + result + "</td></tr>");
    });
    next_fs.append("</table>")
    current_fs.hide();
    next_fs.show();
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
    required: "This field is required.",
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

