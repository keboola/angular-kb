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