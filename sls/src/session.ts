import * as AWS from "aws-sdk";
import * as crypto from "crypto";
import { User, decodeUser } from "./sso";

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

function updateSession(user: User,
                              sso: string,
                              sig: string,
                              userAgent?: string) {
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
        },
    };

    if (userAgent !== undefined) {
        (params as any).AttributeUpdates.userAgent = { Action: "PUT", Value: userAgent };
    }

    return dynamoDb.update(params).promise();
}

function updateSessionTime(user: User) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName,
        Key: {
            nonce: user.nonce,
        },
        AttributeUpdates: {
            updatedAt: { Action: "PUT", Value: new Date().getTime() },
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

export async function validateUser(sso: string, sig: string) {
    const user = decodeUser(sso, sig);
    const valid = await validateSession(user);
    return valid ? user : null;
}

export async function validateSession(user: User | null, userAgent?: string) {
    if (user === null) {
        return false;
    }

    const session = await getSession(user.nonce);
    if (session === undefined) {
        return false;
    } else if (session.sso === undefined ||
        session.sig === undefined ||
        session.email === undefined) {
        await updateSession(user, user.sso, user.sig, userAgent);
        return true;
    } else if (session.sso === user.sso &&
        session.sig === user.sig &&
        session.email === user.email) {
        await updateSessionTime(user);
        return true;
    }

    return false;
}
