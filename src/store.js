import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import keplerGlReducer, { enhanceReduxMiddleware } from "@kepler.gl/reducers";
import { taskMiddleware } from "react-palm/tasks";

const reducers = combineReducers({
  keplerGl: keplerGlReducer.initialState({
    uiState: { readOnly: false, currentModal: null },
  }),
});

// Kepler needs react-palm taskMiddleware + enhanceReduxMiddleware
const middlewares = enhanceReduxMiddleware([taskMiddleware]);

export const store = createStore(reducers, {}, compose(applyMiddleware(...middlewares)));