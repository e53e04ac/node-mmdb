/*!
 * node-mmdb/src/index.js
 * e53e04ac <e53e04ac@gmail.com>
 * MIT License
 */

'use strict';

const { Helper } = (() => {

    /** @typedef {import('..').MMDB.Helper._Self} _Self */
    /** @typedef {import('..').MMDB.Helper.Self} Self */
    /** @typedef {import('..').MMDB.Helper.Constructor} Constructor */

    /** @type {Constructor} */
    const constructor = ((options) => {

        const _options = ({});

        /** @type {_Self} */
        const _self = ({
            options: (() => {
                return options;
            }),
            _options: (() => {
                return _options;
            }),
        });

        /** @type {Self} */
        const self = ({
            _Helper: (() => {
                return _self;
            }),
            numbers: (function* (begin, end, step) {
                if (step < 0) {
                    throw new Error();
                }
                for (let value = begin; value < end; value += step) {
                    yield value;
                }
            }),
            expand: ((bytes, size) => {
                const expandedBytes = Buffer.alloc(size, 0);
                bytes.copy(expandedBytes, size - bytes.length, 0, bytes.length);
                return expandedBytes;
            }),
        });

        return self;

    });

    return { Helper: constructor };

})();

const { BufferCursor } = (() => {

    /** @typedef {import('..').MMDB.Types.Array} MMDBArray */
    /** @typedef {import('..').MMDB.Types.Map} MMDBMap */

    /** @typedef {import('..').MMDB.BufferCurosr._Self} _Self */
    /** @typedef {import('..').MMDB.BufferCurosr.Self} Self */
    /** @typedef {import('..').MMDB.BufferCurosr.Constructor} Constructor */

    const helper = Helper({});

    /** @type {Constructor} */
    const constructor = ((options) => {

        const _options = ({
            buffer: options.buffer,
            position: options.position,
        });

        /** @type {_Self} */
        const _self = ({
            options: (() => {
                return options;
            }),
            _options: (() => {
                return _options;
            }),
        });

        /** @type {Self} */
        const self = ({
            _BufferCursor: (() => {
                return _self;
            }),
            buffer: (() => {
                return _options.buffer;
            }),
            get: (() => {
                return _options.position;
            }),
            set: ((position) => {
                return constructor({
                    buffer: _options.buffer,
                    position,
                });
            }),
            add: ((size) => {
                return constructor({
                    buffer: _options.buffer,
                    position: _options.position + size,
                });
            }),
            canReadBytes: ((size) => {
                return size >= 0 && _options.position + size <= _options.buffer.length;
            }),
            readBytes: ((size) => {
                if (!self.canReadBytes(size)) {
                    throw new Error();
                }
                const value = _options.buffer.slice(_options.position, _options.position + size);
                return {
                    cursor: self.add(value.length),
                    value,
                };
            }),
            readObject: ((size, decode) => {
                const result = self.readBytes(size);
                return {
                    cursor: result.cursor,
                    value: decode(result.value),
                };
            }),
            readMmdbPointer: ((payloadSize, payloadPart) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(1, (bytes) => {
                            return bytes.readUIntBE(0, 1) + (payloadPart << 8);
                        });
                    }
                    case 1: {
                        return self.readObject(2, (bytes) => {
                            return bytes.readUIntBE(0, 2) + (payloadPart << 16) + 2048;
                        });
                    }
                    case 2: {
                        return self.readObject(3, (bytes) => {
                            return bytes.readUIntBE(0, 3) + (payloadPart << 24) + 526336;
                        });
                    }
                    case 3: {
                        return self.readObject(4, (bytes) => {
                            return bytes.readUIntBE(0, 4);
                        });
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            readMmdbUtf8String: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return '';
                        });
                    }
                    default: {
                        return self.readObject(payloadSize, (bytes) => {
                            return bytes.toString('utf8');
                        });
                    }
                }
            }),
            readMmdbDouble: ((payloadSize) => {
                switch (payloadSize) {
                    case 8: {
                        return self.readObject(payloadSize, (bytes) => {
                            return bytes.readDoubleBE(0);
                        });
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            readMmdbBytes: ((payloadSize) => {
                return self.readObject(payloadSize, (bytes) => {
                    return bytes;
                });
            }),
            readMmdbUnsigned16BitInteger: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return 0;
                        });
                    }
                    default: {
                        return self.readObject(payloadSize, (bytes) => {
                            return bytes.readUIntBE(0, payloadSize);
                        });
                    }
                }
            }),
            readMmdbUnsigned32BitInteger: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return 0;
                        });
                    }
                    default: {
                        return self.readObject(payloadSize, (bytes) => {
                            return bytes.readUIntBE(0, payloadSize);
                        });
                    }
                }
            }),
            readMmdbMap: ((payloadSize) => {
                let cursor = self.add(0);
                /** @type {MMDBMap} */
                const map = [];
                for (const _ of helper.numbers(0, payloadSize, 1)) {
                    const keyReadResult = cursor.readMmdbDataField();
                    const key = keyReadResult.value;
                    const valueReadResult = keyReadResult.cursor.readMmdbDataField();
                    const value = valueReadResult.value;
                    map.push([key, value]);
                    cursor = valueReadResult.cursor;
                }
                return {
                    cursor,
                    value: map,
                };
            }),
            readMmdbSigned32BitInteger: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return 0;
                        });
                    }
                    default: {
                        return self.readObject(payloadSize, (bytes) => {
                            return bytes.readIntBE(0, payloadSize);
                        });
                    }
                }
            }),
            readMmdbUnsigned64BitInteger: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return Buffer.alloc(8, 0);
                        });
                    }
                    default: {
                        return self.readObject(payloadSize, (bytes) => {
                            return helper.expand(bytes, 8);
                        });
                    }
                }
            }),
            readMmdbUnsigned128BitInteger: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return Buffer.alloc(16, 0);
                        });
                    }
                    default: {
                        return self.readObject(payloadSize, (bytes) => {
                            return helper.expand(bytes, 16);
                        });
                    }
                }
            }),
            readMmdbArray: ((payloadSize) => {
                let cursor = self.add(0);
                /** @type {MMDBArray} */
                const array = [];
                for (const _ of helper.numbers(0, payloadSize, 1)) {
                    const valueReadResult = cursor.readMmdbDataField();
                    const value = valueReadResult.value;
                    array.push(value);
                    cursor = valueReadResult.cursor;
                }
                return {
                    cursor,
                    value: array,
                };
            }),
            readMmdbDataCacheContainer: ((payloadSize) => {
                return self.readObject(payloadSize, (bytes) => {
                    return bytes;
                });
            }),
            readMmdbEndMarker: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return null;
                        });
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            readMmdbBoolean: ((payloadSize) => {
                switch (payloadSize) {
                    case 0: {
                        return self.readObject(0, () => {
                            return false;
                        });
                    }
                    case 1: {
                        return self.readObject(0, () => {
                            return true;
                        });
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            readMmdbFloat: ((payloadSize) => {
                switch (payloadSize) {
                    case 4: {
                        return self.readObject(payloadSize, (bytes) => {
                            return bytes.readFloatBE(0);
                        });
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            readMmdbControlByte: (() => {
                return self.readObject(1, (bytes) => {
                    return bytes.readUIntBE(0, 1);
                });
            }),
            readMmdbDataType: ((controlByte) => {
                const value = ((controlByte >> 5) & 0b0000_0111);
                switch (value) {
                    case 0: {
                        return self.readObject(1, (bytes) => {
                            return 7 + bytes.readUIntBE(0, 1);
                        });
                    }
                    default: {
                        return self.readObject(0, () => {
                            return value;
                        });
                    }
                }
            }),
            readMmdbPayloadSize: ((controlByte) => {
                const value = (controlByte & 0b0001_1111);
                switch (value) {
                    case 29: {
                        return self.readObject(1, (bytes) => {
                            return 29 + bytes.readUIntBE(0, 1);
                        });
                    }
                    case 30: {
                        return self.readObject(2, (bytes) => {
                            return 285 + bytes.readUIntBE(0, 2);
                        });
                    }
                    case 31: {
                        return self.readObject(3, (bytes) => {
                            return 65821 + bytes.readUIntBE(0, 3);
                        });
                    }
                    default: {
                        return self.readObject(0, () => {
                            return value;
                        });
                    }
                }
            }),
            readMmdbPayload: ((dateType, payloadSize) => {
                switch (dateType) {
                    case 2: {
                        return self.readMmdbUtf8String(payloadSize);
                    }
                    case 3: {
                        return self.readMmdbDouble(payloadSize);
                    }
                    case 4: {
                        return self.readMmdbBytes(payloadSize);
                    }
                    case 5: {
                        return self.readMmdbUnsigned16BitInteger(payloadSize);
                    }
                    case 6: {
                        return self.readMmdbUnsigned32BitInteger(payloadSize);
                    }
                    case 7: {
                        return self.readMmdbMap(payloadSize);
                    }
                    case 8: {
                        return self.readMmdbSigned32BitInteger(payloadSize);
                    }
                    case 9: {
                        return self.readMmdbUnsigned64BitInteger(payloadSize);
                    }
                    case 10: {
                        return self.readMmdbUnsigned128BitInteger(payloadSize);
                    }
                    case 11: {
                        return self.readMmdbArray(payloadSize);
                    }
                    case 12: {
                        return self.readMmdbDataCacheContainer(payloadSize);
                    }
                    case 13: {
                        return self.readMmdbEndMarker(payloadSize);
                    }
                    case 14: {
                        return self.readMmdbBoolean(payloadSize);
                    }
                    case 15: {
                        return self.readMmdbFloat(payloadSize);
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            readMmdbDataField: (() => {
                const controlByteReadResult = self.readMmdbControlByte();
                const controlByte = controlByteReadResult.value;
                const dataTypeReadResult = controlByteReadResult.cursor.readMmdbDataType(controlByte);
                const dataType = dataTypeReadResult.value;
                if (dataType === 1) {
                    const payloadSize = ((controlByte >> 3) & 0b0000_0011);
                    const payloadPart = (controlByte & 0b0000_0111);
                    const pointerReadResult = dataTypeReadResult.cursor.readMmdbPointer(payloadSize, payloadPart);
                    const payload = pointerReadResult.value;
                    return {
                        cursor: pointerReadResult.cursor,
                        value: {
                            dataType,
                            payloadSize,
                            payload,
                        },
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
                            payload,
                        },
                    };
                }
            }),
            readMmdbNode: ((nodeSize) => {
                return self.readObject(nodeSize, (bytes) => {
                    if (nodeSize % 2 == 0) {
                        const size = nodeSize / 2;
                        const left = bytes.readUIntBE(0, size);
                        const right = bytes.readUIntBE(size, size);
                        return {
                            left,
                            right,
                        };
                    } else {
                        const size = (nodeSize - 1) / 2;
                        const left0 = bytes.readUIntBE(0, size);
                        const left1right1 = bytes.readUInt8(size);
                        const right0 = bytes.readUIntBE(size + 1, size);
                        const left1 = ((left1right1 >> 4) & 0b0000_1111);
                        const right1 = (left1right1 & 0b0000_1111);
                        const left = left0 + (left1 << (size * 8));
                        const right = right0 + (right1 << (size * 8));
                        return {
                            left,
                            right,
                        };
                    }
                });
            }),
        });

        return self;

    });

    return { BufferCursor: constructor };

})();

const { MMDB } = (() => {

    /** @typedef {import('..').MMDB.Types.Array} MMDBArray */
    /** @typedef {import('..').MMDB.Types.Data} MMDBData */
    /** @typedef {import('..').MMDB.Types.Map} MMDBMap */
    /** @typedef {import('..').MMDB.Types.Metadata} MMDBMetadata */

    /** @typedef {import('..').MMDB.MMDB._Self} _Self */
    /** @typedef {import('..').MMDB.MMDB.Self} Self */
    /** @typedef {import('..').MMDB.MMDB.Constructor} Constructor */

    const fs = require('fs');

    /** @type {{ <T>(value: any): T; }} */
    const __cast__ = (value) => value;

    /** @type {Constructor} */
    const constructor = ((options) => {

        const _options = ({
            mmdbFilePath: options.mmdbFilePath,
        });

        /** @type {_Self} */
        const _self = ({
            options: (() => {
                return options;
            }),
            _options: (() => {
                return _options;
            }),
            findMmdbMetadataOffset: ((buffer) => {
                const sequence = Buffer.from([0xab, 0xcd, 0xef, 0x4d, 0x61, 0x78, 0x4d, 0x69, 0x6e, 0x64, 0x2e, 0x63, 0x6f, 0x6d]);
                const sequencePosition = buffer.lastIndexOf(sequence);
                if (sequencePosition < 0) {
                    return -1;
                }
                const metadataPosition = sequencePosition + sequence.length;
                return metadataPosition;
            }),
            getMmdbDataField: ((buffer, position) => {
                return BufferCursor({ buffer, position }).readMmdbDataField().value;
            }),
            decodeMmdbDataField: ((buffer, dataSectionPosition, dataField) => {
                switch (dataField.dataType) {
                    case 1: {
                        if (dataSectionPosition < 0) {
                            return undefined;
                        } else {
                            const subDataField = _self.getMmdbDataField(buffer, dataSectionPosition + __cast__(dataField.payload));
                            const decodedSubDataField = _self.decodeMmdbDataField(buffer, dataSectionPosition, subDataField);
                            return decodedSubDataField;
                        }
                    }
                    case 2: {
                        return dataField.payload;
                    }
                    case 3: {
                        return dataField.payload;
                    }
                    case 4: {
                        return dataField.payload;
                    }
                    case 5: {
                        return dataField.payload;
                    }
                    case 6: {
                        return dataField.payload;
                    }
                    case 7: {
                        /** @type {MMDBMap} */
                        const pairs = __cast__(dataField.payload);
                        /** @type {Record<string, unknown>} */
                        const map = {};
                        for (const pair of pairs) {
                            /** @type {string} */
                            const decodedKey = __cast__(_self.decodeMmdbDataField(buffer, dataSectionPosition, pair[0]));
                            const decodedValue = _self.decodeMmdbDataField(buffer, dataSectionPosition, pair[1]);
                            map[decodedKey] = decodedValue;
                        }
                        return map;
                    }
                    case 8: {
                        return dataField.payload;
                    }
                    case 9: {
                        return dataField.payload;
                    }
                    case 10: {
                        return dataField.payload;
                    }
                    case 11: {
                        /** @type {MMDBArray} */
                        const values = __cast__(dataField.payload);
                        /** @type {unknown[]} */
                        const array = [];
                        for (const value of values) {
                            const decodedValue = _self.decodeMmdbDataField(buffer, dataSectionPosition, value);
                            array.push(decodedValue);
                        }
                        return array;
                    }
                    case 12: {
                        return dataField.payload;
                    }
                    case 13: {
                        return dataField.payload;
                    }
                    case 14: {
                        return dataField.payload;
                    }
                    case 15: {
                        return dataField.payload;
                    }
                    default: {
                        throw new Error();
                    }
                }
            }),
            getMmdbNode: ((buffer, position, nodeSize) => {
                return BufferCursor({ buffer, position }).readMmdbNode(nodeSize).value;
            }),
            getMmdbDataOffset: ((buffer, nodeSize, nodeCount, bits) => {
                let nodePointer = 0;
                for (const bit of bits) {
                    const node = _self.getMmdbNode(buffer, nodePointer * nodeSize, nodeSize);
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
            }),
            bitsFromAddressString: ((addressString, bitLength) => {
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
            }),
            buffer: undefined,
            parameters: undefined,
        });

        /** @type {Self} */
        const self = ({
            _MMDB: (() => {
                return _self;
            }),
            load: (async () => {
                _self.buffer = await fs.promises.readFile(_options.mmdbFilePath);
                const metadataPosition = _self.findMmdbMetadataOffset(_self.buffer);
                const metadataDataField = _self.getMmdbDataField(_self.buffer, metadataPosition);
                /** @type {MMDBMetadata} */
                const metadata = __cast__(_self.decodeMmdbDataField(_self.buffer, -1, metadataDataField));
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
                _self.parameters = {
                    metadata,
                    ipVersion,
                    bitLength,
                    recordSize,
                    nodeSize,
                    nodeCount,
                    binarySearchTreeSectionSize,
                    dataSectionPosition,
                };
            }),
            lookup: (async (query) => {
                if (_self.buffer == null || _self.parameters == null) {
                    throw new Error();
                }
                const { bitLength, nodeSize, nodeCount, dataSectionPosition } = _self.parameters;
                const bits = _self.bitsFromAddressString(query.address, bitLength);
                if (bits == null) {
                    return undefined;
                }
                const dataOffset = _self.getMmdbDataOffset(_self.buffer, nodeSize, nodeCount, bits);
                if (dataOffset < 0) {
                    return undefined;
                }
                const dataPosition = dataSectionPosition + dataOffset;
                const dataDataField = _self.getMmdbDataField(_self.buffer, dataPosition);
                /** @type {MMDBData} */
                const data = __cast__(_self.decodeMmdbDataField(_self.buffer, dataSectionPosition, dataDataField));
                return data;
            }),
            unload: (async () => {
                _self.buffer = undefined;
                _self.parameters = undefined;
            }),
        });

        return self;

    });

    return { MMDB: constructor };

})();

module.exports = { MMDB };
