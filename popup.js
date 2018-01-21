document.addEventListener("DOMContentLoaded", function(event) { 
  
  // chrome.storage.local.clear();

  console.log('i just clicked the extension and it loaded');
  // var input_values_string = getFormString( reference_to_the_form, bool: include_password_fields );

  // setCookie('myCookieName',getFormString(document.forms.myForm,true));

  document.getElementById('save').addEventListener('click', saveChanges);
  // document.getElementById('viewNotes').addEventListener('click', getNotes);
  j
  // function getNotes() {
            // document.getElementById("sample").innerHTML = url;
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log("getNotes", url);

    chrome.storage.local.get([url], function(n) {
      console.log("results from get request", n);
      console.log(n[url]);
      document.getElementById("sample").innerHTML = n[url];
    });
  });
  // };

  function saveChanges() {
    var valueInInput = document.getElementById('textbox').value;

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var url = tabs[0].url.toString();
        console.log("saveChanges", url);
        // get the current list
        // add the new input to current list
        // create storageObject with new, updated list
        chrome.storage.local.get([url], function(n) {
          console.log("results from get request", n);
          console.log(n[url]);
          var list;
          // document.getElementById("sample").innerHTML = n[url];
          if (Object.keys(n).length === 0 && n.constructor === Object) {
            list = [];
          } else {
            list = n[url];
            console.log(n[url], list, n);
          }
        
          list.push(valueInInput);
          console.log("list of notes", list);

          var storageObject = {
            [url]: list
          };
          chrome.storage.local.set(storageObject);
        });
    });
  }
});
