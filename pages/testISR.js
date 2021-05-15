export default function TestISR({ esEpoch }) {
  return (
    <time style={{ color: "yellow" }}>
      {esEpoch ? new Date(esEpoch).toLocaleString() : "No date received"}
    </time>
  );
}

export async function getStaticProps() {
  return {
    props: {
      esEpoch: new Date().getTime(),
    },
    revalidate: 10,
  };
}
