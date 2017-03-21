var opciones = {
    shell: true
}

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var spawn = require('child_process', ['', opciones]).spawn;

//Puerto al que se conecta el servidor
const puerto = 9090;

//Tiempo de expiracion de un comando (en milisegundos)
const timer_ms = 5000;



app.use(express.static('client'));

server.listen(puerto, function() {
    console.log('Servidor funcionando en http://localhost:' + puerto);
});

io.on('connection', function(socket) {
    console.log('Cliente conectado ');
    //var shell = spawn('/bin/bash');
    var shell = spawn('/usr/bin/maude');
    var stdin = shell.stdin;
    var temporizadores = [];

    shell.on('exit', function() {
        console.log('exit');
        socket.disconnect();
    });

    shell['stdout'].setEncoding('ascii');
    shell['stdout'].on('data', function(data) {
        clearTimeout(temporizadores.shift());
        socket.emit('stdout', data);
    });

    shell['stderr'].setEncoding('ascii');
    shell['stderr'].on('data', function(data) {
        clearTimeout(temporizadores.shift());
        socket.emit('stderr', data);
    });

    socket.on('stdin', function(command) {
        stdin.write(command + '\n') || socket.emit('disable');

        temporizadores.push(setTimeout(function() {
            matar_proceso('Tiempo excedido');
        }, timer_ms));
    });

    socket.on('archivo', function(command) {
        stdin.write(command + '\n') || socket.emit('disable');

        temporizadores.push(setTimeout(function() {
            matar_proceso('Tiempo excedido');
        }, timer_ms));
    });

    stdin.on('drain', function() {
        socket.emit('enable');
    });

    stdin.on('error', function(exception) {
        socket.emit('error', String(exception));
    });

    socket.on('disconnect', function() {
        matar_proceso('Desconexion');
    });

    function matar_proceso(msg) {
        console.log('Salida: ' + msg);
        try {
            process.kill(shell.pid, 'SIGKILL');
        } catch (ex) {
            console.log('Excep: ' + String(ex));
        }
    }

});