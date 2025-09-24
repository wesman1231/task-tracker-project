const fs = require('fs');

const tasks = JSON.parse(fs.readFileSync('./tasks.json', 'utf-8'));
const validCommands = ["view", "add", "mark", "delete"];
//creates user input 
const createInput = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

//manages questions asked by the user input
function userInput()
{
    createInput.question(`Would you like to 'view', 'add', 'mark', or 'delete' tasks?: `, (manageTasks) => {
        if(!validCommands.includes(manageTasks.toLowerCase()))
        {
            console.log("Please enter one of the following: view, add, mark, delete")
            userInput();
        }
        else if(manageTasks.toLowerCase() === "view")
        {
            createInput.question(`Would you like to list 'all' tasks, tasks that are 'not started?', tasks that are 'in progress', tasks that are 'done'?, or tasks that are 'not done?'`, (viewType) => {
                const validViewTypes = ["all", "not started", "in progress", "done", "not done"];
                if(!validViewTypes.includes(viewType.toLowerCase()))
                {
                    console.log("Please select 'all', 'in progress', or 'done'")
                    userInput();
                }
                else if(viewType.toLowerCase() === "all")
                {
                    viewTasks();
                    userInput();
                }
                else if(viewType.toLowerCase() === "in progress")
                {
                    viewInProgressTasks();
                    userInput();
                }
                else if(viewType.toLowerCase() === "done")
                {
                    viewFinishedTasks();
                    userInput();
                }
                else if(viewType.toLowerCase() === "not started")
                {
                    viewNotStartedTasks();
                    userInput();
                }
            });
            
        }
        else if(manageTasks.toLowerCase() === "add")
        {
            createInput.question("What task would you like to add?: ", (addTask) =>{
                tasks.push({
                    id: tasks.length + 1,
                    taskName: addTask,
                    status: "not started"
                });
                saveTasks();
                console.log(`${addTask} added!`);
                userInput();
            });
            
        }
        else if(manageTasks.toLowerCase() === "delete")
        {
            createInput.question("What task would you like to delete?: ", (deleteTask) =>{
                const taskToDelete = tasks.findIndex(targetTask => targetTask.taskName === deleteTask);
                if(taskToDelete === -1)
                {
                    console.log("Sorry, that task is not in the list.");
                    userInput();
                }
                else if(taskToDelete != -1)
                {
                    tasks.splice(taskToDelete, 1);
                    saveTasks();
                    console.log(deleteTask + " deleted!");
                    userInput();
                }
                
            });
        }
        else if(manageTasks.toLowerCase() === "mark")
        {
            createInput.question("Which task would you like to mark?: ", (markTask) => {
                const taskToMark = tasks.findIndex(targetTask => targetTask.taskName === markTask);
                if(taskToMark === -1)
                {
                    console.log("Sorry, that task is not in the list.");
                    userInput();
                }
                else if(taskToMark != -1)
                {
                     createInput.question(`Would you like to mark ${markTask} as 'in progress' or 'done'?: `, (markStatus) =>{
                        const validMarks = ["in progress", "done"];
                        if(!validMarks.includes(markStatus.toLowerCase()))
                        {
                            console.log("Please mark either 'in progress' or 'done'");
                            userInput();
                        }
                        else if(markStatus.toLowerCase() === "in progress")
                        {
                            tasks[taskToMark].status = markStatus;
                            saveTasks();
                            userInput();
                        }
                        else if(markStatus.toLowerCase() === "done")
                        {
                            tasks[taskToMark].status = markStatus;
                            saveTasks();
                            userInput();
                        }
                     });
                }
            });
        }
    });
}

function viewTasks()
{
   const taskList = fs.readFile('./tasks.json', 'utf-8', (err, jsonString) => {
            if(err)
            {
                console.log(err);
            }
            else
            {
                console.log(jsonString);
            }
                
        });
    return taskList;
}

function viewInProgressTasks()
{
    let inProgressTasks = [];
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].status === "in progress")
        {
            inProgressTasks.push(tasks[i]);
        }
    }
    if(inProgressTasks.length === 0)
    {
        console.log("No in progress tasks");
    }
    else
    {
        console.log(inProgressTasks);
    }
    return inProgressTasks;
    
}

function viewFinishedTasks()
{
    let finishedTasks = [];
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].status === "done")
        {
            finishedTasks.push(tasks[i]);
        }
    }
    if(finishedTasks.length === 0)
    {
        console.log("No finished tasks");
    }
    else
    {
        console.log(finishedTasks);
    }
    return finishedTasks;
}

function viewNotStartedTasks()
{
    let notStartedTasks = [];
    for(let i = 0; i < tasks.length; i++)
    {
        if(tasks[i].status === "not started")
        {
            notStartedTasks.push(tasks[i]);
        }
    }
    if(notStartedTasks.length === 0)
    {
        console.log("No not started tasks");
    }
    else
    {
        console.log(notStartedTasks);
    }
    return notStartedTasks;
}

function saveTasks() {
    fs.writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));
}

userInput();




