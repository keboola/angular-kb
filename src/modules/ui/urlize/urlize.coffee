angular.module('kb.ui.urlize', [])
.directive('kbUrlize', [
		"$compile"
		($compile) ->
			#pattern = new RegExp("(https?|ftp)://(-\.)?([^\s/?\.#-]+\.?)+(/[^\s]*)?$", "g")
			patternString = #"^" +
			# protocol identifier
				"(?:(?:https?|ftp)://)" +
				# user:pass authentication
				"(?:\\S+(?::\\S*)?@)?" +
				"(?:" +
				# IP address exclusion
				# private & local networks
				"(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
				"(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
				"(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
				# IP address dotted notation octets
				# excludes loopback network 0.0.0.0
				# excludes reserved space >= 224.0.0.0
				# excludes network & broacast addresses
				# (first & last IP address of each class)
				"(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
				"(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
				"(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
				"|" +
				# host name
				"(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
				# domain name
				"(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
				# TLD identifier
				"(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
				")" +
				# port number
				"(?::\\d{2,5})?" +
				# resource path
				"(?:/\\S*)?"
			#"$"

			pushUrl = (element, url) ->
				http = ""
				if not (/^https?\:\/\//).test(url)
					http = "http://"
				a = angular.element('<a target="_blank"></a>')
				a.attr("href", http + url);
				a.text(url)
				element.append(a)
			#element.append(angular.element('<a href="' + http + url + '" target="_blank">' + url + '</a>'))

			pushText = (element, text) ->
				e = angular.element("<span></span>")
				e.text(text)
				element.append(e)

			pattern = new RegExp(patternString, "g")
			parseUrlsToElement = (element, content) ->
				element.empty()
				return if !content
				content = String(content)
				urls = content.match pattern
				rest = content
				if urls
					for url in urls
						split = rest.split url
						text = split[0]
						if text != ""
							pushText(element, text)
						pushUrl(element, url)
						rest = split[1]
				if rest
					pushText(element, rest)

			config =
				restrict: 'E'
				scope:
					content: "="
				link: (scope, element, attrs) ->
					parseUrlsToElement(element, scope.content)

				controller: ["$scope", "$element", ($scope, $element) ->
					$scope.$watch("content", ->
						parseUrlsToElement($element, $scope.content)
					)
				]
			config

	])
