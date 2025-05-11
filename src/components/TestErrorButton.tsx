import { EnvName, getEnvName } from "@pages/utils";
import { SentryLogger } from "@services/sentry/logger";

interface Props {
    displayInStaging?: boolean;
    errorType?: 'handled' | 'unhandled';
    userId?: string;
    pcId?: string;
}

function TestErrorButton ({displayInStaging=true, errorType='unhandled', userId='', pcId=''}: Props) {
    const envName = getEnvName();
    if (envName === EnvName.production) return undefined;

    if (envName === EnvName.dev || (envName === EnvName.staging && displayInStaging)) {
        return (
            <div className="sentry-test-error">
                <button
                    type="button"
                    onClick={() => {
                        if (errorType === 'unhandled') {
                            throw new Error("Sentry Test Error");
                        } else {
                            const logger = new SentryLogger(userId, pcId);
                            logger.logError('Test Handled Error');
                        }                        
                    }}
                    >
                    &#9888; BREAK IT!
                </button>
            </div>
        )
    }

    
}

export default TestErrorButton;