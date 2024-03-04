import { RefObject, useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";
import { useRect } from "./hooks/useRect";
import {
  Controls,
  FullscreenButton,
  MediaPlayer,
  MediaPlayerInstance,
  MediaProvider,
  MediaProviderAdapter,
  TimeSlider,
  isHLSProvider,
} from "@vidstack/react";
import classnames from "classnames";

interface Size {
  width: number;
  height: number;
}
const contain = (src: Size, dest: Size): Size => {
  const scale = Math.min(dest.width / src.width, dest.height / src.height);
  return {
    width: src.width * scale,
    height: src.height * scale,
  };
};

interface PlayerProps {
  fromContainerRef: RefObject<HTMLElement>;
  close: () => void;
}
export function Player({ fromContainerRef, close }: PlayerProps) {
  const toContainerRef = useRef<HTMLDivElement>(null);
  const fromContainerRect = useRect(fromContainerRef);
  const toContainerRect = useRect(toContainerRef);
  const measured =
    fromContainerRect !== undefined && toContainerRect !== undefined;

  const getScale = () => {
    if (fromContainerRect === undefined || toContainerRect === undefined)
      return 1;
    const videoSize = { width: 2048, height: 1556 };
    const fromSize = contain(videoSize, fromContainerRect);
    const toSize = contain(videoSize, toContainerRect);
    return Math.min(
      fromSize.width / toSize.width,
      fromSize.height / toSize.height
    );
  };

  const fromScale = getScale();

  const [showControls, setShowControls] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const playerRef = useRef<MediaPlayerInstance>(null);
  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.paused) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
  };

  return (
    <div ref={toContainerRef} className={styles.videoContainer}>
      <MediaPlayer
        ref={playerRef}
        className={styles.mediaPlayer}
        style={{ "--from-scale": fromScale, opacity: measured ? 1 : 0 }}
        src="PDS Temp for Site.mp4"
        autoplay
        onFullscreenChange={isFullscreen => {
          if (!isFullscreen) close();
        }}
        onProviderChange={onProviderChange}
      >
        <MediaProvider className={styles.mediaProvider} onClick={togglePlay} />
        {showControls && (
          <Controls.Root className={styles.controls}>
            <Controls.Group className={styles.controlsGroup}>
              <TimeSlider.Root className={styles.slider}>
                <TimeSlider.Track className={styles.track}>
                  <TimeSlider.TrackFill
                    className={classnames(styles.track, styles.trackFill)}
                  />
                </TimeSlider.Track>
                <TimeSlider.Preview className={styles.preview}>
                  <TimeSlider.Value className={styles.timeValue} />
                </TimeSlider.Preview>
              </TimeSlider.Root>
              <FullscreenButton className={styles.button}>
                <em>Fullscreen</em>
              </FullscreenButton>
              <button className={styles.button} onClick={close}>
                <em>Exit</em>
              </button>
            </Controls.Group>
          </Controls.Root>
        )}
      </MediaPlayer>
    </div>
  );
}

function onProviderChange(provider: MediaProviderAdapter | null) {
  if (isHLSProvider(provider)) {
    provider.library = () => import("hls.js");
  }
}
