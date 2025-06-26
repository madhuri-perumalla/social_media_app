import React, { useContext, useEffect, useState } from 'react'
import { TbSearch } from 'react-icons/tb'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Search = () => {
  const {dispatch, socket} = useContext(GeneralContext)
  const [search, setSearch] = useState('');
  const [user, setUser] = useState();
  const [err, setErr] = useState(false);
  const userId = localStorage.getItem('userId');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setErr(false);
    setUser();
    await socket.emit('chat-user-searched', {ownId: userId, username: search});
    setSearch('');
  }

  useEffect(() => {
    socket.on('searched-chat-user', async ({user}) => {
      setUser(user);
    });
    
    socket.on('no-searched-chat-user', async () => {
      setErr(true);
    });
  }, [socket])

  const handleSelect = async (user) => {
    await dispatch({type: "CHANGE_USER", payload: user});
    setUser();
  }

  return (
    <div className='search'>
      <form className="searchform" onSubmit={handleSearch}>
        <input 
          type="text" 
          placeholder='Search users...' 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="s-icon">
          <TbSearch size={20} />
        </button>
      </form>

      {err && (
        <div className="search-error">
          No user found
        </div>
      )}

      {user && (
        <div className="userInfo" onClick={() => handleSelect(user)}>
          <img src={user.profilePic} alt={user.username} />
          <div className="userChatInfo">
            <span>{user.username}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default Search