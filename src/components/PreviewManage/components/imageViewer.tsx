export default function ImageViewer(props: { url: string }) {
  return (
    <div style={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <img src={props.url} style={{ maxWidth: 1000, margin: '20px auto', display: 'inherit' }} />
    </div>
  );
}
