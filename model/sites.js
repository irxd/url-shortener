var mongoose = require('mongoose');

var siteSchema = new mongoose.Schema({  
  original: { type : String },
  short: { type : String },
},
{
  timestamps: true
});

var Site = mongoose.model('Site', siteSchema);
module.exports = Site;