 const http = require('http');
 const app = require('./app');


const normalizePort = val => {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    return false;
};
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

const adminError = error => {
    if (error.syscall !== 'listen'){
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port:' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + 'Vous ne posséder pas les accès nécessaire .');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' prêt à être utiliser.');
            process.exit(1);
            break;
        default:
            throw error;
    }
};

const server = http.createServer(app);

server.on('error', adminError);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);
