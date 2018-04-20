const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const connection = new BusinessNetworkConnection();

const shortid = require('shortid');

const express = require('express');
const router = express.Router();

const NS = 'org.acme.sample';

/* GET home page. */
router.get('/', async (req, res, next) => {
    try {
        res.render('admin', {name: "admin"});
    }
    catch (error) {
        next(error);
    }
});

router.post('/createPatient', async function (req, res, next) {
    try {
      const businessNetworkDefinition = await connection.connect('admin@medical-chain');
      const serializer = businessNetworkDefinition.getSerializer();
      const details = req.body.details;
      const transactionJSON = {
        '$class': NS + '.CreatePatient',
        'patientId': req.body.patientId,
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
        'practitionerId': req.body.practitionerId,
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


module.exports = router;
