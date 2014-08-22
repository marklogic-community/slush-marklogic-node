<?xml version="1.0" encoding="UTF-8"?>
<!--
REST API transforms managed by Roxy must follow these conventions:

1. Their filenames must reflect the name of the transform.

For example, an XSL transform named add-attr must be contained in a file named add-attr.xslt.

2. Must annotate the file with the transform parameters in an XML comment:

%roxy:params("uri=xs:string", "priority=xs:int")
-->
<!-- %roxy:params("highlight=xs:string?") -->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:json="http://marklogic.com/xdmp/json"
  xmlns:map="http://marklogic.com/xdmp/map"
  xmlns:xdmp="http://marklogic.com/xdmp"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"

  extension-element-prefixes="xdmp"
  exclude-result-prefixes="#all">

  <xdmp:import-module namespace="http://marklogic.com/xdmp/json" href="/MarkLogic/json/json.xqy"/>

  <xsl:param name="context" as="map:map"/>
  <xsl:param name="params" as="map:map"/>

  <xsl:variable name="config" select="json:config('full')"/>
  <xsl:variable name="_" select="map:put($config, 'array-element-names', (
    ))"/>

  <xsl:template match="@*|node()" mode="#all">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/">
    <xsl:apply-templates select="json:transform-from-json(., $config)"/>
  </xsl:template>

</xsl:stylesheet>
