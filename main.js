// Glbal constants.
var SERVER_URL = 'https://ifct2017bot.glitch.me';
var PICTURES_DEF = 'https://i.imgur.com/PNZBH2d.png';
var PICTURES_URL = 'https://cdn.jsdelivr.net/npm/@ifct2017/pictures/assets/';


// Fix floating-point precision problem.
function round(num) {
  return Math.round(num*1e+12)/1e+12;
};

// Get unique values in array.
function arrayUnique(arr) {
  var z = [];
  for(var v of arr)
    if(z.indexOf(v)<0) z.push(v);
  return z;
};

// Parse URL query to object.
function queryParse(txt) {
  var z = {}, txt = txt.startsWith('?')? txt.substring(1):txt;
  for(var exp of txt.split('&')) {
    var p = exp.split('=');
    z[decodeURIComponent(p[0])] = decodeURIComponent(p[1]||'');
  }
  return z;
};

// Get object from form elements.
function formGet(frm) {
  var E = frm.elements, z = {};
  for(var i=0, I=E.length; i<I; i++)
    if(E[i].name) z[E[i].name] = E[i].value;
  return z;
};

// Set form elements from object.
function formSet(frm, val) {
  var e = frm.elements;
  for(var i=0, I=e.length; i<I; i++)
    if(e[i].name && val[e[i].name]) e[i].value = val[e[i].name];
  return frm;
};

// Get language values from "lang".
function langValues(txt) {
  txt = txt.replace(/\[.*?\]/g, '');
  txt = txt.replace(/\w+\.\s([\w\',\/\(\)\- ]+)[;\.]?/g, '$1, ');
  var arr = txt.split(/,\s*/g);
  if(!arr[arr.length-1]) arr.pop();
  return arrayUnique(arr).join(', ');
};

// Get URL of picture from "code".
function pictureUrl(cod) {
  return cod[0]>='M' && cod[0]<='O'? PICTURES_DEF : PICTURES_URL+cod+'.jpeg';
};

// Enable form multi submit
function setupForms() {
  console.log('setupForms()');
  var e = document.querySelectorAll('form [type=submit]');
  for(var i=0, I=e.length; i<I; i++)
    e[i].onclick = function() { this.form.submitted = this.name; };
};

// Make page footer sticky.
function setupFooter() {
  console.log('setupFooter()');
  var e = document.querySelector('footer');
  if(e.offsetTop+e.offsetHeight<innerHeight) 
  { e.style.bottom = '0'; e.style.position = 'absolute'; }
  e.style.display = 'block';
};

// Draw length element of table.
function tableDrawLength(vals) {
  var div = document.createElement('div');
  div.className = 'length';
  var lab = document.createElement('label');
  lab.appendChild(document.createTextNode('Show '));
  var sel = document.createElement('select');
  sel.setAttribute('name', 'length');
  for(var val of vals||['10', '25', '50', '100']) {
    var opt = document.createElement('option');
    opt.setAttribute('value', val);
    opt.textContent = val;
    sel.appendChild(opt);
  }
  lab.appendChild(sel);
  lab.appendChild(document.createTextNode(' entries'));
  div.appendChild(lab);
  return div;
};

function tableDraw(ele, dat, met) {
  var fra = document.createDocumentFragment();
  var cap = document.createElement('caption');
  var ent = document.createElement('div');
  for(var k in dat[0]) {
    
  }
};
