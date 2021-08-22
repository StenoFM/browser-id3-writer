function uint32ToUint8Array(uint32) {
	const eightBitMask = 0xff;

	return [
			(uint32 >>> 24) & eightBitMask,
			(uint32 >>> 16) & eightBitMask,
			(uint32 >>> 8) & eightBitMask,
			uint32 & eightBitMask,
	];
}

function uint28ToUint7Array(uint28) {
	const sevenBitMask = 0x7f;

	return [
			(uint28 >>> 21) & sevenBitMask,
			(uint28 >>> 14) & sevenBitMask,
			(uint28 >>> 7) & sevenBitMask,
			uint28 & sevenBitMask,
	];
}

function uint7ArrayToUint28(uint7Array) {
	return (uint7Array[0] << 21) + (uint7Array[1] << 14) + (uint7Array[2] << 7) + uint7Array[3];
}

function strToCodePoints(str) {
	return String(str).split('').map((c) => c.charCodeAt(0));
}

function encodeWindows1252(str) {
	return new Uint8Array(strToCodePoints(str));
}

function encodeUtf16le(str) {
	const output = new Uint8Array(str.length * 2);
	new Uint16Array(output.buffer).set(strToCodePoints(str));

	return output;
}

const getSynchronisedLyricsFrameSize = (lyrics) => {

	const headerSize = 10;
	const encodingSize = 1;
	const languageSize = 3;
	const timestampFormatSize = 1;
	const contentTypeSize = 1;
	const bomSize = 2;
	const separatorSize = 1;
	const timestampSize = 2;
	const finalSeparator = 1;
	let encodedLyricsSize = 0;
	lyrics.forEach((line) => {
		encodedLyricsSize += bomSize + (line[0].length*2) + separatorSize + timestampSize;
	});
	return headerSize +
		encodingSize +
		languageSize +
		timestampFormatSize +
		contentTypeSize +
		encodedLyricsSize +
		finalSeparator;
}

const writeSylt = (frame, size) => {
	const BOM = [0xff, 0xfe];
	const headerSize = 10;
	// const totalFrameSize = this.frames.reduce((sum, frame) => sum + frame.size, 0);
	// const buffer = new ArrayBuffer(this.arrayBuffer.byteLength + totalTagSize);
	const bufferWriter = new Uint8Array(size);

	let offset = 0;
	let writeBytes = [];

	writeBytes = [].concat(BOM); // BOM
	bufferWriter.set(writeBytes, offset);
	offset += writeBytes.length;

	console.info('wrote BOM:');
	console.info(writeBytes.length)

	writeBytes = encodeUtf16le('interesting line'); // lyric line
	bufferWriter.set(writeBytes, offset);
	offset += writeBytes.length;

	//Utf16 => 2x

	console.info('wrote utf16:');
	console.info(offset - 2)

	writeBytes = [0]; // separator
	bufferWriter.set(writeBytes, offset);
	offset += writeBytes.length;

	console.info('wrote separator:');
	console.info(writeBytes.length)

	//is this part really working?
	writeBytes = [0, 1]; // timestamp
	bufferWriter.set(writeBytes, offset);
	offset += writeBytes.length;

	// writeBytes = [0x49, 0x44, 0x33, 3]; // ID3 tag and version
	// bufferWriter.set(writeBytes, offset);
	// offset += writeBytes.length;

	// offset++; // version revision
	// offset++; // flags

	// writeBytes = uint28ToUint7Array(totalTagSize - headerSize); // tag size (without header)
	// bufferWriter.set(writeBytes, offset);
	// offset += writeBytes.length;

	// frame.value.forEach((line) => {

		
	// 		// let temp;
	// 		// writeBytes = [];

	// 	writeBytes = [].concat(BOM); // BOM
	// 	bufferWriter.set(writeBytes, offset);
	// 	offset += writeBytes.length;

	// 	writeBytes = encodeUtf16le(line[0].toString()); // lyric line
	// 	bufferWriter.set(writeBytes, offset);
	// 	offset += writeBytes.length;

	// 	writeBytes = [0]; // separator
	// 	bufferWriter.set(writeBytes, offset);
	// 	offset += writeBytes.length;

	// 	//is this part really working?
	// 	writeBytes = [0, 1]; // timestamp
	// 	bufferWriter.set(writeBytes, offset);
	// 	offset += writeBytes.length;
	// });
	// //what should I use as a separator?
	// writeBytes = [0]; // separator
	// bufferWriter.set(writeBytes, offset);
	// offset += writeBytes.length;

}


const testSylt = () => {
	const frame = {
		type: 1,
		text: [
			['hello 1', 0],
			['hello 2', 3500],
			['hello 3', 5500],
			['hello 4', 7500],
			['hello 5', 11500],
			['hello 6', 13500],
			['hello 7', 15500],
			['hello 8', 17500],
			['hello 9', 19500],
			['hello 10', 21500],
		],
		timestampFormat: 2,
		language: 'eng'
	}

	const size = getSynchronisedLyricsFrameSize(frame.text);

	console.info('size got:');
	console.info(size);
	writeSylt(frame, size)

}

testSylt()