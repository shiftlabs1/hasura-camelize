import { RootFieldsType, TableNameConvertedType } from './types';
export declare function tableNameTransformer(name: string): TableNameConvertedType;
export declare function columnNameTransformer(name: string): string;
export declare function rootFieldTransformerDefault({ plural, singular, }: TableNameConvertedType): RootFieldsType;
export declare function rootFieldTransformerInvert({ plural, singular, }: TableNameConvertedType): RootFieldsType;
