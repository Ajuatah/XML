<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <title>Doctor Sign In</title>
                <style>
                    body { font-family: Arial, sans-serif; background: #f4f4f9; padding: 20px; }
                    form { max-width: 400px; margin: 40px auto; background: #fff; padding: 24px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);}
                    label { display: block; margin-bottom: 8px; }
                    input { width: 100%; padding: 8px; margin-bottom: 16px; border: 1px solid #ccc; border-radius: 4px;}
                    button { background: #3498db; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;}
                    button:hover { background: #217dbb; }
                </style>
            </head>
            <body>
                <h2>Doctor Sign In</h2>
                <form id="signin-form" onsubmit="signInDoctor(); return false;">
                    <label>Username:</label>
                    <input type="text" id="username" name="username" required="required"/>
                    <label>Password:</label>
                    <input type="password" id="password" name="password" required="required"/>
                    <button type="submit">Sign In</button>
                </form>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>