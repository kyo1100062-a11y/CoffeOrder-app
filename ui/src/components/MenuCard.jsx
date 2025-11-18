import { useState, useRef } from 'react';
import './MenuCard.css';

function MenuCard({ menu, onAddToCart, stock = 0 }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const isProcessing = useRef(false);
  const isOutOfStock = stock === 0;

  const handleOptionChange = (optionId) => {
    setSelectedOptions(prev => {
      if (prev.includes(optionId)) {
        return prev.filter(id => id !== optionId);
      } else {
        return [...prev, optionId];
      }
    });
  };

  const handleAddToCartClick = (e) => {
    // 품절이면 담기 불가
    if (isOutOfStock) {
      e.preventDefault();
      return;
    }

    // 중복 클릭 방지
    if (isProcessing.current) {
      e.preventDefault();
      return;
    }

    isProcessing.current = true;
    
    const selectedOptionsData = menu.options.filter(opt => 
      selectedOptions.includes(opt.id)
    );
    
    onAddToCart({
      menuId: menu.id,
      menuName: menu.name,
      basePrice: menu.price,
      selectedOptions: selectedOptionsData,
      quantity: 1
    });

    // 옵션 초기화
    setSelectedOptions([]);

    // 다음 클릭을 위해 잠금 해제 (짧은 딜레이)
    setTimeout(() => {
      isProcessing.current = false;
    }, 100);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className={`menu-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
      <div className="menu-image">
        {menu.imageUrl ? (
          <img src={menu.imageUrl} alt={menu.name} />
        ) : (
          <div className="image-placeholder">
            <span>이미지</span>
          </div>
        )}
        {isOutOfStock && (
          <div className="out-of-stock-overlay">
            <span className="out-of-stock-text">품절</span>
          </div>
        )}
      </div>
      <div className="menu-info">
        <h3 className="menu-name">{menu.name}</h3>
        <p className="menu-price">{formatPrice(menu.price)}원</p>
        <p className="menu-description">{menu.description}</p>
        <div className="menu-options">
          {menu.options.map(option => (
            <label key={option.id} className={`option-checkbox ${isOutOfStock ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
                disabled={isOutOfStock}
              />
              <span>
                {option.name} {option.price > 0 ? `(+${formatPrice(option.price)}원)` : '(+0원)'}
              </span>
            </label>
          ))}
        </div>
        <button 
          className={`add-to-cart-button ${isOutOfStock ? 'disabled' : ''}`}
          onClick={handleAddToCartClick}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? '품절' : '담기'}
        </button>
      </div>
    </div>
  );
}

export default MenuCard;

