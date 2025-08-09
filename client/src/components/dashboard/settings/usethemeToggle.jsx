import { useState } from "react";
import { toast } from "react-toastify";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const useThemeToggle = (initialTheme, setTheme) => {
  const [isToggling, setIsToggling] = useState(false);

  const handleUpdate = async (newValue) => {
    try {
      setIsToggling(true);
      const res = await fetchWithAuth(
        "/api/dashboard/settings/theme",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newValue }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error);
        return false;
      } else {
        //toast.success("Theme updated successfully!");
        return true;
      }
    } catch (err) {
      console.log("Error updating theme: ", err);
      toast.error("Failed to update theme, please try again later!");
      return false;
    } finally {
      setIsToggling(false);
    }
  };

  const handleToggle = async () => {
    const newTheme = !initialTheme;
    setTheme(newTheme); // Update UI immediately
    await handleUpdate(newTheme); // Save to API
  };

  return { handleToggle, isToggling };
};

export default useThemeToggle;
