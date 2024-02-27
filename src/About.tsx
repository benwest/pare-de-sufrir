import styles from "./About.module.css";

function Credits() {
  // prettier-ignore
  return (
    <div className={styles.credits}>
      Once&nbsp;de&nbsp;Julio <em>and</em>&nbsp;Forchela <em>and</em>&nbsp;Lupara,&nbsp;Inc. <em>presentan</em><br />
      <em>With&nbsp;performances&nbsp;by</em>&nbsp;Julian&nbsp;Huckleby <em>and</em>&nbsp;David&nbsp;Gonzales&nbsp;Rojas <em>and</em>&nbsp;Jason&nbsp;Newman{" "}
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
        <em>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin et
          varius elit. Vivamus scelerisque ligula sit amet tellus mattis
          maximus. Vestibulum ante ipsum primis in faucibus orci luctus et
          ultrices posuere cubilia curae; Cras bibendum volutpat nisl, in
          ultrices enim. Pellentesque vel euismod nisl. Vivamus eu dapibus
          felis, ac varius nibh. Duis aliquet risus orci, non faucibus mi
          placerat a. Integer lacinia massa non nunc accumsan, quis porttitor
          nisi lobortis. Vestibulum vitae elementum lacus. Donec pretium a nisl
          et sagittis.
        </em>
      </div>
      <img className={styles.painting} src="PDS Painting ADJ WB.jpg" />
    </section>
  );
}
