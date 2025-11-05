import { useCallback, useState } from "react";

export function useCapsLock() {
  const [capsOn, setCapsOn] = useState(false);

  const update = useCallback((e: KeyboardEvent | React.KeyboardEvent) => {
    // Some environments may not support getModifierState
    const next = typeof (e as any).getModifierState === "function"
      ? (e as any).getModifierState("CapsLock")
      : false;
    setCapsOn(!!next);
  }, []);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => update(e), [update]);
  const onKeyUp = useCallback((e: React.KeyboardEvent) => update(e), [update]);
  const onFocus = useCallback((e: React.FocusEvent) => {
    // Attempt to read current state; some browsers update only on key events
    setTimeout(() => {
      try {
        // @ts-ignore
        const next = typeof e?.nativeEvent?.getModifierState === "function"
          ? // @ts-ignore
            e.nativeEvent.getModifierState("CapsLock")
          : false;
        setCapsOn(!!next);
      } catch {
        /* noop */
      }
    }, 0);
  }, []);
  const onBlur = useCallback(() => setCapsOn(false), []);

  return { capsOn, handlers: { onKeyDown, onKeyUp, onFocus, onBlur } } as const;
}
