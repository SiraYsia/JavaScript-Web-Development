let errors = [];

const form = document.getElementById('researchForm');
form.addEventListener('submit', function (event) {
  event.preventDefault();

  errors = []; // reset errors array on each form submit
  let alreadyDisplayed = 0

  const phoneInput = document.getElementById("phone");
  const phone = phoneInput.value;
  if (phone.length !== 3 || [...phone].some(c => isNaN(c))) {
    errors.push("Invalid phone number");
    alreadyDisplayed++;
  }

  const phone2Input = document.getElementById("phone2");
  const phone2 = phone2Input.value;
  if (phone2.length !== 3 || [...phone2].some(c => isNaN(c))) {
    if (alreadyDisplayed == 0)
      errors.push("Invalid phone number");
  }

  const phone3Input = document.getElementById("phone3");
  const phone3 = phone3Input.value;
  if (phone3.length !== 4 || [...phone3].some(c => isNaN(c))) {
    if (alreadyDisplayed == 0)
      errors.push("Invalid phone number");
  }
  alreadyDisplayed = 0;

  /***********************************************************************************/
  const timePeriodInputs = document.getElementsByName("period");
  let timePeriodSelected = false;
  for (const timePeriodInput of timePeriodInputs) {
    if (timePeriodInput.checked) {
      timePeriodSelected = true;
      break;
    }
  }
  if (!timePeriodSelected) {
    errors.push("No time period selected");
  }


  /***********************************************************************************/
  let alreadyDisplayed2 = 0;

  const firstId = document.getElementById("first");
  const first_value = firstId.value;

  const secondId = document.getElementById("second");
  const second_value = secondId.value;


  if (first_value[0] !== 'A') {
    errors.push("Invalid Student ID");
    alreadyDisplayed2++;
  }

  /*no need to check the rest if  eror found already */
  if (alreadyDisplayed2 == 0) {
    rest = first_value.slice(1);
    if ([...rest].some(c => isNaN(c))) {
      errors.push("Invalid Student ID");
      alreadyDisplayed2++;
    }
  }

  if (alreadyDisplayed2 == 0) {
    if (second_value[0] !== 'B') {
      errors.push("Invalid Student ID");
      alreadyDisplayed2++;
    }
  }
  if (alreadyDisplayed2 == 0) {
    rest2 = second_value.slice(1);
    if ([...rest2].some(d => isNaN(d))) {
      errors.push("Invalid Student ID");
    }
  }

  /***********************************************************************************/
  const highBloodPressure = document.getElementsByName("highBloodPressure")[0];
  const diabetes = document.getElementsByName("diabetes")[0];
  const glaucoma = document.getElementsByName("glaucoma")[0];
  const asthma = document.getElementsByName("asthma")[0];
  const none = document.getElementsByName("none")[0];

  const conditions = [highBloodPressure, diabetes, glaucoma, asthma, none];

  let atLeastOneSelected = false;
  let noneSelected = false;

  for (let i = 0; i < conditions.length; i++) {
    if (conditions[i].checked) {
      if (conditions[i].name === "none") {
        noneSelected = true;
      } else {
        atLeastOneSelected = true;
      }
    }
  }

  if (!atLeastOneSelected && !noneSelected) {
    errors.push("No conditions selected");
  } else if (atLeastOneSelected && noneSelected) {
    errors.push("Invalid conditions selection");
  }

  /***********************************************************************************/

  if (errors.length > 0) {
    alert(errors.join('\n'));
  } else if (confirm('Do you want to submit the form data?')) {
    form.submit();
  }
});
