console.log('script loaded');

function checkError(response) {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  } else {
    return response.json().then(error => { throw Error(error.message) });
  }
}

function createUser(userData) {
  return fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  }).then(checkError)
}

function getUsers() {
  return fetch('http://localhost:3000/users').then(checkError)
}

function renderUsers(users) {
  const usersDiv = document.querySelector('.users');

  usersDiv.innerHTML = '';

  users.forEach((user) => {
    const htmlContent = `<div class="user">${user.firstName} ${user.lastName}</div>`

    usersDiv.insertAdjacentHTML('beforeend', htmlContent);
  })
}

function ready() {
  const userForm = document.querySelector('.user-form ');
  const errorDiv = document.querySelector('.error');

  function showError(message) {
    errorDiv.innerHTML = message;
    errorDiv.classList.remove('hide')
  }

  function hideError() {
    errorDiv.innerHTML = '';
    errorDiv.classList.add('hide')
  }

  hideError()

  getUsers()
    .then((users) => {
      console.log('users', users)

      renderUsers(users)
    })
    .catch((error) => showError(error.message))

  userForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = event.target;

    const userData = {
      firstName: formData.firstName.value,
      lastName: formData.lastName.value,
    }

    hideError()

    createUser(userData)
      .then((response) => {
        getUsers()
          .then((users) => {
            renderUsers(users)
          })
          .catch((error) => showError(error.message))
      })
      .catch((error) => showError(error.message))
})
}

document.addEventListener('DOMContentLoaded', ready)
