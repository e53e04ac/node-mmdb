/*!
 * node-mmdb/src/index.js
 * e53e04ac <e53e04ac@gmail.com>
 * MIT License
 */

'use strict';

const { MMDB } = (() => {

    const { TypeScript } = (() => {

        /** @typedef TypeScript @type {import('../type').TypeScript} */

        /** @type {TypeScript} */
        const TypeScript = {};
        TypeScript.lazy = (value) => {
            return value;
        };
        return { TypeScript };

    })();

    const ts = TypeScript;

    const { Standards } = (() => {

        /** @typedef Standards @type {import('../type').Standards} */

        const fs = require('fs');

        /** @type {Standards} */
        const Standards = {};
        Standards.fs = fs;
        return { Standards };

    })();

    const std = Standards;

    const { Utilities } = (() => {

        /** @typedef Utilities @type {import('../type').Utilities} */

        /** @type {Utilities} */
        const Utilities = {};
        Utilities.numbers = function* (begin, end, step) {
            if (step < 0) {
                throw new Error();
            }
            for (let value = begin; value < end; value += step) {
                yield value;
            }
        };
        Utilities.expand = (bytes, size) => {
            const expandedBytes = Buffer.alloc(size, 0);
            bytes.copy(expandedBytes, size - bytes.length, 0, bytes.length)
            return expandedBytes;
        };
        return { Utilities };

    })();

    const utl = Utilities;

    const { MMDBBufferCursor } = (() => {

        /** @typedef _MMDBBufferCursor @type {import('../type')._MMDBBufferCursor} */
        /** @typedef MMDBBufferCursorConstructorOptions @type {import('../type').MMDBBufferCursorConstructorOptions} */
        /** @typedef MMDBBufferCursor @type {import('../type').MMDBBufferCursor} */
        /** @typedef MMDBBufferCursorConstructor @type {import('../type').MMDBBufferCursorConstructor} */
        /** @typedef MMDBMap @type {import('../type').MMDBMap} */
        /** @typedef MMDBArray @type {import('../type').MMDBArray} */

        /** @type {MMDBBufferCursorConstructor} */
        const MMDBBufferCursor = (options) => {

            /** @type {MMDBBufferCursorConstructorOptions} */
            const _options = {};
            _options.buffer = options.buffer;
            _options.position = options.position;

            /** @type {_MMDBBufferCursor} */
            const _it = {};

            /** @type {MMDBBufferCursor} */
            const it = {};
            it.buffer = () => {
                return _options.buffer;
            };
            it.get = () => {
                return _options.position;
            };
            it.set = (position) => {
                return MMDBBufferCursor({
                    buffer: _options.buffer,
                    position
                });
            };
            it.add = (size) => {
                return MMDBBufferCursor({
                    buffer: _options.buffer,
                    position: _options.position + size
                });
            };
            it.testBytes = (size) => {
                return size >= 0 && _options.position + size <= _options.buffer.length;
            };
            it.readBytes = (size) => {
                if (!it.testBytes(size)) {
                    throw new Error();
                }
                const value = _options.buffer.slice(_options.position, _options.position + size);
                return {
                    cursor: it.add(value.length),
                    value
                };
            };
            it.readObject = (size, decode) => {
                const result = it.readBytes(size);
                return {
                    cursor: result.cursor,
                    value: decode(result.value)
                };
            };
            it.readMmdbPointer = (payloadSize, payloadPart) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(1, (bytes) => bytes.readUIntBE(0, 1) + (payloadPart << 8));
                    }
                    case 1: {
                        return it.readObject(2, (bytes) => bytes.readUIntBE(0, 2) + (payloadPart << 16) + 2048);
                    }
                    case 2: {
                        return it.readObject(3, (bytes) => bytes.readUIntBE(0, 3) + (payloadPart << 24) + 526336);
                    }
                    case 3: {
                        return it.readObject(4, (bytes) => bytes.readUIntBE(0, 4));
                    }
                    default: {
                        throw new Error();
                    }
                }
            };
            it.readMmdbUtf8String = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => '');
                    }
                    default: {
                        return it.readObject(payloadSize, (bytes) => bytes.toString('utf8'));
                    }
                }
            };
            it.readMmdbDouble = (payloadSize) => {
                switch (payloadSize) {
                    case 8: {
                        return it.readObject(payloadSize, (bytes) => bytes.readDoubleBE(0));
                    }
                    default: {
                        throw new Error();
                    }
                }
            };
            it.readMmdbBytes = (payloadSize) => {
                return it.readObject(payloadSize, (bytes) => bytes);
            };
            it.readMmdbUnsigned16BitInteger = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => 0);
                    }
                    default: {
                        return it.readObject(payloadSize, (bytes) => bytes.readUIntBE(0, payloadSize));
                    }
                }
            };
            it.readMmdbUnsigned32BitInteger = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => 0);
                    }
                    default: {
                        return it.readObject(payloadSize, (bytes) => bytes.readUIntBE(0, payloadSize));
                    }
                }
            };
            it.readMmdbMap = (payloadSize) => {
                let cursor = it.add(0);
                /** @type {MMDBMap} */
                const map = [];
                for (const _ of utl.numbers(0, payloadSize, 1)) {
                    const keyReadResult = cursor.readMmdbDataField();
                    const key = keyReadResult.value;
                    const valueReadResult = keyReadResult.cursor.readMmdbDataField();
                    const value = valueReadResult.value;
                    map.push([key, value]);
                    cursor = valueReadResult.cursor;
                }
                return {
                    cursor,
                    value: map
                };
            };
            it.readMmdbSigned32BitInteger = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => 0);
                    }
                    default: {
                        return it.readObject(payloadSize, (bytes) => bytes.readIntBE(0, payloadSize));
                    }
                }
            };
            it.readMmdbUnsigned64BitInteger = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => Buffer.alloc(8, 0));
                    }
                    default: {
                        return it.readObject(payloadSize, (bytes) => utl.expand(bytes, 8));
                    }
                }
            };
            it.readMmdbUnsigned128BitInteger = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => Buffer.alloc(16, 0));
                    }
                    default: {
                        return it.readObject(payloadSize, (bytes) => utl.expand(bytes, 16));
                    }
                }
            };
            it.readMmdbArray = (payloadSize) => {
                let cursor = it.add(0);
                /** @type {MMDBArray} */
                const array = [];
                for (const _ of utl.numbers(0, payloadSize, 1)) {
                    const valueReadResult = cursor.readMmdbDataField();
                    const value = valueReadResult.value;
                    array.push(value);
                    cursor = valueReadResult.cursor;
                }
                return {
                    cursor,
                    value: array
                };
            };
            it.readMmdbDataCacheContainer = (payloadSize) => {
                return it.readObject(payloadSize, (bytes) => bytes);
            };
            it.readMmdbEndMarker = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => null);
                    }
                    default: {
                        throw new Error();
                    }
                }
            };
            it.readMmdbBoolean = (payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return it.readObject(0, () => false);
                    }
                    case 1: {
                        return it.readObject(0, () => true);
                    }
                    default: {
                        throw new Error();
                    }
                }
            };
            it.readMmdbFloat = (payloadSize) => {
                switch (payloadSize) {
                    case 4: {
                        return it.readObject(payloadSize, (bytes) => bytes.readFloatBE(0));
                    }
                    default: {
                        throw new Error();
                    }
                }
            };
            it.readMmdbControlByte = () => {
                return it.readObject(1, (bytes) => bytes.readUIntBE(0, 1));
            };
            it.readMmdbDataType = (controlByte) => {
                const value = ((controlByte >> 5) & 0b00000111);
                switch (value) {
                    case 0: {
                        return it.readObject(1, (bytes) => 7 + bytes.readUIntBE(0, 1));
                    }
                    default: {
                        return it.readObject(0, () => value);
                    }
                }
            };
            it.readMmdbPayloadSize = (controlByte) => {
                const value = (controlByte & 0b00011111);
                switch (value) {
                    case 29: {
                        return it.readObject(1, (bytes) => 29 + bytes.readUIntBE(0, 1));
                    }
                    case 30: {
                        return it.readObject(2, (bytes) => 285 + bytes.readUIntBE(0, 2));
                    }
                    case 31: {
                        return it.readObject(3, (bytes) => 65821 + bytes.readUIntBE(0, 3));
                    }
                    default: {
                        return it.readObject(0, () => value);
                    }
                }
            };
            it.readMmdbPayload = (dateType, payloadSize) => {
                switch (dateType) {
                    case 2: {
                        return it.readMmdbUtf8String(payloadSize);
                    }
                    case 3: {
                        return it.readMmdbDouble(payloadSize);
                    }
                    case 4: {
                        return it.readMmdbBytes(payloadSize);
                    }
                    case 5: {
                        return it.readMmdbUnsigned16BitInteger(payloadSize);
                    }
                    case 6: {
                        return it.readMmdbUnsigned32BitInteger(payloadSize);
                    }
                    case 7: {
                        return it.readMmdbMap(payloadSize);
                    }
                    case 8: {
                        return it.readMmdbSigned32BitInteger(payloadSize);
                    }
                    case 9: {
                        return it.readMmdbUnsigned64BitInteger(payloadSize);
                    }
                    case 10: {
                        return it.readMmdbUnsigned128BitInteger(payloadSize);
                    }
                    case 11: {
                        return it.readMmdbArray(payloadSize);
                    }
                    case 12: {
                        return it.readMmdbDataCacheContainer(payloadSize);
                    }
                    case 13: {
                        return it.readMmdbEndMarker(payloadSize);
                    }
                    case 14: {
                        return it.readMmdbBoolean(payloadSize);
                    }
                    case 15: {
                        return it.readMmdbFloat(payloadSize);
                    }
                    default: {
                        throw new Error();
                    }
                }
            };
            it.readMmdbDataField = () => {
                const controlByteReadResult = it.readMmdbControlByte();
                const controlByte = controlByteReadResult.value;
                const dataTypeReadResult = controlByteReadResult.cursor.readMmdbDataType(controlByte);
                const dataType = dataTypeReadResult.value;
                if (dataType === 1) {
                    const payloadSize = ((controlByte >> 3) & 0b00000011);
                    const payloadPart = (controlByte & 0b00000111);
                    const pointerReadResult = dataTypeReadResult.cursor.readMmdbPointer(payloadSize, payloadPart);
                    const payload = pointerReadResult.value;
                    return {
                        cursor: pointerReadResult.cursor,
                        value: {
                            dataType,
                            payloadSize,
                            payload
                        }
                    };
                } else {
                    const payloadSizeReadResult = dataTypeReadResult.cursor.readMmdbPayloadSize(controlByte);
                    const payloadSize = payloadSizeReadResult.value;
                    const payloadReadResult = payloadSizeReadResult.cursor.readMmdbPayload(dataType, payloadSize);
                    const payload = payloadReadResult.value;
                    return {
                        cursor: payloadReadResult.cursor,
                        value: {
                            dataType,
                            payloadSize,
                            payload
                        }
                    };
                }
            };
            it.readMmdbNode = (nodeSize) => {
                return it.readObject(nodeSize, (bytes) => {
                    if (nodeSize % 2 == 0) {
                        const size = nodeSize / 2;
                        const left = bytes.readUIntBE(0, size);
                        const right = bytes.readUIntBE(size, size);
                        return { left, right };
                    } else {
                        const size = (nodeSize - 1) / 2;
                        const left0 = bytes.readUIntBE(0, size);
                        const left1right1 = bytes.readUInt8(size);
                        const right0 = bytes.readUIntBE(size + 1, size);
                        const left1 = ((left1right1 >> 4) & 0b00001111);
                        const right1 = (left1right1 & 0b00001111);
                        const left = left0 + (left1 << (size * 8));
                        const right = right0 + (right1 << (size * 8));
                        return { left, right };
                    }
                });
            };
            return it;

        };
        return { MMDBBufferCursor };

    })();

    const { MMDB } = (() => {

        /** @typedef _MMDB @type {import('../type')._MMDB} */
        /** @typedef MMDBConstructorOptions @type {import('../type').MMDBConstructorOptions} */
        /** @typedef MMDB @type {import('../type').MMDB} */
        /** @typedef MMDBConstructor @type {import('../type').MMDBConstructor} */
        /** @typedef MMDBArray @type {import('../type').MMDBArray} */
        /** @typedef MMDBMap @type {import('../type').MMDBMap} */
        /** @typedef MMDBMetadata @type {import('../type').MMDBMetadata} */
        /** @typedef MMDBData @type {import('../type').MMDBData} */

        /** @type {MMDBConstructor} */
        const MMDB = (options) => {

            /** @type {MMDBConstructorOptions} */
            const _options = {};
            _options.mmdbFilePath = options.mmdbFilePath;

            /** @type {_MMDB} */
            const _it = {};
            _it.findMmdbMetadataOffset = (buffer) => {
                const sequence = Buffer.from([0xab, 0xcd, 0xef, 0x4d, 0x61, 0x78, 0x4d, 0x69, 0x6e, 0x64, 0x2e, 0x63, 0x6f, 0x6d]);
                const sequencePosition = buffer.lastIndexOf(sequence);
                if (sequencePosition < 0) {
                    return -1;
                }
                const metadataPosition = sequencePosition + sequence.length;
                return metadataPosition;
            };
            _it.getMmdbDataField = (buffer, position) => {
                return MMDBBufferCursor({ buffer, position }).readMmdbDataField().value;
            };
            _it.decodeMmdbDataField = (buffer, dataSectionPosition, dataField) => {
                switch (dataField.dataType) {
                    case 1: {
                        if (dataSectionPosition < 0) {
                            return undefined;
                        } else {
                            const subDataField = _it.getMmdbDataField(buffer, dataSectionPosition + ts.lazy(dataField.payload));
                            const decodedSubDataField = _it.decodeMmdbDataField(buffer, dataSectionPosition, subDataField);
                            return decodedSubDataField;
                        }
                    };
                    case 2: {
                        return dataField.payload;
                    };
                    case 3: {
                        return dataField.payload;
                    };
                    case 4: {
                        return dataField.payload;
                    };
                    case 5: {
                        return dataField.payload;
                    };
                    case 6: {
                        return dataField.payload;
                    };
                    case 7: {
                        /** @type {MMDBMap} */
                        const pairs = ts.lazy(dataField.payload);
                        /** @type {Record<string, unknown>} */
                        const map = {};
                        for (const pair of pairs) {
                            /** @type {string} */
                            const decodedKey = ts.lazy(_it.decodeMmdbDataField(buffer, dataSectionPosition, pair[0]));
                            const decodedValue = _it.decodeMmdbDataField(buffer, dataSectionPosition, pair[1]);
                            map[decodedKey] = decodedValue;
                        }
                        return map;
                    };
                    case 8: {
                        return dataField.payload;
                    };
                    case 9: {
                        return dataField.payload;
                    };
                    case 10: {
                        return dataField.payload;
                    };
                    case 11: {
                        /** @type {MMDBArray} */
                        const values = ts.lazy(dataField.payload);
                        /** @type {unknown[]} */
                        const array = [];
                        for (const value of values) {
                            const decodedValue = _it.decodeMmdbDataField(buffer, dataSectionPosition, value);
                            array.push(decodedValue);
                        }
                        return array;
                    };
                    case 12: {
                        return dataField.payload;
                    };
                    case 13: {
                        return dataField.payload;
                    };
                    case 14: {
                        return dataField.payload;
                    };
                    case 15: {
                        return dataField.payload;
                    };
                    default: {
                        throw new Error();
                    }
                }
            };
            _it.getMmdbNode = (buffer, position, nodeSize) => {
                return MMDBBufferCursor({ buffer, position }).readMmdbNode(nodeSize).value;
            };
            _it.getMmdbDataOffset = (buffer, nodeSize, nodeCount, bits) => {
                let nodePointer = 0;
                for (const bit of bits) {
                    const node = _it.getMmdbNode(buffer, nodePointer * nodeSize, nodeSize);
                    if (bit === 0) {
                        nodePointer = node.left;
                    } else {
                        nodePointer = node.right;
                    }
                    if (nodePointer >= nodeCount) {
                        break;
                    }
                }
                const dataOffset = (nodePointer - nodeCount) - 16;
                return dataOffset;
            };
            _it.bitsFromAddressString = (addressString, bitLength) => {
                {
                    const match = addressString.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
                    if (match != null) {
                        const decimals = match.slice(1).map(_ => parseInt(_));
                        if (decimals.every(_ => _ >= 0 && _ <= 255)) {
                            const bitsString = decimals.map(_ => _.toString(2).padStart(8, '0')).join('').padStart(bitLength, '0');
                            const bits = bitsString.split('').map(_ => parseInt(_));
                            return bits;
                        }
                    }
                }
                return undefined;
            };
            _it.buffer = undefined;

            /** @type {MMDB} */
            const it = {};
            it.load = async () => {
                _it.buffer = await std.fs.promises.readFile(_options.mmdbFilePath);
                const metadataPosition = _it.findMmdbMetadataOffset(_it.buffer);
                const metadataDataField = _it.getMmdbDataField(_it.buffer, metadataPosition);
                /** @type {MMDBMetadata} */
                const metadata = ts.lazy(_it.decodeMmdbDataField(_it.buffer, -1, metadataDataField));
                const ipVersion = metadata.ip_version;
                const bitLength = (() => {
                    switch (ipVersion) {
                        case 4: {
                            return 4 * 8;
                        }
                        case 6: {
                            return 16 * 8;
                        }
                        default: {
                            throw new Error();
                        }
                    }
                })();
                const recordSize = metadata.record_size;
                const nodeSize = (recordSize * 2) / 8;
                const nodeCount = metadata.node_count;
                const binarySearchTreeSectionSize = nodeSize * nodeCount;
                const dataSectionPosition = binarySearchTreeSectionSize + 16;
                _it.parameters = {
                    metadata,
                    ipVersion,
                    bitLength,
                    recordSize,
                    nodeSize,
                    nodeCount,
                    binarySearchTreeSectionSize,
                    dataSectionPosition
                };
            };
            it.lookup = async (query) => {
                if (_it.buffer == null || _it.parameters == null) {
                    throw new Error();
                }
                const { bitLength, nodeSize, nodeCount, dataSectionPosition } = _it.parameters;
                const bits = _it.bitsFromAddressString(query.address, bitLength);
                if (bits == null) {
                    return undefined;
                }
                const dataOffset = _it.getMmdbDataOffset(_it.buffer, nodeSize, nodeCount, bits);
                if (dataOffset < 0) {
                    return undefined;
                }
                const dataPosition = dataSectionPosition + dataOffset;
                const dataDataField = _it.getMmdbDataField(_it.buffer, dataPosition);
                /** @type {MMDBData} */
                const data = ts.lazy(_it.decodeMmdbDataField(_it.buffer, dataSectionPosition, dataDataField));
                return data;
            };
            it.unload = async () => {
                _it.buffer = undefined;
                _it.parameters = undefined;
            };
            return it;

        };
        return { MMDB };

    })();

    return { MMDB };

})();

module.exports = { MMDB };
