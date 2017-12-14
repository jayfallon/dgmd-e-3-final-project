window.onload = function(){
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
