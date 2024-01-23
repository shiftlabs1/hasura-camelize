import fetch from 'node-fetch';
export const defaultSource = 'default';
export const defaultSchema = 'public';
function sqlColumnInfoToObject(result, ignore) {
    return result.reduce((state, value) => {
        if (value[1] !== ignore) {
            const fieldName = value[0];
            const tableName = value[1];
            if (!state[tableName]) {
                state[tableName] = [];
            }
            state[tableName].push(fieldName);
        }
        return state;
    }, {});
}
// Get tables and table columns
export async function fetchData({ host, secret, schema = defaultSchema, source = defaultSource, agent, }) {
    const { result } = await fetchJson(`${host}/v2/query`, {
        method: 'post',
        agent: agent,
        body: {
            type: 'run_sql',
            args: {
                source,
                sql: `SELECT column_name, table_name, is_generated, is_identity, identity_generation FROM information_schema.columns where table_schema = '${schema}';`,
                cascade: false,
                read_only: true,
            },
        },
        headers: {
            'x-hasura-admin-secret': secret,
        },
    });
    return sqlColumnInfoToObject(result, 'table_name');
}
// Get tables and table columns
export async function fetchPGMaterializedViewData({ host, secret, schema = defaultSchema, source = defaultSource, agent, }) {
    const views = await fetchJson(`${host}/v2/query`, {
        method: 'post',
        agent: agent,
        body: {
            type: 'run_sql',
            args: {
                source,
                sql: `SELECT matviewname FROM pg_matviews WHERE schemaname = '${schema}';`,
                cascade: false,
                read_only: true,
            },
        },
        headers: {
            'x-hasura-admin-secret': secret,
        },
    });
    const viewNames = views.result.reduce((state, value, i) => {
        if (i === 0)
            return state;
        state.push(value[0]);
        return state;
    }, []);
    const { result } = await fetchJson(`${host}/v2/query`, {
        method: 'post',
        agent: agent,
        body: {
            type: 'run_sql',
            args: {
                source,
                sql: `
            SELECT a.attname,
                  t.relname,
                  pg_catalog.format_type(a.atttypid, a.atttypmod),
                  a.attnotnull
            FROM pg_attribute a
              JOIN pg_class t on a.attrelid = t.oid
              JOIN pg_namespace s on t.relnamespace = s.oid
            WHERE a.attnum > 0
              AND NOT a.attisdropped
              AND t.relname in (${viewNames.map((x) => `'${x}'`).join(', ')})
              AND s.nspname = '${schema}'
            ORDER BY a.attnum;
          `,
                cascade: false,
                read_only: true,
            },
        },
        headers: {
            'x-hasura-admin-secret': secret,
        },
    });
    return sqlColumnInfoToObject(result, 'relname');
}
export async function pushData({ host, secret, schema, source = defaultSource, agent }, args) {
    await fetchJson(`${host}/v1/metadata`, {
        method: 'post',
        agent: agent,
        body: {
            type: 'pg_set_table_customization',
            args: {
                table: {
                    schema,
                    name: args.tableName,
                },
                source,
                configuration: {
                    custom_root_fields: args.customRootFields,
                    custom_name: args.customTableName,
                    custom_column_names: args.customColumnNames,
                },
            },
        },
        headers: { 'x-hasura-admin-secret': secret },
    });
}
export async function pushRelationshipData({ host, secret, schema, source = defaultSource, agent }, args) {
    await fetchJson(`${host}/v1/metadata`, {
        method: 'post',
        agent: agent,
        body: {
            type: 'pg_rename_relationship',
            args: {
                table: {
                    schema,
                    name: args.tableName,
                },
                name: args.oldName,
                source,
                new_name: args.newName,
            },
        },
        headers: { 'x-hasura-admin-secret': secret },
    });
}
export async function getMetadata({ host, secret, agent, }) {
    const data = await fetch(`${host}/v1/metadata`, {
        method: 'post',
        agent: agent,
        body: JSON.stringify({
            type: 'export_metadata',
            version: 2,
            args: {},
        }),
        headers: { 'x-hasura-admin-secret': secret },
    });
    return data.json();
}
async function fetchJson(url, options) {
    const body = options?.body === undefined ? undefined : JSON.stringify(options.body);
    const result = await fetch(url, {
        ...options,
        body,
    });
    if (result.ok === false) {
        const { code, error: message } = await result
            .json()
            .catch((error) => ({ code: 'unknown', error: error?.message }));
        throw new HasuraError(message, code);
    }
    return result.json();
}
class HasuraError extends Error {
    code;
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEtBQXNCLE1BQU0sWUFBWSxDQUFDO0FBRWhELE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0sYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUV0QyxTQUFTLHFCQUFxQixDQUFDLE1BQWtCLEVBQUUsTUFBYztJQUMvRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQTRCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9ELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUN2QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3JCLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDdkI7WUFDRCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRUQsK0JBQStCO0FBQy9CLE1BQU0sQ0FBQyxLQUFLLFVBQVUsU0FBUyxDQUFDLEVBQzlCLElBQUksRUFDSixNQUFNLEVBQ04sTUFBTSxHQUFHLGFBQWEsRUFDdEIsTUFBTSxHQUFHLGFBQWEsRUFDdEIsS0FBSyxHQUNTO0lBQ2QsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLE1BQU0sU0FBUyxDQUNoQyxHQUFHLElBQUksV0FBVyxFQUNsQjtRQUNFLE1BQU0sRUFBRSxNQUFNO1FBQ2QsS0FBSyxFQUFFLEtBQUs7UUFDWixJ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