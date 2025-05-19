/**
 * 头部
 */
import { history } from 'umi';
import style from './index.less';
import returnSvg from '@/assets/images/reSearch/return.svg';

type IProps = {
  seTitle?: string;
  thTitle?: string;
  routePath?: string;
  oneTitle?: string;
  oneRoutePath?: string;
  background?: string;
};
const Header: React.FC<IProps> = ({
  oneTitle = '初始化',
  seTitle,
  thTitle,
  routePath,
  oneRoutePath = '/configIndex',
  background,
}) => {
  return (
    <div className={style.header} style={{ background }}>
      <img
        src={returnSvg}
        onClick={() => {
          if (routePath) {
            history.push(routePath);
            return;
          }
          if (oneRoutePath) {
            history.push(oneRoutePath);
            return;
          }
          history.goBack();
        }}
      />
      <span
        className={style.activeTitle}
        onClick={oneRoutePath ? () => history.push(oneRoutePath) : () => {}}
      >
        {oneTitle}
      </span>
      <div className={style.line} />
      <span
        className={thTitle ? style.activeTitle : style.title}
        onClick={routePath ? () => history.push(routePath) : () => {}}
      >
        {seTitle}
      </span>
      {thTitle && (
        <div className={style.thTitle}>
          <div className={style.line} />
          <span>{thTitle}</span>
        </div>
      )}
    </div>
  );
};

export default Header;
