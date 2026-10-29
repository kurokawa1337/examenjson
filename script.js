const form = document.getElementById('reg-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const ageInput = document.getElementById('age');
const eventSelect = document.getElementById('event');
const rulesCheckbox = document.getElementById('rules');
const registerBtn = document.getElementById('register-btn');
const statusMessage = document.getElementById('status-message');
const welcomeMessage = document.getElementById('welcome-message');

// --- 8. Cookie ---
function checkCookie() {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith('registeredUser=')) {
            const userName = decodeURIComponent(cookie.substring(15));
            welcomeMessage.textContent = `Welcome back, ${userName}!`;
            welcomeMessage.hidden = false;
            break;
        }
    }
}

function setCookie(name, value, days) {
    const maxAge = days * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/`;
}

// --- 6. Promise ---
function sendDataOnServer(userData) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const isSuccess = true;
            if (isSuccess) {
                resolve("Registration successful");
            } else {
                reject("Registration failed");
            }
        }, 2000);
    });
}

// --- 2. Обробка форми & 3. Валідація ---
form.addEventListener('submit', (e) => {
    e.preventDefault();

    document.querySelectorAll('.error').forEach(el => el.textContent = '');
    statusMessage.textContent = '';
    statusMessage.className = 'status';

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const ageValue = ageInput.value.trim();
    const age = Number(ageValue);
    const event = eventSelect.value;
    const isRulesChecked = rulesCheckbox.checked;

    let isValid = true;

    if (!name || name.length < 2) {
        document.getElementById('name-error').textContent = "Ім'я має містити мінімум 2 символи";
        isValid = false;
    }

    if (!email || !email.includes('@')) {
        document.getElementById('email-error').textContent = "Email має бути не порожнім та містити @";
        isValid = false;
    }

    if (!ageValue || isNaN(age) || age < 16 || age > 100) {
        document.getElementById('age-error').textContent = "Вік має бути числом від 16 до 100";
        isValid = false;
    }

    if (!event) {
        document.getElementById('event-error').textContent = "Виберіть тип події";
        isValid = false;
    }

    if (!isRulesChecked) {
        document.getElementById('rules-error').textContent = "Потрібно погодитися з правилами";
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // --- 4. Формування об’єкта & 5. JSON ---
    const userObj = { name, email, age, event };
    const jsonString = JSON.stringify(userObj);
    console.log("JSON рядок:", jsonString);

    const parsedObj = JSON.parse(jsonString);
    console.log("JS-об'єкт після конвертації:", parsedObj);

    // --- 9. Додаткові вимоги & 7. Обробка Promise ---
    registerBtn.disabled = true;
    registerBtn.textContent = 'Loading...';
    statusMessage.textContent = 'Sending data...';
    statusMessage.className = 'status loading';

    sendDataOnServer(parsedObj)
        .then((response) => {
            statusMessage.textContent = response;
            statusMessage.className = 'status success';

            setCookie('registeredUser', userObj.name, 1);
            checkCookie();
            form.reset();
        })
        .catch((error) => {
            statusMessage.textContent = error;
            statusMessage.className = 'status error-status';
        })
        .finally(() => {
            registerBtn.disabled = false;
            registerBtn.textContent = 'Register';
        });
});

checkCookie();
