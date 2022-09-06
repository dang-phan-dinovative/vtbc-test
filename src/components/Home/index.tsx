import { Client, Session } from '@heroiclabs/nakama-js'
import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'
import './index.scss'
interface IHome {
  client: Client
  session: Session | null
}

const Home = ({ client, session }: IHome) => {
  useEffect(() => {
    if (!client || !session) {
      window.location.href = '/vtbc'
    }
  }, [])
  return (
    <div className="home-container">
      {session ? (
        <ul className="list-home">
          <li>
            <Link to="/channel">Channel</Link>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

export default Home
