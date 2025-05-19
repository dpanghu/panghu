/**
 * 添加标签弹窗
 */
import choose from '@/assets/images/choose.svg';
import { getScientificTagAll } from '@/services/research';
import { Input, Modal } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import style from './index.less';
import searchSvg from '@/assets/images/reSearch/search.svg';

type IProps = {
  handleCancel: () => void; // 关闭弹窗方法
  tagTypeEnum: string; // 标签类型
  handleClickOk: any; // 点击确定的方法
  tagObj: any; // 选中的数据
};
const AddTag: React.FC<IProps> = ({ handleCancel, tagTypeEnum, handleClickOk, tagObj }) => {
  const [tagName, setTagName] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [tagArr, setTagArr] = useState([]);

  const getScientificTagAllData = useCallback(() => {
    getScientificTagAll({ tagTypeEnum, tagName }).then((res) => {
      tagObj[tagTypeEnum]?.map((item: any) => {
        let data: any = res.find((el: any) => el.code === item.code) || {};
        data.choose = true;
      });
      setTagArr(res);
    });
  }, [tagTypeEnum, tagName, tagObj]);

  const handleClickTag = (item: any) => {
    tagArr.forEach((tagItem: any) => {
      if (tagItem.code === item.code) {
        tagItem.choose = !tagItem.choose;
      }
    });

    setTagArr([...tagArr]);
  };

  useEffect(() => {
    getScientificTagAllData();
  }, [getScientificTagAllData]);

  const handleOk = () => {
    let res_arr: any = [];
    tagArr.map((item: any) => {
      if (item.choose) {
        res_arr.push({
          code: item.code,
          name: item.name,
        });
      }
    });

    handleClickOk(res_arr);
  };

  return (
    <Modal
      title={'选择标签'}
      width={650}
      open={true}
      onCancel={handleCancel}
      onOk={handleOk}
      okButtonProps={{ style: { backgroundColor: '#FF2739', width: '80px' } }}
      cancelButtonProps={{ style: { width: '80px' } }}
    >
      <div className={style.modal_box}>
        <Input
          suffix={
            <img src={searchSvg} onClick={() => setTagName(inputValue)} className={style.search} />
          }
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={() => setTagName(inputValue)}
          placeholder="请输入标签名称"
        />
        <div className={style.modal_tag_box}>
          {tagArr.map((item: any) => (
            <div className={style.modal_tags} key={item.code} onClick={() => handleClickTag(item)}>
              <img style={{ display: item.choose ? 'block' : 'none' }} src={choose}></img>
              {item.name}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default AddTag;
