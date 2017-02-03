<?xml version="1.0" encoding="UTF-8"?>
<!--
REST transform for adding content-disposition header.
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:map="http://marklogic.com/xdmp/map"
  xmlns:util="http://marklogic.com/utilities"
  xmlns:xdmp="http://marklogic.com/xdmp"

  extension-element-prefixes="xdmp"
  exclude-result-prefixes="#all">

  <xdmp:import-module namespace="http://marklogic.com/utilities" href="/lib/utilities.xqy"/>

  <xsl:param name="context" as="map:map"/>
  <xsl:param name="params" as="map:map"/>

  <xsl:variable name="dquote">"</xsl:variable>

  <xsl:template match="/">
    <xsl:variable name="uri" select="map:get($context, 'uri')"/>
    <xsl:variable name="filename" select="util:get-filename($uri)" />
    <xsl:variable name="content-type" select="util:get-content-type($uri, /)" />

    <xsl:sequence select="xdmp:add-response-header('content-disposition', concat('attachment; filename=', $dquote, $filename, $dquote))"/>
    <xsl:sequence select="map:put($context, 'output-type', $content-type)"/>
    <xsl:sequence select="."/>
  </xsl:template>

</xsl:stylesheet>
