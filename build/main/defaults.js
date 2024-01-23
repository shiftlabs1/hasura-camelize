"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootFieldTransformerInvert = exports.rootFieldTransformerDefault = exports.columnNameTransformer = exports.tableNameTransformer = void 0;
const camelcase_1 = __importDefault(require("camelcase"));
const pluralize_1 = __importDefault(require("pluralize"));
function tableNameTransformer(name) {
    const tableName = (0, camelcase_1.default)(name);
    const plural = pluralize_1.default.plural(tableName);
    const singular = pluralize_1.default.singular(tableName);
    return {
        plural,
        singular,
    };
}
exports.tableNameTransformer = tableNameTransformer;
function columnNameTransformer(name) {
    // Hasura converts '?' to '_' by default
    return (0, camelcase_1.default)(name).replace(/[?]/g, '_');
}
exports.columnNameTransformer = columnNameTransformer;
function rootFieldTransformerDefault({ plural, singular, }) {
    return {
        select: plural,
        select_by_pk: singular,
        select_aggregate: `${plural}Aggregate`,
        select_stream: `${plural}Stream`,
        insert: `${plural}Insert`,
        insert_one: `${singular}Insert`,
        update: `${plural}Update`,
        update_many: `${plural}UpdateMany`,
        update_by_pk: `${singular}Update`,
        delete: `${plural}Delete`,
        delete_by_pk: `${singular}Delete`,
    };
}
exports.rootFieldTransformerDefault = rootFieldTransformerDefault;
function c(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function rootFieldTransformerInvert({ plural, singular, }) {
    return {
        select: plural,
        select_by_pk: singular,
        select_aggregate: `aggregate${c(plural)}`,
        select_stream: `stream${c(plural)}`,
        insert: `insert${c(plural)}`,
        insert_one: `insert${c(singular)}`,
        update: `update${c(plural)}`,
        update_many: `updateMany${c(plural)}`,
        update_by_pk: `update${c(singular)}`,
        delete: `delete${c(plural)}`,
        delete_by_pk: `delete${c(singular)}`,
    };
}
exports.rootFieldTransformerInvert = rootFieldTransformerInvert;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVmYXVsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQ0EsMERBQWlDO0FBQ2pDLDBEQUFrQztBQUVsQyxTQUFnQixvQkFBb0IsQ0FBQyxJQUFZO0lBQy9DLE1BQU0sU0FBUyxHQUFHLElBQUEsbUJBQVEsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxNQUFNLE1BQU0sR0FBRyxtQkFBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxNQUFNLFFBQVEsR0FBRyxtQkFBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMvQyxPQUFPO1FBQ0wsTUFBTTtRQUNOLFFBQVE7S0FDVCxDQUFDO0FBQ0osQ0FBQztBQVJELG9EQVFDO0FBRUQsU0FBZ0IscUJBQXFCLENBQUMsSUFBWTtJQUNoRCx3Q0FBd0M7SUFDeEMsT0FBTyxJQUFBLG1CQUFRLEVBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBSEQsc0RBR0M7QUFFRCxTQUFnQiwyQkFBMkIsQ0FBQyxFQUMxQyxNQUFNLEVBQ04sUUFBUSxHQUNlO0lBQ3ZCLE9BQU87UUFDTCxNQUFNLEVBQUUsTUFBTTtRQUNkLFlBQVksRUFBRSxRQUFRO1FBQ3RCLGdCQUFnQixFQUFFLEdBQUcsTUFBTSxXQUFXO1FBQ3RDLGFBQWEsRUFBRSxHQUFHLE1BQU0sUUFBUTtRQUNoQyxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVE7UUFDekIsVUFBVSxFQUFFLEdBQUcsUUFBUSxRQUFRO1FBQy9CLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUTtRQUN6QixXQUFXLEVBQUUsR0FBRyxNQUFNLFlBQVk7UUFDbEMsWUFBWSxFQUFFLEdBQUcsUUFBUSxRQUFRO1FBQ2pDLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUTtRQUN6QixZQUFZLEVBQUUsR0FBRyxRQUFRLFFBQVE7S0FDbEMsQ0FBQztBQUNKLENBQUM7QUFqQkQsa0VBaUJDO0FBRUQsU0FBUyxDQUFDLENBQUMsTUFBYztJQUN2QixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxDQUFDO0FBQ0QsU0FBZ0IsMEJBQTBCLENBQUMsRUFDekMsTUFBTSxFQUNOLFFBQVEsR0FDZTtJQUN2QixPQUFPO1FBQ0wsTUFBTSxFQUFFLE1BQU07UUFDZCxZQUFZLEVBQUUsUUFBUTtRQUN0QixnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDbkMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzVCLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNsQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3JDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNwQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0tBQ3JDLENBQUM7QUFDSixDQUFDO0FBakJELGdFQWlCQyJ9