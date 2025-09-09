import React, { useRef } from "react";
import { useDrag, useDrop, type DropTargetMonitor } from "react-dnd";
import { type Field, useFormStore } from "../store/formStore";

interface DragItem {
  index: number;
  id: string;
}
const ItemType = "FIELD";

const TrashIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />{" "}
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />{" "}
    <line x1="10" y1="11" x2="10" y2="17" />{" "}
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

const DraggableFieldItem: React.FC<{ field: Field; index: number }> = ({
  field,
  index,
}) => {
  const { removeField, selectField, reorderFields, selectedFieldId } =
    useFormStore();
  const ref = useRef<HTMLDivElement>(null);
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: (): DragItem => ({ id: field.id, index }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop<DragItem, void, unknown>({
    accept: ItemType,
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      reorderFields(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });
  drag(drop(ref));

  const isSelected = selectedFieldId === field.id;
  const opacity = isDragging ? 0.5 : 1;
  const baseClasses =
    "p-3 rounded-lg flex justify-between items-center cursor-pointer transition-all border";
  const selectedClasses = isSelected
    ? "border-[#F5CB5C] bg-[#F5CB5C]/20"
    : "border-[#242423]/10 dark:border-[#E8EDDF]/10 bg-[#CFDBD5]/40 dark:bg-white/5 hover:border-[#242423]/20 dark:hover:border-[#E8EDDF]/20";

  return (
    <div
      ref={ref}
      style={{ opacity }}
      onClick={() => selectField(field.id)}
      className={`${baseClasses} ${selectedClasses}`}
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold">{field.label}</span>
        <span className="text-xs uppercase bg-black/5 dark:bg-white/10 text-[#333533] dark:text-[#CFDBD5] px-2 py-1 rounded-full font-medium">
          {" "}
          {field.type}{" "}
        </span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
        className="text-[#333533]/70 dark:text-[#CFDBD5]/70 hover:text-red-500 transition-colors"
        aria-label="Remove field"
      >
        <TrashIcon />
      </button>
    </div>
  );
};
export default React.memo(DraggableFieldItem);
