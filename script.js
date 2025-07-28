const users = JSON.parse(localStorage.getItem("users")) ||
[
    
    { email : "admin@example.com" , password : "Admin@123" , role : "admin" },
    { email : "user@example.com" , password : "User@123" , role : "user" },
    { email : "besherreda50@gmail.com" , password : "besher@123" , role : "admin" },

]

const courses = JSON.parse(localStorage.getItem("courses")) ||
[
    {
        title : "JavaScript Course",
        instructor : "Besher Reda",
        price : "50$",
        imge : "https://tse1.mm.bing.net/th/id/OIP.vomO8_PP5pb--pm2QoE6IgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3"
    },
    {
        title : "c++ Programming Course",
        instructor : "Mahmmed Reda",
        price : "100$",
        imge : "https://www.pbinfo.ro/resurse/9dc152/articole/cpp/cpp.jpg"
    },
    {
        title : "Python Course",
        instructor : "Ahmed Reda",
        price : "25$",
        imge : "https://www.thetechedvocate.org/wp-content/uploads/2023/05/python.jpeg"
   },
]
// حفظ البيانات ف اللوكال ستوريج
function saveCourses(){
    localStorage.setItem("courses" , JSON.stringify(courses));
}
//عرض الكورسات ف الصفحه الرئيسية للمستخدمين
function renderCourses() {
    const courselist = document.getElementById("courselist");
    if (!courselist) return;
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const isAdmin = user && user.role === "admin";
    courselist.innerHTML = "";
    courses.forEach((course , index) => {
        courselist.innerHTML += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 shadow-sm">
                    <img src="${course.imge}" class="card-img-top" alt="${course.title}">
                    <div class="card-body">
                        <h5 class="card-title">${course.title}</h5>
                        <p class="card-text">${course.instructor}</p>
                        <p class="card-text fw-bold text-primary">${course.price}</p>
                        <a href="#" class="btn btn-primary">View Course</a>
                        ${isAdmin ? `<button class="btn btn-danger m-2 delete-btn" data-index="${index}">Delete</button>` : ''}
                    </div>
                </div>
            </div>
        `;
})
setupDeleteButtons();
};
function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(button => {
      button.addEventListener("click", function () {
          const index = this.getAttribute("data-index");
          if (confirm("Are you sure you want to delete this course?")) {
              courses.splice(index, 1); // حذف الكورس من المصفوفة
              saveCourses();           // تحديث localStorage
              renderCourses();         // إعادة عرض الكورسات
          }
      });
  });
}
// اضافة كورس جديد
function setupAdminForm(){
    const courseForm = document.getElementById("courseForm");
    if(!courseForm) return;
    courseForm.addEventListener('submit', function(e){
        e.preventDefault(); // ده علشان مش عاوز اعادة تحميل للصفحه
        const title = document.getElementById('title').value;
        const instructor = document.getElementById('instructor').value;
        const price = document.getElementById('price').value;
        const imge = document.getElementById('imge').value;

        if(title && instructor && price && imge){
            const newCourse = {title , instructor , price , imge};
            courses.push(newCourse);
            saveCourses();
            alert("Course Added Successfully!");
            courseForm.reset();
        }
        else{
            alert("Please Fill All Fields..");
        }
    })
}
  // عايز اعمل تسجيل ف الموقع
  function setupRegisterForm(){
    const form = document.getElementById("registerForm");
    if(!form) return; 
    form.addEventListener("submit" , function(e){
      e.preventDefault();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value.trim();
      let users = JSON.parse(localStorage.getItem("users")) || [];
      if(users.find(u => u.email === email)){
         alert("Email Alerady Regirsted");
         return;
      }
      const role = email.trim().toLowerCase() === "besherreda50@gmail.com" ? "admin" : "user";
      users.push({email , password , role});
      localStorage.setItem("users" , JSON.stringify(users));
      alert("Account Created , Please Login");
      window.location.href = "login.html";
    })

  }
  // تسجيل الدخول
  function setupLoginForm(){
    const form = document.getElementById("loginForm");
    if(!form) return; 
    form.addEventListener("submit" , function(e){
      e.preventDefault();
      const email = document.getElementById("loginEmail").value.trim();
      const password = document.getElementById("loginPassword").value.trim();
      let users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.email === email && u.password === password);
      if(!user){
        alert("Invalid Creadentails");
        return;
      }
      localStorage.setItem("loggedInUser" ,JSON.stringify(user));
      alert("Logged In Successfully");
      window.location.href = "index.html";
    })

  }
  // تسجيل الخروج من الموقع
  function setupLogoutButton(){
    const btn = document.getElementById("logoutBtn");
    if(!btn) return;
    btn.addEventListener("click" , function(e){
      e.preventDefault();
      localStorage.removeItem("loggedInUser");
      alert("You Are Logged Out");
      window.location.href = "login.html";
    })
  }
  // لو انا ادمن ادخل للداش بورد ولو انا مستخدم عادى ادخل لصفحة الكورسات
  function protectedAdminPage(){
    const isAdminPage = window.location.pathname.includes("admin.html");
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if(isAdminPage && (!user || user.role !== "admin")){
      alert("Access Denied: Admins Only");
      window.location.href = "login.html";
    }
  }
  // صفحة لما الناس تسجل يكون ف رسائل ترحيبية
  function LoggedInUser(){
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const welcome = document.getElementById("welcomeMsg");
    if(user && welcome){
      welcome.textContent = `Welcome , ${user.email} You Are a ${user.role}`;
    }
  }
  document.addEventListener("DOMContentLoaded", () => {
    renderCourses();
    setupAdminForm();
    setupRegisterForm();
    setupLoginForm();
    setupLogoutButton();
    LoggedInUser();
    protectedAdminPage();
})