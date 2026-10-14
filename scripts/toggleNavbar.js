export const toggleNavbar = () => {
    const toggleNavbarButton = document.getElementById("toggleNavbar");
    const navbar = document.querySelector(".navbar")
    toggleNavbarButton.addEventListener("click", () =>{
        navbar.classList.toggle("open");
    })
}