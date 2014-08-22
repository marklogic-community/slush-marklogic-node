xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/extspell";

import module namespace spell = "http://marklogic.com/xdmp/spell" at "/MarkLogic/spell.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare namespace roxy = "http://marklogic.com/roxy";

declare variable $dictionary := "/dictionary-large.xml";

(:
 : To add parameters to the functions, specify them in the params annotations.
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") ext:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :)

(:
 :)
declare
%roxy:params("pqtxt=xs:string", "limit=xs:int?")
function ext:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  ext:post($context, $params, ())
};

(:
 :)
declare
%roxy:params("pqtxt=xs:string", "limit=xs:int?")
function ext:post(
    $context as map:map,
    $params  as map:map,
    $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context,"output-types", "application/json")
  let $pqtxt := map:get($params, "pqtxt")
  let $limit := xs:int((map:get($params, "limit"), 10)[1])
  let $content :=
    if (exists($pqtxt)) then
      json:to-array(
        (
          for $suggest in spell:suggest($dictionary, $pqtxt)
          where $suggest != $pqtxt and xdmp:estimate(cts:search(collection(), $suggest)) > 0
          return $suggest
        )[1 to $limit]
      )
    else json:array()
  let $response := json:object()
  let $_ := map:put($response, "suggestions", $content)
  return (xdmp:set-response-code(200,"OK"), document { xdmp:to-json($response) })
};
