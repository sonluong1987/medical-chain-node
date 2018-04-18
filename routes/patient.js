const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();

const shortid = require('shortid');

const express = require('express');
const router = express.Router();

const NS = 'org.acme.sample';

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        const businessNetworkDefinition = await connection.connect('admin@medical-chain');
        const practitionersRegistry = await connection.getParticipantRegistry(NS + '.Practitioner');
        const practitioners = await practitionersRegistry.resolveAll();

        const patientRegistry = await connection.getParticipantRegistry(NS + '.Patient');
        const patient = patientRegistry.get('ryKPYXBnz');
        res.render('patient',{practitioners: practitioners, patient: patient});
    }
    catch(error) {
        next(error);
    }
});

module.exports = router;
