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
* Initial build `grunt`
* Watch and test `grunt devel`

### Docker
Or use docker.
```
docker-compose run node bash
yarn && bower install --dev --allow-root
grunt
grunt watch
```

[Development with Karma Test Runner intro](http://www.youtube.com/watch?v=MVw8N3hTfCI)

Before adding any directive please check that directive isn't already implemented in libraries mentioned above.


## New release

* `grunt release:type` - updates version in packages, commits changes, tags version. Allowed types: `major, minor, patch`. Default is `path`
* `git push origin --tags`


## Documentation edit

* `grunt docsServer`

## Documentation publish

* `grunt publishDocs`


## Release History
See the [CHANGELOG](CHANGELOG.md).
