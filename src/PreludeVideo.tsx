import classnames from "classnames";
import styles from "./PreludeVideo.module.css";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

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
  const [playFailed, setPlayFailed] = useState(false);

  useLayoutEffect(() => {
    const video = ref.current!;
    if (video.readyState > 3) {
      onLoad(src);
    } else {
      video.load();
    }
  }, [onLoad, src]);

  useLayoutEffect(() => {
    const video = ref.current!;
    if (isCurrent) {
      video.play().catch(() => setPlayFailed(true));
    }
  }, [isCurrent]);

  useEffect(() => {
    const video = ref.current!;
    if (!isCurrent) {
      video.pause();
      video.currentTime = 0;
    }
  }, [isCurrent]);

  useEffect(() => {
    if (playFailed && isCurrent) {
      const timer = setTimeout(onEnd, ref.current!.duration * 1000);
      return () => clearTimeout(timer);
    }
  }, [isCurrent, onEnd, playFailed]);

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
      onEnded={() => {
        if (isCurrent) onEnd();
      }}
      playsInline
      muted
    />
  );
}
