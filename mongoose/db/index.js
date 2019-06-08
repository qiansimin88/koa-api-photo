const mongoose = require('mongoose');

process.on('SIGINT', () => {
    closeMongo();
    process.exit(1);
})

function collectMongo () {
    mongoose.connect('mongodb://127.0.0.1:27017/photo', { useNewUrlParser: true });
    const db = mongoose.connection;
    db.on('error', ( err ) => {
        console.error('Unable to connect to the database:', err);
    });
    db.on('open', () => {
        console.log('Connection has been successfully.');
    });
}

async function closeMongo () {
    await mongoose.connection.close();
}

module.exports = {
    collectMongo,
    closeMongo
}