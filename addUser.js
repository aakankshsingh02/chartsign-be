const mongoose = require('mongoose');
const User = require('./models/user');

mongoose.connect('mongodb://localhost/chartsign-login', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const username = process.argv[2];
const password = process.argv[3];

if (!username || !password) {
    console.log('Please provide a username and password');
    process.exit(1);
}

const addUser = async () => {
    try {
        const user = new User({ username });
        await User.register(user, password);
        console.log(`User ${username} added successfully`);
    } catch (error) {
        console.error(error);
    } finally {
        mongoose.connection.close();
    }
};

addUser();