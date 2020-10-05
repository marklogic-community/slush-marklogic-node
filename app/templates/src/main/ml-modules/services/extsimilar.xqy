xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/extsimilar";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

(:
 : Params
 :  uri (string), limit (int)
 :)
declare
function ext:get(
  $context as map:map,
  $params  as map:map
) as document-node()*
{
  ext:post($context, $params, ())
};

(:
 : Params
 :  uri (string), limit (int)
 :)
declare
function ext:post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  let $output-types := map:put($context, "output-types", "application/json")
  let $uri := map:get($params, "uri")
  let $limit := xs:int((map:get($params, "limit"), '5')[1])
  let $collections := xdmp:document-get-collections($uri)
  let $collection-q := if (fn:exists($collections)) then cts:collection-query($collections) else ()
  let $content :=
    if (exists($uri)) then
      json:to-array(
        cts:uris(
          (),
          ("limit="||$limit),
          cts:and-query((
            cts:not-query(cts:document-query($uri)),
            $collection-q,
            cts:similar-query(doc($uri))
          ))
        )
      )
    else json:array()
  let $response := json:object()
  let $_ := map:put($response, "similar", $content)
  return (xdmp:set-response-code(200, "OK"), document { xdmp:to-json($response) })
};
