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

// Draw filter element of table.
function tableDrawFilter() {
  var div = document.createElement('div');
  div.className = 'filter';
  var lab = document.createElement('label');
  lab.appendChild(document.createTextNode('Search:'));
  var inp = document.createElement('input');
  inp.setAttribute('type', 'search');
  lab.appendChild(inp);
  div.appendChild(lab);
  return div;
};

// Draw head of table.
function tableDrawHead(cols) {
  var thd = document.createElement('thead');
  var tr = document.createElement('tr');
  for(var k in cols) {
    var th = document.createElement('th');
    th.setAttribute('name', k);
    th.textContent = cols[k].value;
    tr.appendChild(th);
  }
  thd.appendChild(tr);
  return thd;
};

function nodeAnchor(val, cls, hrf) {
  var a = document.createElement('a');
  if(hrf) a.setAttribute('href', hrf);
  if(cls) a.className = cls;
  a.textContent = val;
  return a;
};

function nodeEllipsis() {
  var spn = document.createElement('span');
  spn.className = 'ellipsis';
  spn.textContent = '...';
  return spn;
};

// Draw paginate buttons.
function paginateButtons(siz, bgn, end, val) {
  var rng = end-bgn+1, siz = Math.min(rng, siz);
  var e1 = rng>siz && val-bgn>siz-4;
  var spn = document.createElement('span');
  spn.appendChild(nodeAnchor(bgn, bgn===val? 'active':null));
  spn.appendChild(e1? nodeEllipsis():nodeAnchor(bgn+1, bgn+1===val? 'active':null));
  for(var i=e1? Math.min(Math.ceil(val-0.5*(siz-4)), end-siz+3):bgn+2, I=i+(siz-4); i<I; i++)
    spn.appendChild(nodeAnchor(i, i===val? 'active':null));
  spn.appendChild(I!==end-1? nodeEllipsis():nodeAnchor(end-1, end-1===val? 'active':null));
  spn.appendChild(nodeAnchor(end, end===val? 'active':null));
  return spn;
};

// Draw/update paginate div.
function paginateDiv(div, siz, bgn, end, val) {
  var btn = paginateButtons(siz, bgn, end, val);
  if(div) div.replaceChild(btn, div.querySelector('span'));
  else {
    div = document.createElement('div');
    div.appendChild(nodeAnchor('Previous', 'previous'));
    div.appendChild(btn);
    div.appendChild(nodeAnchor('Next', 'next'));
  }
  var pre = div.querySelector('.previous');
  var nxt = div.querySelector('.next');
  if(val===bgn) pre.classList.add('disabled');
  else pre.classList.remove('disabled');
  if(val===end) nxt.classList.add('disabled');
  else nxt.classList.remove('disabled');
};

// Draw/update info of table.
function infoDiv(div, siz, bgn, end) {
  if(!div) {
    div = document.createElement('div');
    div.className = 'info';
  }
  div.textContent = 'Showing '+bgn+' to '+end+' of '+siz+' enntries';
  return div;
};

function tableDraw(ele, dat, met) {
  var fra = document.createDocumentFragment();
  var cap = document.createElement('caption');
  var ent = document.createElement('div');
  for(var k in dat[0]) {
    
  }
};
