let pathname = window.location.pathname;

if(pathname === "/usermanage"){
    checkAdminAuth();
    console.log("usermanage");
}else{
    checkAuth();
    console.log("auth");
}


function checkAuth() {

    const token = localStorage.getItem("token");
    const body = document.querySelector('body');
    if(!token){
        body.replaceChildren();
        window.location.href = "/login";
        alert("ログインしてください");
    }else{
        fetch("/api/authcheck", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(res => {
            if(!res.ok){
                body.replaceChildren();
                localStorage.removeItem("token");
                alert("ログインしてください");
                window.location.href = "/login";
            }else{
                body.classList.remove('invisible');
            }
        });
    }
};

async function checkAdminAuth(){

    const token = localStorage.getItem("token");
    const body = document.querySelector('body');
    if(!token){
        body.replaceChildren();
        window.location.href = "/login";
        alert("ログインしてください");
    }else{
        const response = await fetch("/api/authcheck", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        const data = await response.json();
        if(!response.ok){
            body.replaceChildren();
            localStorage.removeItem("token");
            alert("ログインしてください");
            window.location.href = "/login";
        }else if(data.user_manage_right === false){
            body.replaceChildren();
            alert("権限がありません");
            window.location.href = "/list";
        }else{
            body.classList.remove('invisible');
        }
    }   
};