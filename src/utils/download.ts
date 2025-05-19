import axios from 'axios';
export function download(url: string, fileName: string) {
  axios
    .get(url, {
      responseType: 'blob',
    })
    .then((res) => {
      let blob = new Blob([res.data]);
      let downloadElement = document.createElement('a');
      let href = window.URL.createObjectURL(blob);
      downloadElement.href = href;
      downloadElement.download = fileName;
      document.body.appendChild(downloadElement);
      downloadElement.click();
      document.body.removeChild(downloadElement);
      window.URL.revokeObjectURL(href);
    })
    .catch((error) => {
      console.log(error);
    });
}
