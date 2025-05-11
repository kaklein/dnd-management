import * as Sentry from "@sentry/react";

export class SentryLogger {
    userId: string;
    pcId: string;
    name: string;

    constructor(userId?: string, pcId?: string, pcName?: string) {
        this.userId = userId ?? '';
        this.pcId = pcId ?? '';
        this.name = pcName ?? '';

        Sentry.setUser({ id: this.userId });
        Sentry.setContext('pcData', {
            pcId,
            pcName
        });
    }

    logError(error: any) {
        Sentry.captureException(error);
    }

    logMessage(message: string) {
        Sentry.captureMessage(message);
    }

    logEvent(event: any) {
        Sentry.captureEvent(event);
    }
}