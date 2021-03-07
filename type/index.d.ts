/*!
 * node-mmdb/type/index.d.ts
 * e53e04ac <e53e04ac@gmail.com>
 * MIT License
 */

// TypeScript

type TypeScript = {
    lazy: {
        <T>(value: any): T;
    };
};

// Standards

import fs from 'fs';

type Standards = {
    fs: typeof fs;
};

// Utilities

type Utilities = {
    numbers: {
        (begin: number, end: number, step: number): Generator<number, void, void>;
    };
    expand: {
        (bytes: Buffer, size: number): Buffer;
    };
};

// MMDB Types

type MMDBPointer = number;

type MMDBUtf8String = string;

type MMDBDouble = number;

type MMDBBytes = Buffer;

type MMDBUnsigned16BitInteger = number;

type MMDBUnsigned32BitInteger = number;

type MMDBMap = [MMDBDataField, MMDBDataField][];

type MMDBSigned32BitInteger = number;

type MMDBUnsigned64BitInteger = Buffer;

type MMDBUnsigned128BitInteger = Buffer;

type MMDBArray = MMDBDataField[];

type MMDBDataCacheContainer = Buffer;

type MMDBEndMarker = null;

type MMDBBoolean = boolean;

type MMDBFloat = number;

type MMDBPayload = (
    MMDBPointer |
    MMDBUtf8String |
    MMDBDouble |
    MMDBBytes |
    MMDBUnsigned16BitInteger |
    MMDBUnsigned32BitInteger |
    MMDBMap |
    MMDBSigned32BitInteger |
    MMDBUnsigned64BitInteger |
    MMDBUnsigned128BitInteger |
    MMDBArray |
    MMDBDataCacheContainer |
    MMDBEndMarker |
    MMDBBoolean |
    MMDBFloat
);

type MMDBControlByte = number;

type MMDBDataType = number;

type MMDBPayloadSize = number;

type MMDBDataField = {
    dataType: MMDBDataType;
    payloadSize: MMDBPayloadSize;
    payload: MMDBPayload;
};

type MMDBNode = {
    left: number;
    right: number;
};

type MMDBMetadata = {
    binary_format_major_version: MMDBUnsigned16BitInteger;
    binary_format_minor_version: MMDBUnsigned16BitInteger;
    build_epoch: MMDBUnsigned64BitInteger;
    database_type: MMDBUtf8String;
    description: Record<string, MMDBUtf8String>;
    ip_version: MMDBUnsigned16BitInteger;
    languages: MMDBUtf8String[];
    node_count: MMDBUnsigned32BitInteger;
    record_size: MMDBUnsigned16BitInteger;
};

type MMDBData = {
    city: {
        names: Record<string, undefined | MMDBUtf8String>;
    };
    continent: {
        code: MMDBUtf8String;
        geoname_id: MMDBUnsigned32BitInteger;
        names: Record<string, undefined | MMDBUtf8String>;
    };
    country: {
        geoname_id: MMDBUnsigned32BitInteger;
        is_in_european_union: MMDBBoolean;
        iso_code: MMDBUtf8String;
        names: Record<string, undefined | MMDBUtf8String>;
    };
    location: {
        latitude: MMDBDouble;
        longitude: MMDBDouble;
    };
    subdivisions: {
        names: Record<string, undefined | MMDBUtf8String>;
    }[];
};

// MMDBBufferCursor

type _MMDBBufferCursor = {

};

type MMDBBufferCursorReadResult<T> = {
    cursor: MMDBBufferCursor;
    value: T;
};

type MMDBBufferCursor = {
    buffer: {
        (): Buffer;
    };
    get: {
        (): number;
    };
    set: {
        (position: number): MMDBBufferCursor;
    };
    add: {
        (size: number): MMDBBufferCursor;
    };
    testBytes: {
        (size: number): boolean;
    };
    readBytes: {
        (size: number): MMDBBufferCursorReadResult<Buffer>;
    };
    readObject: {
        <T>(size: number, decode: { (bytes: Buffer): T }): MMDBBufferCursorReadResult<T>;
    };
    readMmdbPointer: {
        (payloadSize: MMDBPayloadSize, payloadPart: number): MMDBBufferCursorReadResult<MMDBPointer>;
    };
    readMmdbUtf8String: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBUtf8String>;
    };
    readMmdbDouble: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBDouble>;
    };
    readMmdbBytes: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBBytes>;
    };
    readMmdbUnsigned16BitInteger: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBUnsigned16BitInteger>;
    };
    readMmdbUnsigned32BitInteger: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBUnsigned32BitInteger>;
    };
    readMmdbMap: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBMap>;
    };
    readMmdbSigned32BitInteger: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBSigned32BitInteger>;
    };
    readMmdbUnsigned64BitInteger: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBUnsigned64BitInteger>;
    };
    readMmdbUnsigned128BitInteger: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBUnsigned128BitInteger>;
    };
    readMmdbArray: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBArray>;
    };
    readMmdbDataCacheContainer: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBDataCacheContainer>;
    };
    readMmdbEndMarker: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBEndMarker>;
    };
    readMmdbBoolean: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBBoolean>;
    };
    readMmdbFloat: {
        (payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBFloat>;
    };
    readMmdbControlByte: {
        (): MMDBBufferCursorReadResult<MMDBControlByte>;
    };
    readMmdbDataType: {
        (controlByte: MMDBControlByte): MMDBBufferCursorReadResult<MMDBDataType>;
    };
    readMmdbPayloadSize: {
        (controlByte: MMDBControlByte): MMDBBufferCursorReadResult<MMDBPayloadSize>;
    };
    readMmdbPayload: {
        (dataType: MMDBDataType, payloadSize: MMDBPayloadSize): MMDBBufferCursorReadResult<MMDBPayload>;
    };
    readMmdbDataField: {
        (): MMDBBufferCursorReadResult<MMDBDataField>;
    };
    readMmdbNode: {
        (nodeSize: number): MMDBBufferCursorReadResult<MMDBNode>;
    };
};

type MMDBBufferCursorConstructorOptions = {
    buffer: Buffer;
    position: number;
};

type MMDBBufferCursorConstructor = {
    (options: MMDBBufferCursorConstructorOptions): MMDBBufferCursor;
};

// MMDB

type _MMDB = {
    findMmdbMetadataOffset: {
        (buffer: Buffer): number;
    };
    getMmdbDataField: {
        (buffer: Buffer, position: number): MMDBDataField;
    };
    decodeMmdbDataField: {
        (buffer: Buffer, dataSectionPosition: number, dataField: MMDBDataField): unknown;
    };
    getMmdbNode: {
        (buffer: Buffer, position: number, nodeSize: number): MMDBNode;
    };
    getMmdbDataOffset: {
        (buffer: Buffer, nodeSize: number, nodeCount: number, bits: number[]): number;
    };
    bitsFromAddressString: {
        (addressString: string, bitLength: number): undefined | number[];
    };
    buffer: undefined | Buffer;
    parameters: undefined | {
        metadata: MMDBMetadata;
        ipVersion: number;
        bitLength: number;
        recordSize: number;
        nodeSize: number;
        nodeCount: number;
        binarySearchTreeSectionSize: number;
        dataSectionPosition: number;
    };
};

type MMDB = {
    load: {
        (): Promise<void>;
    };
    lookup: {
        (query: {
            address: string;
        }): Promise<undefined | MMDBData>;
    };
    unload: {
        (): Promise<void>;
    };
};

type MMDBConstructorOptions = {
    mmdbFilePath: string;
};

type MMDBConstructor = {
    (options: MMDBConstructorOptions): MMDB;
};

export const MMDB: MMDBConstructor;
