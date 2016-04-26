function toBinary(obj) {
	var prevBuffer = null;
	for (var property in obj) {
		var type = typeof(obj[property]);
		//types:s tring,i nt32,d ouble,o bject
		//totalLength - type - keyLength - key - valueLength - value
		if (type == 'string') {
			var length = 4 + 1 + 4 + property.length + 4 + obj[property].length;

			var buffer = new ArrayBuffer(length);
			var dataView = new DataView(buffer);

			var pos = 0;
			dataView.setInt32(pos, length - 4);
			pos += 4
			dataView.setUint8(pos, 's'.charCodeAt(0));
			pos++;
			dataView.setInt32(pos, property.length);
			pos += 4;
			for (var i = 0; i < property.length; i++)
				dataView.setUint8(pos++, property.charCodeAt(i));
			dataView.setInt32(pos, obj[property].length);
			pos += 4;
			for (var i = 0; i < obj[property].length; i++)
				dataView.setUint8(pos++, obj[property].charCodeAt(i));

			if (prevBuffer == null)
				prevBuffer = buffer;
			else
				prevBuffer = mergeBuffer(prevBuffer, buffer);
		} else if (type == "number") {
			var length = 4 + 1 + 4 + property.length + 4;

			var buffer = new ArrayBuffer(length);
			var dataView = new DataView(buffer);

			var pos = 0;
			dataView.setInt32(pos, length - 4);
			pos += 4
			dataView.setUint8(pos, 'n'.charCodeAt(0));
			pos++;
			dataView.setInt32(pos, property.length);
			pos += 4;
			for (var i = 0; i < property.length; i++)
				dataView.setUint8(pos++, property.charCodeAt(i));
			dataView.setFloat32(pos, obj[property]);

			if (prevBuffer == null)
				prevBuffer = buffer;
			else
				prevBuffer = mergeBuffer(prevBuffer, buffer);
		}
	}
	return prevBuffer;
}

function fromBinary(buffer) {
	var dataView = new DataView(buffer);
	var pos = 0;
	var ret = new Object();

	while (pos < buffer.byteLength) {
		var nextLength = dataView.getInt32(0);
		pos += 4;
		var type = String.fromCharCode(dataView.getUint8(pos++));
		var keyLength = dataView.getInt32(5);
		pos += 4;
		var key = "";
		for (var i = 0; i < keyLength; i++) {
			key += String.fromCharCode(dataView.getUint8(pos++));
		}

		if (type == 's') {
			var valueLength = dataView.getInt32(pos);
			pos += 4;
			var value = "";
			for (var i = 0; i < valueLength; i++) {
				value += String.fromCharCode(dataView.getUint8(pos++));
			}
		} else if (type == 'n') {
			value = dataView.getFloat32(pos);
			pos += 4;
		}
		ret[key] = value;
	}

	return ret;
}

function mergeBuffer(prev, next) {
	var tmp = new Uint8Array(prev.byteLength + next.byteLength);
	tmp.set(new Uint8Array(prev), 0);
	tmp.set(new Uint8Array(next), prev.byteLength);
	return tmp.buffer;
}

var obj = {
	x: 1 / 3,
	y: "asdassadasd"
};
for(var i=0;i<2000;i++)
{
	obj[i] = 1 / 3;
}
var buffer = toBinary(obj);
console.log(buffer.byteLength);
console.log(JSON.stringify(obj).length);
console.log(fromBinary(buffer));

module.exports = {
	"toBinary": toBinary
};