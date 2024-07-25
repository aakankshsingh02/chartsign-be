const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost/chartsign-login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const username = process.argv[2];
const password = process.argv[3];
const email = process.argv[4];
const role = process.argv[5] || 'user'; // Default role to 'user' if not provided

if (!username || !password || !email) {
    console.log('Please provide a username, password, and email');
    process.exit(1);
}

const addUser = async () => {
    try {
        const user = new User({ username, email, role });
        await User.register(user, password);
        console.log(`User ${username} added successfully with email ${email} and role ${role}`);
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

addUser();
