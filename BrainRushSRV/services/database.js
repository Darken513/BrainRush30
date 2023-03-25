const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("../database.db");

exports.initDataBase = () => {
    db.run(`
        CREATE TABLE IF NOT EXISTS USERS (
            id INTEGER PRIMARY KEY,
            password TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            notif_time TIME DEFAULT '08:00:00',
            design_mode INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS KEYWORDS (
            id INTEGER PRIMARY KEY,
            word TEXT NOT NULL UNIQUE,
            difficulty INTEGER NOT NULL
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS TEXT_TO_SPEECH (
            id INTEGER PRIMARY KEY,
            text TEXT NOT NULL,
            keywords TEXT NOT NULL,
            difficulty INTEGER NOT NULL
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS USER_ATTEMPTS (
            id INTEGER PRIMARY KEY,
            user_id INTEGER,
            test_id INTEGER,
            score INTEGER,
            attempted_at TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES USERS(id),
            FOREIGN KEY(test_id) REFERENCES TESTS(id)
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS TESTS (
            id INTEGER PRIMARY KEY,
            day INTEGER,
            passing_score INTEGER
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS GENERATED_TTS_TH (
            id INTEGER PRIMARY KEY,
            test_id INTEGER,
            TTS_id INTEGER,
            displayed_keywords TEXT,
            answer TEXT,
            type BOOLEAN,
            FOREIGN KEY(test_id) REFERENCES TESTS(id),
            FOREIGN KEY(TTS_id) REFERENCES TEXT_TO_SPEECH(id)
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS GENERATED_KEYWORDS (
            id INTEGER PRIMARY KEY,
            test_id INTEGER,
            answer TEXT,
            FOREIGN KEY(test_id) REFERENCES TESTS(id)
        );`
    );
    db.run(`
        CREATE TABLE IF NOT EXISTS KEYWORDS_GENERATED_KEYWORDS (
            id INTEGER PRIMARY KEY,
            gk_id INTEGER,
            k_id INTEGER,
            FOREIGN KEY(k_id) REFERENCES KEYWORDS(id),
            FOREIGN KEY(gk_id) REFERENCES GENERATED_KEYWORDS(id)
        );
        `
    );
};
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
exports.getAllSync = function (db, sql, params) {
    return new Promise((resolve, reject) => {
        db.all(sql, params?params:[], function (err, rows) {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};
