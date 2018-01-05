document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('addNote');
    // onClick's logic below:
    link.addEventListener('click', function() {
        window.open('/addnote.html');
    });
});

var input_values_string = getFormString( reference_to_the_form, bool: include_password_fields );

setCookie('myCookieName',getFormString(document.forms.myForm,true));



function saveChanges() {
        // Get a value saved in a form.
        var textBox = document.getElementById('textbox');
        var theValue = myCookieName.textBox;
        // Check that there's some code there.
        if (!theValue) {
          return;
        }
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({'textBox': theValue}, function() {
          // Notify that we saved.
          message('Note saved');
        });
      }