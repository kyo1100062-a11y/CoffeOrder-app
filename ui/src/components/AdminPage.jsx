import { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import InventoryStatus from './InventoryStatus';
import OrderStatus from './OrderStatus';
import TodayRevenue from './TodayRevenue';
import { getDashboard, updateStock, updateOrderStatus, getStock, getOrders, cancelOrder, getTodayRevenue } from '../api/adminApi.js';
import './AdminPage.css';

function AdminPage({ orders: propsOrders = [], onUpdateOrders, inventory: propsInventory = [], onUpdateInventory }) {
  const [stats, setStats] = useState({
    totalOrders: 0,
    receivedOrders: 0,
    inProductionOrders: 0,
    completedOrders: 0
  });
  const [todayRevenue, setTodayRevenue] = useState(0);

  // props로 받은 주문 데이터와 재고 데이터 사용
  const orders = propsOrders || [];
  const inventory = propsInventory || [];

  // 대시보드 통계 및 매출액 로드
  useEffect(() => {
    const loadStats = async () => {
      try {
        const dashboardStats = await getDashboard();
        setStats(dashboardStats);
      } catch (error) {
        console.error('대시보드 통계 로드 실패:', error);
      }
    };

    const loadRevenue = async () => {
      try {
        const revenue = await getTodayRevenue();
        setTodayRevenue(revenue);
      } catch (error) {
        console.error('당일 매출액 로드 실패:', error);
      }
    };
    
    loadStats();
    loadRevenue();
  }, [orders]);

  const handleUpdateStock = async (menuId, newStock) => {
    if (newStock < 0) return;

    try {
      // 백엔드 API 호출
      const updated = await updateStock(menuId, newStock);
      
      // 로컬 상태 업데이트
      if (onUpdateInventory) {
        onUpdateInventory(prev => 
          prev.map(item => 
            item.menuId === menuId 
              ? { ...item, stock: updated.stock }
              : item
          )
        );
      }
    } catch (error) {
      console.error('재고 업데이트 실패:', error);
      alert('재고 업데이트에 실패했습니다: ' + error.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // 백엔드 API 호출
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      
      // 로컬 상태 업데이트
      if (onUpdateOrders) {
        onUpdateOrders(prev => 
          prev.map(order => 
            order.id === orderId 
              ? { ...order, status: updatedOrder.status }
              : order
          )
        );
      }
      
      // 재고 정보 새로고침 (제조 완료 시 재고가 차감되었을 수 있음)
      if (newStatus === '제조 완료') {
        try {
          const stockData = await getStock();
          if (onUpdateInventory) {
            onUpdateInventory(stockData);
          }
        } catch (error) {
          console.error('재고 정보 새로고침 실패:', error);
        }
      }
      
      // 통계 및 매출액 새로고침
      try {
        const dashboardStats = await getDashboard();
        setStats(dashboardStats);
        const revenue = await getTodayRevenue();
        setTodayRevenue(revenue);
      } catch (error) {
        console.error('통계 새로고침 실패:', error);
      }
    } catch (error) {
      console.error('주문 상태 업데이트 실패:', error);
      alert('주문 상태 업데이트에 실패했습니다: ' + error.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      // 백엔드 API 호출
      await cancelOrder(orderId);
      
      // 로컬 상태에서 주문 제거
      if (onUpdateOrders) {
        onUpdateOrders(prev => prev.filter(order => order.id !== orderId));
      }
      
      // 통계 및 매출액 새로고침
      try {
        const dashboardStats = await getDashboard();
        setStats(dashboardStats);
        const revenue = await getTodayRevenue();
        setTodayRevenue(revenue);
      } catch (error) {
        console.error('통계 새로고침 실패:', error);
      }
    } catch (error) {
      console.error('주문 취소 실패:', error);
      alert('주문 취소에 실패했습니다: ' + error.message);
    }
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
          onCancelOrder={handleCancelOrder}
        />
        <TodayRevenue revenue={todayRevenue} />
      </div>
    </div>
  );
}

export default AdminPage;

