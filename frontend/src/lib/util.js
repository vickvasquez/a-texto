import moment from 'moment';

function padString(s = '', width = 2, fill = '0') {
  return s.toString().length >= width ? s : new Array(width + 1 - s.toString().length).join(fill) + s.toString();
}

export default (time) => {
  let duration = moment.duration(moment().diff(moment(time)));
  if (moment.isDuration(time)) {
    duration = time;
  }

  const hours = duration.hours();
  const minutes = duration.minutes();
  const seconds = duration.seconds();
  if (hours) return `${padString(hours)}:${padString(minutes)}`;

  return `${padString(minutes)}:${padString(seconds < 0 ? 0 : seconds)}`;
};
