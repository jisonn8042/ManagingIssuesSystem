function createUserListDropBox(id, width, data, nameMaxLength=false, emailMaxLength=false){

    const dropBoxWrapper = document.querySelector("#" + id);

    dropBoxWrapper.style.width = width;
            
    const dropBox = document.createElement('div');
    dropBox.classList.add('drop-box');
    dropBoxWrapper.appendChild(dropBox);

    const dropBoxText = document.createElement('input');
    dropBoxText.type = 'text';
    dropBoxText.classList.add('drop-box-text');
    dropBoxText.readOnly = true;
    dropBoxText.value = data[0].name;
    dropBoxText.dataset.id = data[0].id;
    dropBoxText.dataset.name = data[0].name;
    dropBox.appendChild(dropBoxText);

    const dropBoxIcon = document.createElement('div');
    dropBoxIcon.classList.add('drop-box-icon');
    dropBoxIcon.textContent = '▼';
    dropBox.appendChild(dropBoxIcon);   

    const dropBoxOptionWrapper = document.createElement('div');
    dropBoxOptionWrapper.classList.add('drop-box-option-wrapper', 'drop-box-invisible');
    dropBoxWrapper.appendChild(dropBoxOptionWrapper);

    dropBoxText.addEventListener('mousedown', (e) => {
        e.preventDefault();
    });
        
        //同じコンポネントを作成する関数
    function createOptionItem(data){
        const OptionItem = document.createElement('div');
        OptionItem.classList.add('drop-box-option');
        OptionItem.dataset.name = data.name;
        OptionItem.dataset.id = data.id;
        OptionItem.dataset.email = data.email;

        if(nameMaxLength){
            let name = data.name;
            let nameLength = name.replace(/\s/g, '').length;
            if(nameLength > nameMaxLength){
                name = name.split(' ');
                if(name[0].length > nameMaxLength){
                    name[0] = name[0].slice(0, nameMaxLength);
                    name[0] = name[0] + '…';
                    OptionItem.textContent = name[0];
                }else{
                    let fullName = name[0] + ' ' + name[1];
                    fullName = fullName.slice(0, nameMaxLength + 1) + '…';
                    OptionItem.textContent = fullName;
                }
            }else{
                OptionItem.textContent = name;
            }

        }else{
            OptionItem.textContent = data.name;
        }

        const OptionItemEmail = document.createElement('div');
        OptionItemEmail.classList.add('drop-box-option','email');
        OptionItemEmail.dataset.name = data.name;
        OptionItemEmail.dataset.id = data.id;
        OptionItemEmail.dataset.email = data.email;
        if(emailMaxLength){
            if(data.email.length > emailMaxLength){
                let email = data.email;
                email = email.slice(0, emailMaxLength);
                email = email + '…';
                OptionItemEmail.textContent = email;
            }else{
                OptionItemEmail.textContent = data.email;
            }
        }else{
            OptionItemEmail.textContent = data.email;
        }
        OptionItem.appendChild(OptionItemEmail);

        return OptionItem;
    }
        
        //作成したコンポネントを追加する関数
    function createOptionItemList(data){
        data.forEach(e => {
            dropBoxOptionWrapper.appendChild(createOptionItem(e));
        });
    }
        
    function createOptionEvent(){
        if(dropBoxOptionWrapper.hasChildNodes()){
            const optionItem = dropBoxOptionWrapper.querySelectorAll('.drop-box-option');
            optionItem.forEach(e => {
                e.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropBoxText.value = e.target.dataset.name;
                    dropBoxText.dataset.id = e.target.dataset.id;
                    dropBoxText.dataset.name = e.target.dataset.name;
                    dropBoxOptionWrapper.classList.add('drop-box-invisible');
                });
            });
        }
    };

    createOptionItemList(data);
    createOptionEvent();


        
        //ステータスビューをクリックしたら、ステータスオプションを表示する関数
        dropBox.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropBoxes = document.querySelectorAll('.drop-box');
            dropBoxes.forEach(e => {
                e = e.parentElement;
                e.querySelector('.drop-box-option-wrapper').classList.add('drop-box-invisible');
            }); 
            const target = e.target.parentElement;
            const targetParent = target.parentElement;
            targetParent.querySelector('.drop-box-option-wrapper').classList.remove('drop-box-invisible');
        });
        
        
        document.addEventListener('click', (e) => {
            
            if(dropBoxOptionWrapper.hasChildNodes() && !dropBoxOptionWrapper.contains(e.target)){
                dropBoxOptionWrapper.classList.add('drop-box-invisible');
            }
        
        });




}

function setUserListDropBoxValue(id, value){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        const dropBoxText = e.querySelector('.drop-box-text');
        dropBoxText.value = value;
    });

}

function getUserListDropBoxValue(id, value){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        const dropBoxText = e.querySelector('.drop-box-text');
        value = dropBoxText.value;
    });

}


function setUserListDropBoxPlaceholder(id, placeholder){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        const dropBoxText = e.querySelector('.drop-box-text');
        dropBoxText.placeholder = placeholder;
    });
}


// document.addEventListener('DOMContentLoaded', () => {
//     createDropBox('display-count', '100%', userData);
//     setDropBoxValue('display-count', '山田太郎');
// });



export {createUserListDropBox, setUserListDropBoxValue, setUserListDropBoxPlaceholder};


