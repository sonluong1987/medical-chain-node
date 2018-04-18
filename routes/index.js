const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();

const shortid = require('shortid');

const express = require('express');
const router = express.Router();

const NS = 'org.acme.sample';

/* GET home page. */
router.get('/', async (req, res, next) => {
  const businessNetworkDefinition = await connection.connect('admin@medical-chain');
  const patients = await getAllPatients(connection);

  res.render('index', { title: 'Medical Chain' , patients: patients});
});

router.get('/ping', async function (req, res, next) {
  result = await connection.ping();
  res.send(result);
  // res.render('index', { title: 'Express' });
});

router.get('/registries', async (req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');
    const factory = await businessNetworkDefinition.getFactory();

    const registries = await connection.getParticipantRegistry('org.acme.sample.Patient');
    const patients = await registries.getAll();

    const serializer = businessNetworkDefinition.getSerializer();

    // console.log(patients);
    patients.forEach(element => {
      console.log(element.patientId);
    });
    res.send(200);
  }
  catch (error) {
    next(error)
  }
})

router.post('/createPatient', async function (req, res, next) {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');
    const serializer = businessNetworkDefinition.getSerializer();
    const details = req.body.details;
    const transactionJSON = {
      '$class': NS + '.CreatePatient',
      'patientId': shortid.generate(),
      'firstName': details.firstName,
      'lastName': details.lastName,
      'address': details.address,
      'dob': details.dob,
      'weight': details.weight,
      'height': details.height
    };
    const createPatientTransaction = serializer.fromJSON(transactionJSON);
    await connection.submitTransaction(createPatientTransaction);
    res.status(200).send(transactionJSON);
  }
  catch (error) {
    next(error);
  }
});

router.post('/createPractitioner', async function (req, res, next) {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');

    const serializer = businessNetworkDefinition.getSerializer();
    const details = req.body.details;
    const transactionJSON = {
      '$class': NS + '.CreatePractitioner',
      'practitionerId': shortid.generate(),
      'firstName': details.firstName,
      'lastName': details.lastName,
      'address': details.address,
    };
    const createPractitionerTransaction = serializer.fromJSON(transactionJSON);

    await connection.submitTransaction(createPractitionerTransaction);
    res.status(200).send(transactionJSON);
  }
  catch (error) {
    next(error);
  }
});

router.post('/createRecord', async function (req, res, next) {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');
    // const patientRegistry = await connection.getParticipantRegistry(NS + '.Patient');
    // const patient = await patientRegistry.get(req.body.patientId);
    const patientResource = 'resource:' + NS + '.Patient#' + req.body.patientId;
    const practitionerResource = 'resource:' + NS + '.Practitioner#' + req.body.practitionerId;
    // const practitionerRegistry = await connection.getParticipantRegistry(NS + '.Practitioner');
    // const practitioner = await practitionerRegistry.get(req.body.practitionerId);

    const serializer = businessNetworkDefinition.getSerializer();
    const transactionJSON = {
      '$class': NS + '.CreateRecord',
      'recordId': shortid.generate(),
      'description': req.body.description,
      'data': req.body.data,
      'date': Math.floor(new Date() / 1000),
      'patient': patientResource,
      'practitioner': practitionerResource
    };
    const createRecordTransaction = serializer.fromJSON(transactionJSON);

    await connection.submitTransaction(createRecordTransaction);
    res.send(200, transactionJSON);
  }
  catch (error) {
    next(error);
  }
});

router.post('/test', async function (req, res, next) {
  res.send(req.body.details);
});

async function getAllPatients(connection) {
  const patientRegistry = await connection.getParticipantRegistry('org.acme.sample.Patient');
  const patients = await patientRegistry.resolveAll();
  return patients;
}

module.exports = router;
