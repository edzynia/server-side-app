const toCurrency = (price) => {
  return new Intl.NumberFormat('en-IN', {
    currency: 'SEK',
    style: 'currency',
  }).format(price);
};

document.querySelectorAll('.price').forEach((node) => {
  node.textContent = toCurrency(node.textContent);
});

const $cart = document.querySelector('#cart');
if ($cart) {
  $cart.addEventListener('click', (event) => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id;

      fetch('/cart/remove/' + id, {
        method: 'delete',
      })
        .then((res) => res.json())
        .then((cart) => {
          if (cart.courses.length) {
            const html = cart.courses
              .map((c) => {
                return `
                    <tr>
                        <td>${c.title}</td>
                        <td>${c.count}</td>
                        <td>
                        <button
                            class='btn btn-small purple darken-4 js-remove'
                            data-id='${c.id}'
                        >Delete</button>
                        </td>
                    </tr>
                `;
              })
              .join('');
            $cart.querySelector('tbody').innerHTML = html;
            $cart.querySelector('.price').innerText = toCurrency(cart.price);
          } else {
            $cart.innerHTML = '<p>Your cart is empty</p>';
          }
        });
    }
  });
}
