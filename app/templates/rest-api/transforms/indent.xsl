<?xml version="1.0" encoding="UTF-8"?>
<!--
REST API transforms managed by Roxy must follow these conventions:

1. Their filenames must reflect the name of the transform.

For example, an XSL transform named add-attr must be contained in a file named add-attr.xslt.

2. Must annotate the file with the transform parameters in an XML comment:

%roxy:params("uri=xs:string", "priority=xs:int")
-->
<!-- %roxy:params("highlight=xs:string?") -->
<xsl:stylesheet version="2.0" exclude-result-prefixes="#all" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

  <xsl:output indent="yes" omit-xml-declaration="yes"/>

  <xsl:template match="/">
    <xsl:sequence select="."/>
  </xsl:template>

</xsl:stylesheet>
