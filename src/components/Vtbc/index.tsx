import React, { useEffect } from 'react'
import './index.scss'

interface IParams {
    [key: string]: string| number
}

const page = 'PaymentGateway/Payment'

const params: IParams = {
    billcode: '22062713721',
    command: 'PAYMENT',
    desc: 'Mua+vé+Keno',
    merchant_code: 'VIETINBANK',
    order_id: '2217801715134',
    return_url: 'http://118.70.72.107:4003/',
    cancel_url: 'http://118.70.72.107:4003/',
    trans_amount: 64800,
    amount: 60000,
    fee: 4800,
    check_sum: '477d4f8e632acbe0ddab43bf9b0ca81726967f1c'
}

const paramString = Object.keys(params).reduce((str, key) => {
    const prefix = str.length > 0 ? '&' : ''
    const value = params[key].toString()
    str += `${prefix}${key}=${encodeURIComponent(value)}`
    return str
}, '')

const url = `https://dev-vietinbank.mobilott.vn/${page}?${(paramString)}`

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
