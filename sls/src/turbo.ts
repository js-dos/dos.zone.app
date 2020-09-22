import * as AWS from "aws-sdk";
import { getDayOrigin } from "./day";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.TURBO_TABLE as string;
const defaultTimeLimit = 30;

export interface TurboLimits {
    email: string;
    dayOrigin: number;
    timeLimit: number;
    usedTime: number;
    arn: string;
    startedAt: number;
    restTime?: number;
}

export async function getTurboLimits(email: string): Promise<TurboLimits> {
    const response = await dynamoDb.get({
        TableName,
        Key: {
            email,
        }
    }).promise();

    if (response.Item === undefined) {
        return {
            email,
            dayOrigin: getDayOrigin(),
            timeLimit: defaultTimeLimit,
            usedTime: 0,
            arn: "",
            startedAt: Date.now(),
        }
    } else {
        return response.Item as TurboLimits;
    }
}
