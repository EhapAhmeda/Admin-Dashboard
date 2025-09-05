// =================== Get Users Count ===================
$(function () {
  $.getJSON("https://jsonplaceholder.typicode.com/users", function (users) {
    $("#user-count").text(users.length);
  });
});

// =================== Get Posts Count ===================
$(function () {
  $.getJSON("https://jsonplaceholder.typicode.com/posts", function (posts) {
    $("#posts-count").text(posts.length);
  });
});

// =================== Get Comments Count ===================
$(function () {
  $.getJSON("https://jsonplaceholder.typicode.com/comments", function (comments) {
    $("#comments-count").text(comments.length);
  });
});

// =================== Login Validation ===================
const email = document.getElementById("email");
const emailMsg = document.getElementById("emailMsg");
const password = document.getElementById("password");
const bar = document.getElementById("bar");
const form = document.getElementById("myForm");
const togglePass = document.getElementById("togglePass");

email.addEventListener("blur", () => {
  const Regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (Regex.test(email.value)) {
    emailMsg.textContent = "Valid Email";
    emailMsg.classList.add("text-success");
    emailMsg.classList.remove("text-danger");
  } else {
    emailMsg.textContent = "Invalid Email";
    emailMsg.classList.add("text-danger");
    emailMsg.classList.remove("text-success");
  }
});

password.addEventListener("input", () => {
  const val = password.value;
  let strength = 0;
  if (val.match(/[a-z]+/)) strength++;
  if (val.match(/[A-Z]+/)) strength++;
  if (val.match(/[0-9]+/)) strength++;
  if (val.match(/[$#@!&]+/)) strength++;
  bar.style.width = strength * 25 + "%";
  bar.style.background =
    ["red", "orange", "yellow", "green"][strength - 1] || "red";
});

togglePass.addEventListener("click", () => {
  if (password.type === "password") {
    password.type = "text";
    togglePass.innerHTML = '<i class="fa-solid fa-eye"></i>';
  } else {
    password.type = "password";
    togglePass.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
  }
});

// =================== Favorites ===================
let favoritesData = [];

function updateFavoritesCount() {
  $("#Favorites-count").text(favoritesData.length);
  renderFavoritesTable();
}

function renderFavoritesTable() {
  if (favoritesData.length === 0) {
    $("#FavoritesOutput").html("<p>No favorites added yet.</p>");
    return;
  }

  let output = `
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Type</th><th>ID</th><th>Info</th><th>Actions</th>
        </tr>
      </thead>
      <tbody>
  `;
  favoritesData.forEach((item) => {
    output += `
      <tr data-key="${item.key}">
        <td>${item.type}</td>
        <td>${item.id}</td>
        <td>${item.info}</td>
        <td>
          <button class="btn btn-sm btn-danger remove-favorite">🗑 Remove</button>
        </td>
      </tr>
    `;
  });
  output += `</tbody></table>`;
  $("#FavoritesOutput").html(output);
}

// ==================== Load Data (with Edit Modals) ====================
// ---------- Users ----------
$.getJSON("https://jsonplaceholder.typicode.com/users", function (users) {
  let table = `<table id="usersTable" class="table table-striped" style="width:100%">
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>City</th><th>Actions</th></tr></thead><tbody>`;
  users.forEach((u) => {
    table += `<tr>
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.address.city}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-favorite favorite-user" data-key="User-${u.id}">Favorite</button>
        <button class="btn btn-sm btn-warning edit-user"
          data-id="${u.id}" data-name="${u.name}" data-email="${u.email}" data-city="${u.address.city}">Edit</button>
      </td>
    </tr>`;
  });
  table += "</tbody></table>";
  $("#output").html(table);
  $("#usersTable").DataTable();
});

// Open User Modal
$(document).on("click", ".edit-user", function () {
  $("#editUserId").val($(this).data("id"));
  $("#editUserName").val($(this).data("name"));
  $("#editUserEmail").val($(this).data("email"));
  $("#editUserCity").val($(this).data("city"));
  $("#editUserModal").modal("show");
});
// Save User Edit with confirmation
$("#editUserForm").on("submit", function (e) {
  e.preventDefault(); 

  Swal.fire({
    title: "Do you want to save the changes In This User?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
  }).then((result) => {
    if (result.isConfirmed) {
      let id = $("#editUserId").val();
      let table = $("#usersTable").DataTable();
      let row = table.row($(`.edit-user[data-id='${id}']`).parents("tr"));
      let data = row.data();

      data[1] = $("#editUserName").val();
      data[2] = $("#editUserEmail").val();
      data[3] = $("#editUserCity").val();
      row.data(data).draw();

      $("#editUserModal").modal("hide");

      Swal.fire({
        icon: "success",
        title: "Saved!",
        showConfirmButton: false,
        timer: 1000
      });

    } else if (result.isDenied) {
      $("#editUserModal").modal("hide");

      Swal.fire({
        icon: "info",
        title: "Changes are not saved",
        showConfirmButton: false,
        timer: 1000
      });
    }
  });
});


// ---------- Comments ----------
$.getJSON("https://jsonplaceholder.typicode.com/comments", function (comments) {
  let table = `<table id="commentsTable" class="table table-striped" style="width:100%">
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Body</th><th>Actions</th></tr></thead><tbody>`;
  comments.forEach((c) => {
    table += `<tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.body}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary btn-favorite favorite-comment" data-key="Comment-${c.id}">Favorite</button>
        <button class="btn btn-sm btn-warning edit-comment"
          data-id="${c.id}" data-name="${c.name}" data-email="${c.email}" data-body="${c.body}">Edit</button>
      </td>
    </tr>`;
  });
  table += "</tbody></table>";
  $("#commentsOutput").html(table);
  $("#commentsTable").DataTable();
});

// Open Comment Modal
$(document).on("click", ".edit-comment", function () {
  $("#editCommentId").val($(this).data("id"));
  $("#editCommentName").val($(this).data("name"));
  $("#editCommentEmail").val($(this).data("email"));
  $("#editCommentBody").val($(this).data("body"));
  $("#editCommentModal").modal("show");
});
// Save Comment Edit with confirmation
$("#editCommentForm").on("submit", function (e) {
  e.preventDefault(); 

  Swal.fire({
    title: "Do you want to save the changes In This Comment?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
  }).then((result) => {
    if (result.isConfirmed) {
      // ✅ User chose to save
      let id = $("#editCommentId").val();
      let table = $("#commentsTable").DataTable();
      let row = table.row($(`.edit-comment[data-id='${id}']`).parents("tr"));
      let data = row.data();
      data[1] = $("#editCommentName").val();
      data[2] = $("#editCommentEmail").val();
      data[3] = $("#editCommentBody").val();
      row.data(data).draw();

      $("#editCommentModal").modal("hide");

      Swal.fire({
        icon: "success",
        title: "Saved!",
        showConfirmButton: false,
        timer: 1000
      });

    } else if (result.isDenied) {
      $("#editCommentModal").modal("hide");

      Swal.fire({
        icon: "info",
        title: "Changes are not saved",
        showConfirmButton: false,
        timer: 1000
      });
    }
  });
});


// ---------- Posts ----------
$.getJSON("https://jsonplaceholder.typicode.com/posts", function (posts) {
  let table = `<table id="postsTable" class="table table-striped" style="width:100%">
    <thead>
      <tr>
        <th>ID</th>
        <th>User ID</th>
        <th>Title</th>
        <th>Body</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>`;
  
  posts.forEach((p) => {
    table += `<tr>
      <td>${p.id}</td>
      <td>${p.userId}</td>
      <td>${p.title}</td>
      <td>${p.body}</td>
      <td>
        <button class="btn btn-sm btn-outline-primary favorite-post">Favorite</button>
        <button class="btn btn-sm btn-warning edit-post"
          data-userid="${p.userId}" data-id="${p.id}" data-title="${p.title}" data-body="${p.body}">Edit</button>
      </td>
    </tr>`;
  });

  table += `</tbody></table>`;
  $("#postsOutput").html(table);
  $("#postsTable").DataTable();
});

// Open Post Modal
$(document).on("click", ".edit-post", function () {
  $("#editPostUserId").val($(this).data("userid")); // optional if you want to edit userId
  $("#editPostId").val($(this).data("id"));
  $("#editPostTitle").val($(this).data("title"));
  $("#editPostBody").val($(this).data("body"));
  $("#editPostModal").modal("show");
});

// Save Post Edit with confirmation
$("#editPostForm").on("submit", function (e) {
  e.preventDefault(); 

  Swal.fire({
    title: "Do you want to save the changes In This Post?",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Save",
    denyButtonText: `Don't save`
  }).then((result) => {
    if (result.isConfirmed) {
      let id = $("#editPostId").val();
      let table = $("#postsTable").DataTable();
      let row = table.row($(`.edit-post[data-id='${id}']`).parents("tr"));
      let data = row.data();

      data[2] = $("#editPostTitle").val(); 
      data[3] = $("#editPostBody").val(); 
      row.data(data).draw();

      $("#editPostModal").modal("hide");

      Swal.fire({
        icon: "success",
        title: "Saved!",
        showConfirmButton: false,
        timer: 1000
      });

    } else if (result.isDenied) {
      $("#editPostModal").modal("hide");

      Swal.fire({
        icon: "info",
        title: "Changes are not saved",
        showConfirmButton: false,
        timer: 1000
      });
    }
  });
});



// ==================== Favorite Functionality ====================
function toggleFavorite(id, type, info, button) {
  const key = `${type}-${id}`;
  const exists = favoritesData.find((f) => f.key === key);

  if (!exists) {
    favoritesData.push({ key, id, type, info });
    $(button)
      .removeClass("btn-outline-primary")
      .addClass("btn-success btn-added")
      .text("Added")
      .attr("data-key", key);

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Added to Favorites",
      showConfirmButton: false,
      timer: 1000
    });

  } else {
    favoritesData = favoritesData.filter((f) => f.key !== key);
    $(button)
      .removeClass("btn-success btn-added")
      .addClass("btn-outline-primary btn-favorite")
      .text("Favorite")
      .attr("data-key", key);

    Swal.fire({
      position: "top-end",
      icon: "warning",
      title: "Removed from Favorites",
      showConfirmButton: false,
      timer: 1000
    });
  }

  updateFavoritesCount();
}

// ==================== Event Listeners ====================
$(document).on("click", ".favorite-user", function () {
  let row = $(this).closest("tr");
  toggleFavorite(row.find("td:eq(0)").text(), "User", row.find("td:eq(1)").text(), this);
});

$(document).on("click", ".favorite-comment", function () {
  let row = $(this).closest("tr");
  toggleFavorite(row.find("td:eq(0)").text(), "Comment", row.find("td:eq(1)").text(), this);
});

$(document).on("click", ".favorite-post", function () {
  let row = $(this).closest("tr");
  toggleFavorite(row.find("td:eq(0)").text(), "Post", row.find("td:eq(1)").text(), this);
});

// 🗑 Remove from Favorites (if you want separate remove button)
$(document).on("click", ".remove-favorite", function () {
  const row = $(this).closest("tr");
  const key = row.data("key");

  favoritesData = favoritesData.filter((f) => f.key !== key);

  $(`button[data-key='${key}']`)
    .removeClass("btn-success btn-added")
    .addClass("btn-outline-primary btn-favorite")
    .text("Favorite");

  row.remove();

  Swal.fire({
    position: "top-end",
    icon: "warning",
    title: "Removed from Favorites",
    showConfirmButton: false,
    timer: 1000
  });

  updateFavoritesCount();
});


// ==================== Initialize ====================
$(document).ready(function () {
  // 🔐 Login Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const validEmail = "UserName@gmail.com";
    const validPassword = "User@1234";

    if (email.value === validEmail && password.value === validPassword) {
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("dashboardContent").style.display = "block";
    } else {
      alert("Wrong Email or Password");
    }
  });
});

// =================== Theme Toggle ===================
const settingsBtn = document.getElementById("settings-btn");
const settingsOptions = document.querySelector(".settings-options");
const lightMode = document.getElementById("light-mode");
const darkMode = document.getElementById("dark-mode");

settingsBtn.addEventListener("click", e => {
    e.preventDefault();
    settingsOptions.style.display = settingsOptions.style.display === "block" ? "none" : "block";
});

function setLightTheme() {
    document.body.classList.remove("dark-theme-variables");
    lightMode.classList.add("active");
    darkMode.classList.remove("active");
}

function setDarkTheme() {
    document.body.classList.add("dark-theme-variables");
    darkMode.classList.add("active");
    lightMode.classList.remove("active");
}

lightMode.addEventListener("click", setLightTheme);
darkMode.addEventListener("click", setDarkTheme);

// Logout button
const logoutBtn = document.querySelector(".Logout a");
const loginForm = document.getElementById("loginForm");
const dashboardContent = document.getElementById("dashboardContent");

logoutBtn.addEventListener("click", function(e) {
    e.preventDefault();
    dashboardContent.style.display = "none";
    loginForm.style.display = "flex";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
});
