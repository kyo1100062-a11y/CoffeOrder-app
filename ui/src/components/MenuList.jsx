import MenuCard from './MenuCard';
import './MenuList.css';

function MenuList({ menus, onAddToCart, inventory = [] }) {
  if (!menus || menus.length === 0) {
    return (
      <section className="menu-list">
        <div className="menu-list-container">
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            메뉴를 불러오는 중...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="menu-list">
      <div className="menu-list-container">
        {menus.map(menu => {
          // 재고 정보 찾기
          const inventoryItem = inventory.find(inv => inv.menuId === menu.id);
          const stock = inventoryItem ? inventoryItem.stock : 0;
          
          return (
            <MenuCard 
              key={menu.id} 
              menu={menu} 
              onAddToCart={onAddToCart}
              stock={stock}
            />
          );
        })}
      </div>
    </section>
  );
}

export default MenuList;

