import React from 'react';
import styles from './index.less';
import Header from './components/Header';
import Info from './components/Info';
import PanelContainer from './components/PanelContainer';
const Container: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Header />
        <Info />
        <PanelContainer />
      </div>
    </div>
  );
};
export default Container;
