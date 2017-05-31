 $(function() {
     const PROMPT = 'Maude>';
     const MAUDE = 'Maude> ';
     const LOAD = 'load';
     const QUIT = 'quit';
     const CHANGE_DIRECTORY = 'cd ';
     const LIST = 'ls';
     const PWD = 'pwd'
     const COMANDO_NO_VALIDO = 'Comando no valido: ';

     const FMOD='fmod';
     const ENDFM='endfm';
     const FTH='fth';
     const ENDFTH='endfth';
     const VIEW='view';
     const ENDV='endv';

     var entradas_no_permitidas = [];
     entradas_no_permitidas.push(LOAD);
     entradas_no_permitidas.push(CHANGE_DIRECTORY);
     entradas_no_permitidas.push(LIST);
     entradas_no_permitidas.push(PWD);

     $("#fileupload").click(function() {
         $("#files").click();
     });

     var socket = io.connect('http://192.168.1.100:9090');
     var terminal = $('#terminal').terminal(function(command, terminal) {

       terminal.set_prompt('>');

         introducir_comando(command, 'stdin');
     }, {
         greetings: '',
         prompt: PROMPT,
         exit: false
     });
     socket.on('stdout', function(data) {
         var salida = String(data);


       terminal.set_prompt(PROMPT);
         console.log(salida);

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
                 var fileReader = new FileReader();
                 fileReader.addEventListener("load", function(event) {
                     var abc = event.target.result.split('\n');
                     for (var j = 0; j < abc.length; j++) {
                         introducir_comando(abc[j], 'stdin');
                         //introducir_comando(abc[j], 'archivo');
                     }
                 });
                 //Read the text file
                 fileReader.readAsText(file);
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

     function introducir_comando(command, envio) {

        /*while(command[0]==' '||command[0]=='\t'){
          command = quitar_tabuladores_inicio(command);
          command = quitar_espacios_inicio(command);
        }*/

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

//salida = command.replace(/([\ \t]+(?=[\ \t])|^\s+|\s+$)/g, '');

         return salida;
     }

     function quitar_espacios_y_tabuladores(command){
       var i;

          for(i=0;i<command.length;i++){
            if(command[i]==' '||command[i]=='\t'){

            }else{
              break;
            }
          }

       return command.substr(i,command.length);
     }
 });
