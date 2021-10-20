const imgURL =
  'https://raw.githubusercontent.com/0shuvo0/internet-speed-test/main/test.gif';
let imgSize = 9934853; //image size in bytes
imgSize *= 8; //converting image size in bytes to bits by multiplying by 8
//How many time the test should run
const TEST_COUNT = 30;

function imageLoadTime(src) {
  return new Promise((resolve, reject) => {
    let image = new Image();

    //appending random number as query string in the url
    image.src = src + '?' + parseInt(Math.random() * 10000);
    let startTime = Date.now();

    image.onload = function () {
      let endTime = Date.now();
      resolve(endTime - startTime);
    };

    image.onerror = function (err) {
      reject(err);
    };
  });
}

async function getDownloadSpeed(src, size) {
  let loadTime = await imageLoadTime(src);
  //Just in case the image was cached, we don't want load time to be 0
  //It would raise division by zero error
  if (loadTime < 1) loadTime = 1;
  let speed_bps = size / loadTime;
  let speed_kbps = speed_bps / 1024;

  return +speed_kbps.toFixed(2);
}

async function run() {
  let test_results = [];

  for (let i = 0; i < TEST_COUNT; i++) {
    let speed = await getDownloadSpeed(imgURL, imgSize);
    test_results.push(speed);
    console.log(`${i + 1}/${TEST_COUNT} speed: ${speed} kb/`);
  }

  //getting the average download speed
  let sum = test_results.reduce((a, b) => a + b, 0);
  let result = sum / test_results.length;

  console.log('All test finished!!!');
  console.log(`Your download speed is ${result.toFixed(2)}kb/s`);
}

run();
