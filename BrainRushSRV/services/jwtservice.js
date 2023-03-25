const jwt = require("jsonwebtoken");

exports.verifySync = function (token) {
    if(token.startsWith('Bearer '))
        token = token.substr(7,token.length)
    return new Promise((resolve, reject) => {
        jwt.verify(token, 'AphatrackLongKeyHere!!', (error, decodedToken) => {
            if (error) {
                reject(error);
            } else {
              const decodedData = jwt.decode(token);
              resolve(decodedData);
            }
        });
    });
};
