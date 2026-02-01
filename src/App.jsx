import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "@kepler.gl/styles";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap, setFilter } from "@kepler.gl/actions";
import { processGeojson } from "@kepler.gl/processors";
import * as turf from "@turf/turf";
import createGraph from 'ngraph.graph';
import path from 'ngraph.path';
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
  const keplerState = useSelector(state => state.keplerGl.map);

  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [rawSidewalkData, setRawSidewalkData] = useState(null);

  const [widthValue, setWidthValue] = useState(1.2);
  const [inclineValue, setInclineValue] = useState(8.0);
  const [riskValue, setRiskValue] = useState(0);
  const [selectedMaterials, setSelectedMaterials] = useState(["CC", "CB", "BC", "BR", "Other"]);

  // Defined outside to ensure IDs like 'r_f' are identical across all dispatches
  const INITIAL_CONFIG = {
    visState: {
      layers: [{
        id: "sidewalk_layer", 
        type: "geojson",
        config: { 
          dataId: "boston_sidewalks", 
          label: "Sidewalks", 
          colorField: { name: "MATERIAL", type: "string" }, // Lock color to Material
          visConfig: { 
            thickness: 1, 
            opacity: 0.3,
            colorRange: {
                name: 'Custom Palette',
                type: 'qualitative',
                category: 'Uber',
                colors: ['#5A1846', '#900C3F', '#C70039', '#E36139', '#FFC300']
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
        geocoder: { enabled: true }, 
        tooltip: { enabled: true } 
      }
    },
    mapStyle: { styleType: "voyager" }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/sidewalk_inventory.json");
        const rawData = await response.json();
        setRawSidewalkData(rawData);
        
        const processedFeatures = rawData.features.map(f => ({
          ...f,
          properties: { 
            ...f.properties, 
            MATERIAL: (f.properties.MATERIAL || "Other").trim(),
            Material_Full: materialNames[f.properties.MATERIAL?.trim()] || "Other",
            SWK_WIDTH: parseFloat(f.properties.SWK_WIDTH) || 0,
            SWK_SLOPE: parseFloat(f.properties.SWK_SLOPE) || 0,
            SCI_VAL: parseFloat(f.properties.SCI) || 0
          }
        }));

        dispatch(addDataToMap({
          datasets: [{
            info: { label: "Boston Sidewalks", id: "boston_sidewalks" },
            data: processGeojson({ ...rawData, features: processedFeatures })
          }],
          options: { centerMap: true, keepExistingConfig: false },
          config: INITIAL_CONFIG
        }));
      } catch (err) { console.error(err); }
    }
    loadData();
  }, [dispatch]);

  const resetMap = () => {
    setStartPoint(null);
    setEndPoint(null);
    setWidthValue(1.2);
    setInclineValue(8.0);
    setRiskValue(0);
    setSelectedMaterials(["CC", "CB", "BC", "BR", "Other"]);

    // Force a full re-dispatch to clean the slate and keep IDs stable
    dispatch(addDataToMap({
      datasets: [{
        info: { label: "Boston Sidewalks", id: "boston_sidewalks" },
        data: processGeojson(rawSidewalkData)
      }],
      options: { centerMap: false, keepExistingConfig: false },
      config: INITIAL_CONFIG
    }));
  };

  const calculateRoute = () => {
    if (!startPoint || !endPoint || !rawSidewalkData) return;

    const line = turf.lineString([[startPoint.lng, startPoint.lat], [endPoint.lng, endPoint.lat]]);
    const bbox = turf.bbox(turf.buffer(line, 1, { units: 'kilometers' }));

    const localFeatures = rawSidewalkData.features.filter(f => {
      const cent = turf.centroid(f).geometry.coordinates;
      const inBbox = cent[0] >= bbox[0] && cent[1] >= bbox[1] && cent[0] <= bbox[2] && cent[1] <= bbox[3];
      if (!inBbox) return false;

      const w = parseFloat(f.properties.SWK_WIDTH) || 0;
      const s = parseFloat(f.properties.SWK_SLOPE) || 0;
      const sc = parseFloat(f.properties.SCI) || 0;
      const m = (f.properties.MATERIAL || "Other").trim();
      return w >= widthValue && s <= inclineValue && sc >= riskValue && selectedMaterials.includes(m);
    });

    if (localFeatures.length === 0) {
      alert("No accessible sidewalks found.");
      return;
    }

    const graph = createGraph();
    const nodes = localFeatures.map((f, i) => ({ 
      id: f.properties.OBJECTID || `node-${i}`, 
      coords: turf.centroid(f).geometry.coordinates,
      feature: f
    }));

    nodes.forEach(n => graph.addNode(n.id, n.coords));
    nodes.forEach((node, i) => {
      const nearest = nodes
        .map((target, j) => ({ id: target.id, dist: turf.distance(node.coords, target.coords) }))
        .filter(d => d.dist > 0)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 5); 
      nearest.forEach(n => graph.addLink(node.id, n.id, { weight: n.dist }));
    });

    const startNode = nodes.reduce((p, c) => turf.distance([startPoint.lng, startPoint.lat], c.coords) < turf.distance([startPoint.lng, startPoint.lat], p.coords) ? c : p);
    const endNode = nodes.reduce((p, c) => turf.distance([endPoint.lng, endPoint.lat], c.coords) < turf.distance([endPoint.lng, endPoint.lat], p.coords) ? c : p);

    const pathFinder = path.aStar(graph, { distance(f, t, l) { return l.data.weight; } });
    const foundPath = pathFinder.find(startNode.id, endNode.id);

    if (foundPath && foundPath.length > 0) {
      const orderedPath = foundPath.reverse().map(node => nodes.find(n => n.id === node.id).feature);
      const highFidelityCoords = [];
      for (let i = 0; i < orderedPath.length; i++) {
        const currentFeat = orderedPath[i];
        const nextFeat = orderedPath[i + 1];
        if (nextFeat) {
          const nextCentroid = turf.centroid(nextFeat);
          const exploded = turf.explode(currentFeat);
          const nearestToNext = turf.nearestPoint(nextCentroid, exploded);
          highFidelityCoords.push(nearestToNext.geometry.coordinates);
        } else {
          highFidelityCoords.push(turf.centroid(currentFeat).geometry.coordinates);
        }
      }
      const routeLine = turf.lineString(highFidelityCoords);

      dispatch(addDataToMap({
        datasets: [{ 
          info: { label: "Grounded Path", id: "active_route" }, 
          data: processGeojson(turf.featureCollection([routeLine])) 
        }],
        config: { 
          visState: { 
            layers: [{ 
              id: "r_l", type: "geojson", 
              config: { 
                dataId: "active_route", label: "Walking Path",
                visConfig: { thickness: 5, strokeColor: [241, 196, 15], opacity: 1 }
              } 
            }],
            interactionConfig: { geocoder: { enabled: true } }
          } 
        }
      }));
    } else { alert("Could not connect segments."); }
  };

  const handleMaterialChange = (code) => {
    const newSelection = selectedMaterials.includes(code) ? selectedMaterials.filter(item => item !== code) : [...selectedMaterials, code];
    setSelectedMaterials(newSelection);
    dispatch(setFilter(0, 'value', newSelection.length === 0 ? ["NONE"] : newSelection));
  };

  const togglePoint = (type) => {
    const { longitude, latitude } = keplerState.mapState;
    if (type === 'start') setStartPoint(startPoint ? null : { lng: longitude, lat: latitude });
    else setEndPoint(endPoint ? null : { lng: longitude, lat: latitude });
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        <aside className="accessibility-overlay">
          <h2 className="overlay-title">Routing</h2>
          <div className="routing-controls">
            <button className="nav-btn" onClick={() => togglePoint('start')}>{startPoint ? "Start Set" : "Set Start Location"}</button>
            <button className="nav-btn" onClick={() => togglePoint('end')}>{endPoint ? "End Set" : "Set End Location"}</button>
            {startPoint && endPoint && <button className="find-route-btn" onClick={calculateRoute}>Find Accessible Route</button>}
            {(startPoint || endPoint) && (
              <button className="clear-btn" onClick={resetMap}>Clear & Reset All</button>
            )}
          </div>
          <hr className="divider" />
          <h2 className="overlay-title">Accessibility Filters</h2>
          <div className="filter-group">
            <span className="group-label">Min Condition (SCI): {riskValue}</span>
            <input type="range" min="0" max="100" className="custom-slider" value={riskValue} onChange={(e) => {
              const val = Number(e.target.value);
              setRiskValue(val);
              dispatch(setFilter(3, 'value', [val, 100]));
            }} />
          </div>
          <div className="filter-group">
            <span className="group-label">Floor types</span>
            <div className="checkbox-list">
              {["CC", "BC", "BR", "Other"].map(m => (
                <label key={m}><input type="checkbox" checked={selectedMaterials.includes(m)} onChange={() => handleMaterialChange(m)} /> {m === "CC" ? "Concrete" : m === "BC" ? "Asphalt" : m === "BR" ? "Brick" : "Other"}</label>
              ))}
            </div>
          </div>
          <div className="filter-group">
            <span className="group-label">Max Incline: {inclineValue}%</span>
            <input type="range" min="0" max="20" step="0.1" className="custom-slider" value={inclineValue} onChange={(e) => {
              const val = Number(e.target.value);
              setInclineValue(val);
              dispatch(setFilter(1, 'value', [0, val]));
            }} />
          </div>
          <div className="filter-group">
            <span className="group-label">Min Width: {widthValue}ft</span>
            <input type="range" min="0" max="15" step="0.1" className="custom-slider" value={widthValue} onChange={(e) => {
              const val = Number(e.target.value);
              setWidthValue(val);
              dispatch(setFilter(2, 'value', [val, 50]));
            }} />
          </div>
        </aside>
        <KeplerGl id="map" mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} width={window.innerWidth} height={window.innerHeight} style={{position: 'absolute', top: 0, left: 0}} />
      </div>
    </ThemeProvider>
  );
}