import React from 'react';

export default function brokenLink() {
  return (
    <div className="container w-screen">
      <div className="flex flex-col justify-center items-center bg-fixed bg-cover w-screen h-screen">
        <p className="text-center">This page does not exist.</p>
        <p className="text-center">
          <a href="/">
            <u>Return to home</u>
          </a>
        </p>
      </div>
    </div>
  );
}
