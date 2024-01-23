import { DBOptionsType, MetadataType } from './types';
export declare const defaultSource = "default";
export declare const defaultSchema = "public";
export declare function fetchData({ host, secret, schema, source, agent, }: DBOptionsType): Promise<{
    [s: string]: string[];
}>;
export declare function fetchPGMaterializedViewData({ host, secret, schema, source, agent, }: DBOptionsType): Promise<{
    [s: string]: string[];
}>;
export declare function pushData({ host, secret, schema, source, agent }: DBOptionsType, args: {
    tableName: string;
    customTableName: string;
    customRootFields: {
        [s: string]: string;
    };
    customColumnNames: {
        [s: string]: string;
    };
}): Promise<void>;
export declare function pushRelationshipData({ host, secret, schema, source, agent }: DBOptionsType, args: {
    tableName: string;
    oldName: string;
    newName: string;
}): Promise<void>;
export declare function getMetadata({ host, secret, agent, }: DBOptionsType): Promise<MetadataType>;
