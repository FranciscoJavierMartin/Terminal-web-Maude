const PROMPT = 'Maude> ';
const COMANDO_NO_VALIDO = 'Comando no valido: ';
const QUIT = 'quit';
const entradas_no_permitidas=[
    'load',
    'cd ',
    'ls',
    'pwd'
]

//True si esta en entrada no permitida
function validar_comando(command) {
    var res = false;
    var cad;

    for (var i = 0; i < entradas_no_permitidas.length; i++) {
        cad = command.substr(0, entradas_no_permitidas[i].length);
        res = res || (cad == entradas_no_permitidas[i]);
    }

    return res;
}

//Elimina los espacios y los tabuladores del inicio del comando
function quitar_espacios_y_tabuladores(command){
    var i;

    for(i=0;i<command.length;i++){
        if(!(command[i]==' '||command[i]=='\t')){
            break;
        }
    }

    return command.substr(i,command.length);
}

//Envia el comando al servidor mediante el socket y a traves de la entrada seleccionada
function introducir_comando(command, envio, socket) {

    command=quitar_espacios_y_tabuladores(command);

    if (validar_comando(command)) {
        terminal.set_prompt(PROMPT);
        terminal.error(COMANDO_NO_VALIDO + command);
    } else if (QUIT == command.substr(0, QUIT.length)) {
        location.reload();
    } else {
        socket.emit(envio, command);
    }
}
 
$(function() {
     
    //Cuando se hace click en el enlace se hace click en la entrada de archivos
    $("#fileupload").click(function() {
         $("#files").click();
    });

    //Mensaje que emitira el alert cuando se produzca una desconexion
    var mensaje='Desconexion';

    //Se establece la conexion con el servidor
    var socket = io.connect('http://192.168.1.100:9090');

    //La variable para interacturar con la terminal mostrada
    var terminal = $('#terminal').terminal(function(command, terminal) {

        terminal.set_prompt('>');

        introducir_comando(command, 'stdin',socket);
    }, {
         greetings: '', //Hay que dejarla porque sino sale el por defecto
         prompt: PROMPT,
         exit: false
    });

    //Recibe la salida estandar del proceso Maude y la muestra en el terminal
    socket.on('stdout', function(data) {
        var salida = String(data);

        terminal.set_prompt(PROMPT);

        if (salida.endsWith(PROMPT)) {
             salida = salida.substr(0, salida.length - PROMPT.length);
        }

        terminal.echo(salida);
    });

    //Recibe la salida de error del proceso Maude y la muestra en el terminal
    socket.on('stderr', function(salida) {
         terminal.error(salida);
    });

    //Muestra un mensaje de alerta y cuando se cierra fuerza la recarga de la pagina
    socket.on('disconnect', function() {
        if(!alert(mensaje)){
            location.reload();
        }
    });

    socket.on('enable', function() {
         terminal.enable();
    });

    socket.on('disable', function() {
         terminal.disable();
    });

    //Actualiza el mensaje que se mostrara en el fin de conexion
    socket.on('mensajeFin',function(msg){
        mensaje=msg;
    });

    //COMIENZA LA SUBIDA DE ARCHIVOS
    if (window.File && window.FileList && window.FileReader) {
        var filesInput = document.getElementById("files");
        filesInput.addEventListener("change", function(event) {
            var files = event.target.files; //FileList object
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                //Comprueba que el fichero es de texto plano
                if(file['type'] == 'text/plain'){
                    var fileReader = new FileReader();
                    fileReader.addEventListener("load", function(event) {
                        var comandos = event.target.result.split('\n');
                        for (var j = 0; j < comandos.length; j++) {
                       introducir_comando(comandos[j], 'stdin',socket);
                    }
                    });
                    //Read the text file
                    fileReader.readAsText(file);
                }else{
                    alert('Fichero no valido');
                }

                
            }
        });
    } else {
        alert("Your browser does not support File API");
    }

 });
