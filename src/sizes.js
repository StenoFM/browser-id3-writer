export function getNumericFrameSize(frameSize) {
    const headerSize = 10;
    const encodingSize = 1;

    return headerSize +
        encodingSize +
        frameSize;
}

export function getStringFrameSize(frameSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const bomSize = 2;
    const frameUtf16Size = frameSize * 2;

    return headerSize +
        encodingSize +
        bomSize +
        frameUtf16Size;
}

export function getPictureFrameSize(pictureSize, mimeTypeSize, descriptionSize, useUnicodeEncoding) {
    const headerSize = 10;
    const encodingSize = 1;
    const separatorSize = 1;
    const pictureTypeSize = 1;
    const bomSize = 2;
    const encodedDescriptionSize = useUnicodeEncoding ?
        bomSize + (descriptionSize + separatorSize) * 2 :
        descriptionSize + separatorSize;

    return headerSize +
        encodingSize +
        mimeTypeSize +
        separatorSize +
        pictureTypeSize +
        encodedDescriptionSize +
        pictureSize;
}

export function getCommentFrameSize(descriptionSize, textSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const languageSize = 3;
    const bomSize = 2;
    const descriptionUtf16Size = descriptionSize * 2;
    const separatorSize = 2;
    const textUtf16Size = textSize * 2;

    return headerSize +
        encodingSize +
        languageSize +
        bomSize +
        descriptionUtf16Size +
        separatorSize +
        bomSize +
        textUtf16Size;
}

export function getPrivateFrameSize(idSize, dataSize) {
    const headerSize = 10;
    const separatorSize = 1;

    return headerSize +
        idSize +
        separatorSize +
        dataSize;
}

export function getUserStringFrameSize(descriptionSize, valueSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const bomSize = 2;
    const descriptionUtf16Size = descriptionSize * 2;
    const separatorSize = 2;
    const valueUtf16Size = valueSize * 2;

    return headerSize +
        encodingSize +
        bomSize +
        descriptionUtf16Size +
        separatorSize +
        bomSize +
        valueUtf16Size;
}

export function getUrlLinkFrameSize(urlSize) {
    const headerSize = 10;

    return headerSize +
        urlSize;
}

export function getLyricsFrameSize(descriptionSize, lyricsSize) {
    const headerSize = 10;
    const encodingSize = 1;
    const languageSize = 3;
    const bomSize = 2;
    const descriptionUtf16Size = descriptionSize * 2;
    const separatorSize = 2;
    const lyricsUtf16Size = lyricsSize * 2;

    return headerSize +
        encodingSize +
        languageSize +
        bomSize +
        descriptionUtf16Size +
        separatorSize +
        bomSize +
        lyricsUtf16Size;
}

export function getSynchronisedLyricsFrameSize(descriptor, lyrics) {
  const headerSize = 10;
  const encodingSize = 1;
  const languageSize = 3;
  const timestampFormatSize = 1;
  const contentTypeSize = 1;
  const bomSize = 2;
  const separatorSize = 2;
  const timestampSize = 4;
  const descriptorTerminator = 2; //$00 (00)
  const descriptorSize = descriptor.length * 2 + bomSize + descriptorTerminator;
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
    descriptorSize;
  }

export function getChapterFrameSize(idSize, subFrames) {
  const headerSize = 10;
  const requiredFrameSize = (
    idSize + 1 +
    16
  );
  const subFrameSizes = subFrames.map(x => x.size).reduce((acc, cur) => acc + cur, 0);
  return headerSize + requiredFrameSize + subFrameSizes;
}


export function getToCFrameSize(idSize, ids, subFrames) {
  const headerSize = 10;
  const requiredFrameSize = (
    idSize + 1 + // id
    1 + // flags (one byte)
    1 // entry count
  );
  const idsSize = ids.map(x => x.length + 1).reduce((acc, cur) => acc + cur, 0);
  const subFrameSizes = subFrames.map(x => x.size).reduce((acc, cur) => acc + cur, 0);
  return headerSize + requiredFrameSize + idsSize + subFrameSizes;
}