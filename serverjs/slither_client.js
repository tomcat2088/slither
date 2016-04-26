var uuid = require("./uuid.js");
module.exports = function SlitherClient()
{
	var self = this;
	self.uid = uuid();

	self.onmessage = function(message)
	{

	}
}