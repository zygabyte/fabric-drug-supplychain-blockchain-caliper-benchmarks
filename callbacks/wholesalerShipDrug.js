/*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

module.exports.info  = 'wholesaler shipping drugs';

let drugIds;
let bc, contx;

module.exports.init = function(blockchain, context, args) {
    drugIds = require('./manufacturerCreateDrug').drugIds;
    
    bc = blockchain;
    contx = context;

    return Promise.resolve();
};

module.exports.run = function() {
    const drugId  = drugIds[Math.floor(Math.random()*(drugIds.length))];

    let args = {
        chaincodeFunction: 'wholesalerShipDrug',
        chaincodeArguments: [drugId],
    };

    return bc.invokeSmartContract(contx, 'drugsupplychainnet', 'v0.0.1', args, 100);
};

module.exports.end = function() {
    return Promise.resolve();
};