import styles from "./Prelude.module.css";
import { Poem } from "./Poem";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

const STEPS = 12;
const DURATION = 3;

const useMetadataReady = (videoRef: RefObject<HTMLVideoElement>) => {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const video = videoRef.current!;
    if (video.readyState < 1) {
      console.log("waiting for metadata");
      const onReadyStateChange = () => {
        if (video.readyState >= 1) {
          console.log("got metadata");
          setReady(true);
        }
      };
      video.addEventListener("loadedmetadata", onReadyStateChange);
      return () => {
        video.removeEventListener("loadedmetadata", onReadyStateChange);
      };
    } else {
      setReady(true);
    }
  }, [videoRef]);
  return ready;
};

export function Prelude() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ready = useMetadataReady(videoRef);

  const [step, setStep] = useState(0);

  useLayoutEffect(() => {
    if (!ready) return;
    const next = () => flushSync(() => setStep((step + 1) % STEPS));
    if (step % 2 === 0) {
      const clipIndex = Math.floor(step / 2);
      const from = clipIndex * DURATION;
      const to = (clipIndex + 1) * DURATION - 1 / 24;
      const video = videoRef.current!;

      let frame: number;
      const tick = () => {
        if (video.currentTime >= to) {
          video.pause();
          cancelAnimationFrame(frame);
          next();
          const nextIndex = (clipIndex + 1) % (STEPS / 2);
          video.currentTime = nextIndex * DURATION;
        } else {
          frame = requestAnimationFrame(tick);
        }
      };

      video.currentTime = from;
      video.play();
      tick();

      return () => {
        video.pause();
        cancelAnimationFrame(frame);
      };
    } else {
      const timeout = setTimeout(next, DURATION * 1000);
      return () => clearTimeout(timeout);
    }
  }, [ready, step, videoRef]);

  const currentLine = step % 2 === 0 ? -1 : Math.floor(step / 2);
  const showVideo = ready && step % 2 === 0;

  return (
    <>
      <Poem currentLine={currentLine} />
      <video
        ref={videoRef}
        className={styles.video}
        src="prelude.mp4"
        loop
        muted
        playsInline
        style={{ opacity: showVideo ? 1 : 0 }}
      />
    </>
  );
}
