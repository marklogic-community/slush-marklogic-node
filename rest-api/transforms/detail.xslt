
<!--
REST API transforms managed by Roxy must follow these conventions:

1. Their filenames must reflect the name of the transform.

For example, an XSL transform named add-attr must be contained in a file named add-attr.xslt.

2. Must annotate the file with the transform parameters in an XML comment:

%roxy:params("uri=xs:string", "priority=xs:int")
-->

<!-- %roxy:params("uri=xs:string", "priority=xs:int") -->
<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:map="http://marklogic.com/xdmp/map"
                xmlns:xdmp="http://marklogic.com/xdmp"
                xmlns:xhtml="http://www.w3.org/1999/xhtml"
                extension-element-prefixes="xdmp"
                exclude-result-prefixes="#all">

    <xsl:param name="context" as="map:map"/>
    <xsl:param name="params" as="map:map"/>

    <xsl:template match="/">
      <div class="details">
        <a class="btn btn-primary btn-sm pull-right" ng-href="/">
          Return to <span class="glyphicon glyphicon-search"></span>
        </a>
        <button class="btn btn-primary btn-sm pull-right" ng-click="model.showSource = true" ng-hide="model.showSource">
          Show source
        </button>
        <button class="btn btn-primary btn-sm pull-right" ng-click="model.showSource = false" ng-show="model.showSource">
          Hide source
        </button>
        <h2><xsl:value-of select=".//title"/></h2>

        <div ng-hide="model.showSource">
          <xsl:apply-templates />
        </div>
        <div hljs="" ng-show="model.showSource">
          <xsl:sequence select="*"/>
        </div>
      </div>
    </xsl:template>

    <xsl:template match="xhtml:table">
      <xsl:copy-of select="."/>
    </xsl:template>

    <xsl:template match="grouped-table">
      <div class="grouped">
        <xsl:apply-templates />
      </div>
    </xsl:template>

    <xsl:template match="*[not(*)][normalize-space(string(.)) != '']">
      <li class="detail">
        <label><xsl:value-of select="local-name()"/>: </label>
        <span><xsl:value-of select="."/></span>
      </li>
    </xsl:template>


</xsl:stylesheet>
