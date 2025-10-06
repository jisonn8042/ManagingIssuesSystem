import { createDropBox, setDropBoxValue } from '../components/dropbox/dropbox.js';
import {createProfileCard} from '../components/profilecard/profilecard.js';
import { createUserListDropBox, setUserListDropBoxValue } from '../components/userlistdropbox/userlistdropbox.js';

//token取得
const token = localStorage.getItem("token");

//変数宣言
//課題内容変数登録
let profile;
let statusData;
let priorityData;
let suggestedByData;
let assignedToData;
let updatedByData;
let suggestedAtDateData;
let deadlineDateData;
let completedAtDateData;
let updateAtDateData;
let titleData;
let taskDescriptionData;
let actionDescriptionData;

//ユーザーデータ変数登録
let usersData;
let usersListData;

//課題IDから取得した課題データ変数登録
let taskData;


//fetch data
//ステータスデータ取得
async function fetchStatusData(){
    const response = await fetch(`/status`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    data.sort((a, b) => a.status_id - b.status_id);
    return data;
}

//優先度データ取得
async function fetchPriorityData(){
    const response = await fetch(`/priority`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    data.sort((a, b) => a.priority_id - b.priority_id);
    return data;
}

//ユーザーデータ取得
async function fetchUsersData(){
    const response = await fetch("/users", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    usersData = data.sort((a, b) => a.user_id - b.user_id);
    return data;
}

//tokenからプロフィールデータ取得
async function fetchUserData(){
    const response = await fetch("/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    profile = data;
}

//課題IDから課題データ取得
async function fetchTaskData(taskId){
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
        console.error("タスクデータの取得に失敗しました", error);
    }
}





//ステータスデータを
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

async function editStatusData(){
    const data = await fetchStatusData();
    return modifyStatusData(data);
}

async function createStateDropBox(id, width, defaultStatus){
    const statusData = await editStatusData();
    createDropBox(id, width, statusData);
    const defaultStatusData = statusData.find(status => status.id === defaultStatus);
    setDropBoxValue(id, defaultStatusData.id,  defaultStatusData.name);
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

async function editPriorityData(){
    const data = await fetchPriorityData();
    return modifyPriorityData(data);
}

async function createPriorityDropBox(id, width, defaultPriority){
    const priorityData = await editPriorityData();
    createDropBox(id, width, priorityData);
    const defaultPriorityData = priorityData.find(priority => priority.id === defaultPriority);
    setDropBoxValue(id, defaultPriorityData.id,  defaultPriorityData.name);
}











function modifyUserData(data){
    let userData = [];
    data.forEach(user => {
        userData.push({
            id: user.user_id, 
            name: user.last_name + ' ' + user.first_name,
            email: user.email_address
        });
    });

    userData.sort((a, b) => a.email.toLowerCase().localeCompare(b.email.toLowerCase()));

    usersListData = userData;
}

function createUsersDropBox(id, width){
    createUserListDropBox(id, width, usersListData, 5, 21);
}





const priorityDropBoxWrapper = document.querySelector('#priority-drop-box');
priorityDropBoxWrapper.addEventListener('dropBoxValueChange', (e) => {
    priorityData = e.detail.dropBoxDataSet.id;
});




const userDropBoxWrapper = document.querySelector('#user-drop-box');
userDropBoxWrapper.addEventListener('dropBoxValueChange', (e) => {
    assignedToData = e.detail.dropBoxDataSet.id;
});



function setRegisterSuggestUserData(){
    const suggestUser = document.querySelector('#suggest-user');
    if(profile.last_name.length + profile.first_name.length > 5){
        let name = profile.last_name + ' ' + profile.first_name;
        name = name.slice(0, 6);
        name = name + '…';
        suggestUser.textContent = name;
    }else{
        suggestUser.textContent = profile.last_name + ' ' + profile.first_name;
    }
}



//set data

function setStatusData(){
    const statusWrapper = document.querySelector('#status-drop-box');
    const statusDropBox = statusWrapper.querySelector('.drop-box');
    const statusDropBoxText = statusDropBox.querySelector('.drop-box-text');
    statusData = Number(statusDropBoxText.dataset.id);
}

function setPriorityData(){
    const priorityWrapper = document.querySelector('#priority-drop-box');
    const priorityDropBox = priorityWrapper.querySelector('.drop-box');
    const priorityDropBoxText = priorityDropBox.querySelector('.drop-box-text');
    priorityData = Number(priorityDropBoxText.dataset.id);
}

function setSuggestUserData(){
    const suggestUserData = usersData.find(user => user.last_name + ' ' + user.first_name === profile.last_name + ' ' + profile.first_name);
    suggestedByData = Number(suggestUserData.user_id);
}

function setAssignedToData(){
    const assignedToDropBox = document.querySelector('#user-drop-box');
    const assignedToDropBoxText = assignedToDropBox.querySelector('.drop-box-text');
    assignedToData = Number(assignedToDropBoxText.dataset.id);
}

function setUpdateByData(){
    updatedByData = profile.user_id;
}

function setSuggestedAtDateData(){
    const suggestDateInput = document.querySelector('#suggest-date');
    suggestedAtDateData = suggestDateInput.value;
}

function setDeadlineDateData(){
    const deadlineDateInput = document.querySelector('#deadline-date');
    deadlineDateData = deadlineDateInput.value;
}

function setCompletedAtDateData(){
    if(statusData === 8){
        completedAtDateData = new Date().toISOString().split('T')[0];
    }else{
        completedAtDateData = null;
    }
}

function setUpdateAtDateData(){
    updateAtDateData = new Date().toISOString().split('T')[0];
}

function setTitleData(){
    const titleInput = document.querySelector('#title');
    titleData = titleInput.value;
}

function setTaskDescriptionData(){
    const taskDescriptionInput = document.querySelector('#task-description');
    taskDescriptionData = taskDescriptionInput.value;
}

function setActionDescriptionData(){
        const actionDescriptionInput = document.querySelector('#action-description');
        actionDescriptionData = actionDescriptionInput.value;
        if(actionDescriptionData === ''){
            actionDescriptionData = null;
        }
}

function setAllData(){
    setStatusData();
    setPriorityData();
    setSuggestUserData();
    setAssignedToData();
    setUpdateByData();
    setSuggestedAtDateData();
    setDeadlineDateData();
    setCompletedAtDateData();
    setUpdateAtDateData();
    setTitleData();
    setTaskDescriptionData();
    setActionDescriptionData();
}

function consoleLogAllData(){
    console.log('taskData: ' + taskData.task_id);
    console.log('statusData: ' + statusData);
    console.log('priorityData: ' + priorityData);
    console.log('suggestedByData: ' + suggestedByData);
    console.log('assignedToData: ' + assignedToData);
    console.log('updatedByData: ' + updatedByData);
    console.log('suggestedAtDateData: ' + suggestedAtDateData);
    console.log('deadlineDateData: ' + deadlineDateData);
    console.log('completedAtDateData: ' + completedAtDateData);
    console.log('updateAtDateData: ' + updateAtDateData);
    console.log('titleData: ' + titleData);
    console.log('taskDescriptionData: ' + taskDescriptionData);
    console.log('actionDescriptionData: ' + actionDescriptionData);
}


//validation
const titleInput = document.querySelector('#title');
const taskDescriptionInput = document.querySelector('#task-description');
const actionDescriptionInput = document.querySelector('#action-description');
const suggestInput = document.querySelector('#suggest-date');
const deadlineInput = document.querySelector('#deadline-date'); 

let validationObject = {
    title: {
        input: titleInput,
        validation: false
    },
    taskDescription: {
        input: taskDescriptionInput,
        validation: false
    },
    actionDescription: {
        input: actionDescriptionInput,
        validation: false
    },
    suggest: {
        input: suggestInput,
        validation: false
    },
    deadline: {
        input: deadlineInput,
        validation: false
    }
}


titleInput.addEventListener('input', (e) => {
    if(e.target.value.trim() === "" || e.target.value.length > 50){
        titleInput.classList.add('validation-error');
        validationObject.title.validation = false;
    }else{
        titleInput.classList.remove('validation-error');
        validationObject.title.validation = true;   
    }
});

taskDescriptionInput.addEventListener('input', (e) => {
    if(e.target.value.trim() === "" || e.target.value.length > 2000){
        taskDescriptionInput.classList.add('validation-error');
        validationObject.taskDescription.validation = false;
    }else{
        taskDescriptionInput.classList.remove('validation-error');
        validationObject.taskDescription.validation = true;
    }
});

actionDescriptionInput.addEventListener('input', (e) => {
    if((statusData !== 1 && statusData !== 2) && (e.target.value.trim() === "" || e.target.value.length > 2000)){
        actionDescriptionInput.classList.add('validation-error');
        validationObject.actionDescription.validation = false;
    }else if((statusData !== 1 && statusData !== 2) && e.target.value.length > 0){
        actionDescriptionInput.classList.remove('validation-error');
        validationObject.actionDescription.validation = true;
    }
});


function checkWhiteSpaceValidation(){

    let validationArrayForStatus1And2 = ['title', 'taskDescription', 'suggest', 'deadline'];
    let validationArrayForStatusTheOthers = ['title', 'taskDescription', 'actionDescription', 'suggest', 'deadline'];

    let validFailedElements = [];
    let validSuccessElements = [];

    if(statusData === 1 || statusData === 2){
        validationArrayForStatus1And2.forEach(element => {
            if(validationObject[element].input.value.trim() === ""){
                validFailedElements.push(element);
            }else{
                validSuccessElements.push(element);
            }
        });
    }else{
        validationArrayForStatusTheOthers.forEach(element => {
            if(validationObject[element].input.value.trim() === ""){
                validFailedElements.push(element);
            }else{
                validSuccessElements.push(element);
            }
        });
    }

    return {
        validFailedElements: validFailedElements,
        validSuccessElements: validSuccessElements
    }
}

function updateValidationErrorMessage(){

    const validationResult = checkWhiteSpaceValidation();

    validationResult.validFailedElements.forEach(element => {
        validationObject[element].input.classList.add('validation-error');
    });
    validationResult.validSuccessElements.forEach(element => {
        validationObject[element].input.classList.remove('validation-error');
    });

};

async function postData(){
    const data = {
        status: statusData,
        priority: priorityData,
        suggest_by: suggestedByData,
        assigned_to: assignedToData,
        updated_by: updatedByData,
        suggested_at: suggestedAtDateData,
        deadline: deadlineDateData,
        completed_at: completedAtDateData,
        updated_at: updateAtDateData,
        title: titleData,
        task_description: taskDescriptionData,
        action_description: actionDescriptionData
    }

    const response = await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })
    if(response.ok){
        const data = await response.json();
        alert(data.message);
        return data;
    }else{
        const data = await response.json();
        alert(data.error);
    }
}

async function editData(){
    const data = {
        task_id: taskData.task_id,
        status: statusData,
        priority: priorityData,
        suggest_by: suggestedByData,
        assigned_to: assignedToData,
        updated_by: updatedByData,
        suggested_at: suggestedAtDateData,
        deadline: deadlineDateData,
        completed_at: completedAtDateData,
        updated_at: updateAtDateData,
        title: titleData,
        task_description: taskDescriptionData,
        action_description: actionDescriptionData
    }
    const response = await fetch('/tasks/' + taskData.task_id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
    })

    const responseData = await response.json();

    if(response.ok){
        alert(responseData.message);
    }else{
        alert(responseData.error);
    }
}


let deadlineDateDom = document.querySelector('#deadline-date');
let suggestDateDom = document.querySelector('#suggest-date');

suggestDateDom.addEventListener('change', () => {
    if(deadlineDateDom.value.trim() !== '' && suggestDateDom.value.trim() !== ''){
        if(deadlineDateDom.value < suggestDateDom.value){
            deadlineDateDom.classList.add('validation-error');
            suggestDateDom.classList.add('validation-error');
        }else{
            deadlineDateDom.classList.remove('validation-error');
            suggestDateDom.classList.remove('validation-error');
        }
    }else if(!suggestDateDom.validity.valid){
        suggestDateDom.classList.add('validation-error');
    }else if(suggestDateDom.value.trim() === ''){
        suggestDateDom.classList.add('validation-error');
    }
})

deadlineDateDom.addEventListener('change', () => {
    if(deadlineDateDom.value.trim() !== '' && suggestDateDom.value.trim() !== ''){
        if(deadlineDateDom.value < suggestDateDom.value){
            deadlineDateDom.classList.add('validation-error');
            suggestDateDom.classList.add('validation-error');
        }else{
            deadlineDateDom.classList.remove('validation-error');
            suggestDateDom.classList.remove('validation-error');
        }
    }else if(!deadlineDateDom.validity.valid){
        deadlineDateDom.classList.add('validation-error');
    }else if(deadlineDateDom.value.trim() === ''){
        deadlineDateDom.classList.add('validation-error');
    }
});

//register button
//status, priority, suggest_by, assigned_to, updated_by, suggested_at, deadline, completed_at, updated_at, title, task_description, action_description
const registerButton = document.querySelector('#register-button');

if (document.referrer.includes("/detail")){
    registerButton.textContent = '修正';
}else{
    registerButton.textContent = '登録';
}

registerButton.addEventListener('click', async (e) => {

    e.preventDefault();

    setAllData();

    function updateDeadlineDateValidationErrorMessage(){
        let deadlineDateDom = document.querySelector('#deadline-date');
        deadlineDateDom.classList.add('validation-error');
    }

    function validateEditDataDate(){
        let suggestDateDom = document.querySelector('#suggest-date');
        let deadlineDateDom = document.querySelector('#deadline-date');


        if(suggestDateDom.value.trim() !== '' && deadlineDateDom.value.trim() !== ''){
            if(suggestDateDom.value > deadlineDateDom.value){
                return false;
            }else{
                return true;
            }
        }else if(!suggestDateDom.validity.valid){
            return false;
        }else{
            return true;
        }
    };

    function validateEditDataWhiteSpaceWhenStatusIs1Or2(){
        if(statusData === '' || priorityData === '' || suggestedByData === '' || assignedToData === '' || updatedByData === '' || suggestedAtDateData === '' || deadlineDateData === '' || updateAtDateData === '' || titleData.trim() === '' || taskDescriptionData.trim() === ''){
            return false;
        }else{
            return true;
        }
    };
    function validateEditDataWhiteSpaceWhenStatusIs2To7(){
        if(statusData === '' || priorityData === '' || suggestedByData === '' || assignedToData === '' || updatedByData === '' || suggestedAtDateData === '' || deadlineDateData === '' || updateAtDateData === '' || titleData.trim() === '' || taskDescriptionData.trim() === '' || (actionDescriptionData ?? '' ).trim()=== ''){
            return false;
        }else{
            return true;
        }
    };
    function validateEditDataWhiteSpaceWhenStatusIs8(){
        if(statusData === '' || priorityData === '' || suggestedByData === '' || assignedToData === '' || updatedByData === '' || suggestedAtDateData === '' || deadlineDateData === '' || completedAtDateData === null || updateAtDateData === '' || titleData.trim() === '' || taskDescriptionData.trim() === '' || actionDescriptionData.trim() === ''){
            return false;
        }else{
            return true;
        }
    };

    async function validateEditDataWhenStatusIs1Or2(){

        let validateEditDataWhiteSpaceResult = validateEditDataWhiteSpaceWhenStatusIs1Or2();
        let validateEditDataDateResult = validateEditDataDate();

        if(!validateEditDataWhiteSpaceResult || !validateEditDataDateResult){
            updateValidationErrorMessage();
            updateDeadlineDateValidationErrorMessage();
            alert('入力内容を確認してください');
        }else{
            await editData();
            window.location.href = '/detail' + '/' + taskData.task_id;
        }
    }
    async function validateEditDataWhenStatusIs2To7(){
        let validateEditDataWhiteSpaceResult = validateEditDataWhiteSpaceWhenStatusIs2To7();
        let validateEditDataDateResult = validateEditDataDate();

        if(!validateEditDataWhiteSpaceResult || !validateEditDataDateResult){
            updateValidationErrorMessage();
            updateDeadlineDateValidationErrorMessage();
            alert('入力内容を確認してください');
        }else{
            await editData();
            window.location.href = '/detail' + '/' + taskData.task_id;
        }
    }
    async function validateEditDataWhenStatusIs8(){
        let validateEditDataWhiteSpaceResult = validateEditDataWhiteSpaceWhenStatusIs8();
        let validateEditDataDateResult = validateEditDataDate();

        if(!validateEditDataWhiteSpaceResult || !validateEditDataDateResult){
            updateValidationErrorMessage();
            updateDeadlineDateValidationErrorMessage();
            alert('入力内容を確認してください');
        }else{
            await editData();
            window.location.href = '/detail' + '/' + taskData.task_id;
        }
    }

    async function editDataValidation(){
        if(confirm('修正しますか？')){
            if(statusData === 1 || statusData === 2){
                validateEditDataWhenStatusIs1Or2();
            }else if(statusData === 8){
                validateEditDataWhenStatusIs8();
            }else{
                validateEditDataWhenStatusIs2To7();
            }
        }else{
            alert('修正をキャンセルしました');
        }
    }



    function validatePostDataDate(){
        let suggestDateDom = document.querySelector('#suggest-date');
        let deadlineDateDom = document.querySelector('#deadline-date');


        if(suggestDateDom.value.trim() !== '' && deadlineDateDom.value.trim() !== ''){
            if(suggestDateDom.value > deadlineDateDom.value){
                return false;
            }else{
                return true;
            }
        }else if(!suggestDateDom.validity.valid){
            return false;
        }else{
            return true;
        }
    }

    function validatePostDataWhiteSpaceWhenStatusIs1Or2(){
        if(statusData === '' || priorityData === '' || suggestedByData === '' || assignedToData === '' || updatedByData === '' || suggestedAtDateData === '' || deadlineDateData === '' || updateAtDateData === '' || titleData.trim() === '' || taskDescriptionData.trim() === ''){
            return false;
        }else{
            return true;
        }
    };
    function validatePostDataWhiteSpaceWhenStatusIs2To7(){
        if(statusData === '' || priorityData === '' || suggestedByData === '' || assignedToData === '' || updatedByData === '' || suggestedAtDateData === '' || deadlineDateData === '' || updateAtDateData === '' || titleData.trim() === '' || taskDescriptionData.trim() === '' || actionDescriptionData.trim() === ''){
            return false;
        }else{
            return true;
        }
    };
    function validatePostDataWhiteSpaceWhenStatusIs8(){
        if(statusData === '' || priorityData === '' || suggestedByData === '' || assignedToData === '' || updatedByData === '' || suggestedAtDateData === '' || deadlineDateData === '' || completedAtDateData === null || updateAtDateData === '' || titleData.trim() === '' || taskDescriptionData.trim() === '' || actionDescriptionData.trim() === ''){
            return false;
        }else{
            return true;
        }
    };

    async function validatePostDataWhenStatusIs1Or2(){
        let validatePostDataWhiteSpaceResult = validatePostDataWhiteSpaceWhenStatusIs1Or2();
        let validatePostDataDateResult = validatePostDataDate();

        if(!validatePostDataWhiteSpaceResult || !validatePostDataDateResult){
            updateValidationErrorMessage();
            updateDeadlineDateValidationErrorMessage();
            alert('入力内容を確認してください');
        }else{
            const postTaskData = await postData();
            window.location.href = '/detail' + '/' + postTaskData.task_id;
        }
    };
    async function validatePostDataWhenStatusIs2To7(){
        let validatePostDataWhiteSpaceResult = validatePostDataWhiteSpaceWhenStatusIs2To7();
        let validatePostDataDateResult = validatePostDataDate();

        if(!validatePostDataWhiteSpaceResult || !validatePostDataDateResult){
            updateValidationErrorMessage();
            updateDeadlineDateValidationErrorMessage();
            alert('入力内容を確認してください');
        }else{
            const postTaskData = await postData();
            window.location.href = '/detail' + '/' + postTaskData.task_id;
        }
    };
    async function validatePostDataWhenStatusIs8(){
        let validatePostDataWhiteSpaceResult = validatePostDataWhiteSpaceWhenStatusIs8();
        let validatePostDataDateResult = validatePostDataDate();

        if(!validatePostDataWhiteSpaceResult || !validatePostDataDateResult){
            updateValidationErrorMessage();
            updateDeadlineDateValidationErrorMessage();
            alert('入力内容を確認してください');
        }else{
            const postTaskData = await postData();
            window.location.href = '/detail' + '/' + postTaskData.task_id;
        }
    };
    
    async function postDataValidation(){
        if(confirm('登録しますか？')){
            if(statusData === 1 || statusData === 2){
                validatePostDataWhenStatusIs1Or2();
            }else if(statusData === 8){
                validatePostDataWhenStatusIs8();
            }else{
                validatePostDataWhenStatusIs2To7();
            }
        }else{
            alert('登録をキャンセルしました');
        }
    };

    if(taskData){
        editDataValidation()
    }else{
        postDataValidation()
    };

});

const cancelButton = document.querySelector('#cancle-button');
cancelButton.addEventListener('click', (e) => {
    e.preventDefault();
    if(document.referrer.includes("/detail")){
        if(confirm('修正をキャンセルしますか？')){
            alert('修正をキャンセルしました');
            window.location.href = '/detail' + '/' + taskData.task_id;
        }
    }else{
        if(confirm('登録をキャンセルしますか？')){
            alert('登録をキャンセルしました');
            window.location.href = '/list';
        }
    }
});


//Event: Document loaded
document.addEventListener('DOMContentLoaded', async () => {

    await fetchUserData();
    await fetchUsersData(); 
    modifyUserData(usersData);
    
    statusData = await editStatusData();
    priorityData = await editPriorityData();

    await createStateDropBox('status-drop-box', '100%', 2);

    await createPriorityDropBox('priority-drop-box', '100%', 2);
    await createUsersDropBox('user-drop-box', '100%');
    await createProfileCard();

    if(document.referrer.includes("/detail")){

        const registerButton = document.querySelector('#register-button');
        registerButton.textContent = '修正';

        const taskId = document.referrer.split("/").pop();
        await fetchTaskData(taskId);

        const taskIdText = document.querySelector('#task-id');
        taskIdText.textContent = taskData.task_id;

        const titleText = document.querySelector('#title');
        titleText.value = taskData.title;
        setTitleData();


        const descriptionActionErrorEssential = document.querySelector('#action-error-essential');

        const statusWrapper = document.querySelector('#status-drop-box');
        const statusDropBox = statusWrapper.querySelector('.drop-box');
        const statusDropBoxText = statusDropBox.querySelector('.drop-box-text');
        const defaultStatusData = statusData.find(status => status.id === taskData.status);
        statusDropBoxText.value = defaultStatusData.name;
        statusDropBoxText.dataset.id = defaultStatusData.id;
        if(defaultStatusData.id === 1 || defaultStatusData.id === 2){
            descriptionActionErrorEssential.classList.add('invisible');
        }else{
            descriptionActionErrorEssential.classList.remove('invisible');
        }
        setStatusData();

        const priorityWrapper = document.querySelector('#priority-drop-box');
        const priorityDropBox = priorityWrapper.querySelector('.drop-box');
        const priorityDropBoxText = priorityDropBox.querySelector('.drop-box-text');
        const defaultPriorityData = priorityData.find(priority => priority.id === taskData.priority);
        priorityDropBoxText.dataset.id = defaultPriorityData.id;
        priorityDropBoxText.value = defaultPriorityData.name;
        setPriorityData();

        const suggestUser = document.querySelector('#suggest-user');
        const defaultSuggestUserData = usersData.find(user => user.user_id === taskData.suggested_by);
        if(defaultSuggestUserData.last_name.length + defaultSuggestUserData.first_name.length > 5){
            let name = defaultSuggestUserData.last_name + ' ' + defaultSuggestUserData.first_name;
            name = name.slice(0, 6);
            name = name + '…';
            suggestUser.textContent = name;
        }else{
            suggestUser.textContent = defaultSuggestUserData.last_name + ' ' + defaultSuggestUserData.first_name;
        }
        setSuggestUserData();

        const suggestDate = document.querySelector('#suggest-date');
        const suggestDateInfo = new Date(taskData.suggested_at);
        const suggestDateInfoNextDay = suggestDateInfo.toLocaleDateString('en-CA');
        taskData.suggested_at = suggestDateInfoNextDay;
        suggestDate.value = taskData.suggested_at;
        setSuggestedAtDateData();

        const assignedToWrapper = document.querySelector('#user-drop-box');
        const assignedToDropBox = assignedToWrapper.querySelector('.drop-box');
        const assignedToDropBoxText = assignedToDropBox.querySelector('.drop-box-text');
        const defaultAssignedToUserData = usersData.find(user => user.user_id === taskData.assigned_to);
        assignedToDropBoxText.value = defaultAssignedToUserData.last_name + ' ' + defaultAssignedToUserData.first_name;
        assignedToDropBoxText.dataset.id = defaultAssignedToUserData.user_id;
        setAssignedToData();

        const deadlineDate = document.querySelector('#deadline-date');
        const deadlineDateInfo = new Date(taskData.deadline);
        const deadlineDateInfoNextDay = deadlineDateInfo.toLocaleDateString('en-CA');
        taskData.deadline = deadlineDateInfoNextDay;
        deadlineDate.value = taskData.deadline;
        setDeadlineDateData();

        const taskDescription = document.querySelector('#task-description');
        taskDescription.value = taskData.task_description;
        setTaskDescriptionData();

        const actionDescription = document.querySelector('#action-description');
        actionDescription.value = taskData.action_description;
        setActionDescriptionData();

        const updatedByWrapper = document.querySelector('#update-user');
        const defaultUpdatedByUserData = usersData.find(user => user.user_id === taskData.updated_by);
        if(defaultUpdatedByUserData.last_name.length + defaultUpdatedByUserData.first_name.length > 10){
            if(defaultUpdatedByUserData.last_name.length > 10){
                let name = defaultUpdatedByUserData.last_name;
                name = name.slice(0, 10);
                name = name + '…';
                updatedByWrapper.textContent = name;
            }else{
                let name = defaultUpdatedByUserData.last_name + ' ' + defaultUpdatedByUserData.first_name;
                name = name.slice(0, 11);
                name = name + '…';
                updatedByWrapper.textContent = name;
            }
        }else{
            updatedByWrapper.textContent = defaultUpdatedByUserData.last_name + ' ' + defaultUpdatedByUserData.first_name;
        }

        const updateDate = document.querySelector('#update-date');
        const updateDateInfo = new Date(taskData.updated_at);
        const updateDateInfoNextDay = updateDateInfo.toLocaleDateString('en-CA');
        taskData.updated_at = updateDateInfoNextDay;
        const updateDateInfoNextDaySlash = updateDateInfoNextDay.replace(/-/g, '/');
        updateDate.textContent = updateDateInfoNextDaySlash;

        const completeDate = document.querySelector('#complete-date');

        if(taskData.completed_at){
            const completeDateInfo = new Date(taskData.completed_at);
            const completeDateInfoNextDay = completeDateInfo.toLocaleDateString('en-CA');
            taskData.completed_at = completeDateInfoNextDay;
            const completeDateInfoNextDaySlash = completeDateInfoNextDay.replace(/-/g, '/');
            completeDate.textContent = completeDateInfoNextDaySlash;
        }else{
            completeDate.textContent = '';
        }

    }else{
        setRegisterSuggestUserData();
    }
    setAllData();

    const statusDropBoxWrapper = document.querySelector('#status-drop-box');
    const statusDropBox = statusDropBoxWrapper.querySelector('.drop-box-option-wrapper');
    const statusDropBoxItems = statusDropBox.querySelectorAll('.drop-box-option');
    const descriptionActionErrorEssential = document.querySelector('#action-error-essential');
    const actionDescription = document.querySelector('#action-description');
    statusDropBoxItems.forEach(item => {
        item.addEventListener('click', (e) => {
            statusData = Number(e.target.dataset.id);
            if(statusData === 1 || statusData === 2){
                descriptionActionErrorEssential.classList.add('invisible');
                actionDescription.classList.remove('validation-error');
            }else{
                descriptionActionErrorEssential.classList.remove('invisible');
            }
        });
    });


});
