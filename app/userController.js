import poolDB from "./configDB.js";

export async function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        poolDB.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
            if (err) { return reject(err); }
            if (result.length === 0) { return resolve(null); }
            if (!result[0]) { return resolve(null); }

            //control the user object for the rest of the app
            return resolve({
                id: result[0].id,
                username: result[0].username,
                hash: result[0].hash,
                role: result[0].role
            });
        });
    });
}

export async function getUserById(id) {
    return new Promise((resolve, reject) => {
        poolDB.query('SELECT * FROM users WHERE id=?', [id], (err, result) => {
            if (err) { return reject(err); }
            if (result.length === 0) { return resolve(null); }
            if (!result[0].id) { return resolve(null); }

            //control the user object for the rest of the app
            return resolve({
                id: result[0].id,
                email: result[0].email,
                hash: result[0].hash,
                role: result[0].role
            });
        });
    });
}

//get all users
export async function getAllUsers() {
    return new Promise((resolve, reject) => {
        poolDB.query('SELECT * FROM users', (err, result) => {
            if (err) { return reject(err); }
            if (result.length === 0) { return resolve(null); }

            //control the user object for the rest of the app
            return resolve(result);
        });
    });
}

//delete a user
export async function deleteUser(id) {
    return new Promise((resolve, reject) => {
        poolDB.query('DELETE FROM users WHERE id=?', [id], (err, result) => {
            if (err) { return reject(err); }
            if (result.length === 0) { return resolve(null); }

            //control the user object for the rest of the app
            return resolve(result);
        });
    });
}

//add a user
export async function addUser(email, hash, role) {
    return new Promise((resolve, reject) => {
        poolDB.query('INSERT INTO users (email, hash, role) VALUES (?, ?, ?)', [email, hash, role], (err, result) => {
            if (err) { return reject(err); }
            if (result.length === 0) { return resolve(null); }

            //control the user object for the rest of the app
            return resolve(result);
        });
    });
}