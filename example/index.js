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

searchAndPrint('DVD 1 Harman Kardon');
searchAndPrint('DVD 1');
searchAndPrint('Harman DVD 1');
searchAndPrint('pfl9703');
searchAndPrint('sony tv');
searchAndPrint('X8500B Sony');
searchAndPrint('DVD 1 Harman Kardon as sa d s d k wedk wlked welkd welk dwekl dwekldwekld lk wkeld wlke dlwek ');
searchAndPrint('a e i o u e e e e e e e');
searchAndPrint('1050CD DVD Kenwood');
searchAndPrint('           Kenwood DVD 1050CD  ');


