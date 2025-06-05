const apiKey = '05b879f5eb31eba4ee115fa7084f8019'

export async function getWeatherByLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude

      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`

      try {
        const response = await fetch(apiUrl)
        const weatherData = await response.json()
        console.log('날씨 정보:', weatherData)
        resolve(weatherData)
      } catch (error) {
        console.error('날씨 API 에러:', error)
        reject(error)
      }
    }, reject)
  })
}

// 날씨 → weather_tag 매핑 함수도 여기 같이 작성
export function mapWeatherToTag(weather) {
  if (weather === 'Rain') return 'rainy'
  if (weather === 'Clear') return 'sunny'
  if (weather === 'Clouds') return 'cloudy'
  return 'hot'
}

// 가상 날씨 데이터 (서울, 어제/오늘/내일)
export function getMockWeatherData() {
  return [
    {
      dateLabel: '어제',
      weather_tag: 'cloudy',
      temp_min: 22,
      temp_max: 28,
      emoji: '☁',
      desc: '흐린 날씨엔 가벼운 셔츠와 슬랙스로 쾌적하게.'
    },
    {
      dateLabel: '오늘',
      weather_tag: 'sunny',
      temp_min: 25,
      temp_max: 31,
      emoji: '☀',
      desc: '해가 쨍쨍한 오늘, 밝은톤 시어서커 셔츠와 조리 슬리퍼로 산뜻하게.'
    },
    {
      dateLabel: '내일',
      weather_tag: 'rainy',
      temp_min: 23,
      temp_max: 27,
      emoji: '🌧',
      desc: '소나기 예보엔 가벼운 바람막이와 레인슈즈로 대비하세요.'
    }
  ];
}

