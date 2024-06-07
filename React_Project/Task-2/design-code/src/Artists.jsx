import './Artists.css';
import images from './assets/image-2.png';
import image from './assets/image-3.jpeg';
import img from './assets/image-4.jpeg';

const artists = [
  { name: 'Micky', username: '@thewildwithyou', image: images  },
  { name: 'Tom and Jerry', username: '@thewildwithyou', image: image },
  { name: 'Eagle', username: '@thewildwithyou', image: img },
];

const ArtistsList = () => {
  return (
    <div className="artists-list">
      <button className="become-seller">Become a Seller</button>
      <div className="tabs">
        <button>Artists</button>
        <button>Photographers</button>
      </div>
      <div className="artists">
        {artists.map((artist, index) => (
          <div key={index} className="artist">
            <img src={artist.image} alt={artist.name} />
            <div>
              <h3>{artist.name}</h3>
              <p>{artist.username}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistsList;
