
let userData = [];
const token = localStorage.getItem("token");

async function fetchUsers(){
    try {
        const response = await fetch(`/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await response.json();
        userData = data;
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}


async function createProfileCard(){
    await fetchUsers();

    const profileWrapper = document.querySelector('.profile-wrapper');
    
    profileWrapper.textContent = userData.last_name[0];

    function createProfileCard(userData){

        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');
        profileWrapper.appendChild(profileCard);
        
        const profileCardName = document.createElement('div');
        profileCardName.classList.add('profile-card-text');
        if(userData.last_name.length + userData.first_name.length > 10){
            let name = userData.last_name + ' ' + userData.first_name;
            name = name.slice(0, 11);
            name = name + '…';
            profileCardName.textContent = name;
        }else{
            profileCardName.textContent = userData.last_name + ' ' + userData.first_name;
        }
        profileCard.appendChild(profileCardName);

        const profileCardEmail = document.createElement('div');
        profileCardEmail.classList.add('profile-card-text');
        if(userData.email_address.length > 15){
            let email = userData.email_address;
            email = email.slice(0, 15);
            email = email + '…';
            profileCardEmail.textContent = email;
        }else{
            profileCardEmail.textContent = userData.email_address;
        }
        profileCard.appendChild(profileCardEmail); 

        const profileCardButtonWrapper = document.createElement('div');
        profileCardButtonWrapper.classList.add('profile-card-button-wrapper');
        profileCard.appendChild(profileCardButtonWrapper);

        const profileCardUserManage = document.createElement('button');
        profileCardUserManage.classList.add('profile-card-button', 'UserManage');
        profileCardUserManage.textContent = 'ユーザ管理';
        profileCardButtonWrapper.appendChild(profileCardUserManage);

        const profileCardUserLogout = document.createElement('button');
        profileCardUserLogout.classList.add('profile-card-button', 'Logout');
        profileCardUserLogout.textContent = 'ログアウト';
        profileCardButtonWrapper.appendChild(profileCardUserLogout);

        if(!userData.user_manage_right){
            profileCardUserManage.classList.add('profile-card-button-disabled');
        }

        profileCardUserLogout.addEventListener('click', () => {
            localStorage.removeItem("token");
            window.location.href = "/login";
        });

        profileCardUserManage.addEventListener('click', () => {
            window.location.href = "/usermanage";
        });
    }

    profileWrapper.addEventListener('click', (e) => {   

        e.stopPropagation();

        if(profileWrapper.children.length > 0 && !profileWrapper.firstElementChild.contains(e.target)){
            profileWrapper.replaceChildren();
            profileWrapper.textContent = userData.last_name[0];

        }else if(profileWrapper.children.length === 0){
            createProfileCard(userData);
        }
        
    });


    document.addEventListener('click', (e) => {
        if(profileWrapper.children.length > 0 && !profileWrapper.firstElementChild.contains(e.target)){
            profileWrapper.replaceChildren();
            profileWrapper.textContent = userData.last_name[0];
        }

    });




}
    



// document.addEventListener('DOMContentLoaded', () => {
//     createProfileCard(userData);
// });



export {createProfileCard};