import { AppBarForPage } from "../components/AppBarForPage/AppBarForPage"
import { useEffect, useState } from "react"

export const MutualVerificationDocs = () => {
  const [files, setFiles] = useState([])
  
  useEffect(() => {
    fetch(`${process.env.PUBLIC_URL}/files/Mutula2024/fileList.json`)
      .then(response => response.json())
      .then(data => setFiles(data))
      .catch(error => console.error("Error fetching file list:", error))
  }, [])

// Docs download, image & pdf open in browser
  const handleClick = (file) => {
    fetch(file.url)
      .then(response => {
        const contentDisposition = response.headers.get('content-disposition');
        const contentType = response.headers.get('content-type');
        console.log(contentType)
        
        if (contentType === 'application/pdf' || contentType.startsWith('image')) {
          response.blob().then(blob => {
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
          });
        } else {
          response.blob().then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name; // установить оригинальное имя файла
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // освободить URL объект
          });
        }
      })
      .catch(error => console.error('Error fetching the file:', error));
  };

  return (
    <>
      <AppBarForPage title="Взаимопроверка - Документы" />

      <div>
        <h2>2024 год:</h2>
        <ul>
          {files.map((file, index) => (
            <li key={index}>
              <button onClick={() => handleClick(file)}>{file.name}</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
