const myButton = document.getElementById('myButton');
const myText = document.getElementById('myText');
const languages = document.getElementById('languages');
const langIndicator = document.getElementById('langIndicator');

// declare variable to hold progressive translations
let mySecret = '';
// declare variable to hold detected language
let myDetected = '';
// declare array to hold original language option and value
let myOriginal = [];

// declare array to hold all language options and values
let langArray = [];
// generate random language variables for regurgitation
let euroLang = euroLangs[Math.floor(Math.random()*euroLangs.length)];
let asiaLang = asiaLangs[Math.floor(Math.random()*asiaLangs.length)];
let afriLang = afriLangs[Math.floor(Math.random()*afriLangs.length)];
let austroLang = austroLangs[Math.floor(Math.random()*austroLangs.length)];
let multiLangs = [];
multiLangs.push(euroLang,asiaLang,afriLang,austroLang);

// from a UX standpoint this isn't the greatest way to start an app
// but for expediency's sake, I'm bound to start the user off inside
// the textarea
myText.focus();

// shuffle the multilangs array in order to provide randomness to the
// regurgitation. This is the Fisher-Yates Shuffle from:
// https://bost.ocks.org/mike/shuffle/
// upon which I can neither improve nor improvise upon well enough
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
// validating for the presence of content and not undefined
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
            languages.focus();
            mySecret = encodeURI(myText.value);
          }
        });
     }
  };
});

// Third we show the user which language their message has been composed in
function langDisplay(){
  // enable languages select
  languages.removeAttribute("disabled");
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
      elementClose = ". Proceed to Step 2.";
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
  multiLangs.push(myChoice);
  myButton.removeAttribute("disabled");
});

// add event listener to button
myButton.addEventListener("click", regurgitate);
// call the translate message function
function regurgitate(){
  languageDisplay.innerHTML = "";
  // shuffle the array
  shuffle(multiLangs);
  // translate message in multiple
  multiLangs.forEach(translateMsg);
}

function targetMsg(){
  console.log(typeof myLang,myDetected);
}

// translate the message as many times in multiLangs
function translateMsg(lang) {
  //  Create the XHR and POST the encoded input to the API
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&q=" + mySecret + "&target=" + lang[1]);
  xhr.send();
  // add listener function
  xhr.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4 && this.status == 200) {
        //convert responseText to JSON object
        var json = JSON.parse(this.responseText);
        // extract the translation and language source from the response
        json.data.translations.forEach(function(entry){
          mySecret = entry.translatedText;
          console.log(mySecret);
          // append languages used to languageDisplay
          explainElement = document.createElement('span');
          elementLang = lang[0];
          elementClose = " > ";
          joinedElements = [elementLang, elementClose];
          joinedElement = document.createTextNode(joinedElements.join(" "));
          explainElement.appendChild(joinedElement);
          languageDisplay.appendChild(explainElement);
        });
     }
  };
}

// From Jake Archibald's Promises and Back:
// http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promisifying-xmlhttprequest

function post(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('POST', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}


