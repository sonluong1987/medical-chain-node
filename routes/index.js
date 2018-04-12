const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection()

const express = require('express');
const router = express.Router();

const NS = 'org.acme.sample';

/* GET home page. */
router.get('/ping', async function(req, res, next) {
  result = await connection.ping();
  res.send(result);
  // res.render('index', { title: 'Express' });
});

router.get('/registries', async(req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');

    let registries = await connection.getAllParticipantRegistries();
    console.log(registries);
    res.send(registries);  
  }
  catch(error) {
    next(error)
  }
})

router.post('/createPatient', async function(req, res, next) {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');

    let participantDetailsRegistry = await connection.getAssetRegistry('org.acme.sample.PatientDetails');
    let participantRegistry = await connection.getParticipantRegistry('org.acme.sample.Patient');
    let factory = await businessNetworkDefinition.getFactory();
    patient = factory.newResource(NS, 'Patient', 'P001');
    patientDetail = factory.newResource(NS, 'PatientDetails','PID001');
    patientDetail.firstName = req.body.details.firstName;
    patientDetail.lastName = req.body.details.lastName;
    patientDetail.address = req.body.details.address;
    patientDetail.dob = req.body.details.dob;
    patientDetail.height = req.body.details.height;
    patientDetail.weight = req.body.details.weight;
    patientDetail.owner = factory.newRelationship(NS,'Patient','P001');;
    patient.personalDetails = factory.newRelationship(NS,'PatientDetails','PID001');
  
    await participantRegistry.add(patient)
    await participantDetailsRegistry.add(patientDetail);  
    console.log(patient);
    res.send("Success!");
  }
  catch (error) {
    next(error);
  }  
})

router.post('/test', async function(req, res, next) {
  res.send(req.body.details);
})

module.exports = router;
