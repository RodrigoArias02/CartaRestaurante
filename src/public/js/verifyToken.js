document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/token", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 201) {
      console.log("Acceso autorizado");
    } else {
     window.location.href = `/login?error=${data.error}`; // Redirigir al login si no está autorizado
    }
  } catch (error) {
    console.error("Error:", error);
    window.location.href = "/login"; // Redirigir al login en caso de error
  }
});
