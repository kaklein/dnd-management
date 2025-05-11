import { EnvName, getEnvName } from "@pages/utils";

interface Props {
    displayInStaging?: boolean;
}

function TestErrorButton ({displayInStaging=true}: Props) {
    const envName = getEnvName();
    if (envName === EnvName.production) return undefined;

    if (envName === EnvName.dev || (envName === EnvName.staging && displayInStaging)) {
        return (
            <div className="sentry-test-error">
                <button
                    type="button"
                    onClick={() => {
                        throw new Error("Sentry Test Error");
                    }}
                    >
                    &#9888; BREAK IT!
                </button>
            </div>
        )
    }

    
}

export default TestErrorButton;