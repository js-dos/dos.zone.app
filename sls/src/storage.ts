import * as AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.STORAGE_TABLE as string;

export async function getKey(email: string, key: string): Promise<string | undefined> {
    const response = await dynamoDb.get({
        TableName,
        Key: {
            email,
            key,
        },
    }).promise();

    if (response.Item === undefined) {
        return undefined;
    }

    return response.Item.value;
}

export function putKey(email: string, key: string, value: string) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName,
        Key: {
            email, key, 
        },
        AttributeUpdates: {
            value: { Action: "PUT", Value: value }
        },
    };

    return dynamoDb.update(params).promise();
}

