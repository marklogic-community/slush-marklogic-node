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
