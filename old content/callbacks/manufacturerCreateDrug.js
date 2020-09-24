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

module.exports.info  = 'manufacturer creating drugs';

let drugIds = [];
let txnPerBatch;
let bc, contx;

module.exports.init = function(blockchain, context, args) {
    if(!args.hasOwnProperty('txnPerBatch')) {
        args.txnPerBatch = 1;
    }
    
    txnPerBatch = args.txnPerBatch;
    bc = blockchain;
    contx = context;

    return Promise.resolve();
};

/**
 * Generate unique drug id for the transaction
 * @returns {String} drug id
 */
function getRandomNum() {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return `${s4()}${s4()}${s4()}${s4()}`;
}

function getTestDrug() {
    return {
        drugId: `panadol${getRandomNum()}`,
        drugName: 'panadol',
        price: 2000,
        quantity: 50,
        prescription: 'this drug is to be taken two times a day',
        expiryDate: new Date(2021, 05, 09).toLocaleString(),
        created: new Date().toLocaleString()
    }
}

/**
 * Generates simple workload
 * @returns {Object} array of json objects
 */
function generateWorkload() {
    let workload = [];

    for(let i= 0; i < txnPerBatch; i++) {
        const drug = getTestDrug();
        drugIds.push(drug.drugId);

        workload.push({
            chaincodeFunction: 'createDrug',
            chaincodeArguments: [drug],
        });
    }

    return workload;
}

module.exports.run = function() {
    let args = generateWorkload();
    return bc.invokeSmartContract(contx, 'drugsupplychainnetbenchmark', 'v0.0.1', args, 100);
};

module.exports.end = function() {
    return Promise.resolve();
};

module.exports.drugIds = drugIds;
