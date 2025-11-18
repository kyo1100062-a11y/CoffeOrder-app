import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import InventoryStatus from './InventoryStatus';
import OrderStatus from './OrderStatus';
import './AdminPage.css';

function AdminPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0
  });

  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  // 임시 초기 데이터
  useEffect(() => {
    // TODO: 백엔드 API 호출로 대체
    // 임시 재고 데이터
    const tempInventory = [
      { menuId: 1, menuName: '아메리카노 (ICE)', stock: 10 },
      { menuId: 2, menuName: '아메리카노 (HOT)', stock: 10 },
      { menuId: 3, menuName: '카페라떼', stock: 10 },
      { menuId: 4, menuName: '카푸치노', stock: 3 },
      { menuId: 5, menuName: '바닐라라떼', stock: 0 },
      { menuId: 6, menuName: '카라멜마키아토', stock: 8 }
    ];

    // 임시 주문 데이터
    const tempOrders = [
      {
        id: 1,
        orderDate: new Date().toISOString(),
        items: [
          {
            menuId: 1,
            menuName: '아메리카노(ICE)',
            quantity: 1,
            options: []
          }
        ],
        totalPrice: 4000,
        status: '주문 접수'
      }
    ];

    setInventory(tempInventory);
    setOrders(tempOrders);

    // 통계 계산
    const total = tempOrders.length;
    const received = tempOrders.filter(o => o.status === '주문 접수').length;
    const inProduction = tempOrders.filter(o => o.status === '제조 중').length;
    const completed = tempOrders.filter(o => o.status === '제조 완료').length;

    setStats({
      totalOrders: total,
      receivedOrders: received,
      inProductionOrders: inProduction,
      completedOrders: completed
    });
  }, []);

  const handleUpdateStock = (menuId, newStock) => {
    if (newStock < 0) return;

    setInventory(prev => 
      prev.map(item => 
        item.menuId === menuId 
          ? { ...item, stock: newStock }
          : item
      )
    );

    // TODO: 백엔드 API 호출
    // await fetch(`/api/admin/stock/${menuId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ stock: newStock })
    // });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => {
      const updatedOrders = prev.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );

      // 통계 업데이트
      const total = updatedOrders.length;
      const received = updatedOrders.filter(o => o.status === '주문 접수').length;
      const inProduction = updatedOrders.filter(o => o.status === '제조 중').length;
      const completed = updatedOrders.filter(o => o.status === '제조 완료').length;

      setStats({
        totalOrders: total,
        receivedOrders: received,
        inProductionOrders: inProduction,
        completedOrders: completed
      });

      return updatedOrders;
    });

    // TODO: 백엔드 API 호출
    // await fetch(`/api/admin/orders/${orderId}/status`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // });
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <AdminDashboard stats={stats} />
        <InventoryStatus 
          inventory={inventory} 
          onUpdateStock={handleUpdateStock}
        />
        <OrderStatus 
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      </div>
    </div>
  );
}

export default AdminPage;

