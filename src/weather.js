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
      current_temp: 25,
      emoji: '☁',
      desc: '흐리고 후덥지근한 날씨엔, 체감 온도를 낮춰주는 통기성 좋은 소재가 정답.\n시어서커 셔츠에 버뮤다팬츠 매치로 가볍고 시원한 하루를 보내자.',
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      saveCount: 0,
      likeTotalCount: 0,
      saveTotalCount: 0
    },
    {
      dateLabel: '오늘',
      weather_tag: 'sunny',
      temp_min: 25,
      temp_max: 31,
      current_temp: 29,
      emoji: '☀',
      desc: '햇빛이 쨍쨍한 오늘, 레이스와 핑크 팬츠로 사랑스럽게.\n가디건과 볼캡으로 자외선을 막는 건 물론, 캐주얼한 포인트까지 더해보자.',
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      saveCount: 0,
      likeTotalCount: 0,
      saveTotalCount: 0
    },
    {
      dateLabel: '내일',
      weather_tag: 'rainy',
      temp_min: 23,
      temp_max: 27,
      current_temp: 24,
      emoji: '🌧',
      desc: '비 오는 날엔, 레인부츠와 러플 스커트로 실용적인 코디 완성.\n레드 탑과 도트 백을 매치해 스타일 포인트까지 확실하게 챙기자.',
      likeCount: 0,
      commentCount: 0,
      shareCount: 0,
      saveCount: 0,
      likeTotalCount: 0,
      saveTotalCount: 0
    }
  ];
}

