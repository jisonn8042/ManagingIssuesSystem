
function createDropBox(id, width, data){

    const dropBoxWrapper = document.querySelectorAll("#" + id);
    dropBoxWrapper.forEach(element => {
        element.dataset.status = 'open';
        element.addEventListener('click', () => {
            if(element.dataset.status === 'close'){
                element.dataset.status = 'open';
            }else{
                element.dataset.status = 'close';
            }
        });
    });


    dropBoxWrapper.forEach(e => {

        e.style.width = width;
            
        const dropBox = document.createElement('div');
        dropBox.classList.add('drop-box');
        e.appendChild(dropBox);

        const dropBoxText = document.createElement('input');
        dropBoxText.type = 'text';
        dropBoxText.classList.add('drop-box-text');
        dropBoxText.readOnly = true;
        dropBox.appendChild(dropBoxText);

        const dropBoxIcon = document.createElement('div');
        dropBoxIcon.classList.add('drop-box-icon');
        dropBoxIcon.textContent = '▼';
        dropBox.appendChild(dropBoxIcon);   

        const dropBoxOptionWrapper = document.createElement('div');
        dropBoxOptionWrapper.classList.add('drop-box-option-wrapper', 'drop-box-invisible');
        e.appendChild(dropBoxOptionWrapper);

        dropBoxText.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
        
        //同じコンポネントを作成する関数
        function createOptionItem(name, id){
            const OptionItem = document.createElement('div');
            OptionItem.classList.add('drop-box-option', 'normal');
            OptionItem.textContent = name;
            OptionItem.dataset.id = id;
            return OptionItem;
        }
        
        //作成したコンポネントを追加する関数
        function createOptionItemList(data){
            data.forEach(e => {
                dropBoxOptionWrapper.appendChild(createOptionItem(e.name, e.id));
            });
        }
        
        function createOptionEvent(){
            if(dropBoxOptionWrapper.hasChildNodes()){
                const optionItem = dropBoxOptionWrapper.querySelectorAll('.drop-box-option');
                optionItem.forEach(el => {
                    el.addEventListener('click', (e) => {
                        dropBoxText.value = e.target.textContent;
                        dropBoxText.dataset.id = e.target.dataset.id;
                        dropBoxOptionWrapper.classList.add('drop-box-invisible');
                    });
                });
            }
        };


        createOptionItemList(data);
        createOptionEvent();
        

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


    });



}

function setDropBoxValue(id, defaultId, defaultValue){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        const dropBoxText = e.querySelector('.drop-box-text');
        dropBoxText.value = defaultValue;
        dropBoxText.dataset.id = defaultId;
    });
}

function getDropBoxValue(id, value){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        const dropBoxText = e.querySelector('.drop-box-text');
        value = dropBoxText.value;
    });

}


function setDropBoxPlaceholder(id, placeholder){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        const dropBoxText = e.querySelector('.drop-box-text');
        dropBoxText.placeholder = placeholder;
    });
}

function toggleDropBox(id){
    const dropBox = document.querySelectorAll("#" + id);
    dropBox.forEach(e => {
        e.addEventListener('click', (e) => {
            e.stopPropagation();
            dropBox
            
        });
    });
}

// document.addEventListener('DOMContentLoaded', () => {
//     createDropBox('display-count', '100%', userData);
//     setDropBoxValue('display-count', '山田太郎');
// });



export {createDropBox, setDropBoxValue, setDropBoxPlaceholder};


