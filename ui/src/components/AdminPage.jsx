import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import InventoryStatus from './InventoryStatus';
import OrderStatus from './OrderStatus';
import './AdminPage.css';

function AdminPage({ orders: propsOrders = [], onUpdateOrders, inventory: propsInventory = [], onUpdateInventory }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0
  });

  // props로 받은 주문 데이터와 재고 데이터 사용
  const orders = propsOrders || [];
  const inventory = propsInventory || [];

  // 주문 데이터가 변경되면 통계 업데이트
  useEffect(() => {
    const total = orders.length;
    const received = orders.filter(o => o.status === '주문 접수').length;
    const inProduction = orders.filter(o => o.status === '제조 중').length;
    const completed = orders.filter(o => o.status === '제조 완료').length;

    setStats({
      totalOrders: total,
      receivedOrders: received,
      inProductionOrders: inProduction,
      completedOrders: completed
    });
  }, [orders]);

  const handleUpdateStock = (menuId, newStock) => {
    if (newStock < 0) return;

    if (onUpdateInventory) {
      onUpdateInventory(prev => 
        prev.map(item => 
          item.menuId === menuId 
            ? { ...item, stock: newStock }
            : item
        )
      );
    }

    // TODO: 백엔드 API 호출
    // await fetch(`/api/admin/stock/${menuId}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ stock: newStock })
    // });
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    if (onUpdateOrders) {
      // 주문 상태 업데이트
      onUpdateOrders(prev => {
        const targetOrder = prev.find(order => order.id === orderId);
        
        // 주문 상태가 '제조 완료'로 변경될 때 재고 차감
        if (targetOrder && targetOrder.status !== '제조 완료' && newStatus === '제조 완료') {
          // 재고 차감 처리 (주문 상태 업데이트 전에 먼저 처리)
          if (onUpdateInventory) {
            onUpdateInventory(prevInventory => {
              return prevInventory.map(invItem => {
                // 주문 아이템 중에서 해당 메뉴 찾기
                const orderItem = targetOrder.items.find(item => item.menuId === invItem.menuId);
                if (orderItem) {
                  const newStock = Math.max(0, invItem.stock - orderItem.quantity);
                  return { ...invItem, stock: newStock };
                }
                return invItem;
              });
            });
          }
        }
        
        // 주문 상태 업데이트
        return prev.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus }
            : order
        );
      });
    }

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

