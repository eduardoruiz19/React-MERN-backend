/*
Event Routes
/api/events

*/
const { Router } = require('express');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { check } = require('express-validator');
const { validarCampos} = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { isDate } = require('../helpers/isDate')
const router = Router();

router.use(validarJWT);


router.get('/'
    , getEventos);

//Crear nuevo Evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de Inicio es obligatoria').custom(isDate),        
        check('end', 'Fecha de Finalizacion es obligatoria').custom(isDate),                
        validarCampos

    ]
    , crearEvento);

// Actualizar Evento
router.put('/:id', actualizarEvento);

router.delete('/:id', eliminarEvento);

module.exports = router;
