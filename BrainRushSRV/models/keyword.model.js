const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const db_utils = require('../services/database')

exports.createNew = async (word, difficulty) => {
    try {
        return await db_utils.runSync(db, `INSERT INTO KEYWORDS (word, difficulty) VALUES (?, ?)`, [word, difficulty]);
    } catch (err) {
        return { error: err.message.includes('SQLITE_CONSTRAINT') ? 'keyword already exists' : 'An error has occurred' };
    }
}
exports.getById = async (id) => {
    const query = `SELECT * FROM KEYWORDS WHERE id = ?`;
    try {
        let row = await db_utils.getSync(db, query, [id]);
        return row ? row : undefined;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.getAllByIds = async (idList) => {
    const placeholders = idList.map(() => '?').join(',');
    const query = `SELECT * FROM KEYWORDS WHERE id IN (${placeholders})`;
    try {
        let rows = await db_utils.getAllSync(db, query, idList);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.getAll = async () => {
    try {
        let rows = await db_utils.getAllSync(db, `SELECT * FROM KEYWORDS`);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.getAllByDifficulty = async (difficulty) => {
    try {
        let rows = await db_utils.getAllSync(db, `SELECT * FROM KEYWORDS WHERE difficulty = ?`, [difficulty]);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.getRandNByDifficulty = async (n, difficulty) => {
    try {
        let rows = await db_utils.getAllSync(db, `SELECT * FROM KEYWORDS WHERE difficulty = ? ORDER BY RANDOM() LIMIT ${n}`, [difficulty]);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.getRandNbr = async (n) => {
    try {
        let rows = await db_utils.getAllSync(db, `SELECT * FROM KEYWORDS ORDER BY RANDOM() LIMIT ${n}`);
        return rows ? rows : [];
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}