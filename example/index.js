var util = require('util');
var data = require('./../test/users.json');
var Tokensearch = require('tokensearch.js');
var tokensearch = new Tokensearch(data, { collectionKey: 'value' });

var searchAndPrint = function(token) {
  var durationStart = new Date();
  var result = tokensearch.search(token);
  var needed = new Date()-durationStart;
  console.log('\nResults for search <'+token+'>: ('+result.length+' entries found)');
  for (i = 0; i < Math.min(10, result.length); i++) {
    console.log(result[i].score+' - '+result[i].item.value);
  }
  console.log('Duration: '+needed+'ms\tMem used: '+util.inspect(process.memoryUsage()));
};

searchAndPrint('gupta');
searchAndPrint('    BHAT JO AN  ');
searchAndPrint('DES AES');



