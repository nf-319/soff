let api = "https://dummyjson.com/recipes";
let main = document.querySelector("main");
let recipeForm = document.querySelector("#recipeForm");
let addFilter = document.querySelector("#addFilter");
let post_btn = document.querySelector("#post_btn");

let name_input = document.querySelector("#name");
let ingredients_input = document.querySelector("#ingredients");
let instructions_input = document.querySelector("#instructions");
let prepTimeMinutes_input = document.querySelector("#prepTimeMinutes");
let cookTimeMinutes_input = document.querySelector("#cookTimeMinutes");
let servings_input = document.querySelector("#servings");
let caloriesPerServing_input = document.querySelector("#caloriesPerServing");
let cuisine_input = document.querySelector("#cuisine");
let difficulty_select = document.querySelector("#difficulty");

let filterInput_filter = document.querySelector("#filterInput");
let filterType_filter = document.querySelector("#filterType");
let data = [];
fetch(api)
  .then((response) => response.json())
  .then((result) => {
    render(result.recipes);
    data = result.recipes;
  })
  .catch((err) => console.log(err));

function render(data) {
  // console.log(data);
  main.innerHTML = "";

  data.map((e) => {
    let card = document.createElement("div");
    card.setAttribute(
      "class",
      "w-full max-w-sm overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl",
    );
    card.innerHTML = `
       <div class="relative h-60 overflow-hidden">
                <img src=${e.image} alt=${e.name}
                    class="h-full w-full object-cover transition duration-500 hover:scale-105" />

                <!-- Difficulty -->
             ${
               e.difficulty === "Easy"
                 ? ` <span class="absolute left-4 top-4 rounded-full bg-green-500 px-3 py-1 text-sm font-medium text-white">
                   ${e.difficulty}
                 </span>`
                 : ` <span class="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
                   ${e.difficulty}
                 </span>`
             }

                <!-- Cuisine -->
                <span
                    class="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-sm font-medium text-gray-800 backdrop-blur">
                    ${e.cuisine}
                </span>
            </div>

            <!-- Content -->
            <div class="p-5">

                <!-- Title -->
                <h2 class="mb-2 text-2xl font-bold text-gray-900">
                    ${e.name}
                </h2>

                <!-- Rating -->
                <div class="mb-4 flex items-center gap-2">
                    <div class="text-yellow-400">
                        ★★★★★
                    </div>

                    <span class="font-semibold text-gray-700">
                        ${e.rating}
                    </span>

                    <span class="text-sm text-gray-400">
                        (${e.reviewCount} reviews)
                    </span>
                </div>

                <!-- Info -->
                <div class="mb-5 grid grid-cols-3 gap-2">

                    <div class="rounded-xl bg-gray-50 p-3 text-center">
                        <p class="text-xs text-gray-400">
                            Prep
                        </p>

                        <p class="mt-1 font-semibold text-gray-800">
                            20 min
                        </p>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-3 text-center">
                        <p class="text-xs text-gray-400">
                            Cook
                        </p>

                        <p class="mt-1 font-semibold text-gray-800">
                            15 min
                        </p>
                    </div>

                    <div class="rounded-xl bg-gray-50 p-3 text-center">
                        <p class="text-xs text-gray-400">
                            Servings
                        </p>

                        <p class="mt-1 font-semibold text-gray-800">
                            4
                        </p>
                    </div>

                </div>

                <!-- Ingredients -->
                <div class="mb-5">
                    <h3 class="mb-2 font-semibold text-gray-900">
                        Ingredients
                    </h3>

                    <div class="flex flex-wrap gap-2">
                        <span class="rounded-lg bg-orange-50 px-3 py-1 text-xs text-orange-700">
                            Pizza dough
                        </span>

                        <span class="rounded-lg bg-orange-50 px-3 py-1 text-xs text-orange-700">
                            Tomato sauce
                        </span>

                        <span class="rounded-lg bg-orange-50 px-3 py-1 text-xs text-orange-700">
                            Mozzarella
                        </span>

                        <span class="rounded-lg bg-orange-50 px-3 py-1 text-xs text-orange-700">
                            Fresh basil
                        </span>
                    </div>
                </div>

                <!-- Bottom info -->
                <div class="mb-5 flex items-center justify-between border-t pt-4">

                    <div>
                        <p class="text-xs text-gray-400">
                            Calories
                        </p>

                        <p class="font-semibold text-gray-800">
                            300 kcal
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Meal
                        </p>

                        <p id='mealType' class="font-semibold text-gray-800">
${e.mealType.map((e) => (document.querySelector("#mealType").textContent = e))}
                        </p>
                    </div>

                    <div>
                        <p class="text-xs text-gray-400">
                            Total time
                        </p>

                        <p class="font-semibold text-gray-800">
                            35 min
                        </p>
                    </div>

                </div>

                <!-- Button -->
                <button
                    class="w-full rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600 active:scale-95">
                    View Recipe
                </button>

            </div>
      `;

    main.appendChild(card);
  });
}

function postRecipes() {
  recipeForm.classList.toggle("hidden");
  if (recipeForm.classList.contains("hidden")) {
    main.classList.remove("hidden");
  } else {
    main.classList.add("hidden");
  }

  post_btn.addEventListener("click", (e) => {
    e.preventDefault();

    let data = {
      caloriesPerServing: name_input.value,
      cookTimeMinutes: name_input.value,
      cuisine: name_input.value,
      difficulty: name_input.value,
      id: name_input.value,
      image: name_input.value,
      name: name_input.value,
      prepTimeMinutes: name_input.value,
      rating: name_input.value,
      reviewCount: name_input.value,
      servings: name_input.value,
      userId: name_input.value,
    };

    fetch(`${api}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json)
      .then((result) => {
        console.log(result, "success");
      })
      .catch((err) => console.log(err));
  });
}

filterInput_filter.addEventListener("input", (e) => {
  // console.log(data);
  let fitered_data = data.filter((e) => {
    return e.name
      .toLowerCase()
      .includes(filterInput_filter.value.toLowerCase());

    // console.log(e.name.toLowerCase() == filterInput_filter.value.toLowerCase());
  });
  console.log(fitered_data);
  render(fitered_data);
});
