import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from "redux-saga";
import { createLogger } from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { rootSaga } from "../sagas/rootSaga";
import { rootReducer } from "../reducers/rootReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: [
    "blackNewsF",
    "walletRed",
    "roomsRed",
    "reelsRed",
    "reminderRed",
    "eventsRed",
  ],
};
// creates the store
/* ------------- Redux Configuration ------------- */
const middleware = [];
const enhancers = [];

/* ------------- Saga Middleware ------------- */
const sagaMiddleware = createSagaMiddleware();
middleware.push(sagaMiddleware);

/* ------------- Assemble Middleware ------------- */
enhancers.push(applyMiddleware(...middleware));

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, compose(...enhancers));
export const persistor = persistStore(store);

// kick off root saga
sagaMiddleware.run(rootSaga);
