import { createStore, combineReducers } from "redux";
import keplerGlReducer from "kepler.gl/reducers";

const rootReducer = combineReducers({
  keplerGl: keplerGlReducer,
});

export const store = createStore(rootReducer);