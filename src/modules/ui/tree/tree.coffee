

angular.module('kb.ui.tree', [])
	.directive( 'kbTreeNode', [ "$compile", ($compile) ->

			nodeTemplate = """
					<div class="kb-tree-node">
						<div ng-repeat="(key, value) in data">
							<span class="key">{{ key }}:</span>
							<kb-tree-node data="value"></kb-tree-node">
						</div>
					</div>
				"""

			leafTemplate = """
					<span class="value">
						{{ data }}
					</span>
			"""

			directive =
				restrict: 'E'
				replace: true
				scope:
					data: '='
				link: (scope, element, attrs) ->

					scope.isNode = ->
						angular.isObject(scope.data) || angular.isArray(scope.data)

					templateDomElement = angular.element(if scope.isNode() then nodeTemplate else leafTemplate)
					linkFunction = $compile(templateDomElement)
					linkFunction(scope)

					element
						.empty()
						.replaceWith(templateDomElement)


			return directive

		])

		.directive( 'kbTree', [ "$compile", ($compile) ->

			template =
				 """
					<div class="kb-tree">
						<kb-tree-node data="data"></kb-tree-node>
					</div>
				"""

			directive =
				restrict: 'E',
				scope:
					data: '='
				link: (scope, element) ->

					scope.$watch('data', ->
							domElement = angular.element(template)
							link = $compile(domElement)
							link(scope)
							element
								.html(null)
								.append( domElement );
					)

		])