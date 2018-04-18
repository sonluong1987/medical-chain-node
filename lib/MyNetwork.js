// const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;

// const IdCard = require('composer-common').IdCard;
// const FileSystemCardStore = require('composer-common').FileSystemCardStore;
// const BusinessNetworkCardStore = require('composer-common').BusinessNetworkCardStore;
// const AdminConnection = require('composer-admin').AdminConnection;

// const fileSystemCardStore = new FileSystemCardStore();
// const businessNetworkCardStore = new BusinessNetworkCardStore();
// const adminConnection = new AdminConnection();

// class MyNetwork {
//     constructor(cardName) {
//         this.currentParticipantId;
//         this.cardName = cardName;
//         this.connection = new BusinessNetworkConnection();
//     }

//     static importCardToNetwork(cardData) {
//         var _idCardData, _idCardName;
//         var businessNetworkConnection = new BusinessNetworkConnection();
//         return IdCard.fromArchive(cardData).then(function (idCardData) {
//             _idCardData = idCardData;
//             return BusinessNetworkCardStore.getDefaultCardName(idCardData)
//         }).then(function (idCardName) {
//             _idCardName = idCardName;
//             return fileSystemCardStore.put(_idCardName, _idCardData)
//         }).then(function (result) {
//             return adminConnection.importCard(_idCardName, _idCardData);
//         }).then(function (imported) {
//             if (imported) {
//                 return businessNetworkConnection.connect(_idCardName)
//             } else {
//                 return null;
//             }
//         }).then(function (businessNetworkDefinition) {
//             if (!businessNetworkDefinition) {
//                 return null
//             }
//             return _idCardName;
//         })
//     }
// }