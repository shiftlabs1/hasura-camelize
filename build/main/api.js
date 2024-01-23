"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMetadata = exports.pushRelationshipData = exports.pushData = exports.fetchPGMaterializedViewData = exports.fetchData = exports.defaultSchema = exports.defaultSource = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
exports.defaultSource = 'default';
exports.defaultSchema = 'public';
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
async function fetchData({ host, secret, schema = exports.defaultSchema, source = exports.defaultSource, agent, }) {
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
exports.fetchData = fetchData;
// Get tables and table columns
async function fetchPGMaterializedViewData({ host, secret, schema = exports.defaultSchema, source = exports.defaultSource, agent, }) {
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
exports.fetchPGMaterializedViewData = fetchPGMaterializedViewData;
async function pushData({ host, secret, schema, source = exports.defaultSource, agent }, args) {
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
exports.pushData = pushData;
async function pushRelationshipData({ host, secret, schema, source = exports.defaultSource, agent }, args) {
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
exports.pushRelationshipData = pushRelationshipData;
async function getMetadata({ host, secret, agent, }) {
    const data = await (0, node_fetch_1.default)(`${host}/v1/metadata`, {
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
exports.getMetadata = getMetadata;
async function fetchJson(url, options) {
    const body = (options === null || options === void 0 ? void 0 : options.body) === undefined ? undefined : JSON.stringify(options.body);
    const result = await (0, node_fetch_1.default)(url, Object.assign(Object.assign({}, options), { body }));
    if (result.ok === false) {
        const { code, error: message } = await result
            .json()
            .catch((error) => ({ code: 'unknown', error: error === null || error === void 0 ? void 0 : error.message }));
        throw new HasuraError(message, code);
    }
    return result.json();
}
class HasuraError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSw0REFBZ0Q7QUFFbkMsUUFBQSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQzFCLFFBQUEsYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUV0QyxTQUFTLHFCQUFxQixDQUFDLE1BQWtCLEVBQUUsTUFBYztJQUMvRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQTRCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO1FBQy9ELElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLE1BQU0sRUFBRTtZQUN2QixNQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDM0IsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUU7Z0JBQ3JCLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDdkI7WUFDRCxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBRUQsK0JBQStCO0FBQ3hCLEtBQUssVUFBVSxTQUFTLENBQUMsRUFDOUIsSUFBSSxFQUNKLE1BQU0sRUFDTixNQUFNLEdBQUcscUJBQWEsRUFDdEIsTUFBTSxHQUFHLHFCQUFhLEVBQ3RCLEtBQUssR0FDUztJQUNkLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLFNBQVMsQ0FDaEMsR0FBRyxJQUFJLFdBQVcsRUFDbEI7UUFDRSxNQUFNLEVBQUUsTUFBTTtRQUNkLEtBQUssRUFBRSxLQUFLO1FBQ1osSUFBSSxFQUFFO1lBQ0osSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVB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