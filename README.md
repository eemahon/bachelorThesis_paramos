# Remote Sensing and Field-Based Assessment of Soil Water Storage and Soil Moisture in Fire-Affected Páramo Ecosystems of Southern Ecuador

**Bachelor Thesis**  
**Erin Mahon**  
B.Sc. Geography  
Geographisches Institut, Ruhr University Bochum  

**First Supervisor:** Jun.-Prof. Dr. Valerie Graw  
**Second Supervisor:** Dr. José Jara Alvear

---

## Project Overview

This repository contains the analysis scripts, figure generation notebooks, and Google Earth Engine (GEE) scripts used for my bachelor thesis investigating the performance of global soil property and soil moisture products in the southern Ecuadorian páramo.

The study combines **field observations**, **remote sensing products**, and **global geospatial datasets** to evaluate whether globally available datasets adequately represent the hydrological characteristics of tropical alpine ecosystems.

The main objectives were to:

- Evaluate the accuracy of **SoilGrids** hydraulic property predictions using laboratory measurements of volcanic Andosol samples.
- Evaluate the performance of **NASA SMAP Level 4 Root-Zone Soil Moisture** against in-situ TDR observations.
- Assess whether the SMAP validation site is representative of the surrounding landscape through analyses of vegetation, land cover, and topography.
- Investigate burn severity and post-fire environmental conditions within two burned páramo catchments.

---

## Data Sources

The project combines multiple datasets:

### Field observations
- Soil hydraulic property measurements (bulk density, field capacity, wilting point, saturated water content)
- In-situ TDR root-zone soil moisture observations
- Soil sampling data from the Universidad de Cuenca Hydrology Laboratory

### Remote sensing
- NASA SMAP Level 4 Root-Zone Soil Moisture
- Sentinel-2 imagery
- Copernicus World Topography for DEM

### Global datasets
- SoilGrids 2.0

### Study Area data
- IERSE provided various vector datasets (catchments, rivers, roads, settlements)

---

# Repository Structure

```
analysis/
    SoilGrids validation
    SMAP validation
    Burned vs. unburned analyses
    NBR calculations
    Results figures

figures/
    Map creation
    Study area figures
    Fire site figures

google_code_editor/
    Google Earth Engine scripts

data/
    Geospatial datasets
    Processed analysis tables

datos_martha/
    Laboratory soil measurements

Llaviuco/
Yanasacha/
    Fire perimeter shapefiles
```

---

# Analysis Workflow

## 1. SoilGrids Validation

Notebook:

- `analysis/soilgrids_vwc.ipynb`

This notebook compares SoilGrids predictions against field measurements for:

- Bulk density
- Field capacity
- Wilting point
- Saturated water content
- Available water capacity

Statistical analyses include:

- Paired statistical tests
- Error metrics
- Scatter plots
- Spatial visualization

---

## 2. SMAP Root-Zone Soil Moisture Validation

Notebook:

- `analysis/smap_soilmoisture.ipynb`

Compares SMAP Level 4 Root-Zone Soil Moisture (0–100 cm) with in-situ TDR observations from the Zhurucay catchment.

Analyses include:

- Daily and monthly comparisons
- Correlation analysis
- RMSE
- Bias
- Standardized anomaly (z-score) comparison
- Time series visualization

---

## 3. Representativeness Analysis

Notebook:

- `analysis/smap_landuse.ipynb`

Evaluates whether the SMAP validation site is representative of the surrounding SMAP pixel.

Analyses include:

- Sentinel-2 RGB composite
- NDVI calculation
- Dynamic World land cover classification
- Elevation distribution
- Slope distribution
- Comparison between the study catchment and the complete SMAP footprint

This analysis provides context for interpreting the SMAP validation results by assessing how representative the field site is of the larger satellite footprint.

---

## 4. Burn Severity Analysis

Notebooks:

- `analysis/burned_vs_unburned.ipynb`
- `analysis/nbr.ipynb`

These notebooks evaluate fire impacts within the Llaviuco and Yanasacha páramo catchments through:

- Normalized Burn Ratio (NBR)
- Burned vs. unburned comparisons
- Vegetation response analyses

*(not used in the final thesis)*
---

## 5. Figure Generation

The notebooks inside `figures/` generate the maps and figures used throughout the thesis, including:

- Study area maps
- Fire site maps
- Sampling locations
- Overview figures

---

# Google Earth Engine Scripts

The `google_code_editor/` folder contains the JavaScript scripts used to export remote sensing products.

Scripts include:

- `SMAP.js` – SMAP Level 4 soil moisture extraction
- `NDVI_sen2.js` – Sentinel-2 NDVI generation
- `peatmask.js` – Global peatland mask visualization
- `precip_anomaly.js` – CHIRPS precipitation anomaly calculations *(not used in the final thesis)*
- `precip_chrps.js` – CHIRPS precipitation export *(not used in the final thesis)*

---

# Notes

- This repository represents the complete computational workflow used for the thesis.
- It contains analysis notebooks, figure generation scripts, intermediate outputs, and processed datasets.
- Some geospatial datasets are derived from OpenStreetMap and remain subject to their original licenses.
- Large raw datasets and proprietary laboratory data are not included where redistribution is restricted.



## Citation
If you use this repository or adapt parts of the workflow, please cite the associated bachelor thesis.