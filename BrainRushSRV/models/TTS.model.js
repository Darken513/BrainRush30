const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");
const db_utils = require("../services/database");

exports.createNew = async (text, keywords, difficulty) => {
    try {
        return await db_utils.runSync(
            db,
            `INSERT INTO TEXT_TO_SPEECH (text, keywords, difficulty) VALUES (?, ?, ?)`,
            [text, keywords, difficulty]
        );
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.getById = async (id) => {
    const query = `SELECT * FROM TEXT_TO_SPEECH WHERE id = ?`;
    try {
        let row = await db_utils.getSync(db, query, [id]);
        return row ? row : undefined;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.getAllByIds = async (idList) => {
    const placeholders = idList.map(() => "?").join(",");
    const query = `SELECT * FROM TEXT_TO_SPEECH WHERE id IN (${placeholders})`;
    try {
        let rows = await db_utils.getAllSync(db, query, idList);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.getAll = async () => {
    try {
        let rows = await db_utils.getAllSync(db, `SELECT * FROM TEXT_TO_SPEECH`);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.getAllByDifficulty = async (difficulty) => {
    try {
        let rows = await db_utils.getAllSync(
            db,
            `SELECT * FROM TEXT_TO_SPEECH WHERE difficulty = ?`,
            [difficulty]
        );
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.getRandByDifficulty = async (difficulty) => {
    try {
        let rows = await db_utils.getSync(
            db,
            `SELECT * FROM TEXT_TO_SPEECH WHERE difficulty = ? ORDER BY RANDOM() LIMIT 1`,
            [difficulty]
        );
        return rows;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.updateAnswerById = async (id, answer) => {
    try {
        return await db_utils.runSync(
            db,
            `UPDATE GENERATED_TTS_TH SET answer = ? WHERE id = ?`,
            [answer, id]
        );
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}