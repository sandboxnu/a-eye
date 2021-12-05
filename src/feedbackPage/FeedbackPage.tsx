/* eslint-disable */
import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';

/**
 * Renders the feedback page.
 */
const FeedbackPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackComments, setFeedbackComments] = useState('');
  const form = useRef<HTMLFormElement>(null);

  const isEmailValid = () => {
    const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regExp.test(email);
  }

  const sendEmail = (e) => {
    e.preventDefault();

    if (form.current) {
      emailjs.sendForm('aeye-feedback', 'template_66un7oa', form.current, 'user_KV7Tb59u3uQGGQENMz8sE')
        .then((result) => {
            console.log(result.text);
        }, (error) => {
            console.log(error.text);
        });
    }
  };

  const isFormFilled = () => name && isEmailValid() && feedbackTitle && feedbackComments;

  return (
    <div className="inline-block w-full min-h-full bg-offwhite bg-no-repeat bg-scroll bg-bottom bg-stretchBottom">
        <div>
          <h1 className="mt-24 text-6xl font-sans text-teal-a-eye font-bold italic">
            FEEDBACK
          </h1>
        </div>
        <div className="container">
          <form
            ref={form}
            onSubmit={sendEmail}
          >
            <div className="row">
              <label htmlFor="feedbackname" className="feedback-textbox"></label>
              <p>({name ? '✓' : '✗'}) Name:</p>
              <input
                className="feedback-textbox-input"
                type="text"
                placeholder="Your Name"
                value={name}
                name="user_name"
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
                name="user_email"
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
                  name="feedback_title"
                  onChange={e => {
                    setFeedbackTitle(e.target.value);
                  }}
                />
            </div>
            <div className="row">
              <label htmlFor="feedbackComments" className="feedback-textarea"></label>
              <p>({feedbackComments ? '✓' : '✗'}) Feedback Message:</p>
              <textarea
                className="feedback-textarea-input"
                placeholder="Feedback Comments"
                value={feedbackComments}
                name="feedback_comments"
                onChange={e => {
                  setFeedbackComments(e.target.value);
                }}
              />
            </div>
            <div className="row">
              <input
                className="feedback-submit"
                type="submit"
                value="Send"
                disabled={!isFormFilled()}
                onSubmit={() => {
                  setName('');
                  setEmail('');
                  setFeedbackTitle('');
                  setFeedbackComments('');
                }}
              />
            </div>
          </form>
        </div>
      </div>
  )
}

export default FeedbackPage;