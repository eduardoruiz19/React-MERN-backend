/* 
    Rutas de Ususarios /auth
    host + /api/auth
*/

const express = require('express');

const router = express.Router();
const { check} = require('express-validator');
const { validarCampos} = require('../middlewares/validar-campos')

const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
//! npm install mongoose


router.post(
    '/new', 
    [
        check('name','El nomvre es obligatorio').not().isEmpty(),
        check('email','El email es obligatorio').isEmail(),
        check('password','El password es minimo 6 caracteres').isLength({ min: 6}),       
        validarCampos 
    ],
    crearUsuario);

router.post('/', loginUsuario);

router.post('/renew', validarJWT, revalidarToken);


module.exports= router;