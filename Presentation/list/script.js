import {createDropBox, setDropBoxValue, setDropBoxPlaceholder} from '../components/dropbox/dropbox.js';
import {createProfileCard} from '../components/profilecard/profilecard.js';
import {createUserListDropBox} from '../components/userlistdropbox/userlistdropbox.js';

const token = localStorage.getItem("token");

let taskData = [];
let userData = [];
let statusData = [];
let priorityData = [];
let usersListData = [];



//fetch
async function fetchTasks(){
    try {
        const response = await fetch('/tasks', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        taskData = data;

        //remove time from date
        taskData.forEach(element => {
            const suggestedAtInfo = new Date(element.suggested_at);
            const suggestedAtInfoNextDay = suggestedAtInfo.toLocaleDateString('en-CA');
            const suggestedAtInfoNextDaySlash = suggestedAtInfoNextDay.replace(/-/g, '/');
            element.suggested_at = suggestedAtInfoNextDaySlash;

            const deadlineInfo = new Date(element.deadline);
            const deadlineInfoNextDay = deadlineInfo.toLocaleDateString('en-CA');
            const deadlineInfoNextDaySlash = deadlineInfoNextDay.replace(/-/g, '/');
            element.deadline = deadlineInfoNextDaySlash;

            if(element.completed_at){
                const completedAtInfo = new Date(element.completed_at);
                const completedAtInfoNextDay = completedAtInfo.toLocaleDateString('en-CA');
                const completedAtInfoNextDaySlash = completedAtInfoNextDay.replace(/-/g, '/');
                element.completed_at = completedAtInfoNextDaySlash;
            }else{
                element.completed_at = null;
            }
            
            const updatedAtInfo = new Date(element.updated_at);
            const updatedAtInfoNextDay = updatedAtInfo.toLocaleDateString('en-CA');
            const updatedAtInfoNextDaySlash = updatedAtInfoNextDay.replace(/-/g, '/');
            element.updated_at = updatedAtInfoNextDaySlash;
        });

        //ascending order
        taskData.sort((a, b) => b.task_id - a.task_id);


    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

async function fetchUsers(){
    try {
        const response = await fetch('/users', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        userData = data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

async function fetchStatus(){
    try {
        const response = await fetch('/status', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json(); 
        statusData = data;
    } catch (error) {
        console.error('Error fetching status:', error);
    }
}

async function fetchPriority(){
    try {
        const response = await fetch('/priority', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        priorityData = data;
    } catch (error) {
        console.error('Error fetching priority:', error);
    }
}



//modify

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

    userData.unshift({
        id: 'none',
        name: '未選択',
        email: '指定しない場合選択してください'
    });
    
    usersListData = userData;


}

function modifyStatusData(data){
    
    let numData = [];

    data.forEach(status => {
        numData.push({
            id: status.status_id,
            name: status.status
        });
    });

    statusData = numData;
}

function modifyPriorityData(data){
    let numData = [];
    data.forEach(priority => {
        numData.push({
            id: priority.priority_id,
            name: priority.priority
        });
    });
    priorityData = numData;
} 



//drop-box

let displayCountData = [
    {
        id: 1,
        name: '20件',
        value: 20,
    },
    {
        id: 2,
        name: '40件',
        value: 40,
    }
];


//list

let listItemOreder = [
    'task_id','status','priority','title','suggested_by','suggested_at','assigned_to','deadline','completed_at',
];

async function createListItem(data, displayCountData){

    const listItemWrapper = document.querySelector('.list-item-wrapper');

    await manufactureTaskData(data);

    for(let j = 0; j < displayCountData; j++){
        let listWrapper = document.createElement('div');
        listWrapper.classList.add('list-wrapper','item');
        for(let i = 0; i < listItemOreder.length; i++){
            let id = listItemOreder[i];
            let listItem = document.createElement('div');
            if(id === 'assigned_to' || id === 'suggested_by'){
                let name = data[j][id];
                let nameLength = name.replace(/\s/g, '').length;
                if(nameLength > 5){
                    name = name.split(' ');
                    if(name[0].length > 5){
                        name[0] = name[0].slice(0, 5);
                        name[0] = name[0] + '…';
                        listItem.textContent = name[0];
                    }else{
                        let fullName = name[0] + ' ' + name[1];
                        fullName = fullName.slice(0, 6) + '…';
                        listItem.textContent = fullName;
                    }
                }else{
                    listItem.textContent = name;
                }

            }else{
                listItem.textContent = data[j][id];
            }

            listWrapper.appendChild(listItem);
            if(id === 'status'){
                //add div inside div to make status banner
                let dataStatus = statusToStatus_id(data[j]);
                listItem.classList.add('list-item','status-id-' + dataStatus);
            }else{
                listItem.classList.add('list-item');
            }
        }
        listItemWrapper.appendChild(listWrapper);

        listWrapper.addEventListener('click', () => {
            
        });
    }
    return listItemWrapper;
}

async function manufactureTaskData(data){
    for(let i = 0; i < data.length; i++){
        data[i].status = statusData.find(status => status.id === data[i].status).name;
        data[i].priority = priorityData.find(priority => priority.id === data[i].priority).name;
        data[i].suggested_by = userData.find(user => user.user_id === data[i].suggested_by).last_name + ' ' + userData.find(user => user.user_id === data[i].suggested_by).first_name;
        data[i].assigned_to = userData.find(user => user.user_id === data[i].assigned_to).last_name + ' ' + userData.find(user => user.user_id === data[i].assigned_to).first_name;
    }
}

function statusToStatus_id(data){
    return statusData.find(status => status.name === data.status).id;
}

let listItems;

async function createListItems(data){
    
    let listItemsArray = [];

    for(let j = 0; j < data.length; j++){
        let listWrapper = document.createElement('div');
        listWrapper.classList.add('list-wrapper','item');
        for(let i = 0; i < listItemOreder.length; i++){
            let id = listItemOreder[i];
            let listItem = document.createElement('div');
            if(id === 'assigned_to' || id === 'suggested_by'){
                let name = data[j][id];
                let nameLength = name.replace(/\s/g, '').length;
                if(nameLength > 5){
                    name = name.split(' ');
                    if(name[0].length > 5){
                        name[0] = name[0].slice(0, 5);
                        name[0] = name[0] + '…';
                        listItem.textContent = name[0];
                    }else{
                        let fullName = name[0] + ' ' + name[1];
                        fullName = fullName.slice(0, 6) + '…';
                        listItem.textContent = fullName;
                    }
                }else{
                    listItem.textContent = name;
                }
            }else{
                listItem.textContent = data[j][id];
            }


            listWrapper.appendChild(listItem);

            if(id === 'status'){
                let dataStatus = statusToStatus_id(data[j]);
                listItem.classList.add('list-item','status-id-' + dataStatus);
            }else if(id === 'title'){
                //add div inside div to make status banner
                listItem.classList.add('list-item','title');
            }else{
                listItem.classList.add('list-item');
            }
        }
        listWrapper.addEventListener('click', async () => {

            const response = await fetch('/tasks/' + data[j].task_id, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const confirmData = await response.json();
            if(confirmData.error){
                alert('指定されたタスクは存在しません');
                window.location.reload();
            }else{
                window.location.href = '/detail/' + confirmData.task_id;    
            }
        });
        listItemsArray.push(listWrapper);
    }
    listItems = listItemsArray;
}

function appendListItems(listItems, startIndex, endIndex){
    const listItemWrapper = document.querySelector('.list-item-wrapper');
    for(let i = startIndex; i < endIndex; i++){
        listItemWrapper.appendChild(listItems[i]);
    }
}



//pagination

let count;
let list;
let page;

function chunkArray(array, size){
    const result = [];
    for(let i = 0; i < array.length; i += size){
        result.push(array.slice(i, i + size));
    }
    return result;
}

//表示件数の値を取得取得、countに格納
function setCount(){
    const defaultCount = document.querySelector('#display-count');
    const defaultCountValue = defaultCount.querySelector('.drop-box-text');
    count = Number(defaultCountValue.value.split('件')[0]);
}

function makeList(){
    list = listItems.slice();
    list = chunkArray(list, count);
}

function initializePageCount(){
    page = 1;
}

function addPage(){
    page++;
}

function subPage(){
    page--;
}

function toogleButtonDisabled(component){
    component.classList.add('disabled');
}

function toogleButtonEnabled(component){
    component.classList.remove('disabled');
}

function toogleButtonReset(){
    if(list.length === 1){
        toogleButtonDisabled(listPageControlButtonPrev);
        toogleButtonDisabled(listPageControlButtonNext);
    }else{
        toogleButtonDisabled(listPageControlButtonPrev);
        toogleButtonEnabled(listPageControlButtonNext);
    }
}

function renderLists(){
    const listItemWrapper = document.querySelector('.list-item-wrapper');
    listItemWrapper.replaceChildren();
    for(let i = 0; i < list[page - 1].length; i++){
        listItemWrapper.appendChild(list[page - 1][i]);
    }
}

function renderDisplayCountInfo(){
    const displayCountInfo = document.querySelector('.tasks-counts-info');
    displayCountInfo.textContent = `全 ${listItems.length}件中 ${(count * (page - 1)) + 1}-${(count * (page - 1)) + list[page - 1].length}件目`;
}

function changeCount(){
    setCount();
    makeList();
    initializePageCount();
    renderDisplayCountInfo();
    renderLists();
    toogleButtonReset();
}
    
/*
イベントの流れ
1.setCount()
2.makeList()
3.initializePageCount()
4.renderDisplayCountInfo()
5.renderLists()
*/

const listPageControlButtonPrev = document.querySelector('#prev');
const listPageControlButtonNext = document.querySelector('#next');
const displayCountwrapper = document.querySelector('#display-count');

displayCountwrapper.addEventListener('click', () => {
    changeCount();
})

listPageControlButtonPrev.addEventListener('click', () => {
    if(page > 1){
        subPage();
        renderDisplayCountInfo();
        renderLists();
        toogleButtonEnabled(listPageControlButtonNext);
    }

    if((page - 1) <= 0){
        toogleButtonDisabled(listPageControlButtonPrev);
    }
});

listPageControlButtonNext.addEventListener('click', () => {
    if((page + 1) <= list.length){
        addPage();
        renderDisplayCountInfo();
        renderLists();
        toogleButtonEnabled(listPageControlButtonPrev);
    }else{
        toogleButtonDisabled(listPageControlButtonNext);
    }

    if(page + 1 > list.length){
        toogleButtonDisabled(listPageControlButtonNext);
    }
});



//search機能

function modifySeachData(data){
    //remove time from date
    data.forEach(element => {
        const suggestedAtInfo = new Date(element.suggested_at);
        const suggestedAtInfoNextDay = suggestedAtInfo.toLocaleDateString('en-CA');
        const suggestedAtInfoNextDaySlash = suggestedAtInfoNextDay.replace(/-/g, '/');
        element.suggested_at = suggestedAtInfoNextDaySlash;

        const deadlineInfo = new Date(element.deadline);
        const deadlineInfoNextDay = deadlineInfo.toLocaleDateString('en-CA');
        const deadlineInfoNextDaySlash = deadlineInfoNextDay.replace(/-/g, '/');
        element.deadline = deadlineInfoNextDaySlash;

        if(element.completed_at){
            const completedAtInfo = new Date(element.completed_at);
            const completedAtInfoNextDay = completedAtInfo.toLocaleDateString('en-CA');
            const completedAtInfoNextDaySlash = completedAtInfoNextDay.replace(/-/g, '/');
            element.completed_at = completedAtInfoNextDaySlash;
        }else{
            element.completed_at = null;
        }
        
        const updatedAtInfo = new Date(element.updated_at);
        const updatedAtInfoNextDay = updatedAtInfo.toLocaleDateString('en-CA');
        const updatedAtInfoNextDaySlash = updatedAtInfoNextDay.replace(/-/g, '/');
        element.updated_at = updatedAtInfoNextDaySlash;
    });

        //ascending order
    data.sort((a, b) => b.task_id - a.task_id);
}

const searchButton = document.querySelector('#search-button');

searchButton.addEventListener('click', async () => {

    //日付Validation　⇒配列に配列として開始日と終了日の情報を入れると、それぞれのValidationを行うことができる
    function dateValidation(){
        let dateValidationResult = {};
        const dateValidation = [
            [
                {
                    id: 'suggested-at-start',
                    wrapper: document.querySelector('#suggested-at-start')
                },
                {
                    id: 'suggested-at-end',
                    wrapper: document.querySelector('#suggested-at-end')
                }
            ],
            [
                {
                    id: 'deadline-start',
                    wrapper: document.querySelector('#deadline-start')
                },
                {
                    id: 'deadline-end',
                    wrapper: document.querySelector('#deadline-end')
                    }
            ],
            [
                {
                    id: 'completed-at-start',
                    wrapper: document.querySelector('#completed-at-start')
                },
                {
                    id: 'completed-at-end',
                    wrapper: document.querySelector('#completed-at-end')
                    }
            ]
        ]

        for(let i = 0; i < dateValidation.length; i++){
            dateValidation[i].forEach((element, index) => {
                if(element.id.includes('start')){
                    if(element.wrapper.value.trim() !== '' && dateValidation[i][index + 1].wrapper.value.trim() !== ''){
                        if(dateValidation[i][index + 1].wrapper.value.trim() !== '' && element.wrapper.value > dateValidation[i][index + 1].wrapper.value){
                            dateValidationResult[`${element.id}`] = false;
                        }
                    }else if(!element.wrapper.validity.valid){
                        dateValidationResult[`${element.id}`] = false;
                    }
                    return;
                }else if(element.id.includes('end')){
                    if(element.wrapper.value.trim() !== '' && dateValidation[i][index - 1].wrapper.value.trim() !== ''){
                        if(dateValidation[i][index - 1].wrapper.value.trim() !== '' && element.wrapper.value < dateValidation[i][index - 1].wrapper.value){
                            dateValidationResult[`${element.id}`] = false;
                        }
                    }else if(!element.wrapper.validity.valid){
                        dateValidationResult[`${element.id}`] = false;
                    }
                    return;
                }
            });
        }
        return dateValidationResult;
    }

    let dateValidationResult = dateValidation();
    let dateValidationResultKeys = Object.keys(dateValidationResult);


    
    if(dateValidationResultKeys.length > 0){

        function dateValidationResultKeysToText(array){
            return [
                array.some(item => item.includes("suggested")) && "起票日",
                array.some(item => item.includes("deadline")) && "期限日",
                array.some(item => item.includes("completed")) && "完了日"
            ].filter(Boolean).join(' ,');
        }

        alert(`${dateValidationResultKeysToText(dateValidationResultKeys)}の入力を確認してください`);
        return;
    }


    
    let status = [];
    let priority = [];
    let title = [];
    let suggestedBy = [];
    let suggestedAtStart = [];
    let suggestedAtEnd = [];
    let assignedTo = [];
    let deadlineStart = [];
    let deadlineEnd = [];
    let completedAtStart = [];
    let completedAtEnd = [];

    //status, priorityのチェックボックスを取得
    const statusCheckboxesWrapper = document.querySelector('#status-options-wrapper');
    const statusCheckboxesOptions = statusCheckboxesWrapper.children;
    const priorityCheckboxesWrapper = document.querySelector('#priority-options-wrapper');
    const priorityCheckboxesOptions = priorityCheckboxesWrapper.children;
    
    for(let i = 0; i < statusCheckboxesOptions.length; i++){
        let statusCheckboxes = statusCheckboxesOptions[i].querySelector('.checkbox-icon');
        let statusId = statusCheckboxes.dataset.status_id;
        if(statusCheckboxes.checked){
            status.push(statusId);
        }
    }
    
    if(status.length === 0){
        status.push(null);
    }

    for(let i = 0; i < priorityCheckboxesOptions.length; i++){
        let priorityCheckboxes = priorityCheckboxesOptions[i].querySelector('.checkbox-icon');
        let priorityId = priorityCheckboxes.dataset.priority_id;
        if(priorityCheckboxes.checked){
            priority.push(priorityId);
        }
    }

    if(priority.length === 0){
        priority.push(null);
    }

    //title
    const titleInput = document.querySelector('#title-input');
    if(titleInput.value){
        title.push(titleInput.value);
    }else{
        title.push(null);
    }

    //suggestedBy
    const suggestedByWrapper = document.querySelector('#suggested-by');
    const suggestedByDropBox = suggestedByWrapper.querySelector('.drop-box');
    const suggestedByDropBoxText = suggestedByDropBox.querySelector('.drop-box-text');
    if(suggestedByDropBoxText.dataset.id === 'none'){
        suggestedBy.push(null);
    }else{
        suggestedBy.push(suggestedByDropBoxText.dataset.id);
    }

    //suggestedAtStart
    const suggestedAtStartWrapper = document.querySelector('#suggested-at-start');
    if(suggestedAtStartWrapper.value === ''){
        suggestedAtStart.push(null);
    }else{
        suggestedAtStart.push(suggestedAtStartWrapper.value);
    }

    //suggestedAtEnd
    const suggestedAtEndWrapper = document.querySelector('#suggested-at-end');
    if(suggestedAtEndWrapper.value === ''){
        suggestedAtEnd.push(null);
    }else{
        suggestedAtEnd.push(suggestedAtEndWrapper.value);
    }

    //assignedTo
    const assignedToWrapper = document.querySelector('#assigned-to');
    const assignedToDropBox = assignedToWrapper.querySelector('.drop-box');
    const assignedToDropBoxText = assignedToDropBox.querySelector('.drop-box-text');
    if(assignedToDropBoxText.dataset.id === 'none'){
        assignedTo.push(null);
    }else{
        assignedTo.push(assignedToDropBoxText.dataset.id);
    }

    //deadlineStart
    const deadlineStartWrapper = document.querySelector('#deadline-start');
    if(deadlineStartWrapper.value === ''){
        deadlineStart.push(null);
    }else{
        deadlineStart.push(deadlineStartWrapper.value);
    }

    //deadlineEnd
    const deadlineEndWrapper = document.querySelector('#deadline-end');
    if(deadlineEndWrapper.value === ''){
        deadlineEnd.push(null);
    }else{
        deadlineEnd.push(deadlineEndWrapper.value);
    }

    //completedAtStart
    const completedAtStartWrapper = document.querySelector('#completed-at-start');
    if(completedAtStartWrapper.value === ''){
        completedAtStart.push(null);
    }else{
        completedAtStart.push(completedAtStartWrapper.value);
    }

    //completedAtEnd
    const completedAtEndWrapper = document.querySelector('#completed-at-end');
    if(completedAtEndWrapper.value === ''){
        completedAtEnd.push(null);
    }else{
        completedAtEnd.push(completedAtEndWrapper.value);
    }

    const params = new URLSearchParams();
    params.append('status', status);
    params.append('priority', priority);
    params.append('title', title);
    params.append('suggestedBy', suggestedBy);
    params.append('suggestedAtStart', suggestedAtStart);
    params.append('suggestedAtEnd', suggestedAtEnd);
    params.append('assignedTo', assignedTo);
    params.append('deadlineStart', deadlineStart);
    params.append('deadlineEnd', deadlineEnd);
    params.append('completedAtStart', completedAtStart);
    params.append('completedAtEnd', completedAtEnd);

    const response = await fetch('/tasks/search?' + params.toString(), {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    if(data.length === 0){
        alert("検索結果がありません");
    }else if(response.status === 401){
        window.location.href = "/login";
        alert("セッションが切れました。再度ログインしてください。");
    }else{
        await manufactureTaskData(data);
        modifySeachData(data);
        await createListItems(data);
        changeCount();
    }
});

const searchInput = document.querySelector('.search-bar-middle-title-search-input');
searchInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        e.preventDefault();
        searchButton.click();
    }
})

//condition リセット
const conditionResetButton = document.querySelector('#condition-reset-button');
conditionResetButton.addEventListener('click', () => {
    const statusCheckboxesWrapper = document.querySelector('#status-options-wrapper');
    const statusCheckboxesOptions = statusCheckboxesWrapper.children;
    for(let i = 0; i < statusCheckboxesOptions.length; i++){
        let statusCheckboxes = statusCheckboxesOptions[i].querySelector('.checkbox-icon');
        statusCheckboxes.checked = false;
    }
    const priorityCheckboxesWrapper = document.querySelector('#priority-options-wrapper');
    const priorityCheckboxesOptions = priorityCheckboxesWrapper.children;
    for(let i = 0; i < priorityCheckboxesOptions.length; i++){
        let priorityCheckboxes = priorityCheckboxesOptions[i].querySelector('.checkbox-icon');
        priorityCheckboxes.checked = false;
    }
    const titleInput = document.querySelector('#title-input');
    titleInput.value = '';

    const suggestedByWrapper = document.querySelector('#suggested-by');
    const suggestedByDropBox = suggestedByWrapper.querySelector('.drop-box');
    const suggestedByDropBoxText = suggestedByDropBox.querySelector('.drop-box-text');
    suggestedByDropBoxText.dataset.id = 'none';
    suggestedByDropBoxText.dataset.name = '未選択';
    suggestedByDropBoxText.value = '未選択';
    suggestedByDropBoxText.dataset.email = '指定しない場合選択してください';

    const assignedToWrapper = document.querySelector('#assigned-to');
    const assignedToDropBox = assignedToWrapper.querySelector('.drop-box');
    const assignedToDropBoxText = assignedToDropBox.querySelector('.drop-box-text');
    assignedToDropBoxText.dataset.id = 'none';
    assignedToDropBoxText.dataset.name = '未選択';
    assignedToDropBoxText.value = '未選択';
    assignedToDropBoxText.dataset.email = '指定しない場合選択してください';

    const suggestedAtStartWrapper = document.querySelector('#suggested-at-start');
    suggestedAtStartWrapper.value = '';
    // suggestedAtStartWrapper.classList.add('placeholder');

    const suggestedAtEndWrapper = document.querySelector('#suggested-at-end');
    suggestedAtEndWrapper.value = '';
    // suggestedAtEndWrapper.classList.add('placeholder');

    const deadlineStartWrapper = document.querySelector('#deadline-start');
    deadlineStartWrapper.value = '';
    // deadlineStartWrapper.classList.add('placeholder');

    const deadlineEndWrapper = document.querySelector('#deadline-end');
    deadlineEndWrapper.value = '';
    // deadlineEndWrapper.classList.add('placeholder');

    const completedAtStartWrapper = document.querySelector('#completed-at-start');
    completedAtStartWrapper.value = '';
    // completedAtStartWrapper.classList.add('placeholder');

    const completedAtEndWrapper = document.querySelector('#completed-at-end');
    completedAtEndWrapper.value = '';
    // completedAtEndWrapper.classList.add('placeholder');

});



//課題登録ボタン
const taskRegistrationButton = document.querySelector('#task-registration-button');
taskRegistrationButton.addEventListener('click', () => {
    window.location.href = '/registrationfix';
});





//userListDropBox
function userListDropBoxEvent(id){
    const userListDropBox = document.querySelector('#' + id);
    const userListDropBoxOptionWrapper = userListDropBox.querySelector('.drop-box-option-wrapper');
    const userListDropBoxText = userListDropBox.querySelector('.drop-box-text');
    const userListDropBoxOptions = userListDropBoxOptionWrapper.children;

    for(let i = 0; i < userListDropBoxOptions.length; i++){
        let option = userListDropBoxOptions[i];
        let optionEmail = option.children[0];
        option.addEventListener('click', () => {
            userListDropBoxText.dataset.name = option.dataset.name;
            userListDropBoxText.dataset.id = option.dataset.id;
            userListDropBoxText.dataset.email = option.dataset.email;
            userListDropBoxText.value = option.dataset.name;
        });
        optionEmail.addEventListener('click', () => {
            userListDropBoxText.dataset.name = option.dataset.name;
            userListDropBoxText.dataset.id = option.dataset.id;
            userListDropBoxText.dataset.email = option.dataset.email;
            userListDropBoxText.value = option.dataset.name;
        });
    };  
}

function createUsersDropBox(id, width){
    createUserListDropBox(id, width, usersListData, 10, 21);
    userListDropBoxEvent(id);
}

document.addEventListener('DOMContentLoaded', async () => {

    await fetchUsers();
    await fetchStatus();
    await fetchPriority();
    await fetchTasks();

    modifyStatusData(statusData);
    modifyPriorityData(priorityData);
    modifyUserData(userData);
    manufactureTaskData(taskData);

    createDropBox('display-count', '128px', displayCountData);
    setDropBoxValue('display-count', 1, '20件');
    
    createUsersDropBox('suggested-by', '256px');
    createUsersDropBox('assigned-to', '256px');

    await createProfileCard();
    
    await createListItems(taskData);
    changeCount();

});


window.addEventListener('pageshow', (e) => {
    if(e.persisted){
        window.location.reload();
    }
});