let copyBtn = document.getElementById("copyBtn");
let copyMsg = document.getElementById("copyMsg");
let passwordLen = document.getElementById("passwordLen");
let slider = document.getElementById("slider");
let uppercase = document.getElementById("uppercase");
let lowercase = document.getElementById("lowercase");
let numbers = document.getElementById("numbers");
let symbols = document.getElementById("symbols");
let strength_indicator = document.getElementById("strength-indicator");
let generateButton = document.getElementById("generateButton");
let allCheckBox = document.querySelectorAll("input[type=checkbox");
let passwordDisplay = document.getElementById("passwordDisplay");
let Symbols = `!"#$%&'()*+,-./:;<=>?@[\\]^_\`{|}~`;

let password = "";
let length = 10;
let checkCount = 0;

function handleSlider() {
    slider.value = length;
    passwordLen.innerHTML = length; 
}
handleSlider();

function setIndicator(color) { 
    strength_indicator.style.background = color;
}

function getRndInteger (min, max) {
    return Math.floor(Math.random() * (max-min)) + min ;  //math.random() gives value between 0 and 1
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, Symbols.length);
    return Symbols.charAt(randNum);
}

//whole purpose of this function is to calculate checkbox count
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    // special condition
    if(length < checkCount) {
        length = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener("change", handleCheckBoxChange);
})

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasSymbol = false;
    let hasNumber = false;
    if(uppercase.checked) hasUpper = true;
    if(lowercase.checked) hasLower = true;
    if(symbols.checked) hasSymbol = true;
    if(numbers.checked) hasNumber = true;

    if(hasUpper && hasLower && (hasSymbol || hasNumber) && length >= 8) {
        setIndicator("#0f0");
    } else if( (hasLower || hasUpper) && (hasNumber || hasSymbol) && length >= 6){
        setIndicator("#ff0")
    } else{
        setIndicator("#f00")
    }
}

//shuffling function
function shufflePassword(array){
    // Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    } catch (e) {
        copyMsg.innerText = "failed";
    }

    //make copy span visible
    copyMsg.classList.remove("hidden");

    //as copied msg removed in some sec
    setTimeout( () => {
        copyMsg.classList.add("hidden");
    }, 1000);
}

slider.addEventListener("input", (e) => {
    length = e.target.value;
    handleSlider();
})

copyBtn.addEventListener("click", () => {
    if(passwordDisplay.value)
        copyContent();
})

generateButton.addEventListener("click", () => {

    if(checkCount == 0) return ;

    if(length < checkCount){
        length = checkCount;
        handleSlider();
    };

    // remove old password

    password = "";

    let funcArr = [];

    if(uppercase.checked)
        funcArr.push(generateUppercase);
    if(lowercase.checked)
        funcArr.push(generateLowercase);
    if(numbers.checked)
        funcArr.push(generateRandomNumber);
    if(symbols.checked)
        funcArr.push(generateSymbol);


    // compulsory addition
    for(let i = 0; i < funcArr.length; i++){
        password += funcArr[i]();
    }

    // remaining addition
    for(let i = 0; i < length - funcArr.length; i++){
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    // shuffle the password
    password = shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
    
})












