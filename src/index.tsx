import React, { createContext, useState, useEffect, useReducer } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { initialState, rootReducer, TStateStore, TStoreAction } from './reducer'
import { Client, Session } from '@heroiclabs/nakama-js'
import Home from '@root/components/Home'
import LoginForm from '@root/components/LoginForm'
import Vtbc from '@root/components/Vtbc'
import Channel from '@root/components/Channel'
const {
  RPC_SERVER_KEY = 'defaultkey',
  RPC_HOST = '127.0.0.1',
  RPC_PORT = '7350',
  RPC_USE_SSL = 'false'
} = process.env
const client = new Client(RPC_SERVER_KEY, RPC_HOST, RPC_PORT, RPC_USE_SSL === 'true')
export interface IContext {
  state: TStateStore
  dispatch: React.Dispatch<TStoreAction>
}

export const MyContext = createContext<IContext | null>(null)

const App = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [state, dispatch] = useReducer(rootReducer, initialState)
  const store = { state, dispatch }
  useEffect(() => {
    if (session) {
      console.log('SESSION: ', session)
    }
  }, [session])
  return (
    <MyContext.Provider value={store}>
      <BrowserRouter>
      <Routes>
      <Route
        path="/"
        element={<Home session={session} client={client} />}
      />
       <Route
        path="vtbc"
        element={<Vtbc />}
      />
      <Route
        path="login"
        element={<LoginForm setSession={setSession} client={client} />}
      />
      <Route
        path="channel"
        element={<Channel client={client} session={session} />}
      />
      </Routes>
    </BrowserRouter>
    </MyContext.Provider>
  )
}

export default App

const container = document.getElementById('root')
if (container) {
  ReactDOMClient.createRoot(container).render(<App />)
}
