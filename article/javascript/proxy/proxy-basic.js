const obj = {
  testing: 'abc',
};

const p = new Proxy(obj, {
  get(target, name, receiver) {
    console.log(`getting property  ${name}`);
    return Reflect.get(target, name, receiver);
  },
});

console.log(`${obj.testing}`);
console.log(`${p.testing}`);
console.log(`${p.foo}`);
