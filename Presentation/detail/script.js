import {createProfileCard} from "../components/profilecard/profilecard.js";
import {createUserListDropBox} from "../components/userlistdropbox/userlistdropbox.js";


//環境変数

const token = localStorage.getItem("token");


//変数宣言
let taskData;
let statusData; 
let priorityData;
let usersData;
let profileData;
let taskId = window.location.pathname.split('/').pop();



//fetchData
async function fetchTaskData(taskId) {
    try {
        const response = await fetch("/tasks/" + taskId,{
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await response.json();
        taskData = data;
    } catch (error) {
        console.error("課題データの取得に失敗しました", error);
    }
}
async function fetchStatusData(){
    try {
        const response = await fetch("/status", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        statusData = data;
    } catch (error) {
        console.error("ステータスデータの取得に失敗しました", error);
    }
}
async function fetchPriorityData(){
    try {
        const response = await fetch("/priority", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        priorityData = data;
    } catch (error) {
        console.error("優先度データの取得に失敗しました", error);
    }
}
async function fetchUsersData(){
    try {
        const response = await fetch("/users", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        usersData = data;
    } catch (error) {
        console.error("ユーザーデータの取得に失敗しました", error);
    }
}

async function fetchProfileData(){
    try {
        const response = await fetch("/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        profileData = data;
    } catch (error) {
        console.error("プロフィールデータの取得に失敗しました", error);
    }
}


//modifyData
function modifyStatusData(data){
    let statusData = [];
    data.forEach(status => {
        statusData.push({
            id: status.status_id,
            name: status.status
        });
    });
    return statusData;
}
function modifyPriorityData(data){
    let priorityData = [];
    data.forEach(priority => {
        priorityData.push({
            id: priority.priority_id,   
            name: priority.priority
        });
    });
    return priorityData;
}
function modifyUsersData(data){
    let usersData = [];
    data.forEach(user => {
        usersData.push({
            id: user.user_id, 
            name: user.last_name + ' ' + user.first_name,
            email: user.email_address
        });
    });
    
    usersData.sort((a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()));

    return usersData;
}



//renderData
function renderTaskId() {
    const taskId = document.getElementById("task-id");
    taskId.textContent = taskData.task_id;
}
function renderTitle() {
    const title = document.getElementById("title");
    if(taskData.title.length > 26){
        let titleText = taskData.title;
        titleText = titleText.slice(0, 26);
        titleText = titleText + '…';
        title.textContent = titleText;
    }else{
        title.textContent = taskData.title;
    }
}
function renderStatus() {
    const status = document.getElementById("status");
    status.textContent = statusData.find(status => status.status_id === taskData.status).status;
}
function renderPriority() {
    const priority = document.getElementById("priority");
    priority.textContent = priorityData.find(priority => priority.priority_id === taskData.priority).priority;
}
function renderSuggestedBy() {
    const suggestedBy = document.getElementById("suggested-by");
    if(usersData.find(user => user.user_id === taskData.suggested_by).last_name.length + usersData.find(user => user.user_id === taskData.suggested_by).first_name.length > 5){
        if(usersData.find(user => user.user_id === taskData.suggested_by).last_name.length > 5){
            let name = usersData.find(user => user.user_id === taskData.suggested_by).last_name;
            name = name.slice(0, 5);
            name = name + '…';
            suggestedBy.textContent = name;
        }else{
            let name = usersData.find(user => user.user_id === taskData.suggested_by).last_name + ' ' + usersData.find(user => user.user_id === taskData.suggested_by).first_name;
            name = name.slice(0, 6);
            name = name + '…';
            suggestedBy.textContent = name;
        }
    }else{
        suggestedBy.textContent = usersData.find(user => user.user_id === taskData.suggested_by).last_name + ' ' + usersData.find(user => user.user_id === taskData.suggested_by).first_name;
    }
}
function renderSuggestedAt() {
    const suggestedAt = document.getElementById("suggested-at");
    const suggestedAtInfo = new Date(taskData.suggested_at);
    const suggestedAtInfoNextDay = suggestedAtInfo.toLocaleDateString('en-CA');
    const suggestedAtInfoNextDaySlash = suggestedAtInfoNextDay.replace(/-/g, '/');
    suggestedAt.textContent = suggestedAtInfoNextDaySlash;
}
function renderAssignedTo() {
    const assignedTo = document.getElementById("assigned-to");
    if(usersData.find(user => user.user_id === taskData.assigned_to).last_name.length + usersData.find(user => user.user_id === taskData.assigned_to).first_name.length > 5){
        if(usersData.find(user => user.user_id === taskData.assigned_to).last_name.length > 5){
            let name = usersData.find(user => user.user_id === taskData.assigned_to).last_name;
            name = name.slice(0, 5);
            name = name + '…';
            assignedTo.textContent = name;
        }else{
            let name = usersData.find(user => user.user_id === taskData.assigned_to).last_name + ' ' + usersData.find(user => user.user_id === taskData.assigned_to).first_name;
            name = name.slice(0, 6);
            name = name + '…';
            assignedTo.textContent = name;
        }
    }else{
        assignedTo.textContent = usersData.find(user => user.user_id === taskData.assigned_to).last_name + ' ' + usersData.find(user => user.user_id === taskData.assigned_to).first_name;
    }
}
function renderDeadline() {
    const deadline = document.getElementById("deadline");
    const deadlineInfo = new Date(taskData.deadline);
    const deadlineInfoNextDay = deadlineInfo.toLocaleDateString('en-CA');
    const deadlineInfoNextDaySlash = deadlineInfoNextDay.replace(/-/g, '/');
    deadline.textContent = deadlineInfoNextDaySlash;
}
function renderTaskDescription() {
    const description = document.getElementById("task-description");
    description.textContent = taskData.task_description;
}
function renderActionDescription() {
    const description = document.getElementById("action-description");
    if(taskData.action_description){
        description.textContent = taskData.action_description;
    }else{
        description.textContent = "";
    }
}
function renderUpdatedBy() {
    const updatedBy = document.getElementById("updated-by");
    if(usersData.find(user => user.user_id === taskData.updated_by).last_name.length + usersData.find(user => user.user_id === taskData.updated_by).first_name.length > 10){
        let name = usersData.find(user => user.user_id === taskData.updated_by).last_name + ' ' + usersData.find(user => user.user_id === taskData.updated_by).first_name;
        name = name.slice(0, 11);
        name = name + '…';
        updatedBy.textContent = name;
    }else{
        updatedBy.textContent = usersData.find(user => user.user_id === taskData.updated_by).last_name + ' ' + usersData.find(user => user.user_id === taskData.updated_by).first_name;
    }
}
function renderUpdatedAt() {
    const updatedAt = document.getElementById("updated-at");
    const updatedAtInfo = new Date(taskData.updated_at);
    const updatedAtInfoNextDay = updatedAtInfo.toLocaleDateString('en-CA');
    const updatedAtInfoNextDaySlash = updatedAtInfoNextDay.replace(/-/g, '/');
    updatedAt.textContent = updatedAtInfoNextDaySlash;
}
function renderCompletedAt() {
    const completedAt = document.getElementById("completed-at");
    if(taskData.completed_at){
        const completedAtInfo = new Date(taskData.completed_at);
        const completedAtInfoNextDay = completedAtInfo.toLocaleDateString('en-CA');
        const completedAtInfoNextDaySlash = completedAtInfoNextDay.replace(/-/g, '/');
        completedAt.textContent = completedAtInfoNextDaySlash;
    }else{
        completedAt.textContent = "";
    }
}

async function renderTask(){
    renderTaskId();
    renderTitle();
    renderStatus();
    renderPriority();
    renderSuggestedBy();
    renderSuggestedAt();
    renderAssignedTo();
    renderDeadline();
    renderTaskDescription();
    renderActionDescription();
    renderUpdatedBy();
    renderUpdatedAt();
    renderCompletedAt();
}




//*修正ボタン
const editButton = document.getElementById("edit-button");
function rePaintEditButton(){
    if(taskData.status === 8){
        editButton.classList.add("hidden");
    }else{
        editButton.classList.remove("hidden");
    }
}
editButton.addEventListener("click", async () => {
    const response = await fetch("/tasks/" + taskId,{
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })  
    const data = await response.json();
    if(data.error){
        alert(data.error);
        window.location.href = "../list";
    }else{
        window.location.href = "../registrationfix";
    }
});



//*削除ボタン
const deleteButton = document.getElementById("delete-button");
function rePaintDeleteButton(){
    if(!profileData.task_delete_right){
        deleteButton.classList.add("hidden");
    }else{
        deleteButton.classList.remove("hidden");
    }
}

deleteButton.addEventListener("click", async () => {
    if(confirm("本当に削除しますか？")){
        const response = await fetch("/tasks/" + taskId,{
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        if(response.ok){
            const data = await response.json();
            alert(data.message);
            window.location.href = "../list";
        }else{
            const data = await response.json();
            alert(data.error);
        }
    }
});



//*依頼メール機能
//1.依頼メール取得
let requestMail;
const userSelectDropBox = document.getElementById("user-select");
//1-1.初期値設定
function setRequestMail(){
    const dropBoxOptionWrapper = userSelectDropBox.querySelector(".drop-box-option-wrapper");
    let dropBoxOption = dropBoxOptionWrapper.querySelector(".drop-box-option");
    let dropBoxOptionEmail = dropBoxOption.querySelector(".email");
    requestMail = dropBoxOptionEmail.textContent;
}
//1-2.イベント設定
function setRequestMailEvent(){
    const userSelectDropBox = document.getElementById("user-select");
    const dropBoxOptionWrapper = userSelectDropBox.querySelector(".drop-box-option-wrapper");
    const dropBoxOption = dropBoxOptionWrapper.querySelectorAll(".drop-box-option");

    dropBoxOption.forEach(option => {
        option.addEventListener("click", (e) => {
            requestMail = e.target.dataset.email;
        });
    });

}

//2.依頼送信ボタン
const requestButton = document.getElementById("request-button");
requestButton.addEventListener("click", async () => {
    const overlay = document.querySelector("#overlay");
    overlay.style.display = "block";

    try{
        const response = await fetch("/sendmail",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                to: requestMail,
                pageUrl: window.location.href,
            })
        })  
        const data = await response.json();
        alert(data.message);
        overlay.style.display = "none";
    }catch(error){
        const data = await response.json();
        alert(data.error);
        overlay.style.display = "none";
    }

});



//*印刷機能
const printButton = document.getElementById("print-button");
printButton.addEventListener("click", () => {
    window.print();
});



//*データ出力機能
const dataToFileOutput = document.getElementById("data-to-file-output");
dataToFileOutput.addEventListener("click", async () => {


    try{
        const response = await fetch("/task/excel",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                task_id: taskData.task_id,
                title: taskData.title,
                task_description: taskData.task_description,
                suggested_by: usersData.find(user => user.id === taskData.suggested_by).name,
                suggested_at: new Date(taskData.suggested_at).toLocaleDateString('en-CA'),
                status: statusData.find(status => status.status_id === taskData.status).status,
                assigned_to: usersData.find(user => user.id === taskData.assigned_to).name,
                priority: priorityData.find(priority => priority.priority_id === taskData.priority).priority,
                deadline: new Date(taskData.deadline).toLocaleDateString('en-CA'),
                action_description: taskData.action_description ? taskData.action_description : "",
                completed_at: taskData.completed_at ? new Date(taskData.completed_at).toLocaleDateString('en-CA') : "",
                updated_by: usersData.find(user => user.id === taskData.updated_by).name,
                updated_at: new Date(taskData.updated_at).toLocaleDateString('en-CA'),
                note: "",
            })
        })
        if(response.ok){
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `課題No${taskData.task_id}の課題管理表.xlsx`;
            a.click();
        }else{
            const data = await response.json();
            alert(data.error);
        }
    }catch(error){
        const data = await response.json();
        alert(data.error);
    };
});


async function UiRepaint(){
    rePaintDeleteButton();
    rePaintEditButton();
}


async function dataLoader(){
    await fetchProfileData();
    await createProfileCard();
    await fetchUsersData();
    await fetchStatusData();
    await fetchPriorityData();
    await fetchTaskData(taskId);
    await renderTask();
    usersData = modifyUsersData(usersData);
    createUserListDropBox("user-select", "256px", usersData, 10, 21);
    setRequestMail();
    setRequestMailEvent();
    await UiRepaint();
}
dataLoader();

// //*Event:DOMContentLoaded
// document.addEventListener("DOMContentLoaded", async () => {
//     await fetchProfileData();
//     await createProfileCard();
//     await fetchUsersData();
//     await fetchStatusData();
//     await fetchPriorityData();
//     await fetchTaskData(taskId);
//     await renderTask();
//     usersData = modifyUsersData(usersData);
//     createUserListDropBox("user-select", "256px", usersData);
//     setRequestMail();
//     setRequestMailEvent();
// });




window.addEventListener('pageshow', (e) => {
    if(e.persisted){
        window.location.reload();
    }
});