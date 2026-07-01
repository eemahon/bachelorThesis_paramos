# Bachelor Thesis 
## Erin Mahon
#### B.Sc. Geography
#### Geographisches Institut Ruhr Universität Bochum
#### Title: Remote Sensing and Field-Based Assessment of Soil Water Storage and Soil Moisture in Fire-Affected Paramo Ecosystems of Southern Ecuador 
#### First Supervisor: Jun-Prof. Valerie Graw
#### Second Supervisor: Dr. José Jara Alvear

### Project Overview
This repository contains the python notebooks used for analyzing remote sensing and global products with local data in southern Ecuadorian Andean catchments. The project combines:

- Field observations (soil moisture and volumetric water content)
- Remote sensing products (NASA SMAP)
- Global digital soil mapping system (SoilGrids)
- Various geodata (basins, rivers, land cover, settlements, DEM-derived products)

### Statistical analysis list: 
- comparison of Soilgrids vs local volumetric water content (VWC) and bulk density measurements
- comparison of VWC and bulk density of burned vs unburned areas in Llaviuco and Yanasacha (Tomebamba and Yanuncay subbasins)
- comparison of SMAP rootzone (0-100cm) soil moisture and local TDR sensors (Zhurucay subbasin)

### Repository Structure

- analysis/: Analysis notebooks (Soilgrids, SMAP, Burned vs Unburned and NBR calculations)
- figures/: Figure-generation notebooks and map outputs
- data/: Core geospatial and tabular inputs used in analyses
- TDR_data/: Time-series and derived data products (including SMAP and precipitation anomaly csvs)
- google_code_editor/: Google Earth Engine JavaScript scripts (for SMAP and CHIRPS)
- datos_martha/: data from Martha Days soil sampling with results processed by the Hydrology Lab of the Departamento de Recurso Hidricos y Ciencias Ambientales de la Universidad de Cuenca
- Yanasacha/, Llaviuco/: shapes of the 2024 fire sites
- Zwischenergebnisse/: Intermediate outputs mainly for the TDR/SMAP analysis

## Analysis and Scripts

#### Notebooks
- analysis/burned_vs_unburned.ipynb: Burned vs unburned comparisons
- analysis/nbr.ipynb: NBR-related calculations
- analysis/results_sm.ipynb: Soil moisture result summaries
- analysis/results_vwc.ipynb: Volumetric water content result summaries
- figures/fire_sites.ipynb, figures/introduction_study_maps.ipynb, figures/study_area.ipynb: Figure and map creation

#### Google Earth Engine Scripts
- google_code_editor/peatmask.js
- google_code_editor/precip_anomaly.js
- google_code_editor/precip_chrps.js
- google_code_editor/SMAP.js

### Notes on Data Sources and Licensing
- Some exported geospatial data in data/ includes OpenStreetMap-derived products (see data/Readme.txt).
- Use and redistribution should respect each upstream data provider license (for example ODbL for OSM-derived exports and original licenses for satellite and climatology products).

### Status
This repository is an active research workspace and includes raw inputs, intermediate files, scripts, and result summaries.
