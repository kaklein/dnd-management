import { Children, ReactNode } from "react";
import { SortableContainer } from "./SortableContainer";
import { SortableHeader } from "./SortableHeader";
import { SensorDescriptor, SensorOptions } from "@dnd-kit/core";

interface Props {
    headerText: string;
    sortingEnabled: boolean;
    setSortingEnabled: (enabled: boolean) => void;
    sensors: SensorDescriptor<SensorOptions>[];
    sortableIds: string[];
    sortableIdPrefix: 'feature' | 'spell' | 'note' | 'summonable' | 'weapon';
    onUpdate: (event: any) => void;
    children: ReactNode;
}

export function SortableGroup ({...props}: Props) {
    return (
    <>
    <SortableHeader
        text={props.headerText}
        sortingEnabled={props.sortingEnabled}
        setSortingEnabled={props.setSortingEnabled}
        showSortEnableButton={Children.count(props.children) > 1}
    />
    <SortableContainer
        sensors={props.sensors}
        handleDragEnd={props.onUpdate}
        sortableIds={props.sortableIds}
        sortableIdPrefix={props.sortableIdPrefix}
        sortingEnabled={props.sortingEnabled}
    >
        {props.children}
    </SortableContainer>
    </>
    )
};