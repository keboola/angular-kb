# Keboola Angular Library [![Build Status](https://secure.travis-ci.org/keboola/angular-kb.png)](http://travis-ci.org/keboola/angular-kb)

Keboola extensions library for Angular.


## Development

* Clone the repo
* Install dependencies `npm install && bower install --dev`
* Run test server `grunt testServer`
* Run watch in another terminal `grunt watch`

[Development with Karma Test Runner intro](http://www.youtube.com/watch?v=MVw8N3hTfCI)


## New release

* `grunt bumpup:type` - updates version in packages, allowed types: `major, minor, patch`. Default is `path`
* `grunt` - rebuild package version written in dist files
* `git tag OUTPUT_VERSION_OF_BUMPUP`
* `git push origin --tags`


## Documentation publish

* `grunt publishDocs`
