const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { Mensajes } = require('../classes/mensajes');
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

    client.on('borrarMensajes', (mensajeEliminar, callback) => {
        mensajes.eliminarMensaje(mensajeEliminar);
        client.to(2).broadcast.emit('enviarMensaje', mensajes.getMensajes(2));
        callback(mensajes.getMensajes(2));
    })



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