const {model, Schema} = require('mongoose');

const schema = new Schema({
    isShowBaner: {type: Boolean, required: true},
    cursUsd: {type: Number, required: true},
});

module.exports = model('Management', schema);