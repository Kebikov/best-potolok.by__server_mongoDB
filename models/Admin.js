const {model, Schema} = require('mongoose');

const schema = new Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

module.exports = model('Admin', schema);