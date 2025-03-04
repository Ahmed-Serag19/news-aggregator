import { useState } from "react";

type Preferences = {
  sources: string[];
  categories: string[];
};

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>({
    sources: [],
    categories: [],
  });

  const updatePreferences = (newPreferences: Preferences) => {
    setPreferences(newPreferences);
  };

  return { preferences, updatePreferences };
}
