import KeplerGl from "kepler.gl";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <KeplerGl
        id="map"
        mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </div>
  );
}