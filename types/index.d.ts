/*!
 * node-mmdb/types/index.d.ts
 * e53e04ac <e53e04ac@gmail.com>
 * MIT License
 */

export namespace MMDB {

    namespace Types {

        type Pointer = number;

        type Utf8String = string;

        type Double = number;

        type Bytes = Buffer;

        type Unsigned16BitInteger = number;

        type Unsigned32BitInteger = number;

        type Map = [DataField, DataField][];

        type Signed32BitInteger = number;

        type Unsigned64BitInteger = Buffer;

        type Unsigned128BitInteger = Buffer;

        type Array = DataField[];

        type DataCacheContainer = Buffer;

        type EndMarker = null;

        type Boolean = boolean;

        type Float = number;

        type Payload = (
            Pointer |
            Utf8String |
            Double |
            Bytes |
            Unsigned16BitInteger |
            Unsigned32BitInteger |
            Map |
            Signed32BitInteger |
            Unsigned64BitInteger |
            Unsigned128BitInteger |
            Array |
            DataCacheContainer |
            EndMarker |
            Boolean |
            Float
        );

        type ControlByte = number;

        type DataType = number;

        type PayloadSize = number;

        type DataField = {
            readonly dataType: DataType;
            readonly payloadSize: PayloadSize;
            readonly payload: Payload;
        };

        type Node = {
            readonly left: number;
            readonly right: number;
        };

        type Metadata = {
            readonly binary_format_major_version: Unsigned16BitInteger;
            readonly binary_format_minor_version: Unsigned16BitInteger;
            readonly build_epoch: Unsigned64BitInteger;
            readonly database_type: Utf8String;
            readonly description: Record<string, Utf8String>;
            readonly ip_version: Unsigned16BitInteger;
            readonly languages: Utf8String[];
            readonly node_count: Unsigned32BitInteger;
            readonly record_size: Unsigned16BitInteger;
        };

        type Data = {
            readonly city: {
                readonly names: Record<string, undefined | Utf8String>;
            };
            readonly continent: {
                readonly code: Utf8String;
                readonly geoname_id: Unsigned32BitInteger;
                readonly names: Record<string, undefined | Utf8String>;
            };
            readonly country: {
                readonly geoname_id: Unsigned32BitInteger;
                readonly is_in_european_union: Boolean;
                readonly iso_code: Utf8String;
                readonly names: Record<string, undefined | Utf8String>;
            };
            readonly location: {
                readonly latitude: Double;
                readonly longitude: Double;
            };
            readonly subdivisions: {
                readonly names: Record<string, undefined | Utf8String>;
            }[];
        };

    }

    namespace Helper {

        type Options = {};

        type _Self = {
            readonly options: {
                (): Options;
            };
            readonly _options: {
                (): unknown;
            };
        };

        type Self = {
            readonly _Helper: {
                (): unknown;
            };
            readonly numbers: {
                (begin: number, end: number, step: number): Generator<number, void, void>;
            };
            readonly expand: {
                (bytes: Buffer, size: number): Buffer;
            };
        };

        type Constructor = {
            (options: Options): Self;
        };

    }

    namespace BufferCurosr {

        type Options = {
            readonly buffer: Buffer;
            readonly position: number;
        };

        type _Self = {
            readonly options: {
                (): Options;
            };
            readonly _options: {
                (): unknown;
            };
        };

        type ReadResult<T> = {
            readonly cursor: Self;
            readonly value: T;
        };

        type Self = {
            readonly _BufferCursor: {
                (): unknown;
            };
            readonly buffer: {
                (): Buffer;
            };
            readonly get: {
                (): number;
            };
            readonly set: {
                (position: number): Self;
            };
            readonly add: {
                (size: number): Self;
            };
            readonly canReadBytes: {
                (size: number): boolean;
            };
            readonly readBytes: {
                (size: number): ReadResult<Buffer>;
            };
            readonly readObject: {
                <T>(size: number, decode: {
                    (bytes: Buffer): T;
                }): ReadResult<T>;
            };
            readonly readMmdbPointer: {
                (payloadSize: Types.PayloadSize, payloadPart: number): ReadResult<Types.Pointer>;
            };
            readonly readMmdbUtf8String: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Utf8String>;
            };
            readonly readMmdbDouble: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Double>;
            };
            readonly readMmdbBytes: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Bytes>;
            };
            readonly readMmdbUnsigned16BitInteger: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Unsigned16BitInteger>;
            };
            readonly readMmdbUnsigned32BitInteger: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Unsigned32BitInteger>;
            };
            readonly readMmdbMap: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Map>;
            };
            readonly readMmdbSigned32BitInteger: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Signed32BitInteger>;
            };
            readonly readMmdbUnsigned64BitInteger: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Unsigned64BitInteger>;
            };
            readonly readMmdbUnsigned128BitInteger: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Unsigned128BitInteger>;
            };
            readonly readMmdbArray: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Array>;
            };
            readonly readMmdbDataCacheContainer: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.DataCacheContainer>;
            };
            readonly readMmdbEndMarker: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.EndMarker>;
            };
            readonly readMmdbBoolean: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Boolean>;
            };
            readonly readMmdbFloat: {
                (payloadSize: Types.PayloadSize): ReadResult<Types.Float>;
            };
            readonly readMmdbControlByte: {
                (): ReadResult<Types.ControlByte>;
            };
            readonly readMmdbDataType: {
                (controlByte: Types.ControlByte): ReadResult<Types.DataType>;
            };
            readonly readMmdbPayloadSize: {
                (controlByte: Types.ControlByte): ReadResult<Types.PayloadSize>;
            };
            readonly readMmdbPayload: {
                (dataType: Types.DataType, payloadSize: Types.PayloadSize): ReadResult<Types.Payload>;
            };
            readonly readMmdbDataField: {
                (): ReadResult<Types.DataField>;
            };
            readonly readMmdbNode: {
                (nodeSize: number): ReadResult<Types.Node>;
            };
        };

        type Constructor = {
            (options: Options): Self;
        };

    }

    namespace MMDB {

        type Options = {
            readonly mmdbFilePath: string;
        };

        type _Self = {
            readonly options: {
                (): Options;
            };
            readonly _options: {
                (): unknown;
            };
            readonly findMmdbMetadataOffset: {
                (buffer: Buffer): number;
            };
            readonly getMmdbDataField: {
                (buffer: Buffer, position: number): Types.DataField;
            };
            readonly decodeMmdbDataField: {
                (buffer: Buffer, dataSectionPosition: number, dataField: Types.DataField): unknown;
            };
            readonly getMmdbNode: {
                (buffer: Buffer, position: number, nodeSize: number): Types.Node;
            };
            readonly getMmdbDataOffset: {
                (buffer: Buffer, nodeSize: number, nodeCount: number, bits: number[]): number;
            };
            readonly bitsFromAddressString: {
                (addressString: string, bitLength: number): undefined | number[];
            };
            buffer: undefined | Buffer;
            parameters: undefined | {
                readonly metadata: Types.Metadata;
                readonly ipVersion: number;
                readonly bitLength: number;
                readonly recordSize: number;
                readonly nodeSize: number;
                readonly nodeCount: number;
                readonly binarySearchTreeSectionSize: number;
                readonly dataSectionPosition: number;
            };
        };

        type Self = {
            readonly _MMDB: {
                (): unknown;
            };
            readonly load: {
                (): Promise<void>;
            };
            readonly lookup: {
                (query: {
                    readonly address: string;
                }): Promise<undefined | Types.Data>;
            };
            readonly unload: {
                (): Promise<void>;
            };
        };

        type Constructor = {
            (options: Options): Self;
        };
    }

}

export type MMDB = MMDB.MMDB.Self;

export const MMDB: MMDB.MMDB.Constructor;
