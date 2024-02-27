import { useRef, useState } from "react";
import styles from "./App.module.css";
import { Prelude } from "./Prelude";
import { Player } from "./Player";
import { About } from "./About";

function App() {
  const [started, setStarted] = useState(false);
  const preludeVideoContainerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <section className={styles.home}>
        <div className={styles.top}>
          <h1>Pare de Sufrir</h1>
        </div>
        <div
          ref={preludeVideoContainerRef}
          className={styles.middle}
          onClick={() => setStarted(true)}
        >
          <Prelude />
        </div>
        <div className={styles.bottom}>
          <h2>
            Begin <em>(48:19)</em>
          </h2>
        </div>
      </section>
      <About />
      {started && (
        <Player
          fromContainerRef={preludeVideoContainerRef}
          close={() => setStarted(false)}
        />
      )}
    </>
  );
}

export default App;
