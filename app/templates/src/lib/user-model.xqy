xquery version "1.0-ml";

module namespace user = "http://marklogic.com/slush/user-model";

import module namespace json = "http://marklogic.com/xdmp/json" at "/MarkLogic/json/json.xqy";

declare namespace alert = "http://marklogic.com/xdmp/alert";
declare namespace jbasic = "http://marklogic.com/xdmp/json/basic";

declare option xdmp:mapping "false";

declare variable $is-ml8 := fn:starts-with(xdmp:version(), "8");

(: access :)

declare function user:replace($profile as element(jbasic:json), $properties as element()*, $new-properties as element()*) as element(jbasic:json) {
  element { fn:node-name($profile) } {
    $profile/@*,
    $profile/(* except $profile/jbasic:user),
    element jbasic:user {
      attribute type { "object"},
      $profile/jbasic:user/(@* except @type),

      $profile/jbasic:user/(* except $properties),
      $new-properties
    }
  }
};

(: low-level access :)

declare function user:uri($id as xs:string) as xs:string {
  fn:concat('/users/', $id, '.json')
};

declare function user:get($id as xs:string) as element(jbasic:json) {
  let $uri := user:uri($id)
  return
    user:read($uri)
};

declare function user:put($id as xs:string, $profile as element(jbasic:json)) {
  let $uri := user:uri($id)
  return
    user:save($uri, $profile)
};

declare function user:convert($doc as document-node()?) as element(jbasic:json) {
  if ($doc/jbasic:json) then
    $doc/jbasic:json
  else if ($doc) then
    json:transform-from-json($doc)
  else
    <jbasic:json type="object"/>
};

declare function user:read($uri as xs:string) as element(jbasic:json) {
  let $doc := fn:doc($uri)
  return
    user:convert($doc)
};

declare function user:save($uri as xs:string, $profile as element(jbasic:json)) {
  let $profile :=
    if ($is-ml8) then
      xdmp:to-json(json:transform-to-json($profile))/node()
    else
      $profile
  return
    xdmp:document-insert($uri, $profile, (xdmp:default-permissions(), xdmp:document-get-permissions($uri)), (xdmp:default-collections(), 'users', xdmp:document-get-collections($uri)))
};
