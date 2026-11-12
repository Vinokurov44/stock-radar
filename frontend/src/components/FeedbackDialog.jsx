import { useState } from 'react';
import Modal from './Modal.jsx';
import { sendFeedback } from '../api/feedbackApi.js';
import './FeedbackDialog.css';

const FEEDBACK_TYPES = [
  { value: 'idea', label: 'Idea' },
  { value: 'bug', label: 'Bug' },
  { value: 'data', label: 'Data looks wrong' },
  { value: 'other', label: 'Other' },
];

const EMPTY_FORM = { firstName: '', lastName: '', message: '', type: 'idea' };

// Same rule as the backend. The browser check is only for a quick hint,
// the server is the one that really decides.
const NAME_PATTERN = "[a-zA-Zא-תа-яА-ЯёЁ]+([ '\\-][a-zA-Zא-תа-яА-ЯёЁ]+)*";

export default function FeedbackDialog({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorText, setErrorText] = useState('');
  const [invalidFields, setInvalidFields] = useState([]);

  function updateField(name, value) {
    setForm({ ...form, [name]: value });
  }

  function getInputClass(name) {
    return invalidFields.includes(name)
      ? 'feedback__input feedback__input--invalid'
      : 'feedback__input';
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');
    setErrorText('');
    setInvalidFields([]);

    try {
      await sendFeedback(form);
      setStatus('sent');
      setForm(EMPTY_FORM);
    } catch (error) {
      setStatus('error');
      setInvalidFields(error.fields ?? []);

      if (error.status === 429) {
        setErrorText('Too many messages. Please try again in an hour.');
      } else if (error.status === 400) {
        setErrorText('Please check the highlighted fields.');
      } else {
        setErrorText('Something went wrong. Please try again.');
      }
    }
  }

  function handleClose() {
    setStatus('idle');
    setErrorText('');
    setInvalidFields([]);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} title="Help make Stock Radar better" onClose={handleClose}>
      {status === 'sent' ? (
        <div className="feedback">
          <p className="feedback__subtitle">Thanks, got it. I read every message.</p>
          <button type="button" className="feedback__submit" onClick={handleClose}>
            Close
          </button>
        </div>
      ) : (
        <form className="feedback" onSubmit={handleSubmit}>
          <p className="feedback__subtitle">Ideas, bugs, anything. Takes a minute.</p>

          <div className="feedback__types">
            {FEEDBACK_TYPES.map((item) => {
              const isActive = form.type === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  className={isActive ? 'feedback__type feedback__type--active' : 'feedback__type'}
                  aria-pressed={isActive}
                  onClick={() => updateField('type', item.value)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="feedback__row">
            <label className="feedback__field">
              <span className="feedback__label">First name</span>
              <input
                className={getInputClass('firstName')}
                value={form.firstName}
                onChange={(event) => updateField('firstName', event.target.value)}
                placeholder="Roi"
                required
                minLength={2}
                maxLength={50}
                pattern={NAME_PATTERN}
                title="Letters only"
              />
            </label>

            <label className="feedback__field">
              <span className="feedback__label">Last name</span>
              <input
                className={getInputClass('lastName')}
                value={form.lastName}
                onChange={(event) => updateField('lastName', event.target.value)}
                placeholder="Harush"
                required
                minLength={2}
                maxLength={50}
                pattern={NAME_PATTERN}
                title="Letters only"
              />
            </label>
          </div>

          <label className="feedback__field">
            <span className="feedback__label">Message</span>
            <textarea
              className={getInputClass('message')}
              value={form.message}
              onChange={(event) => updateField('message', event.target.value)}
              placeholder="What would you add or change?"
              rows={5}
              required
              minLength={10}
              maxLength={1000}
            />
          </label>

          {errorText && (
            <p className="feedback__error" role="alert">
              {errorText}
            </p>
          )}

          <button type="submit" className="feedback__submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send'}
          </button>
        </form>
      )}
    </Modal>
  );
}
