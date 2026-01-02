import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import { ReactNode } from 'react';

interface Props {
    id: string;
    key: string;
    children: ReactNode;
    enabled: boolean;
}

export function SortableItem ({...props}: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  
  return (
    <div className={props.enabled ? "sortable-item sortable-item-enabled" : "sortable-item sortable-item-disabled"} ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="col sortable-item-children">{props.children}</div>
    </div>
  );
}