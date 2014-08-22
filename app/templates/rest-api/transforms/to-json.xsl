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
  xmlns:ingest="http://marklogic.com/ingest"
  xmlns:json="http://marklogic.com/xdmp/json"
  xmlns:map="http://marklogic.com/xdmp/map"
  xmlns:util="http://marklogic.com/utilities"
  xmlns:xdmp="http://marklogic.com/xdmp"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  xmlns:xs="http://www.w3.org/2001/XMLSchema"

  extension-element-prefixes="xdmp"
  exclude-result-prefixes="#all">

  <xdmp:import-module namespace="http://marklogic.com/utilities" href="/lib/utilities.xqy"/>
  <xdmp:import-module namespace="http://marklogic.com/xdmp/json" href="/MarkLogic/json/json.xqy"/>

  <xsl:param name="context" as="map:map"/>
  <xsl:param name="params" as="map:map"/>

  <xsl:variable name="highlight" select="map:get($params, 'highlight')"/>
  <xsl:variable name="config" select="json:config('full')"/>
  <xsl:variable name="_" select="map:put($config, 'array-element-names', (
    ))"/>

  <xsl:template match="@*|node()" mode="#all">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()" mode="#current"/>
    </xsl:copy>
  </xsl:template>

  <xsl:template match="/">
    <xsl:choose>
      <xsl:when test="map:get($params, 'download')">
        <xsl:sequence select="map:put($context,'output-type', xdmp:content-type(base-uri(.)))"/>
        <xsl:sequence select="."/>
      </xsl:when>
      <xsl:when test="empty(* | text())">
        <xsl:apply-templates select="xdmp:document-properties(base-uri(.))" mode="binary"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="." mode="non-binary"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template match="/" mode="non-binary">
    <xsl:variable name="preprocessed">
      <xsl:apply-templates mode="preprocess"/>
    </xsl:variable>
    <xsl:variable name="highlighted" select="if ($highlight) then util:highlight($preprocessed, $highlight) else $preprocessed"/>
    <xsl:variable name="processed">
      <xsl:apply-templates select="$highlighted/node()"/>
    </xsl:variable>

    <xsl:sequence select="json:transform-to-json($processed, $config)"/>
  </xsl:template>

  <xsl:template match="/" mode="binary">
    <xsl:variable name="preprocessed">
      <xsl:apply-templates mode="preprocess"/>
    </xsl:variable>
    <xsl:variable name="highlighted" select="if ($highlight) then util:highlight($preprocessed, $highlight) else $preprocessed"/>
    <xsl:variable name="processed">
      <xsl:apply-templates select="$highlighted//ingest:metadata"/>
      <xsl:sequence select="$highlighted//xhtml:body"/>
    </xsl:variable>

    <xsl:sequence select="json:transform-to-json($processed, $config)"/>
  </xsl:template>

</xsl:stylesheet>
