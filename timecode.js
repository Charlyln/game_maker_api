const getTimecode = function (score) {
  const newSec = score / 60;
  var sec_num = parseInt(newSec, 10);
  var minutes = Math.floor(sec_num / 60);
  var seconds = sec_num - minutes * 60;

  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  return minutes + ':' + seconds;
};

module.exports = getTimecode;
