const _ = require("lodash");
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const db_utils = require('../services/database')
const generated_keywDB = require('./generated_k.model')
const generated_tts_thDB = require('./generated_tts_th.model')
const k_g_kDB = require('./k_gen_k.model')
const keywBD = require('./keyword.model')
const ttsBD = require('./TTS.model')

const toleration = 1;

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
    return 1;
}
async function generateTTS_TH_Test(test_id, day, isTH) {
    let randomKeyw = await keywBD.getRandNbr(5 + Math.floor(Math.random() * 3));
    let difficulty = diffcultySelector(day)
    let tts = await ttsBD.getRandByDifficulty(difficulty);
    let allKeyw = tts.keywords.split(',').map(val => val.trim())
    allKeyw.push(...randomKeyw.map(val => val.word))
    let displayedKeywords = _.shuffle(allKeyw).reduce((toret, curr) => {
        toret += toret ? ', ' + curr : curr
        return toret
    }, '')
    await generated_tts_thDB.createNew(test_id, tts.id, displayedKeywords, isTH);
    return 1;
}
exports.getAll_GK_byTestId = async (test_id) => {
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
        console.log(err);
        return { error: err.message };
    }
}
exports.getAll_TTSbased_byTestId = async (test_id, isTH) => {
    let query = ` 
        SELECT *, gtsh.id as gtsh_id FROM TESTS 
            JOIN GENERATED_TTS_TH gtsh ON TESTS.id = gtsh.test_id 
                JOIN TEXT_TO_SPEECH tts ON tts.id = gtsh.TTS_id 
        WHERE TESTS.id = ?`.concat(isTH ? " AND gtsh.isTH = ?;" : '');
    try {
        let res = await db_utils.getAllSync(db, query, [test_id, isTH]);
        const mappedRes = _.map(res, (value) => {
            value.type = value.isTH ? 'TH' : 'TTS';
            value.id = value.gtsh_id;
            return _.omit(value, ['day', 'passing_score', 'isTH', 'gtsh_id', 'test_id']) //todo omit keywords if you dont want the user to get acces to the answer
        });
        return mappedRes
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.createNew = async (day, nbr_genKW, nbr_genTTS, nbr_genTH) => {
    try {
        let toret = { id: -1, tests: [] }
        let passing_score = getScoreByDay(day)
        let newTest = await db_utils.runSync(db, `INSERT INTO TESTS (day, passing_score) VALUES (?,?)`, [day, passing_score]);
        toret.id = newTest.lastID;
        for (let i = 0; i < nbr_genKW; i++) {
            await generateKWTest(newTest.lastID, day);
        }
        for (let i = 0; i < nbr_genTTS; i++) {
            await generateTTS_TH_Test(newTest.lastID, day, false);
        }
        for (let i = 0; i < nbr_genTH; i++) {
            await generateTTS_TH_Test(newTest.lastID, day, true);
        }
        toret.tests.push(...(await exports.getAll_GK_byTestId(newTest.lastID)));
        toret.tests.push(...(await exports.getAll_TTSbased_byTestId(newTest.lastID)));
        return toret;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
exports.getByIdShort = async (id) => {
    const query = `SELECT * FROM TESTS WHERE id = ?`;
    try {
        let row = await db_utils.getSync(db, query, [id]);
        return row ? row : undefined;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
};
exports.getById = async (id) => {
    try {
        let toret = { id, tests: [] }
        let temp = await exports.getByIdShort(id);
        toret.passing_score = temp.passing_score;
        toret.day = temp.day;
        toret.tests.push(...(await exports.getAll_GK_byTestId(id)));
        toret.tests.push(...(await exports.getAll_TTSbased_byTestId(id)));
        toret.tests.forEach((test) => {
            switch (test.type) {
                case "GK":
                    test.score = scoreGK(test, test.answer)
                    break;
                case "TH":
                    test.score = scoreTTS(test, test.answer)
                    break;
                case "TTS":
                    test.score = scoreTTS(test, test.answer)
                    break;
                default:
                    break;
            }
        })
        let userAttempResult = { test_id: id, totalGrade: 0, textToSpeechGrade: 0, generatedKwGrade: 0, textToHideGrade: 0, passing_grade: toret.passing_score }
        userAttempResult.textToSpeechGrade = toret.tests
            .filter(test => test.type == "TTS")
            .reduce((ret, curr) => { ret += curr.score; return ret }, 0) / toret.tests
                .filter(ts => ts.type == 'TTS').length;
        userAttempResult.textToHideGrade = toret.tests
            .filter(test => test.type == "TH")
            .reduce((ret, curr) => { ret += curr.score; return ret }, 0) / toret.tests.
                filter(ts => ts.type == 'TH').length;
        userAttempResult.generatedKwGrade = toret.tests
            .filter(test => test.type == "GK")
            .reduce((ret, curr) => { ret += curr.score; return ret }, 0) / toret.tests.
                filter(ts => ts.type == 'GK').length;
        userAttempResult.totalGrade = Math.round((userAttempResult.textToHideGrade + userAttempResult.textToSpeechGrade + userAttempResult.generatedKwGrade) / toret.tests.length);
        toret.userAttempResult = userAttempResult;
        return toret;
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
function scoreTTS(allTestDetail, answer) {
    let answers = answer.split(',').map(word => word.trim());
    let correctAns = allTestDetail.keywords.split(',').map(word => word.trim());
    let communAns = _.intersection(answers, correctAns);
    let missingAns = correctAns.length - communAns.length;
    let wrongAns = _.difference(answers, correctAns);
    let result = communAns.length - missingAns - (wrongAns.length ? wrongAns.length - toleration : 0);

    return result < 0 ? 0 : Math.round(result / communAns.length * 100);
}
exports.gradeTTS_TH = async (test) => {
    let allTestDetail = await ttsBD.getById(test.TTS_id)
    await ttsBD.updateAnswerById(test.id, test.answer)
    return scoreTTS(allTestDetail, test.answer);
}
function scoreGK(test, answer) {
    let answers = answer.split(',').map(word => word.trim());
    let result = answers.reduce((toret, word, index) => {
        toret += word == test.keywords[index].word ? 1 : 0;
        return toret
    }, 0)
    return result < 0 ? 0 : Math.round(result / answers.length * 100);
}
exports.gradeGK = async (test) => {
    await keywBD.updateAnswerById(test.id, test.answer)
    return scoreGK(test, test.answer);
}
exports.updateScoreById = async (id, score) => {
    try {
        return await db_utils.runSync(
            db,
            `UPDATE USER_ATTEMPTS SET score = ? WHERE test_id = ?`,
            [score, id]
        );
    } catch (err) {
        console.log(err);
        return { error: err.message };
    }
}
