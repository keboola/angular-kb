(function() {
  var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  (function(angular) {
    var app, modules;
    app = angular.module('kbDocs', ['ngRoute', 'kb']);
    app.value('kb.config', {
      ui: {
        'copy-button': {
          swfPath: 'components/zeroclipboard/ZeroClipboard.swf'
        }
      },
      projectBaseUrl: 'https://connection.keboola.com/admin/projects-new/PROJECT_ID'
    });
    app.value('kb.components', [
      {
        "id": "ex-adocean",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-adocean",
        "name": "AdOcean",
        "description": "See the efficiency of your web banners",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/adocean32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/adocean64-1.png"
      }, {
        "id": "ex-cloudsearch",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-cloudsearch",
        "name": "AWS Cloudsearch",
        "description": "Search service for AWS Cloud",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/cloudsearch32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/cloudsearch64-1.png"
      }, {
        "id": "ex-constantcontact",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/constantcontact",
        "name": "Constant Contact",
        "description": "Small business marketing service",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/constant-contact32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/constant-contact64-1.png"
      }, {
        "id": "ex-currency",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-currency",
        "name": "Currency",
        "description": "Convert your money to different currencies",
        "hasUI": false,
        "hasRun": true,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "ex-db",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-db",
        "name": "Database Extractor",
        "description": "Fetch data from MySQL or MSSQL",
        "hasUI": true,
        "hasRun": true,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "ex-doubleclick",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-doubleclick",
        "name": "Google DoubleClick extractor",
        "description": "Export your DoubleClick reports from DFA",
        "hasUI": false,
        "hasRun": true,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "ex-elasticsearch",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-elasticsearch",
        "name": "Elasticsearch",
        "description": "End-to-end search and analytics platform",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/elasticsearch32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/elasticsearch64-1.png"
      }, {
        "id": "ex-facebook",
        "type": "extractor",
        "uri": "https:\/\/ex-facebook.keboola.com",
        "name": "Facebook",
        "description": "Get the data from your social network",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/facebook32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/facebook64-1.png"
      }, {
        "id": "ex-facebook-ads",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-facebook-ads",
        "name": "Facebook Ads",
        "description": "Advertise with Facebook",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/facebook-ads32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/facebook-ads64-1.png"
      }, {
        "id": "ex-gooddata",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-gooddata",
        "name": "Gooddata",
        "description": "Download reports from GoodData",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/gooddata32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/gooddata64-1.png"
      }, {
        "id": "ex-google-adwords",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-google-adwords",
        "name": "Google Adwords",
        "description": "Advertise with Google",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/google-adwords32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/google-adwords64-1.png"
      }, {
        "id": "ex-google-analytics",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-google-analytics",
        "name": "Google Analytics",
        "description": "Web analytics & reporting",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/Google-Analytics-icon-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/Google-Analytics-icon-64-1.png"
      }, {
        "id": "ex-google-drive",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-google-drive",
        "name": "Google Drive",
        "description": "Extract spreadsheet data from Google Drive",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/Google-Drive-icon-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/Google-Drive-icon-64-1.png"
      }, {
        "id": "ex-http",
        "type": null,
        "uri": "https:\/\/syrup.keboola.com\/restbox",
        "name": null,
        "description": null,
        "hasUI": false,
        "hasRun": false,
        "ico32": null,
        "ico64": null
      }, {
        "id": "ex-instagram",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-instagram",
        "name": "Instagram",
        "description": "Get the data from Instagram",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/instagram-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/instagram-64-1.png"
      }, {
        "id": "ex-mailchimp",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-mailchimp",
        "name": "Mailchimp",
        "description": "Send Better Email",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/mailchimp-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/mailchimp-64-1.png"
      }, {
        "id": "ex-mscrm",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-mscrm",
        "name": "MS Dynamics CRM",
        "description": "Microsoft\u2019s CRM solution",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/microsoft-dynamics32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/microsoft-dynamics64-1.png"
      }, {
        "id": "ex-netsuite",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-netsuite",
        "name": "Netsuite",
        "description": "The #1 Cloud Business Management Software Suite",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/netsuite32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/netsuite64-1.png"
      }, {
        "id": "ex-ooyala",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-ooyala",
        "name": "Ooyala",
        "description": "Reach, Measure & Monetize Online Video",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/ooyala32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/ooyala64-1.png"
      }, {
        "id": "ex-paymo",
        "type": "extractor",
        "uri": "https:\/\/paymo.keboola.com",
        "name": "Paymo",
        "description": "Time tracking & billing app",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/paymo32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/paymo64-1.png"
      }, {
        "id": "ex-pingdom",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-pingdom",
        "name": "Pingdom",
        "description": "Uptime and performance monitoring made easy",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/pingdom-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/pingdom-64-1.png"
      }, {
        "id": "ex-recurly",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-recurly",
        "name": "Recurly",
        "description": "Recurring billing platform",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/recurly32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/recurly64-1.png"
      }, {
        "id": "ex-s3",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/restbox",
        "name": "AWS S3",
        "description": "Cloud storage for the Internet",
        "hasUI": false,
        "hasRun": false,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/cloudsearch32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/cloudsearch64-1.png"
      }, {
        "id": "ex-sapi",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/restbox",
        "name": "Keboola Storage API",
        "description": "Cloud staging layer",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "ex-sfdc",
        "type": "extractor",
        "uri": "https:\/\/sfdc.keboola.com",
        "name": "SalesForce.com",
        "description": "World\u2019s #1 CRM sales app.",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/salesforce32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/salesforce64-1.png"
      }, {
        "id": "ex-sklik",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-sklik",
        "name": "Sklik",
        "description": "Advertise with Seznam.cz",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/sklik32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/sklik64-1.png"
      }, {
        "id": "ex-telfa",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-telfa",
        "name": "Telfa",
        "description": "Phone system for any orgranization",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/telfa32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/telfa64-1.png"
      }, {
        "id": "ex-twitter",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-twitter",
        "name": "Twitter",
        "description": "Get the data from your social network",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/twitter32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/twitter64-1.png"
      }, {
        "id": "ex-youtube",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-google-youtube",
        "name": "Youtube",
        "description": "Fetch data from Youtube Analytics",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/YouTube-icon-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/YouTube-icon-64-1.png"
      }, {
        "id": "ex-zendesk",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/ex-zendesk",
        "name": "Zendesk",
        "description": "Software for better customer service",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/zendesk-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/zendesk-64-1.png"
      }, {
        "id": "gooddata-writer",
        "type": "writer",
        "uri": "https:\/\/syrup.keboola.com\/gooddata-writer",
        "name": "GoodData",
        "description": "The Open Analytics Platform",
        "hasUI": true,
        "hasRun": false,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/gooddata32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/gooddata64-1.png"
      }, {
        "id": "orchestrator",
        "type": "other",
        "uri": "https:\/\/syrup.keboola.com\/orchestrator",
        "name": "Orchestrator",
        "description": "Jobs scheduler",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "orchestrator-2",
        "type": "other",
        "uri": "https:\/\/syrup.keboola.com\/orchestrator",
        "name": "Orchestrator",
        "description": "",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "pebble",
        "type": "writer",
        "uri": "https:\/\/syrup.keboola.com\/wr-iot",
        "name": "wr-iot",
        "description": "internet of things writer(FKA pebble)",
        "hasUI": false,
        "hasRun": false,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/pebble-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/pebble-64-1.png"
      }, {
        "id": "provisioning",
        "type": "other",
        "uri": "https:\/\/syrup.keboola.com\/provisioning",
        "name": "Provisioning",
        "description": "Transformation engine provisioning",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "queue",
        "type": "other",
        "uri": "https:\/\/syrup.keboola.com\/queue",
        "name": "Queue",
        "description": "Queue",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "restbox",
        "type": "extractor",
        "uri": "https:\/\/syrup.keboola.com\/restbox",
        "name": "REST Box",
        "description": "Custom HTTP component",
        "hasUI": true,
        "hasRun": true,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "rt-lucky-guess",
        "type": "other",
        "uri": "https:\/\/syrup.keboola.com\/rt-lucky-guess",
        "name": "Lucky Guess",
        "description": "Lucky Guess",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "transformation",
        "type": "transformation",
        "uri": "https:\/\/transformation.keboola.com",
        "name": "Transformations",
        "description": "Transform data",
        "hasUI": false,
        "hasRun": false,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "wr-cloudsearch",
        "type": "writer",
        "uri": "https:\/\/syrup.keboola.com\/wr-cloudsearch",
        "name": "AWS Cloudsearch",
        "description": "Search service for AWS Cloud",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/cloudsearch32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/cloudsearch64-1.png"
      }, {
        "id": "wr-db",
        "type": "writer",
        "uri": "https:\/\/syrup.keboola.com\/wr-db",
        "name": "Database writer",
        "description": "Write data to MySQL",
        "hasUI": true,
        "hasRun": true,
        "ico32": "",
        "ico64": ""
      }, {
        "id": "wr-elasticsearch",
        "type": "writer",
        "uri": "https:\/\/syrup.keboola.com\/wr-elasticsearch",
        "name": "Elasticsearch",
        "description": "End-to-end search and analytics platform",
        "hasUI": false,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/elasticsearch32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/elasticsearch64-1.png"
      }, {
        "id": "wr-tableau",
        "type": "writer",
        "uri": "https:\/\/syrup.keboola.com\/wr-db",
        "name": "Tableau",
        "description": "Writer to Tableau",
        "hasUI": true,
        "hasRun": true,
        "ico32": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/tableau-32-1.png",
        "ico64": "https:\/\/d3iz2gfan5zufq.cloudfront.net\/images\/cloud-services\/tableau-64-1.png"
      }
    ]);
    modules = ['kb.ui.inline-edit', 'kb.ui.datetime', 'kb.ui.tree', 'kb.ui.run-button', 'kb.ui.run-icon', 'kb.ui.loader', 'kb.ui.copy-button', 'kb.ui.duration', 'kb.filter.filesize', 'kb.sapi.error-handler', 'kb.ui.confirm', 'kb.ui.sapiConsoleHref', 'kb.ui.focus', 'kb.ui.check', 'kb.ui.search-filter', 'kb.ui.sapiComponentIcon', 'kb.ui.urlize', 'kb.ui.sapiEventsTable', 'kb.ui.notifications', 'kb.ui.protected', 'kb.ui.extractor-info', 'kb.ui.sapiInput'].sort();
    app.config(function($routeProvider) {
      angular.forEach(modules, function(module) {
        return $routeProvider.when("/" + module, {
          controller: module,
          templateUrl: "templates/" + module + ".html",
          module: module
        });
      });
      return $routeProvider.otherwise({
        redirectTo: modules[0]
      });
    });
    app.controller('app', function($scope, $location) {
      $scope.modules = modules;
      $scope.openModule = function(module) {
        return $location.path("/" + module);
      };
      return $scope.$on('$routeChangeSuccess', function(event, route) {
        return $scope.currentModule = route.module;
      });
    });
    app.controller('kb.ui.loader', function($scope, $timeout) {
      $scope.loader1loading = false;
      $scope.loader2loading = false;
      return $scope.loader2start = function() {
        $scope.loader2loading = true;
        return $timeout(function() {
          return $scope.loader2loading = false;
        }, 1000);
      };
    });
    app.controller('kb.ui.run-button', function($scope, $timeout) {
      $scope.isRunning = false;
      return $scope.run = function() {
        $scope.isRunning = true;
        return $timeout(function() {
          return $scope.isRunning = false;
        }, 1000);
      };
    });
    app.controller('kb.ui.run-icon', function($scope, $timeout) {
      $scope.isRunning = false;
      $scope.isDisabled = false;
      $scope["switch"] = function() {
        return $scope.isDisabled = !$scope.isDisabled;
      };
      return $scope.run = function() {
        $scope.isRunning = true;
        return $timeout(function() {
          return $scope.isRunning = false;
        }, 1000);
      };
    });
    app.controller('kb.ui.tree', function($scope) {
      return $scope.tree = {
        "id": 37382043,
        "uri": "https://connection.keboola.com//v2/storage/events/37382043",
        "event": "storage.bucketsListed",
        "component": "storage",
        "message": "Buckets listed.",
        "description": "",
        "type": "info",
        "runId": null,
        "created": "2013-03-22T14:08:58+0100",
        "published": "2013-03-22T14:08:58+0100",
        "configurationId": null,
        "context": {
          "remoteAddr": "10.77.5.27",
          "httpReferer": null,
          "httpUserAgent": "Keboola Storage API PHP Client",
          "apiVersion": {
            "major": "33",
            "minor": "2"
          }
        },
        "params": ['this', 'is', 'array'],
        "results": [
          {
            "duration": 234
          }, {
            "duration": 204
          }
        ],
        "performance": [],
        "token": {
          "name": "Master Token",
          "id": "491"
        },
        "attachments": []
      };
    });
    app.controller('kb.ui.datetime', function($scope) {
      $scope.times = ["2013-03-06T15:24:12+00:00", "Something...", ""];
      $scope.editTime = "2013-03-06T15:24:12+00:00";
      return $scope.editEmptyValue = "N/A";
    });
    app.controller('kb.ui.inline-edit', function($scope) {
      $scope.textEditValue = 'Martin';
      $scope.textEditPlaceholder = 'Enter some value';
      $scope.textEditTitle = 'Click to edit.';
      $scope.textEditDisabled = false;
      $scope.items = [];
      $scope.itemAdd = '';
      $scope.addItem = function(item) {
        return $scope.items.push(item);
      };
      $scope.saveTextEdit = function() {};
      $scope.textAreaValue = "Some text\nwith new\n\nlines";
      $scope.textAreaPlaceholder = 'Enter some text...';
      $scope.textAreaTitle = 'Click to edit.';
      $scope.textAreaDisabled = false;
      $scope.selectValue = 'Option 1';
      $scope.selectTitle = 'Edit selection';
      $scope.selectOptions = ['Option 1', 'Option 2', 'Option 3'];
      return $scope.selectDisabled = false;
    });
    app.controller('kb.ui.copy-button', function($scope) {
      $scope.copyValue = "Text to copy";
      $scope.copyMessage = "Text copied!";
      return $scope.copyTitle = "Copy text";
    });
    app.controller('kb.ui.duration', function($scope) {
      $scope.durations = [35, 126, 8600, 23400];
      $scope.editDuration = 130;
      return $scope.editEmptyValue = 'N/A';
    });
    app.controller('kb.filter.filesize', function($scope) {
      $scope.sizes = [125, 1356, 2345678, 797540352, 2345678000];
      return $scope.edit = {
        value: '',
        emptyValue: 'N/A'
      };
    });
    app.controller('kb.sapi.error-handler', function($scope, kbSapiErrorHandler) {
      $scope.error = {
        message: 'Error message text'
      };
      return $scope.triggerError = function(error) {
        return kbSapiErrorHandler.handleError(error);
      };
    });
    app.controller('kb.ui.confirm', function($scope, kbConfirm, $timeout) {
      $scope.buttonTypes = ['primary', 'danger', 'success', 'warning', 'info'];
      $scope.params = {
        header: 'Confirm header',
        message: 'Confirm message',
        confirmButton: {
          type: 'primary'
        }
      };
      $scope.result = null;
      $scope.confirm = function(params) {
        var modal;
        $scope.result = null;
        modal = kbConfirm.confirm(params);
        return modal.result.then(function() {
          return $scope.showResult('Confirmed!');
        }, function() {
          return $scope.showResult('Canceled!');
        });
      };
      $scope.showResult = function(message) {
        $scope.result = message;
        return $timeout(function() {
          return $scope.result = null;
        }, 2000);
      };
      return $scope.onConfirm = function() {
        return $scope.showResult('Confirmed!');
      };
    });
    app.controller('kb.ui.sapiConsoleHref', [
      "$scope", "kb.config", function($scope, kbConfig) {
        return $scope.form = {
          table: 'in.c-main.table'
        };
      }
    ]);
    app.controller('kb.ui.focus', function($scope) {
      return $scope.focus = {
        checked: false
      };
    });
    app.controller('kb.ui.check', function($scope) {
      return $scope.check = {
        checked: false
      };
    });
    app.controller('kb.ui.search-filter', function($scope) {
      $scope.search = {
        q: ''
      };
      $scope.countryFilter = '';
      return $scope.countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Anguilla", "Antigua &amp; Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia &amp; Herzegovina", "Botswana", "Brazil", "British Virgin Islands", "Brunei", "Bulgaria", "Burkina Faso", "Burundi"];
    });
    app.controller('kb.ui.sapiComponentIcon', function($scope, $http) {
      $scope.components = [];
      return $http.get('https://connection.keboola.com/v2/storage').success(function(response) {
        return $scope.components = response.components;
      });
    });
    app.controller('kb.ui.urlize', function($scope) {
      return $scope.content = "asdasd www.google.com asdsafasdf https://connection.keboola.com some other text <script>alert(1)</script> asdasd www.<script>alert(1)</script>.cz asdasdgg";
    });
    app.controller('kb.ui.sapiEventsTable', [
      "kbSapiService", "$scope", "kbSapiEventsService", function(sapiService, $scope, eventsService) {
        $scope.eventsUrl = '/storage/events';
        $scope.events = eventsService($scope.eventsUrl);
        $scope.token = "";
        $scope.tokenVerified = false;
        $scope.autoload = false;
        $scope.setToken = function() {
          $scope.tokenVerified = false;
          if (!$scope.token || $scope.token === "") {
            return;
          }
          $scope.verifying = true;
          $scope.error = null;
          return $scope.events.storageService.verifyAndSetToken($scope.token).then(function() {
            $scope.events.eventsUrl = $scope.eventsUrl;
            $scope.tokenVerified = true;
            $scope.verifying = false;
            return $scope.events.load();
          }, function(err) {
            $scope.error = err.data || error;
            return $scope.verifying = false;
          });
        };
        $scope.setFilter = function(pFilter) {
          $scope.filter = pFilter;
          $scope.events.setDefaultParam('q', $scope.filter);
          return $scope.events.refresh();
        };
        $scope.cancelFilter = function() {
          $scope.filter = "";
          return $scope.setFilter();
        };
        $scope.possibleHeaders = ["created", "event", "id", "component", "creator"];
        $scope.selectedHeader = ["created", "event"];
        $scope.setHeader = function(header) {
          if (__indexOf.call($scope.selectedHeader, header) >= 0) {
            return $scope.selectedHeader = _.filter($scope.selectedHeader, function(h) {
              return h !== header;
            });
          } else {
            return $scope.selectedHeader.push(header);
          }
        };
        return $scope.isChecked = function(header) {
          return __indexOf.call($scope.selectedHeader, header) >= 0;
        };
      }
    ]);
    app.controller('kb.ui.notifications', [
      '$scope', 'kbNotifications', function($scope, kbNotifications) {
        $scope.level = 'success';
        $scope.message = 'Notification';
        kbNotifications.add("warning", "Notification");
        return $scope.addNotification = function() {
          return kbNotifications.add($scope.level, $scope.message);
        };
      }
    ]);
    app.controller('kb.ui.protected', [
      '$scope', function($scope) {
        return $scope.isProtected = true;
      }
    ]);
    app.controller('kb.ui.extractor-info', [
      '$scope', function($scope) {
        $scope.account1 = null;
        $scope.configuration1 = {
          creatorToken: {
            description: 'user@keboola.com'
          },
          created: '2014-11-19T11:25:34+0100'
        };
        $scope.account2 = {
          username: 'customer@crm.com'
        };
        return $scope.configuration2 = {
          creatorToken: {
            description: 'user@keboola.com'
          },
          created: '2014-11-19T11:25:34+0100'
        };
      }
    ]);
    return app.controller('kb.ui.sapiInput', [
      "$scope", "kbSapiService", function($scope, sapiService) {
        $scope.input = "";
        $scope.token = "";
        $scope.bucketSet = false;
        return $scope.setToken = function() {
          var stages;
          if (!$scope.bucketSet) {
            $scope.bucketid = null;
          }
          $scope.excludeStages = "";
          stages = [];
          if ($scope.sys) {
            stages.push("sys");
          }
          if ($scope.out) {
            stages.push("out");
          }
          if ($scope["in"]) {
            stages.push("in");
          }
          $scope.excludeStages = stages.join();
          $scope.tokenSet = true;
          return sapiService.apiToken = $scope.token;
        };
      }
    ]);
  })(window.angular);

}).call(this);
