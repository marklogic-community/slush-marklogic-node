xquery version "1.0-ml";
module namespace trans = "http://marklogic.com/rest-api/transform/filter-docs";

declare namespace ingest = "http://marklogic.com/dll/ingest-binaries";
declare namespace html = "http://www.w3.org/1999/xhtml";

declare function trans:transform(
  $context as map:map,
  $params as map:map,
  $content as document-node()
) as document-node()
{
  let $uri := map:get($context, "uri")
  let $filter := xdmp:document-filter($content)
  let $metadata :=
    for $meta in $filter//html:meta
    return
      element { xs:QName(concat("ingest:", $meta/@name)) } {
        data($meta/@content)
      }
  return (
    xdmp:document-set-property($uri, <ingest:filter>{$filter}</ingest:filter>),
    xdmp:document-set-property($uri, <ingest:metadata>{$metadata}</ingest:metadata>),
    $content
  )
};