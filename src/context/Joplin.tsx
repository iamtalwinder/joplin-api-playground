import React, { createContext, useState } from "react";
import { Joplin } from "../types";

type Props = {
  children: React.ReactNode;
};

const initialState: Joplin = { authToken: "", port: 41184 };

export const Context = createContext<{
  joplin: Joplin;
  setJoplin: React.SetStateAction<any>;
}>({ joplin: initialState, setJoplin: () => null });

Context.displayName = "JoplinContext";

export default function ContextProvider({ children }: Props) {
  const [joplin, setJoplin] = useState<Joplin>(initialState);

  return (
    <Context.Provider value={{ joplin, setJoplin }}>
      {children}
    </Context.Provider>
  );
}
