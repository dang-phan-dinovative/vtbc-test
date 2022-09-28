import React, { useEffect } from 'react'
import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';

import './index.scss'

interface IParams {
    [key: string]: string| number
}

const page = 'PaymentGateway/Payment'

const secret = '57f84f15c63a3eb6c0a4595aab619786868a275eb1c6360a4d23dde742bc738f'
const accessCode = '656c5807ce5b76b5660f2cc0bb25c81636cade558f7e97f9ddbb61f5f0b7f145'

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
}

const message = `${accessCode}${params.billcode}${params.command}${params.merchant_code}${params.order_id}${params.trans_amount}${params.amount}${params.fee}`
params.checksum = Base64.stringify(CryptoJS.HmacSHA1(message, secret))
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
