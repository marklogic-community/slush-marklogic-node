xquery version "1.0-ml";

module namespace util = "http://marklogic.com/utilities";

declare default function namespace "http://www.w3.org/2005/xpath-functions";

declare option xdmp:mapping "false"; (::)

(:
 : Wrapper function for sending an email
 :)
declare function util:send-notification(
  $recipient-name as xs:string,
  $recipient-email as xs:string,
  $subject as  xs:string,
  $message as item()
) as empty-sequence() {
  xdmp:email(
    <em:Message
      xmlns:em="URN:ietf:params:email-xml:"
      xmlns:rf="URN:ietf:params:rfc822:">
      <rf:subject>{$subject}</rf:subject>
      <rf:from>
        <em:Address>
          <em:name>MarkLogic Demo</em:name>
          <em:adrs>no-reply@demo.marklogic.com</em:adrs>
        </em:Address>
      </rf:from>
      <rf:to>
        <em:Address>
          <em:name>{$recipient-name}</em:name>
          <em:adrs>{$recipient-email}</em:adrs>
        </em:Address>
      </rf:to>
      <em:content>
        <html xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <title>{$subject}</title>
          </head>
          <body>{$message}</body>
        </html>
      </em:content>
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

declare function util:get-content-type($uri) {
  xdmp:uri-content-type($uri)
};

declare function util:get-content-type($uri, $doc) {
  let $content-type :=
    if (util:is-binary($doc)) then
      xdmp:document-properties($uri)//*:meta[@name = 'content-type']/(@content, .)[not(. = ('', 'text/plain'))]
    else ()
  return
    ($content-type, xdmp:uri-content-type($uri))[1]
};

declare function util:get-filename($uri) {
  xdmp:url-decode(tokenize($uri, '/')[last()])
};
