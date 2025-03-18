let arr = Array(24);

for (let index = 0; index < arr.length; index++) {
    arr[index] = true;
    if (Math.random() > 0.5) {
        arr[index] = false;
    }
    //stuff[index] = index;
}

// split into rows and stuff

console.log(arr);
console.log(getMaxLengths(arr));
