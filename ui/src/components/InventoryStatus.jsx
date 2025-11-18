import { useState } from 'react';
import './InventoryStatus.css';

function InventoryStatus({ inventory, onUpdateStock }) {
  const [inputValues, setInputValues] = useState({});

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: '품절', className: 'status-out' };
    if (stock < 5) return { text: '주의', className: 'status-warning' };
    return { text: '정상', className: 'status-normal' };
  };

  const formatNumber = (num) => {
    return num.toLocaleString('ko-KR');
  };

  const handleInputChange = (menuId, value) => {
    setInputValues(prev => ({
      ...prev,
      [menuId]: value
    }));
  };

  const handleInputBlur = (menuId, currentStock) => {
    const inputValue = inputValues[menuId];
    if (inputValue === undefined || inputValue === '') {
      // 입력값이 없으면 초기화
      setInputValues(prev => {
        const newValues = { ...prev };
        delete newValues[menuId];
        return newValues;
      });
      return;
    }

    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdateStock(menuId, numValue);
    }

    // 입력값 초기화
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[menuId];
      return newValues;
    });
  };

  const handleInputKeyPress = (e, menuId, currentStock) => {
    if (e.key === 'Enter') {
      handleInputBlur(menuId, currentStock);
      e.target.blur();
    }
  };

  return (
    <div className="inventory-status">
      <h2 className="section-title">재고 현황</h2>
      <div className="inventory-list">
        {inventory && inventory.length > 0 ? (
          inventory.map((item) => {
            const status = getStockStatus(item.stock);
            return (
              <div key={item.menuId} className="inventory-card">
                <div className="inventory-header">
                  <h3 className="inventory-menu-name">{item.menuName}</h3>
                  <span className={`stock-status ${status.className}`}>
                    {status.text}
                  </span>
                </div>
                <div className="inventory-controls">
                  <div className="stock-input-wrapper">
                    {inputValues[item.menuId] !== undefined ? (
                      <input
                        type="number"
                        className="stock-input"
                        value={inputValues[item.menuId]}
                        onChange={(e) => handleInputChange(item.menuId, e.target.value)}
                        onBlur={() => handleInputBlur(item.menuId, item.stock)}
                        onKeyPress={(e) => handleInputKeyPress(e, item.menuId, item.stock)}
                        min="0"
                        autoFocus
                      />
                    ) : (
                      <div 
                        className="stock-count clickable"
                        onClick={() => setInputValues(prev => ({ ...prev, [item.menuId]: item.stock }))}
                      >
                        {formatNumber(item.stock)}개
                      </div>
                    )}
                  </div>
                  <div className="stock-buttons">
                    <button
                      className="stock-button decrease"
                      onClick={() => onUpdateStock(item.menuId, item.stock - 1)}
                      disabled={item.stock <= 0}
                    >
                      -
                    </button>
                    <button
                      className="stock-button increase"
                      onClick={() => onUpdateStock(item.menuId, item.stock + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">재고 정보가 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default InventoryStatus;

