import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ThemeProvider } from "styled-components";
import { theme } from "@kepler.gl/styles";
import KeplerGl from "@kepler.gl/components";
import { addDataToMap } from "@kepler.gl/actions";
import { processGeojson } from "@kepler.gl/processors";

// Required for Vite/ESM environments
if (typeof window !== "undefined") {
  window.global = window;
}

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadBoston() {
      try {
        const response = await fetch("/boston_accessible_streets.json");
        if (!response.ok) throw new Error("File not found in /public");
        
        const data = await response.json();
        const keplerData = processGeojson(data);
        
        dispatch(
          addDataToMap({
            datasets: [{
              info: { label: "Boston Streets", id: "boston_map" },
              data: keplerData
            }],
            options: { centerMap: true }
          })
        );
      } catch (err) {
        console.error("Kepler Load Error:", err);
      }
    }
    loadBoston();
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