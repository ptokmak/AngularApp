var mongoose = require('mongoose');

var empSchema = mongoose.Schema({
    name: String,
    position: String,
    salary:String,    
    phone: String,
    empSince:String,
    address: String
});

var Employee = mongoose.model('Employee', empSchema);

module.exports = Employee;