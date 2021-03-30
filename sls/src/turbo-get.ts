import { Handler } from "aws-lambda";

import { getTurboSession } from "./turbo";
import { success } from "./responses";

export const turboGet: Handler = async (event: any) => {
    return success({ session: await getTurboSession(event.email || "N/A", event.arn, event.uptime) });
}
