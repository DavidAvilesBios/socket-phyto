class Mensajes {

    constructor() {
        this.mensajes = [];
        this.id = 0;
        this.mensaje = {};
    }

    agregarMensaje(encabezado, cuerpo, usuario, rol, estaVisto, informacion) {
        this.id = this.mensajes.length;
        if (!informacion)
            this.mensaje = { id: this.id, encabezado, cuerpo, usuario, rol, estaVisto,fecha:Date.now()};
        else {
            this.mensaje = { id: this.id, encabezado, cuerpo, usuario, rol, estaVisto,fecha:Date.now(), informacion };
        }

        this.mensajes.push(this.mensaje);

        return this.mensajes;

    }

    getMensaje(id) {
        let mensaje = this.mensajes.filter((mensaje) => mensaje.id === id)[0];

        return mensaje;

    }
    marcarMensaje(mensajeEliminar) {
        console.log(mensajeEliminar);
        const index = this.mensajes.findIndex((mensaje) => mensaje.informacion.Oid === mensajeEliminar.oid);
        console.log(index);
        this.mensajes[index].estaVisto = true;
    }

    eliminarMensaje(mensajeEliminar) {

        this.mensajes = this.mensajes.filter((mensaje) => mensaje.informacion.Oid !== mensajeEliminar.oid);

    }

    getMensajes(sala) {
        const mensaje =  this.mensajes.filter((mensaje) => mensaje.rol === sala);
        return mensaje.sort((a, b) => parseFloat(b.fecha) - parseFloat(a.fecha));
    }

    getMensajesDestinatario(id) {
        return this.mensajes.filter((mensaje) => mensaje.destinatario === id);
    }


}


module.exports = {
    Mensajes
}