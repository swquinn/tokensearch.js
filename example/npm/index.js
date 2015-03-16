var util = require('util');
var data = require('./../../test/users.json');
console.log('Found '+data.length+' entires...');
var Tokensearch = require('tokensearch.js');
var tokensearch = new Tokensearch(data, { collectionKeys: ['name'], threshold: 0.8 });

var searchAndPrint = function(token) {
  var durationStart = new Date();
  var result = tokensearch.search(token);
  var needed = new Date()-durationStart;
  console.log('\nResults for search <'+token+'>: ('+result.length+' entries found)');
  for (i = 0; i < Math.min(10, result.length); i++) {
    console.log(result[i].score+' - '+result[i].item.name);
  }
  console.log('Duration: '+needed+'ms\tMem used: '+util.inspect(process.memoryUsage()));
};

searchAndPrint('gupta');
searchAndPrint('    BHAT JO AN  ');
searchAndPrint('DES');
searchAndPrint('BAR SAN');



