import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "@kepler.gl/styles";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap, setFilter, updateLayer, updateLayerVisConfig, removeLayer } from "@kepler.gl/actions";
import { processGeojson } from "@kepler.gl/processors";
import * as turf from "@turf/turf";
import createGraph from 'ngraph.graph';
import path from 'ngraph.path';
import AboutUs from "./AboutUs";
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showAboutUs, setShowAboutUs] = useState(false);
  const [routeStats, setRouteStats] = useState(null); // { distance, avgIncline, avgWidth }

  // Defined outside to ensure IDs like 'r_f' are identical across all dispatches
  const INITIAL_CONFIG = {
    visState: {
      layers: [{
        id: "sidewalk_layer", 
        type: "geojson",
        isVisible: true,
        config: { 
          dataId: "boston_sidewalks", 
          label: "Sidewalks", 
          colorField: { name: "_fixedColor", type: "string" }, // Fixed color field
          visConfig: { 
            thickness: 0.05, 
            opacity: 0.3,
            colorRange: {
              name: 'Custom Palette',
              type: 'qualitative',
              category: 'Uber',
              colors: ['#50C878'] // Emerald green
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
        tooltip: { 
          enabled: true,
          config: {
            fieldsToShow: {
              boston_sidewalks: ['MATERIAL', 'SWK_SLOPE', 'SWK_WIDTH', 'SCI_VAL']
            },
            compareMode: false
          }
        } 
      }
    },
    uiState: {
      readOnly: true,
      activeSidePanel: null, // Hide the side panel/legend
      currentModal: null,
      mapControls: {
        visibleLayers: { show: false },
        mapLegend: { show: false },
        toggle3d: { show: false },
        splitMap: { show: false }
      }
    },
    mapStyle: { styleType: "voyager" }
  };

  useEffect(() => {
    // Center the geocoder/search bar (positioned to avoid logo)
    const style = document.createElement('style');
    style.textContent = `
      .kg-geocoder-input-container,
      .kg-geocoder {
        left: 50% !important;
        transform: translateX(-50%) !important;
        top: 20px !important;
        right: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Remove route layers if they exist when not needed
  useEffect(() => {
    if (!keplerState?.visState?.layers) return;
    
    const routeLayer = keplerState.visState.layers.find(l => l.id === 'r_l');
    const markersLayer = keplerState.visState.layers.find(l => l.id === 'route_markers_layer');
    
    // If route layers exist but we don't have route stats, remove them
    if ((routeLayer || markersLayer) && !routeStats && !startPoint && !endPoint) {
      if (routeLayer) {
        try {
          dispatch(removeLayer('r_l'));
        } catch (e) {}
      }
      if (markersLayer) {
        try {
          dispatch(removeLayer('route_markers_layer'));
        } catch (e) {}
      }
    }
  }, [keplerState, routeStats, startPoint, endPoint, dispatch]);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/sidewalk_inventory.json");
        const rawData = await response.json();
        setRawSidewalkData(rawData);
        
        const processedFeatures = rawData.features.map(f => {
          // Convert polygons to linestrings to remove fill
          let geometry = f.geometry;
          if (geometry.type === 'Polygon') {
            geometry = {
              type: 'LineString',
              coordinates: geometry.coordinates[0]
            };
          } else if (geometry.type === 'MultiPolygon') {
            geometry = {
              type: 'MultiLineString',
              coordinates: geometry.coordinates.map(poly => poly[0])
            };
          }
          
          return {
            ...f,
            geometry,
            properties: { 
              _fixedColor: "fixed", // ALWAYS first - constant field for fixed color (required for coloring)
              ...f.properties, 
              MATERIAL: (f.properties.MATERIAL || "Other").trim(),
              Material_Full: materialNames[f.properties.MATERIAL?.trim()] || "Other",
              SWK_WIDTH: parseFloat(f.properties.SWK_WIDTH) || 0,
              SWK_SLOPE: parseFloat(f.properties.SWK_SLOPE) || 0,
              SCI_VAL: parseFloat(f.properties.SCI) || 0
            }
          };
        });

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
    setRouteStats(null);

    if (!rawSidewalkData) return;

    // Remove route layers first
    try {
      dispatch(removeLayer('r_l')); // Route line layer
      dispatch(removeLayer('route_markers_layer')); // Route markers layer
    } catch (e) {
      // Layers might not exist, that's okay
    }

    // Process features exactly like in the initial load
    const processedFeatures = rawSidewalkData.features.map(f => {
      // Convert polygons to linestrings to remove fill
      let geometry = f.geometry;
      if (geometry.type === 'Polygon') {
        geometry = {
          type: 'LineString',
          coordinates: geometry.coordinates[0]
        };
      } else if (geometry.type === 'MultiPolygon') {
        geometry = {
          type: 'MultiLineString',
          coordinates: geometry.coordinates.map(poly => poly[0])
        };
      }
      
      return {
        ...f,
        geometry,
        properties: { 
          _fixedColor: "fixed", // ALWAYS first - constant field for fixed color
          ...f.properties, 
          MATERIAL: (f.properties.MATERIAL || "Other").trim(),
          Material_Full: materialNames[f.properties.MATERIAL?.trim()] || "Other",
          SWK_WIDTH: parseFloat(f.properties.SWK_WIDTH) || 0,
          SWK_SLOPE: parseFloat(f.properties.SWK_SLOPE) || 0,
          SCI_VAL: parseFloat(f.properties.SCI) || 0
        }
      };
    });

    // Reset with full config to ensure emerald green color is set from the start
    dispatch(addDataToMap({
      datasets: [{
        info: { label: "Boston Sidewalks", id: "boston_sidewalks" },
        data: processGeojson({ ...rawSidewalkData, features: processedFeatures })
      }],
      options: { centerMap: false, keepExistingConfig: false },
      config: INITIAL_CONFIG
    }));

    // Explicitly reset all filters after a brief delay to ensure config is applied
    // The INITIAL_CONFIG should handle the layer configuration, but we ensure filters are set
    setTimeout(() => {
      dispatch(setFilter(0, 'value', ["CC", "CB", "BC", "BR", "Other"])); // Material filter
      dispatch(setFilter(1, 'value', [0, 8.0])); // Incline filter
      dispatch(setFilter(2, 'value', [1.2, 50])); // Width filter
      dispatch(setFilter(3, 'value', [0, 100])); // SCI filter
    }, 100);
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
      setRouteStats(null);
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
      const routeLine = turf.lineString(highFidelityCoords, { _fixedColor: "fixed" });
      
      // Calculate route statistics
      const totalDistance = turf.length(routeLine, { units: 'miles' }); // Distance in miles
      const totalIncline = orderedPath.reduce((sum, feat) => {
        return sum + (parseFloat(feat.properties.SWK_SLOPE) || 0);
      }, 0);
      const avgIncline = orderedPath.length > 0 ? totalIncline / orderedPath.length : 0;
      
      const totalWidth = orderedPath.reduce((sum, feat) => {
        return sum + (parseFloat(feat.properties.SWK_WIDTH) || 0);
      }, 0);
      const avgWidth = orderedPath.length > 0 ? totalWidth / orderedPath.length : 0;
      
      setRouteStats({
        distance: totalDistance,
        avgIncline: avgIncline,
        avgWidth: avgWidth
      });
      
      // Get the actual start and end coordinates from the route
      const routeCoords = routeLine.geometry.coordinates;
      const actualStartCoord = routeCoords[0];
      const actualEndCoord = routeCoords[routeCoords.length - 1];
      
      // Create point features for start and end markers at the actual route endpoints
      const startMarker = turf.point(actualStartCoord, { 
        markerType: 'start',
        label: 'Start',
        icon: 'marker'
      });
      const endMarker = turf.point(actualEndCoord, { 
        markerType: 'end',
        label: 'End',
        icon: 'marker'
      });

      dispatch(addDataToMap({
        datasets: [
          { 
            info: { label: "Grounded Path", id: "active_route" }, 
            data: processGeojson(turf.featureCollection([routeLine])) 
          },
          {
            info: { label: "Route Markers", id: "route_markers" },
            data: processGeojson(turf.featureCollection([startMarker, endMarker]))
          }
        ],
        config: { 
          visState: { 
            layers: [
              { 
                id: "r_l", type: "geojson", 
                config: { 
                  dataId: "active_route", label: "Walking Path",
                  visConfig: { 
                    thickness: 5, 
                    opacity: 1,
                    colorRange: {
                      name: 'Custom Palette',
                      type: 'qualitative',
                      category: 'Uber',
                      colors: ['#50C878'] // Emerald green
                    }
                  },
                  colorField: { name: "_fixedColor", type: "string" }
                } 
              },
              {
                id: "route_markers_layer", type: "icon",
                config: {
                  dataId: "route_markers", label: "Route Markers",
                  visConfig: {
                    iconSize: 40,
                    iconSizeRange: [20, 60],
                    opacity: 1,
                    color: [231, 76, 60], // Red color [R, G, B]
                    fixedRadius: false
                  },
                  iconField: {
                    name: 'icon',
                    type: 'string'
                  },
                  iconMapping: {
                    marker: {
                      icon: 'marker',
                      category: 'default'
                    }
                  },
                  textLabel: [{
                    field: {
                      name: 'label',
                      type: 'string'
                    },
                    color: [255, 255, 255],
                    size: 12,
                    offset: [0, 5],
                    anchor: 'bottom'
                  }]
                }
              }
            ],
            interactionConfig: { geocoder: { enabled: true } }
          } 
        }
      }));
      
      // Explicitly set the route layer color to emerald green after adding route
      setTimeout(() => {
        dispatch(updateLayerVisConfig('r_l', {
          colorRange: {
            name: 'Custom Palette',
            type: 'qualitative',
            category: 'Uber',
            colors: ['#50C878'] // Emerald green
          }
        }));
      }, 100);
    } else { 
      setRouteStats(null);
      alert("Could not connect segments."); 
    }
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

  const materialLabels = {
    "BR": "Brick",
    "CC": "Concrete", 
    "BC": "Asphalt",
    "Other": "Other"
  };

  if (showAboutUs) {
    return <AboutUs onBack={() => setShowAboutUs(false)} />;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="app-container">
        {/* Logo in top right */}
        <div className="top-logo">
          <img src="/emerald-path-logo.svg" alt="Emerald Path Logo" />
        </div>

        {/* About Us button in bottom right */}
        <button className="about-us-btn" onClick={() => setShowAboutUs(true)}>ABOUT US</button>

        <aside className={`filter-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          {isSidebarCollapsed ? (
            <div className="collapsed-sidebar-content">
              <h1 className="collapsed-title">EMERALD PATH</h1>
              <button 
                className="expand-btn" 
                aria-label="Expand sidebar"
                onClick={() => setIsSidebarCollapsed(false)}
              >
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <path d="M6 3L9 7.5L6 12" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="sidebar-header">
                <h1 className="sidebar-title">EMERALD PATH</h1>
                <button 
                  className="collapse-btn" 
                  aria-label="Collapse sidebar"
                  onClick={() => setIsSidebarCollapsed(true)}
                >
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <path d="M9 3L6 7.5L9 12" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>

          {/* Floor Surface Filter */}
          <div className="filter-section">
            <div className="filter-section-header">
              <div className="filter-icon">🏗️</div>
              <h3 className="filter-title">Floor Surface</h3>
            </div>
            <div className="material-buttons">
              {["BR", "CC", "BC", "Other"].map(material => {
                const isSelected = selectedMaterials.includes(material);
                const iconMap = {
                  "BR": "/brick-icon.svg",
                  "CC": "/concrete-icon.svg",
                  "BC": "/asphalt-icon.svg",
                  "Other": null
                };
                return (
                  <button
                    key={material}
                    className={`material-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleMaterialChange(material)}
                  >
                    {iconMap[material] && (
                      <img 
                        src={iconMap[material]} 
                        alt={`${materialLabels[material]} icon`}
                        className="material-icon"
                        style={{ display: 'block' }}
                        onError={(e) => {
                          console.error('Failed to load icon:', iconMap[material], e);
                        }}
                        onLoad={() => {
                          console.log('Icon loaded:', iconMap[material]);
                        }}
                      />
                    )}
                    <span>{materialLabels[material]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Path Width Filter */}
          <div className="filter-section">
            <div className="filter-section-header">
              <div className="filter-icon">↔️</div>
              <h3 className="filter-title">Path Width</h3>
              <span className="filter-value">{widthValue.toFixed(1)} ft.</span>
            </div>
            <div className="slider-container">
              <span className="slider-label">0 ft.</span>
              <input 
                type="range" 
                min="0" 
                max="15" 
                step="0.1" 
                className="emerald-slider" 
                value={widthValue} 
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setWidthValue(val);
                  dispatch(setFilter(2, 'value', [val, 50]));
                }} 
              />
              <span className="slider-label">15 ft.</span>
            </div>
          </div>

          {/* Max Incline Filter */}
          <div className="filter-section">
            <div className="filter-section-header">
              <div className="filter-icon">📐</div>
              <h3 className="filter-title">Max Incline</h3>
              <span className="filter-value">{inclineValue.toFixed(0)}%</span>
            </div>
            <div className="slider-container">
              <span className="slider-label">0%</span>
              <input 
                type="range" 
                min="0" 
                max="20" 
                step="0.1" 
                className="emerald-slider" 
                value={inclineValue} 
                onChange={(e) => {
              const val = Number(e.target.value);
              setInclineValue(val);
              dispatch(setFilter(1, 'value', [0, val]));
                }} 
              />
              <span className="slider-label">20%</span>
            </div>
          </div>

          {/* Safeness Filter */}
          <div className="filter-section">
            <div className="filter-section-header">
              <div className="filter-icon">🛡️</div>
              <h3 className="filter-title">Safeness</h3>
              <span className="filter-value">{riskValue.toFixed(0)}%</span>
            </div>
            <div className="slider-container">
              <span className="slider-label">0%</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                className="emerald-slider" 
                value={riskValue} 
                onChange={(e) => {
              const val = Number(e.target.value);
                  setRiskValue(val);
                  dispatch(setFilter(3, 'value', [val, 100]));
                }} 
              />
              <span className="slider-label">100%</span>
            </div>
          </div>

          {/* Routing Controls */}
          <div className="routing-section">
            <h3 className="routing-title">Routing</h3>
            <div className="routing-controls">
              <button className="route-btn" onClick={() => togglePoint('start')}>
                {startPoint ? "Start Set" : "Set Start Location"}
              </button>
              <button className="route-btn" onClick={() => togglePoint('end')}>
                {endPoint ? "End Set" : "Set End Location"}
              </button>
              {startPoint && endPoint && (
                <button className="find-route-btn" onClick={calculateRoute}>
                  Find Accessible Route
                </button>
              )}
              {(startPoint || endPoint) && (
                <button className="clear-btn" onClick={resetMap}>
                  Clear & Reset All
                </button>
              )}
            </div>
            
            {/* Route Statistics */}
            {routeStats && (
              <div className="route-stats">
                <h4 className="route-stats-title">Route Statistics</h4>
                <div className="route-stat-item">
                  <span className="route-stat-label">Total Distance:</span>
                  <span className="route-stat-value">{routeStats.distance.toFixed(2)} mi</span>
                </div>
                <div className="route-stat-item">
                  <span className="route-stat-label">Average Incline:</span>
                  <span className="route-stat-value">{routeStats.avgIncline.toFixed(1)}%</span>
                </div>
                <div className="route-stat-item">
                  <span className="route-stat-label">Average Width:</span>
                  <span className="route-stat-value">{routeStats.avgWidth.toFixed(1)} ft</span>
                </div>
              </div>
            )}
          </div>
        </>
        )}
        </aside>
        <KeplerGl id="map" mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN} width={window.innerWidth} height={window.innerHeight} style={{position: 'absolute', top: 0, left: 0}} />
      </div>
    </ThemeProvider>
  );
}