import styles from "./Poem.module.css";

const poem = `Esta terquedad<br/> de las manos
Esta búsqueda<br/> en el silencio
No es otra cosa<br/> que este corazón
Que busca una sombra<br/> y un sueño
A lo mejor no vendré<br/> a tiempo
Pero vendré de todos modos<br/> en las formas alargadas
De la noche y dormiré<br/> en tu casa
Como quien duerme<br/> en el lugar más dulce
Yo soy el traslúcido<br/> la espalda arrojada
A las cenizas el beso<br/> que se queda suspendido
en las estrellas roto<br/> y renacido una cosecha
que se recoge<br/> en el final del tiempo`.split("\n");

interface PoemProps {
  currentLine: number;
}
export function Poem({ currentLine }: PoemProps) {
  return (
    <div className={styles.poem}>
      {poem.map((line, i) => (
        <p
          key={i}
          className={
            Math.floor(i / 2) === currentLine ? styles.currentLine : undefined
          }
          dangerouslySetInnerHTML={{ __html: line }}
        />
      ))}
    </div>
  );
}
