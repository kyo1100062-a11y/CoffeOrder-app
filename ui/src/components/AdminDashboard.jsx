import './AdminDashboard.css';

function AdminDashboard({ stats }) {
  const {
    totalOrders = 0,
    receivedOrders = 0,
    inProductionOrders = 0,
    completedOrders = 0
  } = stats || {};

  return (
    <div className="admin-dashboard">
      <h2 className="section-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-label">총 주문</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{receivedOrders}</div>
          <div className="stat-label">주문 접수</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{inProductionOrders}</div>
          <div className="stat-label">제조 중</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completedOrders}</div>
          <div className="stat-label">제조 완료</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

