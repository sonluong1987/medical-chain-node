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
    const createPatientTransaction = serializer.fromJSON({
      '$class': NS + '.CreatePatient',
      'patientId': shortid.generate(),
      'firstName': details.firstName,
      'lastName': details.lastName,
      'address': details.address,
      'dob': details.dob,
      'weight': details.weight,
      'height': details.height
    });

    await connection.submitTransaction(createPatientTransaction);

    // const participantDetailsRegistry = await connection.getAssetRegistry('org.acme.sample.PatientDetails');
    // const participantRegistry = await connection.getParticipantRegistry('org.acme.sample.Patient');
    // const factory = await businessNetworkDefinition.getFactory();
    // const pid = shortid.generate();
    // const pdid = shortid.generate();

    // patient = factory.newResource(NS, 'Patient', pid);
    // patientDetail = factory.newResource(NS, 'PatientDetails', pdid);
    // patientDetail.firstName = req.body.details.firstName;
    // patientDetail.lastName = req.body.details.lastName;
    // patientDetail.address = req.body.details.address;
    // patientDetail.dob = req.body.details.dob;
    // patientDetail.height = req.body.details.height;
    // patientDetail.weight = req.body.details.weight;
    // patientDetail.owner = factory.newRelationship(NS, 'Patient', pid);
    // patient.personalDetails = factory.newRelationship(NS, 'PatientDetails', pdid);

    // await participantRegistry.add(patient)
    // await participantDetailsRegistry.add(patientDetail);
    res.send(200, "Success");
  }
  catch (error) {
    next(error);
  }
});

router.post('/createPractitioner', async function (req, res, next) {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');

    // const participantDetailsRegistry = await connection.getAssetRegistry('org.acme.sample.PractitionerDetails');
    // const participantRegistry = await connection.getParticipantRegistry('org.acme.sample.Practitioner');
    // const factory = await businessNetworkDefinition.getFactory();
    // const pid = shortid.generate();
    // const pdid = shortid.generate();

    // const practitioner = factory.newResource(NS, 'Practitioner', pid);
    // const practitionerDetail = factory.newResource(NS, 'PractitionerDetails', pdid);
    // practitionerDetail.firstName = req.body.details.firstName;
    // practitionerDetail.lastName = req.body.details.lastName;
    // practitionerDetail.address = req.body.details.address;
    // practitionerDetail.owner = factory.newRelationship(NS, 'Practitioner', pid);
    // practitioner.profile = factory.newRelationship(NS, 'PractitionerDetails', pdid);

    // await participantRegistry.add(practitioner)
    // await participantDetailsRegistry.add(practitionerDetail);
    res.send(200, "Success");
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
