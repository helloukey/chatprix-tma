const arr = [3,5,35,23,2,11,34,3];

const rotate = (arr, times) => {
    if(times === 0) return;
    if(times < 0) {
        for(let i = 0; i >= times; i--) {
            let item = arr.pop();
            arr.unshift(item);
        }
    } else {
        for(let i = 0; i <= times; i++) {
            let item = arr.shift();
            arr.push(item);
        }
    }
};

rotate(arr, -2);
console.log(arr);