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
      margin-right:8px;
      display:inline-block;
    " onclick="window.open('${p.product_url}', '_blank')"></div>
  `).join('');
}

function renderWeatherInfo(data) {
  document.querySelector('.city-name').textContent = '서울시 강남구';
  document.querySelector('.temperature').textContent = `${data.temp_min}° / ${data.temp_max}°`;
  document.querySelector('.weather-icon').textContent = data.emoji;
}

function renderCoordiDesc(data) {
  document.querySelector('.coord-title').textContent = `${data.dateLabel}의 코디`;
  document.querySelector('.coord-description').textContent = data.desc;
}

const weatherDataArr = getMockWeatherData();
let currentIdx = 1;

async function renderAll(idx, animateDir = 0) {
  const data = weatherDataArr[idx];
  renderWeatherInfo(data);
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
}

window.addEventListener('DOMContentLoaded', () => {
  renderAll(currentIdx);

  document.querySelector('.arrow-btn.left').onclick = () => {
    if (currentIdx > 0) {
      currentIdx--;
      renderAll(currentIdx, -1);
    }
  };
  document.querySelector('.arrow-btn.right').onclick = () => {
    if (currentIdx < weatherDataArr.length - 1) {
      currentIdx++;
      renderAll(currentIdx, 1);
    }
  };
});