// Global constants.
var SERVER_URL = 'https://ifct2017bot.glitch.me';
var PICTURES_DEF = 'https://i.imgur.com/PNZBH2d.png';
var PICTURES_URL = 'https://cdn.jsdelivr.net/npm/@ifct2017/pictures/assets/';
var COLUMNS_TXT = new Set(['code', 'name', 'scie', 'lang', 'grup', 'regn', 'tags']);
var COLUMNS = ifct2017.columns, HIERARCHY = ifct2017.hierarchy;
var INTAKES = ifct2017.intakes, METHODS = ifct2017.methods;
var NUTRIENTS = ifct2017.nutrients, REPRESENTATIONS = ifct2017.representations;
var COLUMNS_NAM = new Map([
  ['abbr', 'Abbreviation'],
  ['desc', 'Description'],
  ['kj', 'kJ'],
  ['kcal', 'kcal'],
]);


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

// Get location path
function locationPath() {
  return location.pathname+location.search;
};

// Set location path
function locationPathSet(pth) {
  return location.href = location.origin+pth+location.hash;
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

// Get column name.
function columnName(k) {
  if(k.indexOf('"')>=0) return k.replace(/\"(.*?)\"/g, function(m, p1) { return columnName(p1); });
  if(COLUMNS.has(k)) return COLUMNS.get(k).name;
  return COLUMN_NAM.get(k)||k[0].toUpperCase()+k.substring(1);
};

// Get column tags.
function columnTags(k) {
  var z = '', m = null;
  if(k.indexOf('"')<0) return COLUMNS.has(k)? COLUMNS.get(k).tags:k;
  while((m=/\"(.*?)\"/g.exec())!=null)
    z += columnTags(m[1])+' ';
  return z.substring(0, z.length-1);
};

// Get column parents.
function columnParents(k) {
  return HIERARCHY.has(k)? HIERARCHY.get(k).parents:null;
};

// Get column ancestry.
function columnAncestry(k) {
  return HIERARCHY.has(k)? HIERARCHY.get(k).ancestry:null;
};

// Get column children.
function columnChildren(k) {
  return HIERARCHY.has(k)? HIERARCHY.get(k).children:null;
};

// Get column factor.
function columnFactor(k) {
  return REPRESENTATIONS.has(k)? REPRESENTATIONS.get(k).factor:1;
};

// Get column unit.
function columnUnit(k) {
  return REPRESENTATIONS.has(k)? REPRESENTATIONS.get(k).unit:null;
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

// Get scaled x, y value of rows.
function rowsValue(rows, x, y) {
  var z = [], f = columnFactor(y);
  for(var r of rows)
    z.push([r[x], r[y]*f]);
  return z;
};

// Get scaled x, y0, y1 range of rows.
function rowsRange(rows, x, y) {
  var z = [], ye = y+'_e', f = columnFactor(k);
  if(rows[0][ye]==null) return null;
  for(var r of rows)
    z.push([r[x], round((r[y]-r[ye])*f), round((r[y]+r[ye])*f)]);
  return z;
};

function rowsWithText(rows) {
  var z = [];
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
