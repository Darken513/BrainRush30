const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database.db');

exports.initDataBase = () => {
    // Create users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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