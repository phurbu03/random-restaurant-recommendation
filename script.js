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
    const apiKey = "AIzaSyAgM5OqN72VeDmuTb9hMGGf2HxdZDGkREs"; // Google Places API 키
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    console.log(`현재 위치: 위도(${latitude}), 경도(${longitude})`);

    const radius = 5000; // 반경 5km
    const selectedFoodOption = document.querySelector('input[name="food"]:checked').value;

    let keyword = "";
    if (selectedFoodOption === "korean") {
        keyword = "한식";
    } else if (selectedFoodOption === "chinese") {
        keyword = "중식";
    } else if (selectedFoodOption === "japanese") {
        keyword = "일식";
    }
    console.log(`선택한 음식 종류: ${keyword || "전체"}`);

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${keyword}&type=restaurant&opennow=true&key=${apiKey}`;
    const url = proxyUrl + apiUrl;

    console.log(`API 요청 URL: ${url}`);

    try {
        const response = await fetch(url);
        console.log(`API 응답 상태: ${response.status}`);
        const data = await response.json();
        console.log("API 응답 데이터:", data);

        const openRestaurants = data.results;
        if (openRestaurants.length > 0) {
            const randomIndex = Math.floor(Math.random() * openRestaurants.length);
            const selectedRestaurant = openRestaurants[randomIndex];
            document.getElementById("result").innerText = `추천 음식점: ${selectedRestaurant.name} (${selectedRestaurant.vicinity})`;
        } else {
            document.getElementById("result").innerText = "현재 영업 중인 음식점이 없습니다.";
        }
    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        document.getElementById("result").innerText = `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`;
    }
}

function handleLocationError(error) {
    console.error("위치 정보 오류 발생:", error);
    switch (error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById("result").innerText = "위치 정보 제공이 거부되었습니다.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById("result").innerText = "위치 정보를 사용할 수 없습니다.";
            break;
        case error.TIMEOUT:
            document.getElementById("result").innerText = "위치 정보를 가져오는 데 시간이 초과되었습니다.";
            break;
        default:
            document.getElementById("result").innerText = "알 수 없는 오류가 발생했습니다.";
            break;
    }
}
