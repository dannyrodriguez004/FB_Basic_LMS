#!/usr/bin/env node
const app = require('./app/app');
// const http = require('http');
const https = require('https');
const fileStream = require('fs');

const portNorm = val => {
    var port = parseInt(val, 10);

    if(isNaN(port)) {
        return val;
    }

    if (port >= 0) {
        return port;
    }

    return false;
}

const onError = error => {
	console.log('ERROR HERE');
	if (error.syscall !== 'listen') {
		throw error;
    }
    
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListening = () => {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + port;
	console.warn('Listening on ' + bind);
};

const port = portNorm(process.env.PORT || '3001');
app.set('port', port);

const server = https.createServer({
	key: fileStream.readFileSync('server.key'),
	cert: fileStream.readFileSync('server.crt'),
	ca: fileStream.readFileSync('selfCA.crt'),
},app);
// const server = http.createServer(app);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
