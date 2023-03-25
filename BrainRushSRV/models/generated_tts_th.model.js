const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../../database.db");
const db_utils = require("../services/database");
//todo : add an update method to update answers etc

exports.createNew = async (test_id, TTS_id, displayed_keywords, isTH) => {
    try {
        return await db_utils.runSync(
            db,
            `INSERT INTO GENERATED_TTS_TH (test_id, TTS_id, displayed_keywords, type) VALUES (?,?,?,?)`,
            [test_id, TTS_id, displayed_keywords, isTH]
        );
    } catch (err) {
        return { error: err.message };
    }
};
