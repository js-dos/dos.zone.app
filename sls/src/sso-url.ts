import { Handler } from 'aws-lambda';

import * as AWS from "aws-sdk";
import { makeUrl } from './sso';

import * as crypto from "crypto";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.SESSION_TABLE as string;

export const ssoUrl: Handler = async (event: any) => {
    const hrtime = process.hrtime();
    const timestamp = new Date().getTime();
    const nonce = crypto.randomBytes(16).toString("hex") + "@" + timestamp + ":" + hrtime[0] + "!" + hrtime[1];
    const backUrl = event.queryStringParameters.url || "N/A";
    const url = makeUrl(nonce, backUrl);

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName,
        Item: {
            id: nonce,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    await dynamoDb.put(params).promise();

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
            url
        }, null, 2)
    };
}
