
// waits until html is loaded before running our code
document.addEventListener("DOMContentLoaded", function(event) { 
    
    // chrome.storage.local.clear();

    // calls `saveChanges` when save button is clicked
    document.getElementById('save').addEventListener('click', saveChanges);

    // inputs: storage object (note typed by user)
    // outputs: creates, then returns a list from storage objects
    // `storageObject` format -> 0: element1, 1: element2, length: 2    
    // `storageObject` format -> url: (# of elements in list) [elements, in, list]
    function getListFromStorage(storageObject, url) {
        var urlStorageList;
        if (Object.keys(storageObject).length === 0 && storageObject.constructor === Object) {
            urlStorageList = [];
        }
        else {
            urlStorageList = storageObject[url];
            console.log(storageObject[url], urlStorageList, storageObject);
        }
        return urlStorageList;
    }

    // inputs: list of notes
    // returns: nothing
    // function: prints the notes entered into textbox each in separate div containers
    function printList(list) {
        var divContainer = '<div>';
        for (var i = 0; i < list.length; i++) {
            divContainer += '<div id = "separatenote">' + list[i] + '<button class="remove" id="remove" type="button">X</button>' + '</div>';
        }; 

        divContainer += '</div>'
        document.getElementById("notes").innerHTML = divContainer;
    }

    // requires: open tab is the current active one
    // returns: nothing
    // function: calls `getListFromStorage` to get the note from storage
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url;
        console.log("getNotes", url);
        // inputs: url of current tab, function callback
        // returns: nothing
        // gets list of notes entered by user, then calls `printList` in order to display the elements of the list
        chrome.storage.local.get([url], function(callback) {
            var urlStorageList = getListFromStorage(callback, url);
            printList(urlStorageList);
        });
    });
    // };

    // clears the value in the text field
    function resetForm() {
        document.getElementById('textbox').value = '';
    }

    // returns: nothing
    // saves the note entered into storage
    function saveChanges() {
        var valueInInput = document.getElementById('textbox').value;

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url.toString();
            console.log("saveChanges", url);
            // get the current list
            // add the new input to current list
            // create storageObject with new, updated list
            chrome.storage.local.get([url], function(callback) {
                var list = getListFromStorage(callback, url);                  
                list.push(valueInInput);
                console.log("list of notes", list);

                printList(list);

                var storageObject = {
                    [url]: list
                };
        
                chrome.storage.local.set(storageObject);
            });
        });
        resetForm();
    }

    // // deletes note when x button is pressed
    // var deleteButton = urlStorageList;
    // for (var i = 0; i < urlStorageList.length; i++) {
    //     urlStorageList[i].addEventListener('click', deleteNote());
    // };

    // returns: nothing
    // deletes a note when the x button on that note is clicked
    function deleteNote() {
        var valueInInput = document.getElementById('textbox').value;

        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            var url = tabs[0].url.toString();
            console.log("saveChanges", url);
            // get the current list
            // deletes note from current list
            // create storageObject with new, updated list
            chrome.storage.local.get([url], function(callback) {
                var list = getListFromStorage(callback, url);                  
                list.splice(valueInInput, 1);
                console.log("list of notes", list);

                printList(list);

                var storageObject = {
                    [url]: list
                };
        
                chrome.storage.local.set(storageObject);
            });
        });
        resetForm();
    }
});
