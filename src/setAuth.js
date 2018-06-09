module.exports = function(user) {
	localStorage.setItem("auth", JSON.stringify(user));
};
