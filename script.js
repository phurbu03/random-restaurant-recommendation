document.getElementById('fetch-button').addEventListener('click', () => {
    console.log('버튼 클릭됨');
    document.getElementById('result').innerText = "데이터를 불러오는 중입니다...";
    if (navigator.geolocation) {
        console.log("위치 정보 요청 중...");
        navigator.geolocation.getCurrentPosition(fetchRestaurants, handleLocationError);
    } else {
        console.log("위치 정보를 지원하지 않음");
        document.getElementById('result').innerText = "브라우저에서 위치 정보를 지원하지 않습니다.";
    }
});

async function fetchRestaurants(position) {
    console.log("fetchRestaurants 함수 실행");
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    console.log(`현재 위치: 위도(${latitude}), 경도(${longitude})`);

    const selectedFoodOption = document.querySelector('input[name="food"]:checked');
    let keyword = selectedFoodOption ? selectedFoodOption.value : '';
    if (keyword === 'none') keyword = ''; // 선택안함 처리

    console.log(`선택한 음식 종류: ${keyword || '전체'}`);

    // 프록시 서버를 통해 Google Places API 요청
    const apiUrl = `http://172.30.1.26:3000/api/places?location=${latitude},${longitude}&radius=5000&type=restaurant&opennow=true&keyword=${keyword}&key=AIzaSyAgM5OqN72VeDmuTb9hMGGf2HxdZDGkREs`;


    console.log(`API 요청 URL: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP 오류 상태: ${response.status}`);
        }
        const data = await response.json();
        console.log("API 응답 데이터:", data);

        // 결과 처리
        if (data.results && data.results.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.results.length);
            const selectedRestaurant = data.results[randomIndex];
            document.getElementById('result').innerText = `추천 음식점: ${selectedRestaurant.name}, 위치: ${selectedRestaurant.vicinity}`;
        } else {
            document.getElementById('result').innerText = "현재 영업 중인 음식점이 없습니다.";
        }
    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        document.getElementById('result').innerText = `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`;
    }
}

function handleLocationError(error) {
    console.error("위치 정보 요청 실패:", error);
    document.getElementById('result').innerText = "위치 정보를 가져올 수 없습니다.";
}
