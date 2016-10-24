var kFile = function() {

    this.content = "";

};
module.exports = kFile;



kFile.prototype.read = function() {

    return this.content + '\0';

};
