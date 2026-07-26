const pool = require("./db");

async function testConnection() {
    try {
        const result = await pool.query("SELECT NOW()");
        console.log("✅ Connected to PostgreSQL");
        console.log(result.rows[0]);
    } catch (err) {
        console.error("❌ Database Connection Failed");
        console.error(err.message);
    } finally {
        pool.end();
    }
}

testConnection();
