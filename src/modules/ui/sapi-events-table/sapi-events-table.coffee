###
  Storage API events table
###
angular
	.module( 'kb.ui.sapiEventsTable', [
		'kb.sapi.eventsService'
		'kb.ui.tree'
	])
	.directive( 'kbSapiEventsTable', ->

		successEvents = [
			'storage.tableImportDone'
		]

		infoEvents = [
			'storage.tableExported'
		]

		templates =
			table: """
						 <div class="kb-sapi-events-table">
						 	<div ng-show="events.events.length && events.loaded && !selectedEvent">
						 		<table class="table table-striped table-events">
						 			<tbody>
						 				<tr ng-repeat="event in events.events | orderBy:'id':true track by event.id" ng-class="eventClass(event)" ng-click="eventDetail(event)" title="Event id: {{ event.id }}">
						 					<td class="created">{{ event.created | date:'fullDate' }}</td>
						 					<td>{{ feedMessage(event) }}</td>
						 				</tr>
						 			</tbody>
						 		</table>
						 		<div class="list-more" ng-show="events.hasOlderEvents">
						 			<button ng-click="events.loadOlderEvents()" class="btn btn-default btn-large" ng-disabled="events.olderEventsLoading">More..</button>
						 		</div>
						 	</div>
						 	<div ng-show="!events.events.length && events.loaded">
						 		<div class="well">
						 			There are no events yet.
						 		</div>
						 	</div>
						 	<div ng-show="!events.loaded">
						 		<div class="well">
						 			<i class="fa fa-refresh fa-spin"></i>
						 			Loading events...
						 		</div>
						 	</div>
							 <div class="event-detail" ng-show="selectedEvent">
										 <a ng-click="leaveEventDetail()">
											<i class="fa fa-chevron-left"></i> Back to events list
										 </a>
							 			<h3>Event detail</h3>
									 <div class="well message" ng-class="eventClass(selectedEvent)">
												{{ selectedEvent.message }}
											</div>

											<p class="well" ng-show="selectedEvent.description">
												{{ selectedEvent.description }}
											</p>
									 
											<div class="tab-pane active" id="tableOverview">
												<table class="table">
													<tbody>
														<tr>
														<td>ID</td>
														<td>{{ selectedEvent.id }}</td>
														</tr>
														<tr>
														<td>Created</td>
														<td><kb-datetime datetime="selectedEvent.created"></kb-datetime></td>
														</tr>
														<tr>
														<td>Component</td>
														<td>{{ selectedEvent.component }}</td>
														</tr>
														<tr>
															<td>Configuration ID</td>
															<td>{{ selectedEvent.configurationId || "N/A" }}</td>
														</tr>
														<tr>
														<td>Run ID</td>
														<td>{{ selectedEvent.runId || "N/A" }}</td>
														</tr>
													</tbody>
												</table>
											</div>

											<div ng-show="selectedEvent.attachments.length">
												<h3>Attachments</h3>
												<ul>
													<li ng-repeat="attachment in selectedEvent.attachments">
														<a href="{{ attachment.url }}">
															{{ attachment.uploadType }} ({{ attachment.sizeBytes | kbfilesize}})
														</a>
													</li>
												</ul>
											</div>
									 
											<div ng-show="selectedEvent.params">
												<h3>Parameters</h3>
												<kb-tree data="selectedEvent.params"></kb-tree>
											</div>
									 
											<div ng-show="selectedEvent.performance">
												<h3>Performance</h3>
												<kb-tree data="selectedEvent.performance"></kb-tree>
											</div>
									 
											<div ng-show="selectedEvent.results">
												<h3>Results</h3>
												<kb-tree data="selectedEvent.results"></kb-tree>
											</div>
									 
											<div ng-show="selectedEvent.context">
												<h3>Context</h3>
												<kb-tree data="selectedEvent.context"></kb-tree>
											</div>

										 <a ng-click="leaveEventDetail()">
										 	<i class="fa fa-chevron-left"></i> Back to events list
										 </a>
							 </div>
						 </div>
			"""



		deprecatedAuthorizationText = """
			Deprecated authorization method used.
		"""

		config =
			restrict: 'E'
			replace: true
			scope:
				events: '=' # StorageEventsServicegrunt
				autoReload: '='
			template: templates.table
			controller: [ "$scope", "$element", "$compile", "$timeout", ($scope, $element, $compile, $timeout) ->

				timeoutId = null

				$scope.selectedEvent = null

				$scope.eventClass = (event) ->
					return '' if !event

					if event.type is 'error'
						return 'error'

					if event.type is 'warn'
						return 'warning'

					if event.type is 'success'
						return 'success'

					# Deprecated - remove after new API release
					if event.event == 'storage.tableImportDone' && event.results.warnings?.length > 0
						return 'warning'

					if _.indexOf( successEvents, event.event ) >= 0
						return 'success'
					else if _.indexOf( infoEvents, event.event ) >= 0
						return 'info'
					else
						return ''


				$scope.eventDetail = (event) ->
					$scope.selectedEvent = event

				$scope.leaveEventDetail = ->
					console.log = 'leave event'
					$scope.selectedEvent = null

				$scope.isEmpty = (attr) ->
					return !_.size(attr || [])

				$scope.eventType = (event) ->
					switch event.event
						when "storage.tableImportError", "storage.tableImportDone"
							icon: "fa fa-arrow-up"
							tooltip: "Import action"
						when "storage.tableExported"
							icon: "fa fa-arrow-down"
							tooltip: "Export action"
						else
							icon: ""
							tooltip: ""

				$scope.eventTypeTooltip = (event) ->
					title: $scope.eventType(event).tooltip

				$scope.feedMessage = (event) ->
					text = if event.configurationId then "#{event.configurationId} - " else ""
					text += event.message
					text

				$scope.deprecatedAuthorizationTooltip = ->
					title:
						deprecatedAuthorizationText

				$scope.isDeprecatedAuthorization = (event) ->
					event.context.authorization == 'deprecated'

				$scope.$on('$destroy', ->
					$timeout.cancel( timeoutId )
				)

				loadNewEvents = ->
					timeoutId = $timeout(( ->

						resolveReload = ->
							if $scope.autoReload
								loadNewEvents()
							else
								timeoutId = null

						$scope.events
							.loadNewEvents()
							.success(resolveReload)
							.error(resolveReload)


					), 1000)

				$scope.$watch('autoReload', (autoReload) ->
					loadNewEvents() if autoReload && !timeoutId
				)
			]
	)