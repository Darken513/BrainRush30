const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.db');

exports.initDataBase = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS USERS (
            id INTEGER PRIMARY KEY,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS KEYWORDS (
            id INTEGER PRIMARY KEY,
            word TEXT NOT NULL UNIQUE,
            difficulty INTEGER NOT NULL
        )`,
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS TEXT_TO_SPEECH (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            keywords TEXT NOT NULL,
            difficulty INTEGER NOT NULL
        )`,
    );
}
exports.runSync = function (db, sql, params) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
};
exports.getSync = function (db, sql, params) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, function (err, row) {
            if (err) reject(err);
            else resolve(row);
        });
    });
};
exports.getAllSync = function (db, sql) {
    return new Promise((resolve, reject) => {
        db.all(sql, [], function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};