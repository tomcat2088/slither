function toBinary(obj)
{
	for(var property in obj)
	{
		var type = typeof(obj[property]);
		if( type == 'string')
		{
			var length = 4 + property.length +  obj[property].length;
			var buffer = new ArrayBuffer(length);
			var dataView = new DataView(buffer);

			dataView.setInt32(length - 4);
			dataView.setUint8(length - 4);

		}
	}
}