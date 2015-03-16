# tokensearch.js
[![Build Status](https://secure.travis-ci.org/neophob/tokensearch.js.png?branch=master)](http://travis-ci.org/neophob/tokensearch.js)

**tokensearch.js** is a simple substring search functions for collections. You can search for multiple search tokens in a json file, the result array contains the original object plus a search score (0: perfect, 1: forget it). See the example or unit tests for more details.

Inspired by https://github.com/krisk/Fuse, users.json file is ripped from this project.

## Options

```
Tokensearch.defaultOptions = {
  //split strings with those delimiters, default delimiters: space and dash
  delimiterRegex: /[\s-]+/,

  // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
  // (of both letters and location), a threshold of '1.0' would match anything.
  threshold: 0.7,

  // How many search tokens are considered
  maxFilterTokenEntries: 5,

  // search key
  collectionKeys: []
};
```

You can pass one or multiple parameter when creating the object, for example 

```
new Tokensearch(myCollection, { collectionKeys: ['key1', 'key2'], threshold: 0.5 });
```

## Examples

### Simple

**Setup:**

```
var readmeUser = [{
  "name": "JOHN PETER DOW",
  "id": "123"
}, {
  "name": "FOO BAR JOHN",
  "id": "127",
}, {
  "name": "BODE JON MULLER",
  "id": "147",
}];
var tokenSearch = new Tokensearch(readmeUser, { collectionKeys: ['name'] });

```

**Search:**
```
var result = tokenSearch.search('JOHN BAR');
```

**Result:**
```
[
  {"item":{"name":"FOO BAR JOHN","id":"127"},"score":0.33333333333333337},
  {"item":{"name":"JOHN PETER DOW","id":"123"},"score":0.6666666666666667}
]
```
Score 0 means a perfect match, score 1 is likely not what you're looking for.
The original object is wrapped inside the `item` key.
