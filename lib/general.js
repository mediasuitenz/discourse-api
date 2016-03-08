exports = module.exports = function(Discourse) {

  "use strict";

  Discourse.prototype.getLatest = function getLatest (callback) {
    this.get('latest.json', {}, callback)
  };

  Discourse.prototype.getTop = function getTop (callback) {
    this.get('top.json', {}, callback)
  };
};
