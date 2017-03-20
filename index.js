var http = require('http'),
    io = require('socket.io'),
    fs = require('fs'),
    spawn = require('child_process').spawn;

var puerto = 9090;
//Tiempo de expiracion de un comando
const timer_ms = 5000;

var app = http.createServer(function(req, res) {

    console.log('Servidor funcionando en http://localhost:' + puerto);

    [
        '/index.html', '/js/jquery.terminal.min.js', '/css/jquery.terminal.css', '/css/estilo.css'
    ].forEach(function(file) {
        if (file === req.url) {
            var parts = file.split('.');
            res.setHeader('Content-Type', 'text/' + { js: 'javascript', html: 'html', css: 'css' }[parts[parts.length - 1]])
            fs.readFile(__dirname + file, function(err, data) {
                res.setHeader('Content-Length', data.length);
                res.writeHead(200);
                res.end(data);
            });
        }
    })
});

app.listen(puerto);

io.listen(app).sockets.on('connection', function(socket) {

    console.log('Cliente conectado');

    var shell = spawn('/usr/bin/maude'),
        stdin = shell.stdin;
    var temporizador;

    shell.on('exit', function() {
        socket.disconnect();
    })

    shell['stdout'].setEncoding('ascii');
    shell['stdout'].on('data', function(data) {
        clearTimeout(temporizador);
        socket.emit('stdout', data);

    });

    shell['stderr'].setEncoding('ascii');
    shell['stderr'].on('data', function(data) {
        clearTimeout(temporizador);
        socket.emit('stderr', data);

    });

    socket.on('stdin', function(command) {
        stdin.write(command + "\n") || socket.emit('disable');

        temporizador = setTimeout(function() {
            console.log("salida por timeout");
            try {
                process.kill(shell.pid, 'SIGKILL');
            } catch (ex) {
                console.log(ex);
            }

            socket.disconnect();
        }, timer_ms);
    });

    stdin.on('drain', function() {
        socket.emit('enable');
    });

    stdin.on('error', function(exception) {
        socket.emit('error', String(exception));
    });
});