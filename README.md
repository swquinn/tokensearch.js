# tokensearch.js

tokensearch.js is a simple substring search functions for collections.

Inspired by https://github.com/krisk/Fuse

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
var tokenSearch = new Tokensearch(readmeUser, { collectionKey: 'name' });

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
