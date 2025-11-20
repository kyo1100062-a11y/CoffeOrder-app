import './TodayRevenue.css';

function TodayRevenue({ revenue = 0 }) {
  const formatPrice = (price) => {
    return price.toLocaleString('ko-KR');
  };

  return (
    <div className="today-revenue">
      <h2 className="section-title">당일 총 매출액</h2>
      <div className="revenue-card">
        <div className="revenue-amount">{formatPrice(revenue)}원</div>
        <div className="revenue-label">제조 완료된 주문 합계</div>
      </div>
    </div>
  );
}

export default TodayRevenue;

