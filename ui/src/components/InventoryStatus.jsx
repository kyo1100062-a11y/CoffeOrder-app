import { useState, useEffect } from 'react';
import './InventoryStatus.css';

function InventoryStatus({ inventory, onUpdateStock }) {
  const [inputValues, setInputValues] = useState({});

  // 재고가 외부에서 변경되면 입력 중인 값도 초기화
  useEffect(() => {
    // 입력 중이 아닌 아이템들은 그대로 유지
    setInputValues(prev => {
      const newValues = {};
      Object.keys(prev).forEach(menuId => {
        // 해당 메뉴가 여전히 입력 중이라면 유지
        const menu = inventory.find(item => item.menuId === Number(menuId));
        if (menu) {
          // 입력 중인 값이 현재 재고와 같지 않으면 유지 (사용자가 직접 변경 중)
          if (prev[menuId] !== menu.stock.toString()) {
            newValues[menuId] = prev[menuId];
          }
        }
      });
      return newValues;
    });
  }, [inventory]);

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

    // 숫자로 변환 (빈 문자열이나 NaN은 0으로 처리)
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdateStock(menuId, numValue);
    } else {
      // 잘못된 값이면 현재 재고로 복원
      setInputValues(prev => {
        const newValues = { ...prev };
        delete newValues[menuId];
        return newValues;
      });
    }

    // 입력값 초기화
    setInputValues(prev => {
      const newValues = { ...prev };
      delete newValues[menuId];
      return newValues;
    });
  };

  const handleInputKeyDown = (e, menuId, currentStock) => {
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
                        onChange={(e) => {
                          const value = e.target.value;
                          // 빈 문자열이거나 숫자만 허용
                          if (value === '' || /^\d+$/.test(value)) {
                            handleInputChange(item.menuId, value);
                          }
                        }}
                        onBlur={() => handleInputBlur(item.menuId, item.stock)}
                        onKeyDown={(e) => handleInputKeyDown(e, item.menuId, item.stock)}
                        min="0"
                        step="1"
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

