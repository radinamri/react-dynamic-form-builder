import { useFormStore } from "./store/formStore";
import FormBuilder from "./components/FormBuilder";
import FormPreview from "./components/FormPreview";
import FieldConfigurator from "./components/FieldConfigurator";

function App() {
  const selectedFieldId = useFormStore((state) => state.selectedFieldId);
  const { saveToLocalStorage, loadFromLocalStorage } = useFormStore();

  return (
    <div className="min-h-screen bg-[#E8EDDF] text-[#242423] dark:bg-[#242423] dark:text-[#E8EDDF] font-sans transition-colors duration-300">
      <header className="sticky top-0 z-10 border-b border-[#242423]/10 dark:border-[#E8EDDF]/10 bg-[#E8EDDF]/80 dark:bg-[#242423]/80 backdrop-blur-sm">
        <div className="mx-auto flex justify-between items-center p-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl font-bold">
            React Dynamic Form Builder
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={saveToLocalStorage}
              className="bg-[#242423] dark:bg-[#E8EDDF] text-[#E8EDDF] dark:text-[#242423] font-semibold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base"
            >
              Save
            </button>
            <button
              onClick={loadFromLocalStorage}
              className="bg-black/5 dark:bg-white/5 font-semibold py-2 px-4 rounded-lg border border-[#242423]/10 dark:border-[#E8EDDF]/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm sm:text-base"
            >
              Load
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-6">
          <FormBuilder />
          <FieldConfigurator key={selectedFieldId} />
        </div>
        <div className="lg:col-span-2">
          <FormPreview />
        </div>
      </main>
    </div>
  );
}

export default App;
