//Do not run this file unless you have deleted the database file, or else improve the code in a way
//that it avoids craching on SQLITE_CONSTRAINT errors.

const fs = require("fs");
const _ = require("lodash");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database.db");

db.run(`
    CREATE TABLE IF NOT EXISTS KEYWORDS (
        id INTEGER PRIMARY KEY,
        word TEXT NOT NULL UNIQUE,
        difficulty INTEGER NOT NULL
    )`);
db.run(`
    CREATE TABLE IF NOT EXISTS TEXT_TO_SPEECH (
        id INTEGER PRIMARY KEY,
        text TEXT NOT NULL,
        keywords TEXT NOT NULL,
        difficulty INTEGER NOT NULL
    )`);

const keywordsFiles = [
    { path: ".\\easy_Keywords.txt", difficulty: 1 },
    { path: ".\\meduim_Keywords.txt", difficulty: 2 },
    { path: ".\\hard_Keywords.txt", difficulty: 3 },
    { path: ".\\random_Keywords.txt", difficulty: 99 },
];
const textToSpeechFiles = [
    { path: ".\\easy.txt", difficulty: 1 },
    { path: ".\\meduim.txt", difficulty: 2 },
    { path: ".\\hard.txt", difficulty: 3 },
];

setTimeout(()=>{
    treatTextToSpeechFiles(textToSpeechFiles);
    treatKeyWordsFiles(keywordsFiles);
}, 1500)

function treatTextToSpeechFiles(ttsFiles) {
    let textObjs = [];
    ttsFiles.forEach((fileDetails) => {
        data = fs.readFileSync(fileDetails.path, "utf8");
        textObjs.push(
            ...data
                .trim()
                .split("\n")
                .map((text) => {
                    let text_ = text.trim().split(":")
                    return {
                        text: text_[0],
                        keywords: text_[1].slice(0, -1),
                        difficulty: fileDetails.difficulty,
                    };
                }).filter(textObj=>{
                    return textObj.text && textObj.keywords && textObj.difficulty
                })
        );
    });
    insertTTSInDB(textObjs);
}

function insertTTSInDB(textObjs) {
    const statement = db.prepare(
        "INSERT INTO TEXT_TO_SPEECH (text, keywords, difficulty) VALUES (?, ?, ?)"
    );
    textObjs.forEach((textObj) => {
        statement.run(textObj.text, textObj.keywords, textObj.difficulty);
    });
    statement.finalize((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`textObjs inserted successfully.`);
        }
    });
}

function treatKeyWordsFiles(keywordsFiles) {
    let keywords = [];
    keywordsFiles.forEach((fileDetails) => {
        data = fs.readFileSync(fileDetails.path, "utf8");
        keywords.push(
            ..._.uniq(
                data
                    .trim()
                    .split("\n")
                    .map((key) => key.trim())
            ).map((key) => {
                return { word: key, difficulty: fileDetails.difficulty };
            })
        );
    });
    keywords = _.uniqBy(keywords, (key) => key.word);
    insertKeywordsInDB(keywords);
}

function insertKeywordsInDB(keywords) {
    const statement = db.prepare(
        "INSERT INTO KEYWORDS (word, difficulty) VALUES (?, ?)"
    );
    keywords.forEach((keyword) => {
        statement.run(keyword.word, keyword.difficulty);
    });
    statement.finalize((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log(`Keywords inserted successfully.`);
        }
    });
}
