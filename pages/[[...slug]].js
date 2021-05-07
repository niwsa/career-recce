import run from "lib/puppeteer-core-test";
import Head from "next/head";
import { useRouter } from "next/router";
// import styles from "../styles/Home.module.css";
import styles from "../styles/Home.v2.module.css";

export default function Home({ openings }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.container}`}>
      <Head>
        <title>👀</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.inpForm}>
          <form className={`h100 flx flx-col flx-cntr ${styles.form}`}>
            <div className="flx flx-cntr">
              <label htmlFor="cName">
                Company&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <input
                id="cName"
                type="text"
                placeholder="eg: Google"
                aria-label="Company Name"
                className="input"
                required
              ></input>
            </div>
            <div className="flx flx-cntr">
              <label htmlFor="cUrl">Career URL&nbsp;&nbsp;&nbsp;</label>
              <input
                id="cUrl"
                type="url"
                placeholder="eg: https://careers.google.com/jobs/results/"
                aria-label="Career URL"
                className="input"
                required
              ></input>
            </div>
          </form>
        </div>
        <div className={styles.scene}>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
          {/* <div className={styles.card}></div> */}
          {/* <div className={styles.card}></div> */}
        </div>
        <div className={styles.extraction}></div>

        {/* <div className={`${styles.containerIframe} w100`}>
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
        </div>*/}
        {/* <div className={`${styles.controls} flx flx-cntr`}>
          <div className="flx flx-col flx-cntr">
            <button
              type="button"
              className={styles.btn}
              aria-labelledby="btn-1"
            >
              R
            </button>
            <span id="btn-1" className={styles.lbl}>
              Remote
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
        </div>*/}
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  // Code for scraping job postings
  // Call an external API endpoint to get posts
  const { slug } = params;
  if (slug === undefined || slug.length !== 2) {
    return {
      props: {
        openings: null,
      },
    };
  } else {
    const {
      slug: [interests, companyCareerUrl],
    } = params;
    const [posts, browser] = await run({
      interests: decodeURIComponent(interests),
      companyCareerUrl: decodeURIComponent(companyCareerUrl),
    });
    let out = [];
    for (const post of posts) {
      const valueHandle = await post.getProperty("innerText");
      out.push(await valueHandle.jsonValue());
    }
    await browser.close();

    return {
      props: {
        openings: out,
      },
      // Next.js will attempt to re-generate the page:
      // - When a request comes in
      // - At most once every second
      revalidate: 1, // In seconds
    };
  }
}

export async function getStaticPaths() {
  // Statically generate /
  const paths = [{ params: { slug: null } }];

  // We'll pre-render only these paths at build time.
  // { fallback: true } means other routes not yet generated at build time
  // will serve a fallback page (Spinner) on first req while Next.js generates static
  // HTML and JSON in background.
  return { paths, fallback: true };
}
