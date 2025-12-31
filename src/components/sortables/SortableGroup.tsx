import { Children, ReactNode } from "react";
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
    orderChanged: boolean;
    setOrderChanged: (changed: boolean) => void;
}

/**
 * In addition to the required properties, make sure the children adhere to the following requirements:
 * - Each child has an id of "<sortableIdPrefix>-<itemId>", e.g. "feature-abcdefgh"
 * - Any interactive components within each child, e.g. buttons or inputs, are disabled when the associated sortingEnabled boolean
 *   is true
 */
export function SortableGroup ({...props}: Props) {   
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
        orderChanged={props.orderChanged}
    />
    <SortableContainer
        sensors={props.sensors}
        handleDragEnd={props.onUpdate}
        sortableIds={props.sortableIds}
        sortableIdPrefix={props.sortableIdPrefix}
        sortingEnabled={props.sortingEnabled}
        setOrderChanged={props.setOrderChanged}
    >
        {props.children}
    </SortableContainer>
    </>
    )
};