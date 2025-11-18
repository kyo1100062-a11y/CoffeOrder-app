import './ShoppingCart.css';

function ShoppingCart({ cartItems, onUpdateQuantity, onRemoveItem, onOrder }) {
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const calculateItemPrice = (item) => {
    const optionPrice = item.selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    return (item.basePrice + optionPrice) * item.quantity;
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  };

  const getOptionNames = (item) => {
    if (item.selectedOptions.length === 0) return '';
    return ' (' + item.selectedOptions.map(opt => opt.name).join(', ') + ')';
  };

  const handleOrder = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    
    if (window.confirm('주문하시겠습니까?')) {
      onOrder();
      alert('주문이 완료되었습니다!');
    }
  };

  return (
    <section className="shopping-cart">
      <div className="cart-container">
        <h2 className="cart-title">장바구니</h2>
        
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <p>장바구니가 비어있습니다.</p>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items-section">
              <div className="cart-items">
                {cartItems.map((item, index) => {
                  const itemPrice = calculateItemPrice(item);
                  return (
                    <div key={index} className="cart-item">
                      <div className="cart-item-info">
                        <span className="cart-item-name">
                          {item.menuName}{getOptionNames(item)} X {item.quantity}
                        </span>
                        <span className="cart-item-price">{formatPrice(itemPrice)}원</span>
                      </div>
                      <div className="cart-item-controls">
                        <button 
                          className="quantity-button"
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button 
                          className="quantity-button"
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button 
                          className="remove-button"
                          onClick={() => onRemoveItem(index)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="cart-summary-section">
              <div className="cart-total">
                <span className="total-label">총 금액</span>
                <span className="total-amount">{formatPrice(calculateTotal())}원</span>
              </div>
              <button className="order-button" onClick={handleOrder}>
                주문하기
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default ShoppingCart;

