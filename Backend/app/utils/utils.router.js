const utilsServices = require('./utils.service');
const express = require('express');
const router =  express.Router();

module.exports = (passport) => {
    router.get('/hello', async (req, res, next) => {
        const resp = await utilsServices.helloWorld();
        await res.json({
            payload: resp,
        });
    });

    router.get('/date', async (req, res, next) => {
        await res.json(new Date());
    })

    router.get('/logs', passport.authenticate('jwt', {session: true}), async (req, res, next) => {
        const resp = await utilsServices.getLogs();
        await res.json(resp);
    });

    return router;
};
