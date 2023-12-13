const pgp = require('pg-promise')({});
const dotenv = require('dotenv');
dotenv.config();
const connectionString = process.env.DATABASE_URL;
const db = pgp(connectionString);

function registerUser(gmail, username, pass, callback) {
    db
        .one('SELECT count(*) FROM USERS WHERE username = $1', username, a => +a.count)
        .then(count => {
            if (count > 0) {
                return callback(new Error('Người dùng đã tồn tại'));
            }

            db
                .none('INSERT INTO USERS (username, pass, gmail, role) VALUES (${username}, ${pass}, ${gmail}, ${role})', {
                    username,
                    pass,
                    gmail,
                    role: 'user',
                })
                .then(callback)
                .catch(callback);
        })
        .catch(callback);
    console.log("dang ky thanh cong");
}

function loginUser(username, pass, callback) {
    db
        .query('SELECT * FROM USERS WHERE username = $1 AND pass = $2', [username, pass])
        .then(results => {
            if (results.length > 0) {
                // Trả về user nếu tồn tại
                return callback(null, results[0]);
            } else {
                return callback(null, null); // Trả về null nếu không tìm thấy user
            }
        })
        .catch(callback);
    console.log("login thanh cong");
}

module.exports = {
    registerUser,
    loginUser,
};
