const express = require('express');
const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { validarJWT} = require ('../middlewares/validar-jwt')

const crearUsuario = async(req, res = express.response) => {
    try {
        //console.log(req.body);
        const { name, email, password } = req.body;

        let usuario = await Usuario.findOne({email})
        console.log(usuario);
        if(usuario){
            return res.status(400).json({
                ok:false,
                msg: 'Un usuario existe con ese correo'
            })
        }
        usuario = new Usuario(req.body);
        //Encriptar
        const salt = bcrypt.genSaltSync();
        usuario.password= bcrypt.hashSync(password,salt);
        await usuario.save();
        const token= await generarJWT(usuario.id,usuario.name);
        return res.status(201).json({
            ok: true,
            msg: 'registro',
            uid: usuario.id,
            name: usuario.name,
            token: token


        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }


}

const loginUsuario = async(req, res = response ) => {

    const { email, password } = req.body;

    try {
        
        const usuario = await Usuario.findOne({ email });
        console.log(usuario);
        if ( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'El usuario no existe con ese email'
            });
        }

        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        // Generar JWT
        //const token = await generarJWT( usuario.id, usuario.name );
        const token= await generarJWT(usuario.id,usuario.name);            
        res.json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}


const revalidarToken = async(req, res = express.response) => {
    
    const uid=req.uid;
    const name=req.name;
    const token= await generarJWT(uid,name);
    res.json({
        ok: true,
        msg: 'renew',
        uid,
        name,
        token
    });


}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken,
}