module.exports = function(arg) {
	return !(arg === undefined || arg === null || !Object.keys(arg).length);
};
