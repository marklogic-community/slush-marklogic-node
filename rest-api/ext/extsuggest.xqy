xquery version "1.0-ml";

module namespace extsuggest = "http://marklogic.com/rest-api/resource/extsuggest";

(: 
 : To add parameters to the functions, specify them in the params annotations. 
 : Example
 :   declare %roxy:params("uri=xs:string", "priority=xs:int") ext:get(...)
 : This means that the get function will take two parameters, a string and an int.
 :)

import module namespace config-query = "http://marklogic.com/rest-api/models/config-query" at "/MarkLogic/rest-api/models/config-query-model.xqy";
import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";

declare namespace roxy = "http://marklogic.com/roxy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare
%roxy:params("pqtxt=xs:string", "options=xs:int?")
function extsuggest:get(
    $context as map:map,
    $params  as map:map
) as document-node()*
{
    let $output-types := map:put($context,"output-types","application/json")
    let $pqtxt := map:get($params,"pqtxt")
    let $options := (map:get($params,"options"), 'all')[1]
    let $options := config-query:get-options($options)
    let $content :=
        if (exists($pqtxt))
        then json:to-array(search:suggest($pqtxt, $options))
        else json:array()
    let $response := json:object()
    let $_ := map:put($response, "suggestions", $content)
    return (xdmp:set-response-code(200,"OK"), document { xdmp:to-json($response) })
};