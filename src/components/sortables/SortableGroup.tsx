import { Children, ReactNode, useState } from "react";
import { SortableContainer } from "./SortableContainer";
import { SortableHeader } from "./SortableHeader";
import { SensorDescriptor, SensorOptions } from "@dnd-kit/core";
import { SentryLogger } from "@services/sentry/logger";

interface Props {
    headerText: string;
    sortingEnabled: boolean;
    setSortingEnabled: (enabled: boolean) => void;
    sensors: SensorDescriptor<SensorOptions>[];
    sortableIds: string[];
    sortableIdPrefix: 'feature' | 'spell' | 'note' | 'summonable' | 'weapon';
    onUpdate: (event: any) => void;
    children: ReactNode;
    onSave: (event: any, explicitFormData?: any) => void;
    formData: any;
    logger: SentryLogger;
}

export function SortableGroup ({...props}: Props) {
    const [orderChanged, setOrderChanged] = useState(false);
    
    return (
    <>
    <SortableHeader
        text={props.headerText}
        sortingEnabled={props.sortingEnabled}
        setSortingEnabled={props.setSortingEnabled}
        showSortEnableButton={Children.count(props.children) > 1}
        onSave={props.onSave}
        logger={props.logger}
        formData={props.formData}
        orderChanged={orderChanged}
    />
    <SortableContainer
        sensors={props.sensors}
        handleDragEnd={props.onUpdate}
        sortableIds={props.sortableIds}
        sortableIdPrefix={props.sortableIdPrefix}
        sortingEnabled={props.sortingEnabled}
        setOrderChanged={setOrderChanged}
    >
        {props.children}
    </SortableContainer>
    </>
    )
};