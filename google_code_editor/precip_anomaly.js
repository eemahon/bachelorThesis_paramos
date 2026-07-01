// =======================
// USER SETTINGS
// =======================

var aoi = ee.FeatureCollection(zhurucay);
Map.centerObject(aoi, 9);

var point = ee.Geometry.Point([-79.234636, -3.062424]);
Map.centerObject(point, 12);
Map.addLayer(point, {color: 'red'}, 'Sample Point');


// =======================
// EXACT STUDY PERIOD
// =======================

var startDate = ee.Date('2021-09-01');
var endDate   = ee.Date('2026-04-01');


// =======================
// CLIMATOLOGY PERIOD (30 years)
// =======================

var baseStart = ee.Date('1991-01-01');
var baseEnd   = ee.Date('2020-12-31');


// =======================
// DATASET
// =======================

var CHIRPS = ee.ImageCollection("UCSB-CHG/CHIRPS/PENTAD");


// =======================
// FUNCTION: PENTAD → MONTHLY
// (NOW DATE-BASED)
// =======================

function pentadToMonthly(ic, start, end) {

  var nMonths = end.difference(start, 'month');

  return ee.ImageCollection(
    ee.List.sequence(0, nMonths.subtract(1)).map(function(i) {

      var startM = start.advance(i, 'month');
      var endM   = startM.advance(1, 'month');

      var img = ic
        .filterDate(startM, endM)
        .sum()
        .rename('precip')
        .set('month', startM.get('month'))
        .set('system:time_start', startM);

      return img;
    })
  );
}


// =======================
// BUILD MONTHLY SERIES
// =======================

// Study period (exact dates)
var precipMonthly = pentadToMonthly(CHIRPS, startDate, endDate);

// Baseline period (1991–2020)
var climMonthly = pentadToMonthly(CHIRPS, baseStart, baseEnd);


// =======================
// CLIMATOLOGY (1991–2020)
// =======================

var months = ee.List.sequence(1, 12);

var monthlyClimatology = ee.ImageCollection.fromImages(
  months.map(function(m) {

    var climImg = climMonthly
      .filter(ee.Filter.eq('month', m))
      .mean()
      .rename('clim_mean');

    return climImg.set('month', m);
  })
);


// =======================
// ANOMALY FUNCTION
// =======================

function addAnomaly(img) {

  var m = ee.Number(img.get('month'));

  var clim = monthlyClimatology
    .filter(ee.Filter.eq('month', m))
    .first();

  var anomaly = img.select('precip')
    .subtract(clim.select('clim_mean'))
    .rename('precip_anom');

  return anomaly.set('system:time_start', img.get('system:time_start'));
}


// Apply anomalies
var precipAnom = precipMonthly.map(addAnomaly);


// =======================
// POINT TIME SERIES
// =======================

var series = precipAnom.map(function(img) {

  var value = img.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 5566,
    maxPixels: 1e13
  });

  return ee.Feature(null, {
  date: ee.Date(img.get('system:time_start')).format('YYYY-MM-dd'),
  precip_anom: value.get('precip_anom')
});

});

print('Point time series:', series);


// =======================
// CHART
// =======================

var chart = ui.Chart.feature.byFeature(series, 'date', 'precip_anom')
  .setOptions({
    title: 'CHIRPS Precipitation Anomalies (2021-09 to 2026-04)',
    hAxis: {title: 'Date'},
    vAxis: {title: 'Anomaly (mm)'},
    lineWidth: 1,
    pointSize: 2,
    colors: ['blue']
  });

print(chart);


// =======================
// MAP EXAMPLE
// =======================

Map.addLayer(
  precipAnom.first(),
  {
    min: -100,
    max: 100,
    palette: ['red', 'white', 'blue']
  },
  'Precip anomaly example'
);



/////////////////////// EXPORT CSV ///////////////////////

Export.table.toDrive({
  collection: series,
  description: 'CHIRPS_Precip_Anomalies_Point_2021_2026',
  folder: 'gee',
  fileNamePrefix: 'CHIRPS_precip_anomalies_point_2021_2026',
  fileFormat: 'CSV',
  selectors: ['date', 'precip_anom']
});