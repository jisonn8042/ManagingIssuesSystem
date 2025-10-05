//Validation
const input = document.querySelectorAll("input");
const form = document.querySelector("form");

const lastNameInput = document.querySelector("#last-name");
const lastNameErrorMessage = document.querySelector("#last-name-error-message");

const firstNameInput = document.querySelector("#first-name");
const firstNameErrorMessage = document.querySelector("#first-name-error-message");

const emailInput = document.querySelector("#email");
const emailErrorMessage = document.querySelector("#email-error-message");

const passwordInput = document.querySelector("#password");
const passwordErrorMessage = document.querySelector("#password-error-message");

const passwordConfirmInput = document.querySelector("#password-confirm");
const passwordConfirmErrorMessage = document.querySelector("#password-confirm-error-message");



function lastNameValidation(){

    if(lastNameInput.value.trim() === ""){
        return "noValue";
    }else if(lastNameInput.value.length > 20){
        return "maxLength";
    }else if(lastNameInput.validity.valid){
        return "valid";
    }

}
function showLastNameErrorMessage(result){

    if(result === "noValue"){
        lastNameErrorMessage.textContent = "姓を入力してください";
    }else if(result === "maxLength"){
        lastNameErrorMessage.textContent = "姓は20文字以内入力してください";
    }

    lastNameErrorMessage.classList.remove("invisible")
    lastNameInput.classList.add("error-input");

}
lastNameInput.addEventListener("input", (e) => {

    let lastNameValidationResult = lastNameValidation();

    if(lastNameValidationResult === "valid"){
        lastNameErrorMessage.textContent = " ";
        lastNameErrorMessage.classList.add("invisible")
        lastNameInput.classList.remove("error-input");
    }else{
        showLastNameErrorMessage(lastNameValidationResult);
    }

});



function firstNameValidation(){

    if(firstNameInput.value.trim() === ""){
        return "noValue";
    }else if(firstNameInput.value.length > 20){
        return "maxLength";
    }else if(firstNameInput.validity.valid){
        return "valid";
    }

}
function showFirstNameErrorMessage(result){
    if(result === "noValue"){
        firstNameErrorMessage.textContent = "名を入力してください";
    }else if(result === "maxLength"){
        firstNameErrorMessage.textContent = "名は20文字以内入力してください";
    }

    firstNameErrorMessage.classList.remove("invisible")
    firstNameInput.classList.add("error-input");

}
firstNameInput.addEventListener("input", (e) => {

    let firstNameValidationResult = firstNameValidation();

    if(firstNameValidationResult === "valid"){
        firstNameErrorMessage.textContent = " ";
        firstNameErrorMessage.classList.add("invisible")
        firstNameInput.classList.remove("error-input");
    }else{
        showFirstNameErrorMessage(firstNameValidationResult);
    }

});



function emailValidation(){
    const hiragana = /[\u3040-\u309F]/;
    const katakana = /[\u30A0-\u30FF]/;
    const halfWidthKatakana = /[\uFF65-\uFF9F]/;
    const fullWidth = /[\uFF01-\uFF60\uFFE0-\uFFE6]/;

    if(emailInput.value.trim() === ""){
        return "noValue";
    }else if(emailInput.value.match(hiragana) || emailInput.value.match(katakana) || emailInput.value.match(halfWidthKatakana) || emailInput.value.match(fullWidth)){
        return "fullWidth";
    }else if(emailInput.validity.typeMismatch){
        return "typeMismatch";
    }else if(emailInput.value.length > 50){
        return "maxLength";
    }else if(emailInput.validity.valid){
        return "valid";
    }

}
function showEmailErrorMessage(result){

    if(result === "noValue"){
        emailErrorMessage.textContent = "メールアドレスを入力してください";
    }else if(result === "fullWidth"){
        emailErrorMessage.textContent = "全角文字や半角カタカナは入力できません";
    }else if(result === "typeMismatch"){
        emailErrorMessage.textContent = "正しいメールアドレスを入力してください";
    }else if(result === "maxLength"){
        emailErrorMessage.textContent = "メールアドレスは50文字以内入力してください";
    }

    emailErrorMessage.classList.remove("invisible")
    emailInput.classList.add("error-input");

}
emailInput.addEventListener("input", () => {
    let emailValidationResult = emailValidation();

    if(emailValidationResult === "valid"){
        emailErrorMessage.textContent = " ";
        emailErrorMessage.classList.add("invisible")
        emailInput.classList.remove("error-input");
    }else{
        showEmailErrorMessage(emailValidationResult);
    }

});



function passwordValidation(){

    const hiragana = /[\u3040-\u309F]/;
    const katakana = /[\u30A0-\u30FF]/;
    const halfWidthKatakana = /[\uFF65-\uFF9F]/;
    const fullWidth = /[\uFF01-\uFF60\uFFE0-\uFFE6]/;

    if(passwordInput.value.trim() === ""){
        return "noValue";
    }else if(passwordInput.value.match(hiragana) || passwordInput.value.match(katakana) || passwordInput.value.match(halfWidthKatakana) || passwordInput.value.match(fullWidth)){
        return "fullWidth";
    }else if(passwordInput.value.length > 60){
        return "maxLength";
    }else if(passwordInput.validity.valid){
        return "valid";
    }

}
function showPasswordErrorMessage(result){
    if(result === "noValue"){
        passwordErrorMessage.textContent = "パスワードを入力してください";
    }else if(result === "fullWidth"){
        passwordErrorMessage.textContent = "全角文字や半角カタカナは入力できません";
    }else if(result === "maxLength"){
        passwordErrorMessage.textContent = "パスワードは60文字以内入力してください";
    }

    passwordErrorMessage.classList.remove("invisible")
    passwordInput.classList.add("error-input");
}
function passwordConfirmValidation(){
    if(passwordConfirmInput.value === passwordInput.value){
        return "valid";
    }else{
        return "noMatch";
    }
}

passwordInput.addEventListener("input", () => {
    let passwordValidationResult = passwordValidation();

    if(passwordValidationResult === "valid"){
        passwordErrorMessage.textContent = " ";
        passwordErrorMessage.classList.add("invisible")
        passwordInput.classList.remove("error-input");
    }else{
        showPasswordErrorMessage(passwordValidationResult);
    }

});
passwordConfirmInput.addEventListener("input", () => {
    let passwordConfirmValidationResult = passwordConfirmValidation();

    if(passwordConfirmValidationResult === "noMatch"){
        passwordConfirmErrorMessage.textContent = "パスワードが一致しません";
        passwordConfirmErrorMessage.classList.remove("invisible")
        passwordConfirmInput.classList.add("error-input");
    }

    if(passwordConfirmValidationResult === "valid"){
        passwordConfirmErrorMessage.textContent = " ";
        passwordConfirmErrorMessage.classList.add("invisible")
        passwordConfirmInput.classList.remove("error-input");
    }

});



//UserRegisterForm
const forms = document.getElementById("signin-form");

forms.addEventListener("submit", async (e) => {

    let lastNameValidationResult = lastNameValidation();
    let firstNameValidationResult = firstNameValidation();
    let emailValidationResult = emailValidation();
    let passwordValidationResult = passwordValidation();
    let passwordConfirmValidationResult = passwordConfirmValidation();

    const isValid = (lastNameValidationResult === "valid" && firstNameValidationResult === "valid" && emailValidationResult === "valid" && passwordValidationResult === "valid" && passwordConfirmValidationResult === "valid");

    if(isValid){
        e.preventDefault();
        
        const response = await fetch(`/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lastName: lastNameInput.value,
                firstName: firstNameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        });

        const result = await response.json();

        if(result.error){
            emailErrorMessage.textContent = "入力したメールアドレスは既に存在します、他のメールアドレスを入力してください";
            emailErrorMessage.classList.remove("invisible")
            emailInput.classList.add("error-input");
            alert(result.error);
        }else{
            alert(result.message);
            window.location.href = `/login`;
        }

    }else{
        e.preventDefault();
        alert("入力内容を確認してください");
        showLastNameErrorMessage();
        showFirstNameErrorMessage();
        showEmailErrorMessage();
        showPasswordErrorMessage();
    }   
    
});

