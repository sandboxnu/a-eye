/* eslint-disable */
import React, { useState } from 'react';

/**
 * Renders the feedback page.
 */
const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackComments, setFeedbackMessage] = useState('');

  const isEmailValid = () => {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }

  return (
    <div className="inline-block w-full min-h-full bg-offwhite bg-no-repeat bg-scroll bg-bottom bg-stretchBottom">
        <div>
          <h1 className="mt-24 text-6xl font-sans text-teal-a-eye font-bold italic">
            FEEDBACK
          </h1>
        </div>
        <div className="container">
          <form
            method="POST"
            action="https://getform.io/f/b57ad85d-fb99-44e0-bcb4-83d1febe2565"
          >
            <div className="row">
              <label htmlFor="feedbackname" className="feedback-textbox"></label>
              <p>({name ? '✓' : '✗'}) Name:</p>
              <input
                className="feedback-textbox-input"
                type="text"
                placeholder="Your Name"
                value={name}
                name="Name"
                onChange={e => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div className="row">
              <label htmlFor="feedbackemail" className="feedback-textbox"></label>
              <p>({isEmailValid() ? '✓' : '✗'}) Email:</p>
              <input 
                className="feedback-textbox-input"
                type="email"
                placeholder="Your Email"
                value={email}
                name="Email"
                onChange={e => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="row">
                <label htmlFor="feedbackTitle" className="feedback-textbox"></label>
                <p>({feedbackTitle ? '✓' : '✗'}) Feedback Title:</p>
                <input
                  className="feedback-textbox-input"
                  type="text"
                  placeholder="Feedback Title"
                  value={feedbackTitle}
                  name="Feedback Title"
                  onChange={e => {
                    setFeedbackTitle(e.target.value);
                  }}
                />
            </div>
            <div className="row">
              <label htmlFor="feedbackMessage" className="feedback-textarea"></label>
              <p>({feedbackComments ? '✓' : '✗'}) Feedback Message:</p>
              <textarea
                className="feedback-textarea-input"
                placeholder="Feedback Comments"
                value={feedbackComments}
                name="Feedback Comments"
                onChange={e => {
                  setFeedbackMessage(e.target.value);
                }}
              />
            </div>
            <div className="row">
              <input
                className="feedback-submit"
                type="submit"
                value="Submit"
                disabled={!(name && isEmailValid() && feedbackTitle && feedbackComments)}
              />
            </div>
          </form>
        </div>
      </div>
  )
}

export default FeedbackPage;