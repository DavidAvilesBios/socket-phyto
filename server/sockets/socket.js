const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { Mensajes } = require('../classes/mensajes');
const axios = require('axios');
const usuarios = new Usuarios();
const mensajes = new Mensajes();

io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });


    client.on('entrarAplicacion', (data, callback) => {

        usuarios.agregarPersona(client.id, data.usuario, data.sala);
        client.join(data.sala);

        callback(usuarios.getPersonas());
    });

    client.on('mensajes', (data, callback) => {
        console.log(data);
        callback(mensajes.getMensajes(data));
    });

    client.on('mensajeApi', (data) => {
        console.log(data);
        const parseData = JSON.parse(data);
        mensajes.agregarMensaje(parseData.Area, parseData.Mensaje, 'Administrador', 2, false, parseData.Data);
        client.to(2).broadcast.emit('enviarMensaje', mensajes.getMensajes(2));
        client.to(2).broadcast.emit('cacharMensaje', parseData.Mensaje)
    })

    client.on('marcarMensajes', (mensajeEliminar, callback) => {
        mensajes.marcarMensaje(mensajeEliminar);
        client.to(2).broadcast.emit('enviarMensaje', mensajes.getMensajes(2));
        callback(mensajes.getMensajes(2));
    })
    client.on('eliminarMensaje', (mensajeEliminar, callback) => {
        mensajes.eliminarMensaje(mensajeEliminar);
        client.to(2).broadcast.emit('enviarMensaje', mensajes.getMensajes(2));
        callback(mensajes.getMensajes(2));
    })

    client.on("EnviarNotificacion", Notificacion => {
        //axios.post('')
        const parseData = JSON.parse(Notificacion);
        console.log(parseData);
        let headers = {};
        if (parseData.App === "Ventas") {
           headers = {
            "Content-Type": "application/json",
            Authorization:
              "key=AAAAfFSGGj4:APA91bEFrSOFRqxm5eGZEaY4aHcw0g97dVmHdS10QSqCxqXKJLn17x02r2RdD7CBwpmfGKKtUYcXuJVxomg_Zkfx5OGWm_kory6J3klmEfcaBNqcaUGl4PkYBXYctidU8FlIGFFFbZBN"
          };
        } else {
           headers = {
            "Content-Type": "application/json",
            Authorization:
              "key=AAAAq8Vf97g:APA91bEgrSLUnvMO6G6Q9YMu1R9-DPgtc_wJUgrkcWHijMyI466VU4n0SIb25ndVXO-zNt-10vzjXiK7Kan8lHTe6GDRveRjXIQTVPVFAg8jx7CFpfZ-Hcwf4AMQFAZQr9P1zugfq2Rj"
          };
        }

        const data = {
          to: parseData.Token,
          notification: {
            title: parseData.Asunto,
            body: parseData.Cuerpo,
            sound: "customsound-ios.wav"
          },
          data: {
          }
        };

        axios
          .post("https://fcm.googleapis.com/fcm/send", data, {
            headers: headers
          })
          .then(response => {
            console.log(response);
          })
          .catch(error => {});
        console.log(data);
        console.log(parseData);
      });




    // Escuchar el cliente
    client.on('enviarMensaje', (data, callback) => {
        console.log(data);
        mensajes.agregarMensaje(data.encabezado, data.cuerpo, data.usuario, 2, data.destinatario, data.informacion)
        client.to(2).broadcast.emit('enviarMensaje', mensajes.getMensajes(2));

        callback(mensajes.getMensajes());
        /*if (mensaje.usuario) {
            callback({
                resp: 'Todo salio bien'
            });
        } else {
            callback({
                resp: 'Todo salio mal'
            });
        }*/
    });
    /*client.on('mandarPaquete',(data,callback)=>{
        client.broadcast.emit('respuestaPaquete','Se envio el paquete ' + data.vendedor.Nombre)
    })*/

});