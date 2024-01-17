const obj = {
  testing: 'abc',
};

const p = new Proxy(obj, {
  get(target, name, receiver) {
    console.log(`getting property  ${name}`);
    let value = Reflect.get(target, name, receiver);
    if (value && typeof value.toUpperCase === 'function') {
      value = value.toUpperCase();
    }
    return value;
  },
});

console.log(`${obj.testing}`);
console.log(`${p.testing}`);
console.log(`${p.foo}`);
