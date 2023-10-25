var showDetails = () => {
    var userinfo = {};
    userinfo.fname = document.querySelector("#fname").value;
    userinfo.lname = document.querySelector("#lname").value;
    userinfo.email = document.querySelector("#email").value;
    userinfo.mobileNo = document.querySelector("#mobileNo").value;
    userinfo.dob = document.querySelector("#dob").value;
    userinfo.gender = document.querySelector("input[name=gender]:checked").value;
    userinfo.country = document.querySelector("#country").value;
    userinfo.profession = document.querySelector("#profession").value;
    userinfo.suggestions = document.querySelector("#suggestions").value;
    alert("First Name: " + userinfo.fname)
    alert("Last Name: " + userinfo.lname)
    alert("E-mail: " + userinfo.email)
    alert("Mobile.No: " + userinfo.mobileNo)
    alert("D.o.B: " + userinfo.dob)
    alert("Gender: " + userinfo.gender)
    alert("Country: " + userinfo.country)
    alert("profession: " + userinfo.profession)
    alert("suggestions: " + userinfo.suggestions)
    
}
var resetDetails = () => {
    document.getElementById("fname").value = "";
    document.getElementById("lname").value = "";
    document.getElementById("email").value = "";
    document.getElementById("mobileNo").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("gen").checked = false;
    document.getElementById("gen1").checked = false;
    document.getElementById("country").value = "";
    document.getElementById("profession").value = "";
    document.getElementById("suggestions").value = "";
}