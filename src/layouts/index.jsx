import { Fragment } from 'react';
import Navbar from '../components/Navbar';

const Layouts = ({ children }) => {
  return (
    <Fragment>
      <Navbar />
      <main className="main-container">{children}</main>
    </Fragment>
  );
};

export default Layouts;
