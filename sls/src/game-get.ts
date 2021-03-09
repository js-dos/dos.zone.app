import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";

import { getKey } from "./storage";
import { badRequest, noSession, success, error } from "./responses";
import { validateUser } from "./session";
import { createGameDataItem } from "./game";

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

    return createGameDataItem(response.Item);
}
