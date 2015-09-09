# Change Log

## [Unreleased](https://github.com/marklogic/slush-marklogic-node/tree/HEAD)

[Full Changelog](https://github.com/marklogic/slush-marklogic-node/compare/v0.1.2...HEAD)

**Implemented enhancements:**

- rename sample to app [\#102](https://github.com/marklogic/slush-marklogic-node/issues/102)
- add show more to facets [\#99](https://github.com/marklogic/slush-marklogic-node/issues/99)
- move search box to the body [\#98](https://github.com/marklogic/slush-marklogic-node/issues/98)
- check for updates when generator is run [\#97](https://github.com/marklogic/slush-marklogic-node/issues/97)
- Switch to ui-router [\#62](https://github.com/marklogic/slush-marklogic-node/issues/62)
- Eliminate common/ [\#57](https://github.com/marklogic/slush-marklogic-node/issues/57)
- Add default favicon [\#56](https://github.com/marklogic/slush-marklogic-node/issues/56)
- Add template code for running as service with forever [\#44](https://github.com/marklogic/slush-marklogic-node/issues/44)

**Fixed bugs:**

- CSS @import no longer working [\#120](https://github.com/marklogic/slush-marklogic-node/issues/120)
- Glyphicon for loading suggestions shown below search box [\#40](https://github.com/marklogic/slush-marklogic-node/issues/40)

**Closed issues:**

- Provide a bare mlpm.json to make mlpm install for deps easier [\#148](https://github.com/marklogic/slush-marklogic-node/issues/148)
- no context around search hit highlight [\#138](https://github.com/marklogic/slush-marklogic-node/issues/138)
- Don't ask for required input [\#133](https://github.com/marklogic/slush-marklogic-node/issues/133)
- Add toggle for snippet types [\#132](https://github.com/marklogic/slush-marklogic-node/issues/132)
- Add Negation Support [\#124](https://github.com/marklogic/slush-marklogic-node/issues/124)
- Separate User Service? [\#119](https://github.com/marklogic/slush-marklogic-node/issues/119)
- .gitignore dist folder [\#114](https://github.com/marklogic/slush-marklogic-node/issues/114)
- Login Feedback [\#107](https://github.com/marklogic/slush-marklogic-node/issues/107)
- Landing Page [\#105](https://github.com/marklogic/slush-marklogic-node/issues/105)
- Browser reload/Minification Loop [\#104](https://github.com/marklogic/slush-marklogic-node/issues/104)
- Ports Specified Via Prompts [\#103](https://github.com/marklogic/slush-marklogic-node/issues/103)
- Ignore bower\_components in jshint and watch [\#96](https://github.com/marklogic/slush-marklogic-node/issues/96)
- default app user cannot use the app [\#95](https://github.com/marklogic/slush-marklogic-node/issues/95)
- Improve install guide [\#89](https://github.com/marklogic/slush-marklogic-node/issues/89)
- Fix analyze-data to work with JSON [\#84](https://github.com/marklogic/slush-marklogic-node/issues/84)
- Upgrade bower dependencies to latest [\#77](https://github.com/marklogic/slush-marklogic-node/issues/77)
- Create new release [\#68](https://github.com/marklogic/slush-marklogic-node/issues/68)
- Write a getting started [\#58](https://github.com/marklogic/slush-marklogic-node/issues/58)

**Merged pull requests:**

- Fixed \#84: minor patch for analyze-data to support JSON [\#173](https://github.com/marklogic/slush-marklogic-node/pull/173) ([grtjn](https://github.com/grtjn))
- Fixed \#148: stub mlpm.json to make mlpm install slightly easier [\#164](https://github.com/marklogic/slush-marklogic-node/pull/164) ([grtjn](https://github.com/grtjn))
- Adds a favicon and adds it to index.html [\#155](https://github.com/marklogic/slush-marklogic-node/pull/155) ([hunterwilliams](https://github.com/hunterwilliams))
- Update installation instructions in README [\#154](https://github.com/marklogic/slush-marklogic-node/pull/154) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Do not ask for appname twice [\#153](https://github.com/marklogic/slush-marklogic-node/pull/153) ([patrickmcelwee](https://github.com/patrickmcelwee))
- Fix user tests to reflect login service changes [\#150](https://github.com/marklogic/slush-marklogic-node/pull/150) ([ryanjdew](https://github.com/ryanjdew))
- Add snippet size control [\#130](https://github.com/marklogic/slush-marklogic-node/pull/130) ([mariannemyers](https://github.com/mariannemyers))
- Providing scripts/docs to run app as service [\#129](https://github.com/marklogic/slush-marklogic-node/pull/129) ([bluetorch](https://github.com/bluetorch))
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
- Prompt user for MarkLogic version [\#73](https://github.com/marklogic/slush-marklogic-node/issues/73)
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

- Sample data not loaded correctly? [\#92](https://github.com/marklogic/slush-marklogic-node/issues/92)
- ML Server version not being reflected accurately in default.properties file [\#88](https://github.com/marklogic/slush-marklogic-node/issues/88)
- Use extspell.xqy [\#86](https://github.com/marklogic/slush-marklogic-node/issues/86)
- Detail view is not showing data [\#79](https://github.com/marklogic/slush-marklogic-node/issues/79)
- Add ESRI Map Display in Detail View [\#69](https://github.com/marklogic/slush-marklogic-node/issues/69)
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