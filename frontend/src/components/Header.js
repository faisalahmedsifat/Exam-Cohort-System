// Core Packages
import React from 'react';

// Components
import Navbar from './Navbar'

const Header = (props) => {
  const halfHeader = props.halfHeader ?? null
  const title = props.title ?? null
  return (
    <Navbar halfHeader={halfHeader} title={title}/>
  );
}

export default Header