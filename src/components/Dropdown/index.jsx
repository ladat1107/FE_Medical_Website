import React, { useState } from 'react';
import { Menu, MenuItem, Button, ListItemIcon } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './dropdown.scss'; // Import SCSS
import { useNavigate } from 'react-router-dom';

function Dropdown({ title, items }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  let navigate = useNavigate();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAction = (action) => {
    navigate(action);
    handleClose();
  }
  return (
    <div className="dropdown">
      <Button
        aria-controls={open ? 'dropdown-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon className={open ? 'Mui-expanded' : ''} />}

      >
        <p className='header-text' > {title}</p>
      </Button>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'dropdown-button',
        }}
      >
        {items?.map((item, index) => (
          <MenuItem key={index} onClick={() => handleAction(item.action)}>
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <p  >{item.title}</p>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default Dropdown;