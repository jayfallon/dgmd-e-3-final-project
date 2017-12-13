window.onload = function(){
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
    var newElement = document.getElementById("newSaved");
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
        oldMessages.unshift(myNewMessage);
        // write the new message to the page
        writeRowToPage(myNewMessage,newElement);
        // persist messages
        localStorage.setItem('messagesArray', JSON.stringify(oldMessages));
        // call clearForm to reset after adding contact
        clearForm();
    }

    // clear the form values and make ready to start over
    function clearForm() {
        document.getElementById("myText").value = "";
        myOriginal = [];
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
