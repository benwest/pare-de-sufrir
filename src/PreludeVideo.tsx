import classnames from "classnames";
import styles from "./PreludeVideo.module.css";
import { useCallback, useEffect, useRef } from "react";

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
  const loaded = useRef({} as Record<string, boolean>).current;
  const onLoad = useCallback(
    (src: string) => {
      loaded[src] = true;
      if (Object.keys(loaded).length === srcs.length) onReady();
    },
    [loaded, onReady]
  );

  return (
    <>
      {srcs.map((src, i) => (
        <Clip
          key={i}
          src={src}
          isCurrent={i === currentClip}
          onLoad={onLoad}
          onEnd={onEnd}
          isReady={Object.keys(loaded).length === srcs.length}
        />
      ))}
    </>
  );
}

interface ClipProps {
  src: string;
  isCurrent: boolean;
  isReady: boolean;
  onLoad: (src: string) => void;
  onEnd: () => void;
}
function Clip({ src, isCurrent, isReady, onLoad, onEnd }: ClipProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current!;
    video.load();
    if (video.readyState > 3) onLoad(src);
  }, [onLoad, src]);

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
      className={classnames(
        styles.video,
        isCurrent && styles.current,
        isReady && styles.ready
      )}
      src={src}
      onCanPlayThrough={() => onLoad(src)}
      onEnded={e => {
        if (isCurrent) onEnd();
        (e.target as HTMLVideoElement).currentTime = 0;
      }}
      playsInline
      muted
    />
  );
}
