const { response } = require('express');
const Evento = require('../models/evento')


const getEventos = async (req, res = express.response) => {

    const eventos = await Evento.find()
        .populate('user', 'name email');
    res.json({
        ok: true,
        msg: 'getEventos',
        eventos
    })
}


const crearEvento = async (req, res = express.response) => {
    //que tenga el evento
    console.log(req.body);
    let evento = new Evento(req.body);
    evento.user = req.uid;
    try {
        const eventoGuardado = await evento.save();
        res.json({
            ok: true,
            msg: 'crearEvento',
            evento: eventoGuardado
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin'
        })
    }

}



const actualizarEvento = async (req, res = express.response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no Existe con ese Id'
            })
        } else {
            if (evento.user.toString() !== uid) {
                //otro usuario no debe editar las notas de otro
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de editar este evento'

                })
            }
            const nuevoEvento = {
                ...req.body,
                user: uid
            }
            const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true });
            res.status(200).json({
                ok: true,
                msg: 'Evento Actualizado',
                eventoActualizado
            })

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin'
        })
    }

}


const eliminarEvento = async (req, res = express.response) => {
    const eventoId = req.params.id;
    const uid = req.uid;
    try {
        const evento = await Evento.findById(eventoId);
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no Existe con ese Id'
            })
        } else {
            if (evento.user.toString() !== uid) {
                //otro usuario no debe editar las notas de otro
                return res.status(401).json({
                    ok: false,
                    msg: 'No tiene privilegio de editar este evento'

                })
            }
            await Evento.findByIdAndDelete(eventoId);
            res.status(200).json({
                ok: true,
                msg: 'Evento Eliminado',
                
            })

        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el Admin'
        })
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}
