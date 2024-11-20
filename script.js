document.getElementById('fetch-button').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchRestaurants, handleLocationError);
    } else {
        document.getElementById("result").innerText = "브라우저에서 위치 정보를 지원하지 않습니다.";
    }
});

async function fetchRestaurants(position) {
    const apiKey = "AIzaSyAgM5OqN72VeDmuTb9hMGGf2HxdZDGkREs"; // Google Places API 키
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const radius = 2000;

    const checkboxes = document.querySelectorAll('#food-options input[type="checkbox"]:checked');
    const selectedTypes = Array.from(checkboxes).map(checkbox => checkbox.value);

    if (selectedTypes.length === 0) {
        document.getElementById("result").innerText = "음식 종류를 하나 이상 선택해주세요.";
        return;
    }

    const keyword = selectedTypes.join(',');
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${keyword}&type=restaurant&opennow=true&key=${apiKey}`;

    try {
        const response = await fetch(proxy + url);
        if (!response.ok) throw new Error(`HTTP 오류 상태: ${response.status}`);

        const data = await response.json();
        const openRestaurants = data.results;

        if (openRestaurants.length > 0) {
            const randomIndex = Math.floor(Math.random() * openRestaurants.length);
            const selectedRestaurant = openRestaurants[randomIndex];
            document.getElementById("result").innerText = `추천 음식점: ${selectedRestaurant.name} (${selectedRestaurant.vicinity})`;
        } else {
            document.getElementById("result").innerText = "현재 선택한 음식 종류의 영업 중인 음식점이 없습니다.";
        }
    } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
        document.getElementById("result").innerText = `데이터를 불러오는 중 오류가 발생했습니다: ${error.message}`;
    }
}

function handleLocationError(error) {
    const resultElement = document.getElementById("result");
    switch (error.code) {
        case error.PERMISSION_DENIED:
            resultElement.innerText = "위치 정보 제공이 거부되었습니다.";
            break;
        case error.POSITION_UNAVAILABLE:
            resultElement.innerText = "위치 정보를 사용할 수 없습니다.";
            break;
        case error.TIMEOUT:
            resultElement.innerText = "위치 정보를 가져오는 데 시간이 초과되었습니다.";
            break;
        default:
            resultElement.innerText = "알 수 없는 오류가 발생했습니다.";
            break;
    }
}
