import { Handler } from 'aws-lambda';
import * as AWS from "aws-sdk";

import { decodeUser } from "./sso";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.SESSION_TABLE as string;

export const ssoLogin: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;
    const userAgent = event.queryStringParameters.ua;

    let user = decodeUser(sso, sig);

    if (user !== null) {
        const response = await dynamoDb.get({
            TableName,
            Key: {
                id: user.nonce,
            }
        }).promise();

        if (response.Item === undefined) {
            user = null;
        } else if (response.Item.sso === undefined ||
            response.Item.sig === undefined ||
            response.Item.email === undefined) {
            const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
                TableName,
                Key: {
                    id: user.nonce,
                },
                AttributeUpdates: {
                    updatedAt: { Action: "PUT", Value: new Date().getTime() },
                    sso: { Action: "PUT", Value: sso },
                    sig: { Action: "PUT", Value: sig },
                    email: { Action: "PUT", Value: user.email },
                    avatarUrl: { Action: "PUT", Value: user.avatarUrl },
                    username: { Action: "PUT", Value: user.username },
                    userAgent: { Action: "PUT", Value: userAgent ? (new Buffer(userAgent, "base64").toString("utf-8")) : "N/A" },
                },
            };

            await dynamoDb.update(params).promise();
        } else if (response.Item.sso !== sso ||
            response.Item.sig !== sig ||
            response.Item.email !== user.email) {
            user = null;
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ user: user }, null, 2)
    };
}
