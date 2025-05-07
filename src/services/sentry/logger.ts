import * as Sentry from "@sentry/react";

export const logError = (error: any) => {
    Sentry.captureException(error);
}

export const logEvent = (event: any) => {
    Sentry.captureEvent(event);
}

export const logMessage = (message: string, severity?: Sentry.SeverityLevel) => {
    Sentry.captureMessage(message, severity);
}