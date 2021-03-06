# 0.15.10 (2015-05-18)
 * [Feat] `kb.ui.sapiEventsTable` Creator in event detail

# 0.15.9 (2015-05-10)
 * [Feat] `kb.ui.sapiComponentIcon` Default icon for Recipes

# 0.15.8 (2015-02-18)
 * [Feat] `kb.syrup.asyncRunner` Job Uri template can be set by `kb.config.syrup.jobUriTemplate`

# 0.15.7 (2014-01-20)
 * [Fix] `kb.sapi.sapiService` table update

## 0.15.6 (2014-01-20)
 * [Feat] `kb.sapi.sapiService` update table method added

## 0.15.5 (2014-01-08)
 * [Fix] `kb.syrup.asyncRunner` fix promise resolve with correct data

## 0.15.4 (2015-01-03)
 * [Fix] `kb.syrup.asyncRunner` fix rejected promises

## 0.15.3 (2014-12-20)
 * [Fix] fix CHANGELOG.md

## 0.15.2 (2014-12-20)
 * [Fix] Fix sapi-events-table detail color

## 0.14.12 (2014-12-14)
 * [Fix] fix CHANGELOG.md

## 0.14.11 (2014-12-14)
 * [Fix] `kb.ui.sapiConsoleHref` use kbConfig.projectBaseUrl property and a basic href

## 0.14.10 (2014-12-02)
 * [Fix] `kb.ui.protected` protected parameter not an expression

## 0.14.9 (2014-12-01)
 * [Fix] `kb.ui.searchFilter` remove right padding

## 0.14.8 (2014-11-25)
 * [Fix] `kb.ui.notifications` show notifications in reverse order

## 0.14.7 (2014-11-20)
 * [Feat] `kb.ui.extractorInfo` directive

## 0.14.6 (2014-11-19)
 * [Fix] `kb.ui.protected` protected parameter as expression

## 0.14.5 (2014-11-19)
 * [Feat] `kb.ui.protected` directive

## 0.14.4 (2014-11-19)
 * [Fix] `kb.ui.configurationDescription` remove `console.log`

## 0.14.3 (2014-11-14)
 * [Feat] `kb.ui.runIcon` directive
 * [Feat] `kb.ui.configurationDescription` directive

## 0.14.2 (2014-11-14)
 * [Fix] `kb.sapiEventsTable` error event has red color

## 0.14.0 (2014-11-12)
 * [Feat] `kb.ui.notifications` directive added
 * [Feat] `kb.utils.notifications` service added
 * [Feat] `kb.utils.events` service added
 * [Feat] `kb.syrup.asyncRunner` service added

## 0.13.16 (2014-10-30)
 * [Fix] - `kb.filters.webalize` - filter was broken after tabs to spaces replace

## 0.13.15 (2014-10-29)
 * [Fix] - `kb.sapi.sapiService`

## 0.13.14 (2014-10-29)
 * [Feat] - `kb.sapi.sapiService` - bucket credentials resource supported

## 0.13.12 (2014-10-20)
 * [Feat] - `kb.ui.sapiEventsTable` - configurable header attribute
 * [Feat] - `kb.ui.sapiEventsTable` - break long overflowing words

## 0.13.11 (2014-10-15)
 * [Fix] - Urlize directive - empty values

## 0.13.10 (2014-10-15)
 * [Fix] - Urlize directive - empty values

## 0.13.9 (2014-10-15)
 * [Feat] - Urlize directive

## 0.13.7 (2014-09-26)
 * [Fix] `kb.ui.searchFilter` - fixed query detection

## 0.13.6 (2014-09-23)
 * [Feat] `kb.ui.sapiComponentIcon` - directive added
 * [Feat] `kb.ui.focus` - focus can be applied to parent elements, first input is then focused.

## 0.13.5 (2014-09-17)
 * [Feat] `kb.sapi.sapiService` - component configuration update method

## 0.13.4 (2014-09-17)
 * [Feat] `kb.sapi.sapiService` - component configurations methods added

## 0.13.3 (2014-09-04)
 * [Feat] `kb.ui.searchFilter` directive added

## 0.13.2 (2014-09-04)
 * [Feat] `kb.ui.check` directive added

## 0.13.1 (2014-09-03)
 * [Refactor] Bootstrap update to 3.2.0

## 0.13.0 (2014-09-03)
 * [Refactor] Use all icons from font awesome

## 0.12.2 (2014-09-02)
 * [Feat] `kb.confirm` - focus cancel button


## 0.11.3 (2014-08-08)
 * [Feat] Option to disable kb-run-button.

## 0.11.2 (2014-07-17)
 * [Feat] SAPI service - delete file

## 0.10.0 (2014-06-24)
 * [BC Break] Major dependencies upgrade

## 0.9.8 (2014-06-13)
 * [Bugfix] Sapi events table - date format

## 0.9.7 (2014-06-11)
 * [Feature] kb.ui.focus - can be triggered by expression

## 0.9.6 (2014-05-21)
 * [Feature] SAPI service factory added. Multiple instances of Storage API client can be created

## 0.9.5
 * [Feature] kb.ui.sapiConsoleHref - different token than registered in SAPI service can be set

## 0.9.4
 * [Bugfix] SAPI events table - unique events

## 0.9.3
 * [Bugfix] SAPI events table - events auto reload fix

## 0.9.2
 * [Bugfix] SAPI service - don't throw request cancelled errors

## 0.9.1
 * [Bugfix] Inline edit - select and datetime

## 0.9.0
 * [BC Break] SAPI service, list files params hashmap added

## 0.8.2
 * [Bugfix] kbCsv.create drops "null" values from arrays

## 0.8.1
 * [Performance] SAPI events table optimization

## 0.8.0
 * [BC Break] angular-ui-bootstrap-bower upgraded to 0.10.0

## 0.7.0
 * [BC Break] kb.toggable removed, use [https://github.com/keboola/angular-kb-accordion] instead

## 0.6.5
 * [Bugfix] Inline edit buttons styling
 * [Bugfix] Sapi events table - removed $bsModal dependency

## 0.6.4
 * [Bugfix] SAPI error modal - exception id

## 0.6.3
 * [Feature] SAPI error modal - show exception ID

## 0.6.2
 * [Bugfix] Focus inside modal

## 0.6.1
 * [Bugfix] Confirm dialog cancel button styling

## 0.6.0
 * [BC Break] Migrated to Bootstrap 3

## 0.5.6
 * [Bugfix] Angular 1.2.3 compatibility ($sce)

## 0.5.5
 * [Feature] kbConfirm - basic whitelisted HTML elements allowed in message

## 0.5.4
 * [Feature] Exception handler - log complete href of current page

## 0.5.3
 * [Bugfix] sapi events published attribute deprecated, migrated to created

## 0.5.2
 * [Bugfix] [:isecdom] Referencing DOM nodes in Angular expressions is disallowed
 * [Feature] Confirm dialog directive added

## 0.5.1
 * [Bugfix] SCE wildcard fix

## 0.5.0
 * [Refactoring] Angular-ui-bootstrap upgraded to 0.6

## 0.4.4
 * [Bugfix] Copy button - trusted domains

## 0.4.3
 * [Bugfix] SCE whitelist

## 0.4.2
 * [Bugfix] SCE - allow loading templates from basePath. (Handled in app-version)

## 0.4.1
 * [Bugfix] Bower resolutions removed

## 0.4.0
 * [BC Break] Upgrade to Angular 1.2

## 0.3.17
 * [Bugfix] Exception handler

## 0.3.16
 * [Bugfix] Exception handler

## 0.3.15
 * [Bugfix] Exception handler

## 0.3.14
 * [Bugfix] Angular-ui-bootstrap dependency added

## 0.3.13
 * [Feature] Exception handler, SAPI error handler, i18n added

## 0.3.12
 * [Feature] SAPI Client - getBucketsWithTables params added

## 0.3.11
 * [Feature] SAPI Client - getBuckets, getTables params added

## 0.3.10
 * [Feature] SAPI client - index action added

## 0.3.9
 * [Feature] SAPI client - delete table rows

## 0.3.8
 * [Feature] SAPI Client - table rollback from snapshot

## 0.3.7
 * [Bugfix] SAPI Client - snapshots

## 0.3.6
 * [Feature] SAPI Client - table snapshots support added

## 0.3.5
 * [Bugfix] SAPI Client - `resolveAsyncRequest` exponential backoff intervals adjustment

## 0.3.4
 * [Bugfix] SAPI Client - `resolveAsyncRequest` exponential backoff

## 0.3.3
 * [Feature] SAPI Client - `resolveAsyncRequest` exponential backoff, maxAttemptsCount parameter

## 0.3.2
 * [Feature] SAPI Client - create table async method added

## 0.3.1
 * [Feature] SAPI Client - params hashmap added to getJobs method

## 0.3.0
 * [BC Break] SAPI Client - method signature typos fixed

## 0.2.8
 * [Feature] SAPI Client - `resolveAsyncRequest` method added

## 0.2.7
 * [Feature] SAPI Client - `pollJobUntilDone` method added - wait for async job execution

## 0.2.6
 * [Bugfix] SAPI Client - share token params

## 0.2.5
 * [Feature] SAPI Client - share token by email method added

## 0.2.4
 * [Bugfix] SAPI Console href directive css

## 0.2.3
 * [Feature] SAPI Console href directive added

## 0.2.2
 * [Bugfix] Inline edit - removed forgotten quote from template

## 0.2.1
 * [Bugfix] SAPI Client - error handling

## 0.2.0
 * [BC Break] SAPI Client saveTableDataAsync method signature changed

## 0.1.17
 * [Bugfix] SAPI Client - file upload prepare
 * [Bugfix] SAPI Client - job detail

## 0.1.15
 * [Bugfix] SAPI Client - file upload prepare, async import

## 0.1.14
 * [Bugfix] SAPI Client - file upload prepare

## 0.1.13
 * [Feature] SAPI Client - file upload prepare, jobs resource, table async import

## 0.1.12
 * [Refactoring] Inline edit, inline template

## 0.1.11
 * [Feature] Filesize filter - empty value parameter added

## 0.1.10
 * [Build] Release scripting

## 0.1.9
 * [Bugfix] Inline edit key board events unbind

## 0.1.8
 * [Bugfix] Table export empty options allowed

## 0.1.7
 * [Feature] Table import options
 * [Feature] Table export options

## 0.1.6
 * [Bugfix] Filesize filter - wrong conversion to MB
 * [Docs] Filesize filter demo added
