//Signal a enviar al proceso creado
const senal = 'SIGKILL';

//Puerto al que se conecta el servidor
const puerto = 9090;

//Tiempo de conexion
const tiempo=60*60*1000;

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var spawn = require('child_process').spawn;

//Mata el proceso Maude asociado a la conexion
function matar_proceso_asociado(msg,shell) {
    console.log('Salida: ' + msg);

    try {
        shell.kill(senal);
    } catch (ex) {
       console.log('Excep: ' + String(ex));
    }
}

//Convierte en estatico el contenido de la carpeta client
app.use(express.static('client'));

//Pone el servidor a escuchar en el puerto
server.listen(puerto, function() {
    console.log('Servidor funcionando en http://localhost:' + puerto);
});

io.on('connection', function(socket) {
    console.log('Cliente conectado ');
    var shell = spawn('/usr/bin/maude');

    //Cuando expira el tiempo mata el proceso Maude asociado
    setTimeout(function(){
        socket.emit('mensajeFin','Fin de sesion');
        matar_proceso_asociado('Tiempo excedido',shell);
    },tiempo);

    //Cuando se elimina el proceso Maude asociado, desconecta el socket
    shell.on('exit', function(code, signal) {
        console.log('exit');
        socket.disconnect();
    });

    //Envia la salida estandar al cliente
    shell['stdout'].setEncoding('ascii');
    shell['stdout'].on('data', function(data) {
        socket.emit('stdout', data);
    });

    //Envia la salida de error al cliente
    shell['stderr'].setEncoding('ascii');
    shell['stderr'].on('data', function(data) {
        socket.emit('stderr', data);
    });

    //Escribe en el proceso Maude asociado lo que el usuario ha escrito en el terminal
    socket.on('stdin', function(command) {
        shell.stdin.write(command + '\n') || socket.emit('disable');
    });

    shell.stdin.on('drain', function() {
        socket.emit('enable');
    });

    shell.stdin.on('error', function(exception) {
        socket.emit('error', String(exception));
    });

    //Si se desconecta el socket, elimina el proceso Maude asociado al servidor
    socket.on('disconnect', function() {
        matar_proceso_asociado('Desconexion',shell);
    });

});
