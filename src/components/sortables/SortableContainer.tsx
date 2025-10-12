import {
  DndContext, 
  closestCenter,
  SensorDescriptor,
  SensorOptions,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Children, isValidElement, ReactNode } from 'react';

interface Props {
    sensors: SensorDescriptor<SensorOptions>[];
    handleDragEnd: (event: any) => void;
    sortableIds: string[];
    sortableIdPrefix: 'feature' | 'spell' | 'note' | 'summonable' | 'weapon';
    sortingEnabled: boolean;
    children: ReactNode;
}

const getChildEl = (children: ReactNode, id: string, idPrefix: string): ReactNode => {
    let foundChild = null;
    Children.forEach(children, child => {
        if (isValidElement(child) && child.props.id === `${idPrefix}-${id}`) {
            foundChild = child;
        }
    });    
    return foundChild;
}

export function SortableContainer ({...props}: Props) {
    return (
        <DndContext
            sensors={props.sensors}
            collisionDetection={closestCenter}
            onDragEnd={props.handleDragEnd}
            >
            <SortableContext 
                items={props.sortableIds}
                strategy={verticalListSortingStrategy}
                disabled={!props.sortingEnabled}
            >
                {props.sortableIds.map(id => 
                <SortableItem id={id} key={id} enabled={props.sortingEnabled}>
                    {getChildEl(props.children, id, props.sortableIdPrefix)}
                </SortableItem>)
                }
            </SortableContext>
        </DndContext>
    );    
}