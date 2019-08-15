const Manager = function() {

	this.status = false;
}

Manager.prototype.start = function() {
	if (this.status) return false;
	this.status = true;

	return true;
}

Manager.prototype.stop = function() {
	if (!this.status) return false;
	this.status = false;

	return true;
}

module.exports = Manager;