

angular.module('kb.config', [])
	.value('kb.config', {})

angular.module('kb.templates', [])

angular.module('kb', [
	'kb.config'

	'kb.ui.inlineEdit'
	'kb.ui.clickToggle'
	'kb.ui.copyButton'
	'kb.ui.nl2br'
	'kb.ui.sapiEventsTable'
	'kb.ui.loader'
	'kb.ui.autoComplete'
	'kb.ui.focus'
	'kb.ui.tree'
	'kb.ui.runButton'
	'kb.ui.codemirror'
	'kb.ui.datetime'
	'kb.ui.duration'
	'kb.ui.sapiConsoleHref'
	'kb.ui.sapiComponentIcon'
	'kb.ui.confirm'
	'kb.ui.check'
	'kb.ui.searchFilter'

	'kb.utils.multipartUpload'
	'kb.utils.csv'
	'kb.utils.keyboardShortcuts'
	'kb.utils.appVersion'

	'kb.filters.date'
	'kb.filters.filesize'
	'kb.filters.webalize'
	'kb.filters.duration'

	'kb.sapi.sapiService'
	'kb.sapi.eventsService'
	'kb.sapi.errorHandler'

	'kb.templates'
])
