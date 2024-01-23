"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasuraCamelize = exports.defaultSource = exports.defaultSchema = void 0;
const api = __importStar(require("./api"));
const defaults = __importStar(require("./defaults"));
var api_1 = require("./api");
Object.defineProperty(exports, "defaultSchema", { enumerable: true, get: function () { return api_1.defaultSchema; } });
Object.defineProperty(exports, "defaultSource", { enumerable: true, get: function () { return api_1.defaultSource; } });
async function hasuraCamelize(dbOptions, { dry = false, relations = false, pattern = 'default', pgMaterializedViews = false, transformTableNames = defaults.tableNameTransformer, getRootFieldNames, transformColumnNames = defaults.columnNameTransformer, }) {
    const defaultRootFieldNames = pattern === 'invert'
        ? defaults.rootFieldTransformerInvert
        : defaults.rootFieldTransformerDefault;
    if (!getRootFieldNames)
        getRootFieldNames = defaultRootFieldNames;
    if (!dbOptions.host)
        throw new Error('No host provided');
    console.log('--- Settings ---');
    for (const key in dbOptions) {
        let value = dbOptions[key] || '<none>';
        if (key === 'secret' && dbOptions[key])
            value = '<secret>';
        console.log(`${key}: ${value}`);
    }
    console.log(`dry: ${dry}`);
    console.log(`relations: ${dry}`);
    console.log('\n--- Starting ---');
    const meta = await api.getMetadata(dbOptions);
    const data = await api.fetchData(dbOptions);
    if (pgMaterializedViews) {
        const materializedViews = await api.fetchPGMaterializedViewData(dbOptions);
        for (const key in materializedViews) {
            data[key] = materializedViews[key];
        }
    }
    for (const tableName in data) {
        const tableNames = transformTableNames(tableName, defaults.tableNameTransformer);
        if (!tableNames)
            continue;
        const customRootFields = getRootFieldNames(tableNames, defaultRootFieldNames);
        const customColumnNames = data[tableName].reduce((state, value) => {
            const columnName = transformColumnNames(value, tableName, defaults.columnNameTransformer);
            if (columnName !== value && columnName) {
                state[value] = columnName;
            }
            return state;
        }, {});
        console.log(`${tableName} -> ${tableNames.singular} / ${tableNames.plural}`);
        for (const key in customRootFields)
            console.log(`  ${key}: ${customRootFields[key]}`);
        console.log(`columns`);
        for (const key in customColumnNames)
            console.log(`  ${key}: ${customColumnNames[key]}`);
        if (!dry) {
            await api.pushData(dbOptions, {
                tableName,
                customColumnNames,
                customRootFields,
                customTableName: tableNames.singular,
            });
        }
    }
    if (relations) {
        for (const source of meta.metadata.sources) {
            for (const table of source.tables) {
                if (table.array_relationships)
                    for (const rel of table.array_relationships) {
                        const newName = transformColumnNames(rel.name, table.table.name, defaults.columnNameTransformer);
                        if (rel.name !== newName && newName) {
                            console.log(`${rel.name} => ${newName}`);
                            if (!dry) {
                                await api.pushRelationshipData(Object.assign({}, dbOptions, { schema: table.table.schema }), {
                                    tableName: table.table.name,
                                    newName,
                                    oldName: rel.name,
                                });
                            }
                        }
                    }
                if (table.object_relationships)
                    for (const rel of table.object_relationships) {
                        const newName = transformColumnNames(rel.name, table.table.name, defaults.columnNameTransformer);
                        if (rel.name !== newName && newName) {
                            console.log(`${rel.name} => ${newName}`);
                            if (!dry) {
                                await api.pushRelationshipData(Object.assign({}, dbOptions, { schema: table.table.schema }), {
                                    tableName: table.table.name,
                                    newName,
                                    oldName: rel.name,
                                });
                            }
                        }
                    }
            }
        }
    }
}
exports.hasuraCamelize = hasuraCamelize;
exports.default = hasuraCamelize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwyQ0FBNkI7QUFDN0IscURBQXVDO0FBRXZDLDZCQUFxRDtBQUE1QyxvR0FBQSxhQUFhLE9BQUE7QUFBRSxvR0FBQSxhQUFhLE9BQUE7QUFJOUIsS0FBSyxVQUFVLGNBQWMsQ0FDbEMsU0FBd0IsRUFDeEIsRUFDRSxHQUFHLEdBQUcsS0FBSyxFQUNYLFNBQVMsR0FBRyxLQUFLLEVBQ2pCLE9BQU8sR0FBRyxTQUFTLEVBQ25CLG1CQUFtQixHQUFHLEtBQUssRUFDM0IsbUJBQW1CLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixFQUNuRCxpQkFBaUIsRUFDakIsb0JBQW9CLEdBQUcsUUFBUSxDQUFDLHFCQUFxQixHQW1CdEQ7SUFFRCxNQUFNLHFCQUFxQixHQUN6QixPQUFPLEtBQUssUUFBUTtRQUNsQixDQUFDLENBQUMsUUFBUSxDQUFDLDBCQUEwQjtRQUNyQyxDQUFDLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDO0lBQzNDLElBQUksQ0FBQyxpQkFBaUI7UUFBRSxpQkFBaUIsR0FBRyxxQkFBcUIsQ0FBQztJQUNsRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hDLEtBQUssTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFO1FBQzNCLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxRQUFRLENBQUM7UUFDdkMsSUFBSSxHQUFHLEtBQUssUUFBUSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUM7WUFBRSxLQUFLLEdBQUcsVUFBVSxDQUFDO1FBQzNELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxH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