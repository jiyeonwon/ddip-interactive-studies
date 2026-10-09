(() => {
  const streams = new Set();
  let disposed = false;
  function stop() {
    disposed = true;
    for (const stream of streams) stream.getTracks().forEach(track => track.stop());
    streams.clear();
  }
  window.studyCamera = { stop };
  window.addEventListener('pagehide', stop);
  function warning(error) {
    let el = document.getElementById('warn') || document.getElementById('camera-warning');
    if (!el) {
      el = document.createElement('p');
      el.id = 'camera-warning';
      el.style.cssText = 'font:13px Arial,sans-serif;color:#2455FF;line-height:1.6';
      (document.querySelector('.container') || document.body).append(el);
    }
    el.setAttribute('role', 'alert');
    el.style.display = 'block';
    el.textContent = error.name === 'NotAllowedError'
      ? '카메라 권한이 거부되었습니다. 브라우저 사이트 설정에서 카메라를 허용한 뒤, 다른 탭으로 이동했다가 다시 열어 주세요.'
      : '카메라를 실행할 수 없습니다. 카메라 연결과 다른 앱의 사용 여부를 확인한 뒤 다시 시도해 주세요.';
    const status = document.getElementById('status');
    if (status) status.textContent = 'Camera unavailable';
    window.dispatchEvent(new Event('study-camera-error'));
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    window.addEventListener('DOMContentLoaded', () => warning(new Error('Camera unavailable')));
    return;
  }
  const original = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = async constraints => {
    try {
      const stream = await original(constraints);
      if (disposed) {
        stream.getTracks().forEach(track => track.stop());
        throw new DOMException('Study closed', 'AbortError');
      }
      streams.add(stream);
      const el = document.getElementById('camera-warning');
      if (el) el.style.display = 'none';
      return stream;
    } catch (error) {
      if (!disposed) warning(error);
      throw error;
    }
  };
})();
