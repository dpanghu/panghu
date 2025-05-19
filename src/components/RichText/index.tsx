/**
 * @author wangb
 * @description 富文本
 * @document https://www.yuque.com/braft-editor/be/lzwpnr
 */

// import { getParamsForUpload, UPLOAD_URL_PUBLIC } from '@/services/common';
// import {  UPLOAD_URL_PUBLIC } from '@/services/common';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import React from 'react';

const controls: any[] = [
  'undo',
  'redo',
  'separator',
  'headings',
  'font-size',
  'line-height',
  'letter-spacing',
  'separator',
  'text-color',
  'bold',
  'italic',
  'underline',
  'strike-through',
  'separator',
  'text-align',
  'separator',
  'separator',
  'link',
  'separator',
  {
    key: 'media',
    text: '本地上传',
  },
  'separator',
];

type IProps = {
  controls: any;
  placeholder: string;
  text: any;
  onChange: any;
  uploadFn: any;
  validateFn: any;
};

class EditorDemo extends React.Component<IProps | any> {
  state = {
    editorState: BraftEditor.createEditorState(this.props.text),
  };

  getRichText = () => {
    const content = this.state.editorState.toHTML();
    return content === '<p></p>' ? '' : content;
  };

  insertRichText = (html: any) => {
    this.setState({
      editorState: ContentUtils.insertHTML(this.state.editorState, html),
    });
  };

  //   UNSAFE_componentWillReceiveProps(nexrProps: any) {
  //     if (nexrProps.text != this.props.text) {
  //       this.setState({
  //         editorState: BraftEditor.createEditorState(nexrProps.text),
  //       });
  //     }
  //   }

  // getSnapshotBeforeUpdate = (props: any, state: any) => {
  //   console.log('state--', state, props.text);
  //   return { editorState: props.text };
  // };

  componentDidMount(): void {
    this.setState({
      editorState: BraftEditor.createEditorState(this.props.text),
    });
  }

  handleEditorChange = (editorState: any) => {
    this.setState({
      editorState,
    });
    this.props.onChange(editorState.toHTML());
  };

  // 默认字段;
  static defaultProps = {
    uploadFn: async (param: RecordItem) => {
      let file = param.file;
      const suffix = file.name.split('.').pop();
      if (!['jpg', 'jpeg', 'png', 'gif'].includes(suffix)) {
        param.error({
          msg: '文件格式不支持',
        });
        return;
      }
      //   const { data } = await getParamsForUpload({
      //     moduleName: 'rich_text',
      //     fileName: file.name,
      //     bucket: 'pbu-public',
      //   });
      //   const formData = new FormData();
      //   Object.keys(data.tokenParams).forEach((key) => {
      //     formData.append(key, data.tokenParams[key]);
      //   });
      //   formData.append('file', file);
      //   fetch(UPLOAD_URL_PUBLIC, {
      //     method: 'POST',
      //     body: formData,
      //   })
      //     .then(() => {
      //       param.success({ url: data.file_url });
      //     })
      //     .catch(() => {
      //       param.error({
      //         msg: 'unable to upload.',
      //       });
      //     });
    },
    validateFn: () => true,
    controls: [],
    onChange: () => {},
  };

  render() {
    const { editorState } = this.state;

    return (
      <BraftEditor
        value={editorState}
        onChange={this.handleEditorChange}
        controls={[...controls, ...this.props?.controls]}
        ref={(instance) => {
          // instance?.setValue(editorState);
        }}
        placeholder={this.props.placeholder || ''}
        media={{
          uploadFn: this.props.uploadFn,
          validateFn: this.props.validateFn,
        }}
      />
    );
  }
}

export default EditorDemo;
