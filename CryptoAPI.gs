/**
 * @param {symbol} the symbol of the cryptocurrency (e.g. BTC, ETH, ...)
 * @customfunction
 * @return the current price on coinmarketcap
 **/
function getCMCPrice(symbol) {
  var currDict = {};
  var url = 'https://api.coinmarketcap.com/v1/ticker/';
  
  var data = callAPI(url);
  
  for(var i = 0; i < data.length; i++) {
    var curr = data[i];
    currDict[curr.symbol] = curr.id;
  }
  
  return currDict[symbol];
}


/*
=====================================================================================
=                                    +++KUCOIN+++                                   =
=====================================================================================
*/
/**
 * @param {currencyID} the ID of the cryptocurrency (e.g. BTC, ETH, ...)
 * @param {key} the API key
 * @param {secret} the API secret
 * @customfunction
 * @return the current balance on Kucoin
 **/
function getKucoinBalance(currencyID, key, secret) {
  api_url = "https://api.kucoin.com";
  endpoint = "/v1/account/" + currencyID + "/balance";
  
  var data = callKucoinAPIAuth(api_url, key, secret, endpoint).data;
  var value = data["balance"];
  return value;
}

/**
 * puts together the API call to Kucoin
 * @return parsed JSON data from Kucoin
 **/
function callKucoinAPIAuth(api_url, key, secret, endpoint) {
  
  var nonce = getNonce().toString();
  var signature = getSignature(secret, endpoint, nonce);
  
  var headers = {
      "Content-Type": "application/json",
      "KC-API-KEY": key,
      "KC-API-NONCE": nonce,
      "KC-API-SIGNATURE": signature
  };
  
  var params = {
    "method": "GET",
    "headers": headers
  };
  
  var url = api_url + endpoint;
  
  // Fetch response  
  var response = UrlFetchApp.fetch(url, params);
  // var response = UrlFetchApp.getRequest(urlAll, params);
  // Parse response to JSON
  return dataAll = JSON.parse(response.getContentText());
}

/**
 * @return the encrypted signature for authorisation on Kucoin
 **/
function getSignature(secret, endpoint, nonce) {
 
  var signatureStr = endpoint + "/" + nonce + "/" + "";
  
  // Make it base64
  signatureStr = Utilities.base64Encode(signatureStr);
  
  //HMAC256
  var shaObj = new jsSHA("SHA-256", "TEXT");
  shaObj.setHMACKey(secret, "TEXT");
  shaObj.update(signatureStr);
  var hmac = shaObj.getHMAC("HEX");

  return hmac;
}
  
/**
 * @return the up-to-date timestamp
 **/
function getNonce() {
  return new Date().getTime();
}
/*
=====================================================================================
=                                    ---KUCOIN---                                   =
=====================================================================================
*/


/*
=====================================================================================
=                                    +++HitBTC+++                                   =
=====================================================================================
*/
/**
 * @param {currencyID} the ID of the cryptocurrency (e.g. BTC, ETH, ...)
 * @param {key} the API key
 * @param {secret} the API secret
 * @customfunction
 * @return the current balance on HitBTC
 **/
function getHitbtcBalance(currencyID, key, secret) {
  var currDict = {}
  api_url = "https://api.hitbtc.com";
  endpoint = "/api/2/trading/balance";
  
  var data = callHitbtcAPIAuth(api_url, key, secret, endpoint)
  
  for(var i = 0; i < data.length; i++) {
    var curr = data[i];
    currDict[curr.currency] = Number(curr.available);
  }
  
  var value = currDict[currencyID];
  
  return value;
}

/**
 * Use to make a GET request to the HitBTC API with authorisation
 **/
function callHitbtcAPIAuth(api_url, key, secret, endpoint) {
  
  var urlAll = api_url + endpoint;
  
  var headers = {
      "Authorization" : "Basic " + Utilities.base64Encode(key + ":" + secret)
  };
  
  var params = {
    "method" : "GET",
    "headers" : headers
  };
  
  // Fetch response  
  var response = UrlFetchApp.fetch(urlAll, params);
  // Parse response to JSON
  return dataAll = JSON.parse(response.getContentText());
}

/**
 * Updates a cell with a random number, to trigger API calls
 **/
function updateValues() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // ss is now the spreadsheet the script is associated with
  // var sheet = ss.getSheets()[0]; // sheets are counted starting from 0
  // var sheet = ss.getActiveSheet();
  var sheet = ss.getSheetByName('data')
  // sheet is the first worksheet in the spreadsheet
  var cell = sheet.getRange("C101"); 
 
  cell.setValue(Math.round((Math.random()*100)));
}
/*
=====================================================================================
=                                    ---HitBTC---                                   =
=====================================================================================
*/


/**
 * Use to make a GET request to an open API
 **/
function callAPI(url) {
  // Fetch response  
  var response = UrlFetchApp.fetch(url);
  // Parse response to JSON
  return dataAll = JSON.parse(response.getContentText());
}
