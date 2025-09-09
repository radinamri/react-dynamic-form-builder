import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type FieldType = "text" | "number" | "dropdown";

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  validation: {
    required?: boolean;
    min?: number;
    max?: number;
  };
  options?: string[];
}

interface FormState {
  fields: Field[];
  selectedFieldId: string | null;
  addField: (type: FieldType) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<Field>) => void;
  reorderFields: (sourceIndex: number, destinationIndex: number) => void;
  selectField: (id: string | null) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

const createNewField = (type: FieldType): Field => {
  const baseField = {
    id: uuidv4(),
    type,
    label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
    placeholder: "",
    validation: { required: false },
  };

  if (type === "number") {
    return {
      ...baseField,
      validation: { ...baseField.validation, min: 0, max: 100 },
    };
  }
  if (type === "dropdown") {
    return { ...baseField, options: ["Option 1", "Option 2", "Option 3"] };
  }
  return baseField;
};

export const useFormStore = create<FormState>((set, get) => ({
  fields: [],
  selectedFieldId: null,

  selectField: (id) => set({ selectedFieldId: id }),

  addField: (type) => {
    const newField = createNewField(type);
    set((state) => ({ fields: [...state.fields, newField] }));
    get().selectField(newField.id);
  },

  removeField: (id) => {
    set((state) => {
      const newFields = state.fields.filter((field) => field.id !== id);
      const newSelectedId =
        state.selectedFieldId === id ? null : state.selectedFieldId;
      return { fields: newFields, selectedFieldId: newSelectedId };
    });
  },

  updateField: (id, updates) => {
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field
      ),
    }));
  },

  reorderFields: (sourceIndex, destinationIndex) => {
    set((state) => {
      const result = Array.from(state.fields);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return { fields: result };
    });
  },

  saveToLocalStorage: () => {
    const { fields } = get();
    localStorage.setItem("formBuilderState", JSON.stringify(fields));
    alert("Form saved to LocalStorage!");
  },

  loadFromLocalStorage: () => {
    const savedState = localStorage.getItem("formBuilderState");
    if (savedState) {
      try {
        const fields = JSON.parse(savedState);
        set({ fields, selectedFieldId: null });
        alert("Form loaded from LocalStorage!");
      } catch (error) {
        console.error("Failed to parse state from LocalStorage", error);
        alert("Failed to load form from LocalStorage.");
      }
    } else {
      alert("No saved form found in LocalStorage.");
    }
  },
}));
