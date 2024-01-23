import camelize from 'camelcase';
import pluralize from 'pluralize';
export function tableNameTransformer(name) {
    const tableName = camelize(name);
    const plural = pluralize.plural(tableName);
    const singular = pluralize.singular(tableName);
    return {
        plural,
        singular,
    };
}
export function columnNameTransformer(name) {
    // Hasura converts '?' to '_' by default
    return camelize(name).replace(/[?]/g, '_');
}
export function rootFieldTransformerDefault({ plural, singular, }) {
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
function c(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
export function rootFieldTransformerInvert({ plural, singular, }) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvZGVmYXVsdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxRQUFRLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sU0FBUyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxNQUFNLFVBQVUsb0JBQW9CLENBQUMsSUFBWTtJQUMvQyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakMsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzQyxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLE9BQU87UUFDTCxNQUFNO1FBQ04sUUFBUTtLQUNULENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxVQUFVLHFCQUFxQixDQUFDLElBQVk7SUFDaEQsd0NBQXdDO0lBQ3hDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVELE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxFQUMxQyxNQUFNLEVBQ04sUUFBUSxHQUNlO0lBQ3ZCLE9BQU87UUFDTCxNQUFNLEVBQUUsTUFBTTtRQUNkLFlBQVksRUFBRSxRQUFRO1FBQ3RCLGdCQUFnQixFQUFFLEdBQUcsTUFBTSxXQUFXO1FBQ3RDLGFBQWEsRUFBRSxHQUFHLE1BQU0sUUFBUTtRQUNoQyxNQUFNLEVBQUUsR0FBRyxNQUFNLFFBQVE7UUFDekIsVUFBVSxFQUFFLEdBQUcsUUFBUSxRQUFRO1FBQy9CLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUTtRQUN6QixXQUFXLEVBQUUsR0FBRyxNQUFNLFlBQVk7UUFDbEMsWUFBWSxFQUFFLEdBQUcsUUFBUSxRQUFRO1FBQ2pDLE1BQU0sRUFBRSxHQUFHLE1BQU0sUUFBUTtRQUN6QixZQUFZLEVBQUUsR0FBRyxRQUFRLFFBQVE7S0FDbEMsQ0FBQztBQUNKLENBQUM7QUFFRCxTQUFTLENBQUMsQ0FBQyxNQUFjO0lBQ3ZCLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFELENBQUM7QUFDRCxNQUFNLFVBQVUsMEJBQTBCLENBQUMsRUFDekMsTUFBTSxFQUNOLFFBQVEsR0FDZTtJQUN2QixPQUFPO1FBQ0wsTUFBTSxFQUFFLE1BQU07UUFDZCxZQUFZLEVBQUUsUUFBUTtRQUN0QixnQkFBZ0IsRUFBRSxZQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN6QyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDbkMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzVCLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNsQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUIsV0FBVyxFQUFFLGFBQWEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3JDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNwQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDNUIsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFO0tBQ3JDLENBQUM7QUFDSixDQUFDIn0=