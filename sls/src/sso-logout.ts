import { Handler } from 'aws-lambda';
import * as AWS from "aws-sdk";

import { validatSso, decodeUser } from "./sso";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.SESSION_TABLE as string;

export const ssoLogout: Handler = async (event: any) => {
    const sso = event.queryStringParameters.sso;
    const sig = event.queryStringParameters.sig;

    const user = decodeUser(sso, sig);

    if (user !== null) {
        await dynamoDb.delete({
            TableName,
            Key: {
                id: user.nonce,
            },
        }).promise();
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ success: user !== null }, null, 2)
    };
}
