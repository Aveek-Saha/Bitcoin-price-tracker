const electron = require('electron')
const path = require('path')
const axios = require('axios')
const ipc = electron.ipcRenderer;
const BrowserWindow = electron.remote.BrowserWindow

const notBtn = document.getElementById('notBtn');
var price = document.getElementById('price')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal
var flag = 1

const notification = {
    title: 'BTC Alert',
    body: 'BTC just crossed your target price!',
    icon: path.join(__dirname, '../assets/images/bitcoin.png')
}

function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=INR')
    .then( res => {
        const cryptos = res.data.BTC.INR
        price.innerHTML = 'Rs. ' + cryptos.toLocaleString('en')

        if(targetPrice.innerHTML != "" && targetPriceVal < cryptos && flag){
            const notif = new window.Notification(notification.title, notification)
            flag = 0;
        }
    })
}
getBTC();
setInterval(getBTC, 10000);

notBtn.addEventListener('click', (event) =>{
    const modalPath = path.join('file://',__dirname, 'add.html');
    let win = new BrowserWindow({ frame: false, height: 250, width: 500, alwaysOnTop: true});
    win.on('close', () => { win = null});
    win.loadURL(modalPath);
    win.show();
    flag = 1;
})

ipc.on('targetPriceVal',(event, res)=> {
    targetPriceVal = Number(res);
    targetPrice.innerHTML = 'Rs. ' + targetPriceVal.toLocaleString('en');
})