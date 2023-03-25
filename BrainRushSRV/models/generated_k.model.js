const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../database.db');
const db_utils = require('../services/database')
//todo : add an update method to update answers etc

exports.createNew = async (test_id) => {
    try {
        return await db_utils.runSync(db, `INSERT INTO GENERATED_KEYWORDS (test_id) VALUES (?)`, [test_id]);
    } catch (err) {
        return { error: err.message };
    }
}
exports.getById = async (id) => {
    const query = `SELECT * FROM GENERATED_KEYWORDS WHERE id = ?`;
    try {
        let row = await db_utils.getSync(db, query, [id]);
        return row?row:undefined;
    } catch (err) {
        return { error: err.message };
    }
}
exports.getAllKeywordsByGKId = async (gk_id) => {
    let query = ` SELECT * FROM KEYWORDS k JOIN KEYWORDS_GENERATED_KEYWORDS kgk ON k.id = kgk.k_id WHERE kgk.gk_id = ?;`;
    try {
        return await db_utils.getAllSync(db, query, [gk_id]);
    } catch (err) {
        return { error: err.message };
    }
}