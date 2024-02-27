import { RefObject, useEffect, useRef, useState } from "react";
import styles from "./Player.module.css";
import { useRect } from "./hooks/useRect";

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
  const videoRef = useRef<HTMLVideoElement>(null);
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
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [isIdle, setIsIdle] = useState(true);
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const onMouseMove = () => {
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => {
        setIsIdle(true);
      }, 2500);
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={toContainerRef} className={styles.videoContainer}>
      <video
        className={styles.video}
        ref={videoRef}
        src="PDS Temp for Site.mp4"
        autoPlay
        controls={showControls}
        style={{ "--from-scale": fromScale, opacity: measured ? 1 : 0 }}
      />
      <div
        className={styles.close}
        onClick={close}
        style={{ opacity: showControls && !isIdle ? 1 : 0 }}
      >
        Exit
      </div>
    </div>
    // <div
    //   className={styles.player}
    //   style={{ "--from-scale": fromScale, opacity: measured ? 1 : 0 }}
    // >
    //   <div ref={toContainerRef} className={styles.videoContainer}>
    //   </div>
    // </div>
  );
}
