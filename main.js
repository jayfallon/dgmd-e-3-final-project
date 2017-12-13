const myButton = document.getElementById('myButton');
const myText = document.getElementById('myText');
const languages = document.getElementById('languages');
const langIndicator = document.getElementById('langIndicator');

let myDetected = '';
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
// shuffle the array
shuffle(multiLangs);

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
        //convert resonseText to JSON object
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

// on textarea blur, validate for content and detect language
myText.addEventListener("blur", function(){
	//  Create the XHR and POST the encoded input to the API 
  var detected = new XMLHttpRequest();
  detected.open("POST", "https://translation.googleapis.com/language/translate/v2/detect?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&q=" + encodeURI(myText.value));
  detected.send();
  // add listener function
  detected.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4 && this.status == 200) {
        //convert resonseText to JSON object
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
          }
        });
     }
  };
});

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
      elementClose = ". Proceed to Step 2.";
      joinedElements = [elementText, elementLang, elementClose];
      joinedElement = document.createTextNode(joinedElements.join(""));
      newElement.appendChild(joinedElement);
      langIndicator.appendChild(newElement);
      console.log(langArray);
    }
  });
}

let myLanguage = "";
let myLang = "";
let myChoice = [];

// get my target language value and name on select change
languages.addEventListener("change", function(){
  myChoice = [];
	myLang = this.value;
  myLanguage = this.options[this.selectedIndex].text;
  myChoice.push(myLanguage, myLang);
  // push to multiLangs array
  multiLangs.push(myChoice);
});

// add event listener to button
myButton.addEventListener("click", regurgitate);

function regurgitate(){
  multiLangs.forEach(translateMsg);
}

function targetMsg(){
  
  console.log(typeof myLang,myDetected);
}

// translate the message
function translateMsg(lang) {
  // encode text input
  let myEncodedText = encodeURI(myText.value);
  //  Create the XHR and POST the encoded input to the API
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://translation.googleapis.com/language/translate/v2?key=AIzaSyDR3sOkcEVdJYyYCtVKnmV0eJ3Mxj8d0WA&q=" + myEncodedText + "&target=" + lang[1]);
  xhr.send();
  // add listener function
  xhr.onreadystatechange = function() {
    //check the status
    if (this.readyState == 4 && this.status == 200) {
        //convert resonseText to JSON object
        var json = JSON.parse(this.responseText);
        // extract the translation and language source from the response
        json.data.translations.forEach(function(entry){
          // append translation to output
          output.innerHTML = "";
          explainElement = document.createElement('div');
          elementText = "Now translating into";
          elementLang = lang[0];
          elementClose = ":";
          joinedElements = [elementText, elementLang, elementClose];
          joinedElement = document.createTextNode(joinedElements.join(" "));
          explainElement.appendChild(joinedElement);
          output.appendChild(explainElement);
          translateElement = document.createElement('div');
          translatedElement = document.createTextNode(entry.translatedText);
          translateElement.appendChild(translatedElement);
          output.appendChild(translateElement);
        });
     }
  };
}
