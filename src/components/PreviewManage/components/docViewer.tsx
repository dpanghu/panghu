export default function (props: { url: string }) {
  console.log(`${props.url}#toolbar=0`);
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        style={{ border: 'none' }}
        src={`${props.url}#toolbar=0`}
        width="100%"
        height="100%"
        allowFullScreen={true}
      />
    </div>
  );
}
