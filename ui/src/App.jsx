import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import MenuList from './components/MenuList';
import ShoppingCart from './components/ShoppingCart';
import AdminPage from './components/AdminPage';
import { getMenus } from './api/menuApi.js';
import { createOrder } from './api/orderApi.js';
import { getStock, getOrders, getDashboard } from './api/adminApi.js';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // 메뉴 데이터 로드
  useEffect(() => {
    const loadMenus = async () => {
      try {
        console.log('메뉴 데이터 로드 시작...');
        const menuData = await getMenus();
        console.log('메뉴 데이터 로드 성공:', menuData);
        setMenus(menuData);
        
        // 재고 정보도 함께 로드
        const stockData = await getStock();
        console.log('재고 데이터 로드 성공:', stockData);
        setInventory(stockData);
      } catch (error) {
        console.error('메뉴 로드 실패:', error);
        alert('메뉴를 불러오는데 실패했습니다. 서버가 실행 중인지 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };
    
    loadMenus();
  }, []);

  // 관리자 페이지로 이동 시 주문 목록 로드
  useEffect(() => {
    if (currentPage === 'admin') {
      const loadAdminData = async () => {
        try {
          const [ordersData, stockData] = await Promise.all([
            getOrders(),
            getStock()
          ]);
          setOrders(ordersData);
          setInventory(stockData);
        } catch (error) {
          console.error('관리자 데이터 로드 실패:', error);
        }
      };
      
      loadAdminData();
    }
  }, [currentPage]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = useCallback((item) => {
    setCartItems(prev => {
      // 동일한 메뉴와 옵션 조합 찾기
      const existingIndex = prev.findIndex(cartItem => {
        if (cartItem.menuId !== item.menuId) return false;
        if (cartItem.selectedOptions.length !== item.selectedOptions.length) return false;
        
        const existingOptionIds = cartItem.selectedOptions.map(opt => opt.id).sort();
        const newOptionIds = item.selectedOptions.map(opt => opt.id).sort();
        
        return JSON.stringify(existingOptionIds) === JSON.stringify(newOptionIds);
      });

      if (existingIndex !== -1) {
        // 기존 항목의 수량 증가
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + 1
        };
        return newCart;
      } else {
        // 새 항목 추가 (수량은 항상 1로 시작)
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const handleUpdateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prev => {
      const newCart = [...prev];
      newCart[index].quantity = newQuantity;
      return newCart;
    });
  };

  const handleRemoveItem = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleOrder = async () => {
    if (cartItems.length === 0) {
      return;
    }

    try {
      // 백엔드 API로 주문 생성
      const newOrder = await createOrder(cartItems);
      
      // 주문 목록에 추가
      setOrders(prev => [newOrder, ...prev]);
      
      // 장바구니 비우기
      setCartItems([]);
      
      // 성공 메시지는 ShoppingCart의 confirm에서만 표시
      return true;
    } catch (error) {
      console.error('주문 생성 실패:', error);
      alert('주문 생성에 실패했습니다: ' + error.message);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="App">
        <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'order' && (
        <>
          <MenuList 
            menus={menus} 
            onAddToCart={handleAddToCart}
            inventory={inventory}
          />
          <ShoppingCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onOrder={handleOrder}
          />
        </>
      )}
      {currentPage === 'admin' && (
        <AdminPage 
          orders={orders}
          onUpdateOrders={setOrders}
          inventory={inventory}
          onUpdateInventory={setInventory}
        />
      )}
    </div>
  );
}

export default App;
