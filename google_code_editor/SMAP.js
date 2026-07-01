/////////////////////// 1. LOAD ZHURUCAY ///////////////////////

var zhurucay = zhurucay;
Map.addLayer(zhurucay, {color: 'blue'}, 'Zhurucay');

/////////////////////// 2. DEFINE POINT ///////////////////////

var point = ee.Geometry.Point([-79.234636, -3.062424]);
Map.centerObject(point, 12);
Map.addLayer(point, {color: 'red'}, 'Sample Point');

/////////////////////// 3. DATE RANGE ///////////////////////

var start = ee.Date('2024-09-10');
var end   = ee.Date('2026-03-26');

/////////////////////// 4. LOAD SMAP DATA ///////////////////////

var smap = ee.ImageCollection("NASA/SMAP/SPL4SMGP/008")
  .filterBounds(point)
  .filterDate(start, end)
  .select('sm_rootzone');

print('SMAP collection:', smap);

/////////////////////// 5. VISUALIZE FIRST IMAGE ///////////////////////

var firstImage = ee.Image(smap.first());

Map.addLayer(
  firstImage,
  {
    min: 0,
    max: 1,
    palette: ['brown', 'yellow', 'green', 'blue']
  },
  'SMAP Rootzone'
);

/////////////////////// 6. GET PIXEL VALUE AT POINT ///////////////////////

// Use reduceRegion to get the value at the point
var pixelValue = firstImage.reduceRegion({
  reducer: ee.Reducer.first(),
  geometry: point,
  scale: 9000,
  maxPixels: 1e13
}).get('sm_rootzone');

print('Pixel value:', pixelValue);

// Convert to number for comparison
var valueNumber = ee.Number(pixelValue);

/////////////////////// 7. EXTRACT PIXEL AS POLYGON (FIXED) ///////////////////////
// Pixel size from the transform
var xRes = 0.09516256938937351;
var yRes = 0.09516149300142858;
var xOrigin = -180;
var yOrigin = 85.0445018795655;

var lon = -79.234636;
var lat = -3.062424;

// Snap to pixel grid by finding which pixel the point falls in
var col = Math.floor((lon - xOrigin) / xRes);
var row = Math.floor((yOrigin - lat) / yRes);

// Pixel bounds
var xMin = xOrigin + col * xRes;
var xMax = xMin + xRes;
var yMax = yOrigin - row * yRes;
var yMin = yMax - yRes;

var pixelPolygon = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.Rectangle([xMin, yMin, xMax, yMax]),
    {soil_moisture: pixelValue}
  )
]);

Map.addLayer(pixelPolygon, {color: 'yellow'}, 'SMAP Pixel Polygon');
print('Pixel bounds:', [xMin, yMin, xMax, yMax]);
print('Selected pixel polygon:', pixelPolygon);

/////////////////////// 8. EXTRACT TIME SERIES ///////////////////////

var timeSeries = smap.map(function(img) {
  var value = img.reduceRegion({
    reducer: ee.Reducer.first(),
    geometry: point,
    scale: 9000,
    maxPixels: 1e13
  });

  var date = ee.Date(img.get('system:time_start'));

  return ee.Feature(null, {
    date: date.format('YYYY-MM-dd'),
    timestamp: date.format('YYYY-MM-dd HH:mm:ss'),
    soil_moisture: value.get('sm_rootzone')
  });
});

print('Time series:', timeSeries);

/////////////////////// 9. EXPORT CSV ///////////////////////

Export.table.toDrive({
  collection: timeSeries,
  description: 'SMAP_pixel_timeseries',
  folder: 'GEE_SMAP',
  fileNamePrefix: 'SMAP_timeseries',
  fileFormat: 'CSV'
});

/////////////////////// 10. EXPORT PIXEL SHAPE ///////////////////////

Export.table.toDrive({
  collection: pixelPolygon,
  description: 'SMAP_pixel_polygon',
  folder: 'GEE_SMAP',
  fileNamePrefix: 'SMAP_pixel',
  fileFormat: 'SHP'
});
