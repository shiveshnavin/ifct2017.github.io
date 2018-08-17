var CHECKBOX_FMT = '&nbsp;&nbsp;<input type="checkbox" id="datatable_details" name="details" checked><label for="datatable_details">DETAILS</label>';
var datatable = null;
var Chart = null;
var rows = null;


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
    if(i>0) chartDraw(rows, meta, keys[1], cols[i].data.sort);
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

// Get chart series for given y axes.
function chartSeries(rows, x, ys) {
  var z = [], colors = Highcharts.getOptions().colors;
  for(var i=0, I=ys.length; i<I; i++) {
    var y = ys[i], rng = rows[0][y+'_e']!=null;
    z.push({name: columnName(y), data: rowsPair(rows, x, y), zIndex: 2*i+1, _code: y,
      marker: {fillColor: 'white', lineWidth: 2, lineColor: colors[i], _type: columnType(y)}
    });
    if(rng) z.push({name: 'Range', data: rowsPairRange(rows, x, y), type: 'arearange', lineWidth: 0,
      linkedTo: ':previous', color: colors[i], fillOpacity: 0.3, zIndex: 2*i, marker: {enabled: false}
    });
  }
  return z;
};

// Handle chart legend click.
function chartLegend() {
  this.yAxis.userOptions._ready = false;
};

// Get representation for chart axis.
function chartRepresentation(axis) {
  var series = axis.series, types = new Set();
  for(var s of series) {
    if(!s.visible || s.name==='Range') continue;
    types.add(s.userOptions._type);
  }
  var type = types.size===1? setFirst(types):null;
  var factor = quantityFactor(type, axis.max);
  var unit = quantityUnit(type, factor);
  Object.assign(axis.userOptions, {_type: type, _factor: factor, _unit: unit});
  return {type: type, factor: factor, unit: unit};
};

// Format chart yaxis
function chartYaxis() {
  var o = this.axis.userOptions;
  if(!o._ready) chartRepresentation(this.axis);
  var type = o._type, factor = o._factor, unit = o._unit;
  return type? round(this.value*factor)+unit:this.value;
};

// Get quantites for chart tooltip.
function chartQuantities(pts) {
  var z = '';
  for(var i=0, I=pts.length; i<I; i++) {
    var p = pts[i], pn = pts[i+1];
    if(p.colorIndex==null) continue;
    var rng = pn && pn.colorIndex==null;
    var cod = p.series.userOptions._code;
    var f = columnFactor(cod), u = columnUnit(cod);
    z += '<tr><th>'+p.series.name+'</th>';
    z += '<td>'+round(p.y*f)+(u||'');
    if(rng) z += ' ('+round(pn.point.high*f)+' - '+round(pn.point.low*f)+')';
    z += '</td></tr>\n';
  }
  return z;
};

// Format chart tooltip.
function chartTooltip() {
  var r = Chart.rows[this.x];
  var fmt = document.getElementById('chart-tooltip').innerHTML;
  var z = fmt.replace('${picture}', 'src="'+pictureUrl(r.code)+'"');
  z = z.replace('${name}', r.name);
  z = z.replace('${scie}', r.scie||'...');
  z = z.replace('${grup}', r.grup);
  z = z.replace('${quantities}', '<table>'+chartQuantities(this.points)+'</table>');
  return z;
};

function chartDraw(rows, x, ys) {
  chartDestroy();
  var value = rowsValue(rows, x);
  var series = chartSeries(rows, x, ys);
  Chart = Highcharts.chart('chart', {
    chart: {style: {fontFamily: '"Righteous", cursive'}}, title: {text: null}, legend: {},
    xAxis: {labels: {enabled: true, formatter: function() { return value[Math.round(this.value)]; }}},
    yAxis: {title: {text: null}, labels: {formatter: chartYaxis}},
    tooltip: {crosshairs: true, shared: true, useHTML: true, formatter: chartTooltip},
    series: series, plotOptions: {series: {events: {legendItemClick: chartLegend}}}
  });
  Chart.rows = rows;
};

function processQuery(txt) {
  console.log('processQuery()', txt);
  $.getJSON(SERVER_URL+'/fn/english/'+txt, function(data) {
    console.log('slang:', data.slang);
    console.log('sql:', data.sql);
    console.log(data);
    var rows = data.rows;
    var meta = data.meta;
    if(rows.length===0) return;
    rows = rowsWithText(rows);
    var ys = rowQuantityColumns(rows[0]||{});
    // drawTable(rows, meta);
    if(ys.length>0) chartDraw(rows, 'name', ys);
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
