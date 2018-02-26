document.addEventListener("DOMContentLoaded", function(event) { 
	
	// chrome.storage.local.clear();
	document.getElementById('save').addEventListener('click', saveChanges);

	// takes storage object and creates a list from it
	function getListFromStorage(storageObject, url) {
		var list;
		if (Object.keys(storageObject).length === 0 && storageObject.constructor === Object) {
			list = [];
		} else {
			list = storageObject[url];
			console.log(storageObject[url], list, storageObject);
		}
		return list;
	}

	function printList(list) {
		var s = '<div>';
		for (var i = 0; i < list.length; i++) {
			s += '<div id = "separatenote">' + list[i] + '<button class="remove" id="remove" type="button">X</button>' + '</div>';
		}; 

		s += '</div>'
		document.getElementById("notes").innerHTML = s;
	}

	var buttons = deleteNote();
    	for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', deleteNote());
    };

	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
		var url = tabs[0].url;
		console.log("getNotes", url);
		chrome.storage.local.get([url], function(n) {
			var list = getListFromStorage(n, url);
			printList(list);
		});
	});
	// };

	function resetForm() {//clear the value in the txt field
		document.getElementById('textbox').value = '';
	}

	function saveChanges() {
		var valueInInput = document.getElementById('textbox').value;

		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			var url = tabs[0].url.toString();
			console.log("saveChanges", url);
			// get the current list
			// add the new input to current list
			// create storageObject with new, updated list
			chrome.storage.local.get([url], function(n) {
				var list = getListFromStorage(n, url);					
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

	function deleteNote() {
		var valueInInput = document.getElementById('textbox').value;

		chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
			var url = tabs[0].url.toString();
			console.log("saveChanges", url);
			// get the current list
			// deletes note from current list
			// create storageObject with new, updated list
			chrome.storage.local.get([url], function(n) {
				var list = getListFromStorage(n, url);					
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
