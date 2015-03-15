# tokensearch.js
[![Build Status](https://secure.travis-ci.org/neophob/tokensearch.js.png?branch=master)](http://travis-ci.org/neophob/tokensearch.js)

**tokensearch.js** is a simple substring search functions for collections. You can search with multiple search tokens in a key of a json file
structure, the result array contains the original object plus a search score (0: perfect, 1: forget it).

Inspired by https://github.com/krisk/Fuse, users.json file is ripped from this project.

## Example Usage

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
