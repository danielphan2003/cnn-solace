import React from 'preact';

export const NotFoundPage = ( props ) => {
  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, we cannot find the specified page: {props.rest}</p>
    </div>
  );
};
