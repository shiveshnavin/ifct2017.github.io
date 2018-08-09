var EXCLUDE_DEF = new Set(['code', 'name', 'scie', 'lang', 'grup', 'regn', 'tags']);
var TABLE_COL = [{title: 'Nutrient'}, {title: 'Value'}];

var datatable = null;




function drawBuy(txt) {
  var txt = encodeURIComponent(txt.replace(/\W+/g, ' ').trim());
  $('#buy > a').each(function() {
    $(this).attr('href', $(this).attr('href').replace('${name}', txt));
  });
};

function applyMeta(row, crep) {
  for(var k in row) {
    var tk = k.replace(/_e$/, '');
    if(typeof row[k]==='string') continue;
    row[k] = round(row[k]*crep.get(tk).factor);
  }
};
function tableRow(row, ccol, crep) {
  var z = [];
  for(var k in row) {
    if(k.endsWith('_e') || EXCLUDE_DEF.has(k)) continue;
    var v = row[k].toString(), ke = k+'_e';
    if(row[ke]) v += '±'+row[ke];
    if(crep.get(k).unit) v += ' '+crep.get(k).unit;
    z.push([ccol.get(k).name, v]);
  }
  return z;
};
function drawTable(row, ccol, crep) {
  if(datatable!=null) { datatable.destroy(); $('#datatable').empty(); }
  datatable = $('#datatable').DataTable({
    columns: TABLE_COL, data: tableRow(row, ccol, crep), aaSorting: [], pageLength: 25,
  });
  setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 0);
};

function onReady() {
  var qry = queryParse(location.search);
  var code = qry.code||'A001';
  $.getJSON(SERVER_URL+'/fn/data/compositions?code='+code, function(data) {
    console.log(data);
    var row = data[0]||{};
    $('#picture').attr('src', pictureUrl(row.code));
    $('#name').text(row.name+(row.scie? '\n('+row.scie+')':''));
    $('#grup').text(row.grup);
    $('#lang').text(langValues(row.lang));
    drawBuy(row.name);
    applyMeta(row, ifct2017.representations);
    drawTable(row, ifct2017.columns, ifct2017.representations);
    $('#info').removeAttr('style');
  }); // fail?
};
$(document).ready(onReady);
