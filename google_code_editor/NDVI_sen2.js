/***************************************
 NDVI ANALYSIS FOR SMAP PIXEL
 Dry season composite (Aug-Nov)
 Sentinel-2 NDVI
****************************************/

// -------------------------
// 1. INPUTS
// -------------------------

// Imported asset
// Asset name: smap_pixel

var point = ee.Geometry.Point([-79.234636, -3.062424]);

Map.centerObject(smap_pixel, 13);
Map.addLayer(smap_pixel, {color: 'red'}, 'SMAP Pixel');
Map.addLayer(point, {color: 'blue'}, 'TDR Sensor');


// -------------------------
// 2. DATE RANGE
// -------------------------

var startDate = '2022-08-01';
var endDate   = '2022-11-30';


// -------------------------
// 3. LOAD SENTINEL-2
// -------------------------

var s2 = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(smap_pixel)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 40));

print('Number of images:', s2.size());


// -------------------------
// 4. CLOUD MASK FUNCTION
// -------------------------

function maskS2(image) {
  var scl = image.select('SCL');

  var mask = scl.neq(3)   // cloud shadow
      .and(scl.neq(8))    // cloud medium probability
      .and(scl.neq(9))    // cloud high probability
      .and(scl.neq(10))   // cirrus
      .and(scl.neq(11));  // snow

  return image.updateMask(mask);
}


// -------------------------
// 5. NDVI FUNCTION
// -------------------------

function addNDVI(image) {
  var ndvi = image.normalizedDifference(['B8', 'B4'])
      .rename('NDVI');
  return image.addBands(ndvi);
}


// -------------------------
// 6. PROCESS COLLECTION
// -------------------------

var processed = s2
  .map(maskS2)
  .map(addNDVI);


// Median NDVI composite
var ndviImage = processed.select('NDVI').median()
  .clip(smap_pixel);


// -------------------------
// 7. VISUALIZATION
// -------------------------

var ndviVis = {
  min: 0,
  max: 1,
  palette: ['brown', 'yellow', 'green']
};

Map.addLayer(ndviImage, ndviVis, 'NDVI Composite');


// -------------------------
// 8. NDVI DISTRIBUTION
// -------------------------

var ndviSamples = ndviImage.sample({
  region: smap_pixel.geometry(),
  scale: 10,
  geometries: true
});

print('Sample pixels:', ndviSamples.limit(10));
print('Number of sampled pixels:', ndviSamples.size());


// -------------------------
// 9. NDVI AT TDR POINT
// -------------------------

var pointNDVI = ndviImage.reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: point,
  scale: 10,
  maxPixels: 1e9
});

print('NDVI at TDR point:', pointNDVI);


// -------------------------
// 10. SUMMARY STATS
// -------------------------

var stats = ndviImage.reduceRegion({
  reducer: ee.Reducer.min()
    .combine(ee.Reducer.max(), '', true)
    .combine(ee.Reducer.mean(), '', true)
    .combine(ee.Reducer.stdDev(), '', true),
  geometry: smap_pixel.geometry(),
  scale: 10,
  maxPixels: 1e9
});

print('SMAP NDVI stats:', stats);


// -------------------------
// 11. EXPORT NDVI PIXELS
// -------------------------

Export.table.toDrive({
  collection: ndviSamples,
  description: 'SMAP_NDVI_distribution_AugNov_2022',
  fileFormat: 'CSV'
});


// -------------------------
// 12. EXPORT NDVI IMAGE
// -------------------------

Export.image.toDrive({
  image: ndviImage,
  description: 'SMAP_NDVI_composite_AugNov_2022',
  region: smap_pixel.geometry(),
  scale: 10,
  maxPixels: 1e13
});