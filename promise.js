const init = async () => {
    const numberOfTasks = 20;
    const concurrencyMax = getCurrentConcurrency();
    const taskList = Array.from({ length: numberOfTasks }, () =>
        Array.from({ length: ~~(Math.random() * 10 + 3) }, () =>
            String.fromCharCode(Math.random() * (123 - 97) + 97)
        ).join('')
    );

    console.log("INIT...");
    console.log("[init] Concurrency Algo Testing...");
    console.log("[init] Tasks to process: ", taskList.length);
    console.log("[init] Task list: " + taskList.join(', '));
    console.log("[init] Maximum Concurrency: ", concurrencyMax, "\n");

    // let a = "String" + 7;
    // console.log(a);
    // output was String7

    let counter = 0;
    let concurrencyCurrent = 0;
    await manageConcurrency(taskList, counter, concurrencyMax, concurrencyCurrent);
};

const doTask = (taskName) => {
    const begin = Date.now();
    return new Promise((resolve) => {
        console.log('\x1b[36m', "STARTING: " + taskName,'\x1b[0m');
        setTimeout(() => {
            const end = Date.now();
            const timeSpent = (end - begin) + "ms";
            console.log('\x1b[31m', "[TASK] FINISHED: " + taskName + " in " + timeSpent, '\x1b[0m');
            resolve(true);
        }, Math.random() * 200);
    });
};

const manageConcurrency = async (taskList, counter, concurrencyMax, concurrencyCurrent) => {
    
    const activePromises = [];
    while(counter < taskList.length || activePromises.length > 0 )
    {   
       while(concurrencyCurrent < concurrencyMax && counter < taskList.length){
        console.log("[EXE]", "Concurrency :", concurrencyCurrent+1, "of", concurrencyMax);
        console.log("[EXE]", "Task Counter :", counter, "of", taskList.length);
              const taskPromise = doTask(taskList[counter]).then(() => {
                    activePromises.splice(activePromises.indexOf(taskPromise), 1);
                    concurrencyCurrent--;
              })
              activePromises.push(taskPromise);
              concurrencyCurrent++;
              counter++;
       }
       if(activePromises.length > 0){
        // for (let i = 0; i < activePromises.length; i++) {
        //     await activePromises[i];
        // }
        await Promise.race(activePromises);
       }
       
   
    }
};

const getCurrentConcurrency = () => {
    const hour = new Date().getHours();
    return (hour >= 9 && hour <= 20) ? 2 : 4;
};

init();




