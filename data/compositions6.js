var SERVER_URL = 'https://ifct2017bot.glitch.me';
var PICTURES_DEF = 'https://i.imgur.com/PNZBH2d.png';
var PICTURES_URL = 'https://cdn.jsdelivr.net/npm/@ifct2017/pictures/assets/';
var EXCLUDE_DEF = new Set(['code', 'name', 'scie', 'lang', 'grup', 'regn', 'tags']);
var TABLE_COL = [{title: 'Nutrient'}, {title: 'Value'}];

var datatable = null;

function parseQuery(txt) {
  var z = {}, txt = txt.startsWith('?')? txt.substring(1):txt;
  for(var exp of txt.split('&')) {
    var p = exp.split('=');
    z[decodeURIComponent(p[0])] = decodeURIComponent(p[1]||'');
  }
  return z;
};

function rowLang(txt) {
  txt = txt.replace(/\[.*?\]/g, '');
  $('#name').html($('#name').html()+' START0!! ');
  txt = txt.replace(/\w+\.\s([\w\',\/\(\)\- ]+)[;\.]?/g, '$1, ');
  $('#name').html($('#name').html()+' START0!! ');
  var a = Array.from([1]);
  $('#name').html($('#name').html()+' START0!! ');
  return Array.from(new Set(txt.split(', '))).join(', ');
};

function pictureUrl(cod) {
  return cod[0]>='M' && cod[0]<='O'? PICTURES_DEF : PICTURES_URL+cod+'.jpeg';
};
function drawBuy(txt) {
  var txt = encodeURIComponent(txt.replace(/\W+/g, ' ').trim());
  $('#buy > a').each(function() {
    $(this).attr('href', $(this).attr('href').replace('${name}', txt));
  });
};

function round(num) {
  return Math.round(num*1e+12)/1e+12;
};
function applyMeta(row, meta) {
  for(var k in row) {
    var tk = k.replace(/_e$/, '');
    if(typeof row[k]==='string') continue;
    row[k] = round(row[k]*Math.pow(10, meta[tk].factor));
  }
};
function tableRow(row, meta) {
  var z = [];
  for(var k in row) {
    if(k.endsWith('_e') || EXCLUDE_DEF.has(k)) continue;
    var v = row[k].toString(), ke = k+'_e';
    if(row[ke]) v += '±'+row[ke];
    if(meta[k].unit) v += ' '+meta[k].unit;
    z.push([meta[k].name, v]);
  }
  return z;
};
function drawTable(row, meta) {
  if(datatable!=null) { datatable.destroy(); $('#datatable').empty(); }
  datatable = $('#datatable').DataTable({
    columns: TABLE_COL, data: tableRow(row, meta), aaSorting: [], pageLength: 25,
  });
  setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 0);
};

function onReady() {
  var qry = parseQuery(location.search);
  var code = qry.code||'A001';
  $('#info').removeAttr('style');
  $.getJSON(SERVER_URL+'/fn/data/compositions?code='+code, function(data) {
    var meta = data.meta||{}, row = data.rows[0]||{};
    $('#picture').attr('src', pictureUrl(row.code));
    $('#name').text(row.name+(row.scie? ' ('+row.scie+')':''));
    $('#grup').text(row.grup);
    $('#name').html($('#name').html()+' START0!! ');
    $('#lang').text(rowLang(row.lang));
    $('#name').html($('#name').html()+' START1!! ');
    drawBuy(row.name);
    $('#name').html($('#name').html()+' START2!! ');
    applyMeta(row, meta);
    $('#name').html($('#name').html()+' START3!! ');
    drawTable(row, meta);
    $('#name').html($('#name').html()+' START4!! ');
    $('#info').removeAttr('style');
  }).fail(function() {
    var txt = $('#name').html();
    $('#name').html(txt+' FAIL!! ');
  }).always(function() {
    var txt = $('#name').html();
    $('#name').html(txt+' ALWAYS!! ');
  });
};
$(document).ready(onReady);