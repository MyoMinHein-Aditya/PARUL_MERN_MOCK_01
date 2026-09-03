var form = document.getElementById('studentForm');
var nameInput = document.getElementById('name');
var emailInput = document.getElementById('email');
var phoneInput = document.getElementById('phnum');
var dobInput = document.getElementById('dob');
var courseInput = document.getElementById('course');
var aboutInput = document.getElementById('about');
var profileInput = document.getElementById('profilepic');
var submitButton = document.getElementById('submit');
var genderInputs = document.querySelectorAll('input[name="gender"]');
var skillInputs = document.querySelectorAll('input[name="skills"]');
var fields = [nameInput, emailInput, phoneInput, dobInput, aboutInput, profileInput];
var students = [];
var nextId = 1;
var editingId = null;
var cardsContainer = document.querySelector('.cards-container');
var cardTemplate = document.querySelector('.student-card-template');
var aboutCounter = document.createElement('div');
var searchInput = document.createElement('input');
var filterInput = document.createElement('select');
var statistics = document.querySelector('.statistics');
var totalStudents = document.querySelector('.total-students');
var courseStatistics = document.querySelector('.course-statistics');
var courses = ['Web Development', 'UI/UX', 'Python', 'Data Analytics', 'MERN Stack', 'Cloud Computing'];
var cardsSide = document.querySelector('.cards-side');

aboutCounter.textContent = '0 / 200';
aboutCounter.className = 'character-counter';
aboutInput.parentElement.appendChild(aboutCounter);

searchInput.type = 'text';
searchInput.placeholder = 'Search student by name...';
searchInput.className = 'search-input';

filterInput.className = 'course-filter';
var allCoursesOption = document.createElement('option');
allCoursesOption.value = 'All Courses';
allCoursesOption.textContent = 'All Courses';
filterInput.appendChild(allCoursesOption);

courses.forEach(function(course) {
    var option = document.createElement('option');
    option.value = course;
    option.textContent = course;
    filterInput.appendChild(option);
});

cardsSide.insertBefore(searchInput, cardsContainer);
cardsSide.insertBefore(filterInput, cardsContainer);

function showMessage(field, message) {
    var oldMessage = document.querySelector('[data-error="' + field.id + '"]');
    var newMessage = oldMessage;

    if (!newMessage) {
        newMessage = document.createElement('small');
        newMessage.className = 'validation-message';
        newMessage.setAttribute('data-error', field.id);
        field.parentElement.appendChild(newMessage);
    }

    newMessage.textContent = message;
    field.classList.add('invalid');
}

function clearMessage(field) {
    var message = document.querySelector('[data-error="' + field.id + '"]');

    if (message) {
        message.remove();
    }

    field.classList.remove('invalid');
}

function validateName() {
    var name = nameInput.value.trim();
    var nameHasOnlyLettersAndSpaces = true;

    for (var nameIndex = 0; nameIndex < name.length; nameIndex++) {
        var nameCharacter = name[nameIndex];
        var isLetter =
            (nameCharacter >= 'A' && nameCharacter <= 'Z') ||
            (nameCharacter >= 'a' && nameCharacter <= 'z');

        if (!isLetter && nameCharacter !== ' ') {
            nameHasOnlyLettersAndSpaces = false;
            break;
        }
    }

    if (name === '') {
        showMessage(nameInput, 'Student name is required.');
        return false;
    }

    if (name.length < 3 || name.length > 40 || !nameHasOnlyLettersAndSpaces) {
        showMessage(nameInput, 'Use 3 to 40 letters and spaces only.');
        return false;
    }

    clearMessage(nameInput);
    return true;
}

function validateEmail() {
    var email = emailInput.value.trim();
    var atSymbolPosition = email.indexOf('@');
    var dotPosition = email.lastIndexOf('.');

    if (
        email === '' ||
        email.includes(' ') ||
        !email.includes('@') ||
        email.indexOf('@') !== email.lastIndexOf('@') ||
        atSymbolPosition === 0 ||
        dotPosition < atSymbolPosition + 2 ||
        dotPosition === email.length - 1
    ) {
        showMessage(emailInput, 'Enter a valid email address.');
        return false;
    }

    clearMessage(emailInput);
    return true;
}

function validatePhone() {
    var phone = phoneInput.value.trim();
    var phoneHasOnlyDigits = true;

    for (var phoneIndex = 0; phoneIndex < phone.length; phoneIndex++) {
        var phoneCharacter = phone[phoneIndex];

        if (phoneCharacter < '0' || phoneCharacter > '9') {
            phoneHasOnlyDigits = false;
            break;
        }
    }

    if (phone.length !== 10 || !phoneHasOnlyDigits) {
        showMessage(phoneInput, 'Phone number must contain exactly 10 digits.');
        return false;
    }

    clearMessage(phoneInput);
    return true;
}

function validateDob() {
    var selectedDate = new Date(dobInput.value);
    var today = new Date();
    var minimumDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate());

    if (dobInput.value === '' || selectedDate > today) {
        showMessage(dobInput, 'Enter a valid date of birth.');
        return false;
    }

    if (selectedDate > minimumDate) {
        showMessage(dobInput, 'Student must be at least 15 years old.');
        return false;
    }

    clearMessage(dobInput);
    return true;
}

function validateGender() {
    var selectedGender = false;

    genderInputs.forEach(function(input) {
        if (input.checked) {
            selectedGender = true;
        }
    });

    if (!selectedGender) {
        showMessage(genderInputs[genderInputs.length - 1], 'Select a gender.');
        return false;
    }

    clearMessage(genderInputs[genderInputs.length - 1]);
    return true;
}

function validateCourse() {
    if (courseInput.value === 'course1') {
        showMessage(courseInput, 'Select a course.');
        return false;
    }

    clearMessage(courseInput);
    return true;
}

function validateSkills() {
    var selectedSkill = false;

    skillInputs.forEach(function(input) {
        if (input.checked) {
            selectedSkill = true;
        }
    });

    if (!selectedSkill) {
        showMessage(skillInputs[skillInputs.length - 1], 'Select at least one skill.');
        return false;
    }

    clearMessage(skillInputs[skillInputs.length - 1]);
    return true;
}

function validateAbout() {
    var about = aboutInput.value.trim();
    aboutCounter.textContent = aboutInput.value.length + ' / 200';

    if (about.length < 20 || aboutInput.value.length > 200) {
        showMessage(aboutInput, 'About must contain 20 to 200 characters.');
        return false;
    }

    clearMessage(aboutInput);
    return true;
}

function validateProfile() {
    var file = profileInput.files[0];

    if (!file || file.type.indexOf('image/') !== 0) {
        showMessage(profileInput, 'Upload an image file.');
        return false;
    }

    clearMessage(profileInput);
    return true;
}

function getGender() {
    var gender = '';

    genderInputs.forEach(function(input) {
        if (input.checked) {
            gender = input.value;
        }
    });

    return gender;
}

function getSkills() {
    var skills = [];

    skillInputs.forEach(function(input) {
        if (input.checked) {
            skills.push(input.value);
        }
    });

    return skills;
}

function addStudent() {
    var file = profileInput.files[0];
    var student = {
        id: nextId,
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        dob: dobInput.value,
        gender: getGender(),
        course: courseInput.options[courseInput.selectedIndex].text,
        skills: getSkills(),
        about: aboutInput.value.trim(),
        photo: file.name
    };

    students.push(student);
    nextId = nextId + 1;
}

function updateStudent() {
    var file = profileInput.files[0];
    var student;

    students.forEach(function(item) {
        if (item.id === editingId) {
            student = item;
        }
    });

    student.name = nameInput.value.trim();
    student.email = emailInput.value.trim();
    student.phone = phoneInput.value.trim();
    student.dob = dobInput.value;
    student.gender = getGender();
    student.course = courseInput.options[courseInput.selectedIndex].text;
    student.skills = getSkills();
    student.about = aboutInput.value.trim();

    if (file) {
        student.photo = file.name;
    }
}

function createCard(student) {
    var card = cardTemplate.cloneNode(true);

    card.className = 'student-card';
    card.setAttribute('data-id', student.id);
    card.hidden = false;
    card.querySelector('.student-name').textContent = student.name;
    card.querySelector('.student-photo').textContent = 'Photo: ' + student.photo;
    card.querySelector('.student-email').textContent = 'Email: ' + student.email;
    card.querySelector('.student-phone').textContent = 'Phone: ' + student.phone;
    card.querySelector('.student-dob').textContent = 'DOB: ' + student.dob;
    card.querySelector('.student-gender').textContent = 'Gender: ' + student.gender;
    card.querySelector('.student-course').textContent = 'Course: ' + student.course;
    card.querySelector('.student-skills').textContent = student.skills.join(', ');
    card.querySelector('.student-about').textContent = student.about;

    return card;
}

function displayStudents() {
    var searchText = searchInput.value.toLowerCase();
    var selectedCourse = filterInput.value;
    var foundStudent = false;

    cardsContainer.innerHTML = '';

    students.forEach(function(student) {
        var nameMatches = student.name.toLowerCase().indexOf(searchText) !== -1;
        var courseMatches = selectedCourse === 'All Courses' || student.course === selectedCourse;

        if (nameMatches && courseMatches) {
            cardsContainer.appendChild(createCard(student));
            foundStudent = true;
        }
    });

    if (!foundStudent) {
        var noStudents = document.createElement('p');
        noStudents.textContent = 'No students found';
        cardsContainer.appendChild(noStudents);
    }
}

function updateStatistics() {
    totalStudents.textContent = 'Total Students: ' + students.length;
    courseStatistics.innerHTML = '';

    for (var courseIndex = 0; courseIndex < courses.length; courseIndex++) {
        var count = 0;

        for (var studentIndex = 0; studentIndex < students.length; studentIndex++) {
            if (students[studentIndex].course === courses[courseIndex]) {
                count = count + 1;
            }
        }

        courseStatistics.innerHTML = courseStatistics.innerHTML +
            '<p>' + courses[courseIndex] + ': ' + count + '</p>';
    }
}

function resetForm() {
    form.reset();
    editingId = null;
    submitButton.textContent = 'Register Student';
    aboutCounter.textContent = '0 / 200';

    fields.forEach(function(field) {
        clearMessage(field);
    });
    clearMessage(genderInputs[genderInputs.length - 1]);
    clearMessage(skillInputs[skillInputs.length - 1]);
}

fields.forEach(function(field) {
    field.addEventListener('input', function() {
        if (field === nameInput) validateName();
        if (field === emailInput) validateEmail();
        if (field === phoneInput) validatePhone();
        if (field === dobInput) validateDob();
        if (field === aboutInput) validateAbout();
        if (field === profileInput) validateProfile();
    });
});

courseInput.addEventListener('change', validateCourse);
searchInput.addEventListener('input', displayStudents);
filterInput.addEventListener('change', displayStudents);

genderInputs.forEach(function(input) {
    input.addEventListener('change', validateGender);
});

skillInputs.forEach(function(input) {
    input.addEventListener('change', validateSkills);
});

form.addEventListener('submit', function(event) {
    var formIsValid = true;

    event.preventDefault();

    if (!validateName()) formIsValid = false;
    if (!validateEmail()) formIsValid = false;
    if (!validatePhone()) formIsValid = false;
    if (!validateDob()) formIsValid = false;
    if (!validateGender()) formIsValid = false;
    if (!validateCourse()) formIsValid = false;
    if (!validateSkills()) formIsValid = false;
    if (!validateAbout()) formIsValid = false;
    if (!validateProfile()) formIsValid = false;

    if (formIsValid) {
        if (editingId === null) {
            addStudent();
        } else {
            updateStudent();
        }

        displayStudents();
        updateStatistics();
        resetForm();
    }
});

form.addEventListener('reset', function() {
    editingId = null;
    submitButton.textContent = 'Register Student';
    aboutCounter.textContent = '0 / 200';

    fields.forEach(function(field) {
        clearMessage(field);
    });
    clearMessage(genderInputs[genderInputs.length - 1]);
    clearMessage(skillInputs[skillInputs.length - 1]);
});

cardsContainer.addEventListener('click', function(event) {
    var card = event.target.closest('.student-card');
    var studentId;

    if (!card) {
        return;
    }

    studentId = Number(card.getAttribute('data-id'));

    if (event.target.classList.contains('delete-btn')) {
        if (confirm('Are you sure you want to delete this student?')) {
            students.forEach(function(student, index) {
                if (student.id === studentId) {
                    students.splice(index, 1);
                }
            });
            card.remove();
            displayStudents();
            updateStatistics();
        }
    }

    if (event.target.classList.contains('edit-btn')) {
        students.forEach(function(student) {
            if (student.id === studentId) {
                nameInput.value = student.name;
                emailInput.value = student.email;
                phoneInput.value = student.phone;
                dobInput.value = student.dob;
                courseInput.value = courses.indexOf(student.course) + 2;
                aboutInput.value = student.about;
                aboutCounter.textContent = aboutInput.value.length + ' / 200';
                editingId = student.id;
                submitButton.textContent = 'Update Student';

                genderInputs.forEach(function(input) {
                    input.checked = input.value === student.gender;
                });

                skillInputs.forEach(function(input) {
                    input.checked = student.skills.indexOf(input.value) !== -1;
                });
            }
        });
    }
});

displayStudents();
updateStatistics();
