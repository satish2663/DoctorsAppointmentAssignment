import './sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">LOGO</div>
      <nav>
        <ul>
          <li>Home</li>
          <li>Notifications</li>
          <li>Shop</li>
          <li>Conversation</li>
          <li>Wallet</li>
          <li>Subscription</li>
          <li>My Profile</li>
          <li>Settings</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
