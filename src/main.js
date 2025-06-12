import './style.css';
import { supabase } from './supabaseClient.js';
import { getMockWeatherData } from './weather.js';

function getModelcutUrl(weather_tag) {
  return `https://wdrgplkigjysznbpitbn.supabase.co/storage/v1/object/public/modelcuts/${weather_tag}.jpg`;
}

// 제품 데이터 fetch (weather_tag별 최대 5개)
async function getProductsByWeatherTag(weatherTag) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('weather_tag', weatherTag)
    .limit(5);
  if (error) {
    console.error(error);
    return [];
  }
  return data.map(p => ({
    weather_tag: p.weather_tag,
    image_url: `https://wdrgplkigjysznbpitbn.supabase.co/storage/v1/object/public/product-images/${p.name_en}.jpg`,
    product_url: p.product_url
  }));
}

function renderModelcut(modelcutUrl) {
  const modelImage = document.querySelector('.model-image');
  modelImage.style.backgroundImage = `url('${modelcutUrl}')`;
  modelImage.style.backgroundSize = 'cover';
  modelImage.style.backgroundPosition = 'center';
}

function renderProducts(products) {
  const grid = document.querySelector('.product-grid');
  grid.innerHTML = products.map(p => `
    <div class="product-item" style="
      width:44px; height:66px; border-radius:6px;
      background: #eee url('${p.image_url}') center/cover no-repeat;
      cursor:pointer;
    " onclick="window.open('${p.product_url}', '_blank')"></div>
  `).join('');
}

function renderWeatherInfo(data, idx) {
  // 날짜 인덱스에 따라 영어로 표기
  const dayMap = ['Yesterday', 'Today', 'Tomorrow'];
  document.querySelector('.weather-today').textContent = dayMap[idx] || 'Today';
  document.querySelector('.city-name').textContent = '서울시 강남구';
  document.querySelector('.temperature').textContent = `${data.temp_min}° / ${data.temp_max}°`;
  document.querySelector('.weather-icon').textContent = data.emoji;
}

function renderCoordiDesc(data) {
  document.querySelector('.coord-title').textContent = `${data.dateLabel}의 코디`;
  document.querySelector('.coord-description').textContent = data.desc;
}

const weatherDataArr = getMockWeatherData();
let currentIdx = 1; // 0: 어제, 1: 오늘, 2: 내일

function updateActionButtons(idx) {
  const actionBtns = document.querySelectorAll('.action-buttons-section .action-btn');
  const data = weatherDataArr[idx];
  // 좋아요
  if (actionBtns[0]) {
    actionBtns[0].classList.toggle('like-active', data.likeActive);
    const img = actionBtns[0].querySelector('img');
    if (img) img.src = data.likeActive ? img.dataset.black : img.dataset.white;
    // 총 누른 횟수만 표시
    document.querySelector('.like-count').textContent = data.likeTotalCount;
  }
  // 댓글 카운트
  document.querySelector('.comment-count').textContent = data.commentCount;
  // 공유 카운트
  document.querySelector('.share-count').textContent = data.shareCount;
  // 저장
  if (actionBtns[3]) {
    actionBtns[3].classList.toggle('bookmark-active', data.saveActive);
    const img = actionBtns[3].querySelector('img');
    if (img) img.src = data.saveActive ? img.dataset.black : img.dataset.white;
    // 총 누른 횟수만 표시
    document.querySelector('.bookmark-count').textContent = data.saveTotalCount;
  }
}

async function renderAll(idx, animateDir = 0) {
  const data = weatherDataArr[idx];
  renderWeatherInfo(data, idx);
  renderModelcut(getModelcutUrl(data.weather_tag));
  renderCoordiDesc(data);

  const modelSection = document.querySelector('.model-section');
  if (animateDir !== 0) {
    modelSection.classList.remove('slide-left', 'slide-right');
    void modelSection.offsetWidth;
    modelSection.classList.add(animateDir === 1 ? 'slide-right' : 'slide-left');
    setTimeout(() => {
      modelSection.classList.remove('slide-left', 'slide-right');
    }, 350);
  }

  const products = await getProductsByWeatherTag(data.weather_tag);
  renderProducts(products);

  // 날짜별 좋아요/저장/댓글/공유 상태 갱신
  updateActionButtons(idx);
}

// GA4 이벤트 전송 함수 (gtag가 없으면 무시)
function sendGA4Event(eventName, params) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  } else {
    // 개발 중 콘솔 확인용
    console.log('[GA4]', eventName, params);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  // 각 날씨별로 좋아요/저장 활성화 상태 추가
  weatherDataArr.forEach(d => {
    d.likeActive = false;
    d.saveActive = false;
  });

  renderAll(currentIdx);

  // 좌측 화살표 버튼
  document.querySelector('.arrow-btn.left').onclick = () => {
    if (currentIdx > 0) {
      const prevIdx = currentIdx - 1;
      const prevData = weatherDataArr[prevIdx];
      // GA4: 좌측 화살표 클릭
      sendGA4Event('click_prevDay', { date: prevData.dateLabel });
      currentIdx = prevIdx;
      renderAll(currentIdx, -1);
    }
  };
  // 우측 화살표 버튼
  document.querySelector('.arrow-btn.right').onclick = () => {
    if (currentIdx < weatherDataArr.length - 1) {
      const nextIdx = currentIdx + 1;
      const nextData = weatherDataArr[nextIdx];
      // GA4: 우측 화살표 클릭
      sendGA4Event('click_nextDay', { date: nextData.dateLabel });
      currentIdx = nextIdx;
      renderAll(currentIdx, 1);
    }
  };

  // 날짜 버튼(page_view 수동 전송) - 예시: .weather-today 클릭 시
  const dateBtn = document.querySelector('.weather-today');
  if (dateBtn) {
    dateBtn.onclick = function() {
      const data = weatherDataArr[currentIdx];
      sendGA4Event('page_view', { date: data.dateLabel });
    };
  }

  // 제품 이미지 클릭 GA4 이벤트 연결 (동적 렌더링이므로 이벤트 위임)
  const grid = document.querySelector('.product-grid');
  if (grid) {
    grid.addEventListener('click', function(e) {
      const item = e.target.closest('.product-item');
      if (item) {
        // data-product-name, data-product-id 속성 활용(없으면 src 등에서 추출)
        const productName = item.dataset.productName || item.getAttribute('alt') || '';
        const productId = item.dataset.productId || '';
        sendGA4Event('click_productImage', {
          product_name: productName,
          product_id: productId
        });
      }
    });
  }

  // 코디 설명 아래 버튼들 GA4 이벤트 연결
  const actionBtns = document.querySelectorAll('.action-buttons-section .action-btn');
  // outfit_id는 dateLabel을 outfit_id로 사용(또는 data-outfit-id 활용)
  function getOutfitId() {
    return weatherDataArr[currentIdx].dateLabel;
  }
  // 좋아요 버튼 (첫번째)
  if (actionBtns[0]) {
    actionBtns[0].onclick = function() {
      const data = weatherDataArr[currentIdx];
      data.likeActive = !data.likeActive;
      data.likeCount += data.likeActive ? 1 : -1;
      data.likeTotalCount++;
      updateActionButtons(currentIdx);
      sendGA4Event('like_click', { outfit_id: getOutfitId() });
    };
  }
  // 댓글 버튼 (두번째)
  if (actionBtns[1]) actionBtns[1].onclick = function() {
    const data = weatherDataArr[currentIdx];
    data.commentCount++;
    updateActionButtons(currentIdx);
    alert('댓글!');
    sendGA4Event('comment_click', { outfit_id: getOutfitId() });
  };
  // 공유 버튼 (세번째)
  if (actionBtns[2]) actionBtns[2].onclick = function() {
    const data = weatherDataArr[currentIdx];
    data.shareCount++;
    updateActionButtons(currentIdx);
    alert('공유!');
    sendGA4Event('share_click', { outfit_id: getOutfitId() });
  };
  // 저장 버튼 (네번째)
  if (actionBtns[3]) {
    actionBtns[3].onclick = function() {
      const data = weatherDataArr[currentIdx];
      data.saveActive = !data.saveActive;
      data.saveCount += data.saveActive ? 1 : -1;
      data.saveTotalCount++;
      updateActionButtons(currentIdx);
      sendGA4Event('save_click', { outfit_id: getOutfitId() });
    };
  }
});