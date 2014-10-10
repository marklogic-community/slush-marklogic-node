xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/parse-query";

import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";
import module namespace sut = "http://marklogic.com/rest-api/lib/search-util" at "/MarkLogic/rest-api/lib/search-util.xqy";
import module namespace csu = "http://marklogic.com/rest-api/config-query-util" at "/MarkLogic/rest-api/lib/config-query-util.xqy";

declare namespace roxy = "http://marklogic.com/roxy";

declare
  %roxy:params("q=xs:string", "options=xs:string")
function ext:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  map:put($context, "output-types", "application/json"),
  xdmp:set-response-code(200, "OK"),

  let $q := map:get($params, "q")
  let $options := sut:options($params)
  let $query := search:parse($q, $options, "search:query")
  return document { csu:xml-to-json($query) }
};
