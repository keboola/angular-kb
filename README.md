# Keboola Angular Library [![Build Status](https://secure.travis-ci.org/keboola/angular-kb.png)](http://travis-ci.org/keboola/angular-kb)

Keboola extensions library for Angular.

Custom directives and services used in Keboola applications.

Demos and documentation: http://keboola.github.com/angular-kb

Recommended angular libraries:

  * http://angular-ui.github.com/
  * http://angular-ui.github.com/bootstrap/



## Development

* Clone the repo
* Install dependencies `npm install && bower install --dev`
* Run test server `grunt testServer`
* Run watch in another terminal `grunt watch`

[Development with Karma Test Runner intro](http://www.youtube.com/watch?v=MVw8N3hTfCI)

Before adding any directive please check that directive isn't already implemented in libraries mentioned above.


## New release

* `grunt bumpup:type` - updates version in packages, allowed types: `major, minor, patch`. Default is `path`
* `grunt` - rebuild package version written in dist files
* `git tag OUTPUT_VERSION_OF_BUMPUP`
* `git push origin --tags`


## Documentation publish

* `grunt publishDocs`
