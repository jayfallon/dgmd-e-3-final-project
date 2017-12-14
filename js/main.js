window.onload = function(){
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
              langIndicator.setAttribute("class", "error");
              langIndicator.appendChild(newElement);
              myText.focus();
            } else {
              langIndicator.removeAttribute("class");
              langDisplay();
              // captures the original message
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
        elementLang = entry[0];
        elementText = " Detected";
        joinedElements = [elementLang, elementText];
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
    // translate from the user's choice language first
    translateMsg(myChoice, mySecret);
  }

  // send the multiLangs sequence to translateMsg
  // once the choice call has finished
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
            // enable save button
            saveButton.removeAttribute("disabled");
            // disable myButton
            myButton.setAttribute("disabled", true);
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

  // retrieve older messages and populate array, otherwise create empty
  var oldMessages = JSON.parse(localStorage.getItem('messagesArray')) || [];
  // var oldContacts = JSON.parse(localStorage.getItem('contactsArray')) || [];
  console.log(typeof oldMessages);
  // declare a constructor function to take
  // inputs and create message entry
  function newMessage( ori, omsg, rmsg) {
      this.original = ori;
      this.oMessage = omsg;
      this.rMessage = rmsg
  }

  // define the element to post data to writeRowToPage function
  var element = document.getElementById("saved");
  // at newmessage to the top
  var newSave = document.getElementById("newSaved");
  // define button event listerner
  var saveButton = document.getElementById("saving");
  // add event listener better than "do it!"
  saveButton.addEventListener("click", saveMsg);

  function saveMsg(){
      var oMessage = myOriginalSecret;
      var original = myOriginal[0];
      var rMessage = mySecret;

      var myNewMessage = new newMessage(original, oMessage, rMessage);
      // add myOldMessage to existing array
      // validate for presence of content
      if (oMessage.length > 0) {
          //add the new message
          oldMessages.unshift(myNewMessage);
          // write the new message to the page
          writeRowToPage(myNewMessage,newSave);
      }
      // persist messages
      localStorage.setItem('messagesArray', JSON.stringify(oldMessages));
      // call clearForm to reset after adding contact
      clearForm();
      // set save button back to disabled
      saveButton.setAttribute("disabled", true);
  }

  // clear the form values and make ready to start over
  function clearForm() {
      document.getElementById("myText").value = "";
      myOriginal = [];
      output.innerHTML = "";
      if (languageDisplay.hasChildNodes()) {
          languageDisplay.removeChild(languageDisplay.childNodes[0]);
      }
  }

  function writeRowToPage(dataObject, element) {
      outerElement = document. createElement('div');
      outerElement.setAttribute("class", "outer");
      //top elements
      topElement = document. createElement('div');
      topElement.setAttribute("class", "top");
      topLabelElement = document. createElement('div');
      topLabelElement.setAttribute("class", "label");
      topLabelText = document.createTextNode("Your original message:");
      topLabelElement.appendChild(topLabelText);
      topElement.appendChild(topLabelElement);
      topMessageElement = document. createElement('div');
      topMessageElement.setAttribute("class", "message");
      if (dataObject.message !== 'undefined') {
          topMessageText = document.createTextNode(dataObject.oMessage);
      }
      topMessageElement.appendChild(topMessageText);
      topElement.appendChild(topMessageElement);
      //bottom elements
      bottomElement = document. createElement('div');
      bottomElement.setAttribute("class", "bottom");
      bottomLabelElement = document. createElement('div');
      bottomLabelElement.setAttribute("class", "label");
      bottomLabelText = document.createTextNode("Your Regurgimatated message:");
      bottomLabelElement.appendChild(bottomLabelText);
      bottomElement.appendChild(bottomLabelElement);

      bottomMessageElement = document. createElement('div');
      bottomMessageElement.setAttribute("class", "message");
      if (dataObject.rMessage !== 'undefined') {
          bottomMessageText = document.createTextNode(dataObject.rMessage);
      }
      bottomMessageElement.appendChild(bottomMessageText);
      bottomElement.appendChild(bottomMessageElement);
      outerElement.appendChild(topElement);
      outerElement.appendChild(bottomElement);
      element.appendChild(outerElement);
  }

  //populate contact list from old contacts
  // if old contacts exists
  if (oldMessages != null) {
      for (var i = 0; i < oldMessages.length; i++) {
          // call on writeRowtoPage() to write your old data object to the page
          writeRowToPage(oldMessages[i],element);
      }
  }
  clearForm();
}


