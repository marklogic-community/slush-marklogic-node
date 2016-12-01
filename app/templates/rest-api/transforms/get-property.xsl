<?xml version="1.0" encoding="UTF-8"?>
<!--
REST transform for returning single document-properties with indentation for the purpose of showing it to the end user.
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:map="http://marklogic.com/xdmp/map"
  xmlns:xdmp="http://marklogic.com/xdmp"

  extension-element-prefixes="xdmp"
  exclude-result-prefixes="#all">

  <xsl:output indent="yes" omit-xml-declaration="yes"/>
  <xsl:strip-space elements="*"/>
  
  <xsl:param name="context" as="map:map"/>
  <xsl:param name="params"  as="map:map"/>
  
  <xsl:variable name="property" select="map:get($params, 'property')"/>

  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/">
    <xsl:variable name="uri" select="map:get($context, 'uri')"/>
    <xsl:choose>
      <xsl:when test="string-length($property) > 0">
        <xsl:sequence select="map:put($context,'output-type','application/xml')"/>
        <xsl:apply-templates select="xdmp:document-properties($uri)/*/*[local-name() = $property]"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="."/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

</xsl:stylesheet>
