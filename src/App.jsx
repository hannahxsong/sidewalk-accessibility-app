import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "@kepler.gl/styles";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap } from "@kepler.gl/actions";
import { processGeojson } from "@kepler.gl/processors";

if (typeof window !== "undefined") {
  window.global = window;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadSidewalkInventory() {
      try {
        // Fetch the official Boston Sidewalk Inventory JSON
        const response = await fetch("/sidewalk_inventory.json");
        if (!response.ok) throw new Error("sidewalk_inventory.json not found in /public");
        
        const rawData = await response.json();
        const keplerData = processGeojson(rawData);
        
        dispatch(
          addDataToMap({
            datasets: [{
              info: { label: "Boston Sidewalk Inventory", id: "boston_sidewalks" },
              data: keplerData
            }],
            options: { centerMap: true },
            config: {
              visState: {
                layers: [{
                  id: "material_layer",
                  type: "geojson",
                  config: {
                    dataId: "boston_sidewalks",
                    label: "Sidewalk Material",
                    colorField: {
                      name: "MATERIAL", // Categorizes by CONC, BRICK, BIT, etc.
                      type: "string"
                    },
                    visConfig: {
                      // Qualitative scale for different materials
                      colorRange: {
                        name: "Material Palette",
                        type: "qualitative",
                        category: "Custom",
                        colors: ["#7FB3D5", "#C0392B", "#7F8C8D", "#D4AC0D", "#27AE60"]
                      },
                      opacity: 0.8,
                      strokeColor: [255, 255, 255],
                      thickness: 0.5
                    }
                  }
                }],
                interactionConfig: {
                  tooltip: {
                    fieldsToShow: {
                      boston_sidewalks: [
                        { name: "MATERIAL", format: null },
                        { name: "dam_lenth", format: null }, // Total length of damage
                        { name: "dam_width", format: null }, // Width of damage (critical for wheelchairs)
                        { name: "WIDTH", format: null },     // Sidewalk width
                        { name: "ST_NAME", format: null }    // Street Name
                      ]
                    },
                    enabled: true
                  }
                }
              },
              mapStyle: { styleType: "dark" }
            }
          })
        );
      } catch (err) {
        console.error("Map Load Error:", err);
      }
    }
    loadSidewalkInventory();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <div style={{ width: "100vw", height: "100vh" }}>
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