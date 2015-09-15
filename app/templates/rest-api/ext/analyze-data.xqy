xquery version "1.0-ml";

module namespace ext = "http://marklogic.com/rest-api/resource/analyze-data";

import module namespace admin = "http://marklogic.com/xdmp/admin" at "/MarkLogic/admin.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare namespace roxy = "http://marklogic.com/roxy";
declare namespace xs = "http://www.w3.org/2001/XMLSchema";
declare namespace db = "http://marklogic.com/xdmp/database";

declare option xdmp:mapping "false";

(: global variable that helps provide ns prefixes for ns uris :)
declare variable $ns-map := map:map();

declare variable $analyze-sample-only := false();
declare variable $use-path-indexes := true();

(:
 :)
declare
%roxy:params("sample-size=xs:integer?", "action=xs:string?", "index=xs:string*", "collection=xs:string*")
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
%roxy:params("sample-size=xs:integer?", "action=xs:string?", "index=xs:string*", "collection=xs:string*")
function ext:post(
  $context as map:map,
  $params  as map:map,
  $input   as document-node()*
) as document-node()*
{
  map:put($context, "output-types", "text/html"),
  xdmp:set-response-code(200, "OK"),

  (: parameters :)
  let $sample-size := xs:integer((map:get($params, "sample-size"), "20")[1])
  let $indexes := distinct-values(map:get($params, "index"))
  let $create-indexes := map:get($params, "action")[contains(., 'Create')]
  let $remove-indexes := map:get($params, "action")[contains(., 'Remove')]
  let $collections := distinct-values(map:get($params, "collection"))

  let $max :=
    if ($collections) then
      xdmp:estimate(collection($collections))
    else
      xdmp:estimate(collection())

  let $random-start := if ($max gt $sample-size) then xdmp:random($max - $sample-size) else 1
  let $sample :=
    if ($collections) then
      collection($collections)[$random-start to ($random-start + $sample-size - 1)]
    else
      collection()[$random-start to ($random-start + $sample-size - 1)]
  let $sample-data :=
    for $doc in $sample
    return
      document {
        $doc,
        xdmp:document-properties(base-uri($doc))
      }
  let $roots :=
    if ($analyze-sample-only) then
      distinct-values($sample-data/*/node-name(.))
    else if ($collections) then
      distinct-values(collection($collections)/*/node-name(.))
    else
      distinct-values(collection()/*/node-name(.))

  let $config := admin:get-configuration()
  let $elem-indexes := admin:database-get-range-element-indexes($config, xdmp:database())
  let $attr-indexes := admin:database-get-range-element-attribute-indexes($config, xdmp:database())
  let $path-indexes := admin:database-get-range-path-indexes($config, xdmp:database())
  let $all-indexes := ($elem-indexes, $attr-indexes, $path-indexes)

  let $path-namespaces := admin:database-get-path-namespaces($config, xdmp:database())
  let $init-namespaces := (
    for $ns in $path-namespaces
    let $ns-uri := $ns/*:namespace-uri/string(.)
    let $ns-prefix := $ns/*:prefix/string(.)
    where $ns-uri != '' and not(map:get($ns-map, $ns-uri))
    return
      map:put($ns-map, $ns-uri, $ns-prefix)
    ,
    for $index in $elem-indexes
    let $ns-uri := $index/db:namespace-uri[. != '']
    let $ns-prefix :=
      replace($ns-uri, '^(.*/)?([^/]{1,4})[^/]*$', '$2')[. != '']
    where $ns-uri != '' and not(map:get($ns-map, $ns-uri))
    return
      map:put($ns-map, $ns-uri, $ns-prefix)
    ,
    for $index in $attr-indexes
    let $parent-ns-uri := $index/db:parent-namespace-uri[. != '']
    let $parent-ns-prefix :=
      if ($parent-ns-uri) then replace($parent-ns-uri, '^(.*/)?([^/]{1,4})[^/]*$', '$2')[. != ''] else ()
    let $ns-uri := $index/db:namespace-uri[. != '']
    let $ns-prefix :=
      if ($ns-uri) then replace($ns-uri, '^(.*/)?([^/]{1,4})[^/]*$', '$2')[. != ''] else ()
    return (
      if ($parent-ns-uri != '' and not(map:get($ns-map, $parent-ns-uri))) then
        map:put($ns-map, $parent-ns-uri, $parent-ns-prefix)
      else (),
      if ($ns-uri != '' and not(map:get($ns-map, $ns-uri))) then
        map:put($ns-map, $ns-uri, $ns-prefix)
      else ()
    ),
    for $root at $i in $roots
    let $ns-uri := namespace-uri-from-QName($root)
    let $ns-prefix := prefix-from-QName($root)
    let $ns-prefix :=
      ($ns-prefix, replace($ns-uri, '^(.*/)?([^/]{1,4})[^/]*$', '$2'), concat("_", $i))[. != ''][1]
    where $ns-uri != '' and not(map:get($ns-map, $ns-uri))
    return
      map:put($ns-map, $ns-uri, $ns-prefix)
    ,
    for $ns at $i in $sample-data//namespace::*
    let $ns-uri := string($ns)
    let $ns-prefix :=
      (name($ns), replace($ns-uri, '^(.*/)?([^/]{1,4})[^/]*$', '$2'), concat("__", $i))[. != ''][1]
    where $ns-uri != '' and not(map:get($ns-map, $ns-uri))
    return
      map:put($ns-map, $ns-uri, $ns-prefix)
  )

  (:
    let $_ := xdmp:log(xdmp:quote(document{$all-indexes}))
  :)
  let $created-indexes := if ($create-indexes) then $indexes[empty(ext:get-indexes($ns-map, $all-indexes, $use-path-indexes, .))] else ()
  let $removed-indexes := if ($remove-indexes) then $indexes[exists(ext:get-indexes($ns-map, $all-indexes, $use-path-indexes, .))] else ()

  let $restart-marklogic :=
    if ($create-indexes) then
      let $config := ext:create-indexes($ns-map, $config, $use-path-indexes, $created-indexes)
      return
        admin:save-configuration-without-restart($config)
    else if ($remove-indexes) then
      let $config := ext:remove-indexes($ns-map, $config, $all-indexes, $removed-indexes)
      return
        admin:save-configuration-without-restart($config)
    else ()

  (:let $config := admin:get-configuration():)
  let $elem-indexes := admin:database-get-range-element-indexes($config, xdmp:database())
  let $attr-indexes := admin:database-get-range-element-attribute-indexes($config, xdmp:database())
  let $path-indexes := admin:database-get-range-path-indexes($config, xdmp:database())
  let $all-indexes := ($elem-indexes, $attr-indexes, $path-indexes)
  (:
    let $_ := xdmp:log(xdmp:quote(document{$all-indexes}))
  :)

  return
    document {
      xdmp:with-namespaces(
        for $ns-uri in map:keys($ns-map)
        return
          (map:get($ns-map, $ns-uri), $ns-uri),

        <html><body>
          <h1>Data analysis</h1>

          {
            if ($restart-marklogic) then
              <p>Please restart MarkLogic..</p>
            else ()
          }

          <form id="size" name="size" method="POST">
            <p>Total docs: {$max}</p>
            <p>Sample size: <input type="text" name="rs:sample-size" value="{$sample-size}" onchange="size.submit()"/></p>
          </form>

          {
            if ($create-indexes) then
              <div>
                <h2>Created Indexes ({count($created-indexes)})</h2>
                <ul>{
                  if ($created-indexes) then
                    for $i in $created-indexes
                    return
                      <li>{$i}</li>
                  else
                    <li><em>(none)</em></li>
                }</ul>
              </div>
            else if ($remove-indexes) then
              <div>
                <h2>Removed Indexes ({count($removed-indexes)})</h2>
                <ul>{
                  if ($removed-indexes) then
                    for $i in $removed-indexes
                    return
                      <li>{$i}</li>
                  else
                    <li><em>(none)</em></li>
                }</ul>
              </div>
            else ()
          }

          {
            (: FORMATS :)

            let $xml :=
              if ($analyze-sample-only) then
                count($sample/*)
              else if ($collections) then
                xdmp:estimate(collection($collections)/*)
              else
                xdmp:estimate(collection()/*)
            let $text :=
              if ($analyze-sample-only) then
                count($sample/text())
              else if ($collections) then
                xdmp:estimate(collection($collections)/text())
              else
                xdmp:estimate(collection()/text())
            let $bin :=
              if ($analyze-sample-only) then
                count($sample/binary())
              else if ($collections) then
                xdmp:estimate(collection($collections)/binary())
              else
                xdmp:estimate(collection()/binary())
            return
              <div>
                <h2>{if ($analyze-sample-only) then 'Sample' else 'All'} Formats ({$xml + $text + $bin})</h2>
                <ul>
                  <li>XML: {$xml}</li>
                  <li>Text: {$text}</li>
                  <li>Binary: {$bin}</li>
                </ul>
              </div>
          }

          {
            (: COLLECTIONS :)

            (: The following requires collection lexicon. Using try-catch if it hasn't been enabled :)
            try {
              let $sample-collections :=
                if ($analyze-sample-only) then
                  distinct-values($sample/xdmp:document-get-collections(base-uri(.)))
                else
                  cts:collections()
              return
                <div>
                  <h2>{if ($analyze-sample-only) then 'Sample' else 'All'} Collections ({count($sample-collections)})</h2>
                  <ul>{
                    if ($sample-collections) then
                      for $c in $sample-collections
                      return
                        <li><a href="?rs:collection={encode-for-uri($c)}&amp;rs:sample-size={$sample-size}">{$c}</a> ({xdmp:estimate(collection($c))} docs)</li>
                    else
                      <li><em>(none)</em></li>
                  }</ul>
                </div>
            } catch ($ignore) {
              xdmp:log($ignore)
            }
          }

          {
            (: DIRECTORIES :)

            (: The following requires uri lexicon. Using try-catch if it hasn't been enabled :)
            try {
              let $dirs :=
                if ($analyze-sample-only) then
                  distinct-values($sample/replace(base-uri(.), '^(.*/)?([^/]+)$', '$1'))
                else
                  ext:dir("", "infinity")
              return
                <div>
                  <h2>{if ($analyze-sample-only) then 'Sample' else 'All'} Directories ({count($dirs)})</h2>
                  <ul>{
                    if ($dirs) then (
                      for $d in $dirs[1 to 1000]
                      order by $d
                      return
                        <li><a href="/v1/search?directory={encode-for-uri($d)}" target="_blank">{$d}</a> ({xdmp:estimate(xdmp:directory($d))} docs)</li>,

                      if (count($dirs) > 1000) then
                        <li><em>(too many, showing first 1000)</em></li>
                      else ()
                    )
                    else
                      <li><em>(none)</em></li>
                  }</ul>
                </div>
            } catch ($ignore) {}
          }

          {
            (: ROOT ELEMENTS :)

            <div>
              <h2>{if ($analyze-sample-only) then 'Sample' else 'All'} Root elements ({count($roots)})</h2>
              <ul>{
                for $n in distinct-values($roots)
                let $local-name := local-name-from-QName($n)
                let $ns-uri := namespace-uri-from-QName($n)

                (: Potentially unsafe, $ns-map is based on $sample, while $ns-uri can come from collection() here.. :)
                let $ns-prefix := if ($ns-uri) then concat(map:get($ns-map, $ns-uri), ":") else ""

                let $count := xdmp:value(concat("count($sample-data/",$ns-prefix, $local-name, ")"))
                let $total-count :=
                  if ($collections) then
                    xdmp:value(concat("xdmp:estimate(collection($collections)/",$ns-prefix, $local-name, ")"))
                  else
                    xdmp:value(concat("xdmp:estimate(collection()/",$ns-prefix, $local-name, ")"))
                order by $total-count descending
                return
                  <li>/{$ns-prefix}{$local-name} ({$total-count}x total, {$count}x in sample)</li>
              }</ul>
            </div>
          }

          <div>
            <h2>Sample ({count($sample)})</h2>
            <ul>{
              for $uri in $sample/base-uri(.)
              order by $uri
              return
                <li><a href="/v1/documents?format=xml&amp;category=content&amp;uri={encode-for-uri($uri)}" target="_blank">{$uri}</a> (<a href="/v1/documents?format=xml&amp;category=metadata&amp;uri={encode-for-uri($uri)}" target="_blank">metadata</a>)</li>
            }</ul>
          </div>

          {
            (: NAMESPACES :)

            let $namespaces := map:keys($ns-map)
            return
              <div>
                <h2>Sample Namespaces ({count($namespaces)})</h2>
                <ul>{
                  if ($namespaces) then
                    for $ns-uri in $namespaces
                    let $ns-prefix := map:get($ns-map, $ns-uri)
                    let $count := xdmp:value(concat("count($sample-data//", $ns-prefix, ':*)'))
                    order by $count descending
                    return
                      <li>{$ns-prefix} := "{$ns-uri}" ({$count}x in sample)</li>
                  else
                    <li><em>(none)</em></li>
                }</ul>
              </div>
          }

          {
            (: ELEMENT PATHS :)

            let $elements := distinct-values($sample-data//*/ext:path(.))
            return
              <div>
                <h2>Sample Element Paths ({count($elements)})</h2>
                <ul>{
                  for $p in $elements
                  let $count := xdmp:value(concat("count($sample-data", $p, ')'))
                  order by $p ascending
                  return
                    <li>{$p} ({round($count div $sample-size * 100) div 100}x / doc)</li>
                }</ul>
              </div>
          }

          {
            (: VALUE PATHS :)

            let $nodes := distinct-values($sample-data//(*[not(*)], @*)/ext:path(.))
            return (
              <form method="POST">
                <h2>Sample Value Paths ({count($nodes)})</h2>
                <ul>{
                  for $p in $nodes
                  let $values := xdmp:value(concat("for $doc in $sample-data return ($doc", $p, ")[1 to 50]"))/normalize-space(string(.))[. ne '']
                  let $count := count($values)
                  where $count > 0
                  order by $p ascending
                  return
                    <li><input type="checkbox" name="rs:index" value="{$p}">{
                      if (exists(ext:get-indexes($ns-map, $all-indexes, $use-path-indexes, $p))) then
                        (attribute disabled {'true'}, attribute checked {'true'})
                      else if ($created-indexes[. = $p]) then
                        attribute checked {'true'}
                      else ()
                    }</input> {$p} ({round($count div $sample-size * 100) div 100}x / doc)</li>
                }</ul>
                <input type="hidden" name="rs:sample-size" value="{$sample-size}"/>
                <input type="submit" name="rs:action" value="Create selected indexes"/>
              </form>,

              (: SUGGESTED INDEXES :)

              <form method="POST">
                <h2>Suggested Indexes</h2>
                <ul>{
                  for $p in distinct-values($sample-data//(*[not(*)], @*)/ext:path(.))
                  let $values := xdmp:value(concat("for $doc in $sample-data return ($doc", $p, ")[1 to 50]"))/normalize-space(string(.))[. ne '']
                  let $unique-values := distinct-values($values)
                  let $top-values :=
                    for $v in $unique-values
                    let $count := count($values[. = $v])
                    order by $count descending
                    return $v
                  let $count := count($values)
                  where $count > 0
                  order by $p ascending
                  return (
                    <li><input type="checkbox" name="rs:index" value="{$p}">{
                      if (exists(ext:get-indexes($ns-map, $all-indexes, $use-path-indexes, $p))) then
                        (attribute disabled {'true'}, attribute checked {'true'})
                      else if ($created-indexes[. = $p]) then
                        attribute checked {'true'}
                      else ()
                    }</input><strong> {$p}</strong> ({round($count div $sample-size * 100) div 100}x / doc)</li>,
                    <ul><li>{
                      let $last := 3
                      for $v at $x in $top-values[1 to $last]
                      let $count := count($values[. = $v])
                      return
                        <span>{if ($x != 1) then ', ' else (), xdmp:describe(ext:cast-value($v))} ({$count}){if ($x = $last and count($top-values) > $last) then ', ..' else ()}</span>
                    }</li>
                    <li>{if (count($values[. = $top-values[1]]) = 1) then 'Unique ' else ()}{xdmp:type(ext:cast-value($top-values[1]))}</li>
                    </ul>
                  )
                }</ul>
                <input type="hidden" name="rs:sample-size" value="{$sample-size}"/>
                <input type="submit" name="rs:action" value="Create selected indexes"/>
              </form>
            )
          }

          {
            (: EXISTING INDEXES :)

            <form method="POST">
              <h2>Existing Indexes ({count($all-indexes)})</h2>
              <ul>{
                if ($all-indexes) then
                  let $paths := (
                    for $index in $elem-indexes
                    let $ns-uri := $index/db:namespace-uri[. != '']
                    let $ns-prefix := if ($ns-uri) then concat(map:get($ns-map, $ns-uri), ":") else ()
                    let $lnames := $index/db:localname/string(.)
                    for $lname in tokenize($lnames, "\s+")
                    return
                      concat("//",$ns-prefix,$lname),

                    for $index in $attr-indexes
                    let $parent-ns-uri := $index/db:parent-namespace-uri[. != '']
                    let $parent-ns-prefix := if ($parent-ns-uri) then concat(map:get($ns-map, $parent-ns-uri), ":") else ()
                    let $parent-lname := $index/db:parent-localname
                    let $ns-uri := $index/db:namespace-uri[. != '']
                    let $ns-prefix := if ($ns-uri) then concat(map:get($ns-map, $ns-uri), ":") else ()
                    let $lnames := $index/db:localname/string(.)
                    for $lname in tokenize($lnames, "\s+")
                    return
                      concat("//",$parent-ns-prefix,$parent-lname,"/@",$ns-prefix,$lname),

                    for $index in $path-indexes
                    return
                      $index/db:path-expression
                  )

                  for $p in $paths
                  order by $p ascending
                  return
                    <li><input type="checkbox" name="rs:index" value="{$p}"/>{$p}</li>
                else
                  <li><em>(none)</em></li>
              }</ul>
              <input type="hidden" name="rs:sample-size" value="{$sample-size}"/>
              <input type="submit" name="rs:action" value="Remove selected indexes"/>
            </form>
          }

          <p>{xdmp:elapsed-time()}</p>

        </body></html>
      )
    }
};

(: HELPER FUNCTIONS :)

(: return XPath as string alike xdmp:path, but non-positional, and with explicit namespaces.. :)
declare function ext:path($node) {
  if ($node) then
    concat(
      ext:path($node/parent::*),

      '/',

      if ($node instance of attribute()) then
        '@'
      else (),

      let $uri := namespace-uri($node)
      let $prefix := (map:get($ns-map, $uri), '*')[1]
      where $uri
      return
        concat($prefix, ':'),

      local-name-from-QName(node-name($node))
    )
  else ()
};

declare function ext:dir(
  $base as xs:string,
  $level as item()
)
  as xs:string*
{
  let $uri-match :=
    if ($base eq "" or ends-with($base, "/")) then
      concat($base, "*")
    else
      concat($base, "/*")

  let $regex-base :=
    if ($base eq "" or ends-with($base, "/")) then
      $base
    else
      concat($base, "/")

  let $depth :=
    if (string($level) eq "infinity") then
      "*"
    else
      concat("{",$level,"}")

  let $remainder :=
    if ($base eq "" and string($level) eq "infinity") then
      ".+"
    else
      ".*"

  let $regex :=
    concat("^(", $regex-base, "([^/]*/)",$depth,")",$remainder,"")

  return
    distinct-values(for $uri in cts:uri-match($uri-match) return replace($uri, $regex, '$1'))
};

declare function ext:cast-value($value) {
  if($value castable as xs:int) then xs:int($value)
  else if($value castable as xs:decimal) then xs:decimal($value)
  else if($value castable as xs:duration) then xs:duration($value)
  else if($value castable as xs:dateTime) then xs:dateTime($value)
  else if($value castable as xs:time) then xs:time($value)
  else if($value castable as xs:date) then xs:date($value)
  else if($value castable as xs:gYearMonth) then xs:gYearMonth($value)
  else if($value castable as xs:gYear) then xs:gYear($value)
  else if($value castable as xs:gMonthDay) then xs:gMonthDay($value)
  else if($value castable as xs:gDay) then xs:gDay($value)
  else if($value castable as xs:gMonth) then xs:gMonth($value)
  (:
  else if($value castable as xs:hexBinary) then xs:hexBinary($value)
  else if($value castable as xs:base64Binary) then xs:base64Binary($value)
  :)
  else if(contains($value, ':') and $value castable as xs:QName) then xs:QName($value)
  else if($value castable as xs:boolean) then xs:boolean($value)
  else xs:string($value)
};

declare function ext:get-indexes($ns-map, $indexes, $use-path-indexes, $paths) {
  if ($use-path-indexes) then
    ext:get-path-indexes($indexes, $paths)
  else
    xdmp:with-namespaces(
      for $ns-uri in map:keys($ns-map)
      return
        (map:get($ns-map, $ns-uri), $ns-uri),

      for $path in $paths
      let $node := xdmp:value(concat("(collection()", $path, ")[1]"))
      let $is-elem := $node instance of element()
      let $node-name := node-name($node)
      let $node-lname := local-name-from-QName($node-name)
      let $node-uri := namespace-uri-from-QName($node-name)
      let $parent-name := if ($is-elem) then () else node-name($node/parent::*)
      let $parent-lname := if ($is-elem) then () else local-name-from-QName($parent-name)
      let $parent-uri := if ($is-elem) then () else namespace-uri-from-QName($parent-name)
      return
        $indexes[
          db:localname = $node-lname
          and db:namespace-uri = $node-uri
          and (
            $is-elem
            or (
              db:parent-localname = $parent-lname
              and db:parent-namespace-uri = $parent-uri
            )
          )
        ]
    )
};

declare function ext:get-path-indexes($indexes, $paths) {
  $indexes[
    db:path-expression = $paths
  ]
};

declare function ext:create-indexes($ns-map, $config, $use-path-indexes, $paths) {
  if ($use-path-indexes) then
    ext:create-path-indexes($ns-map, $config, $paths)
  else
    xdmp:with-namespaces(
      for $ns-uri in map:keys($ns-map)
      return
        (map:get($ns-map, $ns-uri), $ns-uri),

      let $add-indexes :=
        for $path in $paths
        let $node := xdmp:value(concat("(collection()", $path, ")[1]"))
        let $is-elem := $node instance of element()
        let $node-name := node-name($node)
        let $node-lname := local-name-from-QName($node-name)
        let $node-uri := namespace-uri-from-QName($node-name)
        let $parent-name := if ($is-elem) then () else node-name($node/parent::*)
        let $parent-lname := if ($is-elem) then () else local-name-from-QName($parent-name)
        let $parent-uri := if ($is-elem) then () else namespace-uri-from-QName($parent-name)
        return
          xdmp:set(
            $config,
            if ($is-elem) then
              admin:database-add-range-element-index(
                $config,
                xdmp:database(),
                admin:database-range-element-index(
                  local-name-from-QName(xdmp:type(ext:cast-value($node))),
                  $node-uri,
                  $node-lname,
                  "http://marklogic.com/collation/",
                  fn:false()
                )
              )
            else
              admin:database-add-range-element-attribute-index(
                $config,
                xdmp:database(),
                admin:database-range-element-attribute-index(
                  local-name-from-QName(xdmp:type(ext:cast-value($node))),
                  $parent-uri,
                  $parent-lname,
                  $node-uri,
                  $node-lname,
                  "http://marklogic.com/collation/",
                  fn:false()
                )
              )
          )
      return
        $config
    )
};

declare function ext:create-path-indexes($ns-map, $config, $paths) {
  xdmp:with-namespaces(
    for $ns-uri in map:keys($ns-map)
    return
      (map:get($ns-map, $ns-uri), $ns-uri),

    let $existing-namespaces := admin:database-get-path-namespaces($config, xdmp:database())
    let $new-ns-specs :=
      for $ns-uri in map:keys($ns-map)
      let $ns-prefix := map:get($ns-map, $ns-uri)
      let $ns-spec := admin:database-path-namespace($ns-prefix, $ns-uri)
      where empty($existing-namespaces[deep-equal(., $ns-spec)])
      return
        $ns-spec
    let $config := admin:database-add-path-namespace($config, xdmp:database(), $new-ns-specs)

    let $add-indexes :=
      for $path in $paths
      let $node := xdmp:value(concat("(collection()", $path, ")[1]"))
      return
        xdmp:set(
          $config,
          admin:database-add-range-path-index(
            $config,
            xdmp:database(),
            admin:database-range-path-index(
              xdmp:database(),
              local-name-from-QName(xdmp:type(ext:cast-value($node))),
              $path,
              "http://marklogic.com/collation/",
              fn:false(),
              "reject"
            )
          )
        )
    return $config
  )
};

declare function ext:remove-indexes($ns-map, $config, $existing-indexes, $paths) {
  let $indexes := ext:get-indexes($ns-map, $existing-indexes, $use-path-indexes, $paths)
  let $elem-indexes := $indexes[empty(db:parent-localname)]
  let $attr-indexes := $indexes[exists(db:parent-localname)]
  let $config :=
    admin:database-delete-range-element-index(
      $config,
      xdmp:database(),
      $elem-indexes
    )
  let $config :=
    admin:database-delete-range-element-attribute-index(
      $config,
      xdmp:database(),
      $attr-indexes
    )
  return
    ext:remove-path-indexes($config, $existing-indexes, $paths)
};

declare function ext:remove-path-indexes($config, $existing-indexes, $paths) {
  admin:database-delete-range-path-index(
    $config,
    xdmp:database(),
    ext:get-path-indexes($existing-indexes, $paths)
  )
};

