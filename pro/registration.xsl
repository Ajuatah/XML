<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/">
        <html>
            <head>
                <title>Register Patient</title>
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
                <h2>Register Patient</h2>
                <form id="registration-form" onsubmit="registerPatient(); return false;">
                    <label>Name:</label>
                    <input type="text" id="name" name="name" required="required"/>
                    <label>Age:</label>
                    <input type="number" id="age" name="age" required="required"/>
                    <label>Room Number:</label>
                    <input type="text" id="room" name="room" required="required"/>
                    <label>Sickness:</label>
                    <input type="text" id="sickness" name="sickness" required="required"/>
                    <button type="submit">Register Patient</button>
                </form>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>