angular.module( 'modal', [] )

.factory( '$bsModal', function ( $http, $rootScope, $compile, $templateCache )
{
	var svc = {}

	//
	// Gets or creates the Modal element (Only one may exist)
	//
	svc.GetModal = function( bCreate )
	{
		if ( !svc.element && bCreate )
		{
			svc.element = $( '<div></div>' );
			svc.element.appendTo( 'BODY' );
		}
		svc.element.removeClass();
		svc.element.addClass('modal hide');

		return svc.element;
	}

	//
	// Creates a modal dialog from strings
	//
	svc.Set = function( strHead, strBody, strFooter, options )
	{
		var mdl = svc.GetModal( true )

		mdl.html( '<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3></h3></div><div class="modal-body"></div><div class="modal-footer"></div></div>' )

		// Add these in this way so that they can also be passed as $(elements)
		mdl.find( 'H3' ).append( strHead );
		mdl.find( '.modal-footer' ).append( strFooter );
		mdl.find( '.modal-body' ).append( strBody );

		var scope = $rootScope.$new();
		$compile( mdl )( scope );

		options = angular.extend({'backdrop': true}, options);
		mdl.modal( options );

		return mdl;
	}

	//
	// An 'Alert' box
	//
	svc.Alert = function( strHead, strBody, strButton )
	{
		var button = $("<button>"+strButton+"</button>");
		button.click( function(){ svc.Close(); } )

		svc.Set( strHead, strBody, button, {} );
	}

	//
	// ThisOrThat
	//
	svc.ThisOrThat = function( strHead, strBody, strAccept, strCancel, fnOK, fnCancel, btnType )
	{
		var buttons = $("<span><button class='btn btn-cancel'>"+strCancel+"</button><button class='btn btn-primary'>"+strAccept+"</button> </span>");
		buttons.find( '.btn-primary' )
				.click( function(){ if ( fnOK ) fnOK(); svc.Close(); } );

		if (btnType) {
			buttons.find('.btn-primary').addClass('btn-' + btnType);
		}

		if (!strCancel) {
			buttons.find('.btn-cancel').remove();
		}
		buttons.find( '.btn-cancel' ).click( function(){ if ( fnCancel ) fnCancel(); svc.Close(); } )

		return svc.Set( strHead, strBody, buttons, {} );
	}

	//
	// Load the contents from strURL
	//
	svc.Get = function( strURL, options, scope )
	{
		$http.get( strURL/*, {cache: $templateCache}*/ ).
			success( function ( data, status, headers, config )
			{
				var mdl = svc.GetModal( true )
				var child_scope = scope ? scope.$new() : $rootScope.$new();

				angular.extend(child_scope, {
					closeModal: svc.Close
				});

				mdl.html( data );
				$compile( mdl )( child_scope );

				Mousetrap.bind( 'esc', function () {
					child_scope.$apply(function() {
						svc.Close()
					});
					return false;
				})
				child_scope.$on('$destroy', function() {
					Mousetrap.unbind( 'esc' );
				});
			
				mdl.modal( angular.extend({'backdrop': true}, options))
					.on('hidden.modal', function(e) {
						mdl.empty();
						child_scope.$destroy();
						mdl.off('hidden.modal');
					})
			})
	}

	svc.Close = function()
	{
		var mdl = svc.GetModal()
		if ( !mdl ) return;

		if (mdl.data('modal'))
			mdl.modal('hide');
	}

	return svc;

})

.directive( 'ngModalUrl', function( $bsModal )
{
	return function(scope, element, attrs)
	{
		var strURL;
		var options = {};

		scope.$watch( attrs.ngModalUrl, function(value)
		{
			strURL = value;
		});

		element.bind( "click", function()
		{
			$bsModal.Get( strURL, options, scope );
		});

	}
})

.directive( 'ngConfirm', ['$bsModal', '$parse', function( $bsModal, $parse )
{
	return function(scope, element, attrs)
	{
		var strTitle = "";
		var strText = "Are you sure?";
		var strYes = "Ok";
		var strNo = "Cancel";
		var btnType = "";


		attrs.$observe( 'ngConfirm', function(value) { if ( !value ) return; strText = value; } );
		attrs.$observe( 'ngTitle', function(value) { if ( !value ) return; strTitle = value; } );
		attrs.$observe('ngTextConfirm', function(value) { if ( !value ) return; strYes = value; } );
		attrs.$observe( 'ngTextCancel', function(value) { if ( !value ) return; strNo = value; } );
		attrs.$observe( 'ngType', function(value) { if (!value) return; btnType =  value; });

		// Function called on `confirm` <... ng-on-confirm="DoSomething()"  ...>
		var fnAction = function()
		{
			if ( !attrs.ngOnConfirm ) return;

			// parse the function..
			var fn = $parse( attrs.ngOnConfirm )
			if ( !fn ) return;

			// Apply it to the scope.
			scope.$apply( function () { fn( scope ); } );
		}

		element.bind( "click", function()
		{
			$bsModal.ThisOrThat( strTitle, strText, strYes, strNo, fnAction, null, btnType );
		});

	}
}]);