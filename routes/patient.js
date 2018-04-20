const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();

const shortid = require('shortid');

const express = require('express');
const router = express.Router();

const NS = 'org.acme.sample';

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain');
        const practitionersRegistry = await connection.getParticipantRegistry(NS + '.Practitioner');
        const practitioners = await practitionersRegistry.resolveAll();

        const patientRegistry = await connection.getParticipantRegistry(NS + '.Patient');
        const patient = await patientRegistry.get(req.session.uid);

        const patientDetailsRegistry = await connection.getAssetRegistry(NS + '.PatientDetails');
        const patientDetail = await patientDetailsRegistry.get(req.session.uid);

        const owner = 'resource:org.acme.sample.Patient#' + req.session.uid;
        const query = connection.buildQuery("SELECT org.acme.sample.MedicalRecord WHERE (owner == '"+ owner +"')");
        const records = await connection.query(query);
            
        res.render('patient', { practitioners: practitioners, patient: patient, patientDetail: patientDetail, records: records });
    }
    catch (error) {
        next(error);
    }
});

router.post('/authorizePractitioner', async (req, res, next) => {
    try {
        const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain');
        const serializer = businessNetworkDefinition.getSerializer();
        const patientResource = 'resource:' + NS + '.Patient#' + req.session.uid;
        // const practitionerResource = 'resource:' + NS + '.Practitioner#' + req.body.practitionerId;

        const transactionJSON = {
            '$class': NS + '.GrantAccessToPatient',
            'practitionerId': req.body.practitionerId,
            'patient': patientResource
        };
        console.log(transactionJSON);
        const authorizeTransaction = serializer.fromJSON(transactionJSON);
        await connection.submitTransaction(authorizeTransaction);
        res.redirect('/patient');
    }
    catch (error) {
        next(error);
    }
})

router.post('/unauthorizePractitioner', async (req, res, next) => {
    try {
        const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain');
        const serializer = businessNetworkDefinition.getSerializer();
        const patientResource = 'resource:' + NS + '.Patient#' + req.session.uid;
        // const practitionerResource = 'resource:' + NS + '.Practitioner#' + req.body.practitionerId;

        const transactionJSON = {
            '$class': NS + '.RevokeAccessToPatient',
            'practitionerId': req.body.practitionerId,
            'patient': patientResource
        };
        const unauthorizeTransaction = serializer.fromJSON(transactionJSON);
        await connection.submitTransaction(unauthorizeTransaction);
        res.redirect('/patient');
    }
    catch (error) {
        next(error);
    }
})

module.exports = router;
