function login() {
  let role = document.getElementById("loginRole").value;

  if (role === "") {
    alert("Please select a role");
    return;
  }

  switch (role) {
    case "admin":
      window.location.href = "admin/dashboard.html";
      break;
    case "staff":
      window.location.href = "staff/dashboard.html";
      break;
    case "donor":
      window.location.href = "donor/dashboard.html";
      break;
    case "patient":
      window.location.href = "patient/dashboard.html";
      break;
    case "hospital":
      window.location.href = "hospital/dashboard.html";
      break;
    case "lab":
      window.location.href = "lab/dashboard.html";
      break;
    case "inventory":
      window.location.href = "inventory/dashboard.html";
      break;
  }
}
