class Mensajes {

    constructor() {
        this.mensajes = [];
        this.id = 0;
        this.mensaje = {};
    }

    agregarMensaje(encabezado, cuerpo, usuario, rol, destinatario, informacion) {
        this.id = this.mensajes.length;
        if (!informacion)
            this.mensaje = { id: this.id, encabezado, cuerpo, usuario, rol, destinatario };
        else {
            this.mensaje = { id: this.id, encabezado, cuerpo, usuario, rol, destinatario, informacion };
        }

        this.mensajes.push(this.mensaje);

        return this.mensajes;

    }

    getMensaje(id) {
        let mensaje = this.mensajes.filter((mensaje) => mensaje.id === id)[0];

        return mensaje;

    }
    eliminarMensaje(mensajeEliminar) {
        console.log(mensajeEliminar);
        this.mensajes = this.mensajes.filter((mensaje) => mensaje.informacion.Oid !== mensajeEliminar.oid);
    }

    getMensajes(sala) {
        return this.mensajes.filter((mensaje) => mensaje.rol === sala);
    }

    getMensajesDestinatario(id) {
        return this.mensajes.filter((mensaje) => mensaje.destinatario === id);
    }


}


module.exports = {
    Mensajes
}