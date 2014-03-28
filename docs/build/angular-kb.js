/**
 * KB - extensions library for AngularJS
 * @version v0.9.4 - 2014-03-28
 * @link 
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */(function() {

  angular.module('kb.config', []).value('kb.config', {});

  angular.module('kb.templates', []);

  angular.module('kb', ['kb.config', 'kb.ui.inlineEdit', 'kb.ui.clickToggle', 'kb.ui.copyButton', 'kb.ui.nl2br', 'kb.ui.sapiEventsTable', 'kb.ui.loader', 'kb.ui.autoComplete', 'kb.ui.focus', 'kb.ui.tree', 'kb.ui.runButton', 'kb.ui.codemirror', 'kb.ui.datetime', 'kb.ui.duration', 'kb.ui.sapiConsoleHref', 'kb.ui.confirm', 'kb.utils.multipartUpload', 'kb.utils.csv', 'kb.utils.keyboardShortcuts', 'kb.utils.appVersion', 'kb.filters.date', 'kb.filters.filesize', 'kb.filters.webalize', 'kb.filters.duration', 'kb.sapi.sapiService', 'kb.sapi.eventsService', 'kb.sapi.errorHandler', 'kb.templates']);

}).call(this);

(function() {

  angular.module("kb.exceptionHandler", ["kb.exceptionHandler.logger"]).factory("$exceptionHandler", [
    "$window", "$log", "kbLogger", function($window, $log, logger) {
      $window.onerror = jQuery.proxy(logger.onError, logger);
      return function(exception, cause) {
        logger.logException(exception, cause);
        return $log.error.apply($log, arguments);
      };
    }
  ]);

}).call(this);

(function() {

  angular.module("kb.exceptionHandler.logger", []).factory("kb.Logger", [
    "$window", function($window) {
      var Logger;
      return Logger = (function() {

        function Logger() {}

        Logger.prototype.onError = function(errorMsg, file, lineNumber) {
          return this.log({
            message: errorMsg,
            file: file,
            lineNumber: lineNumber
          });
        };

        Logger.prototype.log = function(data) {
          var extendedData, _ref;
          extendedData = angular.extend({}, data, {
            href: (_ref = $window.location) != null ? _ref.href : void 0
          });
          return this.logRaw(extendedData);
        };

        Logger.prototype.logRaw = function(data) {
          return jQuery.ajax({
            url: "/utils/errors",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            dataType: "json"
          });
        };

        Logger.prototype.logException = function(exception) {
          return this.log({
            message: exception.message,
            stackTrace: exception.stack
          });
        };

        return Logger;

      })();
    }
  ]).factory("kbLogger", [
    "kb.Logger", function(Logger) {
      return new Logger();
    }
  ]);

}).call(this);

(function() {

  angular.module('kb.filters.date', []).filter('kbdate', [
    "$filter", function($filter) {
      var R_ISO8601_STR, dateFilter;
      dateFilter = $filter('date');
      R_ISO8601_STR = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d):?(\d\d)?$/;
      return function(date, format) {
        if (date && date.match(R_ISO8601_STR)) {
          return dateFilter(date, format);
        }
        return date;
      };
    }
  ]);

}).call(this);


/*
  Formats duration in seconds to minutes, hours, ...
*/


(function() {

  angular.module('kb.filters.duration', []).filter('kbDuration', function() {
    return function(duration) {
      var value;
      value = function(durationCoverted, singular, plural) {
        var rounded;
        rounded = Math.round(durationCoverted * 2) / 2;
        if (rounded > 1) {
          return "" + rounded + " " + plural;
        } else {
          return "" + rounded + " " + singular;
        }
      };
      switch (false) {
        case !(duration < 60):
          return value(duration, 'sec', 'secs');
        case !(duration < 60 * 60):
          return value(duration / 60, 'min', 'mins');
        default:
          return value(duration / (60 * 60), 'hour', 'hours');
      }
    };
  });

}).call(this);


/*
  File size formatter: https://github.com/avoidwork/filesize.js
*/


(function() {

  angular.module('kb.filters.filesize', []).filter('kbfilesize', function() {
    var fileSize;
    fileSize = (function ( global ) {
			"use strict";

			var base    = 10,
			    right   = /\.(.*)/,
			    bit     = /b$/,
			    byte    = /^B$/,
			    zero    = /^0$/,
			    options = {
			    	all : {
			    		increments : [["B", 1], ["Kb", 128], ["KB", 1024], ["Mb", 131072], ["MB", 1024*1024], ["Gb", 1.342e+8], ["GB", 1.074e+9], ["Tb", 1.374e+11], ["TB", 1.1e+12], ["Pb", 1.407e+14], ["PB", 1.126e+15]],
			    		nth        : 11
			    	},
			    	bitless : {
			    		increments : [["B", 1], ["KB", 1024], ["MB", 1024*1024], ["GB", 1024*1024*1024], ["TB", 1024*1024*1024*1024], ["PB", 1.126e+15]],
			    		nth        : 6
			    	}
			    };

			/**
			 * filesize
			 *
			 * @param  {Mixed}   arg  String, Int or Float to transform
			 * @param  {Mixed}   pos  [Optional] Position to round to, defaults to 2 if short is ommitted, or "true" for shorthand output
			 * @param  {Boolean} bits [Optional] Determines if "bit" sizes are used for result calculation, default is true
			 * @return {String}       Readable file size String
			 */
			function filesize (arg) {
				var result = "",
				    bits   = true,
				    skip   = false,
				    i, neg, num, pos, short, size, sizes, suffix, z;

				// Determining arguments
				if (arguments[3] !== undefined) {
					pos   = arguments[1];
					short = arguments[2];
					bits  = arguments[3];
				}
				else {
					typeof arguments[1] === "boolean" ? short = arguments[1] : pos = arguments[1];

					if ( typeof arguments[2] === "boolean" ) {
						bits = arguments[2];
					}
				}

				if ( isNaN( arg ) || ( pos !== undefined && isNaN( pos ) ) ) {
					throw Error("Invalid arguments");
				}

				short = ( short === true );
				bits  = ( bits === true );
				pos   = short ? 1 : ( pos === undefined ? 2 : parseInt( pos, base ) );
				num   = Number( arg );
				neg   = ( num < 0 );

				// Flipping a negative number to determine the size
				if ( neg ) {
					num = -num;
				}

				// Zero is now a special case because bytes divide by 1
				if ( num === 0 ) {
					result = "0B";
				}
				else {
					if ( bits ) {
						sizes = options.all.increments;
						i     = options.all.nth;
					}
					else {
						sizes = options.bitless.increments;
						i     = options.bitless.nth;
					}

					while ( i-- ) {
						size   = sizes[i][1];
						suffix = sizes[i][0];

						if ( num >= size ) {
							// Treating bytes as cardinal
							if ( byte.test( suffix ) ) {
								skip = true;
								pos  = 0;
							}

							result = ( num / size ).toFixed( pos );

							if ( !skip && short ) {
								if ( bits && bit.test( suffix ) ) {
									suffix = suffix.toLowerCase();
								}

								suffix = suffix.charAt( 0 );
								z      = right.exec( result );

								if ( z !== null && z[1] !== undefined && zero.test( z[1] ) ) {
									result = parseInt( result, base );
								}
							}

							result += suffix;
							break;
						}
					}
				}

				// Decorating a 'diff'
				if ( neg ) {
					result = "-" + result;
				}

				return result;
			};

			return filesize;
		})( this );;
    return function(value, emptyValue) {
      if (emptyValue == null) {
        emptyValue = 'N/A';
      }
      if (!angular.isNumber(value)) {
        return emptyValue;
      }
      return fileSize(value, 2, false);
    };
  });

}).call(this);

(function() {

  angular.module('kb.filters.webalize', []).filter('kbwebalize', function() {
    var REMOVE_DIACRITICS_MAP, removeDiacritics, removeDiacriticsCache;
    REMOVE_DIACRITICS_MAP = [
      {
        base: 'A',
        letters: /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g
      }, {
        base: 'AA',
        letters: /[\uA732]/g
      }, {
        base: 'AE',
        letters: /[\u00C6\u01FC\u01E2]/g
      }, {
        base: 'AO',
        letters: /[\uA734]/g
      }, {
        base: 'AU',
        letters: /[\uA736]/g
      }, {
        base: 'AV',
        letters: /[\uA738\uA73A]/g
      }, {
        base: 'AY',
        letters: /[\uA73C]/g
      }, {
        base: 'B',
        letters: /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g
      }, {
        base: 'C',
        letters: /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g
      }, {
        base: 'D',
        letters: /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g
      }, {
        base: 'DZ',
        letters: /[\u01F1\u01C4]/g
      }, {
        base: 'Dz',
        letters: /[\u01F2\u01C5]/g
      }, {
        base: 'E',
        letters: /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g
      }, {
        base: 'F',
        letters: /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g
      }, {
        base: 'G',
        letters: /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g
      }, {
        base: 'H',
        letters: /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g
      }, {
        base: 'I',
        letters: /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g
      }, {
        base: 'J',
        letters: /[\u004A\u24BF\uFF2A\u0134\u0248]/g
      }, {
        base: 'K',
        letters: /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g
      }, {
        base: 'L',
        letters: /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g
      }, {
        base: 'LJ',
        letters: /[\u01C7]/g
      }, {
        base: 'Lj',
        letters: /[\u01C8]/g
      }, {
        base: 'M',
        letters: /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g
      }, {
        base: 'N',
        letters: /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g
      }, {
        base: 'NJ',
        letters: /[\u01CA]/g
      }, {
        base: 'Nj',
        letters: /[\u01CB]/g
      }, {
        base: 'O',
        letters: /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g
      }, {
        base: 'OI',
        letters: /[\u01A2]/g
      }, {
        base: 'OO',
        letters: /[\uA74E]/g
      }, {
        base: 'OU',
        letters: /[\u0222]/g
      }, {
        base: 'P',
        letters: /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g
      }, {
        base: 'Q',
        letters: /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g
      }, {
        base: 'R',
        letters: /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g
      }, {
        base: 'S',
        letters: /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g
      }, {
        base: 'T',
        letters: /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g
      }, {
        base: 'TZ',
        letters: /[\uA728]/g
      }, {
        base: 'U',
        letters: /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g
      }, {
        base: 'V',
        letters: /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g
      }, {
        base: 'VY',
        letters: /[\uA760]/g
      }, {
        base: 'W',
        letters: /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g
      }, {
        base: 'X',
        letters: /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g
      }, {
        base: 'Y',
        letters: /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g
      }, {
        base: 'Z',
        letters: /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g
      }, {
        base: 'a',
        letters: /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g
      }, {
        base: 'aa',
        letters: /[\uA733]/g
      }, {
        base: 'ae',
        letters: /[\u00E6\u01FD\u01E3]/g
      }, {
        base: 'ao',
        letters: /[\uA735]/g
      }, {
        base: 'au',
        letters: /[\uA737]/g
      }, {
        base: 'av',
        letters: /[\uA739\uA73B]/g
      }, {
        base: 'ay',
        letters: /[\uA73D]/g
      }, {
        base: 'b',
        letters: /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g
      }, {
        base: 'c',
        letters: /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g
      }, {
        base: 'd',
        letters: /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g
      }, {
        base: 'dz',
        letters: /[\u01F3\u01C6]/g
      }, {
        base: 'e',
        letters: /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g
      }, {
        base: 'f',
        letters: /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g
      }, {
        base: 'g',
        letters: /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g
      }, {
        base: 'h',
        letters: /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g
      }, {
        base: 'hv',
        letters: /[\u0195]/g
      }, {
        base: 'i',
        letters: /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g
      }, {
        base: 'j',
        letters: /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g
      }, {
        base: 'k',
        letters: /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g
      }, {
        base: 'l',
        letters: /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g
      }, {
        base: 'lj',
        letters: /[\u01C9]/g
      }, {
        base: 'm',
        letters: /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g
      }, {
        base: 'n',
        letters: /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g
      }, {
        base: 'nj',
        letters: /[\u01CC]/g
      }, {
        base: 'o',
        letters: /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g
      }, {
        base: 'oi',
        letters: /[\u01A3]/g
      }, {
        base: 'ou',
        letters: /[\u0223]/g
      }, {
        base: 'oo',
        letters: /[\uA74F]/g
      }, {
        base: 'p',
        letters: /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g
      }, {
        base: 'q',
        letters: /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g
      }, {
        base: 'r',
        letters: /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g
      }, {
        base: 's',
        letters: /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g
      }, {
        base: 't',
        letters: /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g
      }, {
        base: 'tz',
        letters: /[\uA729]/g
      }, {
        base: 'u',
        letters: /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g
      }, {
        base: 'v',
        letters: /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g
      }, {
        base: 'vy',
        letters: /[\uA761]/g
      }, {
        base: 'w',
        letters: /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g
      }, {
        base: 'x',
        letters: /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g
      }, {
        base: 'y',
        letters: /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g
      }, {
        base: 'z',
        letters: /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g
      }, {
        base: '-',
        letters: /\s/g
      }
    ];
    removeDiacriticsCache = {};
    removeDiacritics = function(str) {
      var cached, item, key, _i, _len;
      key = '_' + str;
      cached = removeDiacriticsCache[key];
      if (cached) {
        return cached;
      }
      for (_i = 0, _len = REMOVE_DIACRITICS_MAP.length; _i < _len; _i++) {
        item = REMOVE_DIACRITICS_MAP[_i];
        str = str.replace(item.letters, item.base);
      }
      return removeDiacriticsCache[key] = str;
    };
    return function(string) {
      return removeDiacritics(string).toLowerCase().replace(/\ /g, '-').replace(/[^a-z0-9\-]/g, '');
    };
  });

}).call(this);

(function() {

  angular.module("kb.i18n", [], [
    "$provide", function($provide) {
      var PLURAL_CATEGORY;
      PLURAL_CATEGORY = {
        ZERO: "zero",
        ONE: "one",
        TWO: "two",
        FEW: "few",
        MANY: "many",
        OTHER: "other"
      };
      return $provide.value("$locale", {
        DATETIME_FORMATS: {
          MONTH: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          SHORTMONTH: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          DAY: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          SHORTDAY: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          AMPMS: ["AM", "PM"],
          medium: "MMM d, y h:mm:ss a",
          short: "M/d/yy h:mm a",
          fullDate: "yyyy-MM-dd HH:mm",
          longDate: "MMMM d, y",
          mediumDate: "MMM d, y",
          shortDate: "M/d/yy",
          mediumTime: "h:mm:ss a",
          shortTime: "h:mm a"
        },
        NUMBER_FORMATS: {
          DECIMAL_SEP: ".",
          GROUP_SEP: ",",
          PATTERNS: [
            {
              minInt: 1,
              minFrac: 0,
              macFrac: 0,
              posPre: "",
              posSuf: "",
              negPre: "-",
              negSuf: "",
              gSize: 3,
              lgSize: 3,
              maxFrac: 3
            }, {
              minInt: 1,
              minFrac: 2,
              macFrac: 0,
              posPre: "¤",
              posSuf: "",
              negPre: "(¤",
              negSuf: ")",
              gSize: 3,
              lgSize: 3,
              maxFrac: 2
            }
          ],
          CURRENCY_SYM: "$"
        },
        pluralCat: function(n) {
          if (n === 1) {
            returnPLURAL_CATEGORY.ONE;
          }
          return returnPLURAL_CATEGORY.OTHER;
        },
        id: "en-us"
      });
    }
  ]);

}).call(this);

(function() {

  angular.module("kb.sapi.errorHandler", ["ui.bootstrap.modal", "ui.bootstrap.tpls"]).factory("kbSapiErrorHandler", [
    "$modal", function($modal) {
      var handler;
      handler = void 0;
      handler = {
        remainingTimeText: function(estimatedEndTime) {
          var minutes;
          minutes = void 0;
          minutes = Math.round((estimatedEndTime - new Date()) / (1000 * 60));
          if (minutes > 0) {
            return "after " + minutes + " minutes.";
          } else {
            return " in few minutes.";
          }
        },
        handleError: function(errorResponse) {
          var errorMessage, modalInstance;
          errorMessage = void 0;
          errorMessage = errorResponse.message || errorResponse.error || "Unknown error during comunication with API";
          if (errorResponse.status === "maintenance") {
            errorMessage = errorResponse.reason;
            errorMessage += ". Please repeat the action " + this.remainingTimeText(new Date(errorResponse.estimatedEndTime));
          }
          return modalInstance = $modal.open({
            template: "<div class=\"modal-header\">\n<h4 class=\"modal-title\">Application error</h4>\n</div>\n<div class=\"modal-body\">\n<p>{{ message }}</p>\n<p ng-show=\"exceptionId\">\nException ID: <strong>{{ exceptionId }}</strong>\n</p>\n</div>\n<div class=\"modal-footer\">\n<button class=\"btn btn-danger\" ng-click=\"close()\">Close</button>\n</div>",
            resolve: {
              message: function() {
                return errorMessage;
              },
              exceptionId: function() {
                return errorResponse.exceptionId;
              }
            },
            controller: [
              "$scope", "$modalInstance", "message", "exceptionId", function($scope, $modalInstance, message, exceptionId) {
                $scope.message = message;
                $scope.exceptionId = exceptionId;
                return $scope.close = function() {
                  return $modalInstance.close();
                };
              }
            ]
          });
        }
      };
      return handler;
    }
  ]);

}).call(this);


/*
  SAPI events service
*/


(function() {

  (function(angular) {
    var StorageEventsService;
    angular.module('kb.sapi.eventsService', ['kb.sapi.sapiService']).factory("kbSapiEventsService", [
      'kbSapiService', function(storageService) {
        return function(eventsUrl, filter) {
          if (filter == null) {
            filter = null;
          }
          return new StorageEventsService(eventsUrl, storageService, filter);
        };
      }
    ]);
    return StorageEventsService = (function() {

      function StorageEventsService(eventsUrl, storageService) {
        this.eventsUrl = eventsUrl;
        this.storageService = storageService;
        this.events = [];
        this.olderEventsLoading = false;
        this.newEventsLoading = false;
        this.hasOlderEvents = true;
        this.loaded = false;
        this.defaultParams = {
          limit: 50,
          offset: 0
        };
      }

      StorageEventsService.prototype.setDefaultParam = function(name, value) {
        this.defaultParams[name] = value;
        return this;
      };

      StorageEventsService.prototype.load = function(params) {
        var eventsService;
        eventsService = this;
        return this._load(params).success(function(events) {
          eventsService.events = eventsService.uniqEvents(eventsService.events.concat(events));
          if (!eventsService.events.length) {
            return eventsService.hasOlderEvents = false;
          }
        });
      };

      StorageEventsService.prototype.refresh = function() {
        var eventsService;
        eventsService = this;
        this.newEventsLoading = true;
        this.hasOlderEvents = true;
        return this.load().success(function(events) {
          eventsService.newEventsLoading = false;
          return eventsService.events = events;
        });
      };

      StorageEventsService.prototype.loadNewEvents = function() {
        var eventsService, newest;
        eventsService = this;
        newest = _.max(this.events, function(event) {
          return event.id;
        });
        this.newEventsLoading = true;
        return this._load({
          sinceId: newest.id
        }).success(function(events) {
          eventsService.newEventsLoading = false;
          return eventsService.events = eventsService.uniqEvents(eventsService.events.concat(events));
        });
      };

      StorageEventsService.prototype.uniqEvents = function(events) {
        return _.uniq(events, function(event) {
          return event.id;
        });
      };

      StorageEventsService.prototype.loadOlderEvents = function() {
        var eventsService, oldest;
        eventsService = this;
        oldest = _.min(this.events, function(event) {
          return event.id;
        });
        this.olderEventsLoading = true;
        return this._load({
          maxId: oldest.id
        }).success(function(events) {
          eventsService.olderEventsLoading = false;
          eventsService.events = eventsService.uniqEvents(eventsService.events.concat(events));
          if (!events.length) {
            return eventsService.hasOlderEvents = false;
          }
        });
      };

      StorageEventsService.prototype._load = function(params) {
        var eventsService;
        eventsService = this;
        return this.storageService.http({
          url: this.storageService.url(this.eventsUrl),
          method: 'GET',
          params: angular.extend({}, this.defaultParams, params)
        }).error(function(data, status, headers, config) {
          eventsService.newEventsLoading = false;
          eventsService.olderEventsLoading = false;
          return eventsService.storageService.errorHandler(data, status, headers, config);
        }).success(function(events) {
          return eventsService.loaded = true;
        });
      };

      return StorageEventsService;

    })();
  })(window.angular);

}).call(this);


/*
  Storage API wrapper
*/


(function() {
  var __hasProp = {}.hasOwnProperty,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function(angular) {
    var StorageService, Token;
    angular.module('kb.sapi.sapiService', ['kb.utils.csv', 'kb.utils.multipartUpload']).factory("kbSapiService", [
      '$http', '$rootScope', 'kbCsv', 'kbMultipartUpload', '$q', '$timeout', function($http, $rootScope, csv, multipartUpload, $q, $timeout) {
        return new StorageService($http, $rootScope, csv, multipartUpload, $q, $timeout);
      }
    ]);
    Token = (function() {

      function Token(data) {
        this.data = data;
      }

      Token.prototype.canManageTokens = function() {
        return this.data.canManageTokens;
      };

      Token.prototype.canCreateBucket = function() {
        return this.data.canManageBuckets;
      };

      Token.prototype.canWriteBucket = function(bucketId) {
        return this.data.bucketPermissions[bucketId] === 'write' || this.data.bucketPermissions[bucketId] === 'manage';
      };

      Token.prototype.canManageBucket = function(bucketId) {
        return this.data.bucketPermissions[bucketId] === 'manage';
      };

      Token.prototype.setBucketPermission = function(bucketId, permission) {
        return this.data.bucketPermissions[bucketId] = permission;
      };

      Token.prototype.hasAccessToBuckets = function() {
        var count, key, value, _ref;
        count = 0;
        _ref = this.data.bucketPermissions;
        for (key in _ref) {
          if (!__hasProp.call(_ref, key)) continue;
          value = _ref[key];
          count++;
        }
        return count > 0;
      };

      return Token;

    })();
    return StorageService = (function() {

      function StorageService($http, $rootScope, csv, multipartUpload, $q, $timeout) {
        this.$http = $http;
        this.$rootScope = $rootScope;
        this.csv = csv;
        this.multipartUpload = multipartUpload;
        this.$q = $q;
        this.$timeout = $timeout;
        this.errorHandler = __bind(this.errorHandler, this);

        this.setVerifiedToken = __bind(this.setVerifiedToken, this);

        this.apiToken = '';
        this.token = {};
        this.endpoint = this.defaultEndpoint = 'https://connection.keboola.com';
        this.consoleUrl = 'https://storage-api-console.keboola.com';
        this.apiVersion = 'v2';
      }

      StorageService.prototype.isAuthenticated = function() {
        return this.apiToken !== '';
      };

      StorageService.prototype.setApiToken = function(token) {
        this.apiToken = token;
        return this;
      };

      StorageService.prototype.verifyAndSetToken = function(token, callback) {
        var service;
        service = this;
        return this.$http({
          url: this.url('/storage/tokens/verify'),
          method: 'GET',
          headers: {
            'x-storageapi-token': token
          }
        }).success(this.setVerifiedToken);
      };

      StorageService.prototype.setVerifiedToken = function(tokenData) {
        this.setApiToken(tokenData.token);
        return this.token = new Token(tokenData);
      };

      StorageService.prototype.http = function(params) {
        if (!params.headers) {
          params.headers = {};
        }
        angular.extend(params.headers, {
          'x-storageapi-token': this.apiToken
        });
        return this.$http(params).error(this.errorHandler);
      };

      StorageService.prototype.url = function(path) {
        return this.endpoint + '/' + this.apiVersion + path;
      };

      StorageService.prototype.resetSession = function() {
        return this.apiToken = '';
      };

      StorageService.prototype.consoleSignedUrl = function(path) {
        if (path == null) {
          path = '/';
        }
        return "" + this.consoleUrl + path + "?token=" + this.apiToken + "&endpoint=" + this.endpoint;
      };

      StorageService.prototype.index = function() {
        return this.http({
          url: this.url("/storage"),
          method: 'GET'
        });
      };

      StorageService.prototype.createBucket = function(stage, name, description) {
        return this.http({
          url: this.url("/storage/buckets"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            name: name,
            stage: stage,
            description: description
          })
        });
      };

      StorageService.prototype.createTable = function(bucketId, name, columns) {
        return this.http({
          url: this.url("/storage/buckets/" + bucketId + "/tables"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            name: name,
            dataString: columns.join(",")
          })
        });
      };

      StorageService.prototype.createTableAsync = function(bucketId, params) {
        if (!angular.isUndefined(params.transactional)) {
          params.transactional = Number(params.transactional);
        }
        return this.http({
          url: this.url("/storage/buckets/" + bucketId + "/tables-async"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(params)
        });
      };

      StorageService.prototype.createTableFromSnapshot = function(bucketId, snapshotId, name) {
        if (name == null) {
          name = null;
        }
        return this.createTableAsync(bucketId, {
          snapshotId: snapshotId,
          name: name
        });
      };

      StorageService.prototype.rollbackTableFromSnapshot = function(tableId, snapshotId) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/rollback"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            snapshotId: snapshotId
          })
        });
      };

      StorageService.prototype.getTable = function(id) {
        return this.http({
          url: this.url('/storage/tables/' + id),
          method: 'GET'
        });
      };

      StorageService.prototype.createTableSnapshot = function(tableId, description) {
        if (description == null) {
          description = null;
        }
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/snapshots"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            description: description
          })
        });
      };

      StorageService.prototype.getTableSnapshots = function(tableId, params) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/snapshots"),
          method: 'GET',
          params: params
        });
      };

      StorageService.prototype.getSnapshot = function(id) {
        return this.http({
          url: this.url("/storage/snapshots/" + id),
          method: 'GET'
        });
      };

      StorageService.prototype.getTables = function(params) {
        return this.http({
          url: this.url('/storage/tables/'),
          method: 'GET',
          params: params
        });
      };

      StorageService.prototype.deleteTable = function(id) {
        var service;
        service = this;
        return this.http({
          url: this.url('/storage/tables/' + id),
          method: 'DELETE'
        });
      };

      StorageService.prototype.unlinkTable = function(id) {
        return this.http({
          url: this.url('/storage/tables/' + id),
          method: 'DELETE',
          params: {
            unlink: 1
          }
        });
      };

      StorageService.prototype.deleteTableColumn = function(tableId, columnName) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/columns/" + columnName),
          method: 'DELETE'
        });
      };

      StorageService.prototype.addTableColumn = function(tableId, columnName) {
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/columns/'),
          method: 'POST',
          params: {
            name: columnName
          }
        });
      };

      StorageService.prototype.addTableColumnToIndexed = function(tableId, columnName) {
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/indexed-columns'),
          method: 'POST',
          params: {
            name: columnName
          }
        });
      };

      StorageService.prototype.removeTableColumnFromIndexedColumns = function(tableId, columnName) {
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/indexed-columns/' + columnName),
          method: 'DELETE'
        });
      };

      StorageService.prototype.deleteTableRows = function(tableId, params) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/rows"),
          method: 'DELETE',
          params: params
        });
      };

      StorageService.prototype.truncateTable = function(tableId) {
        return this.deleteTableRows(tableId);
      };

      StorageService.prototype.createAliasTable = function(bucketId, options) {
        return this.http({
          url: this.url("/storage/buckets/" + bucketId + "/table-aliases"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(options)
        });
      };

      StorageService.prototype.setAliasTableFilter = function(tableId, filterOptions) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/alias-filter"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(filterOptions)
        });
      };

      StorageService.prototype.removeAliasTableFilter = function(tableId) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/alias-filter"),
          method: 'DELETE'
        });
      };

      StorageService.prototype.enableAliasTableColumnsAutoSync = function(tableId) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/alias-columns-auto-sync"),
          method: 'POST'
        });
      };

      StorageService.prototype.disableAliasTableColumnsAutoSync = function(tableId) {
        return this.http({
          url: this.url("/storage/tables/" + tableId + "/alias-columns-auto-sync"),
          method: 'DELETE'
        });
      };

      StorageService.prototype.deleteTableAttribute = function(tableId, attributeName) {
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/attributes/' + attributeName),
          method: 'DELETE'
        });
      };

      StorageService.prototype.saveTableAttribute = function(tableId, name, value, protectedValue) {
        var data;
        data = {
          value: value
        };
        if (!angular.isUndefined(protectedValue)) {
          data['protected'] = protectedValue;
        }
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/attributes/' + name),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(data)
        }).success(function(data) {});
      };

      StorageService.prototype.deleteBucketAttribute = function(bucketId, attributeName) {
        return this.http({
          url: this.url('/storage/buckets/' + bucketId + '/attributes/' + attributeName),
          method: 'DELETE'
        });
      };

      StorageService.prototype.saveBucketAttribute = function(bucketId, name, value, protectedValue) {
        var data;
        data = {
          value: value
        };
        if (!angular.isUndefined(protectedValue)) {
          data['protected'] = protectedValue;
        }
        return this.http({
          url: this.url('/storage/buckets/' + bucketId + '/attributes/' + name),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(data)
        });
      };

      StorageService.prototype.deleteBucket = function(id) {
        return this.http({
          url: this.url('/storage/buckets/' + id),
          method: 'DELETE'
        });
      };

      StorageService.prototype.errorHandler = function(data, status, headers, config) {
        if (_.isEmpty(data)) {
          return;
        }
        return this.$rootScope.$broadcast('storageError', data);
      };

      StorageService.prototype.getBucketsWithTables = function(tablesParams, bucketsParams) {
        var buckets, bucketsLoading, deferred, promise, storageService, tablesLoading, tmpBuckets, tmpTables;
        if (tablesParams == null) {
          tablesParams = null;
        }
        if (bucketsParams == null) {
          bucketsParams = null;
        }
        storageService = this;
        buckets = [];
        tmpBuckets = [];
        tmpTables = [];
        bucketsLoading = this.getBuckets(bucketsParams).success(function(data, status) {
          return tmpBuckets = data;
        }).error(function() {
          return storageService.bucketsLoading = false;
        });
        tablesLoading = this.getTables(tablesParams).success(function(data) {
          return tmpTables = data;
        });
        deferred = this.$q.defer();
        this.$q.all([bucketsLoading, tablesLoading]).then(function() {
          var tablesMap;
          tablesMap = {};
          angular.forEach(tmpTables, function(table) {
            if (!tablesMap[table.bucket.id]) {
              tablesMap[table.bucket.id] = [];
            }
            return tablesMap[table.bucket.id].push(table);
          });
          angular.forEach(tmpBuckets, function(bucket) {
            bucket.tables = [];
            if (tablesMap[bucket.id]) {
              return bucket.tables = tablesMap[bucket.id];
            }
          });
          angular.forEach(_.sortBy(tmpBuckets, function(bucket) {
            return bucket.id;
          }), function(bucket) {
            return buckets.push(bucket);
          });
          return deferred.resolve(buckets);
        });
        promise = deferred.promise;
        promise.success = function(fn) {
          promise.then(function(response) {
            return fn(response.data, response.status, response.headers);
          });
          return promise;
        };
        return promise;
      };

      StorageService.prototype.getBuckets = function(params) {
        return this.http({
          url: this.url('/storage/buckets/'),
          method: 'GET',
          params: params
        });
      };

      StorageService.prototype.getBucket = function(id) {
        return this.http({
          url: this.url('/storage/buckets/' + id),
          method: 'GET'
        });
      };

      StorageService.prototype.exportUrl = function(tableId, limit) {
        return this.url('/storage/tables/' + tableId + '/export' + (limit ? '?limit=' + limit : ''));
      };

      StorageService.prototype.exportDownloadUrl = function(tableId, limit) {
        return this.url('/storage/tables/' + tableId + '/export?token=' + this.apiToken + (limit ? '&limit=' + limit : ''));
      };

      StorageService.prototype.saveTableData = function(tableId, rawData, options) {
        var params;
        params = angular.extend({}, options, {
          dataString: rawData
        });
        if (!angular.isUndefined(params.incremental)) {
          params.incremental = Number(params.incremental);
        }
        if (!angular.isUndefined(params.partial)) {
          params.partial = Number(params.partial);
        }
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/import'),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(params)
        });
      };

      StorageService.prototype.saveTableDataAsync = function(tableId, params) {
        if (!angular.isUndefined(params.incremental)) {
          params.incremental = Number(params.incremental);
        }
        if (!angular.isUndefined(params.partial)) {
          params.partial = Number(params.partial);
        }
        return this.http({
          url: this.url('/storage/tables/' + tableId + '/import-async'),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(params)
        });
      };

      StorageService.prototype.tableData = function(tableId, options, callback) {
        var csv, deferred, params, promise;
        if (options == null) {
          options = {};
        }
        if (callback == null) {
          callback = null;
        }
        csv = this.csv;
        deferred = this.$q.defer();
        params = angular.isNumber(options) ? {
          limit: options
        } : options;
        this.http({
          url: this.exportUrl(tableId) + "?" + $.param(params),
          method: 'GET'
        }).success(function(data) {
          var parsed;
          parsed = csv.parse(data);
          parsed = {
            header: parsed.shift(),
            data: parsed
          };
          if (callback) {
            callback(parsed);
          }
          return deferred.resolve(parsed);
        }).error(function(data, status, headers, config) {
          return deferred.reject({
            data: data,
            status: status,
            heders: headers,
            config: config
          });
        });
        promise = deferred.promise;
        promise.success = function(fn) {
          promise.then(function(parsedData) {
            return fn(parsedData);
          });
          return promise;
        };
        promise.error = function(fn) {
          promise.then(null, function(response) {
            return fn(response.data, response.status, response.headers);
          });
          return promise;
        };
        return promise;
      };

      StorageService.prototype.getTokens = function() {
        return this.http({
          url: this.url('/storage/tokens/'),
          method: 'GET'
        });
      };

      StorageService.prototype.getToken = function(id) {
        return this.http({
          url: this.url("/storage/tokens/" + id),
          method: 'GET'
        });
      };

      StorageService.prototype.createToken = function(token) {
        var params;
        params = {
          description: token.description,
          expiresIn: token.expiresIn,
          canManageBuckets: token.canManageBuckets,
          canReadAllFileUploads: token.canReadAllFileUploads
        };
        angular.forEach(token.bucketPermissions, function(permission, bucketId) {
          return params['bucketPermissions[' + bucketId + ']'] = permission;
        });
        return this.http({
          url: this.url('/storage/tokens/'),
          method: 'POST',
          params: params
        }).success(function(data, status) {
          return angular.copy(data, token);
        });
      };

      StorageService.prototype.saveToken = function(token) {
        var params;
        params = {
          description: token.description
        };
        angular.forEach(token.bucketPermissions, function(permission, bucketId) {
          return params['bucketPermissions[' + bucketId + ']'] = permission;
        });
        return this.http({
          url: this.url('/storage/tokens/' + token.id),
          method: 'PUT',
          params: params
        }).success(function(data, status) {
          return angular.copy(data, token);
        });
      };

      StorageService.prototype.refreshToken = function(token) {
        var service;
        service = this;
        return this.http({
          url: this.url('/storage/tokens/' + token.id + '/refresh'),
          method: 'POST'
        }).success(function(data, status) {
          if (token.token === service.apiToken) {
            service.verifyAndSetToken(data.token);
          }
          return angular.copy(data, token);
        });
      };

      StorageService.prototype.deleteToken = function(tokenId) {
        return this.http({
          url: this.url('/storage/tokens/' + tokenId),
          method: 'DELETE'
        });
      };

      StorageService.prototype.shareToken = function(tokenId, recipientEmail, message) {
        return this.http({
          url: this.url("/storage/tokens/" + tokenId + "/share"),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param({
            recipientEmail: recipientEmail,
            message: message
          })
        });
      };

      StorageService.prototype.getFiles = function(params) {
        return this.http({
          url: this.url('/storage/files'),
          method: 'GET',
          params: params
        });
      };

      StorageService.prototype.prepareFileUpload = function(params) {
        return this.http({
          url: this.url('/storage/files/prepare'),
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          data: $.param(params)
        });
      };

      StorageService.prototype.getJobs = function(params) {
        return this.http({
          url: this.url('/storage/jobs'),
          method: 'GET',
          params: params
        });
      };

      StorageService.prototype.getJob = function(id) {
        return this.http({
          url: this.url("/storage/jobs/" + id),
          method: 'GET'
        });
      };

      /*
        	# Accepts HTTP requests promise - expects job resource returned
          # Returns promise
          # Job resource is polled until job is executed
          # Promise is resolved when job finishes with success otherwise promise is rejected
      */


      StorageService.prototype.resolveAsyncRequest = function(httpRequestPromise) {
        var deferred, fetchJob, jobError, jobSuccess, service;
        deferred = this.$q.defer();
        service = this;
        jobError = function(error) {
          service.errorHandler(error);
          return deferred.reject(error);
        };
        jobSuccess = function(results) {
          return deferred.resolve(results);
        };
        fetchJob = function(jobId) {
          return service.pollJobUntilDone(jobId).then(function(finishedJob) {
            if (finishedJob.status === 'success') {
              jobSuccess(finishedJob.results);
            }
            if (finishedJob.status === 'error') {
              return jobError(finishedJob.error);
            }
          }, function(error) {
            return jobError(error);
          });
        };
        httpRequestPromise.success(function(job) {
          return fetchJob(job.id);
        }).error(function(error) {
          return jobError(error);
        });
        return deferred.promise;
      };

      /*
        	# Poll job resource until job status is `success` or `error`
          # Resolved as error after 20 tries
          # Returns promise - resolved when job is finished
      */


      StorageService.prototype.pollJobUntilDone = function(id, maxAttemptsCount) {
        var attemptsCount, checkJob, deferred, jobFetchError, jobReceived, service;
        if (maxAttemptsCount == null) {
          maxAttemptsCount = 20;
        }
        deferred = this.$q.defer();
        service = this;
        attemptsCount = 0;
        jobReceived = function(job) {
          if (job.status === 'success' || job.status === 'error') {
            deferred.resolve(job);
            return;
          }
          return checkJob();
        };
        jobFetchError = function(data) {
          service.errorHandler(data);
          return deferred.reject(data);
        };
        checkJob = function() {
          return service.$timeout(function() {
            attemptsCount++;
            if (attemptsCount >= maxAttemptsCount) {
              jobFetchError({
                error: "Timeout after " + maxAttemptsCount + " requests"
              });
              return;
            }
            return service.getJob(id).success(jobReceived).error(jobFetchError);
          }, Math.min((Math.pow(2, attemptsCount) * 100) + (Math.round(Math.random() * 100)), 60 * 1000), false);
        };
        checkJob();
        return deferred.promise;
      };

      StorageService.prototype.generateId = function() {
        return this.http({
          url: this.url('/storage/tickets'),
          method: 'POST'
        }).error(this.errorHandler);
      };

      return StorageService;

    })();
  })(window.angular);

}).call(this);

(function() {

  angular.module('kb.ui.autoComplete', []).directive('kbAutoComplete', function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        var changeHandler, options;
        options = scope.$eval(attrs.kbAutoComplete) || {};
        changeHandler = function(event, ui) {
          var _ref;
          if ((_ref = ui.item) != null ? _ref.value : void 0) {
            return scope.$apply(function() {
              return ngModel.$setViewValue(ui.item.value);
            });
          }
        };
        if (options.change) {
          options.change = function(event, ui) {
            options.change(event, ui);
            return changeHandler(event, ui);
          };
        } else {
          options.change = changeHandler;
        }
        return element.autocomplete(options);
      }
    };
  });

}).call(this);


/*
	Inverts value of kbClickToggle attribute on click
*/


(function() {

  angular.module('kb.ui.clickToggle', []).directive('kbClickToggle', [
    '$parse', function($parse) {
      return function(scope, element, attrs) {
        var getter, setter, toggle;
        getter = $parse(attrs.kbClickToggle);
        setter = getter.assign;
        toggle = function(event) {
          return scope.$apply(function() {
            return setter(scope, !getter(scope));
          });
        };
        element.bind('click', toggle);
        return element.bind('$destroy', function() {
          return element.unbind('click', toggle);
        });
      };
    }
  ]);

}).call(this);


/*
  kbCodemirror options passed to CodeMirror instance create
  Special options:
  	- cursorPos: sets cursor position after initialization

  CodeMirror
*/


(function() {

  angular.module('kb.ui.codemirror', ['kb.config']).directive('kbCodemirror', [
    "$timeout", "$window", "kb.config", function($timeout, $window, config) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ngModel) {
          var opts;
          opts = angular.extend({}, config.codemirror || {}, scope.$eval(attrs.kbCodemirror));
          return $timeout(function() {
            var codeMirror;
            codeMirror = CodeMirror.fromTextArea(element[0], opts);
            if (opts.cursorPos) {
              codeMirror.setCursor(opts.cursorPos);
              $window.scrollTo(codeMirror.cursorCoords().left, codeMirror.cursorCoords().top);
            }
            codeMirror.on('change', function(cm) {
              var newValue;
              newValue = cm.getValue();
              return ngModel.$setViewValue(newValue);
            });
            codeMirror.on('blur', function(cm) {
              return angular.element(cm.getWrapperElement()).removeClass('focused');
            });
            codeMirror.on('focus', function(cm) {
              return angular.element(cm.getWrapperElement()).addClass('focused');
            });
            ngModel.$formatters.push(function(value) {
              if (angular.isUndefined(value) || value === null) {
                return '';
              }
              if (angular.isObject(value) || angular.isArray(value)) {
                throw new Error('ui-codemirror cannot use an object or an array as a model');
              }
              return value;
            });
            return ngModel.$render = function() {
              return codeMirror.setValue(ngModel.$viewValue);
            };
          });
        }
      };
    }
  ]);

}).call(this);

(function() {

  angular.module('kb.ui.confirm', ['kb.config', 'ui.bootstrap.modal', 'ngSanitize']).factory('kbConfirm', [
    '$modal', function($modal) {
      var confirm, defaultParams;
      defaultParams = {
        header: '',
        message: '',
        cancelButton: {
          label: 'Cancel',
          type: ''
        },
        confirmButton: {
          label: 'Confirm',
          type: 'primary'
        }
      };
      confirm = {
        confirm: function(params) {
          return $modal.open({
            templateUrl: "kb/ui/confirm/templates/confirm.html",
            resolve: {
              params: function() {
                return jQuery.extend(true, {}, defaultParams, params);
              }
            },
            controller: [
              '$scope', '$modalInstance', 'params', function($scope, $modalInstance, params) {
                $scope.params = params;
                $scope.close = function() {
                  return $modalInstance.dismiss();
                };
                return $scope.confirm = function() {
                  return $modalInstance.close();
                };
              }
            ]
          });
        }
      };
      return confirm;
    }
  ]).directive('kbConfirm', [
    'kbConfirm', '$parse', function(kbConfirm, $parse) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          var action;
          action = $parse(attrs['onConfirm']);
          element.on('click', function() {
            var modal, params;
            params = {
              header: attrs.header,
              message: attrs.message,
              confirmButton: {}
            };
            if (attrs.confirmLabel !== '') {
              params.confirmButton.label = attrs.confirmLabel;
            }
            if (attrs.confirmType !== '') {
              params.confirmButton.type = attrs.confirmType;
            }
            modal = kbConfirm.confirm(params);
            return modal.result.then(function() {
              return action(scope);
            });
          });
        }
      };
    }
  ]);

}).call(this);


/*
  Requires: components/bootstrap/js/tooltip.js
*/


(function() {

  angular.module('kb.ui.copyButton', ['kb.config']).directive('kbCopyButton', [
    '$timeout', 'kb.config', function($timeout, config) {
      var clip, swfPath, _ref, _ref1;
      swfPath = (_ref = config['ui']) != null ? (_ref1 = _ref['copy-button']) != null ? _ref1['swfPath'] : void 0 : void 0;
      if (!swfPath) {
        swfPath = '/components/zeroclipboard/ZeroClipboard.swf';
      }
      clip = new ZeroClipboard(null, {
        moviePath: swfPath,
        allowScriptAccess: "always",
        trustedDomains: ['*']
      });
      clip.on('complete', function() {
        angular.element(clip.htmlBridge).attr('data-original-title', angular.element(this).attr('copy-message'));
        return angular.element(clip.htmlBridge).tooltip('show');
      });
      clip.on('load', function(client) {
        return angular.element(client.htmlBridge).tooltip();
      });
      clip.on('mouseover', function() {
        angular.element(clip.htmlBridge).attr('data-original-title', angular.element(this).attr('title'));
        return angular.element(clip.htmlBridge).tooltip('show');
      });
      return {
        restrict: 'E',
        scope: {
          copyValue: '=',
          copyTitle: '@',
          copyMessage: '@'
        },
        transclude: true,
        template: "<span ng-transclude class=\"kb-copy-button\" title=\"{{ copyTitle }}\" data-clipboard-text=\"{{ copyValue }}\" copy-message=\"{{ copyMessage }}\"></span>",
        link: function(scope, element) {
          var copyElement;
          copyElement = element.find('.kb-copy-button');
          clip.glue(copyElement);
          return scope.$on('$destroy', function() {
            return clip.unglue(copyElement);
          });
        }
      };
    }
  ]);

}).call(this);


/*
# Accepts datetime in ISO_8601 format and converts to current client timezone
# otherwise original value is displayed
*/


(function() {

  angular.module('kb.ui.datetime', ['ui.bootstrap.tooltip', 'ui.bootstrap.tpls']).directive('kbDatetime', [
    "$filter", function($filter) {
      var R_ISO8601_STR, dateFilter;
      dateFilter = $filter('date');
      R_ISO8601_STR = /^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d):(\d\d)([+-])(\d\d):?(\d\d)?$/;
      return {
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: {
          datetime: '=',
          emptyValue: '@'
        },
        template: "<span ng-cloak ng-class=\"{'muted': isEmpty()}\">\n	{{ formattedValue() }}\n	<i class=\"kb-datetime glyphicon glyphicon-time\" tooltip=\"{{ tooltipTitle }}\" ng-show=\"isDatetime()\"></i>\n</span>",
        link: function(scope, element, attrs) {
          scope.tooltipTitle = '';
          scope.resolveEmptyValue = function() {
            if (!scope.emptyValue) {
              return 'N/A';
            }
            return scope.emptyValue;
          };
          scope.isEmpty = function() {
            return !scope.datetime;
          };
          scope.isDatetime = function() {
            return !!(scope.datetime && scope.datetime.match(R_ISO8601_STR));
          };
          scope.$watch('datetime', function() {
            return scope.tooltipTitle = scope.isDatetime() ? "Original time: " + scope.datetime : "";
          });
          return scope.formattedValue = function() {
            if (scope.isEmpty()) {
              return scope.resolveEmptyValue();
            }
            if (scope.isDatetime()) {
              return dateFilter(scope.datetime, 'fullDate');
            }
            return scope.datetime;
          };
        }
      };
    }
  ]);

}).call(this);


/*
  Formatted duration
*/


(function() {

  angular.module('kb.ui.duration', ['kb.filters.duration']).directive('kbDuration', function() {
    return {
      restrict: 'E',
      scope: {
        duration: '=',
        emptyValue: '@'
      },
      replace: true,
      template: "<span title=\"{{ duration }} seconds\">\n	<span ng-hide=\"isEmpty()\">{{ duration | kbDuration }}</span>\n	<span ng-show=\"isEmpty()\" class=\"muted\">{{ getEmptyValue() }}</span>\n</span>",
      link: function(scope) {
        scope.isEmpty = function() {
          return scope.duration === null || angular.isUndefined(scope.duration);
        };
        return scope.getEmptyValue = function() {
          if (angular.isUndefined(scope.emptyValue)) {
            return "N/A";
          } else {
            return scope.emptyValue;
          }
        };
      }
    };
  });

}).call(this);


/*
  Input autofocus
*/


(function() {

  angular.module('kb.ui.focus', []).directive('kbFocus', [
    "$timeout", function($timeout) {
      return function(scope, element) {
        return $timeout(function() {
          return element.focus();
        }, 50);
      };
    }
  ]);

}).call(this);

(function() {

  (function(angular) {
    var inlineEditFactory, module;
    module = angular.module('kb.ui.inlineEdit', []);
    inlineEditFactory = function(templateUrl) {
      return function() {
        return {
          restrict: 'E',
          scope: {
            value: '=',
            disabled: '=',
            onSave: '&',
            placeholder: '@',
            editTitle: '@'
          },
          templateUrl: templateUrl,
          controller: [
            "$scope", "$element", "$attrs", "$timeout", function(scope, element, attrs, $timeout) {
              var resolveTooltip;
              element.addClass('kb-inline-edit');
              element.addClass(element[0].tagName.toLowerCase());
              scope.tooltipTitle = '';
              resolveTooltip = function() {
                if (scope.isEditing || scope.disabled) {
                  return scope.tooltipTitle = '';
                } else {
                  return scope.tooltipTitle = scope.editTitle;
                }
              };
              scope.$watch('disabled', function(disabled) {
                if (disabled) {
                  element.addClass('disabled');
                } else {
                  element.removeClass('disabled');
                }
                if (scope.isEditing && !disabled) {
                  scope.edit();
                } else {
                  scope.cancel();
                }
                return resolveTooltip();
              });
              scope.$watch('isEditing', resolveTooltip);
              scope.$watch('editTitle', resolveTooltip);
              scope.edit = function() {
                if (scope.disabled) {
                  return;
                }
                scope.isEditing = true;
                scope.editValue = scope.value;
                angular.element('body').bind('click.inlineEdit', function() {
                  scope.$apply(function() {
                    return scope.cancel();
                  });
                  return true;
                });
                element.bind('click.inlineEdit', function(e) {
                  return e.stopPropagation();
                });
                element.bind('keyup.inlineEdit', function(e) {
                  if (e.keyCode === 13 && element.get(0).tagName.toLocaleLowerCase() !== 'kb-inline-edit-textarea') {
                    scope.$apply(scope.save);
                  }
                  if (e.keyCode === 27) {
                    scope.$apply(scope.cancel);
                  }
                  return false;
                });
                return $timeout(function() {
                  return element.find(':input').not('button').focus();
                });
              };
              scope.cancel = function() {
                scope.isEditing = false;
                angular.element('body').unbind('.inlineEdit');
                element.unbind('.inlineEdit');
              };
              return scope.save = function() {
                scope.value = scope.editValue;
                if (angular.isFunction(scope.onSave)) {
                  $timeout(function() {
                    return scope.onSave({
                      newValue: scope.editValue
                    });
                  });
                }
                return scope.cancel();
              };
            }
          ]
        };
      };
    };
    return module.factory('kbInlineEdit', function() {
      return inlineEditFactory;
    }).directive('kbInlineEdit', inlineEditFactory("kb/ui/inline-edit/templates/text.html")).directive('kbInlineEditDatetime', inlineEditFactory("kb/ui/inline-edit/templates/datetime.html")).directive('kbInlineEditTextarea', inlineEditFactory("kb/ui/inline-edit/templates/textarea.html")).directive('kbInlineEditSelect', function() {
      var config;
      config = inlineEditFactory("kb/ui/inline-edit/templates/select.html")();
      config.scope.options = '=';
      return config;
    });
  })(window.angular);

}).call(this);

(function() {

  angular.module('kb.ui.loader', []).directive('kbLoader', function() {
    return {
      restrict: 'E',
      template: "<a kb-loader class=\"kb-loader\">\n	<i class=\"glyphicon glyphicon-refresh\"> </i>\n</a>",
      replace: true,
      link: function(scope, element, attrs) {
        var icon;
        icon = element.find('i');
        return scope.$watch(attrs.isLoading, function(newValue) {
          icon.removeClass('loading');
          if (newValue) {
            return icon.addClass('loading');
          }
        });
      }
    };
  });

}).call(this);


/*
  Convert new lines into <br/>
*/


(function() {

  angular.module('kb.ui.nl2br', []).directive('kbNl2br', function() {
    return function(scope, element, attr) {
      return scope.$watch(attr.kbNl2br, function(text) {
        var textParts, textWithNormalizedLineBreaks;
        if (text == null) {
          text = '';
        }
        textWithNormalizedLineBreaks = text.replace('\r\n', '\n');
        textParts = textWithNormalizedLineBreaks.split('\n');
        element.empty();
        return angular.forEach(textParts, function(textPart, index) {
          var isLastTextPart, textElement;
          textElement = angular.element('<span></span>');
          textElement.text(textPart);
          element.append(textElement);
          isLastTextPart = (textParts.length - 1) === index;
          if (!isLastTextPart) {
            return element.append(angular.element('<br/>'));
          }
        });
      });
    };
  });

}).call(this);

(function() {

  angular.module('kb.ui.runButton', ['kb.ui.loader']).directive('kbRunButton', function() {
    return {
      restrict: 'E',
      template: "<button class=\"btn btn-default run-transformation kb-loader\">\n	<i  class=\"glyphicon glyphicon-play\"> </i>\n</button>",
      replace: true,
      link: function(scope, element, attrs) {
        var icon;
        icon = element.find('i');
        return scope.$watch(attrs.isRunning, function(newValue) {
          element.removeClass('running');
          icon.removeClass('glyphicon-refresh');
          icon.removeClass('glyphicon-play');
          icon.removeClass('loading');
          if (newValue) {
            element.addClass('running');
            return icon.addClass('glyphicon-refresh loading');
          } else {
            return icon.addClass('glyphicon-play');
          }
        });
      }
    };
  });

}).call(this);


/*
  Link to SAPI Console
  Token is transfered threw POST body instead of URL parameters
  Implemented by form submit into blank window
*/


(function() {

  angular.module('kb.ui.sapiConsoleHref', ['kb.sapi.sapiService']).directive('kbSapiConsoleHref', [
    "kbSapiService", "$sce", function(sapiService, $sce) {
      return {
        restrict: 'E',
        transclude: true,
        scope: {
          path: '@',
          token: '@'
        },
        template: "<form action=\"{{ url() }}\" method=\"post\" class=\"kb-sapi-console-href\" target=\"_blank\">\n	<a ng-click=\"submit()\" ng-transclude></a>\n	<input type=\"hidden\" name=\"token\" value=\"{{ getToken() }}\" />\n</form>",
        link: function(scope, element) {
          var path;
          path = function() {
            return scope.path || "/";
          };
          scope.getToken = function() {
            if (scope.token) {
              return scope.token;
            } else {
              return sapiService.apiToken;
            }
          };
          scope.url = function() {
            return $sce.trustAsResourceUrl("" + sapiService.consoleUrl + (path()) + "?endpoint=" + sapiService.endpoint);
          };
          return scope.submit = function() {
            element.find('form').submit();
          };
        }
      };
    }
  ]);

}).call(this);


/*
  Storage API events table
*/


(function() {

  angular.module('kb.ui.sapiEventsTable', ['kb.sapi.eventsService', 'kb.ui.tree']).directive('kbSapiEventsTable', function() {
    var config, deprecatedAuthorizationText, infoEvents, successEvents, templates;
    successEvents = ['storage.tableImportDone'];
    infoEvents = ['storage.tableExported'];
    templates = {
      table: "<div class=\"kb-sapi-events-table\">\n	<div ng-show=\"events.events.length && events.loaded && !selectedEvent\">\n		<table class=\"table table-striped table-events\">\n			<tbody>\n				<tr ng-repeat=\"event in events.events | orderBy:'id':true track by event.id\" ng-class=\"eventClass(event)\" ng-click=\"eventDetail(event)\" title=\"Event id: {{ event.id }}\">\n					<td class=\"created\">{{ event.created | date:'MMM d, HH:mm:ss' }}</td>\n					<td>{{ feedMessage(event) }}</td>\n				</tr>\n			</tbody>\n		</table>\n		<div class=\"list-more\" ng-show=\"events.hasOlderEvents\">\n			<button ng-click=\"events.loadOlderEvents()\" class=\"btn btn-default btn-large\" ng-disabled=\"events.olderEventsLoading\">More..</button>\n		</div>\n	</div>\n	<div ng-show=\"!events.events.length && events.loaded\">\n		<div class=\"well\">\n			There are no events yet.\n		</div>\n	</div>\n	<div ng-show=\"!events.loaded\">\n		<div class=\"well\">\n			<i class=\"icon-refresh loading\"></i>\n			Loading events...\n		</div>\n	</div>\n							 <div class=\"event-detail\" ng-show=\"selectedEvent\">\n										 <a ng-click=\"leaveEventDetail()\">\n											<i class=\"icon-chevron-left\"></i> Back to events list\n										 </a>\n							 			<h3>Event detail</h3>\n									 <div class=\"well message\" ng-class=\"eventClass(selectedEvent)\">\n												{{ selectedEvent.message }}\n											</div>\n\n											<p class=\"well\" ng-show=\"selectedEvent.description\">\n												{{ selectedEvent.description }}\n											</p>\n									 \n											<div class=\"tab-pane active\" id=\"tableOverview\">\n												<table class=\"table\">\n													<tbody>\n														<tr>\n														<td>ID</td>\n														<td>{{ selectedEvent.id }}</td>\n														</tr>\n														<tr>\n														<td>Created</td>\n														<td><kb-datetime datetime=\"selectedEvent.created\"></kb-datetime></td>\n														</tr>\n														<tr>\n														<td>Component</td>\n														<td>{{ selectedEvent.component }}</td>\n														</tr>\n														<tr>\n															<td>Configuration ID</td>\n															<td>{{ selectedEvent.configurationId || \"N/A\" }}</td>\n														</tr>\n														<tr>\n														<td>Run ID</td>\n														<td>{{ selectedEvent.runId || \"N/A\" }}</td>\n														</tr>\n													</tbody>\n												</table>\n											</div>\n\n											<div ng-show=\"selectedEvent.attachments.length\">\n												<h3>Attachments</h3>\n												<ul>\n													<li ng-repeat=\"attachment in selectedEvent.attachments\">\n														<a href=\"{{ attachment.url }}\">\n															{{ attachment.uploadType }} ({{ attachment.sizeBytes | kbfilesize}})\n														</a>\n													</li>\n												</ul>\n											</div>\n									 \n											<div ng-show=\"selectedEvent.params\">\n												<h3>Parameters</h3>\n												<kb-tree data=\"selectedEvent.params\"></kb-tree>\n											</div>\n									 \n											<div ng-show=\"selectedEvent.performance\">\n												<h3>Performance</h3>\n												<kb-tree data=\"selectedEvent.performance\"></kb-tree>\n											</div>\n									 \n											<div ng-show=\"selectedEvent.results\">\n												<h3>Results</h3>\n												<kb-tree data=\"selectedEvent.results\"></kb-tree>\n											</div>\n									 \n											<div ng-show=\"selectedEvent.context\">\n												<h3>Context</h3>\n												<kb-tree data=\"selectedEvent.context\"></kb-tree>\n											</div>\n\n										 <a ng-click=\"leaveEventDetail()\">\n										 	<i class=\"icon-chevron-left\"></i> Back to events list\n										 </a>\n							 </div>\n</div>"
    };
    deprecatedAuthorizationText = "Deprecated authorization method used.";
    return config = {
      restrict: 'E',
      replace: true,
      scope: {
        events: '=',
        autoReload: '='
      },
      template: templates.table,
      controller: [
        "$scope", "$element", "$compile", "$timeout", function($scope, $element, $compile, $timeout) {
          var loadNewEvents, timeoutId;
          timeoutId = null;
          $scope.selectedEvent = null;
          $scope.eventClass = function(event) {
            var _ref;
            if (!event) {
              return '';
            }
            if (event.type === 'error') {
              return 'error';
            }
            if (event.type === 'warn') {
              return 'warning';
            }
            if (event.type === 'success') {
              return 'success';
            }
            if (event.event === 'storage.tableImportDone' && ((_ref = event.results.warnings) != null ? _ref.length : void 0) > 0) {
              return 'warning';
            }
            if (_.indexOf(successEvents, event.event) >= 0) {
              return 'success';
            } else if (_.indexOf(infoEvents, event.event) >= 0) {
              return 'info';
            } else {
              return '';
            }
          };
          $scope.eventDetail = function(event) {
            return $scope.selectedEvent = event;
          };
          $scope.leaveEventDetail = function() {
            console.log = 'leave event';
            return $scope.selectedEvent = null;
          };
          $scope.isEmpty = function(attr) {
            return !_.size(attr || []);
          };
          $scope.eventType = function(event) {
            switch (event.event) {
              case "storage.tableImportError":
              case "storage.tableImportDone":
                return {
                  icon: "icon-arrow-up",
                  tooltip: "Import action"
                };
              case "storage.tableExported":
                return {
                  icon: "icon-arrow-down",
                  tooltip: "Export action"
                };
              default:
                return {
                  icon: "",
                  tooltip: ""
                };
            }
          };
          $scope.eventTypeTooltip = function(event) {
            return {
              title: $scope.eventType(event).tooltip
            };
          };
          $scope.feedMessage = function(event) {
            var text;
            text = event.configurationId ? "" + event.configurationId + " - " : "";
            text += event.message;
            return text;
          };
          $scope.deprecatedAuthorizationTooltip = function() {
            return {
              title: deprecatedAuthorizationText
            };
          };
          $scope.isDeprecatedAuthorization = function(event) {
            return event.context.authorization === 'deprecated';
          };
          $scope.$on('$destroy', function() {
            return $timeout.cancel(timeoutId);
          });
          loadNewEvents = function() {
            return timeoutId = $timeout((function() {
              var resolveReload;
              resolveReload = function() {
                if ($scope.autoReload) {
                  return loadNewEvents();
                } else {
                  return timeoutId = null;
                }
              };
              return $scope.events.loadNewEvents().success(resolveReload).error(resolveReload);
            }), 1000);
          };
          return $scope.$watch('autoReload', function(autoReload) {
            if (autoReload && !timeoutId) {
              return loadNewEvents();
            }
          });
        }
      ]
    };
  });

}).call(this);

(function() {

  angular.module('kb.ui.tree', []).directive('kbTreeNode', [
    "$compile", function($compile) {
      var directive, leafTemplate, nodeTemplate;
      nodeTemplate = "<div class=\"kb-tree-node\">\n	<div ng-repeat=\"(key, value) in data\">\n		<span class=\"key\">{{ key }}:</span>\n		<kb-tree-node data=\"value\"></kb-tree-node\">\n	</div>\n</div>";
      leafTemplate = "<span class=\"value\">\n	{{ data }}\n</span>";
      directive = {
        restrict: 'E',
        replace: true,
        scope: {
          data: '='
        },
        link: function(scope, element, attrs) {
          var linkFunction, templateDomElement;
          scope.isNode = function() {
            return angular.isObject(scope.data) || angular.isArray(scope.data);
          };
          templateDomElement = angular.element(scope.isNode() ? nodeTemplate : leafTemplate);
          linkFunction = $compile(templateDomElement);
          linkFunction(scope);
          return element.empty().replaceWith(templateDomElement);
        }
      };
      return directive;
    }
  ]).directive('kbTree', [
    "$compile", function($compile) {
      var directive, template;
      template = "<div class=\"kb-tree\">\n	<kb-tree-node data=\"data\"></kb-tree-node>\n</div>";
      return directive = {
        restrict: 'E',
        scope: {
          data: '='
        },
        link: function(scope, element) {
          return scope.$watch('data', function() {
            var domElement, link;
            domElement = angular.element(template);
            link = $compile(domElement);
            link(scope);
            return element.html(null).append(domElement);
          });
        }
      };
    }
  ]);

}).call(this);

(function() {

  angular.module('kb.utils.appVersion', []).provider('kbAppVersion', [
    '$sceDelegateProvider', function($sceDelegateProvider) {
      var basePath, provider, version;
      version = 'v1';
      basePath = '/';
      this.setVersion = function(newVersion) {
        version = newVersion;
        return this;
      };
      this.setBasePath = function(newBasePath) {
        basePath = newBasePath;
        $sceDelegateProvider.resourceUrlWhitelist(['self', basePath + '**']);
        return this;
      };
      this.versionUrl = function(url) {
        return basePath + url + '?version=' + version;
      };
      provider = this;
      this.$get = [
        '$sce', function($sce) {
          return {
            version: function() {
              return version;
            },
            versionUrl: function(url) {
              return provider.versionUrl(url);
            }
          };
        }
      ];
    }
  ]);

}).call(this);


/*
  CSV parer
  Depends on: /app/libs/csv/csv.js
*/


(function() {

  angular.module('kb.utils.csv', []).factory('kbCsv', function() {
    var csvParser;
    csvParser = (function(){
			  /*
			   * Generated by PEG.js 0.7.0.
			   *
			   * http://pegjs.majda.cz/
			   */

			  function quote(s) {
			    /*
			     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
			     * string literal except for the closing quote character, backslash,
			     * carriage return, line separator, paragraph separator, and line feed.
			     * Any character may appear in the form of an escape sequence.
			     *
			     * For portability, we also escape escape all control and non-ASCII
			     * characters. Note that "\0" and "\v" escape sequences are not used
			     * because JSHint does not like the first and IE the second.
			     */
			     return '"' + s
			      .replace(/\\/g, '\\\\')  // backslash
			      .replace(/"/g, '\\"')    // closing quote character
			      .replace(/\x08/g, '\\b') // backspace
			      .replace(/\t/g, '\\t')   // horizontal tab
			      .replace(/\n/g, '\\n')   // line feed
			      .replace(/\f/g, '\\f')   // form feed
			      .replace(/\r/g, '\\r')   // carriage return
			      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
			      + '"';
			  }

			  var result = {
			    /*
			     * Parses the input with a generated parser. If the parsing is successfull,
			     * returns a value explicitly or implicitly specified by the grammar from
			     * which the parser was generated (see |PEG.buildParser|). If the parsing is
			     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
			     */
			    parse: function(input, startRule) {
			      var parseFunctions = {
			        "comma": parse_comma,
			        "sv": parse_sv,
			        "line": parse_line,
			        "field": parse_field,
			        "char": parse_char
			      };

			      if (startRule !== undefined) {
			        if (parseFunctions[startRule] === undefined) {
			          throw new Error("Invalid rule name: " + quote(startRule) + ".");
			        }
			      } else {
			        startRule = "comma";
			      }

			      var pos = 0;
			      var reportFailures = 0;
			      var rightmostFailuresPos = 0;
			      var rightmostFailuresExpected = [];

			      function padLeft(input, padding, length) {
			        var result = input;

			        var padLength = length - input.length;
			        for (var i = 0; i < padLength; i++) {
			          result = padding + result;
			        }

			        return result;
			      }

			      function escape(ch) {
			        var charCode = ch.charCodeAt(0);
			        var escapeChar;
			        var length;

			        if (charCode <= 0xFF) {
			          escapeChar = 'x';
			          length = 2;
			        } else {
			          escapeChar = 'u';
			          length = 4;
			        }

			        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
			      }

			      function matchFailed(failure) {
			        if (pos < rightmostFailuresPos) {
			          return;
			        }

			        if (pos > rightmostFailuresPos) {
			          rightmostFailuresPos = pos;
			          rightmostFailuresExpected = [];
			        }

			        rightmostFailuresExpected.push(failure);
			      }

			      function parse_comma() {
			        var result0, result1;
			        var pos0, pos1;

			        pos0 = pos;
			        pos1 = pos;
			        result0 = (function(offset) { return separator = ','; })(pos) ? "" : null;
			        if (result0 !== null) {
			          result1 = parse_sv();
			          if (result1 !== null) {
			            result0 = [result0, result1];
			          } else {
			            result0 = null;
			            pos = pos1;
			          }
			        } else {
			          result0 = null;
			          pos = pos1;
			        }
			        if (result0 !== null) {
			          result0 = (function(offset, sv) { return sv; })(pos0, result0[1]);
			        }
			        if (result0 === null) {
			          pos = pos0;
			        }
			        return result0;
			      }

			      function parse_sv() {
			        var result0, result1, result2, result3, result4;
			        var pos0, pos1, pos2, pos3;

			        pos0 = pos;
			        pos1 = pos;
			        result0 = [];
			        if (/^[\n\r]/.test(input.charAt(pos))) {
			          result1 = input.charAt(pos);
			          pos++;
			        } else {
			          result1 = null;
			          if (reportFailures === 0) {
			            matchFailed("[\\n\\r]");
			          }
			        }
			        while (result1 !== null) {
			          result0.push(result1);
			          if (/^[\n\r]/.test(input.charAt(pos))) {
			            result1 = input.charAt(pos);
			            pos++;
			          } else {
			            result1 = null;
			            if (reportFailures === 0) {
			              matchFailed("[\\n\\r]");
			            }
			          }
			        }
			        if (result0 !== null) {
			          result1 = parse_line();
			          if (result1 !== null) {
			            result2 = [];
			            pos2 = pos;
			            pos3 = pos;
			            if (/^[\n\r]/.test(input.charAt(pos))) {
			              result4 = input.charAt(pos);
			              pos++;
			            } else {
			              result4 = null;
			              if (reportFailures === 0) {
			                matchFailed("[\\n\\r]");
			              }
			            }
			            if (result4 !== null) {
			              result3 = [];
			              while (result4 !== null) {
			                result3.push(result4);
			                if (/^[\n\r]/.test(input.charAt(pos))) {
			                  result4 = input.charAt(pos);
			                  pos++;
			                } else {
			                  result4 = null;
			                  if (reportFailures === 0) {
			                    matchFailed("[\\n\\r]");
			                  }
			                }
			              }
			            } else {
			              result3 = null;
			            }
			            if (result3 !== null) {
			              result4 = parse_line();
			              if (result4 !== null) {
			                result3 = [result3, result4];
			              } else {
			                result3 = null;
			                pos = pos3;
			              }
			            } else {
			              result3 = null;
			              pos = pos3;
			            }
			            if (result3 !== null) {
			              result3 = (function(offset, data) { return data; })(pos2, result3[1]);
			            }
			            if (result3 === null) {
			              pos = pos2;
			            }
			            while (result3 !== null) {
			              result2.push(result3);
			              pos2 = pos;
			              pos3 = pos;
			              if (/^[\n\r]/.test(input.charAt(pos))) {
			                result4 = input.charAt(pos);
			                pos++;
			              } else {
			                result4 = null;
			                if (reportFailures === 0) {
			                  matchFailed("[\\n\\r]");
			                }
			              }
			              if (result4 !== null) {
			                result3 = [];
			                while (result4 !== null) {
			                  result3.push(result4);
			                  if (/^[\n\r]/.test(input.charAt(pos))) {
			                    result4 = input.charAt(pos);
			                    pos++;
			                  } else {
			                    result4 = null;
			                    if (reportFailures === 0) {
			                      matchFailed("[\\n\\r]");
			                    }
			                  }
			                }
			              } else {
			                result3 = null;
			              }
			              if (result3 !== null) {
			                result4 = parse_line();
			                if (result4 !== null) {
			                  result3 = [result3, result4];
			                } else {
			                  result3 = null;
			                  pos = pos3;
			                }
			              } else {
			                result3 = null;
			                pos = pos3;
			              }
			              if (result3 !== null) {
			                result3 = (function(offset, data) { return data; })(pos2, result3[1]);
			              }
			              if (result3 === null) {
			                pos = pos2;
			              }
			            }
			            if (result2 !== null) {
			              result3 = [];
			              if (/^[\n\r]/.test(input.charAt(pos))) {
			                result4 = input.charAt(pos);
			                pos++;
			              } else {
			                result4 = null;
			                if (reportFailures === 0) {
			                  matchFailed("[\\n\\r]");
			                }
			              }
			              while (result4 !== null) {
			                result3.push(result4);
			                if (/^[\n\r]/.test(input.charAt(pos))) {
			                  result4 = input.charAt(pos);
			                  pos++;
			                } else {
			                  result4 = null;
			                  if (reportFailures === 0) {
			                    matchFailed("[\\n\\r]");
			                  }
			                }
			              }
			              if (result3 !== null) {
			                result0 = [result0, result1, result2, result3];
			              } else {
			                result0 = null;
			                pos = pos1;
			              }
			            } else {
			              result0 = null;
			              pos = pos1;
			            }
			          } else {
			            result0 = null;
			            pos = pos1;
			          }
			        } else {
			          result0 = null;
			          pos = pos1;
			        }
			        if (result0 !== null) {
			          result0 = (function(offset, first, rest) { rest.unshift(first); return rest; })(pos0, result0[1], result0[2]);
			        }
			        if (result0 === null) {
			          pos = pos0;
			        }
			        return result0;
			      }

			      function parse_line() {
			        var result0, result1, result2, result3, result4;
			        var pos0, pos1, pos2, pos3;

			        pos0 = pos;
			        pos1 = pos;
			        result0 = parse_field();
			        if (result0 !== null) {
			          result1 = [];
			          pos2 = pos;
			          pos3 = pos;
			          if (input.length > pos) {
			            result2 = input.charAt(pos);
			            pos++;
			          } else {
			            result2 = null;
			            if (reportFailures === 0) {
			              matchFailed("any character");
			            }
			          }
			          if (result2 !== null) {
			            result3 = (function(offset, char) { return char == separator; })(pos, result2) ? "" : null;
			            if (result3 !== null) {
			              result4 = parse_field();
			              if (result4 !== null) {
			                result2 = [result2, result3, result4];
			              } else {
			                result2 = null;
			                pos = pos3;
			              }
			            } else {
			              result2 = null;
			              pos = pos3;
			            }
			          } else {
			            result2 = null;
			            pos = pos3;
			          }
			          if (result2 !== null) {
			            result2 = (function(offset, char, text) { return text; })(pos2, result2[0], result2[2]);
			          }
			          if (result2 === null) {
			            pos = pos2;
			          }
			          while (result2 !== null) {
			            result1.push(result2);
			            pos2 = pos;
			            pos3 = pos;
			            if (input.length > pos) {
			              result2 = input.charAt(pos);
			              pos++;
			            } else {
			              result2 = null;
			              if (reportFailures === 0) {
			                matchFailed("any character");
			              }
			            }
			            if (result2 !== null) {
			              result3 = (function(offset, char) { return char == separator; })(pos, result2) ? "" : null;
			              if (result3 !== null) {
			                result4 = parse_field();
			                if (result4 !== null) {
			                  result2 = [result2, result3, result4];
			                } else {
			                  result2 = null;
			                  pos = pos3;
			                }
			              } else {
			                result2 = null;
			                pos = pos3;
			              }
			            } else {
			              result2 = null;
			              pos = pos3;
			            }
			            if (result2 !== null) {
			              result2 = (function(offset, char, text) { return text; })(pos2, result2[0], result2[2]);
			            }
			            if (result2 === null) {
			              pos = pos2;
			            }
			          }
			          if (result1 !== null) {
			            result2 = (function(offset, first, rest) { return first !== null || rest.length; })(pos, result0, result1) ? "" : null;
			            if (result2 !== null) {
			              result0 = [result0, result1, result2];
			            } else {
			              result0 = null;
			              pos = pos1;
			            }
			          } else {
			            result0 = null;
			            pos = pos1;
			          }
			        } else {
			          result0 = null;
			          pos = pos1;
			        }
			        if (result0 !== null) {
			          result0 = (function(offset, first, rest) { rest.unshift(first); return rest; })(pos0, result0[0], result0[1]);
			        }
			        if (result0 === null) {
			          pos = pos0;
			        }
			        return result0;
			      }

			      function parse_field() {
			        var result0, result1, result2;
			        var pos0, pos1;

			        pos0 = pos;
			        pos1 = pos;
			        if (input.charCodeAt(pos) === 34) {
			          result0 = "\"";
			          pos++;
			        } else {
			          result0 = null;
			          if (reportFailures === 0) {
			            matchFailed("\"\\\"\"");
			          }
			        }
			        if (result0 !== null) {
			          result1 = [];
			          result2 = parse_char();
			          while (result2 !== null) {
			            result1.push(result2);
			            result2 = parse_char();
			          }
			          if (result1 !== null) {
			            if (input.charCodeAt(pos) === 34) {
			              result2 = "\"";
			              pos++;
			            } else {
			              result2 = null;
			              if (reportFailures === 0) {
			                matchFailed("\"\\\"\"");
			              }
			            }
			            if (result2 !== null) {
			              result0 = [result0, result1, result2];
			            } else {
			              result0 = null;
			              pos = pos1;
			            }
			          } else {
			            result0 = null;
			            pos = pos1;
			          }
			        } else {
			          result0 = null;
			          pos = pos1;
			        }
			        if (result0 !== null) {
			          result0 = (function(offset, text) { return text.join(''); })(pos0, result0[1]);
			        }
			        if (result0 === null) {
			          pos = pos0;
			        }
			        return result0;
			      }

			      function parse_char() {
			        var result0, result1;
			        var pos0, pos1;

			        pos0 = pos;
			        pos1 = pos;
			        if (input.charCodeAt(pos) === 34) {
			          result0 = "\"";
			          pos++;
			        } else {
			          result0 = null;
			          if (reportFailures === 0) {
			            matchFailed("\"\\\"\"");
			          }
			        }
			        if (result0 !== null) {
			          if (input.charCodeAt(pos) === 34) {
			            result1 = "\"";
			            pos++;
			          } else {
			            result1 = null;
			            if (reportFailures === 0) {
			              matchFailed("\"\\\"\"");
			            }
			          }
			          if (result1 !== null) {
			            result0 = [result0, result1];
			          } else {
			            result0 = null;
			            pos = pos1;
			          }
			        } else {
			          result0 = null;
			          pos = pos1;
			        }
			        if (result0 !== null) {
			          result0 = (function(offset) { return '"'; })(pos0);
			        }
			        if (result0 === null) {
			          pos = pos0;
			        }
			        if (result0 === null) {
			          if (/^[^"]/.test(input.charAt(pos))) {
			            result0 = input.charAt(pos);
			            pos++;
			          } else {
			            result0 = null;
			            if (reportFailures === 0) {
			              matchFailed("[^\"]");
			            }
			          }
			        }
			        return result0;
			      }


			      function cleanupExpected(expected) {
			        expected.sort();

			        var lastExpected = null;
			        var cleanExpected = [];
			        for (var i = 0; i < expected.length; i++) {
			          if (expected[i] !== lastExpected) {
			            cleanExpected.push(expected[i]);
			            lastExpected = expected[i];
			          }
			        }
			        return cleanExpected;
			      }

			      function computeErrorPosition() {
			        /*
			         * The first idea was to use |String.split| to break the input up to the
			         * error position along newlines and derive the line and column from
			         * there. However IE's |split| implementation is so broken that it was
			         * enough to prevent it.
			         */

			        var line = 1;
			        var column = 1;
			        var seenCR = false;

			        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
			          var ch = input.charAt(i);
			          if (ch === "\n") {
			            if (!seenCR) { line++; }
			            column = 1;
			            seenCR = false;
			          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
			            line++;
			            column = 1;
			            seenCR = true;
			          } else {
			            column++;
			            seenCR = false;
			          }
			        }

			        return { line: line, column: column };
			      }


			        var separator = ',';


			      var result = parseFunctions[startRule]();

			      /*
			       * The parser is now in one of the following three states:
			       *
			       * 1. The parser successfully parsed the whole input.
			       *
			       *    - |result !== null|
			       *    - |pos === input.length|
			       *    - |rightmostFailuresExpected| may or may not contain something
			       *
			       * 2. The parser successfully parsed only a part of the input.
			       *
			       *    - |result !== null|
			       *    - |pos < input.length|
			       *    - |rightmostFailuresExpected| may or may not contain something
			       *
			       * 3. The parser did not successfully parse any part of the input.
			       *
			       *   - |result === null|
			       *   - |pos === 0|
			       *   - |rightmostFailuresExpected| contains at least one failure
			       *
			       * All code following this comment (including called functions) must
			       * handle these states.
			       */
			      if (result === null || pos !== input.length) {
			        var offset = Math.max(pos, rightmostFailuresPos);
			        var found = offset < input.length ? input.charAt(offset) : null;
			        var errorPosition = computeErrorPosition();

			        throw new this.SyntaxError(
			          cleanupExpected(rightmostFailuresExpected),
			          found,
			          offset,
			          errorPosition.line,
			          errorPosition.column
			        );
			      }

			      return result;
			    },

			    /* Returns the parser source code. */
			    toSource: function() { return this._source; }
			  };

			  /* Thrown when a parser encounters a syntax error. */

			  result.SyntaxError = function(expected, found, offset, line, column) {
			    function buildMessage(expected, found) {
			      var expectedHumanized, foundHumanized;

			      switch (expected.length) {
			        case 0:
			          expectedHumanized = "end of input";
			          break;
			        case 1:
			          expectedHumanized = expected[0];
			          break;
			        default:
			          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
			            + " or "
			            + expected[expected.length - 1];
			      }

			      foundHumanized = found ? quote(found) : "end of input";

			      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
			    }

			    this.name = "SyntaxError";
			    this.expected = expected;
			    this.found = found;
			    this.message = buildMessage(expected, found);
			    this.offset = offset;
			    this.line = line;
			    this.column = column;
			  };

			  result.SyntaxError.prototype = Error.prototype;

			  return result;
		})();
    return {
      'parse': csvParser.parse,
      'create': function(data) {
        var rows;
        rows = [];
        data.forEach(function(row) {
          var columns;
          columns = [];
          row.forEach(function(column) {
            var string;
            string = column === null ? "" : column.toString();
            return columns.push('"' + string.replace(/"/g, '""') + '"');
          });
          return rows.push(columns.join(','));
        });
        return rows.join('\n');
      }
    };
  });

}).call(this);


/*
  Keyboard shortcuts registration service
  Depends: /app/libs/mousetrap
*/


(function() {

  angular.module('kb.utils.keyboardShortcuts', []).factory('kbKeyboardShortcuts', function() {
    var originalStopCallback;
    originalStopCallback = Mousetrap.stopCallback;
    Mousetrap.stopCallback = function(e, element, combo) {
      if (originalStopCallback(e, element, combo)) {
        return true;
      }
      return element.tagName === 'BUTTON';
    };
    return function($scope, shortcuts) {
      return angular.forEach(shortcuts, function(methodName, shortcut) {
        Mousetrap.bind(shortcut, function() {
          $scope.$apply(function() {
            return $scope[methodName]();
          });
          return false;
        });
        return $scope.$on('$destroy', function() {
          return Mousetrap.unbind(shortcut);
        });
      });
    };
  });

}).call(this);


/*
  Multipart upload service
*/


(function() {
  var __hasProp = {}.hasOwnProperty;

  angular.module('kb.utils.multipartUpload', []).factory('kbMultipartUpload', function() {
    return {
      upload: function(url, params, headers) {
        var boundary, content, mimeHeader, name, param;
        boundary = '-----------------------------' + Math.floor(Math.random() * Math.pow(10, 8));
        content = [];
        for (name in params) {
          if (!__hasProp.call(params, name)) continue;
          param = params[name];
          content.push('--' + boundary);
          mimeHeader = 'Content-Disposition: form-data; name="' + name + '"; ';
          if (param.filename) {
            mimeHeader += 'filename="' + param.filename + '";';
          }
          content.push(mimeHeader);
          if (param.type) {
            content.push('Content-Type: ' + param.type);
          }
          content.push('');
          content.push(param.content || param);
        }
        content.push('--' + boundary + '--');
        return $.ajax({
          type: 'POST',
          url: url,
          data: content.join('\r\n'),
          headers: headers,
          contentType: "multipart/form-data; boundary=" + boundary
        });
      }
    };
  });

}).call(this);

angular.module("kb.templates").run(["$templateCache", function($templateCache) {

  $templateCache.put("kb/ui/confirm/templates/confirm.html",
    "<div class=\"modal-header\">\n" +
    "    <h4 class=\"modal-title\">{{ params.header }}</h4>\n" +
    "</div>\n" +
    "<div class=\"modal-body\">\n" +
    "    <p ng-bind-html=\"params.message\"></p>\n" +
    "</div>\n" +
    "<div class=\"modal-footer\">\n" +
    "    <button class=\"btn btn-default\" ng-click=\"close()\">{{ params.cancelButton.label }}</button>\n" +
    "    <button class=\"btn btn-{{ params.confirmButton.type}}\" ng-click=\"confirm()\">{{ params.confirmButton.label }}</button>\n" +
    "</div>"
  );

  $templateCache.put("kb/ui/inline-edit/templates/datetime.html",
    "<span class=\"static\" ng-hide=\"isEditing\" ng-click=\"edit()\" tooltip=\"{{ tooltipTitle }}\">\n" +
    "\t<kb-datetime datetime=\"value\"></kb-datetime>\n" +
    "\t <a class=\"placeholder\" ng-show=\"!value\">\n" +
    "         <i class=\"icon-edit\"></i>\n" +
    "         {{ placeholder }}\n" +
    "     </a>\n" +
    "</span>\n" +
    "<div ng-show=\"isEditing\" class=\"editing\">\n" +
    "    <div class=\"input-group\">\n" +
    "        <input type=\"text\" ng-model=\"editValue\" class=\"form-control\" placeholder=\"{{ placeholder }}\"/>\n" +
    "\n" +
    "        <div class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-success\" ng-click=\"save()\">\n" +
    "                <i class=\"glyphicon glyphicon-ok\" title=\"save\"></i>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"cancel()\">\n" +
    "                <i class=\"glyphicon glyphicon-remove\" title=\"Cancel\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n"
  );

  $templateCache.put("kb/ui/inline-edit/templates/select.html",
    "<span class=\"static\" ng-hide=\"isEditing\" ng-click=\"edit()\" tooltip=\"{{ tooltipTitle }}\">\n" +
    "\t{{ value }}\n" +
    "\t<span class=\"placeholder\" ng-show=\"!value\">{{ placeholder }}</span>\n" +
    "</span>\n" +
    "<div ng-show=\"isEditing\" class=\"editing\">\n" +
    "    <div class=\"input-group\">\n" +
    "        <select ng-options=\"value for value in options\" class=\"form-control\" ng-model=\"editValue\"></select>\n" +
    "\n" +
    "        <span class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-success\" ng-click=\"save()\">\n" +
    "                    <i class=\"glyphicon glyphicon-ok\" title=\"save\"></i>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"cancel()\">\n" +
    "                <i class=\"glyphicon glyphicon-remove\" title=\"Cancel\"></i>\n" +
    "            </button>\n" +
    "        </span>\n" +
    "\n" +
    "    </div>\n" +
    "</div>"
  );

  $templateCache.put("kb/ui/inline-edit/templates/text.html",
    "<span class=\"static\" ng-hide=\"isEditing\" ng-click=\"edit()\" tooltip=\"{{ tooltipTitle }}\">\n" +
    "\t{{ value }}\n" +
    "\t <a class=\"placeholder\" ng-show=\"!value\">\n" +
    "\t\t\t<i class=\"icon-edit\"></i>\n" +
    "\t\t\t{{ placeholder }}\n" +
    "\t\t</a>\n" +
    "</span>\n" +
    "<div ng-show=\"isEditing\" class=\"editing\">\n" +
    "    <div class=\"input-group\">\n" +
    "        <input type=\"text\" ng-model=\"editValue\" class=\"form-control\" placeholder=\"{{ placeholder }}\"/>\n" +
    "\n" +
    "        <div class=\"input-group-btn\">\n" +
    "            <button class=\"btn btn-success\" ng-click=\"save()\">\n" +
    "                <i class=\"glyphicon glyphicon-ok\" title=\"save\"></i>\n" +
    "            </button>\n" +
    "            <button class=\"btn btn-default\" ng-click=\"cancel()\">\n" +
    "                <i class=\"glyphicon glyphicon-remove\" title=\"Cancel\"></i>\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

  $templateCache.put("kb/ui/inline-edit/templates/textarea.html",
    "<span class=\"static\" ng-hide=\"isEditing\" ng-click=\"edit()\" tooltip=\"{{ tooltipTitle }}\">\n" +
    "\t\t<span kb-nl2br=\"value\"></span>\n" +
    "\t\t<a class=\"placeholder\" ng-show=\"!value\">\n" +
    "\t\t\t<i class=\"icon-edit\"></i>\n" +
    "\t\t\t{{ placeholder }}\n" +
    "\t\t</a>\n" +
    "</span>\n" +
    "<div ng-show=\"isEditing\" class=\"editing\">\n" +
    "\t<textarea type=\"text\" ng-model=\"editValue\" placeholder=\"{{ placeholder }}\">\n" +
    "\t</textarea>\n" +
    "\t<div class=\"form-actions\">\n" +
    "\t\t\t\t<button class=\"btn btn-primary\" ng-click=\"save()\">Save</button>\n" +
    "\t\t\t\t<button class=\"btn btn-default\" ng-click=\"cancel()\">Cancel</button>\n" +
    "\t</div>\n" +
    "</div>"
  );

}]);
