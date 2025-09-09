import { useState, useCallback, useEffect } from "react";
import { type Field, useFormStore } from "../store/formStore";

type FormValue = string | number;

const usePreviewForm = (fields: Field[]) => {
  const [values, setValues] = useState<Record<string, FormValue>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => {
    setValues({});
    setErrors({});
  }, [fields]);
  const validateField = useCallback((field: Field, value: FormValue) => {
    const { validation, type } = field;
    let error = "";
    if (validation.required && (value === "" || value === undefined)) {
      error = "This field is required.";
    } else if (type === "number" && value !== "") {
      const numValue = Number(value);
      if (validation.min !== undefined && numValue < validation.min) {
        error = `Value must be at least ${validation.min}.`;
      }
      if (validation.max !== undefined && numValue > validation.max) {
        error = `Value must not exceed ${validation.max}.`;
      }
    }
    return error;
  }, []);
  const handleChange = useCallback(
    (id: string, value: FormValue) => {
      setValues((prev) => ({ ...prev, [id]: value }));
      const field = fields.find((f) => f.id === id);
      if (field) {
        const error = validateField(field, value);
        setErrors((prev) => ({ ...prev, [id]: error }));
      }
    },
    [fields, validateField]
  );
  return { values, errors, handleChange };
};

const FormPreview = () => {
  const fields = useFormStore((state) => state.fields);
  const { values, errors, handleChange } = usePreviewForm(fields);

  return (
    <div className="bg-white dark:bg-[#333533] p-6 rounded-xl border border-[#242423]/10 dark:border-[#E8EDDF]/10 h-full sticky top-24">
      <h2 className="text-xl font-bold mb-4 pb-3"> Live Preview </h2>
      {fields.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg h-48 flex items-center justify-center">
          <p className="text-[#333533]/70 dark:text-[#CFDBD5]/70">
            {" "}
            Your form will appear here.{" "}
          </p>
        </div>
      ) : (
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {fields.map((field) => (
            <div key={field.id}>
              <label className="block text-sm font-medium mb-1">
                {" "}
                {field.label}{" "}
                {field.validation.required && (
                  <span className="text-red-500">*</span>
                )}{" "}
              </label>
              {field.type === "text" && (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg focus:ring-2 focus:ring-[#F5CB5C] focus:border-[#F5CB5C] outline-none transition"
                />
              )}
              {field.type === "number" && (
                <input
                  type="number"
                  placeholder={field.placeholder}
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="form-input w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg focus:ring-2 focus:ring-[#F5CB5C] focus:border-[#F5CB5C] outline-none transition"
                />
              )}
              {field.type === "dropdown" && (
                <select
                  value={values[field.id] || ""}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                  className="form-select w-full p-2 bg-black/5 dark:bg-white/5 border-[#242423]/10 dark:border-[#E8EDDF]/10 rounded-lg focus:ring-2 focus:ring-[#F5CB5C] focus:border-[#F5CB5C] outline-none transition"
                >
                  {" "}
                  <option value="">
                    {" "}
                    {field.placeholder || "Select an option"}{" "}
                  </option>{" "}
                  {field.options?.map((option, index) => (
                    <option key={index} value={option}>
                      {" "}
                      {option}{" "}
                    </option>
                  ))}{" "}
                </select>
              )}
              {errors[field.id] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-[#F5CB5C] text-[#242423] font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity"
          >
            {" "}
            Submit{" "}
          </button>
        </form>
      )}
    </div>
  );
};

export default FormPreview;
