import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/Home.v2.module.css";
import { screenshotPage } from "lib/screenshot";

const trackedJobs = [
  {
    interests: "Frontend",
    jobPage: "https%3A%2F%2Fboards.greenhouse.io%2Fremotecom",
  },
  {
    interests: "Subscription",
    jobPage: "https%3A%2F%2Fwww.spotifyjobs.com%2Flocations%2Fmumbai",
  },
];
export default function Home({ imageUrl }) {
  const router = useRouter();

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
              <label htmlFor="cName">Company</label>
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
              <label htmlFor="cUrl">Career URL</label>
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
          <div className={styles.card}>
            <Link
              href={`/${trackedJobs[0].interests}/${trackedJobs[0].jobPage}`}
            >
              <a>Remote.com</a>
            </Link>
          </div>
          <div className={styles.card}>
            <Link
              href={`/${trackedJobs[1].interests}/${trackedJobs[1].jobPage}`}
            >
              <a>Spotify</a>
            </Link>
          </div>
          <div className={styles.card}></div>
          <div className={styles.card}></div>
        </div>
        <div className={styles.extraction}>
          <blockquote>
            {router.isFallback ? (
              "Scanning the job page..."
            ) : imageUrl ? (
              <Image
                alt="Job Openings"
                src={imageUrl}
                layout="responsive"
                width={600}
                height={253.125}
              />
            ) : null}
          </blockquote>
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps({ params }) {
  // Code for scraping job postings
  // Call an external API endpoint to get posts
  const { slug } = params;
  let out = "";

  if (Array.isArray(slug) && slug.length === 2) {
    const {
      slug: [interests, companyCareerUrl],
    } = params;

    if (interests && companyCareerUrl) {
      const [imageUrl, browser] = await screenshotPage({
        interests,
        companyCareerUrl,
      });
      out = imageUrl;
      await browser.close();
    }
  }

  return {
    props: {
      imageUrl: out,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 1, // In seconds
  };
}

export async function getStaticPaths() {
  // We'll pre-render only these paths at build time.
  // Statically generate /
  const paths = [{ params: { slug: null } }];
  // { fallback: true } means other routes not yet generated at build time
  // will serve a fallback page (Spinner) on first request while Next.js generates static
  // HTML and JSON in background.
  return { paths, fallback: true };
}
