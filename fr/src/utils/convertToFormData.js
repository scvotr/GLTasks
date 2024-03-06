//old_version
export const convertToFormData = (formData) => {
  const data = new FormData();

  for (const key in formData) {
    if (key === "files") {
      const files = formData[key];
      for (let i = 0; i < files.length; i++) {
        data.append(`files${i}`, files[i]);
      }
    } else {
      data.append(key, formData[key]);
    }
  }
  return data;
};

export const convertToFormDataV2 = (formData) => {
  const data = new FormData();

  for (const key in formData) {
    if (key === "files") {
      const files = formData[key];
      for (let i = 0; i < files.length; i++) {
        console.log('!!!!!!!!!!!!', files)
        data.append(`files${i}`, files[i]);
      }
    } else {
      data.append(key, formData[key]);
    }
  }
  return data;
};

  // const filesData = [];
  // for (const key of data.keys()) {
  //   if (key.startsWith("files")) {
  //     const file = data.get(key);
  //     filesData.push(file);
  //   }
  // }
  // console.log(filesData);

// export const convertToFormData = (formData) => {
//   const data = new FormData();
//   const filePromises = [];

//   for (const key in formData) {
//     if (key === "files") {
//       const files = formData[key];
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const filePromise = new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => {
//             resolve({name: file.name, data: reader.result});
//           };
//           reader.onerror = () => {
//             reject(`Failed to read file ${file.name}`);
//           };
//           reader.readAsDataURL(file);
//         });
//         filePromises.push(filePromise);
//       }
//     } else {
//       data.append(key, formData[key]);
//     }
//   }

//   return Promise.all(filePromises).then((fileDatas) => {
//     for (let i = 0; i < fileDatas.length; i++) {
//       const {name, data} = fileDatas[i];
//       data.append(`file${i}`, data, name);
//     }
//     return data;
//   });
// };