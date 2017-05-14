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
//var spawn = require('child_process').spawnSync;
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
    //var shell = spawn('/bin/bash');
    var shell = spawn('/usr/bin/maude');
    var stdin = shell.stdin;
    /*var temporizadores = [];
    var temporizador_archivo;*/

const tiempo=15000;

    setTimeout(function(){
        matar_proceso('Tiempo excedido');
    },tiempo);

    shell.on('exit', function(code, signal) {
        console.log('exit');
        socket.disconnect();
    });

    shell['stdout'].setEncoding('ascii');
    shell['stdout'].on('data', function(data) {
        //clearTimeout(temporizadores.shift());
    

        //clearTimeout(temporizador_archivo);
        socket.emit('stdout', data);
    });

    shell['stderr'].setEncoding('ascii');
    shell['stderr'].on('data', function(data) {
        //clearTimeout(temporizadores.shift());
         //clearTimeout(temporizador_archivo);
        socket.emit('stderr', data);
    });

    socket.on('stdin', function(command) {

        /*temporizadores.push(setTimeout(function() {
            matar_proceso('Tiempo excedido');
        }, timer_ms));*/

        stdin.write(command + '\n') || socket.emit('disable');
    });

    /*socket.on('archivo', function(command) {
    console.log('Cad '+command.substring(0,FMOD.length));
        if(command.substring(0,FMOD.length)==FMOD){
            console.log('Entra');
            temporizador_archivo=setTimeout(function () {
        console.log('Salida: ' + 'msg');
        try {
            shell.kill(senal);
        } catch (ex) {
            console.log('Excep: ' + String(ex));
        }
    },timer_archivo);
        }else if(command.substring(0,ENDFM.length)==ENDFM){
           clearTimeout(temporizador_archivo);
        }

        /*temporizadores.push(setTimeout(function() {
            matar_proceso('Tiempo excedido');
        }, timer_ms));*/

        /* stdin.write(command + '\n') || socket.emit('disable');
    });*/

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