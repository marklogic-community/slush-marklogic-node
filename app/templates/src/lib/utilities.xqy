xquery version "1.0-ml";

module namespace util = "http://marklogic.com/utilities";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare option xdmp:mapping "false"; (::)

(:
 : Wrapper function for sending an email
 :)
declare function util:send-notification(
  $recipient-names as xs:string+,
  $recipient-emails as xs:string+,
  $subject as  xs:string,
  $message as item()
) as empty-sequence() {
  util:send-email(
    "MarkLogic Demo",
    "no-reply@demo.marklogic.com",
    $recipient-names,
    $recipient-emails,
    (),
    (),
    $subject,
    "text/html",
    "body",
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>{$subject}</title>
      </head>
      <body>{$message}</body>
    </html>
  )
};

declare function util:send-email(
  $from-name as xs:string,
  $from-email as xs:string,
  $to-names as xs:string+,
  $to-emails as xs:string+,
  $cc-names as xs:string*,
  $cc-emails as xs:string*,
  $subject as xs:string,
  $content-types as xs:string*,
  $content-filenames as xs:string*,
  $content as item()*
) as empty-sequence() {
  let $newline := "&#13;&#10;"
  let $boundary := concat("boundary-", xdmp:random())
  let $encoded-content := xdmp:multipart-encode(
    $boundary,
    <manifest>{
      for $item at $i in $content
      let $content-type := ($content-types[$i], "text/html")[1]
      let $filename := ($content-filenames[$i], "untitled.html")[1]
      return
        <part>
          <headers>
            <Content-Type>{$content-type}</Content-Type>
            <Content-Disposition>{
              if ($item instance of binary() or $filename != "") then
                concat("attachment; filename=", $filename)
              else
                "inline"
            }</Content-Disposition>
            <Content-Transfer-Encoding>{
              if ($item instance of binary() or $filename != "") then
                "base64"
              else
                "quoted-printable"
            }</Content-Transfer-Encoding>
          </headers>
        </part>
    }</manifest>,
    for $item at $i in $content
    let $content-type := ($content-types[$i], "text/html")[1]
    return
      if ($item instance of binary() or ($item instance of document-node() and
$item/binary())) then
        document{ xs:base64Binary($item) }
      else if (contains($content-type, "html") and (not($content instance of
element()) or empty($content/*:html))) then
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <title>{$subject}</title>
          </head>
          <body>{$item}</body>
        </html>
      else if ($item instance of node()) then
        $item
      else
        (: multipart encode requires nodes as input :)
        document{ $item }
  )

  let $to :=
    for $email at $i in $to-emails
    let $name := $to-names[$i]
    return
      <em:Address xmlns:em="URN:ietf:params:email-xml:">
        <em:name>{$name}</em:name>
        <em:adrs>{$email}</em:adrs>
      </em:Address>
  let $cc :=
    for $email at $i in $cc-emails
    let $name := $cc-names[$i]
    return
      <em:Address xmlns:em="URN:ietf:params:email-xml:">
        <em:name>{$name}</em:name>
        <em:adrs>{$email}</em:adrs>
      </em:Address>
  return
    xdmp:email(
      <em:Message xmlns:em="URN:ietf:params:email-xml:" xmlns:rf="URN:ietf:params:rfc822:">
        <rf:subject>{$subject}</rf:subject>
        <rf:from>
          <em:Address>
            <em:name>{$from-name}</em:name>
            <em:adrs>{$from-email}</em:adrs>
          </em:Address>
        </rf:from>
        <rf:to>
          <em:Group>
            <em:name>recipients</em:name>
            {$to}
          </em:Group>
        </rf:to>
        <rf:cc>
          <em:Group>
            <em:name>cc</em:name>
            {$cc}
          </em:Group>
        </rf:cc>
        <rf:content-type>multipart/mixed; boundary={$boundary}</rf:content-type>
        <em:content xml:space="preserve">{xdmp:binary-decode($encoded-content, "utf-8")}</em:content>
      </em:Message>
    )
};

declare function util:highlight($doc, $query) {
  cts:highlight($doc, $query, <span class="highlight">{$cts:text}</span>)
};

declare function util:is-binary($node) {
  $node instance of binary()
    or $node/node() instance of binary()
};

declare function util:is-json($node) {
  $node instance of object-node()
  or $node instance of array-node()
  or $node/node() instance of array-node()
  or $node/node() instance of object-node()
};

declare function util:is-xml($node) {
  $node instance of element()
    or $node/node() instance of element()
};

declare function util:get-content-type($uri) {
  xdmp:uri-content-type($uri)
};

declare function util:get-content-type($uri, $doc) {
  let $content-type :=
    if (util:is-binary($doc)) then
      xdmp:document-properties($uri)//*:meta[@name = 'content-type']/(@content, .)[not(. = ('', 'text/plain'))]
    else if (util:is-json($doc)) then
      "application/json"
    else if (util:is-xml($doc)) then
      "application/xml"
    else ()
  return
    ($content-type, xdmp:uri-content-type($uri))[1]
};

declare function util:get-filename($uri) {
  xdmp:url-decode(tokenize($uri, '/')[last()])
};
