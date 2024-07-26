const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect(process.env.MONGODB_URI);

const username = process.argv[2];
const password = process.argv[3];
const email = process.argv[4];
const role = process.argv[5] || 'user';
const name = process.argv[6];
const designation = process.argv[7] || '';

if (!username || !password || !email || !name) {
    console.log('Please provide a username, password, email, and name');
    process.exit(1);
}

const addUser = async () => {
    try {
        const user = new User({ username, email, role, name, designation });
        await User.register(user, password);
        console.log(`User ${username} added successfully with email ${email}, role ${role}, name ${name}, and designation ${designation}`);
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

addUser();
