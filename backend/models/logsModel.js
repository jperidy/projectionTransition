const mongoose = require('mongoose');
const logsSchema = mongoose.Schema({
    type: {type: String},
    target: {type: String},
}, {timestamps: true}, {capped: { size: 1000000, max: 100000, autoIndexId: true }});

const Logs = mongoose.model('Logs', logsSchema);

module.exports = Logs;