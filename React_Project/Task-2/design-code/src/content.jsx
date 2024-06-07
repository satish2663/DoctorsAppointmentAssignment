import './content.css';
import userImage from './assets/image-5.jpg'
import userImg from './assets/image-6.webp'
const Content = () => {
  return (
    <div className="content">
      <div className="search-bar">
        <input type="text" placeholder="Search here..." />
        <button>Filters</button>
      </div>
      <div className="post">
        <div className="post-header">
          <img src={userImg} alt="User"/>
          <div>
            <h2>Parrots</h2>
            <p>@thewallart</p>
          </div>
        </div>
        <p>
          It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. <a href="#">Read More</a>
        </p>
        <img src={userImage} alt="Post" />
        <div className="post-footer">
          <span>9.8k</span>
          <span>8.6k</span>
          <span>7.2k</span>
        </div>
      </div>
    </div>
  );
};

export default Content;
