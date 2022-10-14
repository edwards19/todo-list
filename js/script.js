console.log('hello')
axios
  .get("https://jsonplaceholder.typicode.com/todos")
  .then((res) => console.log(res))
  .catch((err) => console.error(err));