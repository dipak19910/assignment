var express = require('express');
var router = express.Router();
var querystring = require('querystring')
var http = require('http')
var https = require('https')
var url = require('url');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.body)
    console.log(req.params)
    console.log(req.query)
	let {query:{url:url_,method}={},body:{data}={}}=req
	if(!url){
		res.send(JSON.stringify({status:202,message:"please must be url"}))
	}
	return getCall(url.parse(url_),{method,body:data}).then(result=>{
		res.send(JSON.stringify({status:202,message:"url found"}))
	}).catch(error=>{
		res.send(JSON.stringify({status:202,message:'url not found'}))
	})
    return;
});

function getCall({
    protocol,
    hostname,
    port,
    query,
    pathname
}, {
    method = 'GET',
    body = ''
}) {
	console.log({
    protocol,
    hostname,
    port,
    query,
    pathname
})
    let isHttps = protocol === "https:"
    let protocolReq = isHttps ? https : http
    const options = {
        hostname: hostname || pathname,
        port: port ||( isHttps ? 443 : 80),
        path: `${pathname}${query?'?'+encodeURIComponent(query) :''}`,
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(body)
        }
    };
    return new Promise((resolve, reject) => {
        const req = protocolReq.request(options, (res) => {
            res.setEncoding('utf8');
            let data_ = ''
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
                data_ += chunk
            });
            res.on('end', () => {
                resolve(data_)
            });
        });

        req.on('error', (e) => {
            reject(e)
            console.error(`problem with request: ${e.message}`);
        });

        // write data to request bod
        req.end();
    })
}
module.exports = router;
