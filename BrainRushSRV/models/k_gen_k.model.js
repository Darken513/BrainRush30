const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const db_utils = require('../services/database')

exports.createNew = async (k_id, gk_id) => {
    try {
        return await db_utils.runSync(db, `INSERT INTO KEYWORDS_GENERATED_KEYWORDS (k_id, gk_id) VALUES (?,?)`, [k_id, gk_id]);
    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}