import React from 'react';
import styles from './index.less';
import { Button } from 'SeenPc';
import { history } from 'umi';

const AiLearnPlan: React.FC = () => {


    const goAiPersonalPortrait = () => {
        console.log('goAiPersonalPortrait')
        history.push('/aiJobHunt/AiPersonalPortrait')
    }

    return (
        <div className={styles.container}>
            <div className={styles.title}>AI学习规划</div>
            <div className={styles.titleText}>
                <div className={styles.titleTextTop}>中国大学生职业发展调查问卷</div>
                <div className={styles.titleTextBottom}>中国大学生职业发展调查问卷旨在了解大学生对职业规划的认知、态度和行为。以便更好地指导学生进行职业选择和发展。问卷内容涵盖职业兴趣、期望、专业技能等方面，请您根据自身情况，真实、客观的填写。您的图谱仅用于本项目案例应用。感谢您的参与和支持！</div>
            </div>
            <div className={styles.content}>
                <div className={styles.contentTop}></div>
                <div className={styles.contentBottom}>
                    感谢您花时间完成这份问卷，稍后讲为您量身定制个性化的学习和发展计划。
                </div>
            </div>
            <div className={styles.spacer}></div>
            <div className={styles.footer}>
                <Button type="primary" className={styles.footerBtn} onClick={goAiPersonalPortrait}>生成画像</Button>
            </div>
        </div>
    )
};

export default AiLearnPlan;
