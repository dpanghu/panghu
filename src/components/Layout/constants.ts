import a1 from '@/assets/images/a1.svg';
import a1c from '@/assets/images/a1_c.svg';
import a2 from '@/assets/images/a2.svg';
import a2c from '@/assets/images/a2_c.svg';
import a3 from '@/assets/images/a3.svg';
import a3c from '@/assets/images/a3_c.svg';
import a4 from '@/assets/images/a4.svg';
import a4c from '@/assets/images/a4_c.svg';
import b1 from '@/assets/images/course_anas.svg';
import layout1 from '@/assets/images/layout1.svg';
import layout10 from '@/assets/images/layout10.svg';
import layout11 from '@/assets/images/layout11.svg';
import layout110 from '@/assets/images/layout110.svg';
import layout12 from '@/assets/images/layout12.svg';
import layout13 from '@/assets/images/layout13.svg';
import layout14 from '@/assets/images/layout14.svg';
import layout17 from '@/assets/images/layout17.svg';
import layout18 from '@/assets/images/layout18.svg';
import layout19 from '@/assets/images/layout19.svg';
import layout2 from '@/assets/images/layout2.svg';
import layout20 from '@/assets/images/layout20.svg';
import layout20_1 from '@/assets/images/layout20_1.svg';
import layout21 from '@/assets/images/layout21.svg';
import layout21_1 from '@/assets/images/layout21_1.svg';
import layout3 from '@/assets/images/layout3.svg';
import layout4 from '@/assets/images/layout4.svg';
import layout5 from '@/assets/images/layout5.svg';
import layout6 from '@/assets/images/layout6.svg';
import layout7 from '@/assets/images/layout7.svg';
import layout8 from '@/assets/images/layout8.svg';
import layout9 from '@/assets/images/layout9.svg';
import b2 from '@/assets/images/learn_anas.svg';
import r1 from '@/assets/images/reSearch/menu/r1.svg';
import r2 from '@/assets/images/reSearch/menu/r2.svg';
import r4 from '@/assets/images/reSearch/menu/r4.png';
import r7 from '@/assets/images/reSearch/menu/r7.png';
import r8 from '@/assets/images/reSearch/menu/r8.svg';
import b1s from '@/assets/images/sta1.svg';
import b2s from '@/assets/images/sta2.svg';
import layout30 from '@/assets/images/课题组.svg';
import layout31 from '@/assets/images/课题.svg';
import layout32 from '@/assets/images/数据集市.svg';
import layout33 from '@/assets/images/数据工坊.svg';
import layout40 from '@/assets/images/课题组not.svg';
import layout41 from '@/assets/images/课题not.svg';
import layout42 from '@/assets/images/数据集市not.svg';
import layout43 from '@/assets/images/数据工坊not.svg';
import Cookies from 'js-cookie';

// 资源导入
const _assets = {
  a1,
  a1c,
  a2,
  a2c,
  a3,
  a3c,
  a4,
  a4c,
  b1,
  layout1,
  layout10,
  layout11,
  layout110,
  layout12,
  layout13,
  layout14,
  layout17,
  layout18,
  layout19,
  layout2,
  layout20,
  layout20_1,
  layout21,
  layout21_1,
  layout3,
  layout4,
  layout5,
  layout6,
  layout7,
  layout8,
  layout9,
  b2,
  r1,
  r2,
  r4,
  r7,
  r8,
  b1s,
  b2s,
  layout30,
  layout31,
  layout32,
  layout33,
  layout40,
  layout41,
  layout42,
  layout43,
};

const customStyle = ['studentIndex', 'teacherIndex', 'researchIndex'];

// 当前角色
const _memberType = Cookies.get('memberType');

export { _assets, customStyle, _memberType };
