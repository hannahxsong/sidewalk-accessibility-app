import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "@kepler.gl/styles";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap } from "@kepler.gl/actions";
import { processGeojson } from "@kepler.gl/processors";
import "./App.css";

if (typeof window !== "undefined") {
  window.global = window;
}

export default function App() {
  const dispatch = useDispatch();
  const [widthValue, setWidthValue] = useState(1.2);
  const [inclineValue, setInclineValue] = useState(8);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/sidewalk_inventory.json");
        const rawData = await response.json();
        
        dispatch(
          addDataToMap({
            datasets: [{
              info: { label: "Boston Sidewalks", id: "boston_sidewalks" },
              data: processGeojson(rawData)
            }],
            options: { centerMap: true },
            config: { 
              mapStyle: { styleType: "dark" } 
            }
          })
        );
      } catch (err) {
        console.error("Map Load Error:", err);
      }
    }
    loadData();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        {/* Your Custom Accessibility Sidebar */}
        <aside className="accessibility-overlay">
          <h2 className="overlay-title">Accessibility</h2>
          
          <div className="filter-group">
            <span className="group-label">Floor types</span>
            <div className="checkbox-list">
              <label><input type="checkbox" /> Sand</label>
              <label><input type="checkbox" /> Concrete</label>
              <label><input type="checkbox" /> Asphalt</label>
              <label><input type="checkbox" /> Brick</label>
            </div>
          </div>

          <div className="filter-group">
            <span className="group-label">Width (m): {widthValue}</span>
            <input 
              type="range" min="0.5" max="5" step="0.1" 
              value={widthValue} 
              onChange={(e) => setWidthValue(e.target.value)} 
            />
          </div>

          <div className="filter-group">
            <span className="group-label">Hazards</span>
            <div className="checkbox-list">
              <label><input type="checkbox" /> Snow</label>
              <label><input type="checkbox" /> Rain</label>
              <label><input type="checkbox" /> Construction</label>
              <label><input type="checkbox" /> Other</label>
            </div>
          </div>

          <div className="filter-group">
            <span className="group-label">Incline (%): {inclineValue}</span>
            <input 
              type="range" min="0" max="20" step="0.5" 
              value={inclineValue} 
              onChange={(e) => setInclineValue(e.target.value)} 
            />
          </div>

          <div className="filter-group last">
            <label className="bold-label">
              <input type="checkbox" /> Avoid Stairs
            </label>
          </div>
        </aside>

        {/* The Fullscreen Map */}
        <KeplerGl
          id="map"
          mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          width={window.innerWidth}
          height={window.innerHeight}
        />
      </div>
    </ThemeProvider>
  );
}