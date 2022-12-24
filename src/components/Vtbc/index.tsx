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

const paintCanvas = (img: HTMLImageElement, bckg: HTMLElement, bckg_measures: DOMRect, text: HTMLElement, text_measures: DOMRect) => {
          
  // Creating the canvas element to draw the image
  let canvas = document.createElement('canvas');
  let ctx    = canvas.getContext('2d');

  // Setting the size of the canvas
  canvas.height = bckg_measures.height;
  canvas.width  = bckg_measures.width;

  // Drawing the final image
  ctx?.drawImage(img, text.offsetLeft, text.offsetTop, text_measures.width, text_measures.height, 0, 0, text_measures.width, text_measures.height);

  // Getting the image data
  return ctx?.getImageData(0, 0, text_measures.width, text_measures.height);

}

const getAverageColor = (imgData: ImageData) => {
    
  // Calculating average color of canvas
  // Counting the total elements
  let rgb   = {r:0, g:0, b: 0};
  let count = 0;

  length = imgData.data.length;

  for (var i = 0; i < length; i += 4) {

      rgb.r += imgData.data[i];
      rgb.g += imgData.data[i + 1];
      rgb.b += imgData.data[i + 2];

      count ++;

 }

  // Calculating average
  rgb.r = Math.floor(rgb.r / count);
  rgb.g = Math.floor(rgb.g / count);
  rgb.b = Math.floor(rgb.b / count);

  // Getting the average of the image
  return ((rgb.r * 299) + (rgb.g * 587) + (rgb.b * 114)) / 1000;

}

const getModeBackgroundImage = () => {
  return new Promise ((resolve, reject) => {
    // 0. Get text and background
    let text  = document.querySelector('.text > h2') as HTMLElement;
    let bckg  = document.querySelector('.overlay') as HTMLElement;
    // 1. Calculate text and background measures
    let text_measures = text.getBoundingClientRect();
    let bckg_measures = bckg.getBoundingClientRect();
    // 2. Cut the background image behind the text
    let img = new Image();
    img.crossOrigin = 'anonymous';
    img.src         = window.getComputedStyle(bckg, 'false').backgroundImage.slice(5, -2);
    img.height      = bckg_measures.height;
    img.width       = bckg_measures.width;

    img.onload = () => {
      // 3. Draw the portion of the background on a new canvas
      let imgData = paintCanvas(img, bckg, bckg_measures, text, text_measures);
      if (imgData) {
        // 4. Calculate the YIQ based on the average RGB
        const fontColor = getAverageColor(imgData) >= 128 ? 'black' : 'white';
        resolve(fontColor)
      }
      reject('Cannot create canvas image')
    }
  })
  
}


const Vtbc = () => {
  const changeTextColor = async () => {
    const theme = await getModeBackgroundImage()
    console.log(theme)
  }
  useEffect(() => {
   
    document.title = 'VTBC - Exchange Traded Fund'
    changeTextColor()
    
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
