const input = document.querySelector('.input');
const button = document.querySelector('.button');
const department = document.querySelector('.department');
const resultBox = document.querySelector('.result-box');
const loader = document.querySelector('.spinner');
let results = [];
let link = '';

input.addEventListener('keyup', () => {
  if (input.value === '') {
    button.classList.add('clicked');
  } else if (input.value.length < 10 || input.value.length > 10) {
    button.classList.add('clicked');
  } else {
    button.classList.remove('clicked');
  }
});

button.addEventListener('click', () => {
  const studentId = input.value;

  resultBox.classList.add('active');
  loader.classList.remove('loaded');
  button.classList.add('clicked');
  input.toggleAttribute('disabled');

  switch (department.value) {
    case 'it':
      link = 'http://localhost/online-result/assets/js/result.json';
      break;
    case 'is':
      link = 'http://localhost/online-result/assets/js/result.json';
      break;
    case 'cs':
      link = 'http://localhost/online-result/assets/js/result.json';
      break;
    default:
      link = '';
      break;
  }

  loadResult();

  const interval = setInterval(() => {
    if (results.length > 0) {
      const filteredResult = results.filter((item) => {
        return item.id === studentId;
      });
      if (filteredResult.length > 0) {
        displayResult(...filteredResult);
      } else {
        resultBox.innerHTML = '<p class="error-msg">حدث خطأ, الرجاء التأكد من صحة البيانات المدخلة والمحاولة مرة اخرى</p>';
      }
    }
  }, 1500);

  resultBox.addEventListener('DOMSubtreeModified', () => {
    clearInterval(interval);
    setTimeout(() => {
      loader.classList.add('loaded');
      resultBox.classList.remove('active');
      button.classList.remove('clicked');
      input.removeAttribute('disabled');
    }, 3000);
  });
});

const loadResult = async () => {
  try {
    const res = await fetch(link);
    results = await res.json();
  } catch (error) {
    resultBox.innerHTML = '<p class="error-msg">حدث خطأ في الشبكة, الرجاء المحاولة مرة اخرى</p>';
    console.error(error);
  }
};

const displayResult = function (item) {
  let element = ``;
  const getData = (item) => {
    for (const key in item) {
      element += `
      <div class="row">
        <span>${key}</span>
        <span>${item[key]}</span>
      </div>`;
    }
    return element;
  };

  let resultBody = `
  <div class="result">
    <h3>تفاصيل النتيجة :</h3>
    <div class="box">
      <span class="icon user"><img src="assets/images/user.svg" alt="user"></span>
      <p class="value">${item.name}</p>
    </div>
    <div class="wrapper">
      <div class="box">
        <span class="icon hashtag"><img src="assets/images/hashtag.svg" alt="hashtag"></span>
        <p class="value">${item.department}</p>
      </div>
      <div class="box">
        <span class="icon minus"><img src="assets/images/minus.svg" alt="minus"></span>
        <p class="value">${item.division}</p>
      </div>
    </div>
  </div>
  <div class="result-body">
    <div class="row">
      <span>المادة</span>
      <span>الدرجة</span>
    </div>
    ${getData(item.scores)}
  </div>`;
  resultBox.innerHTML = resultBody;
};