import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from "react";
import { suspend } from "suspend-react";

const isSupported = (() => {
  const video = document.createElement("video");
  return video.canPlayType("application/vnd.apple.mpegurl") !== "";
})();

const importHls = () => import("hls.js");

const HLSJSVideo = forwardRef<HTMLVideoElement, ComponentProps<"video">>(
  ({ src, ...props }, externalRef) => {
    const ref = useRef<HTMLVideoElement>(null);
    useImperativeHandle(externalRef, () => ref.current!);

    const { default: Hls } = suspend(importHls);

    useLayoutEffect(() => {
      const video = ref.current!;
      const hlsInstance = new Hls();
      hlsInstance.attachMedia(video);
      hlsInstance.loadSource(src ?? "");
      return () => {
        hlsInstance.destroy();
      };
    }, [Hls, src]);

    return <video ref={ref} {...props} />;
  }
);

const isHLSUrl = (url: string) => /\.m3u8/.test(url);

export const HLSVideo = forwardRef<HTMLVideoElement, ComponentProps<"video">>(
  (props, ref) => {
    if (isHLSUrl(props.src ?? "") && !isSupported) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return <HLSJSVideo ref={ref as any} {...props} />;
    } else {
      return <video ref={ref} {...props} />;
    }
  }
);
