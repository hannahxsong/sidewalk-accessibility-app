import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import keplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";
import { taskMiddleware } from "react-palm/tasks";

const customizedKeplerReducer = keplerGlReducer.initialState({
  uiState: {
    readOnly: true,
    currentModal: null
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