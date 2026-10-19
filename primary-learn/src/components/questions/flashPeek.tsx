import { createContext, useContext, type ReactNode } from "react";

type FlashPeekApi = {
  /** How many times Look again was tapped on this question. */
  lookAgainCount: number;
  recordLookAgain: () => void;
};

const FlashPeekContext = createContext<FlashPeekApi>({
  lookAgainCount: 0,
  recordLookAgain: () => {},
});

export function FlashPeekProvider({
  lookAgainCount,
  recordLookAgain,
  children,
}: FlashPeekApi & { children: ReactNode }) {
  return (
    <FlashPeekContext.Provider value={{ lookAgainCount, recordLookAgain }}>
      {children}
    </FlashPeekContext.Provider>
  );
}

export function useFlashPeek() {
  return useContext(FlashPeekContext);
}
