function canSign(start, end) {
  const s = {
    h: parseInt(start.split(':')[0]),
    m: parseInt(start.split(':')[1])
  };
  const e = {
    h: parseInt(end.split(':')[0]),
    m: parseInt(end.split(':')[1])
  };
  const now = new Date();
  const n = {
    h: now.getHours(),
    m: now.getMinutes()
  };
  let result = true;
  if (n.h < s.h) {
    result = false;
  }
  if (n.h > e.h) {
    result = false;
  }
  if (n.m < s.m) {
    result = false;
  }
  if (n.m > e.m) {
    result = false;
  }
  return result;
}
