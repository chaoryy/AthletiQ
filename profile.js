function toggleDropdown(contentId, iconId) {
    const content = document.getElementById(contentId);
    const icon = document.getElementById(iconId);
  
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
        content.style.padding = "0 10px";
        icon.classList.remove("open");
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.padding = "10px 10px";
        icon.classList.add("open");
    }
}

const modal = document.getElementById("recipeModal");

function openRecipe(title, image, description, macros, ingredients, instructions) {
    const modal = document.getElementById("recipeModal"); 
    modal.style.display = "flex"; 
    modal.classList.add("active"); 

    document.getElementById("modalTitle").innerText = title;
    document.getElementById("modalImage").src = image;
    document.getElementById("modalDescription").innerText = description;
    document.getElementById("modalCalories").innerText = macros;

    const ingredientsList = document.getElementById("modalIngredients");
    ingredientsList.innerHTML = ""; 
    ingredients.split(", ").forEach(ingredient => {
        const li = document.createElement("li");
        li.innerText = ingredient;
        ingredientsList.appendChild(li);
    });

    document.getElementById("modalInstructions").innerText = instructions;
}

function closeModal() {
    const modal = document.getElementById("recipeModal");
    modal.style.display = "none"; 
    modal.classList.remove("active");
}

document.querySelector(".close").addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
    const modal = document.getElementById("recipeModal");
    if (event.target === modal) {
        closeModal();
    }
});

