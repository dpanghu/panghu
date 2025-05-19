import React, { useState } from 'react';
import { Image, Radio } from 'antd';
import styles from './index.less';
import { Modal } from 'antd';
// import { useEffect } from 'react';
import cover1 from '@/assets/images/reSearch/caseCover/cover1.png';
import cover2 from '@/assets/images/reSearch/caseCover/cover2.png';
import cover3 from '@/assets/images/reSearch/caseCover/cover3.png';
import cover4 from '@/assets/images/reSearch/caseCover/cover4.png';
import cover5 from '@/assets/images/reSearch/caseCover/cover5.png';
import cover6 from '@/assets/images/reSearch/caseCover/cover6.png';
import cover7 from '@/assets/images/reSearch/caseCover/cover7.png';
import cover8 from '@/assets/images/reSearch/caseCover/cover8.png';
import cover9 from '@/assets/images/reSearch/caseCover/cover9.png';
import cover10 from '@/assets/images/reSearch/caseCover/cover10.png';

interface TProps {
  open: boolean;
  onCancel: () => void;
  onOk: (coverId: string) => void;
  coverId: string;
}

const coverList = [
  { img: cover1, index: 0 },
  { img: cover2, index: 1 },
  { img: cover3, index: 2 },
  { img: cover4, index: 3 },
  { img: cover5, index: 4 },
  { img: cover6, index: 5 },
  { img: cover7, index: 6 },
  { img: cover8, index: 7 },
  { img: cover9, index: 8 },
  { img: cover10, index: 9 },
];

export const getCoverByIndex = (index: string) => {
  return coverList[Number(index)]?.img;
};

const Container: React.FC<TProps> = ({ coverId, open, onCancel, onOk }) => {
  const [coverIndex, setCoverIndex] = useState<string>(coverId);

  return (
    <div className={styles.container} id="coverModalContainer">
      <Modal
        title="选择封面"
        maskClosable={false}
        getContainer={() => document.getElementById('coverModalContainer') as HTMLElement}
        open={open}
        width={900}
        onCancel={onCancel}
        onOk={() => {
          onOk(coverIndex);
        }}
      >
        <div className={styles.coverBox}>
          {coverList.map((item) => (
            <div className={styles.cover} key={item.index}>
              <Radio
                className={styles.radio}
                checked={coverIndex ? Number(coverIndex) === item.index : false}
                onChange={() => {
                  setCoverIndex(String(item.index));
                }}
              />
              <Image src={item.img} width={274} />
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Container;
