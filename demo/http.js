var express = require('express')
var serveStatic = require('serve-static')

var staticBasePath = './demo';
 
var app = express();

var port = process.env.PORT || 3000;
 
app.use(serveStatic(staticBasePath))
app.listen(port)
console.log(`Listening on http://127.0.0.1:${port}`);
