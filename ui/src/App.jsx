import { useState } from 'react';
import Header from './components/Header';
import MenuList from './components/MenuList';
import ShoppingCart from './components/ShoppingCart';
import AdminPage from './components/AdminPage';
import './App.css';

// 임시 메뉴 데이터
const initialMenus = [
  {
    id: 1,
    name: '아메리카노(ICE)',
    price: 4000,
    description: '시원하고 깔끔한 아이스 아메리카노',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 2,
    name: '아메리카노(HOT)',
    price: 4000,
    description: '따뜻하고 진한 핫 아메리카노',
    imageUrl: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 3,
    name: '카페라떼',
    price: 5000,
    description: '부드러운 우유와 에스프레소의 조화',
    imageUrl: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 4,
    name: '카푸치노',
    price: 5000,
    description: '우유 거품이 올라간 부드러운 카푸치노',
    imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 5,
    name: '바닐라라떼',
    price: 5500,
    description: '달콤한 바닐라 시럽이 들어간 라떼',
    imageUrl: 'https://images.unsplash.com/photo-1570968914860-3eccadae0e4a?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  },
  {
    id: 6,
    name: '카라멜마키아토',
    price: 6000,
    description: '카라멜 시럽과 에스프레소의 달콤한 만남',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550c710c120?w=400&h=300&fit=crop',
    options: [
      { id: 1, name: '샷 추가', price: 500 },
      { id: 2, name: '시럽 추가', price: 0 }
    ]
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('order');
  const [menus] = useState(initialMenus);
  const [cartItems, setCartItems] = useState([]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const handleAddToCart = (item) => {
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
        newCart[existingIndex].quantity += 1;
        return newCart;
      } else {
        // 새 항목 추가
        return [...prev, item];
      }
    });
  };

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

  const handleOrder = () => {
    // TODO: 백엔드 API 호출
    console.log('주문 데이터:', cartItems);
    setCartItems([]);
  };

  return (
    <div className="App">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      {currentPage === 'order' && (
        <>
          <MenuList menus={menus} onAddToCart={handleAddToCart} />
          <ShoppingCart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onOrder={handleOrder}
          />
        </>
      )}
      {currentPage === 'admin' && <AdminPage />}
    </div>
  );
}

export default App;
