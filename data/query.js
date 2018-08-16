var CHECKBOX_FMT = '&nbsp;&nbsp;<input type="checkbox" id="datatable_details" name="details" checked><label for="datatable_details">DETAILS</label>';
var datatable = null;
var Chart = null;
var rows = null, chartRange = null, chartUnit = null;


function tableColumns(rows, meta) {
  var cols = [{title: meta['name'].name, data: {_: 'name_t', sort: 'name'}}];
  for(var k in rows[0]) {
    if(k.endsWith('_e') || COLUMNS_TXT.has(k)) continue;
    cols.push({title: meta[k].name, data: {_: k+'_t', sort: k}});
  }
  return cols;
};
function tableRows(rows, meta) {
  for(var row of rows) {
    for(var k in row) {
      if(k.endsWith('_e') || COLUMNS_TXT.has(k)) continue;
      var v = row[k].toString(), ke = k+'_e';
      if(row[ke]) v += '±'+row[ke];
      if(meta[k].unit) v += ' '+meta[k].unit;
      row[k+'_t'] = v;
    }
    row['name_t'] = '<a target="_blank" href="/data/compositions?code='+row.code+'">'+
      '<img src="'+pictureUrl(row.code)+'" width="307"><br>'+
      row.name+(row.scie? ' <small>('+row.scie+')</small><br>':'')+
      '<div style="font-size: 1rem; width: 307px;">'+langValues(row.lang)+'</div></a>';
  }
  return rows;
};
function cleanTable() {
  if(datatable==null) return;
  datatable.destroy();
  $('#datatable').empty();
  datatable = null;
};
function drawTable(rows, meta) {
  cleanTable();
  if(rows.length===0) return;
  var keys = Object.keys(rows[0]);
  var cols = tableColumns(rows, meta);
  var data = tableRows(rows, meta);
  datatable = $('#datatable').DataTable({
    columns: cols, data: data, aaSorting: [], scrollX: true, autoWidth: true,
    retrieve: true, fixedHeader: {header: true, footer: true}
  });
  $('#datatable_length > label').append(CHECKBOX_FMT);
  $('#datatable_details').click(function() {
    console.log('hello');
    if($(this).is(':checked')) $('html').removeClass('no-details');
    else $('html').addClass('no-details');
  });
  $('#datatable_wrapper thead').on('click', 'th', function () {
    var i = datatable.column(this).index();
    if(i>0) drawChart(rows, meta, keys[1], cols[i].data.sort);
  });
  setTimeout(function() { window.dispatchEvent(new Event('resize')); }, 0);
};

// Destroy chart.
function chartDestroy() {
  if(Chart==null) return;
  Chart.destroy();
  $('#chart').empty();
  Chart = null;
};

// 
function chartSelect() {

};

// Render chart select.
function chartSelectRender(row) {
  var col = ifct2017.columns;
  var frg = document.createDocumentFragment();
  for(var k in row) {
    if(k.endsWith('_e') || k.endsWith('_t') || COLUMNS_TXT.has(k)) continue;
    var id = 'chart-select-'+k;
    var inp = document.createElement('input');
    inp.setAttribute('type', 'checkbox');
    // inp.setAttribute('name', k);
    var lbl = document.createElement('label');
    inp.id = id; lbl.setAttribute('for', id);
    lbl.appendChild(document.createTextNode(columnName(k)));
    frg.appendChild(inp);
    frg.appendChild(lbl);
  }
  var sel = document.getElementById('chart-select');
  $(sel).empty();
  sel.appendChild(frg);
  return sel;
};

// Format chart tooltip.
function chartTooltip() {
  var fmt = document.getElementById('chart-tooltip').innerHTML;
  var x = this.x, y = this.y, r = rows[this.x];
  var rng = y+chartUnit+(chartRange? ' ('+chartRange[x][2]+'-'+chartRange[x][1]+')':'');
  var z = fmt.replace('${picture}', pictureUrl(r.code));
  z = z.replace('${name}', r.name);
  z = z.replace('${scie}', r.scie||'...');
  z = z.replace('${range}', rng);
  return z;
};

function drawChart(rows, meta, x, y) {
  chartDestroy();
  chartSelectRender(rows[0]);
  var metay = meta[y];
  var name = columnName(y);
  chartUnit = metay.unit;
  var label = '{value}'+(metay.unit||'');
  var value = rowsValue(rows, x, y);
  var range = rowsRange(rows, x, y); chartRange = range;
  var colors = Highcharts.getOptions().colors;
  Chart = Highcharts.chart('chart', {
    chart: {style: {fontFamily: '"Righteous", cursive'}}, title: {text: null}, legend: {},
    xAxis: {labels: {enabled: true, formatter: function() { return value[Math.round(this.value)][0]; }}},
    yAxis: {title: {text: null}, labels: {format: label}},
    tooltip: {crosshairs: true, shared: true, useHTML: true, formatter: chartTooltip},
    series: [{
      name: name, data: value, zIndex: 1,
      marker: {fillColor: 'white', lineWidth: 2, lineColor: colors[0]}
    }, {
      name: 'Range', data: range, type: 'arearange', lineWidth: 0, linkedTo: ':previous',
      color: colors[0], fillOpacity: 0.3, zIndex: 0, marker: {enabled: false}
    }]
  });
};

function processQuery(txt) {
  console.log('processQuery()', txt);
  $.getJSON(SERVER_URL+'/fn/english/'+txt, function(data) {
    console.log('slang:', data.slang);
    console.log('sql:', data.sql);
    console.log(data);
    rows = data.rows;
    var meta = data.meta;
    if(rows.length===0) return;
    var keys = Object.keys(rows[0]||{});
    rows = rowsWithText(rows);
    // drawTable(rows, meta);
    if(keys.length>=6) drawChart(rows, meta, keys[1], keys[5]);
  }).fail(function(e) {
    var err = e.responseJSON;
    iziToast.error({
      title: err.message,
      message: '<b>SLANG:</b> '+err.slang+'<br><b>SQL:</b> '+err.sql,
      timeout: 20000
    });
  });
};

// Handle form submit.
function onSubmit(e) {
  var src = e.target.submitted;
  console.log('onSubmit()', src);
  var txt = document.getElementById('text').value;
  locationPathSet('/data/query?text='+txt);
  return false;
};

// Setup page by location.
function setupLocation() {
  var s = location.search;
  console.log('setupLocation()', s);
  if(s.length===0) return;
  var q = queryParse(s);
  if(!q.text) return;
  var txt = document.getElementById('text');
  txt.value = q.text;
  processQuery(q.text);
};

// Setup page.
function setup() {
  console.log('setup()');
  $('form').submit(onSubmit);
  setupForms();
  setupFooter();
  setupLocation();
};
$(document).ready(setup);
