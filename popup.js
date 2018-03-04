
// waits until html is loaded before running our code
document.addEventListener("DOMContentLoaded", function(event) { 
    
    // chrome.storage.local.clear();

    // sets up eventListener for the event that save button is clicked
    document.getElementById('save').addEventListener('click', addNewNote);
    // allows enter to save note
    document.getElementById('textbox').addEventListener('keypress', function(event) {
        if (event.keyCode == 13) {
            addNewNote();
        }
    });

    // Gets list of notes for specified `url` from storage in list form, empty list if no notes for that `url`
    // Input:
        // `storageObject` (object where keys are url [strings] and values are [lists] of [strings] of user inputs)
        // `url` of current tab [string]
    // Returns: list from storage objects  
    // `storageObject` format -> url: (# of elements in list) [elements, in, list]
    function getListFromStorage(storageObject, url) {
        var urlStorageList;
        if (Object.keys(storageObject).length === 0 && storageObject.constructor === Object) {
            urlStorageList = [];
        }
        else {
            urlStorageList = storageObject[url];
        }
        console.log("getListFromStorage -> ", "\n\turl: ", url, "\n\turlStorageList: ", JSON.stringify(urlStorageList), "\n\tstorageObject: ", JSON.stringify(storageObject));

        return urlStorageList;
    }

    // helper function for closures
    function makeDeleteCallback(i) {
        return function() {
            deleteNote(i);
        };
    }

    // Prints the notes entered into text box each in separate div containers
    // Input:
        // [list] of [strings] of user inputs
    // Returns: nothing
    function displayListAsHTML(notesList) {
        var divContainer = '<div id="note-container">';
        for (var i = 0; i < notesList.length; i++) {
            divContainer += '<div id="separatenote">' + notesList[i] + '<button class="remove" id="remove"></button>' + '</div>';
        }; 
        divContainer += '</div>'
        document.getElementById("notes").innerHTML = divContainer;

        // adding functionality to delete button
        var allNoteElements = document.getElementById("note-container");
        for (var i = 0; i < allNoteElements.childNodes.length; i++) {
            // gets button element from inside `divContainer`
            var buttonElement = allNoteElements.childNodes[i].childNodes[1];

            // addEventListener's second argument must be a function, 
            // so we use an anonymous function. just an anonymous function
            // returns only the last iteration, so we create a function factory
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
                // Creating closures in loops: A common mistake
            // just doing deleteNote(i) wouldn't work since it's a 
            // function call
            buttonElement.addEventListener('click', makeDeleteCallback(i));
            console.log("testing childnode for loop: ", allNoteElements.childNodes[i].childNodes[1]);
        };
        console.log("displayListAsHTML -> ", "\n\tnotesList: ", JSON.stringify(notesList));
    }

    // clears the value in the text field
    function resetForm() {
        document.getElementById('textbox').value = '';
    }

    // Saves the note entered into storage
    // Returns: nothing
    function addNewNote() {
        var valueInInput = document.getElementById('textbox').value;

        // same function from before, gets `url` of current tab
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url.toString();
            console.log("addNewNote", url);
            // get the current list
            // add the new input to current list
            // create storageObject with new, updated list
            chrome.storage.local.get([url], function(callback) {
                var list = getListFromStorage(callback, url);                  
                list.push(valueInInput);
                console.log("list of notes", list);

                displayListAsHTML(list);

                // TODO: write why we used [] for url
                var storageObject = {
                    [url]: list
                };
        
                chrome.storage.local.set(storageObject);
            });
        });
        resetForm();
    }

    // Deletes a note when the x button on that note is clicked
    // Returns: nothing
    function deleteNote(i) {
        console.log("deleteNote", i);

        // same function from before, gets `url` of current tab
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url.toString();
            console.log("addNewNote", url);
            // get the current list
            // deletes note from current list
            // create storageObject with new, updated list
            chrome.storage.local.get([url], function(callback) {
                var list = getListFromStorage(callback, url);                  
                list.splice(i, 1);
                console.log("deleteNote -> ", "\n\tlist of notes: ", list);

                displayListAsHTML(list);

                var storageObject = {
                    [url]: list
                };
        
                chrome.storage.local.set(storageObject);
            });
        });
        resetForm();
    }

    // TODO: make sure this is the right wayto call/assign main
    // Gets the url of the current tab
    // Inputs:
        // `tabs` : current tab
    // requires: open tab is the current active one
    // Returns: nothing
    function main() {
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
            var url = tabs[0].url;
            console.log("getNotes", url);
            // Input:
                // url of current tab, function callback
            // Returns: nothing
            // gets list of notes entered by user, then calls `displayListAsHTML` in order to display the elements of the list
            chrome.storage.local.get([url], function(callback) {
                var urlStorageList = getListFromStorage(callback, url);
                displayListAsHTML(urlStorageList);
                console.log("url info -> ", "\n\turl: ", url, "\n\turlStorageList: ", urlStorageList);
            });
        });
    }
    main();
});


