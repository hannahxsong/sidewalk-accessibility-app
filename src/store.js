import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import keplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";
import { taskMiddleware } from "react-palm/tasks";

const reducers = combineReducers({
  keplerGl: keplerGlReducer
});

const middlewares = enhanceReduxMiddleware([taskMiddleware]);
const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const store = createStore(
  reducers,
  {},
  composeEnhancers(applyMiddleware(...middlewares))
);

// THIS IS CRITICAL: Force it onto the window immediately
if (typeof window !== 'undefined') {
    window.store = store;
    console.log("Store has been attached to window.store");
}