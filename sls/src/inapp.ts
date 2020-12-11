import * as AWS from "aws-sdk";

export interface Purchase {
    productId: string,
    isExpired: boolean,
}

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.SUBSCRIPTIONS_TABLE as string;

export function updatePurchase(next: Purchase, email: string) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName,
        Key: {
            email,
            subscription: next.productId,
        },
        AttributeUpdates: {
            isExpired: { Action: "PUT", Value: next.isExpired },
            payload: { Action: "PUT", Value: JSON.stringify(next) }
        },
    };

    return dynamoDb.update(params).promise();
}

export async function getActiveSubscriptions(email: string) {
    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName,
        KeyConditions: {
            "email": {
                AttributeValueList: [email],
                ComparisonOperator: "EQ",
            },
        },
    };

    const active: string[] = [];
    const result = await dynamoDb.query(params).promise();
    for (const next of (result.Items || [])) {
        if (next.isExpired === true) {
            continue;
        }
        if (next.subscription.startsWith("google:")) {
            active.push(next.subscription.substr("google:".length));
        } else {
            active.push(next.subscription);
        }
    }
    return active;
}
