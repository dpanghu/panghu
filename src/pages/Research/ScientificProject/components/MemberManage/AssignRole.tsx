/**
 * 分配角色
 */
import choose from '@/assets/images/choose.svg';
import { getRoleList } from '@/services/scientificProject';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface IProps {
  onCancel: () => void;
  projectId: string;
  handleClickOk: (res_arr: any) => void;
  id: string;
}
const AssignRole: React.FC<IProps> = ({ onCancel, projectId, handleClickOk, id }) => {
  const [roleArr, setRoleArr] = useState([]);
  const handleClickTag = (item: any) => {
    roleArr.forEach((tagItem: any) => {
      if (tagItem.id === item.id) {
        tagItem.isSelected = !tagItem.isSelected;
      }
    });
    setRoleArr([...roleArr]);
  };

  const getRoleListData = () => {
    getRoleList({ projectId, subSetType: 1, id, productType: 'DBE' }).then((res) => {
      setRoleArr(res);
    });
  };

  useEffect(() => {
    getRoleListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const onOk = () => {
    let res_arr: any = [];
    roleArr.map((item: any) => {
      if (item.isSelected) {
        res_arr.push({
          roleCode: item.postCode,
          roleName: item.postName,
          roleDesc: item.postDesc,
        });
      }
    });

    handleClickOk(res_arr);
  };

  return (
    <Modal
      width={624}
      onCancel={onCancel}
      open={true}
      title="分配角色"
      onOk={onOk}
      wrapClassName={styles.roleModal}
    >
      <div className={styles.modal_tag_box}>
        {roleArr.map((item: any) => (
          <div className={styles.modal_tags} key={item.id} onClick={() => handleClickTag(item)}>
            <img style={{ display: item.isSelected ? 'block' : 'none' }} src={choose} />
            {item.postName}
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default AssignRole;
