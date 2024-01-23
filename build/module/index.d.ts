import * as defaults from './defaults';
import { DBOptionsType, RootFieldsType, TableNameConvertedType } from './types';
export { defaultSchema, defaultSource } from './api';
export type OptionalResultType<T> = T | undefined | false;
export declare function hasuraCamelize(dbOptions: DBOptionsType, { dry, relations, pattern, pgMaterializedViews, transformTableNames, getRootFieldNames, transformColumnNames, }: {
    dry?: boolean;
    relations?: boolean;
    pattern?: 'invert' | 'default';
    pgMaterializedViews?: boolean;
    transformTableNames?: (name: string, defaultTransformer: typeof defaults.tableNameTransformer) => OptionalResultType<TableNameConvertedType>;
    transformColumnNames?: (name: string, tableName: string, defaultTransformer: typeof defaults.columnNameTransformer) => OptionalResultType<string>;
    getRootFieldNames?: (name: TableNameConvertedType, defaultTransformer: typeof defaults.rootFieldTransformerDefault) => RootFieldsType;
}): Promise<void>;
export default hasuraCamelize;
