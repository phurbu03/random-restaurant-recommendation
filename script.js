document.getElementById('fetch-button').addEventListener('click', () => {
    console.log("버튼 클릭됨");
    document.getElementById("result").innerText = "데이터를 불러오는 중입니다...";
    if (navigator.geolocation) {
        console.log("위치 정보 요청 중...");
        navigator.geolocation.getCurrentPosition(fetchRestaurants, handleLocationError);
    } else {
        console.log("위치 정보를 지원하지 않음");
        document.getElementById("result").innerText = "브라우저에서 위치 정보를 지원하지 않습니다.";
    }
});

async function fetchRestaurants(position) {
    console.log("fetchRestaurants 함수 실행");
    const apiKey = "AIzaSyAgM50qN72VeDmuTbh9MGcFzHXdZDGkREs"; // Google Places API 키
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`현재 위치: 위도(${latitude}), 경도(${longitude})`);

    const radius = 5000; // 반경 5km
    const selectedFoodOption = document.querySelector('input[name="food"]:checked').value;

    let keyword = "";
    if (selectedFoodOption !== "전체") {
        keyword = selectedFoodOption;
    }
    console.log(`선택한 음식 종류: ${selectedFoodOption}`);

    // 실제 Google API 호출 URL 설정
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=restaurant&opennow=true&keyword=${keyword}&key=${apiKey}`;
    console.log(`API 요청 URL: ${apiUrl}`);

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP 오류 상태: ${response.status}`);
        }

        const data = await response.json(); // JSON 응답 처리
        console.log("API 응답 데이터:", data);

        const openRestaurants = data.results;
        if (openRestaurants.length > 0) {
            const randomIndex = Math.floor(Math.random() * openRestaurants.length);
            const selectedRestaurant = openRestaurants[randomIndex];
            document.getElementById('result').innerText = `추천 음식점: ${selectedRestaurant.name} (${selectedRestaurant.vicinity})`;
        } else {
            document.getElementById('result').innerText = '현재 영업 중인 음식점이 없습니다.';
        }
    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        document.getElementById('result').innerText = `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`;
    }
}

function handleLocationError(error) {
    console.error("위치 정보 요청 오류:", error);
    document.getElementById("result").innerText = "위치 정보를 가져오는 중 오류가 발생했습니다.";
}
