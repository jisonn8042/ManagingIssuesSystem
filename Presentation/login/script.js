const emailInput = document.querySelector("#email");
const emailErrorMessage = document.querySelector("#email-error-message");

const passwordInput = document.querySelector("#password");
const passwordErrorMessage = document.querySelector("#password-error-message");

const loginButton = document.querySelector("#login-button");



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
        emailErrorMessage.textContent = "メールアドレスは50文字以内で入力してください";
    }
    emailErrorMessage.classList.remove("invisible")
    emailInput.classList.add("error-input");
}
emailInput.addEventListener("input", (e) => {
    let emailValidationResult = emailValidation();

    if(emailValidationResult === "valid"){
        emailErrorMessage.textContent = " ";
        emailErrorMessage.classList.add("invisible")
        emailInput.classList.remove("error-input");
    }else{
        showEmailErrorMessage(emailValidationResult);
    }
    console.log(emailValidationResult);
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
        passwordErrorMessage.textContent = "パスワードは60文字以内で入力してください";
    }

    passwordErrorMessage.classList.remove("invisible")
    passwordInput.classList.add("error-input");
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



loginButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let emailValidationResult = emailValidation();
    let passwordValidationResult = passwordValidation();

    const isValid = (emailValidationResult === "valid" && passwordValidationResult === "valid");

    if(isValid){
        e.preventDefault();
        const response = await fetch(`/userlogin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                email: emailInput.value, 
                password: passwordInput.value
            })
        });

        const result = await response.json();

        if(result.error){
            alert(result.error);
        }else{
            const sessionResponse = await fetch(`/session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({  
                    email: emailInput.value, 
                    password: passwordInput.value
                })
            });
            const sessionResult = await sessionResponse.json();
            if(sessionResult.error){
                alert(`セッション作成に失敗しました`);
            }else{
                localStorage.setItem("token", sessionResult.token);

                alert(result.message);
                window.location.href = "/list";
            }
        }

    }else{
        alert("入力内容を確認してください");
        showEmailErrorMessage(emailValidationResult);
        showPasswordErrorMessage(passwordValidationResult);
    }
});


window.addEventListener("beforeunload", (e) => {
    const navType = performance.getEntriesByType("navigation")[0].type;
    const isRefresh = navType === "reload" || navType === "navigate";
    if(!isRefresh){
        localStorage.removeItem("token");
    }
});

window.addEventListener('pageshow', (e) => {
    if(e.persisted){
        localStorage.removeItem("token");
        window.location.reload();
    }
});
