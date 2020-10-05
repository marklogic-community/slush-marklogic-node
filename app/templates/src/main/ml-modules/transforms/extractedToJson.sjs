/*
  REST transform for converting XML content to JSON (for use with extract-document-data). Copied from:
  http://stackoverflow.com/questions/37986731/extract-document-data-comes-as-xml-string-element-in-json-output/37994680#37994680
*/

/* jshint node:true,esnext:true */
/* global xdmp */

var json = require('/MarkLogic/json/json.xqy');
var config = json.config('custom');

function extractedToJson(context, params, content) {
  'use strict';

  var response = content.toObject();

  if (response.results) {
    response.results.map(function(result) {
      if (result.extracted && result.extracted.content) {
        result.extracted.content.map(function(content, index) {
          if (content.match(/^</) && !content.match(/^<!/)) {
            result.extracted.content[index] = json.transformToJson(xdmp.unquote(content), config);
          }
        });
      }
    });
  }

  return response;
}

exports.transform = extractedToJson;
