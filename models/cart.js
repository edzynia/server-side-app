const path = require('path');
const fs = require('fs');

const cartPath = path.join(__dirname, '..', 'data', 'cart.json');

class Cart {
  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(cartPath, 'utf-8', (err, context) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(context));
        }
      });
    });
  }

  static async remove(id) {
    const cart = await Cart.fetch();

    const ind = cart.courses.findIndex((c) => c.id === id);
    const course = cart.courses[ind];

    if (course.count === 1) {
      cart.courses = cart.courses.filter((c) => c.id !== id);
    } else {
      cart.courses[ind].count--;
    }

    cart.price -= parseInt(course.price, 10);

    return new Promise((resolve, reject) => {
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(cart);
        }
      });
    });
  }

  static async add(course) {
    const cart = await Cart.fetch();
    const ind = cart.courses.findIndex((c) => c.id === course.id);
    const candidate = cart.courses[ind];

    if (candidate) {
      candidate.count++;
      cart.courses[ind] = candidate;
    } else {
      course.count = 1;
      cart.courses.push(course);
    }

    cart.price += parseInt(course.price, 10);

    return new Promise((resolve, reject) => {
      fs.writeFile(cartPath, JSON.stringify(cart), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

module.exports = Cart;
