
###
  Multipart upload service
###

angular.module('kb.utils.multipartUpload', [])
	.factory('kbMultipartUpload', ->
		upload:
			(url, params, headers) ->
				boundary = '-----------------------------' +
					Math.floor(Math.random() * Math.pow(10, 8))

				content = []
				for own name, param of params
					content.push('--' + boundary)

					mimeHeader = 'Content-Disposition: form-data; name="'+name+'"; '
					if(param.filename)
						mimeHeader += 'filename="'+ (param.filename) + '";'
					content.push(mimeHeader);

					if(param.type)
						content.push('Content-Type: ' + param.type)

					content.push('');
					content.push(param.content || param)


				content.push('--' + boundary + '--');

				$.ajax(
					type: 'POST'
					url: url
					data: content.join('\r\n')
					headers: headers
					contentType: "multipart/form-data; boundary=" + boundary
				)
	)