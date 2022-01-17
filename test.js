function hello_world(num) {
  if (num % 2 == 0) {
    return "Hello Even World"
  } else {
    return "Hello Odd World"
  }
};

test('tests 2 is even', () => {
  expect(hello_world(2)).toBe("Hello Even World");
});

test('tests 3 is odd', () => {
  expect(hello_world(3)).toBe("Hello Odd World");
});

// const http = require('http');
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/plain'});
//   res.end('Hello Friend :D\n');
// }).listen(1337, '127.0.0.1');
// console.log('Server running at http://127.0.0.1:1337/');