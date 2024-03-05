import classnames from "classnames";
import styles from "./PreludeVideo.module.css";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { HLSVideo } from "./HLSVideo";

const srcs = [
  "https://player.vimeo.com/progressive_redirect/playback/919298027/rendition/1080p/file.mp4?loc=external&log_user=0&signature=5480fa04f4f948cbaae377d06739e02363b07c7539492e181d3915894225e9b1",
  "https://player.vimeo.com/progressive_redirect/playback/919297979/rendition/1080p/file.mp4?loc=external&log_user=0&signature=f64349a7468a3af0b4981b022e5cea3c0fa44621b23d06e711508a4526a561df",
  "https://player.vimeo.com/progressive_redirect/playback/919297931/rendition/1080p/file.mp4?loc=external&log_user=0&signature=6d5dc4bf0ac43333c357ee0e487c8b408199ec6367a6aac2a8bf962750e766e3",
  "https://player.vimeo.com/progressive_redirect/playback/919297882/rendition/1080p/file.mp4?loc=external&log_user=0&signature=2f9d97d16406b94903518e95b9dce173129ea4e47dbf91e21019aabb8cbb75a8",
  "https://player.vimeo.com/progressive_redirect/playback/919297847/rendition/1080p/file.mp4?loc=external&log_user=0&signature=7767c9ae8d7eef30f7dab00911dff37100aaf298bd4baacdf94343b671814504",
  "https://player.vimeo.com/progressive_redirect/playback/919297780/rendition/1080p/file.mp4?loc=external&log_user=0&signature=7f55493fd0f62ef2c5f88ffb522defd964d5ea797106b1e8ce6515f7c23de53d",
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
    <HLSVideo
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
