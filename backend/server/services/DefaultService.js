/* eslint-disable no-unused-vars */
const Service = require('./Service');

/**
* Validar API Key
*
* xApiKey String 
* no response value expected for this operation
* */
const apikeyValidarGET = ({ xApiKey }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        xApiKey,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Listar fichajes (con filtros usuario/fechas)
*
* idUsuario Integer  (optional)
* desde Date  (optional)
* hasta Date  (optional)
* no response value expected for this operation
* */
const fichajesGET = ({ idUsuario, desde, hasta }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        idUsuario,
        desde,
        hasta,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Borrar fichaje
*
* id Integer 
* no response value expected for this operation
* */
const fichajesIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener fichaje
*
* id Integer 
* no response value expected for this operation
* */
const fichajesIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualizar fichaje (cierre)
*
* id Integer 
* no response value expected for this operation
* */
const fichajesIdPUT = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Crear fichaje (inicio)
*
* no response value expected for this operation
* */
const fichajesPOST = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Último fichaje de un usuario en las últimas 12h
*
* idUsuario Integer 
* no response value expected for this operation
* */
const fichajesUltimoGET = ({ idUsuario }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        idUsuario,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Listar trabajos
*
* no response value expected for this operation
* */
const trabajosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Borrar trabajo
*
* id Integer 
* no response value expected for this operation
* */
const trabajosIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener trabajo
*
* id Integer 
* no response value expected for this operation
* */
const trabajosIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualizar trabajo
*
* id Integer 
* no response value expected for this operation
* */
const trabajosIdPUT = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Crear trabajo
*
* no response value expected for this operation
* */
const trabajosPOST = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Listar usuarios
*
* no response value expected for this operation
* */
const usuariosGET = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Borrar usuario
*
* id Integer 
* no response value expected for this operation
* */
const usuariosIdDELETE = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Obtener usuario
*
* id Integer 
* no response value expected for this operation
* */
const usuariosIdGET = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Actualizar usuario
*
* id Integer 
* no response value expected for this operation
* */
const usuariosIdPUT = ({ id }) => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
        id,
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);
/**
* Crear usuario
*
* no response value expected for this operation
* */
const usuariosPOST = () => new Promise(
  async (resolve, reject) => {
    try {
      resolve(Service.successResponse({
      }));
    } catch (e) {
      reject(Service.rejectResponse(
        e.message || 'Invalid input',
        e.status || 405,
      ));
    }
  },
);

module.exports = {
  apikeyValidarGET,
  fichajesGET,
  fichajesIdDELETE,
  fichajesIdGET,
  fichajesIdPUT,
  fichajesPOST,
  fichajesUltimoGET,
  trabajosGET,
  trabajosIdDELETE,
  trabajosIdGET,
  trabajosIdPUT,
  trabajosPOST,
  usuariosGET,
  usuariosIdDELETE,
  usuariosIdGET,
  usuariosIdPUT,
  usuariosPOST,
};
