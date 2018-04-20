const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();

const cookieParser = require('cookie-parser');
const shortid = require('shortid');
const express = require('express');
const router = express.Router();
const NS = 'org.acme.sample';

/* GET home page. */
router.get('/', async (req, res, next) => {
  console.log(req.cookies);
  res.render('index', { title: 'Medical Chain'});
});

router.post('/login', async (req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect(req.body.uid + "@medical-chain");
    req.session.uid = req.body.uid;
    res.redirect('/' + req.body.path);
  }
  catch(error) {
    next(error)
  }
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

router.post('/test', async function (req, res, next) {
  res.send(req.body.details);
});

async function getAllPatients(connection) {
  const patientRegistry = await connection.getParticipantRegistry('org.acme.sample.Patient');
  const patients = await patientRegistry.resolveAll();
  return patients;
}

module.exports = router;
