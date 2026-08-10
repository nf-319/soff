let api = "https://697c787c889a1aecfeb28431.mockapi.io/user/data";
let main = document.querySelector("main");
let newUser = {
  email: "faxriddin@gmail.com",
  name: "Faxriddin Xabibullayev",
  phone: "+998 97 7777777",
  username: "Xabi",
  website: "Xabi.uz",
};

// fetch(api, {
//   method: "POST",
//   headers: {
//     "Content-type": "application/json",
//   },
//   body: JSON.stringify(newUser),
// })
//   .then((response) => response.json())
//   .then((data) => console.log("success"))
//   .catch((err) => console.error(err));

fetch(api)
  .then((data) => data.json())
  .then((result) => render(result));

function render(data) {
  main.innerHTML = "";
  data.map((e) => {
    let card = document.createElement("div");
    card.classList.add("user-card");
    card.innerHTML = `
    
            <div class="card-body">
                <h2>${e.name}</h2>
                <p><strong>Username:</strong> ${e.username}</p>
                <p><strong>Email:</strong> ${e.email}</p>
                <p><strong>Phone:</strong> ${e.phone}</p>
                <p><strong>Website:</strong> <a href="https://${e.website}" target="_blank">${e.website}</a></p>
                <p><strong>Created:</strong> ${e.createdAt}</p>

                <div class="actions">
                    <button onclick=editUser(${e.id}) class="edit">✏️ Edit</button>
                    <button onclick="deleteUser('${e.id}')" class="delete">🗑 Delete</button>
                </div>
            </div>
            `;

    main.appendChild(card);
  });
  console.log(data);
}

function editUser(data) {
  console.log(data);
}

function deleteUser(id) {
  console.log(typeof id, id);
  fetch(`${api}/${Number(id)}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}
