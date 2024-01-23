import * as api from './api';
import * as defaults from './defaults';
export { defaultSchema, defaultSource } from './api';
export async function hasuraCamelize(dbOptions, { dry = false, relations = false, pattern = 'default', pgMaterializedViews = false, transformTableNames = defaults.tableNameTransformer, getRootFieldNames, transformColumnNames = defaults.columnNameTransformer, }) {
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
export default hasuraCamelize;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLEdBQUcsTUFBTSxPQUFPLENBQUM7QUFDN0IsT0FBTyxLQUFLLFFBQVEsTUFBTSxZQUFZLENBQUM7QUFFdkMsT0FBTyxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsTUFBTSxPQUFPLENBQUM7QUFJckQsTUFBTSxDQUFDLEtBQUssVUFBVSxjQUFjLENBQ2xDLFNBQXdCLEVBQ3hCLEVBQ0UsR0FBRyxHQUFHLEtBQUssRUFDWCxTQUFTLEdBQUcsS0FBSyxFQUNqQixPQUFPLEdBQUcsU0FBUyxFQUNuQixtQkFBbUIsR0FBRyxLQUFLLEVBQzNCLG1CQUFtQixHQUFHLFFBQVEsQ0FBQyxvQkFBb0IsRUFDbkQsaUJBQWlCLEVBQ2pCLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxxQkFBcUIsR0FtQnREO0lBRUQsTUFBTSxxQkFBcUIsR0FDekIsT0FBTyxLQUFLLFFBQVE7UUFDbEIsQ0FBQyxDQUFDLFFBQVEsQ0FBQywwQkFBMEI7UUFDckMsQ0FBQyxDQUFDLFFBQVEsQ0FBQywyQkFBMkIsQ0FBQztJQUMzQyxJQUFJLENBQUMsaUJBQWlCO1FBQUUsaUJBQWlCLEdBQUcscUJBQXFCLENBQUM7SUFDbEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRXpELE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoQyxLQUFLLE1BQU0sR0FBRyxJQUFJLFNBQVMsRUFBRTtRQUMzQixJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksUUFBUSxDQUFDO1FBQ3ZDLElBQUksR0FBRyxLQUFLLFFBQVEsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDO1lBQUUsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUMzRCxP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