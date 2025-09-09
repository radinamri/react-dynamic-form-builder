import { useFormStore } from "../store/formStore";

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

const FieldConfigurator = () => {
  const { fields, selectedFieldId, updateField } = useFormStore();
  const selectedField = fields.find((f) => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="bg-white dark:bg-[#333533] p-6 rounded-xl border border-[#242423]/10 dark:border-[#E8EDDF]/10 flex items-center justify-center min-h-[200px]">
        <p className="text-[#333533]/70 dark:text-[#CFDBD5]/70">
          Select a field to configure its properties.
        </p>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<typeof selectedField>) => {
    updateField(selectedField.id, updates);
  };
  const handleValidationUpdate = (
    validationUpdates: Partial<typeof selectedField.validation>
  ) => {
    handleUpdate({
      validation: { ...selectedField.validation, ...validationUpdates },
    });
  };
  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(selectedField.options || [])];
    newOptions[index] = value;
    handleUpdate({ options: newOptions });
  };
  const addOption = () => {
    const newOptions = [
      ...(selectedField.options || []),
      `Option ${(selectedField.options?.length || 0) + 1}`,
    ];
    handleUpdate({ options: newOptions });
  };
  const removeOption = (index: number) => {
    const newOptions = (selectedField.options || []).filter(
      (_, i) => i !== index
    );
    handleUpdate({ options: newOptions });
  };

  return (
    <div className="bg-white dark:bg-[#333533] p-6 rounded-xl border border-[#242423]/10 dark:border-[#E8EDDF]/10">
      <h2 className="text-xl font-bold mb-4 pb-3">Properties</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#333533] dark:text-[#CFDBD5] mb-1">
            {" "}
            Label{" "}
          </label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => handleUpdate({ label: e.target.value })}
            className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg focus:ring-2 focus:ring-[#F5CB5C] focus:border-[#F5CB5C] outline-none transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#333533] dark:text-[#CFDBD5] mb-1">
            {" "}
            Placeholder{" "}
          </label>
          <input
            type="text"
            value={selectedField.placeholder || ""}
            onChange={(e) => handleUpdate({ placeholder: e.target.value })}
            className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg focus:ring-2 focus:ring-[#F5CB5C] focus:border-[#F5CB5C] outline-none transition"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="required"
            checked={selectedField.validation.required || false}
            onChange={(e) =>
              handleValidationUpdate({ required: e.target.checked })
            }
            className="form-checkbox h-4 w-4 rounded text-[#F5CB5C] border-[#242423]/20 dark:border-[#E8EDDF]/20 bg-black/5 dark:bg-white/5 focus:ring-[#F5CB5C]"
          />
          <label htmlFor="required" className="ml-2 block text-sm font-medium">
            {" "}
            Required{" "}
          </label>
        </div>
        {selectedField.type === "number" && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333533] dark:text-[#CFDBD5] mb-1">
                {" "}
                Min Value{" "}
              </label>
              <input
                type="number"
                value={selectedField.validation.min ?? ""}
                onChange={(e) =>
                  handleValidationUpdate({
                    min:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333533] dark:text-[#CFDBD5] mb-1">
                {" "}
                Max Value{" "}
              </label>
              <input
                type="number"
                value={selectedField.validation.max ?? ""}
                onChange={(e) =>
                  handleValidationUpdate({
                    max:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
                className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg"
              />
            </div>
          </div>
        )}
        {selectedField.type === "dropdown" && (
          <div>
            <label className="block text-sm font-medium text-[#333533] dark:text-[#CFDBD5] mb-2">
              {" "}
              Options{" "}
            </label>
            <div className="space-y-2">
              {(selectedField.options || []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="text-[#333533]/70 dark:text-[#CFDBD5]/70 hover:text-red-500 transition-colors p-1"
                    aria-label="Remove option"
                  >
                    {" "}
                    <TrashIcon />{" "}
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addOption}
              className="text-sm font-semibold mt-3 border border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg px-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              {" "}
              Add Option{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default FieldConfigurator;
