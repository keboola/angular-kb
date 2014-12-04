angular
  .module( 'kb.ui.sapiInput', ['ui.bootstrap.typeahead' ,'kb.sapi.sapiService'])
  .directive 'kbSapiInput', ["$compile","kbSapiService", ($compile, sapiService) ->

    prepareSapiTables = (scope, tables) ->
      scope.sapiTables = tables
      if scope.excludeStages
        excludeStage =  (stage) ->
          scope.sapiTables = _.filter tables, (t) ->
            t.bucket.stage != stage

        if _.isArray(scope.excludeStages)
          for s in scope.excludeStages
            excludeStage(s)
        if _.isString(scope.excludeStages)
          excludeStage(scope.excludeStages)

      if scope.bucketId
        scope.sapiTables = _.filter tables, (t) ->
          t.bucket.id == scope.bucketId

      scope.sapiTables =  _.map scope.sapiTables, (t) ->
        t.id




    linker = (scope, element, attrs) ->
      scope.sapiTables = []
      html = """

           <input type="text" ng-model="ngModel" placeholder={{placeholder}} typeahead="id for id in sapiTables| filter:$viewValue|limitTo:15" class="form-control" > </input>

          """
      element.html(html);
      #element.attr("typeahead", "id for id in sapiTables| filter:$viewValue|limitTo:15")
      sapiService.getTables().success (result) ->
        prepareSapiTables(scope,result)

      $compile(element.contents())(scope);


    config =
      restrict: 'E'
      #replace: true
      #transclude:true
      priority: 1000
      scope:
        bucketId: '='
        excludeStages: '='
        ngModel: '='
        placeholder: '@'
      link: linker
#219-12052-0b58d623abefc099378db3907ee9682169cd7429
    return config
]
