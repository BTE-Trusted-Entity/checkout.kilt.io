import { createContext, useContext, useMemo, useState } from 'react';

interface ShowOverlayContextType {
  visible: boolean;

  showOverlay(value: boolean): void;
}

const ShowOverlayContext = createContext<ShowOverlayContextType>({
  visible: false,
  showOverlay() {
    return;
  },
});

export function useShowOverlay() {
  return useContext(ShowOverlayContext);
}

export function ShowOverlayProvider({ children }: { children: JSX.Element }) {
  const [visible, showOverlay] = useState(false);
  const value = useMemo(() => ({ visible, showOverlay }), [visible]);
  return (
    <ShowOverlayContext.Provider value={value}>
      {children}
    </ShowOverlayContext.Provider>
  );
}
