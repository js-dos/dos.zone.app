import { Handler } from 'aws-lambda';
import * as AWS from "aws-sdk";

import { getKey } from './storage';
import { badRequest, noSession, success, error } from './responses';
import { validateUser } from './session';

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.GAME_DATA_TABLE as string;

export const gameGet: Handler = async (event: any) => {
    const url = event.queryStringParameters.bundleUrl;

    if (!url || url.length === 0) {
        return badRequest();
    }

    const value = await getGameData(url);
    return success({ value });
}

async function getGameData(url: string) {
    const response = await dynamoDb.get({
        TableName,
        Key: {
            url,
        },
    }).promise();

    if (response.Item === undefined) {
        return undefined;
    }

    response.Item.description = {} as {[locale: string]: string};
    const keys = Object.keys(response.Item);
    for (const next of keys) {
        if (!next.startsWith("description") || next === "description") {
            continue;
        }
        const [x, locale] = next.split("-");
        response.Item.description[locale] = {
            description: response.Item[next],
        }
        delete response.Item[next];
    }

    return response.Item;
}
