# Change Log

## [1.0.3](https://github.com/marklogic/slush-marklogic-node/tree/1.0.3) (2016-03-10)
[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/1.0.2...1.0.3)

**Implemented enhancements:**

- Drop cookieParser [\#295](https://github.com/marklogic/slush-marklogic-node/issues/295)
- minified build needs sourcemaps [\#268](https://github.com/marklogic/slush-marklogic-node/issues/268)
- Upgrade npm dependencies to latest [\#200](https://github.com/marklogic/slush-marklogic-node/issues/200)
- Fixes \#319 - Angular bootstrap directive changes [\#321](https://github.com/marklogic/slush-marklogic-node/pull/321) ([Audarth](https://github.com/Audarth))

**Fixed bugs:**

- variable @link-color is undefined [\#323](https://github.com/marklogic/slush-marklogic-node/issues/323)
- Angular bootstrap directive changes [\#319](https://github.com/marklogic/slush-marklogic-node/issues/319)
- Gulp serve-dev gives 404 in browser [\#312](https://github.com/marklogic/slush-marklogic-node/issues/312)
- `gulp build` breaks `gulp serve-dev` [\#272](https://github.com/marklogic/slush-marklogic-node/issues/272)
- REST API proxy doesn't support multipart requests [\#270](https://github.com/marklogic/slush-marklogic-node/issues/270)
- Issue with proxying data to ML [\#31](https://github.com/marklogic/slush-marklogic-node/issues/31)

**Merged pull requests:**

- Hunterwilliams npm updates [\#305](https://github.com/marklogic/slush-marklogic-node/pull/305) ([grtjn](https://github.com/grtjn))
- Fixed \#295: removed cookie-parser in favor of newer express-session [\#300](https://github.com/marklogic/slush-marklogic-node/pull/300) ([grtjn](https://github.com/grtjn))
- Fixed \#31: moved bodyparsing to allow upload of non-json [\#189](https://github.com/marklogic/slush-marklogic-node/pull/189) ([grtjn](https://github.com/grtjn))

## [1.0.2](https://github.com/marklogic/slush-marklogic-node/tree/1.0.2) (2016-02-29)
[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/1.0.1...1.0.2)

**Implemented enhancements:**

- gulpfile should be made more explicit [\#271](https://github.com/marklogic/slush-marklogic-node/issues/271)
- lint/test errors shouldn't always abort the build [\#267](https://github.com/marklogic/slush-marklogic-node/issues/267)
- Dynamic copyright year [\#296](https://github.com/marklogic/slush-marklogic-node/issues/296)
- List slush version somewhere [\#257](https://github.com/marklogic/slush-marklogic-node/issues/257)
- Add geospatial component [\#9](https://github.com/marklogic/slush-marklogic-node/issues/9)
- Css update [\#282](https://github.com/marklogic/slush-marklogic-node/pull/282) ([jenbreese](https://github.com/jenbreese))

**Fixed bugs:**

- app-port empty by default in local.properties [\#275](https://github.com/marklogic/slush-marklogic-node/issues/275)
- JSHint fails: 'deregisterLoginSuccess' was used before it was defined [\#307](https://github.com/marklogic/slush-marklogic-node/issues/307)
- detail router stripping '/' from uri on page refresh [\#303](https://github.com/marklogic/slush-marklogic-node/issues/303)
- 'marklogic-node' not found! [\#290](https://github.com/marklogic/slush-marklogic-node/issues/290)
- Search page error: $q.resolve is not a function   [\#286](https://github.com/marklogic/slush-marklogic-node/issues/286)
- Need to run gulp build twice [\#283](https://github.com/marklogic/slush-marklogic-node/issues/283)
- Windows - slush marklogic-node \<app-name\> "generator issue" [\#274](https://github.com/marklogic/slush-marklogic-node/issues/274)
- included init scripts and forever.js not working [\#269](https://github.com/marklogic/slush-marklogic-node/issues/269)
- Less compile error should not break gulp [\#264](https://github.com/marklogic/slush-marklogic-node/issues/264)
- Error when running gulp watch: EMFILE, readdir [\#263](https://github.com/marklogic/slush-marklogic-node/issues/263)
- Running slush from within an existing Roxy project 'hangs' [\#262](https://github.com/marklogic/slush-marklogic-node/issues/262)
- creating Admin user account breaks login [\#258](https://github.com/marklogic/slush-marklogic-node/issues/258)
- Remove static links to arcgis in index.html [\#254](https://github.com/marklogic/slush-marklogic-node/issues/254)
- Unsuitable resolution declared for angular: 1.4.6 [\#251](https://github.com/marklogic/slush-marklogic-node/issues/251)
- Unable To Build Out of Box/Detail Controller Test Fails [\#248](https://github.com/marklogic/slush-marklogic-node/issues/248)
- Bump Task Broken [\#247](https://github.com/marklogic/slush-marklogic-node/issues/247)
- Npm install of browser-sync seems to break on Windows \(7\) [\#206](https://github.com/marklogic/slush-marklogic-node/issues/206)

**Closed issues:**

- esri JS and CSS hardcoded in index.html [\#279](https://github.com/marklogic/slush-marklogic-node/issues/279)
- Npm install failes with nosup message [\#277](https://github.com/marklogic/slush-marklogic-node/issues/277)

**Merged pull requests:**

- Removed ESRI imports [\#281](https://github.com/marklogic/slush-marklogic-node/pull/281) ([daveegrant](https://github.com/daveegrant))
- changing the icon to a minus per \#255. Also made added a link cursor … [\#256](https://github.com/marklogic/slush-marklogic-node/pull/256) ([jenbreese](https://github.com/jenbreese))
- Version 1.0.2 [\#322](https://github.com/marklogic/slush-marklogic-node/pull/322) ([grtjn](https://github.com/grtjn))
- Issue \#274 - added additional documentation to allow Microsoft Windows… [\#317](https://github.com/marklogic/slush-marklogic-node/pull/317) ([bluetorch](https://github.com/bluetorch))
- Fixed \#264: added error handler to less [\#315](https://github.com/marklogic/slush-marklogic-node/pull/315) ([grtjn](https://github.com/grtjn))
- Fixed \#307: moved var up to prevent JSHint complaint [\#314](https://github.com/marklogic/slush-marklogic-node/pull/314) ([grtjn](https://github.com/grtjn))
- Fixed \#262: making sure stdin reaches Roxy to overcome queries from Roxy [\#313](https://github.com/marklogic/slush-marklogic-node/pull/313) ([grtjn](https://github.com/grtjn))
- Fixed \#206: add ms visual studio flag for compiling [\#306](https://github.com/marklogic/slush-marklogic-node/pull/306) ([grtjn](https://github.com/grtjn))
- Fix uri resolution on the detail page [\#304](https://github.com/marklogic/slush-marklogic-node/pull/304) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Fixed \#296: copyright year based on Date. getUTCFullYear [\#299](https://github.com/marklogic/slush-marklogic-node/pull/299) ([grtjn](https://github.com/grtjn))
- Fixed \#257: addes slush-version.txt with placeholder replacement [\#297](https://github.com/marklogic/slush-marklogic-node/pull/297) ([grtjn](https://github.com/grtjn))
- Fixed \#269: fixed init script, and added docs/scripts for server deployment [\#294](https://github.com/marklogic/slush-marklogic-node/pull/294) ([grtjn](https://github.com/grtjn))
- Fixed \#286: more flexible angular resolution [\#293](https://github.com/marklogic/slush-marklogic-node/pull/293) ([grtjn](https://github.com/grtjn))
- Added missing bump dependency [\#250](https://github.com/marklogic/slush-marklogic-node/pull/250) ([hunterwilliams](https://github.com/hunterwilliams))
- Fixes \#248 detail controller test breaking build [\#249](https://github.com/marklogic/slush-marklogic-node/pull/249) ([hunterwilliams](https://github.com/hunterwilliams))

## [1.0.1](https://github.com/marklogic/slush-marklogic-node/tree/1.0.1) (2015-10-13)
[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/1.0.0...1.0.1)

**Fixed bugs:**

- Spacing on highlights  [\#252](https://github.com/marklogic/slush-marklogic-node/issues/252)

**Merged pull requests:**

- Fixing the spacing as described in \#252 [\#253](https://github.com/marklogic/slush-marklogic-node/pull/253) ([jenbreese](https://github.com/jenbreese))

## [1.0.0](https://github.com/marklogic/slush-marklogic-node/tree/1.0.0) (2015-09-25)
[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/v0.1.2...1.0.0)

**Implemented enhancements:**

- Create new release [\#68](https://github.com/marklogic/slush-marklogic-node/issues/68)
- Add coverage/ to .gitignore [\#242](https://github.com/marklogic/slush-marklogic-node/issues/242)
- Disable ESRI option? [\#216](https://github.com/marklogic/slush-marklogic-node/issues/216)
- Show label instead of uri for results [\#193](https://github.com/marklogic/slush-marklogic-node/issues/193)
- Proxy doesn't support DELETE requests [\#176](https://github.com/marklogic/slush-marklogic-node/issues/176)
- More diversity in sample-data.. [\#169](https://github.com/marklogic/slush-marklogic-node/issues/169)
- Make Similar Docs Respect Search Options [\#161](https://github.com/marklogic/slush-marklogic-node/issues/161)
- Add a collection facet \(with prefix?\) [\#160](https://github.com/marklogic/slush-marklogic-node/issues/160)
- Larger sample-data set [\#159](https://github.com/marklogic/slush-marklogic-node/issues/159)
- Single config for ml-host/ml-port [\#151](https://github.com/marklogic/slush-marklogic-node/issues/151)
- Provide a bare mlpm.json to make mlpm install for deps easier [\#148](https://github.com/marklogic/slush-marklogic-node/issues/148)
- Similar items only shown in no-esri details [\#147](https://github.com/marklogic/slush-marklogic-node/issues/147)
- Logic of adding email\(s\) on account page not intuitive [\#145](https://github.com/marklogic/slush-marklogic-node/issues/145)
- Add toggle for snippet types [\#132](https://github.com/marklogic/slush-marklogic-node/issues/132)
- Improving display of content in details page [\#131](https://github.com/marklogic/slush-marklogic-node/issues/131)
- Add Negation Support [\#124](https://github.com/marklogic/slush-marklogic-node/issues/124)
- Separate User Service? [\#119](https://github.com/marklogic/slush-marklogic-node/issues/119)
- Split Login From Project [\#118](https://github.com/marklogic/slush-marklogic-node/issues/118)
- Landing Page [\#105](https://github.com/marklogic/slush-marklogic-node/issues/105)
- Ports Specified Via Prompts [\#103](https://github.com/marklogic/slush-marklogic-node/issues/103)
- rename sample to app [\#102](https://github.com/marklogic/slush-marklogic-node/issues/102)
- add show more to facets [\#99](https://github.com/marklogic/slush-marklogic-node/issues/99)
- move search box to the body [\#98](https://github.com/marklogic/slush-marklogic-node/issues/98)
- check for updates when generator is run [\#97](https://github.com/marklogic/slush-marklogic-node/issues/97)
- Add default robots.txt's [\#85](https://github.com/marklogic/slush-marklogic-node/issues/85)
- Fix analyze-data to work with JSON [\#84](https://github.com/marklogic/slush-marklogic-node/issues/84)
- Upgrade bower dependencies to latest [\#77](https://github.com/marklogic/slush-marklogic-node/issues/77)
- Switch to ui-router [\#62](https://github.com/marklogic/slush-marklogic-node/issues/62)
- Eliminate common/ [\#57](https://github.com/marklogic/slush-marklogic-node/issues/57)
- Add default favicon [\#56](https://github.com/marklogic/slush-marklogic-node/issues/56)
- Add template code for running as service with forever [\#44](https://github.com/marklogic/slush-marklogic-node/issues/44)

**Fixed bugs:**

- default app user cannot use the app [\#95](https://github.com/marklogic/slush-marklogic-node/issues/95)
- npm issues with setting up a new slush site. [\#236](https://github.com/marklogic/slush-marklogic-node/issues/236)
- Clear search invisible with Blue design [\#235](https://github.com/marklogic/slush-marklogic-node/issues/235)
- Npm install should run before bower install [\#232](https://github.com/marklogic/slush-marklogic-node/issues/232)
- Account Edits Not Properly Saved [\#229](https://github.com/marklogic/slush-marklogic-node/issues/229)
- Run gulp wiredep after bower install [\#226](https://github.com/marklogic/slush-marklogic-node/issues/226)
- Typo in node-express-service [\#223](https://github.com/marklogic/slush-marklogic-node/issues/223)
- Typo in node-app.js [\#222](https://github.com/marklogic/slush-marklogic-node/issues/222)
- Enabling blue design breaks gulp serve-prod [\#221](https://github.com/marklogic/slush-marklogic-node/issues/221)
- Add local.json and mlpm\_modules to gitignore [\#214](https://github.com/marklogic/slush-marklogic-node/issues/214)
- Clashes when running two instances of slush generated sites [\#211](https://github.com/marklogic/slush-marklogic-node/issues/211)
- Unable to display xml data when using hljs in detail.html [\#210](https://github.com/marklogic/slush-marklogic-node/issues/210)
- Get rid of $app-role in mlcp options file [\#208](https://github.com/marklogic/slush-marklogic-node/issues/208)
- Fix express deprecated warnings [\#201](https://github.com/marklogic/slush-marklogic-node/issues/201)
- README gets replaced by Roxy one.. [\#197](https://github.com/marklogic/slush-marklogic-node/issues/197)
- Loading Sample Data : import-sample-data.options not found [\#195](https://github.com/marklogic/slush-marklogic-node/issues/195)
- Binary Corruption [\#194](https://github.com/marklogic/slush-marklogic-node/issues/194)
- Overriding users in local.json disregarded  [\#191](https://github.com/marklogic/slush-marklogic-node/issues/191)
- Error trying to run new application [\#178](https://github.com/marklogic/slush-marklogic-node/issues/178)
- Login page button space [\#149](https://github.com/marklogic/slush-marklogic-node/issues/149)
- Clicking search before login throws TypeError [\#143](https://github.com/marklogic/slush-marklogic-node/issues/143)
- Clicking create requires \(second\) login [\#141](https://github.com/marklogic/slush-marklogic-node/issues/141)
- Cannot click x to clear search results [\#139](https://github.com/marklogic/slush-marklogic-node/issues/139)
- Search data only [\#136](https://github.com/marklogic/slush-marklogic-node/issues/136)
- gulp serve-dev ignores app-port [\#135](https://github.com/marklogic/slush-marklogic-node/issues/135)
- Don't ask for required input [\#133](https://github.com/marklogic/slush-marklogic-node/issues/133)
- CSS @import no longer working [\#120](https://github.com/marklogic/slush-marklogic-node/issues/120)
- .gitignore dist folder [\#114](https://github.com/marklogic/slush-marklogic-node/issues/114)
- Error feedback [\#111](https://github.com/marklogic/slush-marklogic-node/issues/111)
- Browser Caching Issues In Edge [\#110](https://github.com/marklogic/slush-marklogic-node/issues/110)
- Login Feedback [\#107](https://github.com/marklogic/slush-marklogic-node/issues/107)
- Browser reload/Minification Loop [\#104](https://github.com/marklogic/slush-marklogic-node/issues/104)
- Ignore bower\_components in jshint and watch [\#96](https://github.com/marklogic/slush-marklogic-node/issues/96)
- server.js should honor Content-Disposition and pass-through header [\#67](https://github.com/marklogic/slush-marklogic-node/issues/67)
- Generate new \(random\) secret key for expressSession [\#64](https://github.com/marklogic/slush-marklogic-node/issues/64)
- Glyphicon for loading suggestions shown below search box [\#40](https://github.com/marklogic/slush-marklogic-node/issues/40)

**Closed issues:**

- Write a getting started [\#58](https://github.com/marklogic/slush-marklogic-node/issues/58)
- Search highlights not readable with blue design [\#171](https://github.com/marklogic/slush-marklogic-node/issues/171)
- Redundant images? [\#156](https://github.com/marklogic/slush-marklogic-node/issues/156)
- Cannot add tags \(nor friends\) [\#144](https://github.com/marklogic/slush-marklogic-node/issues/144)
- Login link not shown as button [\#142](https://github.com/marklogic/slush-marklogic-node/issues/142)
- no context around search hit highlight [\#138](https://github.com/marklogic/slush-marklogic-node/issues/138)
- Improve install guide [\#89](https://github.com/marklogic/slush-marklogic-node/issues/89)

**Merged pull requests:**

- Fix \#242 Ignore test coverage folder in git [\#244](https://github.com/marklogic/slush-marklogic-node/pull/244) ([hunterwilliams](https://github.com/hunterwilliams))
- \#211 Turned off browsersync ui off [\#239](https://github.com/marklogic/slush-marklogic-node/pull/239) ([hunterwilliams](https://github.com/hunterwilliams))
- Fix \#229 Account Edits [\#238](https://github.com/marklogic/slush-marklogic-node/pull/238) ([hunterwilliams](https://github.com/hunterwilliams))
- fix for \#235 [\#237](https://github.com/marklogic/slush-marklogic-node/pull/237) ([jenbreese](https://github.com/jenbreese))
- Fixed \#232: npm install had to run before bower install [\#234](https://github.com/marklogic/slush-marklogic-node/pull/234) ([grtjn](https://github.com/grtjn))
- Fixes \#139 bower dependency conflict [\#231](https://github.com/marklogic/slush-marklogic-node/pull/231) ([grtjn](https://github.com/grtjn))
- Fix \#210 HighlightJS error [\#230](https://github.com/marklogic/slush-marklogic-node/pull/230) ([hunterwilliams](https://github.com/hunterwilliams))
- \#221 Ignore google fonts import during minification [\#228](https://github.com/marklogic/slush-marklogic-node/pull/228) ([hunterwilliams](https://github.com/hunterwilliams))
- fixing the flow with wiredep. Turns out that running it when files ch… [\#227](https://github.com/marklogic/slush-marklogic-node/pull/227) ([paxtonhare](https://github.com/paxtonhare))
- Fixed \#222: build mode should look at dist/ [\#225](https://github.com/marklogic/slush-marklogic-node/pull/225) ([grtjn](https://github.com/grtjn))
- Fixed \#223: .live after SOURCE\_DIR was missing [\#224](https://github.com/marklogic/slush-marklogic-node/pull/224) ([grtjn](https://github.com/grtjn))
- \#216 Removed esri option [\#219](https://github.com/marklogic/slush-marklogic-node/pull/219) ([hunterwilliams](https://github.com/hunterwilliams))
- Fix \#214 update git ignore [\#218](https://github.com/marklogic/slush-marklogic-node/pull/218) ([hunterwilliams](https://github.com/hunterwilliams))
- \#208 - replacing app-role [\#209](https://github.com/marklogic/slush-marklogic-node/pull/209) ([hunterwilliams](https://github.com/hunterwilliams))
- \#201 Removed using deprecated express send method [\#204](https://github.com/marklogic/slush-marklogic-node/pull/204) ([hunterwilliams](https://github.com/hunterwilliams))
- \#194 Binary corruption fix in gulp replace [\#203](https://github.com/marklogic/slush-marklogic-node/pull/203) ([hunterwilliams](https://github.com/hunterwilliams))
- Fixed typo in PR for \#193 [\#202](https://github.com/marklogic/slush-marklogic-node/pull/202) ([grtjn](https://github.com/grtjn))
- Fixed \#195: typo in MLCP command [\#199](https://github.com/marklogic/slush-marklogic-node/pull/199) ([grtjn](https://github.com/grtjn))
- Fixed \#195: typo in MLCP command [\#198](https://github.com/marklogic/slush-marklogic-node/pull/198) ([grtjn](https://github.com/grtjn))
- Fixed \#193: show result.label if exists [\#196](https://github.com/marklogic/slush-marklogic-node/pull/196) ([grtjn](https://github.com/grtjn))
- \#191 Users in local.json fix [\#192](https://github.com/marklogic/slush-marklogic-node/pull/192) ([hunterwilliams](https://github.com/hunterwilliams))
- Undoing show-more change, see \#137 [\#190](https://github.com/marklogic/slush-marklogic-node/pull/190) ([grtjn](https://github.com/grtjn))
- changing the layout for tags \#144 [\#186](https://github.com/marklogic/slush-marklogic-node/pull/186) ([jenbreese](https://github.com/jenbreese))
- \#151 Single Config [\#185](https://github.com/marklogic/slush-marklogic-node/pull/185) ([hunterwilliams](https://github.com/hunterwilliams))
- Fixes \#145 [\#183](https://github.com/marklogic/slush-marklogic-node/pull/183) ([hunterwilliams](https://github.com/hunterwilliams))
- updating the chiclets to show an icon with ban/add [\#182](https://github.com/marklogic/slush-marklogic-node/pull/182) ([jenbreese](https://github.com/jenbreese))
- removing the redunant unused style and adding height \#156 [\#181](https://github.com/marklogic/slush-marklogic-node/pull/181) ([jenbreese](https://github.com/jenbreese))
- Fixes \#64 - App secret [\#180](https://github.com/marklogic/slush-marklogic-node/pull/180) ([hunterwilliams](https://github.com/hunterwilliams))
- CreateController - Fixed lint error and made tag test work properly [\#179](https://github.com/marklogic/slush-marklogic-node/pull/179) ([hunterwilliams](https://github.com/hunterwilliams))
- Fixed \#67,\#176: minor changes to proxying to smoothen things a bit [\#177](https://github.com/marklogic/slush-marklogic-node/pull/177) ([grtjn](https://github.com/grtjn))
- fixed issue \#149 and \#142. [\#174](https://github.com/marklogic/slush-marklogic-node/pull/174) ([jenbreese](https://github.com/jenbreese))
- Fixed \#84: minor patch for analyze-data to support JSON [\#173](https://github.com/marklogic/slush-marklogic-node/pull/173) ([grtjn](https://github.com/grtjn))
- Fixed \#85: added robots.txt [\#172](https://github.com/marklogic/slush-marklogic-node/pull/172) ([grtjn](https://github.com/grtjn))
- Fixed \#135: handle app-port arg properly, only open debug port when debug flag [\#170](https://github.com/marklogic/slush-marklogic-node/pull/170) ([grtjn](https://github.com/grtjn))
- \#141 PR - Login Service Changes/Fix [\#168](https://github.com/marklogic/slush-marklogic-node/pull/168) ([hunterwilliams](https://github.com/hunterwilliams))
- Fixed \#144: fixed issue with add/remove tags on create page [\#166](https://github.com/marklogic/slush-marklogic-node/pull/166) ([grtjn](https://github.com/grtjn))
- Fixed \#147: added similar sidebar to esri details, synched presentation between esri/no-esri [\#165](https://github.com/marklogic/slush-marklogic-node/pull/165) ([grtjn](https://github.com/grtjn))
- Fixed \#148: stub mlpm.json to make mlpm install slightly easier [\#164](https://github.com/marklogic/slush-marklogic-node/pull/164) ([grtjn](https://github.com/grtjn))
- Fixes \#160: added collection facet, added comments, removed verbose search: prefix [\#163](https://github.com/marklogic/slush-marklogic-node/pull/163) ([grtjn](https://github.com/grtjn))
- Made it so that search options query on data collection, similar docs… [\#162](https://github.com/marklogic/slush-marklogic-node/pull/162) ([hunterwilliams](https://github.com/hunterwilliams))
- No Cache Requests [\#158](https://github.com/marklogic/slush-marklogic-node/pull/158) ([hunterwilliams](https://github.com/hunterwilliams))
- Added more sample docs [\#157](https://github.com/marklogic/slush-marklogic-node/pull/157) ([hunterwilliams](https://github.com/hunterwilliams))
- Adds a favicon and adds it to index.html [\#155](https://github.com/marklogic/slush-marklogic-node/pull/155) ([hunterwilliams](https://github.com/hunterwilliams))
- Update installation instructions in README [\#154](https://github.com/marklogic/slush-marklogic-node/pull/154) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Do not ask for appname twice [\#153](https://github.com/marklogic/slush-marklogic-node/pull/153) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Fix user tests to reflect login service changes [\#150](https://github.com/marklogic/slush-marklogic-node/pull/150) ([ryanjdew](https://github.com/ryanjdew))
- Add snippet size control [\#130](https://github.com/marklogic/slush-marklogic-node/pull/130) ([mariannemyers](https://github.com/mariannemyers))
- Providing scripts/docs to run app as service [\#129](https://github.com/marklogic/slush-marklogic-node/pull/129) ([bluetorch](https://github.com/bluetorch))
- Details page [\#128](https://github.com/marklogic/slush-marklogic-node/pull/128) ([janmichaelyu](https://github.com/janmichaelyu))
- Move login out as service and add httpintercept for login prompt [\#127](https://github.com/marklogic/slush-marklogic-node/pull/127) ([ryanjdew](https://github.com/ryanjdew))
- More README changes to match wiki changes [\#126](https://github.com/marklogic/slush-marklogic-node/pull/126) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Allow negated facets to work [\#125](https://github.com/marklogic/slush-marklogic-node/pull/125) ([hunterwilliams](https://github.com/hunterwilliams))
- Similar items [\#123](https://github.com/marklogic/slush-marklogic-node/pull/123) ([bluetorch](https://github.com/bluetorch))
- updating to latest bower dependencies [\#122](https://github.com/marklogic/slush-marklogic-node/pull/122) ([paxtonhare](https://github.com/paxtonhare))
- updating css designs. adding separate files. added classes to the roo… [\#121](https://github.com/marklogic/slush-marklogic-node/pull/121) ([jenbreese](https://github.com/jenbreese))
- Added multiple folders/files to ignore [\#117](https://github.com/marklogic/slush-marklogic-node/pull/117) ([hunterwilliams](https://github.com/hunterwilliams))
- Replace Roxy generator questions with flags [\#115](https://github.com/marklogic/slush-marklogic-node/pull/115) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Allow ports to be specified via prompts. \#103 [\#113](https://github.com/marklogic/slush-marklogic-node/pull/113) ([hunterwilliams](https://github.com/hunterwilliams))
- \#102 - renamed sample to app [\#112](https://github.com/marklogic/slush-marklogic-node/pull/112) ([paxtonhare](https://github.com/paxtonhare))
- Login Feedback [\#109](https://github.com/marklogic/slush-marklogic-node/pull/109) ([hunterwilliams](https://github.com/hunterwilliams))
- Updating the header and footer [\#108](https://github.com/marklogic/slush-marklogic-node/pull/108) ([jenbreese](https://github.com/jenbreese))
- Landing page [\#106](https://github.com/marklogic/slush-marklogic-node/pull/106) ([hunterwilliams](https://github.com/hunterwilliams))
- enabling show more for facets [\#101](https://github.com/marklogic/slush-marklogic-node/pull/101) ([paxtonhare](https://github.com/paxtonhare))
- adding a check for latest version of the generator. if a newer versio… [\#100](https://github.com/marklogic/slush-marklogic-node/pull/100) ([paxtonhare](https://github.com/paxtonhare))
- \#77 updated to latest library versions [\#93](https://github.com/marklogic/slush-marklogic-node/pull/93) ([paxtonhare](https://github.com/paxtonhare))

## [v0.1.2](https://github.com/marklogic/slush-marklogic-node/tree/v0.1.2) (2015-07-03)
[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/v0.1.1...v0.1.2)

**Implemented enhancements:**

- Update code/samples to use Native Json [\#90](https://github.com/marklogic/slush-marklogic-node/issues/90)
- Use extspell.xqy [\#86](https://github.com/marklogic/slush-marklogic-node/issues/86)
- Prompt user for MarkLogic version [\#73](https://github.com/marklogic/slush-marklogic-node/issues/73)
- Add ESRI Map Display in Detail View [\#69](https://github.com/marklogic/slush-marklogic-node/issues/69)
- Unnecessary redirects in server.js [\#45](https://github.com/marklogic/slush-marklogic-node/issues/45)
- Add example dictionary for use together with extspell [\#43](https://github.com/marklogic/slush-marklogic-node/issues/43)
- Move JSON samples to sample-data [\#42](https://github.com/marklogic/slush-marklogic-node/issues/42)
- Duplicate facet selections in search model and search context [\#38](https://github.com/marklogic/slush-marklogic-node/issues/38)
- Improve mlrest to add more search functionality [\#37](https://github.com/marklogic/slush-marklogic-node/issues/37)
- Improve mlrest to read search options from server [\#36](https://github.com/marklogic/slush-marklogic-node/issues/36)
- Add default rest-transform for 'filtering' binary docs at upload [\#30](https://github.com/marklogic/slush-marklogic-node/issues/30)
- Add default rest-transform for prettifying XML [\#29](https://github.com/marklogic/slush-marklogic-node/issues/29)
- Add default rest-transform for transforming JSON data \(back\) to XML [\#28](https://github.com/marklogic/slush-marklogic-node/issues/28)
- Add default rest-transform for transforming XML data to JSON [\#27](https://github.com/marklogic/slush-marklogic-node/issues/27)
- Add default rest-transform for downloading data [\#26](https://github.com/marklogic/slush-marklogic-node/issues/26)
- Replace detail.xslt with client-side rendering [\#25](https://github.com/marklogic/slush-marklogic-node/issues/25)
- extsuggest still necessary? [\#24](https://github.com/marklogic/slush-marklogic-node/issues/24)
- Add default rest-extension for analyzing data [\#23](https://github.com/marklogic/slush-marklogic-node/issues/23)
- Add default rest-extension for similar queries [\#22](https://github.com/marklogic/slush-marklogic-node/issues/22)
- Add default rest-extension for spell-suggestions [\#21](https://github.com/marklogic/slush-marklogic-node/issues/21)
- Add factory object to help building structured queries [\#19](https://github.com/marklogic/slush-marklogic-node/issues/19)
- Use ml. prefix for independent modules [\#18](https://github.com/marklogic/slush-marklogic-node/issues/18)
- Transform name 'to-json' confusing [\#17](https://github.com/marklogic/slush-marklogic-node/issues/17)
- \#69 - Added ESRI Maps Integration [\#70](https://github.com/marklogic/slush-marklogic-node/pull/70) ([daveegrant](https://github.com/daveegrant))

**Fixed bugs:**

- Sample data not loaded correctly? [\#92](https://github.com/marklogic/slush-marklogic-node/issues/92)
- ML Server version not being reflected accurately in default.properties file [\#88](https://github.com/marklogic/slush-marklogic-node/issues/88)
- Detail view is not showing data [\#79](https://github.com/marklogic/slush-marklogic-node/issues/79)
- Template fails on Windows [\#75](https://github.com/marklogic/slush-marklogic-node/issues/75)
- Module 'gd.ui.jsonexplorer' is not available [\#71](https://github.com/marklogic/slush-marklogic-node/issues/71)
- Details of sample data not showing [\#66](https://github.com/marklogic/slush-marklogic-node/issues/66)
- Use absolute paths in index.html [\#55](https://github.com/marklogic/slush-marklogic-node/issues/55)
- mlMapsProvider api changed.. [\#47](https://github.com/marklogic/slush-marklogic-node/issues/47)
- The sample app should not trigger a search at init [\#41](https://github.com/marklogic/slush-marklogic-node/issues/41)
- Highlighting not rendered properly [\#39](https://github.com/marklogic/slush-marklogic-node/issues/39)
- Deprecation warning at running gulp server [\#35](https://github.com/marklogic/slush-marklogic-node/issues/35)
- Remove CSS files \(in favor of LESS files\) [\#34](https://github.com/marklogic/slush-marklogic-node/issues/34)
- Common module js gives jshint warning [\#33](https://github.com/marklogic/slush-marklogic-node/issues/33)
- mlrest: rewriteResults creates extra property [\#20](https://github.com/marklogic/slush-marklogic-node/issues/20)
- Importing the testdata gives warnings and import fails [\#16](https://github.com/marklogic/slush-marklogic-node/issues/16)
- Additional Dependency [\#14](https://github.com/marklogic/slush-marklogic-node/issues/14)

**Closed issues:**

- Add a CONTRIBUTING.md file [\#53](https://github.com/marklogic/slush-marklogic-node/issues/53)

**Merged pull requests:**

- \#90 - update to use native json [\#91](https://github.com/marklogic/slush-marklogic-node/pull/91) ([paxtonhare](https://github.com/paxtonhare))
- Fixed Display of Detail Data [\#80](https://github.com/marklogic/slush-marklogic-node/pull/80) ([daveegrant](https://github.com/daveegrant))
- Fixed \#73 and \#75: added ml-version option, and fixed running under Windows [\#76](https://github.com/marklogic/slush-marklogic-node/pull/76) ([grtjn](https://github.com/grtjn))
- updating project based on changes to ng-json-explorer [\#72](https://github.com/marklogic/slush-marklogic-node/pull/72) ([dmcassel](https://github.com/dmcassel))
- Fixed \#43: added dictionary for extspell [\#63](https://github.com/marklogic/slush-marklogic-node/pull/63) ([grtjn](https://github.com/grtjn))
- Fixed \#55: made all js/css paths absolute in index.html [\#61](https://github.com/marklogic/slush-marklogic-node/pull/61) ([grtjn](https://github.com/grtjn))
- Fixed \#45: making server.js more generic [\#60](https://github.com/marklogic/slush-marklogic-node/pull/60) ([grtjn](https://github.com/grtjn))
- Fixed \#42: renamed data to sample-data, adjusted README's accordingly [\#59](https://github.com/marklogic/slush-marklogic-node/pull/59) ([grtjn](https://github.com/grtjn))
- Fixed issue \#53: added CONTRIBUTING.md [\#54](https://github.com/marklogic/slush-marklogic-node/pull/54) ([grtjn](https://github.com/grtjn))
- removed extsuggest [\#52](https://github.com/marklogic/slush-marklogic-node/pull/52) ([joemfb](https://github.com/joemfb))
- disable mlMapsProvider config [\#51](https://github.com/marklogic/slush-marklogic-node/pull/51) ([joemfb](https://github.com/joemfb))
- refactored sample.search to use ml-search-ng [\#49](https://github.com/marklogic/slush-marklogic-node/pull/49) ([joemfb](https://github.com/joemfb))
- Fix for \#16, \#17, \#33. New features \#19, \#21, \#22, \#23, \#26, \#27, \#28, \#29, \#30.. [\#32](https://github.com/marklogic/slush-marklogic-node/pull/32) ([grtjn](https://github.com/grtjn))
- Add ml.utils module for mlMaps [\#13](https://github.com/marklogic/slush-marklogic-node/pull/13) ([withjam](https://github.com/withjam))

## [v0.1.1](https://github.com/marklogic/slush-marklogic-node/tree/v0.1.1) (2014-07-15)
[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/v0.1.0...v0.1.1)

**Implemented enhancements:**

- Update the create form to match the sample data [\#12](https://github.com/marklogic/slush-marklogic-node/issues/12)

**Fixed bugs:**

- Remove references to Demo Cat [\#11](https://github.com/marklogic/slush-marklogic-node/issues/11)
- Missing src/transform/to-json.xqy [\#10](https://github.com/marklogic/slush-marklogic-node/issues/10)

## [v0.1.0](https://github.com/marklogic/slush-marklogic-node/tree/v0.1.0) (2014-07-14)
**Implemented enhancements:**

- Add facets based on sample data [\#8](https://github.com/marklogic/slush-marklogic-node/issues/8)
- Add sample data [\#7](https://github.com/marklogic/slush-marklogic-node/issues/7)

**Merged pull requests:**

- added angular-highlightjs and highlight.js for Show Source feature [\#6](https://github.com/marklogic/slush-marklogic-node/pull/6) ([ryan321](https://github.com/ryan321))
- excluding bower and vendor js paths from jshint and minify [\#3](https://github.com/marklogic/slush-marklogic-node/pull/3) ([ryan321](https://github.com/ryan321))
- Compile and xslt for doc details [\#2](https://github.com/marklogic/slush-marklogic-node/pull/2) ([ryan321](https://github.com/ryan321))



\* *This Change Log was automatically generated by [github_changelog_generator](https://github.com/skywinder/Github-Changelog-Generator)*