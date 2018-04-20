const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();

const shortid = require('shortid');

const express = require('express');
const router = express.Router();

const multer = require('multer');
const upload = multer({dest: './uploads/'});

const fs = require('fs');

const NS = 'org.acme.sample';

/* GET home page. */
router.get('/testgetrecords', async (req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect('admin@medical-chain');
    const recordDataRegistry = await connection.getAssetRegistry(NS + '.MedicalRecordData');

    const record = await recordDataRegistry.get('S1WzWaUnM');
    console.log(record.data);
    res.send(200);
    // const img = new Buffer(record.data, 'base64');

    
    // res.writeHead(200, {
    //   'Content-Type': 'image/jpg',
    //   'Content-Length': img.length
    // });
    // res.end(img);
    // res.render('practitioner', { patients: patients });
  }
  catch(error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain');
    const practitionerRegistry = await connection.getParticipantRegistry(NS + '.Practitioner');
    const patientsDetailsRegistry = await connection.getAssetRegistry(NS + '.PatientDetails');

    const patients = await patientsDetailsRegistry.getAll();
    const practitioner = await practitionerRegistry.resolve(req.session.uid);

    res.render('practitioner', { patients: patients, practitioner: practitioner });
  }
  catch(error) {
    next(error);
  }
});

router.get('/createRecord', async (req, res, next) => {
  try {
    res.render('createRecord', {patientId: req.query.patientId});
  }
  catch (error) {
    next(error);
  }
})

router.post('/createRecord', upload.single('record'), async function (req, res, next) {
  try {
    console.log(req.body);
    const encoded = req.file.toString('base64');
    base64 = new Buffer(fs.readFileSync(req.file.path)).toString("base64")
    fs.unlink(req.file.path);

    const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain') ;
    const patientResource = 'resource:' + NS + '.Patient#' + req.body.patientId;
    const practitionerResource = 'resource:' + NS + '.Practitioner#' + req.session.uid;

    const serializer = businessNetworkDefinition.getSerializer();
    const transactionJSON = {
      '$class': NS + '.CreateRecord',
      'recordId': shortid.generate(),
      'description': req.body.description,
      'data': base64,
      'date': Math.floor(new Date() / 1000),
      'patient': patientResource,
      'practitioner': practitionerResource
    };
    const createRecordTransaction = serializer.fromJSON(transactionJSON);

    await connection.submitTransaction(createRecordTransaction);
    res.redirect('/practitioner')
  }
  catch (error) {
    next(error);
  }
});

router.get('/viewRecords', async (req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain');

    const owner = 'resource:org.acme.sample.Patient#' + req.query.patientId;
    const query = connection.buildQuery("SELECT org.acme.sample.MedicalRecord WHERE (owner == '"+ owner +"')");
    const records = await connection.query(query);

    res.render('medicalRecords', { records: records });
  }
  catch(error) {
    next(error);
  }
});

router.get('/viewRecordData', async (req, res, next) => {
  try {
    const businessNetworkDefinition = await connection.connect(req.session.uid + '@medical-chain');
    const recordDataRegistry = await connection.getAssetRegistry(NS + '.MedicalRecordData');
  
    const recordData = await recordDataRegistry.get(req.query.id);

    const img = new Buffer(recordData.data, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/jpg',
      'Content-Length': img.length
    });
    res.end(img);
    // res.render('practitioner', { patients: patients });
    // res.render('medicalRecordDetail', { base64data: recordData.data });
  }
  catch(error) {
    next(error);
  }
});

module.exports = router;
