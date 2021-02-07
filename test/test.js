var bitcoin = require('bitcoinjs-lib');
var bitcoinMessage = require('bitcoinjs-message');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const _ = require('lodash');  
const my_address = "1F3sAm6ZtwLAUnj7d38pGFxtP3RVEvtsbV";
const my_star = {
    "dec": "68deg 52' 56.9",
    "ra": "16h 29m 1.0s",
    "story": "Testing the story 4"
}

function testGetValidation() {
    console.log(`Attempting to validate blockchain...`);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response_json = JSON.parse(xhr.responseText);
                if (response_json.error_list.length === 0) {
                    console.log("\x1b[32mtestGetValidation: PASS\x1b[0m");
                } else {
                    console.log("\x1b[31mtestGetValidation: FAIL\x1b[0m");
                }
            } else {
                console.log("\x1b[31mtestGetGenesisBlock: FAIL\x1b[0m");
            }
        }
    }
    xhr.open("GET", `http://localhost:8000/validate`, true);
    xhr.send();
}

function testGetStars(address) {
    console.log(`Attempting to get stars for address ${address}...`);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response_json = JSON.parse(xhr.responseText);
                response_json.forEach((star) => {
                    if (!_.isEqual(response_json[0], my_star)) {
                        console.log("\x1b[31mtestGetStars: FAIL\x1b[0m");
                    }
                });
                console.log("\x1b[32mtestGetStars: PASS\x1b[0m");
                testGetValidation();
            } else {
                console.log("\x1b[31mtestGetGenesisBlock: FAIL\x1b[0m");
            }
        }
    }
    xhr.open("GET", `http://localhost:8000/blocks/${address}`, true);
    xhr.send();
}

function testSubmitStar(address, message) {
    console.log("Attempting to submit a new star...");
    let keyPair = bitcoin.ECPair.fromWIF('L4rK1yDtCWekvXuE6oXD9jCYfFNV2cWRpVuPLBcCU2z8TrisoyY1');
    let privateKey = keyPair.privateKey;
    let signature = bitcoinMessage.sign(message, privateKey, keyPair.compressed)
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                console.log("\x1b[32mtestSubmitStar: PASS\x1b[0m");
                testGetStars(my_address);
            } else {
                console.log("\x1b[31mtestSubmitStar: FAIL\x1b[0m");
            }
        }
    }
    xhr.open("POST", "http://localhost:8000/submitstar", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let json_message = {
        "address": address,
        "message": message,
        "signature":`${signature.toString('base64')}`,
        "star": my_star
    };
    xhr.send(JSON.stringify(json_message));
}

function testPostRequestValidation() {
    console.log("Attempting to request validation...")
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let addr = xhr.responseText.replace('"', '').split(':')[0];
                if (addr === my_address) {
                    console.log("\x1b[32mtestPostRequestValidation: PASS\x1b[0m");
                }
                testSubmitStar(addr, xhr.responseText);
            } else {
                console.log("\x1b[31mtestPostRequestValidation: FAIL\x1b[0m");
            }
        }
    }

    xhr.open("POST", "http://localhost:8000/requestValidation", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    let json_message = JSON.stringify({
        "address": my_address
    });
    xhr.send(json_message);
}

function testGetGenesisBlock() {
    console.log("Attempting to get genesis block...");
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                let response_json = JSON.parse(xhr.responseText);
                if (response_json.previousBlockHash !== null) {
                    console.log("\x1b[31mtestGetGenesisBlock: FAIL\x1b[0m");
                } else {
                    console.log("\x1b[32mtestGetGenesisBlock: PASS\x1b[0m");
                }
            } else {
                console.log("\x1b[31mtestGetGenesisBlock: FAIL\x1b[0m");
            }
            testPostRequestValidation();
        }
    }
    xhr.open("GET", "http://localhost:8000/block/0", true);
    xhr.send();
}

testGetGenesisBlock();
