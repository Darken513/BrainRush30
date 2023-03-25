const _ = require("lodash");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../database.db');
const db_utils = require('../services/database')
const generated_keywDB = require('./generated_k.model')
const k_g_kDB = require('./k_gen_k.model')
const keywBD = require('./keyword.model')

function NbrKeywByDay(day) {
    return Math.floor(0.207 * day + 3.793);
}
function diffcultySelector(day) {
    return Math.round(0.055 * day + 0.645 + Math.random() / 2.5)
}
function getScoreByDay(day) {
    return Math.round((1.897 * day + 38.105) / 5) * 5;
}
//todo : add an update method to update score etc

async function generateKWTest(test_id, day) {
    let newGenKw = await generated_keywDB.createNew(test_id);
    let touse = _.countBy((new Array(NbrKeywByDay(day))).fill(0).map(val => diffcultySelector(day)));
    let keywords = [];
    for (const [day, count] of Object.entries(touse)) {
        const topush = await keywBD.getRandNByDifficulty(count, parseInt(day));
        keywords.push(...topush);
    }
    for (const idx in keywords) {
        let keyword = keywords[idx];
        await k_g_kDB.createNew(keyword.id, newGenKw.lastID);
    }
}
async function generateTTSTest(test_id, day) {

}
exports.getAllGKbyTestId = async (test_id) => {
    let query = ` 
        SELECT * FROM TESTS
            JOIN GENERATED_KEYWORDS gk ON TESTS.id = gk.test_id
                JOIN KEYWORDS_GENERATED_KEYWORDS kgk ON kgk.gk_id = gk.id 
                    JOIN KEYWORDS keyw ON kgk.k_id = keyw.id 
        WHERE TESTS.id = ?
        ORDER BY kgk.id asc;`;
    try {
        let res = await db_utils.getAllSync(db, query, [test_id]);
        const mappedRes = _.map(_.groupBy(res, 'gk_id'), (value, key) => {
            let touse = {
                id: parseInt(key),
                answer: value[0].answer,
                type: 'GK', //make this one an enum
                keywords: value.map(val => _.omit(val, ['day', 'passing_score', 'answer', 'test_id', 'gk_id', 'k_id']))
            }
            return touse
        });
        return mappedRes
    } catch (err) {
        return { error: err.message };
    }
}

exports.createNew = async (day, nbr_genKW, nbr_genTTS, nbr_genTH) => {
    try {
        let toret = {id:-1, tests:[]}
        let passing_score = getScoreByDay(day)
        let newTest = await db_utils.runSync(db, `INSERT INTO TESTS (day, passing_score) VALUES (?,?)`, [day, passing_score]);
        toret.id = newTest.lastID;
        for (let i = 0; i < nbr_genKW; i++) {
            await generateKWTest(newTest.lastID, day);
        }
        for (let i = 0; i < nbr_genTTS; i++) {
            await generateTTSTest(newTest.lastID, day);
        }
        toret.tests.push(...(await exports.getAllGKbyTestId(newTest.lastID)));
        return toret;
    } catch (err) {
        return { error: err.message };
    }
}

exports.createNew(3, 2);