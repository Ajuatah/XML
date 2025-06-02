<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:template match="/Hospital">
        <html>
            <head>
                <title>Hospital Patient Records</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f9;
                        padding: 20px;
                    }
                    h2 {
                        color: #2c3e50;
                        text-align: center;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        box-shadow: 0 2px 3px rgba(0,0,0,0.1);
                    }
                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }
                    th {
                        background-color: #3498db;
                        color: white;
                    }
                    tr:nth-child(even) {
                        background-color: #f2f2f2;
                    }
                    tr:hover {
                        background-color: #e6f7ff;
                    }
                    .delete-btn {
                        background-color: #ff4444;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: background-color 0.3s;
                    }
                    .delete-btn:hover {
                        background-color: #cc0000;
                    }
                    .action-col {
                        width: 100px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <h2>Patient Records</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Age</th>
                            <th>Room</th>
                            <th>Sickness</th>
                            <th>Doctor</th>
                            <th class="action-col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:choose>
                            <xsl:when test="Patients/Patient">
                                <xsl:for-each select="Patients/Patient">
                                    <tr>
                                        <td><xsl:value-of select="Name"/></td>
                                        <td><xsl:value-of select="Age"/></td>
                                        <td><xsl:value-of select="Room"/></td>
                                        <td><xsl:value-of select="Sickness"/></td>
                                        <td><xsl:value-of select="Doctor"/></td>
                                        <td class="action-col">
                                            <button class="delete-btn" data-id="{Id}">Delete</button>
                                        </td>
                                    </tr>
                                </xsl:for-each>
                            </xsl:when>
                            <xsl:otherwise>
                                <tr>
                                    <td colspan="6" style="text-align:center;">No patients found.</td>
                                </tr>
                            </xsl:otherwise>
                        </xsl:choose>
                    </tbody>
                </table>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>