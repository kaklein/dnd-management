import TitleButtonRow from "@components/TitleButtonRow";

interface Props {
    text: string;
    sortingEnabled: boolean;
    setSortingEnabled: (enabled: boolean) => void;
    showSortEnableButton: boolean;
}

export function SortableHeader ({...props}: Props) {  
    const className = "btn ".concat(props.sortingEnabled ? "btn-success" : "btn-secondary");
    const enableDragButton = (
        <button
            type="button"
            className={className}
            onClick={() => {
                props.setSortingEnabled(!props.sortingEnabled);
            }}
        >
            {props.sortingEnabled ? <span>&#10003; Save</span> : <span>&#x2725; Edit</span>}
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