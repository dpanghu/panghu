import { getCcKeyId } from '@/utils/utils';
import H5Player from 'pbu-h5-video';
import PBUVideoPlayer from 'pbu-video-player';

export default function (props: { url: string; height?: number }) {
  const isCC = !/(http|https):\/\/([\w.]+\/?)\S*/.test(props.url);

  const params = { ...props, vid: props.url, key: props.url };
  // 公有云
  if (isCC) {
    const { ccSiteId, playerId } = getCcKeyId();
    return (
      <PBUVideoPlayer
        vid={props.url}
        siteId={ccSiteId}
        key={props.url}
        width="100%"
        height={document.body.clientHeight}
        playerid={playerId}
        onGetVerificationCode={() => {}}
      />
    );
  }
  // 是否支持h5
  return <H5Player {...params} />;
}
