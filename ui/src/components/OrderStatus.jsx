import './OrderStatus.css';

function OrderStatus({ orders, onUpdateOrderStatus }) {
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '날짜 정보 없음';
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${month}월 ${day}일 ${hours}:${minutes}`;
    } catch (error) {
      return '날짜 정보 없음';
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  const getStatusButton = (order) => {
    if (order.status === '주문 접수') {
      return (
        <button
          className="status-button start-production"
          onClick={() => onUpdateOrderStatus(order.id, '제조 중')}
        >
          제조시작
        </button>
      );
    } else if (order.status === '제조 중') {
      return (
        <button
          className="status-button complete-production"
          onClick={() => onUpdateOrderStatus(order.id, '제조 완료')}
        >
          제조완료
        </button>
      );
    } else {
      return (
        <button className="status-button completed" disabled>
          제조 완료
        </button>
      );
    }
  };

  const formatMenuItems = (items) => {
    return items.map((item, index) => {
      const optionsText = item.options && item.options.length > 0
        ? ` (${item.options.map(opt => opt.optionName).join(', ')})`
        : '';
      return `${item.menuName}${optionsText} x ${item.quantity}`;
    }).join(', ');
  };

  // 주문 목록을 최신순으로 정렬
  const sortedOrders = orders ? [...orders].sort((a, b) => {
    return new Date(b.orderDate) - new Date(a.orderDate);
  }) : [];

  return (
    <div className="order-status">
      <h2 className="section-title">주문 현황</h2>
      <div className="order-list">
        {sortedOrders && sortedOrders.length > 0 ? (
          sortedOrders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-date">{formatDate(order.orderDate)}</div>
                <span className={`order-status-badge status-${order.status.replace(' ', '-')}`}>
                  {order.status}
                </span>
              </div>
              <div className="order-content">
                <div className="order-info">
                  <div className="order-items">{formatMenuItems(order.items || [])}</div>
                  <div className="order-price">{formatPrice(order.totalPrice)}원</div>
                </div>
                <div className="order-actions">
                  {getStatusButton(order)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">주문이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

export default OrderStatus;

