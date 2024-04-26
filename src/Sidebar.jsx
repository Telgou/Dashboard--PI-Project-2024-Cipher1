import React from 'react';
import { Link } from 'react-router-dom';
import {
  BsCart3,
  BsGrid1X2Fill,
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsListCheck,
  BsMenuButtonWideFill,
  BsFillGearFill,
  BsStar,
} from 'react-icons/bs';
import { CalendarTodayOutlined } from '@mui/icons-material';

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "" : ""}>
      <div className='sidebar-title'>
        <div className='sidebar-brand'>
          <BsCart3 className='icon_header' /> UniSocialize
        </div>
        <span className='icon close_icon' onClick={OpenSidebar}>X</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <Link to="/event" onClick={OpenSidebar}>
            <BsGrid1X2Fill className='icon' /> Events
          </Link>
        </li>
        { <li className='sidebar-list-item'>
          <Link to="/calendar" onClick={OpenSidebar}>
            <CalendarTodayOutlined className='icon' /> Calendar
          </Link>
        </li> }
        <li className='sidebar-list-item'>
          <Link to="/group" onClick={OpenSidebar}>
            <BsFillGrid3X3GapFill className='icon' /> Groups
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/activity" onClick={OpenSidebar}>
            <BsFillArchiveFill className='icon' /> Activities
          </Link>
        </li>
        {/*<li className='sidebar-list-item'>
          <Link to="/products" onClick={OpenSidebar}>
            <BsFillArchiveFill className='icon' /> Posts
          </Link>
        </li> */}
        <li className='sidebar-list-item'>
          <Link to="/best" onClick={OpenSidebar}>
            <BsStar className='icon' /> Users scores
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/elevate" onClick={OpenSidebar}>
            <BsPeopleFill className='icon' /> Manage Privileges
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/verifypreuser" onClick={OpenSidebar}>
            <BsListCheck className='icon' /> Verify Pre-registrations
          </Link>
        </li>
        <li className='sidebar-list-item'>
          <Link to="/settings" onClick={OpenSidebar}>
            <BsFillGearFill className='icon' /> Setting
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
