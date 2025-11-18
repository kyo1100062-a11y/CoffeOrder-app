import MenuCard from './MenuCard';
import './MenuList.css';

function MenuList({ menus, onAddToCart }) {
  return (
    <section className="menu-list">
      <div className="menu-list-container">
        {menus.map(menu => (
          <MenuCard 
            key={menu.id} 
            menu={menu} 
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </section>
  );
}

export default MenuList;

