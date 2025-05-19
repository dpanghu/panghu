import classnames from 'classnames/bind';
import styles from './index.less';

const cn = classnames.bind(styles);
const AudioAnimateStart = () => {
  return (
    <div className={cn('audio--start-animate')}>
      <hr className={cn('hr1')} />
      <hr className={cn('hr2')} />
      <hr className={cn('hr3')} />
      <hr className={cn('hr4')} />
      <hr className={cn('hr5')} />
      <hr className={cn('hr6')} />
      <hr className={cn('hr7')} />
      <hr className={cn('hr8')} />
      <hr className={cn('hr9')} />
    </div>
  );
};

export default AudioAnimateStart;
