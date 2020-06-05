import { Handler } from 'aws-lambda';

import { updateIp } from './turbo';
import { success } from './responses';

export const turboIp: Handler = async (event: any) => {
    return success({ updated: await updateIp(event.email || "N/A", event.arn, event.ip) });
}
