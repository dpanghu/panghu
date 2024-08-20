import React, { useEffect } from 'react'
import styles from './index.less';
import { getPrefabPic } from '@/services/aiOCR';
import { useReactive } from 'ahooks';
import { Upload } from 'SeenPc';
import type { UploadProps } from 'antd';
import { message } from 'antd';
const { Dragger } = Upload;
type TState = {
    preData: any[];
}
const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    onChange(info) {
        const { status } = info.file;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files);
    },
};
const AiOCR: React.FC = ({ }) => {
    const state = useReactive<TState>({
        preData: []
    })
    const getPrefabPics = () => {
        getPrefabPic().then(res => {
            state.preData = res.data
        })
    }

    useEffect(() => {
        getPrefabPics()
    }, [])
    return (
        <div className={styles.aiOcr}>
            <div className={styles.title}>文字识别</div>
            <div className={styles.content}>
                <Dragger {...props}>
                    <div className={styles.text}>支持jpg、jpeg、png、bmp,1MB以内
                        图片拖到这里
                        或按【ctrl+v】粘贴到这里
                        或点击此处【上传】
                    </div>
                </Dragger>
            </div>
        </div>
    )
}

export default AiOCR