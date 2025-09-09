import { useFormStore } from "../store/formStore";
import DraggableFieldItem from "./DraggableFieldItem";

const FormBuilder = () => {
  const fields = useFormStore((state) => state.fields);
  const addField = useFormStore((state) => state.addField);

  return (
    <div className="bg-white dark:bg-[#333533] p-6 rounded-xl border border-[#242423]/10 dark:border-[#E8EDDF]/10">
      <h2 className="text-xl font-bold mb-4 pb-3">Form Elements</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <button
          onClick={() => addField("text")}
          className="bg-[#F5CB5C] text-[#242423] p-2 rounded-lg hover:opacity-90 transition-opacity w-full font-semibold"
        >
          Add Text
        </button>
        <button
          onClick={() => addField("number")}
          className="bg-[#F5CB5C] text-[#242423] p-2 rounded-lg hover:opacity-90 transition-opacity w-full font-semibold"
        >
          Add Number
        </button>
        <button
          onClick={() => addField("dropdown")}
          className="bg-[#F5CB5C] text-[#242423] p-2 rounded-lg hover:opacity-90 transition-opacity w-full font-semibold"
        >
          Add Dropdown
        </button>
      </div>
      <div className="space-y-3">
        {fields.length > 0 ? (
          fields.map((field, index) => (
            <DraggableFieldItem key={field.id} field={field} index={index} />
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg">
            <p className="text-[#333533]/70 dark:text-[#CFDBD5]/70">
              Add a field to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
