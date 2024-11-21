export const fetchOssConfig = (props) => {
  const requestUrl =
    props.seenOss?.url +
    '?' +
    new URLSearchParams({
      ...props.seenOss?.extraParams,
      bucketNameType: props.seenOss?.bucketNameType || 'pub',
      ossResCategory: props.seenOss?.ossResCategory || 'builder',
      objectKey:
        `/${props.seenOss?.objectKey || 'res'}/task/图片${Date.now()}` || '',
    }).toString();
  return fetch(requestUrl);
};
