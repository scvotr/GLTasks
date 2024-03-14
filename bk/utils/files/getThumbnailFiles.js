'use strict'
const fs = require("fs");
const path = require("path");

const getThumbnailFiles = async ( allTasks, folderName) => {
  const currentDirectory = process.cwd();
  const tasks = [];

  for(let i=0; i < allTasks.length; i++) {
    const task = allTasks[i]

    if (task.file_names) {
      task.file_names = task.file_names.split("|")
      task.old_files = []

      for(let j=0; j < task.file_names.length; j++) {
        const file_ext = path.extname(task.file_names[j])
        const file_name = task.file_names[j]

        let file_path
        let file_content

        if(file_ext === ".pdf") {
          file_path = file_name
          file_content = file_path
        } else {
          file_path = folderName ? `${currentDirectory}/uploads/${folderName}/${task.task_id}/thumbnail_${file_name}` : `${currentDirectory}/uploads/${task.task_id}/thumbnail_${file_name}`
          try {
            file_content = await readFileAsync(file_path, "base64")
          } catch (error) {
            file_path = `${currentDirectory}/uploads/default/404.jpg`;
            file_content = await readFileAsync(file_path, "base64");
          }
        }
        task.old_files.push({
          type: file_ext,
          name: file_name,
          // content: file_content,
        })
      }
    } else {
      
    }
  }
}

module.exports = {
  getThumbnailFiles,
}