const combineReducers = (reducers: any) => (state: any, action: any) => {
  return Object.keys(reducers).reduce(
    (acc, prop) => ({
      ...acc,
      [prop]: reducers[prop](acc[prop], action)
    }),
    state
  )
}

const rootReducers = {}

const initialState = {}

export type TStoreAction = {
  type: string;
  payload: string;
}

export type TStateStore = typeof initialState

export type TRootReducers = typeof rootReducers

const rootReducer = combineReducers(rootReducers)

export { rootReducer, initialState }
