import { FaToggleOn } from "react-icons/fa6";
import { FaToggleOff } from "react-icons/fa6";
import useThemeToggle from "./usethemeToggle";


const ThemeSetting = ({ theme, setTheme }) => {
  const { handleToggle, isToggling } = useThemeToggle(theme, setTheme);
  // const handleUpdate = async (newValue) => {
  //   try {
  //    const res =  await fetch("http://localhost:5000/api/dashboard/settings/theme", {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ theme: newValue }),
  //     });
  //     const data = await res.json()
  //     if(!res.ok){
  //       toast.error(data.error)
  //     }else{
  //       toast.success("Theme updated successfully!");
  //     }
  //
  //
  //   } catch (err) {
  //     console.log("Error updating theme: ", err);
  //     toast.error("Failed to update theme, please try again later!");
  //   }
  // };
  //
  // const handleToggle = async () => {
  //   const newTheme = !theme;
  //   setTheme(newTheme); //update UI immediately
  //   await handleUpdate(newTheme); //then save it to the API
  // };

  return (
    <div
      className={` py-5 border-b w-full ${
        theme ? "border-[#3d4b55]" : "border-gray-300  "
      }`}
    >
      <h2 className="text-sm font-medium mb-2">🎨 Theme Preferences</h2>
      <div className="flex items-center justify-between ">
        <p>
          Current theme:{" "}
          <strong className={`  ${theme ? "headerDark" : "headerLight"}`}>
            {theme ? "Dark 🌙" : "Light 🔆"}
          </strong>
        </p>
        <button
          onClick={handleToggle}
          disabled={isToggling}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition duration-200
      hover:bg-orange-500 hover:text-white
        ${
          theme
            ? "bg-gray-800 text-white border-gray-700"
            : "bg-gray-100 text-black border-gray-300"
        }
       `}
        >
          {theme ? (
            <FaToggleOn className="text-xl" />
          ) : (
            <FaToggleOff className="text-xl" />
          )}
          {theme ? "Switch to Light Mode" : "Switch to Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default ThemeSetting;
