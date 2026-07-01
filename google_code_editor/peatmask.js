/////////////////////// 1. LOAD SMAP (single image) ///////////////////////
var dataset = ee.ImageCollection('NASA/SMAP/SPL4SMGP/008')
  .filterDate('2023-06-01', '2023-06-04')  // just a few days to get one good image
  .first();

/////////////////////// 2. EXTRACT PEAT MASK ///////////////////////
var peat = dataset.select('depth_to_water_table_from_surface_in_peat');
var peatMask = peat.mask().unmask(0).gt(0).rename('peat_mask');

/////////////////////// 3. VISUALIZE ///////////////////////
Map.setCenter(0, 15, 2);
Map.addLayer(
  peatMask,
  {min: 0, max: 1, palette: ['white', '#3d2b1f']},
  'SMAP Peat Mask (0/1)'
);

/////////////////////// 4. EXPORT GLOBAL GeoTIFF ///////////////////////
Export.image.toDrive({
  image: peatMask.toByte(),
  description: 'SMAP_Peat_Mask',
  folder: 'gee',
  fileNamePrefix: 'SMAP_Peat_Mask',
  region: ee.Geometry.Rectangle([-180, -90, 180, 90], null, false),  // false = planar
  scale: 11000,
  crs: 'EPSG:4326',
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});