 $(function() {
     const PROMPT = 'Maude>';
     const MAUDE = 'Maude> ';
     const LOAD = 'load';
     const QUIT = 'quit';
     const CHANGE_DIRECTORY = 'cd ';
     const LIST = 'ls';
     const COMANDO_NO_VALIDO = 'Comando no valido: ';

     var entradas_no_permitidas = [];
     entradas_no_permitidas.push(LOAD);
     entradas_no_permitidas.push(CHANGE_DIRECTORY);
     entradas_no_permitidas.push(LIST);

     $("#fileupload").click(function() {
         $("#files").click();
     });

     var socket = io.connect('http://localhost:9090');
     var terminal = $('#terminal').terminal(function(command, terminal) {
         //var cmd = quitar_espacios_inicio(command);
         introducir_comando(command);
     }, {
         greetings: '',
         prompt: PROMPT,
         exit: false
     });
     socket.on('stdout', function(data) {
         var salida = String(data);

         if (salida.endsWith(MAUDE)) {
             salida = salida.substr(0, salida.length - MAUDE.length);
         }

         terminal.echo(salida);
     });
     socket.on('stderr', function(salida) {
         terminal.error(salida);
     });
     socket.on('disconnect', function() {

         if (!alert('Conexion perdida')) {
             location.reload();
         }

     });
     socket.on('enable', function() {
         terminal.enable();
     });
     socket.on('disable', function() {
         terminal.disable();
     });

     //COMIENZA LA SUBIDA DE ARCHIVOS
     if (window.File && window.FileList && window.FileReader) {
         var filesInput = document.getElementById("files");
         filesInput.addEventListener("change", function(event) {
             var files = event.target.files; //FileList object
             for (var i = 0; i < files.length; i++) {
                 var file = files[i];
                 var picReader = new FileReader();
                 picReader.addEventListener("load", function(event) {
                     var abc = event.target.result.split('\n');
                     for (var j = 0; j < abc.length; j++) {

                         introducir_comando(abc[j]);
                     }
                 });
                 //Read the text file
                 picReader.readAsText(file);
             }
         });
     } else {
         alert("Your browser does not support File API");
     }

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

     function introducir_comando(command) {
         command = quitar_tabuladores_inicio(command);
         command = quitar_espacios_inicio(command);
         if (validar_comando(command)) {
             terminal.error(COMANDO_NO_VALIDO + command);
         } else if (QUIT == command.substr(0, QUIT.length)) {
             location.reload();
         } else {
             socket.emit('stdin', command);
         }
     }

     function quitar_espacios_inicio(command) {
         var a = command.slice('');
         var i;

         for (i = 0; i < a.length; i++) {
             if (a[i] != ' ') {
                 break;
             }
         }

         var salida = command.substr(i, command.lengt);
         return salida;
     }

     function quitar_tabuladores_inicio(command) {
         var a = command.slice('');
         var i;

         for (i = 0; i < a.length; i++) {
             if (a[i] != '\t') {
                 break;
             }
         }

         var salida = command.substr(i, command.lengt);
         return salida;
     }
 });