import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import keplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";
import { taskMiddleware } from "react-palm/tasks";

// Initialize Kepler with UI settings to hide the default sidebar
const customizedKeplerReducer = keplerGlReducer.initialState({
  uiState: {
    readOnly: true, // This hides the default black side panel
    currentModal: null // Ensures no pop-ups appear on load
  }
});

const reducers = combineReducers({
  keplerGl: customizedKeplerReducer
});

const middlewares = enhanceReduxMiddleware([taskMiddleware]);
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);

if (typeof window !== 'undefined') {
    window.store = store;
}