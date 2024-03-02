const express = require('express')
const httpProxy = require('http-proxy')
require('dotenv').config()

const app = express();

const BaseURL = process.env.BASE_URL
const proxy = httpProxy.createProxy()

app.use((req,res)=>{

    const hostname = req.hostname;
    console.log(hostname);
    const sub = hostname.split('.')[0];

    const resolvesTo = `${BaseURL}/${sub}`

    return proxy.web(req, res, { target: resolvesTo, changeOrigin: true })

})


proxy.on('proxyReq', (proxyReq, req, res) => {
    const url = req.url;
    if (url === '/')
        proxyReq.path += 'index.html'

})

app.listen(5000,()=>{
    console.log('Server running on PORT : 5000')
})

