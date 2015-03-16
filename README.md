# tokensearch.js
[![Dependency Status](https://gemnasium.com/neophob/tokensearch.js.svg)](https://gemnasium.com/neophob/tokensearch.js) [![Build Status](https://secure.travis-ci.org/neophob/tokensearch.js.png?branch=master)](http://travis-ci.org/neophob/tokensearch.js)

**tokensearch.js** is a simple substring search functions for collections. You can search for multiple search tokens in a json file, the result array contains the original object plus a search `score` (0: perfect, 1: forget it). See the example or unit tests for more details.

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
Search for text tokens in one JSON field, use space as delimiter.

**Setup:**

```
var collection = [{
  "name": "JOHN PETER DOW",
  "id": "123"
}, {
  "name": "FOO BAR JOHN",
  "id": "127",
}, {
  "name": "BODE JON MULLER",
  "id": "147",
}];
var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name'] });

```

**Search:**
```
var result = tokenSearch.search('JOHN BAR');
```

**Result:**
```
[
  {"item":{"name":"FOO BAR JOHN","id":"127}","score":0},
  {"item":{"name":"JOHN PETER DOW","id":"123"},"score":0.5}
]
```

### Advanced
Search for text tokens in two JSON fields, use space and : as delimiter.

**Setup:**

```
var collection = [{
  "name": "JOHN PETER DOW",
  "address": "a:funny:street:44",
  "id": "123"
}, {
  "name": "FOO BAR JON",
  "address": "bullvd:33",
  "id": "127",
}, {
  "name": "BODE JOHN MULLER",
  "address": "upside:street",
  "id": "147",
}];
var tokenSearch = new Tokensearch(collection, { collectionKeys: ['name', 'address'], delimiter: /[\s:]+/, threshold: 0.5});

```

**Search:**
```
var result = tokenSearch.search('JOHN:street');
```

**Result:**
```
[
  {"item":{"name":"JOHN PETER DOW","address":"a:funny:street:44","id":"123"},"score":0},
  {"item":{"name":"BODE JOHN MULLER","address":"upside:street","id":"147"},"score":0}
]
```
