const opening = document.querySelector('#opening');
const openInvitation = document.querySelector('#openInvitation');

function revealInvitation() {
  opening.classList.add('is-open');
  document.body.classList.remove('is-locked');
  window.setTimeout(() => opening.setAttribute('aria-hidden', 'true'), 900);
}

openInvitation.addEventListener('click', revealInvitation);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const weddingDate = new Date('2027-08-21T15:30:00+03:00');
const countdownNodes = {
  days: document.querySelector('#days'),
  hours: document.querySelector('#hours'),
  minutes: document.querySelector('#minutes'),
  seconds: document.querySelector('#seconds')
};

function updateCountdown() {
  const remaining = Math.max(0, weddingDate.getTime() - Date.now());
  const day = 86400000;
  const hour = 3600000;
  const minute = 60000;
  countdownNodes.days.textContent = String(Math.floor(remaining / day)).padStart(3, '0');
  countdownNodes.hours.textContent = String(Math.floor((remaining % day) / hour)).padStart(2, '0');
  countdownNodes.minutes.textContent = String(Math.floor((remaining % hour) / minute)).padStart(2, '0');
  countdownNodes.seconds.textContent = String(Math.floor((remaining % minute) / 1000)).padStart(2, '0');
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

document.querySelector('#calendarButton').addEventListener('click', () => {
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Webgency Invitations//RU',
    'BEGIN:VEVENT',
    'UID:roman-polina-20270821@webgency',
    'DTSTAMP:20260818T220000Z',
    'DTSTART:20270821T123000Z',
    'DTEND:20270821T200000Z',
    'SUMMARY:Свадьба Романа и Полины',
    'LOCATION:Усадьба Архангельское, Московская область',
    'DESCRIPTION:Будем счастливы разделить этот день с вами!',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'roman-polina-wedding.ics';
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelector('#rsvpForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = new FormData(form).get('name').trim();
  const status = document.querySelector('#formStatus');
  status.textContent = `${name}, спасибо! Ваш ответ сохранён.`;
  form.querySelector('button').textContent = 'Ответ принят ✓';
  form.querySelector('button').disabled = true;
});
