var opciones = {
    shell: true
}

const FMOD='fmod';
     const ENDFM='endfm';
     const FTH='fth';
     const ENDFTH='endfth';
     const VIEW='view';
     const ENDV='endv';


var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var spawn = require('child_process', ['', opciones]).spawn;

//Signal a enviar
const senal = 'SIGKILL';

//Puerto al que se conecta el servidor
const puerto = 9090;

//Tiempo de expiracion de un comando (en milisegundos)
const timer_ms = 5000;
const timer_archivo=1000;

app.use(express.static('client'));

server.listen(puerto, function() {
    console.log('Servidor funcionando en http://localhost:' + puerto);
});

io.on('connection', function(socket) {
    console.log('Cliente conectado ');
    var shell = spawn('/usr/bin/maude');
    var stdin = shell.stdin;

    const tiempo=150000;

    /*setTimeout(function(){
        matar_proceso('Tiempo excedido');
    },tiempo);*/

    shell.on('exit', function(code, signal) {
        console.log('exit');
        socket.disconnect();
    });

    shell['stdout'].setEncoding('ascii');
    shell['stdout'].on('data', function(data) {
        socket.emit('stdout', data);
    });

    shell['stderr'].setEncoding('ascii');
    shell['stderr'].on('data', function(data) {
        socket.emit('stderr', data);
    });

    socket.on('stdin', function(command) {
        stdin.write(command + '\n') || socket.emit('disable');
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
            shell.kill(senal);
        } catch (ex) {
            console.log('Excep: ' + String(ex));
        }
    }

});
