const bcrypt = require('bcrypt');

const hashPassword = async (rawPassword) => {
    return await bcrypt.hash(rawPassword, 10);
}

const comparePassword = async (rawPassword, dbPassword) => {
    return await bcrypt.compare(rawPassword, dbPassword);
}

module.exports = { hashPassword, comparePassword };