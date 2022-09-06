import React, { useReducer } from 'react'
import { useNavigate } from 'react-router-dom'

import { Client, Session } from '@heroiclabs/nakama-js'
import { EMAIL_ACTION, PWD_ACTION, PWD_DEFAULT } from '@root/constants'
import { callRPC } from '@root/utils'
import './index.scss'

interface ILogin {
  email: string,
  password: string
}

interface ILoginForm {
  client: Client,
  setSession: React.Dispatch<React.SetStateAction<Session | null>>
}

interface ILoginAction {
  type: typeof EMAIL_ACTION | typeof PWD_ACTION
  payload: string
}

const initialState: ILogin = {
  email: '',
  password: PWD_DEFAULT
}

const reducer = (state: ILogin, action: ILoginAction) => {
  const payload = action.payload
  switch (action.type) {
    case EMAIL_ACTION:
      return { ...state, email: payload }
    case PWD_ACTION:
      return { ...state, password: payload }
    default:
      throw new Error()
  }
}

const LoginForm = ({ client, setSession }: ILoginForm) => {
  const navigate = useNavigate()
  const [ state, dispatch ] = useReducer(reducer, initialState)

  const getSession = async ({ email, password }: ILogin) => {
    const session = await client.authenticateEmail(email, password)
    const response = await callRPC(client, session, 'healthcheck', {})
    if (response.payload.success === true) {
      console.log('Session: ', session)
      console.log('Created session successfully!')
    }
    setSession(session)
    return session
  }

  const submitHandler: React.FormEventHandler<HTMLFormElement> | undefined = async (evt) => {
    evt.preventDefault()
    const { email, password } = state
    if (!email || !password) return
    const session = await getSession({ email, password })
    setSession(session)
    navigate('/')
  }

  return (
    <div className="flex-r container">
      <div className="flex-r login-wrapper">
        <div className="login-text">
          <form className="flex-c" onSubmit={submitHandler}>
            <div className="input-box">
              <span className="label">Email</span>
              <div className="flex-r input">
                <input
                  type="text"
                  placeholder="name@abc.com"
                  value={state.email}
                  onChange={(evt) =>
                    dispatch({
                      type: EMAIL_ACTION,
                      payload: evt.target.value
                    })}
                />
                <i className="fas fa-at" />
              </div>
            </div>
            <div className="input-box">
              <span className="label">Password</span>
              <div className="flex-r input">
                <input
                  type="password"
                  placeholder=""
                  readOnly
                  value={state.password}
                  onChange={(evt) =>
                    dispatch({
                      type: PWD_ACTION,
                      payload: evt.target.value
                    })}
                />
                <i className="fas fa-lock" />
              </div>
            </div>
            <input className="btn" type="submit" value="Login" />
          </form>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
