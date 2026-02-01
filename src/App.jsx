import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "@kepler.gl/styles";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap, setFilter } from "@kepler.gl/actions";
import { processGeojson } from "@kepler.gl/processors";
import "./App.css";

if (typeof window !== "undefined") {
  window.global = window;
}

const materialNames = {
  "CC": "Cement Concrete",
  "CB": "Concrete Block",
  "BC": "Bituminous Concrete (Asphalt)",
  "BR": "Brick",
  "Other": "Other/Utility"
};

export default function App() {
  const dispatch = useDispatch();

  const [widthValue, setWidthValue] = useState(1.2);
  const [inclineValue, setInclineValue] = useState(8.0);
  const [riskValue, setRiskValue] = useState(0);
  const [selectedMaterials, setSelectedMaterials] = useState(["CC", "CB", "BC", "BR", "Other"]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/sidewalk_inventory.json");
        const rawData = await response.json();
        
        const processedFeatures = rawData.features.map(f => {
          const width = parseFloat(f.properties.SWK_WIDTH) || 0;
          const slope = parseFloat(f.properties.SWK_SLOPE) || 0;
          const sci = parseFloat(f.properties.SCI) || 0;
          let materialCode = f.properties.MATERIAL ? f.properties.MATERIAL.trim() : "Other";
          if (!["CC", "CB", "BC", "BR"].includes(materialCode)) materialCode = "Other";
          
          return {
            ...f,
            properties: {
              ...f.properties,
              MATERIAL: materialCode,
              Material_Full: materialNames[materialCode],
              SWK_WIDTH: width,
              SWK_SLOPE: slope,
              SCI_VAL: sci
            }
          };
        });

        dispatch(
          addDataToMap({
            datasets: [{
              info: { label: "Boston Sidewalks", id: "boston_sidewalks" },
              data: processGeojson({ ...rawData, features: processedFeatures })
            }],
            options: { centerMap: true, keepExistingConfig: false },
            config: { 
              visState: {
                layers: [{
                  id: "sidewalk_layer",
                  type: "geojson",
                  config: {
                    dataId: "boston_sidewalks",
                    label: "Sidewalk Paths",
                    isVisible: true,
                    // We remove colorField entirely to prevent any automatic filling
                    strokeColorField: { name: "MATERIAL", type: "string" },
                    visConfig: {
                      thickness: 2.5,
                      strokeOpacity: 1,
                      filled: false, 
                      outline: true,
                      // We set the standard 'opacity' (which controls fill) to 0
                      opacity: 0,
                      // We also set the 'color' to a transparent value
                      color: [0, 0, 0, 0], 
                      colorRange: {
                        name: "Custom Stroke Colors",
                        type: "qualitative",
                        colors: ["#2ecc71", "#f1c40f", "#e74c3c", "#95a5a6"] 
                      }
                    }
                  }
                }],
                filters: [
                  { id: 'm_f', dataId: ['boston_sidewalks'], name: ['MATERIAL'], type: 'multiSelect', value: ["CC", "CB", "BC", "BR", "Other"] },
                  { id: 'i_f', dataId: ['boston_sidewalks'], name: ['SWK_SLOPE'], type: 'range', value: [0, 8.0] },
                  { id: 'w_f', dataId: ['boston_sidewalks'], name: ['SWK_WIDTH'], type: 'range', value: [1.2, 50] },
                  { id: 'r_f', dataId: ['boston_sidewalks'], name: ['SCI_VAL'], type: 'range', value: [0, 100] }
                ],
                interactionConfig: {
                  tooltip: {
                    fieldsToShow: {
                      "boston_sidewalks": [
                        { name: "Material_Full", label: "Material" },
                        { name: "SWK_WIDTH", label: "Width (ft)" },
                        { name: "SWK_SLOPE", label: "Slope (%)" },
                        { name: "SCI_VAL", label: "Hazard Level" }
                      ]
                    },
                    enabled: true
                  },
                  geocoder: { enabled: true }
                }
              },
              mapStyle: { styleType: "voyager" } 
            }
          })
        );
      } catch (err) {
        console.error("Map Load Error:", err);
      }
    }
    loadData();
  }, [dispatch]);

  const handleMaterialChange = (code) => {
    const isAlreadySelected = selectedMaterials.includes(code);
    const newSelection = isAlreadySelected
      ? selectedMaterials.filter(item => item !== code)
      : [...selectedMaterials, code];

    setSelectedMaterials(newSelection);
    const filterValue = newSelection.length === 0 ? ["NONE"] : newSelection;
    dispatch(setFilter(0, 'value', filterValue));
  };

  const handleRiskChange = (e) => {
    const val = parseFloat(e.target.value);
    setRiskValue(val);
    dispatch(setFilter(3, 'value', [val, 100]));
  };

  const handleInclineChange = (e) => {
    const val = parseFloat(e.target.value);
    setInclineValue(val);
    dispatch(setFilter(1, 'value', [0, val]));
  };

  const handleWidthChange = (e) => {
    const val = parseFloat(e.target.value);
    setWidthValue(val);
    dispatch(setFilter(2, 'value', [val, 50]));
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <aside className="accessibility-overlay">
          <h2 className="overlay-title">Accessibility</h2>
          
          <div className="filter-group">
            <span className="group-label">Min Condition (SCI): {riskValue}</span>
            <input type="range" min="0" max="100" step="1" className="custom-slider" 
              value={riskValue} onChange={handleRiskChange} />
          </div>

          <div className="filter-group">
            <span className="group-label">Floor types</span>
            <div className="checkbox-list">
              <label><input type="checkbox" checked={selectedMaterials.includes("CC")} onChange={() => handleMaterialChange("CC")} /> Concrete</label>
              <label><input type="checkbox" checked={selectedMaterials.includes("BC")} onChange={() => handleMaterialChange("BC")} /> Asphalt</label>
              <label><input type="checkbox" checked={selectedMaterials.includes("BR")} onChange={() => handleMaterialChange("BR")} /> Brick</label>
              <label><input type="checkbox" checked={selectedMaterials.includes("Other")} onChange={() => handleMaterialChange("Other")} /> Other</label>
            </div>
          </div>

          <div className="filter-group">
            <span className="group-label">Max Incline (%): {inclineValue}</span>
            <input type="range" min="0" max="20" step="0.1" className="custom-slider" 
              value={inclineValue} onChange={handleInclineChange} />
          </div>

          <div className="filter-group">
            <span className="group-label">Min Width (ft): {widthValue}</span>
            <input type="range" min="0" max="15" step="0.1" className="custom-slider" 
              value={widthValue} onChange={handleWidthChange} />
          </div>
        </aside>

        <KeplerGl id="map" mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} width={window.innerWidth} height={window.innerHeight} />
      </div>
    </ThemeProvider>
  );
}