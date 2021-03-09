import * as AWS from "aws-sdk";

export function createGameDataItem(item: AWS.DynamoDB.DocumentClient.AttributeMap) {
    item.description = {} as {[locale: string]: string};
    item.slug = {} as {[locale: string]: string};
    const keys = Object.keys(item);

    for (const next of keys) {
        if (!next.startsWith("description") || next === "description") {
            continue;
        }
        const [x, locale] = next.split("-");
        item.description[locale] = {
            description: item[next],
        }
        delete item[next];
    }

    for (const next of keys) {
        if (!next.startsWith("slug") || next === "slug") {
            continue;
        }
        const [x, locale] = next.split("-");
        item.slug[locale] = item[next];
        delete item[next];
    }

    return item;
}
