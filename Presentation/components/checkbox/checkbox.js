let statusData = [
    {
        id: 1,
        name: '未着手',
    },
    {
        id: 2,
        name: '着手',
    },
    {
        id: 3,
        name: '対応中',
    },
    {
        id: 4,
        name: '確認中',
    },
    {
        id: 5,  
        name: '確認済',
    },
    {
        id: 6,
        name: '対応不要',
    },
    {
        id: 7,
        name: '差戻',
    },
    {
        id: 8,
        name: '完了',
    }
];



function createCheckbox(id, data){
    const checkboxWrapper = document.querySelectorAll("#" + id);

    checkboxWrapper.forEach(e => {
        e.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });

        function createCheckBoxItem(data){

            const checkboxItemWrapper = document.createElement('div');
            checkboxItemWrapper.classList.add('checkbox-item-wrapper');
            e.appendChild(checkboxItemWrapper);

            const checkboxIcon = document.createElement('input');
            checkboxIcon.type = 'checkbox';
            checkboxIcon.classList.add('checkbox-icon');
            checkboxIcon.id = id + '-' + data.id;
            checkboxIcon.value = data.id;
            checkboxItemWrapper.appendChild(checkboxIcon);

            const checkboxLabel = document.createElement('label');
            checkboxLabel.classList.add('checkbox-label');
            checkboxLabel.textContent = data.name;
            checkboxLabel.htmlFor = id + '-' + data.id;
            checkboxItemWrapper.appendChild(checkboxLabel);
            
        }

        data.forEach(e => {
            createCheckBoxItem(e);
        });

        
    });
}




// document.addEventListener('DOMContentLoaded', () => {
//     createCheckbox('item', statusData);
// });

export {createCheckbox};