<?xml version="1.0" encoding="UTF-8"?>
<!--
REST transform for returning XML with indentation for the purpose of showing it to the end user.
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

  <xsl:output indent="yes" omit-xml-declaration="yes"/>
  <xsl:strip-space elements="*"/>
  
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/">
    <xsl:variable name="uri" select="map:get($context, 'uri')"/>
    <xsl:variable name="content-type" select="util:get-content-type($uri, /)" />
    <xsl:sequence select="map:put($context, 'output-type', $content-type)"/>
    <xsl:choose>
      <xsl:when test="element()">
        <xsl:apply-templates />
      </xsl:when>
      <xsl:otherwise>
        <xsl:sequence select="." />
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
