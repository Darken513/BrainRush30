const _ = require("lodash");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const db_utils = require('../services/database')
const testDB = require('./test.model')

exports.createNew = async (day, user_id) => {
    try {
        let newTest = await testDB.createNew(day, 2, 2, 2) //todo: remove magic variable
        let newAttempt = await db_utils.runSync(db, `INSERT INTO USER_ATTEMPTS (user_id, test_id) VALUES (?,?)`, [user_id, newTest.id]);
        let toret = { id: newAttempt.lastID, test: newTest }
        return toret;
    } catch (err) {
        return { error: err.message };
    }
}
exports.getByIdShort = async (id) => {
    const query = `SELECT * FROM USER_ATTEMPTS WHERE id = ?`;
    try {
        let row = await db_utils.getSync(db, query, [id]);
        return row ? row : undefined;
    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
};
exports.getById = async (id) => {
    try {
        let toret = { id }
        let temp = await exports.getByIdShort(id);
        toret.score = temp.score;
        toret.attempted_at = temp.attempted_at;
        let test = await testDB.getById(temp.test_id);
        toret.test = test;
        return toret;
    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}
exports.getAllByUserAndDay = async (userId, day) => {
    try {
        let toret = []
        const query = `
            SELECT * FROM USER_ATTEMPTS ua
                JOIN TESTS ON TESTS.id = ua.test_id
            WHERE user_id = ? AND day = ?
            ORDER BY attempted_at asc;
        `;
        let rows = await db_utils.getAllSync(db, query, [userId, day]);
        for (const idx in rows) {
            const row = rows[idx];
            toret.push(await exports.getById(row.id))
        }
        return toret;
    } catch (err) {
        console.log(err.message);
        return { error: err.message };
    }
}
exports.updateScoreById = async (ua_id, score) => {
    const updateQuery = `
        UPDATE USER_ATTEMPTS
        SET score = ?
        WHERE id = ?
    `;
    await db_utils.runSync(db, updateQuery, [score, ua_id]);
}