function uuid()
{
	return (new Date()).getTime() + "";
}

uuid();
uuid();
module.exports = uuid;