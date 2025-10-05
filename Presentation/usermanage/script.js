import {createCheckbox} from '../components/checkbox/checkbox.js';
import {createDropBox} from '../components/dropbox/dropbox.js';
import {setDropBoxValue} from '../components/dropbox/dropbox.js';
import {createProfileCard} from '../components/profilecard/profilecard.js';

const token = localStorage.getItem("token");

let userData = [];
let profileData ;

async function fetchUser(){
    const response = await fetch("/profile", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    profileData = data;
    return data;
}

async function fetchUsers(){
    const response = await fetch("/users", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
    const data = await response.json();
    userData = data.sort((a, b) => a.user_id - b.user_id);
    return data;
}






async function renderUserList(startIndex, endIndex){

    
    let contentListWrapper = document.querySelector('.content-list-wrapper');

    const contentListWrapperChildren = contentListWrapper.children;
    
    if(contentListWrapperChildren.length > 1){
        Array.from(contentListWrapperChildren).forEach(element => {
            if(!element.classList.contains('subject')){
                contentListWrapper.removeChild(element);
            }
        })
    }



    for(let i = startIndex; i < endIndex; i++){
        let listWrapper = document.createElement('div');
        listWrapper.classList.add('list-wrapper','item');
        //
        let listNumber = document.createElement('div');
        listNumber.classList.add('list-item');
        listNumber.textContent = userData[i].user_id;
        listWrapper.appendChild(listNumber);

        let listLastName = document.createElement('div');
        listLastName.classList.add('list-item','wrapper');
        let listLastNameInput = document.createElement('input');
        listLastNameInput.dataset.id = userData[i].user_id;
        listLastNameInput.dataset.subject = 'last_name';
        listLastNameInput.classList.add('list-item','input');
        listLastNameInput.type = 'text';
        listLastNameInput.value = userData[i].last_name;
        listLastNameInput.addEventListener('input', (e) => {
            listLastNameInput.classList.add('edited');
            if(e.target.value.trim() === ""){
                listLastNameInput.classList.add('error');
                lastNameValidMessage.classList.remove('invisible');
                lastNameValidMessage.textContent = '姓を入力してください';
            }else if(e.target.value.length > 20){
                lastNameValidMessage.textContent = "姓は20文字以内入力してください";
                lastNameValidMessage.classList.remove("invisible")
                listLastNameInput.classList.add("error");
            }else{
                listLastNameInput.classList.remove('error');
                lastNameValidMessage.classList.add('invisible');
            }
        });

        listLastName.appendChild(listLastNameInput);
        listWrapper.appendChild(listLastName);
        let lastNameValidMessage = document.createElement('div');
        lastNameValidMessage.textContent = '姓を入力してください';
        lastNameValidMessage.classList.add('error-message', 'invisible');
        listLastName.appendChild(lastNameValidMessage);
        

        let listFirstName = document.createElement('div');
        listFirstName.classList.add('list-item','wrapper');
        let listFirstNameInput = document.createElement('input');
        listFirstNameInput.dataset.id = userData[i].user_id;
        listFirstNameInput.dataset.subject = 'first_name';
        listFirstNameInput.classList.add('list-item','input');
        listFirstNameInput.type = 'text';
        listFirstNameInput.value = userData[i].first_name;
        listFirstNameInput.addEventListener('input', (e) => {
            listFirstNameInput.classList.add('edited');
            if(e.target.value.trim() === ""){
                listFirstNameInput.classList.add('error');
                listFirstNameValidMessage.classList.remove('invisible');
                listFirstNameValidMessage.textContent = '名を入力してください';
            }else if(e.target.value.length > 20){
                listFirstNameValidMessage.textContent = "名は20文字以内入力してください";
                listFirstNameValidMessage.classList.remove("invisible")
                listFirstNameInput.classList.add("error");
            }else{
                listFirstNameInput.classList.remove('error');
                listFirstNameValidMessage.classList.add('invisible');
            }
        });
        listFirstName.appendChild(listFirstNameInput);
        listWrapper.appendChild(listFirstName);

        let listFirstNameValidMessage = document.createElement('div');
        listFirstNameValidMessage.textContent = '名を入力してください';
        listFirstNameValidMessage.classList.add('error-message', 'invisible');
        listFirstName.appendChild(listFirstNameValidMessage);


        let listEmail = document.createElement('div');
        listEmail.classList.add('list-item','wrapper');
        let listEmailInput = document.createElement('input');   
        listEmailInput.dataset.id = userData[i].user_id;
        listEmailInput.dataset.subject = 'email_address';
        listEmailInput.classList.add('list-item','input', 'text-left');
        listEmailInput.type = 'email';
        listEmailInput.value = userData[i].email_address;
        listEmailInput.addEventListener('input', (e) => {
            const hiragana = /[\u3040-\u309F]/;
            const katakana = /[\u30A0-\u30FF]/;
            const halfWidthKatakana = /[\uFF65-\uFF9F]/;
            const fullWidth = /[\uFF01-\uFF60\uFFE0-\uFFE6]/;

            listEmailInput.classList.add('edited');
            if(e.target.value.trim() === ""){
                listEmailInput.classList.add('error');
                listEmailValidMessage.classList.remove('invisible');
                listEmailValidMessage.textContent = 'メールアドレスを入力してください';
            }else if(e.target.value.length > 50){
                listEmailValidMessage.textContent = "メールアドレスは50文字以内入力してください";
                listEmailValidMessage.classList.remove("invisible")
                listEmailInput.classList.add("error");
            }else if(e.target.value.match(hiragana) || e.target.value.match(katakana) || e.target.value.match(halfWidthKatakana) || e.target.value.match(fullWidth)){
                listEmailValidMessage.textContent = "全角文字や半角カタカナは入力できません";
                listEmailValidMessage.classList.remove("invisible")
                listEmailInput.classList.add("error");
            }else if(e.target.validity.typeMismatch){
                listEmailInput.classList.add('error');
                listEmailValidMessage.classList.remove('invisible');
                listEmailValidMessage.textContent = 'メールアドレスの形式が正しくありません';
            }else{
                listEmailInput.classList.remove('error');
                listEmailValidMessage.classList.add('invisible');
            }
        });
        listEmail.appendChild(listEmailInput);
        listWrapper.appendChild(listEmail);

        let listEmailValidMessage = document.createElement('div');

        listEmailValidMessage.classList.add('error-message', 'invisible', 'text-left');
        listEmail.appendChild(listEmailValidMessage);


        let listPassword = document.createElement('div');
        listPassword.classList.add('list-item','wrapper');
        let listPasswordInput = document.createElement('input');
        listPasswordInput.dataset.id = userData[i].user_id;
        listPasswordInput.dataset.subject = 'password';
        listPasswordInput.classList.add('list-item','input', 'text-left');
        listPasswordInput.type = 'password';
        listPasswordInput.placeholder = '新しいパスワードを入力してください';

        let listPasswordValidMessage = document.createElement('div');
        listPasswordValidMessage.textContent = 'パスワードを入力してください';
        listPasswordValidMessage.classList.add('error-message', 'invisible', 'text-left');


        listPasswordInput.addEventListener('input', (e) => {
            listPasswordInput.classList.add('edited');

            const hiragana = /[\u3040-\u309F]/;
            const katakana = /[\u30A0-\u30FF]/;
            const halfWidthKatakana = /[\uFF65-\uFF9F]/;
            const fullWidth = /[\uFF01-\uFF60\uFFE0-\uFFE6]/;

            if(e.target.value.trim() === ""){
                listPasswordValidMessage.textContent = "パスワードを入力してください";
                listPasswordValidMessage.classList.remove("invisible")
                listPasswordInput.classList.add("error");
            }else if(e.target.value.length > 60){
                listPasswordValidMessage.textContent = "パスワードは60文字以内入力してください";
                listPasswordValidMessage.classList.remove("invisible")
                listPasswordInput.classList.add("error");
            }else if(e.target.value.match(hiragana) || e.target.value.match(katakana) || e.target.value.match(halfWidthKatakana) || e.target.value.match(fullWidth)){
                listPasswordValidMessage.textContent = "全角文字や半角カタカナは入力できません";
                listPasswordValidMessage.classList.remove("invisible")
                listPasswordInput.classList.add("error");
            }else{
                listPasswordInput.classList.remove('error');
                listPasswordValidMessage.classList.add('invisible');
            }

        });
        listPassword.appendChild(listPasswordInput);
        listWrapper.appendChild(listPassword);
        listPassword.appendChild(listPasswordValidMessage);

        let listTaskDeleteRight = document.createElement('div');
        listTaskDeleteRight.classList.add('list-item','wrapper');
        let listTaskDeleteRightInput = document.createElement('input');
        listTaskDeleteRightInput.dataset.id = userData[i].user_id;
        listTaskDeleteRightInput.dataset.subject = 'task_delete_right';
        listTaskDeleteRightInput.classList.add('list-item','checkbox');
        listTaskDeleteRightInput.type = 'checkbox';
        listTaskDeleteRightInput.checked = userData[i].task_delete_right;
        listTaskDeleteRightInput.value = userData[i].task_delete_right;
        listTaskDeleteRightInput.addEventListener('input', (e) => {
            listTaskDeleteRightInput.classList.add('edited');
            listTaskDeleteRightInput.value = listTaskDeleteRightInput.checked;
        });
        listTaskDeleteRight.appendChild(listTaskDeleteRightInput);
        listWrapper.appendChild(listTaskDeleteRight);

        let listUserManageRight = document.createElement('div');
        listUserManageRight.classList.add('list-item','wrapper');
        let listUserManageRightInput = document.createElement('input');
        listUserManageRightInput.dataset.id = userData[i].user_id;
        listUserManageRightInput.dataset.subject = 'user_manage_right';
        listUserManageRightInput.classList.add('list-item','checkbox');
        listUserManageRightInput.type = 'checkbox';
        listUserManageRightInput.checked = userData[i].user_manage_right;
        listUserManageRightInput.addEventListener('input', (e) => {
            if(userData[i].user_id === profileData.user_id){
                alert('自分の権限は変更できません');
                listUserManageRightInput.checked = userData[i].user_manage_right;
                return;
            }
            listUserManageRightInput.value = listUserManageRightInput.checked;
            listUserManageRightInput.classList.add('edited');
        });
        listUserManageRight.appendChild(listUserManageRightInput);
        listWrapper.appendChild(listUserManageRight);

        contentListWrapper.appendChild(listWrapper);
    }

}        



let taskManageData = [
    {
        id: 1,
        name: '有',
    },
    {
        id: 2,
        name: '無',
    },

];

let displayCountData = [
    {
        id: 1,
        name: '20件',
    },
    {
        id: 2,
        name: '40件',
    }
];


let displayCount = {
    count: 20,
    startIndex: 0,
    endIndex: 20,

    reset: function(){
        this.startIndex = 0;
    }
};



const displayCountInfo = document.querySelector('.content-list-count-info');

function updateDisplayCountInfo(){
    displayCountInfo.textContent = `全 ${userData.length}件中 ${displayCount.startIndex + 1}-${displayCount.endIndex}件目`;
}



const listPageControlButtonPrev = document.querySelector('#prev');
const listPageControlButtonNext = document.querySelector('#next');

listPageControlButtonPrev.addEventListener('click', (e) => {

    displayCount.endIndex = displayCount.startIndex + displayCount.count;

    if (displayCount.startIndex === 0){
        listPageControlButtonPrev.classList.add('disabled');
        return;
    }
    displayCount.startIndex -= displayCount.count;
    displayCount.endIndex -= displayCount.count;
    renderUserList(displayCount.startIndex, displayCount.endIndex); 
    listPageControlButtonNext.classList.remove('disabled');

    if(displayCount.startIndex === 0){
        listPageControlButtonPrev.classList.add('disabled');
    }
    updateDisplayCountInfo();

    console.log('prev');
    console.log(userData.length);
    console.log(displayCount.startIndex);
    console.log(displayCount.endIndex);
    console.log(displayCount.count);

});

listPageControlButtonNext.addEventListener('click', (e) => {

    if(displayCount.startIndex + displayCount.count >= userData.length){
        return;
    }

    displayCount.startIndex += displayCount.count;
    displayCount.endIndex += displayCount.count;

    if(displayCount.endIndex > userData.length){
        displayCount.endIndex = userData.length;
        renderUserList(displayCount.startIndex, userData.length);
        listPageControlButtonNext.classList.add('disabled');
    }

    renderUserList(displayCount.startIndex, displayCount.endIndex);
    listPageControlButtonPrev.classList.remove('disabled');
    updateDisplayCountInfo();


    console.log('next');
    console.log(userData.length);
    console.log(displayCount.startIndex);
    console.log(displayCount.endIndex);
    console.log(displayCount.count);

});



createCheckbox('task-manage', taskManageData);
createCheckbox('user-manage', taskManageData);








//userListSearch
const searchButton = document.querySelector('.serach-bar-serch-button');

searchButton.addEventListener('click', async (e) => {




    e.preventDefault();
    displayCount.reset();

    const taskManage1 = document.querySelector('#task-manage-1');
    const taskManage2 = document.querySelector('#task-manage-2');
    const userManage1 = document.querySelector('#user-manage-1');
    const userManage2 = document.querySelector('#user-manage-2');
    const nameSerach = document.querySelector('.serach-bar-search-input');
    
    let taskManage = '';
    let userManage = '';
    let name = '';
    
    if(taskManage1.checked && taskManage2.checked || !taskManage1.checked && !taskManage2.checked){
        taskManage = ''
    }else if(taskManage1.checked){
        taskManage = true;
    }else if(taskManage2.checked){
        taskManage = false;
    }

    if(userManage1.checked && userManage2.checked || !userManage1.checked && !userManage2.checked){
        userManage = '';
    }else if(userManage1.checked){
        userManage = true;
    }else if(userManage2.checked){
        userManage = false;
    }

    if(nameSerach.value.length < 1){
        name = '';
    }else{
        name = nameSerach.value;
    }

    const params = new URLSearchParams();
    params.append('task_manage', taskManage);
    params.append('user_manage', userManage);
    params.append('name', name);

    const response = await fetch(
        `/api/userlist/search?${params.toString()}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        }
    );
    userData = await response.json();
    userData = userData.sort((a, b) => a.user_id - b.user_id);
    console.log(userData);
    if(userData.length < 1){
        userData = await fetchUsers();
        alert('検索結果がありません');
        return;
    }

    if(userData.length < displayCount.count || userData.length === displayCount.count){
        displayCount.endIndex = userData.length;
        listPageControlButtonNext.classList.add('disabled');
    }else{
        displayCount.endIndex = displayCount.startIndex + displayCount.count;
        listPageControlButtonPrev.classList.add('disabled');
        listPageControlButtonNext.classList.remove('disabled');
    }
    updateDisplayCountInfo();
    renderUserList(displayCount.startIndex, displayCount.endIndex);

    console.log('search');
    console.log(userData);
    console.log(displayCount.startIndex);
    console.log(displayCount.endIndex);
    console.log(displayCount.count);

});


const searchInput = document.querySelector('.serach-bar-search-input');
searchInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){
        e.preventDefault();
        searchButton.click();
    }
})



document.addEventListener('DOMContentLoaded', async () => {
    await fetchUser();
    await fetchUsers();
    createDropBox('display-count', '128px', displayCountData);
    setDropBoxValue('display-count', 1, '20件');
    await createProfileCard();
    renderUserList(displayCount.startIndex, displayCount.count);
    updateDisplayCountInfo();


    const dropBoxWrapper = document.querySelector('#display-count');
    const dropBoxOptionWrapper = dropBoxWrapper.querySelector('.drop-box-option-wrapper');
    const dropBoxOptionWrapperItems = dropBoxOptionWrapper.querySelectorAll('.drop-box-option');
    dropBoxOptionWrapperItems.forEach(item => {
        item.addEventListener('click', (e) => {
            let displaycountNum = e.target.textContent;
            displaycountNum = displaycountNum.split('件');
            displayCount.count = Number(displaycountNum[0]);
            displayCount.startIndex = 0;
            displayCount.endIndex = displayCount.startIndex + displayCount.count;
            if(displayCount.endIndex > userData.length || displayCount.endIndex === userData.length){
                displayCount.endIndex = userData.length;
                listPageControlButtonPrev.classList.add('disabled');
                listPageControlButtonNext.classList.add('disabled');
            }else{
                listPageControlButtonPrev.classList.add('disabled');
                listPageControlButtonNext.classList.remove('disabled');
            }
            renderUserList(displayCount.startIndex, displayCount.endIndex);
            updateDisplayCountInfo();

        });
    });


});


const ConditionResetButton = document.querySelector('.serach-bar-condition-clear-button');

ConditionResetButton.addEventListener('click', (e) => {
    e.preventDefault();

    const taskManage1 = document.querySelector('#task-manage-1');
    const taskManage2 = document.querySelector('#task-manage-2');
    const userManage1 = document.querySelector('#user-manage-1');
    const userManage2 = document.querySelector('#user-manage-2');
    const nameSerach = document.querySelector('.serach-bar-search-input');
    
    taskManage1.checked = false;
    taskManage2.checked = false;
    userManage1.checked = false;
    userManage2.checked = false;
    nameSerach.value = '';
    
});

const editResetButton = document.querySelector('.footer-button.edit-reset');

editResetButton.addEventListener('click', (e) => {
    e.preventDefault();
    const result = confirm("編集した内容が削除されます。よろしいですか？");
    if(result){
        alert("編集をリセットしました");
        renderUserList(displayCount.startIndex, displayCount.endIndex);
    }else{
        alert("編集をリセットをキャンセルしました");
    }
    
});

const editSaveButton = document.querySelector('.footer-button.edit-save');

editSaveButton.addEventListener('click', async (e) => {

    e.preventDefault();
    let data = [];

    const errorInput = document.querySelectorAll('.list-item.input.error');
    
    const editedInput = document.querySelectorAll('input.list-item.edited');
    
    editedInput.forEach(input => {
        data.push({
            id: input.dataset.id,
            subject: input.dataset.subject,
            value: input.value,
        });

    });

    if(confirm("保存しますか？")){

        if(data.length < 1){
            alert('保存できません、編集内容がありません');
            return;
        }


        if(errorInput.length > 0){
            alert('保存できません、入力内容を確認してください');
        }else{
            const response = await fetch('/api/userlist', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const responseData = await response.json();
            console.log(responseData);
            if(!responseData.error){
                console.log('save');
                console.log(userData.length);
                console.log(displayCount.startIndex);
                console.log(displayCount.endIndex);
                console.log(displayCount.count);
                alert('保存しました');

                displayCount.reset();
            
                const taskManage1 = document.querySelector('#task-manage-1');
                const taskManage2 = document.querySelector('#task-manage-2');
                const userManage1 = document.querySelector('#user-manage-1');
                const userManage2 = document.querySelector('#user-manage-2');
                const nameSerach = document.querySelector('.serach-bar-search-input');
                
                let taskManage = '';
                let userManage = '';
                let name = '';
                
                if(taskManage1.checked && taskManage2.checked || !taskManage1.checked && !taskManage2.checked){
                    taskManage = ''
                }else if(taskManage1.checked){
                    taskManage = true;
                }else if(taskManage2.checked){
                    taskManage = false;
                }
            
                if(userManage1.checked && userManage2.checked || !userManage1.checked && !userManage2.checked){
                    userManage = '';
                }else if(userManage1.checked){
                    userManage = true;
                }else if(userManage2.checked){
                    userManage = false;
                }
            
                if(nameSerach.value.length < 1){
                    name = '';
                }else{
                    name = nameSerach.value;
                }
            
                const params = new URLSearchParams();
                params.append('task_manage', taskManage);
                params.append('user_manage', userManage);
                params.append('name', name);
            
                const response = await fetch(
                    `/api/userlist/search?${params.toString()}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                userData = await response.json();
                userData = userData.sort((a, b) => a.user_id - b.user_id);
                console.log(userData);
                if(userData.length < 1){
                    userData = await fetchUsers();
                    return;
                }
            
                if(userData.length < displayCount.count || userData.length === displayCount.count){
                    displayCount.endIndex = userData.length;
                    listPageControlButtonNext.classList.add('disabled');
                }else{
                    displayCount.endIndex = displayCount.startIndex + displayCount.count;
                    listPageControlButtonPrev.classList.add('disabled');
                    listPageControlButtonNext.classList.remove('disabled');
                }
                updateDisplayCountInfo();
                renderUserList(displayCount.startIndex, displayCount.endIndex);




                renderUserList(displayCount.startIndex, displayCount.endIndex);
            }else if(responseData.error === "既に同じメールアドレスが存在します"){
                alert(responseData.error);
                renderUserList(displayCount.startIndex, displayCount.endIndex);
            }else if(responseData.error === "Unauthorized"){
                alert('保存できませんでした、ログイン制限時間が終了したので、再度ログインしてください');
                window.location.href = '/login';
            }else{
                alert('保存できませんでした');
                renderUserList(displayCount.startIndex, displayCount.endIndex);
            }
    
    
        }
    }else{
        alert('保存をキャンセルしました');
    }


});



window.addEventListener('pageshow', (e) => {
    if(e.persisted){
        window.location.reload();
    }
});
