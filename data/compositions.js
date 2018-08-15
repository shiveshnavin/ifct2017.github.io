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
    if(k.endsWith('_e') || COLUMNS_TXT.has(k)) continue;
    var v = row[k].toString(), ke = k+'_e';
    if(row[ke]) v += '±'+row[ke];
    if(crep.get(k).unit) v += ' '+crep.get(k).unit;
    z.push([ccol.get(k).name, v]);
  }
  return z;
};
function drawTable(row, ccol, crep) {
  if(datatable!=null) { datatable.destroy(); $('#composition').empty(); }
  datatable = $('#composition').DataTable({
    columns: TABLE_COL, aaSorting: [], pageLength: 1000,
    // columns: TABLE_COL, data: tableRow(row, ccol, crep), aaSorting: [], pageLength: 25,
  });
  setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 0);
};

function vtableRow(elm, row, k, p) {
  var col = ifct2017.columns;
  var hie = ifct2017.hierarchy;
  var rep = ifct2017.representations;
  var tr = document.createElement('tr');
  var ke = k+'_e';
  tr.setAttribute('data-tt-id', k);
  if(p) tr.setAttribute('data-tt-parent-id', p);
  var td = document.createElement('td');
  td.textContent = (col.get(k)||{}).name;
  tr.appendChild(td);
  td = document.createElement('td');
  td.textContent = row[k]+(row[ke]? '±'+row[ke]:'')+((rep.get(k)||{}).unit? ' '+(rep.get(k)||{}).unit:'');
  tr.appendChild(td);
  elm.appendChild(tr);
  var chd = (hie.get(k)||{}).children||'';
  if(!chd) return;
  for(var c of chd.split(' '))
    vtableRow(elm, row, c, k);
};

function vtableLog(row) {
  var hie = ifct2017.hierarchy;
  var frg = document.createDocumentFragment();
  for(var k in row) {
    if(k.endsWith('_e') || COLUMNS_TXT.has(k)) continue;
    var pars = (hie.get(k)||{}).parents||'';
    if(!pars) vtableRow(frg, row, k, null);
  }
  console.log(frg);
  var tbd = document.createElement('tbody');
  tbd.appendChild(frg);
  document.querySelector('#composition').appendChild(tbd);
  $('#composition').treetable({expandable: true, clickableNodeNames: true});
};

function onReady() {
  var qry = queryParse(location.search);
  var code = qry.code||'A001';
  $.getJSON(SERVER_URL+'/fn/data/compositions?code='+code, function(data) {
    console.log(mydata=data);
    var row = data[0]||{};
    $('#picture').attr('src', pictureUrl(row.code));
    $('#name').html(row.name+(row.scie? ' <small>('+row.scie+')</small>':''));
    $('#grup').text(row.grup);
    $('#lang').text(langValues(row.lang));
    drawBuy(row.name);
    applyMeta(row, ifct2017.representations);
    vtableLog(row);
    drawTable(row, ifct2017.columns, ifct2017.representations);
    $('#info').removeAttr('style');
  }); // fail?
};
$(document).ready(onReady);
