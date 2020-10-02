import { Handler } from 'aws-lambda';

import { closeSession } from './turbo';
import { success } from './responses';

export const turboClose: Handler = async (event: any) => {
    const [timeAdded, sessionClosed]= await closeSession(event.email, event.arn, parseInt(event.sec, 10));
    return success({ timeAdded, sessionClosed, arn: event.arn });
}

