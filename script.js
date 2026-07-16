const apiKey = '7099381ad4f14a6cb79155212261607'; 

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

const cityName = document.getElementById('city-name');
const localTime = document.getElementById('local-time');
const weatherIcon = document.getElementById('weather-icon');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');

const feelsLike = document.getElementById('feels-like');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const pressure = document.getElementById('pressure');
const visibility = document.getElementById('visibility');
const uvIndex = document.getElementById('uv-index');

async function buscarClima(cidade) {
    if (!cidade.trim()) {
        alert('Por favor, digite o nome de uma cidade antes de buscar.');
        return;
    }

    const apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(cidade)}&aqi=no&lang=pt`;

    try {
        searchBtn.textContent = 'Carregando...';
        searchBtn.disabled = true;

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error('Erro na requisição ou cidade não encontrada');
        }

        const data = await response.json();
        
        exibirDados(data);

    } catch (error) {
        console.error('Erro ao buscar dados do clima:', error);
        mostrarErro();
    } finally {
        searchBtn.textContent = 'Buscar';
        searchBtn.disabled = false;
    }
}

function exibirDados(data) {
    errorMessage.classList.add('hidden');
    weatherResult.classList.remove('hidden');

    cityName.textContent = `${data.location.name}, ${data.location.country}`;
    
    localTime.textContent = `Hora local: ${formatarDataHora(data.location.localtime)}`;
    
    temperature.textContent = `${Math.round(data.current.temp_c)}°C`;
    
    const descricaoClima = data.current.condition.text;
    condition.textContent = descricaoClima.charAt(0).toUpperCase() + descricaoClima.slice(1);

    const iconUrl = data.current.condition.icon.startsWith('http') 
        ? data.current.condition.icon 
        : `https:${data.current.condition.icon}`;
    weatherIcon.src = iconUrl;
    weatherIcon.alt = descricaoClima;

    feelsLike.textContent = `${Math.round(data.current.feelslike_c)}°C`;
    humidity.textContent = `${data.current.humidity}%`;
    windSpeed.textContent = `${data.current.wind_kph} km/h`;
    pressure.textContent = `${data.current.pressure_mb} mb`;
    visibility.textContent = `${data.current.vis_km} km`;
    uvIndex.textContent = data.current.uv;

    aplicarTemaDinamico(data.current.is_day, data.current.temp_c);
}

function mostrarErro() {
    weatherResult.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    document.body.style.backgroundColor = '#f0f4f8';
    const card = document.querySelector('.weather-card');
    card.style.background = '#ffffff';
    card.style.color = '#333';
}

function formatarDataHora(dataHoraStr) {
    const partes = dataHoraStr.split(' ');
    if (partes.length === 2) {
        const [data, hora] = partes;
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano} às ${hora}`;
    }
    return dataHoraStr;
}

function aplicarTemaDinamico(isDay, temp) {
    const card = document.querySelector('.weather-card');
    
    if (isDay === 0) {
        document.body.style.backgroundColor = '#111827';
        card.style.background = 'linear-gradient(135deg, #1f2937, #111827)';
        card.style.color = '#f3f4f6';
        
        document.querySelectorAll('.detail-item span').forEach(el => el.style.color = '#9ca3af');
        document.querySelector('.local-time').style.color = '#9ca3af';
    } else {
        if (temp >= 28) {
            document.body.style.backgroundColor = '#fef3c7';
            card.style.background = 'linear-gradient(135deg, #ffffff, #fef3c7)';
        } else if (temp <= 15) {
            document.body.style.backgroundColor = '#e0f2fe';
            card.style.background = 'linear-gradient(135deg, #ffffff, #e0f2fe)';
        } else {
            document.body.style.backgroundColor = '#f0f4f8';
            card.style.background = '#ffffff';
        }
        
        card.style.color = '#333333';
        document.querySelectorAll('.detail-item span').forEach(el => el.style.color = '#555555');
        document.querySelector('.local-time').style.color = '#666666';
    }
}

searchBtn.addEventListener('click', () => {
    buscarClima(cityInput.value);
});

cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        buscarClima(cityInput.value);
    }
});