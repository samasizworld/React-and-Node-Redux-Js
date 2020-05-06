import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Dev Site</h1>
          <p className="lead">
            You are welcome to this site.Create a developer profile/portfolio, share posts and get help from
            other developers.
          </p>
          <div className="buttons">
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-light">Sign in</Link>
          </div>
        </div>
      </div>
    </section>
    );
}
export default Landing;