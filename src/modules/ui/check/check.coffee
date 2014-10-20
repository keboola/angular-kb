

angular
.module( 'kb.ui.check', [])
.directive('kbCheck', ->
    restrict: 'E'
    require: 'ngModel'
    template: """
      <i class="fa" "></i>
    """
    link: (scope, element, attrs, ngModel) ->
      ngModel.$render =  ->
        i = element.find('i')
        i.removeClass('fa-check')
        i.removeClass('fa-times')
        i.addClass(if ngModel.$viewValue then 'fa-check' else 'fa-times')
  )