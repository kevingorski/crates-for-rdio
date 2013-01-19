var mongoose = require('mongoose');

var crateSchema = mongoose.Schema({
    ownerKey : String,
    createdAt : { type: Date, 'default': Date.now },
    name : String
  });

crateSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

module.exports = {
  Crate: mongoose.model('Crate', crateSchema)
};