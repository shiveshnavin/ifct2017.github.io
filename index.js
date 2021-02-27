// Handle form submit.
function onSubmit(e) {
  var src = e.target.submitted;
  console.log('onSubmit()', src);
  var val = document.getElementById('text').value;
  locationPathSet('/data/query?text='+val);
  return false;
};


// Setup page.
function setup() {
  console.log('setup()');
  $('form').submit(onSubmit);
  setupAutocomplete();
  setupForms();
};
$(document).ready(setup);
