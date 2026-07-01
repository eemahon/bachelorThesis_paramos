// ==========================
// Parameters
// ==========================
var aoi = ee.FeatureCollection(zhurucay);

var dataset = ee.ImageCollection("UCSB-CHG/CHIRPS/DAILY");
var band = "precipitation";

var startDate = '2021-09-10';
var endDate   = '2026-03-26';

// ==========================
// Load CHIRPS
// ==========================
var precip = dataset
  .filterDate(startDate, endDate)
  .select(band);

// ==========================
// Extract DAILY values
// ==========================
var daily = ee.FeatureCollection(
  precip.map(function(img) {
    
    var meanValue = img.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: aoi,
      scale: 5000,
      maxPixels: 1e13
    }).get(band);
    
    return ee.Feature(null, {
      'date': img.date().format('YYYY-MM-dd'),
      'timestamp': img.date().millis(),
      'precip': meanValue
    });
  })
);

// ==========================
// Export CSV
// ==========================
Export.table.toDrive({
  collection: daily,
  description: 'CHIRPS_Daily_Precip_2024_2025',
  folder: 'gee',
  fileNamePrefix: 'CHIRPS_Daily_Precip_2024_2025',
  fileFormat: 'CSV',
  selectors: ['date', 'precip']
});

// ==========================
// Chart time series
// ==========================
var chart = ui.Chart.feature.byFeature({
  features: daily,
  xProperty: 'timestamp',
  yProperties: ['precip']
}).setOptions({
  title: 'Daily CHIRPS Precipitation',
  hAxis: {
    title: 'Date',
    format: 'MMM yyyy'
  },
  vAxis: {title: 'Precipitation (mm/day)'},
  lineWidth: 1,
  pointSize: 2,
  colors: ['#1f78b4']
});

print(chart);