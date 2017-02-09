<?xml version="1.0" encoding="UTF-8"?>
<!--
REST transform for returning tidy HTML. Non-HTML is passed through untouched.
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:map="http://marklogic.com/xdmp/map"
  xmlns:util="http://marklogic.com/utilities"
  xmlns:xdmp="http://marklogic.com/xdmp"

  extension-element-prefixes="xdmp"
  exclude-result-prefixes="#all">

  <xdmp:import-module namespace="http://marklogic.com/utilities" href="/lib/utilities.xqy"/>

  <xsl:output omit-xml-declaration="yes"/>

  <xsl:param name="context" as="map:map"/>

  <xsl:template match="/">
    <xsl:variable name="uri" select="map:get($context, 'uri')"/>
    <xsl:variable name="content-type" select="util:get-content-type($uri, /)" />

    <xsl:sequence select="map:put($context, 'output-type', $content-type)"/>

    <xsl:choose>
      <xsl:when test="contains($content-type, 'html')">
        <xsl:sequence select="xdmp:tidy(.)[2]"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="."/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
