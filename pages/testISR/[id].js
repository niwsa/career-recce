import { useRouter } from "next/router";

export default function TestISR({ esEpoch, t_id }) {
  const router = useRouter();
  return (
    <time style={{ color: "yellow" }}>
      {router.isFallback
        ? "Loading vitals..."
        : esEpoch
        ? new Date(esEpoch).toLocaleString() + `🎭 ${t_id}`
        : "No date received"}
    </time>
  );
}

export async function getStaticProps({ params }) {
  const { id } = params;
  return {
    props: {
      esEpoch: new Date().getTime(),
      t_id: id.toUpperCase() + ">.<",
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "abcd" } }, { params: { id: "efgh" } }],
    fallback: true,
  };
}
