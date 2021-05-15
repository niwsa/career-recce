export default function TestISR({ esEpoch, t_id }) {
  return (
    <time style={{ color: "yellow" }}>
      {esEpoch
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
