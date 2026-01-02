import TitleButtonRow from "@components/TitleButtonRow";
import { SentryLogger } from "@services/sentry/logger";

interface Props {
    text: string;
    sortingEnabled: boolean;
    setSortingEnabled: (enabled: boolean) => void;
    showSortEnableButton: boolean;
    onSave: (event: any, explicitFormData?: any) => void;
    formData: any;
    logger: SentryLogger;
    orderChanged: boolean;
}

export function SortableHeader ({...props}: Props) {  
    const isCancelButton = props.sortingEnabled && !props.orderChanged;
    const isSaveButton = props.sortingEnabled && props.orderChanged;
    const className = "btn ".concat(isSaveButton ? "btn-success" : "btn-secondary");
    
    const enableDragButton = (
        <button
            type="button"
            className={className}
            onClick={(event: any) => {
                if (isSaveButton) {
                    // Save changes in form
                    try {
                        props.onSave(event, props.formData);
                    } catch (error) {
                        console.error('error saving lol');
                        props.logger.logError(error);
                        alert('There was an issue saving your changes :(');
                    }
                }
                props.setSortingEnabled(!props.sortingEnabled);
            }}
        >
            {isSaveButton ? <span>&#10003; Save</span> : isCancelButton ? <span>Cancel</span> : <span>&#x2725; Edit</span>}
        </button>
    );

    return <TitleButtonRow
        text={props.text}
        formatAsHeader={true}
        buttons={props.showSortEnableButton ? enableDragButton : <></>}
        centered={true}
        customColor="dark-purple"
    />
}