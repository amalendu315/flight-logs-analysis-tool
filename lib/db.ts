// lib/db.ts
import sql from "mssql";

// Define your database connection config
const config = {
  user: "AirIQVendorAPI",
  password: "Pritesh_29#@%8",
  server: "airiqvendorapi.database.windows.net",
  database: "AirIQVendorAPI",
  options: {
    encrypt: true, // Use encryption for Azure SQL
    trustServerCertificate: true, // Set to true for self-signed certificates
  },
};

// Create a function to connect to the database and run queries
export const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error("Error connecting to SQL Server:", error);
    throw error;
  }
};

// Run a query function
export const queryDatabase = async (query: string) => {
  const pool = await connectToDatabase();
  try {
    const result = await pool.query(query);
    return result.recordset; // The returned data
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
