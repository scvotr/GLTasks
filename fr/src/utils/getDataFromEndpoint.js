import { HOST_ADDR } from "./remoteHosts";

export const getDataFromEndpoint = async (
  token,
  endpoint,
  method,
  data = null,
  onSuccess
) => {
  try {
    const responce = await fetch(HOST_ADDR + endpoint, {
      method: method,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: data ? data : null,
    });
    if (responce.ok) {
      const responceData = await responce.json();
      // onSuccess(responceData);
      return responceData;
    } else {
      throw new Error("Server response was not ok or content type is not JSON");
    }
  } catch (error) {
    onSuccess(error);
  }
};

// ! USAGE 1
// При использовании блока try/catch, любая ошибка,
//  бросаемая внутри блока try, будет перехвачена
//  в блоке catch. Это позволяет легко обрабатывать
//  ошибки синхронных и асинхронных операций в одном месте.
// -------------------------------------------------------
// try {
//   const token = 'your_token_value';
//   const endpoint = '/example/endpoint';
//   const method = 'GET'; // or 'POST', 'PUT', 'DELETE'
//   const data = { key: 'value' }; // if needed

//   const result = await getDataFromEndpoint(token, endpoint, method, data,
//     (responseData) => {
//       console.log('Success:', responseData);
//     },
//     (error) => {
//       console.error('Error:', error);
//     }
//   );

//   console.log(result); // handle the result if needed
// } catch (error) {
//   console.error('Caught an error:', error);
// }


// ! USAGE 2
// При использовании методов then/catch, вы обрабатываете
//  успех и ошибку отдельно. Метод then используется для
//  обработки успешного выполнения промиса,
//  в то время как метод catch используется для обработки ошибок,
//  возникших на любом этапе цепочки промисов.
// -------------------------------------------------------
// const token = 'your_token_value';
// const endpoint = '/example/endpoint';
// const method = 'GET'; // or 'POST', 'PUT', 'DELETE
// const data = { key: 'value' }; // if needed

// getDataFromEndpoint(token, endpoint, method, data,
//   (responseData) => {
//     console.log('Success:', responseData);
//   },
//   (error) => {
//     console.error('Error:', error);
//   }
// ).then((result) => {
//   console.log(result); // handle the result if needed
// }).catch((error) => {
//   console.error('Caught an error:', error);
// });