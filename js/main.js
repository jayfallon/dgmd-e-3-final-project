const myButton = document.getElementById('myButton');
const myText = document.getElementById('myText');
const languages = document.getElementById('languages');
const langIndicator = document.getElementById('langIndicator');
const charsLeft = document.getElementById('charsLeft');
const output = document.getElementById('output');

// declare variable to hold original message
let myOriginalSecret = '';
// declare variable to hold progressive message translations
let mySecret = '';
// declare variable to hold detected language
let myDetected = '';
// declare array to hold original language option and value
let myOriginal = [];

// declare array to hold all language options and values
let langArray = [];
let multiLangs = [];
function randomLangs() {
  // generate random language variables for regurgitation
  let euroLang = euroLangs[Math.floor(Math.random()*euroLangs.length)];
  let asiaLang = asiaLangs[Math.floor(Math.random()*asiaLangs.length)];
  let afriLang = afriLangs[Math.floor(Math.random()*afriLangs.length)];
  let austroLang = austroLangs[Math.floor(Math.random()*austroLangs.length)];

  // add one language from each group euroLang,asiaLang,afriLang,austroLang
  multiLangs.push(euroLang, asiaLang, afriLang, austroLang);
  // shuffle the array
  shuffle(multiLangs);
}


// shuffle the multilangs array in order to provide randomness to the
// regurgitation.
// This is the Fisher-Yates Shuffle from:
// https://bost.ocks.org/mike/shuffle/
// which I can neither improve nor improvise upon well enough
function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

// First we get the available languages from the Google API.
// I could hard code them but for the sake of accuracy I
// decided get them each time.
(function(){
//  Create the XHR and POST the encoded input to the API 
  var langs = new XMLHttpRequest();
  langs.open("POST", "https://translation.googleapis.com/language/translate/v2/languages?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&target=en"); 
  langs.send();
  // add listener function
  langs.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4 && this.status == 200) {
        //convert responseText to JSON object
        var json = JSON.parse(this.responseText);
        // extract the translation and language source from the response
        json.data.languages.forEach(function(entry){ 
          // populate the languages select element
          newElement = document.createElement('option');
          elementText = document.createTextNode(entry.name);
          newElement.setAttribute("value", entry.language);
          newElement.appendChild(elementText);
          document.getElementById('languages').appendChild(newElement);
          // populate langArray for later language display
          langArray.push([entry.name, entry.language]);
        });
     }
  };
})();

// Second, we detect the language of the message on textarea blur,
// validating for the presence of content and not undefined, and we
// provide a counter for a supposed 280 character limit
// Add event listeners to textarea
myText.addEventListener("keyup", checkMsgLength);
myText.addEventListener("input", function(){
  // enable languages select
  languages.removeAttribute("disabled");
});
myText.addEventListener("blur", function(){
	//  Create the XHR and POST the encoded input to the API
  var detected = new XMLHttpRequest();
  detected.open("POST", "https://translation.googleapis.com/language/translate/v2/detect?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&q=" + encodeURI(myText.value));
  detected.send();
  // add listener function
  detected.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4 && this.status == 200) {
        //convert responseText to JSON object
        var json = JSON.parse(this.responseText);
        // extract the detected language from the response
        json.data.detections[0].forEach(function(entry){
          // updated myDetected
          myDetected = entry.language;
          // validate that the user wrote something and call
          if (myDetected === "und" || myText.value.length === 0){
          	if (langIndicator.firstChild) {
                langIndicator.removeChild(langIndicator.firstChild);
            }
          	newElement = document.createElement('span');
            elementText = document.createTextNode("You need to write a message first.");
            newElement.appendChild(elementText);
            langIndicator.style.color = "red";
            langIndicator.appendChild(newElement);
            myText.focus();
          } else {
          	langIndicator.style.color = "";
          	langDisplay();
            mySecret = encodeURI(myText.value);
            myOriginalSecret = (myText.value);
          }
        });
     }
  };
});

// implement a countdown indicator for the message
// declare variable for character limit
var msgLength = 280;
// check the length of the bio
function checkMsgLength() {
  var x = this.value.length;
  x = msgLength - x;
  charsLeft.innerHTML = x;
  // change color and content once bio length exceeds character limit
  // switch back once user adjusts length to under character limit
  if ( x < 0) {
    while (lenghtCheck.firstChild) {
        lenghtCheck.removeChild(lenghtCheck.firstChild);
    }
    msgElement = document.createElement('span');
    msgElement.setAttribute("class", "error");
    msgTextElement = document.createTextNode("You have exceeded the limit by ");
    msgElement.appendChild(msgTextElement);
    lenghtCheck.appendChild(msgElement);
    msgElement = document.createElement('span');
    msgElement.setAttribute("class", "error");
    lengthElement = document.createTextNode(Math.abs(x));
    msgElement.appendChild(lengthElement);
    lenghtCheck.appendChild(msgElement);
  } else {
    while (lenghtCheck.firstChild) {
        lenghtCheck.removeChild(lenghtCheck.firstChild);
    }
    msgElement = document.createElement('span');
    lengthElement = document.createTextNode(x);
    msgElement.appendChild(lengthElement);
    lenghtCheck.appendChild(msgElement);
  }
}

// Third we show the user which language their message has been composed in
function langDisplay(){
	// remove detected language if already displayed
  if (langIndicator.firstChild) {
      langIndicator.removeChild(langIndicator.firstChild);
  }
  // show the detected language
  langArray.forEach(function(entry){
    if (myDetected === entry[1]){
    	newElement = document.createElement('span');
      elementText = "We've detected that your message is written in ";
      elementLang = entry[0];
      elementClose = ".";
      joinedElements = [elementText, elementLang, elementClose];
      joinedElement = document.createTextNode(joinedElements.join(""));
      newElement.appendChild(joinedElement);
      langIndicator.appendChild(newElement);
      // push detected to myOriginal for final regurgitation
      myOriginal.push(entry[0], entry[1]);
    }
  });
}

let myLanguage = "";
let myLang = "";
let myChoice = [];

// Fourth, we ready the user's target language and value on select change
languages.addEventListener("change", function(){
  myChoice = [];
	myLang = this.value;
  myLanguage = this.options[this.selectedIndex].text;
  myChoice.push(myLanguage, myLang);
  // push to multiLangs array for regurgitation
  //multiLangs.push(myChoice);
  myButton.removeAttribute("disabled");
});

// add event listener to button
myButton.addEventListener("click", choicePick);
// call the translate message function
function choicePick(){
  // clear get a new set of random languages
  multiLangs = [];
  randomLangs();
  // reset X
  languageDisplay.innerHTML = "";
  // translate the user's choice first
  translateMsg(myChoice, mySecret);
}

// send the multiLangs sequence to translateMsg
// once the choice 
function randomPicks() {
  var lang = multiLangs[0];
  var src = mySecret;
  translateMsg(lang, src);
  multiLangs.shift();
}

// translate the message as many times in multiLangs
function translateMsg(lang, src) {
  //  Create the XHR and POST the encoded input to the API
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&q=" + src + "&target=" + lang[1]);
  xhr.send();
  // add listener function
  xhr.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4) {
      if (output.firstChild) output.removeChild(output.firstChild);
      if (this.status == 200) {
        //convert responseText to JSON object
        var json = JSON.parse(this.responseText);
        // extract the translation and language source from the response
        json.data.translations.forEach(function(entry){
          mySecret = entry.translatedText;
          // append languages used to languageDisplay
          explainElement = document.createElement('span');
          elementLang = lang[0];
          elementClose = " > ";
          joinedElements = [elementLang, elementClose];
          joinedElement = document.createTextNode(joinedElements.join(" "));
          explainElement.appendChild(joinedElement);
          languageDisplay.appendChild(explainElement);
          translateElement = document.createElement('span');
          translatedElement = document.createTextNode(mySecret);
          translateElement.appendChild(translatedElement);
          output.appendChild(translateElement);
          if (multiLangs.length > 0) {
            randomPicks();
          } else {
            originalPick(myOriginal,mySecret);
          }
        });
      } else {
        elementError = document.createElement('span');
        elementErrorText = document.createTextNode('A serious error has occurred. Please refresh and try again.');
        elementError.appendChild(elementErrorText);
        output.appendChild(elementError);
      }
    }
  };
}

function originalPick(lang, src) {
  // var lang = myOriginal;
  // var src = mySecret;
  // translateMsg(lang, src);
  // myOriginal.shift();
  console.log("fin");
  //  Create the XHR and POST the encoded input to the API
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&q=" + src + "&target=" + lang[1]);
  xhr.send();
  // add listener function
  xhr.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4) {
      if (output.firstChild) output.removeChild(output.firstChild);
      if (this.status == 200) {
        //convert responseText to JSON object
        var json = JSON.parse(this.responseText);
        // extract the translation and language source from the response
        json.data.translations.forEach(function(entry){
          mySecret = entry.translatedText;
          // append languages used to languageDisplay
          explainElement = document.createElement('span');
          elementLang = lang[0];
          joinedElement = document.createTextNode(elementLang);
          explainElement.appendChild(joinedElement);
          languageDisplay.appendChild(explainElement);
          translatedElement = document.createTextNode(entry.translatedText);
          output.appendChild(translatedElement);
        });
      } else {
        elementError = document.createElement('span');
        elementErrorText = document.createTextNode('A serious error has occurred. Please refresh and try again.');
        elementError.appendChild(elementErrorText);
        output.appendChild(elementError);
      }
    }
  };
}
