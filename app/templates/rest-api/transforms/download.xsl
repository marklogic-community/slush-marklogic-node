<?xml version="1.0" encoding="UTF-8"?>
<!--
REST API transforms managed by Roxy must follow these conventions:

1. Their filenames must reflect the name of the transform.

For example, an XSL transform named add-attr must be contained in a file named add-attr.xslt.

2. Must annotate the file with the transform parameters in an XML comment:

%roxy:params("uri=xs:string", "priority=xs:int")
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:map="http://marklogic.com/xdmp/map"
  xmlns:xdmp="http://marklogic.com/xdmp"

  extension-element-prefixes="xdmp"
  exclude-result-prefixes="#all">

  <xsl:param name="context" as="map:map"/>
  <xsl:param name="params" as="map:map"/>

  <xsl:template match="/">
    <xsl:variable name="filename" select="xdmp:url-decode(tokenize(base-uri(.), '/')[last()])" />
    <xsl:variable name="dquote">"</xsl:variable>
    <xsl:sequence select="xdmp:add-response-header('content-disposition', concat('attachment; filename=', $dquote, $filename, $dquote))"/>
    <xsl:sequence select="map:put($context,'output-type',xdmp:content-type(base-uri(.)))"/>
    <xsl:sequence select="."/>
  </xsl:template>

</xsl:stylesheet>
