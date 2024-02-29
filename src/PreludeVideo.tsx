import classnames from "classnames";
import styles from "./PreludeVideo.module.css";
import { useCallback, useEffect, useRef, useState } from "react";

const srcs = [
  "prelude_0.mp4",
  "prelude_1.mp4",
  "prelude_2.mp4",
  "prelude_3.mp4",
  "prelude_4.mp4",
  "prelude_5.mp4",
];

interface PreludeVideoProps {
  currentClip: number;
  onReady: () => void;
  onEnd: () => void;
}
export function PreludeVideo({
  currentClip,
  onReady,
  onEnd,
}: PreludeVideoProps) {
  const [loaded, setLoaded] = useState(0);
  const onLoad = useCallback(() => {
    const numLoaded = loaded + 1;
    setLoaded(numLoaded);
    if (numLoaded === srcs.length - 1) onReady();
  }, [loaded, onReady]);

  return (
    <>
      {srcs.slice(0, loaded + 1).map((src, i) => (
        <Clip
          key={i}
          src={src}
          isCurrent={i === currentClip}
          onLoad={onLoad}
          onEnd={onEnd}
        />
      ))}
    </>
  );
}

interface ClipProps {
  src: string;
  isCurrent: boolean;
  onLoad: () => void;
  onEnd: () => void;
}
function Clip({ src, isCurrent, onLoad, onEnd }: ClipProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.load();
  }, []);

  useEffect(() => {
    const video = ref.current!;
    video.currentTime = 0;
    if (isCurrent) {
      video.play();
    }
  }, [isCurrent]);

  return (
    <video
      ref={ref}
      className={classnames(styles.video, isCurrent && styles.current)}
      src={src}
      onCanPlayThrough={onLoad}
      onEnded={e => {
        if (isCurrent) onEnd();
        (e.target as HTMLVideoElement).currentTime = 0;
      }}
      playsInline
      muted
    />
  );
}
