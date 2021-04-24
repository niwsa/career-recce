import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={`${styles.container} flx flx-col flx-cntr`}>
      <Head>
        <title>👀</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} flx flx-cntr flx-col w100`}>
        <div className={`${styles.containerIframe} w100`}>
          <iframe
            className={`${styles.respIframe} w100 h100`}
            loading="lazy"
            src="https://www.spotifyjobs.com/locations/mumbai"
            onLoad={() => console.log(`Iframe loaded`)}
            sandbox="allow-scripts allow-same-origin allow-popups"
            onError={(err) => {
              console.error(`Iframe load error`);
              console.table(err);
            }}
          ></iframe>
        </div>
        <div className={`${styles.controls} flx flx-cntr`}>
          <div className="flx flx-col flx-cntr">
            <button
              type="button"
              className={styles.btn}
              aria-labelledby="btn-1"
            >
              S
            </button>
            <span id="btn-1" className={styles.lbl}>
              Spotify
            </span>
          </div>
          <div className="flx flx-col flx-cntr">
            <button
              type="button"
              className={styles.btn}
              aria-labelledby="btn-2"
            >
              L
            </button>
            <span id="btn-2" className={styles.lbl}>
              Loom
            </span>
          </div>
          <div className="flx flx-col flx-cntr">
            <button
              type="button"
              className={styles.btn}
              aria-labelledby="btn-3"
            >
              E
            </button>
            <span id="btn-3" className={styles.lbl}>
              Elastic
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
