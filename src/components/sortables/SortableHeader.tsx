import TitleButtonRow from "@components/TitleButtonRow";

interface Props {
    text: string;
    sortingEnabled: boolean;
    setSortingEnabled: (enabled: boolean) => void;
}

export function SortableHeader ({...props}: Props) {  
    const enableDragButton = (
        <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
                props.setSortingEnabled(!props.sortingEnabled)
            }}
        >
            {props.sortingEnabled ? <span>&#x1f512; Lock</span> : ":: Arrange"}
        </button>
    );

    return <TitleButtonRow
        text={props.text}
        formatAsHeader={true}
        buttons={enableDragButton}
        centered={true}
        customColor="dark-purple"
    />
}