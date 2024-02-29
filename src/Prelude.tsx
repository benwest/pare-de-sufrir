import { Poem } from "./Poem";
import { useCallback, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { PreludeVideo } from "./PreludeVideo";

const STEPS = 12;
const DURATION = 3;

export function Prelude() {
  const [step, setStep] = useState(0);
  const next = useCallback(
    () => flushSync(() => setStep(step => (step + 1) % STEPS)),
    []
  );

  const [ready, setReady] = useState(false);

  const phase = step % 2 === 0 ? "clip" : "line";
  const currentLine = ready && phase === "line" ? Math.floor(step / 2) : -1;
  const currentClip = ready && phase === "clip" ? Math.floor(step / 2) : -1;

  useEffect(() => {
    if (phase === "line") {
      const timeout = setTimeout(next, DURATION * 1000);
      return () => clearTimeout(timeout);
    }
  }, [phase, next]);

  return (
    <>
      <Poem currentLine={currentLine} />
      <PreludeVideo
        currentClip={currentClip}
        onReady={() => setReady(true)}
        onEnd={() => setStep(step + 1)}
      />
    </>
  );
}
