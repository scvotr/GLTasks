'use strict'

const getThumbnailFiles = async ( allTasks, folderName) => {
  const currentDirectory = process.cwd();
  const tasks = [];

  for(let i=0; i < allTasks.length; i++) {
    const task = allTasks[i]

    if (task.file_names) {
      task.file_names = task.file_names.split("|")
      task.old_files = []

      for(let j=0; j < task.file_names.length; j++) {
        
      }
    }
  }
}