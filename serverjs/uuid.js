module.exports = function uuid()
{
	return (new Date()).getTime() + "";
}