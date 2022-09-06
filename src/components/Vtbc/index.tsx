import React, { useEffect } from 'react'
import './index.scss'

interface IParams {
    [key: string]: string| number
}

const page = 'static/vtbc/success.html'

const params: IParams = {
    bnk: '01202001',
    brc: '01202005',
    acc: '12210009585858',
    acctName: 'cong ty quan ly quy VietinBank',
    amt: 50000,
    ref: 'nop tien mua ccq VietinBank01 cho tai khoan CCQ123456'
}

const paramString = Object.keys(params).reduce((str, key) => {
    const prefix = str.length > 0 ? '&' : ''
    const value = params[key]
    str += `${prefix}${key}=${value}`
    return str
}, '')

const url = `http://localhost:5001/${page}?${encodeURI(paramString)}`

const Vtbc = () => {
  useEffect(() => {
    document.title = 'VTBC - Exchange Traded Fund'
  }, [])
  return (
    <div>
      <section className="showcase">
        <header>
          <h2 className="logo">VTBC</h2>
        </header>
        <div className="overlay"></div>
        <div className="text">
          <h2>START TRADING </h2>
          <h3>Exploring The World</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <a href={url}>Explore</a>
        </div>
      </section>
    </div>
  )
}

export default Vtbc
