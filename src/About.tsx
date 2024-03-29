import { useEffect, useRef } from "react";
import styles from "./About.module.css";

function Credits() {
  // prettier-ignore
  return (
    <div className={styles.credits}>
      Once&nbsp;de&nbsp;Julio <em>and</em>&nbsp;Forchela <em>and</em>&nbsp;Lupara,&nbsp;Inc. <em>presentan</em><br />
      <em>With&nbsp;performances&nbsp;by</em>&nbsp;Julian&nbsp;Huckleby <em>and</em>&nbsp;David&nbsp;Gonzalez&nbsp;Rojas <em>and</em>&nbsp;Jason&nbsp;Newman{" "}
      <em>Written,&nbsp;Directed&nbsp;&&nbsp;Edited by</em>&nbsp;A.G.&nbsp;Rojas <em>Produced&nbsp;by</em>&nbsp;Grace&nbsp;Campos <em>and</em>&nbsp;Pete&nbsp;Vitale <em>and</em>&nbsp;Caroline&nbsp;Kousidonis <em>and</em>&nbsp;A.G.&nbsp;Rojas{" "}
      <em>Cinematographer</em>&nbsp;Evan&nbsp;Prosofsky <em>Production&nbsp;Designer</em>&nbsp;Quito&nbsp;Cooksey <em>Costume&nbsp;Designer</em>&nbsp;Camille&nbsp;Garmendia{" "}
      <em>Music&nbsp;composed&nbsp;by</em>&nbsp;James&nbsp;William&nbsp;Blades
    </div>
  )
}

export function About() {
  return (
    <section className={styles.about} id="about">
      <div className={styles.title}>
        <div className={styles.titleSticky}>
          <h2>
            <a href="#about">About</a>
          </h2>
        </div>
      </div>
      <Credits />
      <div className={styles.body}>
        <em>For screening requests:</em>{" "}
        <a href="mailto:agfilm@gmail.com" target="_blank">
          agfilm@gmail.com
        </a>
      </div>
      <Painting />
    </section>
  );
}

function remap(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
) {
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}

function Painting() {
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const img = ref.current!;
    let frame: number;
    const tick = () => {
      const brightness = remap(Math.sin(Date.now() / 1000), -1, 1, 1, 1.4);
      img.style.filter = `brightness(${brightness})`;
      frame = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(frame);
  }, []);
  return (
    <img ref={ref} className={styles.painting} src="PDS Painting ADJ WB.png" />
  );
}
