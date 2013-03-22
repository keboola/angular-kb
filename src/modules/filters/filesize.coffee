
angular.module( 'kb.filters.filesize', [])
	.filter( 'kbfilesize', ->
		(fileSize) ->
			return 'N/A' if not angular.isNumber( fileSize )
			filesize(fileSize)
	)