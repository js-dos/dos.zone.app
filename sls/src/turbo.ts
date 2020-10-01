import * as AWS from "aws-sdk";
import { getDayOrigin } from "./day";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const lambda = new AWS.Lambda();
const TableName = process.env.TURBO_TABLE as string;
const RunInstanceLambda = process.env.RUN_INSTANCE as string;
const defaultTimeLimitSec = 30 * 60;

export interface TurboSession {
    email: string;
    dayOrigin: number;
    timeLimit: number;
    usedTime: number;
    restTime: number;
    arn?: string;
    bundleUrl?: string;
    startedAt?: number;
    createdAt?: number;
}

export async function getTurboSession(email: string): Promise<TurboSession> {
    const response = await dynamoDb.get({
        TableName,
        Key: {
            email,
        }
    }).promise();

    let session: TurboSession = response.Item as TurboSession;
    if (session === undefined) {
        session = {
            email,
            dayOrigin: getDayOrigin(),
            timeLimit: defaultTimeLimitSec,
            usedTime: 0,
            restTime: 0,
        };
    }

    session.restTime = Math.max(session.timeLimit - session.usedTime, 0);
    if (session.arn && session.startedAt) {
        const used = (new Date().getTime() - session.startedAt) / 1000;
        session.restTime = Math.max(session.restTime - used, 0);
    }

    return session;
}

export async function startTurboSession(session: TurboSession) {
    const result = await lambda.invoke({
        FunctionName: RunInstanceLambda,
        Payload: JSON.stringify(session),
    }).promise();

    if (result.Payload) {
        session.arn = JSON.parse(JSON.parse(result.Payload as string).body).arn;
        session.startedAt = new Date().getTime();

        if (!session.createdAt) {
            await createSession(session);
        } else {
            await updateSession(session);
        }

    }

    return session;
}

async function createSession(session: TurboSession) {
    session.createdAt = new Date().getTime();

    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
        TableName,
        Item: session,
    };

    await dynamoDb.put(params).promise();
}

async function updateSession(session: TurboSession) {
    const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
        TableName,
        Key: {
            email: session.email,
        },
        AttributeUpdates: {
            startedAt: { Action: "PUT", Value: session.startedAt },
            arn: { Action: "PUT", Value: session.arn },
            bundleUrl: { Action: "PUT", Value: session.bundleUrl },
        },
    };

    await dynamoDb.update(params).promise();
}

export async function closeSession(email: string, arn: string, sec: number) {
    let timeAdded = true;
    let sessionClosed: any = true;
    {
        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName,
            Key: {
                email: email,
            },
            AttributeUpdates: {
                usedTime: { Action: "ADD", Value: sec },
            },
        };

        try {
            await dynamoDb.update(params).promise();
        } catch(e) {
            timeAdded = false;
        }
    }

    {
        const params: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
            TableName,
            Key: {
                email: email,
            },
            AttributeUpdates: {
                arn: { Action: "DELETE" },
                bundleUrl: { Action: "DELETE" },
                startedAt: { Action: "DELETE" },
            },
            Expected: {
                arn: {
                    Value: arn,
                }
            }
        };

        try  {
            await dynamoDb.update(params).promise();
        } catch (e) {
            sessionClosed = false;
        }
    }

    return [timeAdded, sessionClosed];
}
