import * as AWS from "aws-sdk";
import * as crypto from "crypto";
import { User } from "./sso";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.SESSION_TABLE as string;

export interface Session {
    nonce: string,
    createdAt: number,
    updatedAt: number,
    sso: string,
    sig: string,
    email: string,
    username: string,
    userAgent: string,
}

export async function getSession(nonce: string): Promise<Session | undefined> {
    const response = await dynamoDb.get({
        TableName,
        Key: {
            nonce,
        }
    }).promise();

    if (response.Item === undefined) {
        return undefined;
    }

    return response.Item as Session;
}

export async function createSession() {
    const timestamp = new Date().getTime();
    const hrtime = process.hrtime();
    const nonce = crypto.randomBytes(16).toString("hex") + "@" + timestamp + ":" + hrtime[0] + "!" + hrtime[1];
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName,
        Item: {
            nonce,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    await dynamoDb.put(params).promise();
    return nonce;
}

export function updateSession(user: User,
                              sso: string,
                              sig: string,
                              userAgent: string) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName,
        Key: {
            nonce: user.nonce,
        },
        AttributeUpdates: {
            updatedAt: { Action: "PUT", Value: new Date().getTime() },
            sso: { Action: "PUT", Value: sso },
            sig: { Action: "PUT", Value: sig },
            email: { Action: "PUT", Value: user.email },
            avatarUrl: { Action: "PUT", Value: user.avatarUrl },
            username: { Action: "PUT", Value: user.username },
            userAgent: { Action: "PUT", Value: userAgent },
        },
    };

    return dynamoDb.update(params).promise();
}

export function deleteSession(user: User) {
    return dynamoDb.delete({
        TableName,
        Key: {
            nonce: user.nonce,
        },
    }).promise();
}
