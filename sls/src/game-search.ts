import { Handler } from "aws-lambda";
import * as AWS from "aws-sdk";
import * as https from "https";

import { getKey } from "./storage";
import { badRequest, noSession, success, error } from "./responses";
import { validateUser } from "./session";
import { createGameDataItem } from "./game";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TableName = process.env.GAME_DATA_TABLE as string;
const queryRequestLimit = 5;

interface DiscourseSearchResult {
    topics: { id: number }[];
}

export const gameSearch: Handler = async (event: any) => {
    const request = event.queryStringParameters.request;

    if (!request || request.length < 3) {
        return badRequest();
    }

    const discourseResult = await doSearch(request);
    const topics: number[] = [];
    for (const next of (discourseResult.topics || [])) {
        topics.push(next.id);
    }

    const games = await getGamesData(topics);
    return success({ games })
}


function doSearch(searchTerm: string): Promise<DiscourseSearchResult> {
    return new Promise<DiscourseSearchResult>((resolve, reject) => {
        const searchUrl = "https://talks.dos.zone/search.json?q=" + encodeURIComponent(searchTerm + " #rep");

        https.get(searchUrl, (res) => {
            const { statusCode } = res;
            const contentType = res.headers["content-type"] || "";

            if (statusCode !== 200) {
                reject(new Error("Request Failed.\n `Status Code: ${statusCode}`"));
                res.resume();
                return;
            } else if (!/^application\/json/.test(contentType)) {
                reject(new Error("Invalid content-type.\n `Expected application/json but received ${contentType}`"));
                res.resume();
                return;
            }

            res.setEncoding("utf8");
            let rawData = "";
            res.on("data", (chunk) => { rawData += chunk; });
            res.on("end", () => {
                try {
                    resolve(JSON.parse(rawData));
                } catch (e) {
                    reject(e);
                }
            });
        }).on("error", (e) => {
            reject(e);
        });
    });
}

async function getGamesData(topics: number[]) {
    const promises: Promise<any>[] = [];

    let requestCount = 0;
    for (const next of topics) {
        if (next === 44653) {
            continue;
        }

        const promise = dynamoDb.query({
            TableName,
            IndexName: "repTopic",
            KeyConditions: {
                "repTopic": {
                    AttributeValueList: [next],
                    ComparisonOperator: "EQ",
                }
            },
            ReturnConsumedCapacity: "TOTAL",
        }).promise().then((response) => {
            if (response.Items === undefined || response.Items.length === 0 ||
                response.Items[0] === null || response.Items[0] === undefined) {
                return null;
            }

            const game = createGameDataItem(response.Items[0]);
            game.canonicalUrl = game.url;
            game.count = response.Items.length;
            return game;
        });

        promises.push(promise);
        requestCount++;

        if (requestCount >= queryRequestLimit) {
            break;
        }
    }

    const resolved = await Promise.all(promises);
    const nonNull: any[] = [];
    for (const next of resolved) {
        if (next !== null) {
            nonNull.push(next);
        }
    }

    return nonNull;
}
