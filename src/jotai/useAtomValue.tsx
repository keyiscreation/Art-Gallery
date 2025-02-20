import { useAtom, Atom } from "jotai";

import { atoms } from "./atoms";

export const useAtomValue = (atomKey: string) => {
  if (!atomKey) throw new Error("Please provide a jotai atom key!");

  if (!atoms[atomKey]) {
    throw new Error(
      `Please provide a valid jotai State atom as the key -> "${atomKey}"  does not exist in atoms`
    );
  }

  const [value, setValue] = useAtom(atoms[atomKey]);

  return [value, setValue];
};
