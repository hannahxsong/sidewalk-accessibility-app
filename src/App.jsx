import { useEffect } from "react";
import { useDispatch } from "react-redux";
import KeplerGl from '@kepler.gl/components';
import { addDataToMap } from "@kepler.gl/actions";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const res = await fetch("/data/sidewalks.geojson");
      const geojson = await res.json();

      dispatch(
        addDataToMap({
          datasets: {
            info: { label: "Sidewalks", id: "sidewalks" },
            data: geojson,
          },
          // NOTE: it's `options` (plural) in most Kepler builds
          options: { centerMap: true, readOnly: false },
        })
      );
    })();
  }, [dispatch]);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <AutoSizer>
        {({ width, height }) => (
          <KeplerGl
            id="foo"
            mapboxApiAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            width={width}
            height={height}
          />
        )}
      </AutoSizer>
    </div>
  );
}